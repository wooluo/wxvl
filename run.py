import os
import re
import sys
import json
import xml.etree.ElementTree as ET
import platform
import tempfile
import requests
import shutil
import subprocess
import datetime


def write_json(path, data, encoding="utf8"):
    """写入json"""
    with open(path, "w", encoding=encoding) as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


def read_json(path, default_data={}, encoding="utf8"):
    """读取json"""
    data = {}
    if os.path.exists(path):
        try:
            data = json.loads(open(path, "r", encoding=encoding).read())
        except:
            data = default_data
            write_json(path, data, encoding=encoding)

    else:
        data = default_data
        write_json(path, data, encoding=encoding)
    return data

def get_executable_path():
    '''获取可执行文件路径'''
    system = platform.system()
    if system == 'Windows':
        executable_path = './bin/wechatmp2markdown-v1.1.11_win64.exe'
    else:
        executable_path = './bin/wechatmp2markdown-v1.1.11_linux_amd64'
    # 添加执行权限
    os.chmod(executable_path, 0o755)
    # 返回可执行文件的完整路径
    return executable_path

def get_md_path(executable_path,url):
    '''获取md文件路径和工具输出'''
    temp_directory = tempfile.mkdtemp()
    command = [executable_path, url, temp_directory, '--image=url']
    output = b''
    try:
        output = subprocess.check_output(command, stderr=subprocess.STDOUT, timeout=120)
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired):
        pass
    # 查找 .md 文件
    md_path = None
    for root, _, files in os.walk(temp_directory):
        for file in files:
            if file.endswith(".md"):
                md_path = os.path.join(root, file)
                break
        if md_path:
            break
    # 返回文件路径和工具输出
    yield md_path, output

def get_chainreactors_url():
    '''chainreactors/picker 已停止更新，返回空列表'''
    # 该仓库的 today.md 停留在 2025-10-22，不再使用
    return []

def get_BruceFeIix_url():
    '''获取今日url和标题 - 使用新的 today.md 格式'''
    base_url = 'https://raw.githubusercontent.com/BruceFeIix/picker/refs/heads/master/today.md'
    try:
        response = requests.get(base_url, timeout=30)
        if response.status_code != 200:
            return {}
        # 提取 [标题](URL) 格式
        pattern = r'\[([^\]]+)\]\((https://mp\.weixin\.qq\.com/s\?[^)]+)\)'
        matches = re.findall(pattern, response.text)
        # 返回 {url: title} 字典
        return {url: title for title, url in matches}
    except:
        return {}

import xml.etree.ElementTree as ET

def get_doonsec_url():
    '''从 Doonsec RSS 获取今日URL和标题，使用 XML 解析'''
    cookies = {
        'UM_follow': 'True',
        'UM_distinctids': 'fgmr',
        'session': 'eyJfcGVybWFuZW50Ijp0cnVlLCJjc3JmX3Rva2VuIjoiMzU2ZDE4OTcwZjliZDljY2NjN2M3YzlkMzRhOGVlZWQyZDk1NmI1ZSIsInZpc3RvciI6ImZHTXJGQXBlVndRUnZrWjJHdWplV2gifQ.ZzidRw.GyjS15N12JYU0TByO31rrwBIiPY',
    }

    headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'priority': 'u=0, i',
        'sec-ch-ua': '"Chromium";v="130", "Microsoft Edge";v="130", "Not?A_Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
    }

    try:
        response = requests.get('https://wechat.doonsec.com/rss.xml', cookies=cookies, headers=headers)
        response.encoding = response.apparent_encoding

        # XML 解析，返回 {url: title} 字典
        root = ET.fromstring(response.text)
        url_title_map = {}
        for item in root.findall('./channel/item'):
            title = item.findtext('title') or ''
            link = item.findtext('link') or ''
            if re.search(r'(复现|漏洞|CVE-\d+|CNVD-\d+|CNNVD-\d+|XVE-\d+|QVD-\d+|POC|EXP|0day|1day|nday|RCE|代码执行|命令执行)', title, re.I) and link.startswith('https://mp.weixin.qq.com/'):
                url_title_map[link.rstrip(')')] = title

        return url_title_map
    except Exception as e:
        print("Error parsing Doonsec RSS:", e)
        return {}


def get_issue_url():
    file = '/tmp/issue_content.txt'
    if os.path.exists(file):
        content = open(file,'r',encoding='utf8').read()
        urls = re.findall('(https://mp.weixin.qq.com/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*]|(?:%[0-9a-fA-F][0-9a-fA-F]))+)',content,re.I)
        urls = [url.rstrip(')') for url in urls]
        return urls
    return []
    
def rep_filename(result_path):
    ''' 
    替换不能用于文件名的字符
    '''
    for root, _, files in os.walk(result_path):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                new_file = re.sub(r'[\/\\\:\*\?\"\<\>\|]', '', file)
                shutil.move(os.path.join(root, file), os.path.join(root, new_file))
                
def main():
    '''主函数'''
    data_file = 'data.json'
    data = {}
    executable_path = get_executable_path()
    base_result_path = 'doc'
    # 创建基于当前年月的子目录 (格式: YYYY-MM)
    current_month = datetime.datetime.now().strftime("%Y-%m")
    result_path = os.path.join(base_result_path, current_month)
    os.makedirs(result_path, exist_ok=True)
    # 读取历史记录
    data = read_json(data_file, default_data=data)
    if len(sys.argv) == 2:
        if sys.argv[1] == 'today':
            # 合并所有数据源的 {url: title} 字典
            bruce_data = get_BruceFeIix_url()
            doonsec_data = get_doonsec_url()
            url_title_map = {**bruce_data, **doonsec_data}
            urls = list(url_title_map.keys())
        else:
            url_title_map = {}
            urls = get_issue_url()
        new_count = 0
        for url in urls:
            if url in data:
                continue
            # 获取标题（优先从数据源，其次从工具输出或文件内容）
            title_from_source = url_title_map.get(url, '')
            for file_path, tool_output in get_md_path(executable_path, url):
                if not file_path:
                    continue
                name = os.path.splitext(os.path.basename(file_path))[0]
                # 如果文件名是空的或只是 .md，尝试提取标题
                if not name or name == '.md':
                    title_found = False
                    # 优先使用数据源提供的标题
                    if title_from_source:
                        title = title_from_source.strip()
                        title = re.sub(r'[\/\\\:\*\?\"\<\>\|]', '', title)
                        if title:
                            name = title
                            title_found = True
                    # 如果数据源没有标题，尝试从工具输出中提取
                    if not title_found:
                        try:
                            output_str = tool_output.decode('utf-8', errors='ignore')
                            # 查找 "title:" 格式的输出
                            title_match = re.search(r'title:\s*(.+?)(?:\n|$)', output_str, re.I)
                            if title_match:
                                title = title_match.group(1).strip()
                                title = re.sub(r'[\/\\\:\*\?\"\<\>\|]', '', title)
                                if title:
                                    name = title
                                    title_found = True
                        except:
                            pass
                    # 如果工具输出中没有标题，从文件内容中提取
                    if not title_found:
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                # 读取前20行，找到第一个有实际内容的标题行
                                for _ in range(20):
                                    line = f.readline()
                                    if not line:
                                        break
                                    line = line.strip()
                                    if line and line.startswith('#'):
                                        title = line.lstrip('#').strip()
                                        # 清理标题中不能用于文件名的字符
                                        title = re.sub(r'[\/\\\:\*\?\"\<\>\|]', '', title)
                                        if title and title not in ['#', '##', '###']:
                                            name = title
                                            title_found = True
                                            break
                        except:
                            pass
                    # 如果还是没有名字，使用 MD5
                    if not title_found or not name or name == '.md':
                        import hashlib
                        name = hashlib.md5(url.encode()).hexdigest()[:12]
                # 使用新的文件名复制文件
                target_file = os.path.join(result_path, name + '.md')
                shutil.copy2(file_path, target_file)
                data[url] = name
                write_json(data_file,data)
                print(name,end='、')
if __name__ == '__main__':
    main()
