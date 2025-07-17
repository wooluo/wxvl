#  虽然是误报但也可以学习一下，curl OpenSSL提供程序处理中的栈缓冲区溢出漏洞分析  
原创 qife  网络安全技术点滴分享   2025-07-17 00:36  
  
## 您好curl团队， 我在curl的OpenSSL提供程序处理代码中发现了一个栈缓冲区溢出漏洞。该漏洞位于lib/vtls/openssl.c文件的ossl_set_provider()函数中。当传入的提供程序名称长度超过MAX_PROVIDER_LEN时，该函数会将其复制到固定大小的缓冲区中而没有进行适当的长度检查，导致栈溢出。  
## 漏洞位置  
  
缓冲区溢出发生在lib/vtls/openssl.c文件的2003-2004行：  
```
memcpy(name, curlx_str(&prov), curlx_strlen(&prov));
name[curlx_strlen(&prov)] = 0;
```  
## 代码分析  
  
在研究curl的SSL引擎处理时，我注意到提供程序设置中存在异常情况。以下是具体分析：  
  
ossl_set_provider()函数定义了一个固定缓冲区：  
```
char name[MAX_PROVIDER_LEN + 1];  // 第1986行
```  
  
其中MAX_PROVIDER_LEN定义为128（同文件第1974行）  
  
随后在函数中（2003-2004行），它从提供程序字符串复制数据：  
```
memcpy(name, curlx_str(&prov), curlx_strlen(&prov));
name[curlx_strlen(&prov)] = 0;
```  
  
问题在于没有检查curlx_strlen(&prov)是否小于或等于MAX_PROVIDER_LEN。如果我们提供超过128字节的字符串，就会导致基于栈的缓冲区溢出。  
  
另外注意name[curlx_strlen(&prov)] = 0;这行代码，当发生溢出时会在缓冲区末尾之外写入一个空字节。  
## 复现漏洞  
  
我尝试找到触发此问题的方法。代码路径是：  
1. lib/vtls/openssl.c中的ossl_set_engine()调用ossl_set_provider()  
  
1. Curl_ssl_set_engine()调用ossl_set_engine()  
  
1. CURLOPT_SSLENGINE选项触发Curl_ssl_set_engine()  
  
我无法直接通过curl命令行触发崩溃，因为它会在到达漏洞代码前因"SSL Engine not found"错误而停止。  
## 概念验证  
  
我创建了一个最小化的PoC来复现确切的漏洞代码模式：  
```
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 与curl代码相同
#define MAX_PROVIDER_LEN 128

typedef struct {
    char *data;
    size_t len;
} Curl_str;

// 模拟curl的函数
char *curlx_str(Curl_str *s) {
    return s->data;
}

size_t curlx_strlen(Curl_str *s) {
    return s->len;
}

// 重现漏洞函数
void simulate_curl_provider_vulnerability(const char *iname) {
    char name[MAX_PROVIDER_LEN + 1];  // 与curl相同的缓冲区大小
    Curl_str prov;

    printf("[+] Input: %s\n", iname);

    // 设置提供程序字符串
    prov.data = (char *)iname;
    prov.len = strlen(iname);

    printf("[+] Provider length: %zu\n", prov.len);
    printf("[+] Buffer size: %zu\n", sizeof(name));

    // 漏洞部分 - 与curl源代码完全相同
    memcpy(name, curlx_str(&prov), curlx_strlen(&prov));
    name[curlx_strlen(&prov)] = 0;

    printf("[+] Done\n");
}

int main(void) {
    char *overflow_string = malloc(300);

    // 创建长的提供程序名称来触发溢出
    strcpy(overflow_string, "pkcs11:");
    for(int i = 0; i < 200; i++) {
        strcat(overflow_string, "A");
    }

    // 调用漏洞函数
    simulate_curl_provider_vulnerability(overflow_string);

    free(overflow_string);
    return 0;
}
```  
  
使用AddressSanitizer编译并运行：  
```
gcc -g -fsanitize=address -o poc poc.c
./poc
```  
  
它清楚地显示了栈缓冲区溢出。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/meR9vVNE20icYfvI0WNSmPG0882IGgHiaI9skrnhgmTgu5VO6vzEvBKrMcVejGgyKheV5ED6V5P5K2ffJSM31fpw/640?wx_fmt=png&from=appmsg "")  
  
## 补充说明  
  
我尝试直接使用curl命令行工具触发此漏洞但没有成功，因为curl在到达漏洞代码前返回了"SSL Engine not found"错误。然而，漏洞代码确实存在于curl源代码中，并通过我的PoC得到确认。  
  
如果需要，我可以提供更详细的GDB分析。  
## 影响  
  
此漏洞允许用可控内容覆盖栈内存。在特定上下文中可能导致：  
- 远程代码执行  
  
- 拒绝服务  
  
- 信息泄露  
  
严重程度取决于此代码在应用程序中的使用方式。如果攻击者可以控制提供程序名称输入，则最为危险。  
## 后续讨论  
  
经过curl团队指出，ossl_set_provider()函数中确实包含了一个长度检查的curlx_str_until()调用，这在实际代码中防止了缓冲区溢出的发生。报告者承认这是一个分析疏忽，并为此道歉。  
  
最终确认该漏洞报告为误报，因为实际代码中包含了防止溢出的长度检查机制。  
  
  
  
