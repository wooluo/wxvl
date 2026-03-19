import { readdir, stat, readFile } from 'fs/promises';
import { join, resolve, normalize } from 'path';
import { marked } from 'marked'; // 用于渲染Markdown为HTML
import hljs from 'highlight.js'; // 用于代码高亮

// 配置Markdown渲染（支持代码高亮）
marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
});

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    // 1. 解析请求路径（去除多余前缀，根路径默认/）
    const url = new URL(req.url);
    let requestPath = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '') + '/';
    // 2. 仓库中doc目录的绝对路径（核心：指向你的wxvl/doc）
    const baseDir = resolve(process.cwd(), 'wxvl/doc');
    // 3. 解析请求路径 + 处理../遍历符
    const targetPath = normalize(join(baseDir, requestPath));

    // 安全提示：模拟漏洞时注释以下校验，公网部署建议保留
    // if (!targetPath.startsWith(baseDir)) {
    //   return new Response('非法路径访问', { status: 403 });
    // }

    // 4. 判断目标是目录还是文件
    const stats = await stat(targetPath);
    
    // 场景A：目标是目录 → 渲染目录列表
    if (stats.isDirectory()) {
      const files = await readdir(targetPath);
      // 过滤隐藏文件，按名称排序
      const filteredFiles = files.filter(file => !file.startsWith('.')).sort();
      
      // 组装目录列表HTML（区分目录/文件，添加跳转链接）
      const fileList = filteredFiles.map(async (file) => {
        const fileStat = await stat(join(targetPath, file));
        const fileUrl = join(requestPath, file);
        // 目录后缀加/，文件直接链接
        const linkPath = fileStat.isDirectory() ? `${fileUrl}/` : fileUrl;
        const typeIcon = fileStat.isDirectory() ? '📁' : '📄';
        return `<li><a href="${linkPath}">${typeIcon} ${file}</a></li>`;
      });
      
      // 等待所有文件状态解析完成
      const renderedList = await Promise.all(fileList);
      
      // 返回目录遍历页面
      return new Response(`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <title>目录遍历 - ${requestPath}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; border-bottom: 2px solid #0078ff; padding-bottom: 10px; }
            ul { list-style: none; padding: 0; margin: 20px 0; }
            li { padding: 8px 0; border-bottom: 1px solid #eee; }
            a { color: #0078ff; text-decoration: none; font-size: 16px; }
            a:hover { text-decoration: underline; }
            .back { margin-top: 20px; padding: 8px 16px; background: #0078ff; color: white; border-radius: 4px; display: inline-block; }
            .tip { color: #ff4444; font-size: 14px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>当前目录：${requestPath}</h1>
            <h3>文件/目录列表：</h3>
            <ul>${renderedList.join('')}</ul>
            ${requestPath !== '/' ? `<a href="../" class="back">← 返回上一级</a>` : ''}
            <p class="tip">⚠️ 模拟目录遍历漏洞：支持 ../ 穿透（例：/2025-06/../../ 回到根目录）</p>
          </div>
        </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // 场景B：目标是文件 → 渲染文件内容（优先Markdown）
    else {
      const fileContent = await readFile(targetPath, 'utf8');
      // 判断是否为Markdown文件，是的话渲染为HTML，否则返回原文本
      if (targetPath.endsWith('.md')) {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="zh-CN">
          <head>
            <meta charset="UTF-8">
            <title>${requestPath.split('/').pop()}</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 40px; background: #f5f5f5; }
              .markdown { max-width: 1000px; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              pre { background: #1e1e1e; padding: 16px; border-radius: 4px; overflow-x: auto; }
              code { font-family: Consolas, Monaco, monospace; }
              .back { margin-bottom: 20px; padding: 8px 16px; background: #0078ff; color: white; border-radius: 4px; display: inline-block; text-decoration: none; }
            </style>
          </head>
          <body>
            <a href="../" class="back">← 返回目录</a>
            <div class="markdown">${marked.parse(fileContent)}</div>
          </body>
          </html>
        `;
        return new Response(htmlContent, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      } else {
        // 非Markdown文件返回原内容（如txt、js等）
        return new Response(fileContent, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
    }
  } catch (error) {
    // 处理404或其他错误
    return new Response(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <title>404 - 路径不存在</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          a { color: #0078ff; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404</h1>
          <p>请求的路径不存在：${new URL(req.url).pathname}</p>
          <p>错误信息：${error.message}</p>
          <p><a href="/">← 返回根目录</a></p>
        </div>
      </body>
      </html>
    `, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
}
