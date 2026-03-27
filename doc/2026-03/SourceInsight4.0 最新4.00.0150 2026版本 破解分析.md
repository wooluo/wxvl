#  SourceInsight4.0 最新4.00.0150 2026版本 破解分析  
原创 吾爱pojie
                        吾爱pojie  吾爱破解论坛   2026-03-27 00:48  
  
作者**论****坛账号：ZhangYixiSuccee**  
  
1、SourceInsight 软件说明  
  
版本信息：4.00.0150 2026版本  
  
**2、SourceInsight 注册机说明**  
  
按照惯例，分析一下软件基本类型，32为程序，VC程序，还带签名（看起来是RSA PKCS [#7填充算法]()  
）  
  
  
  
打开SourceInsight，进入License 激活界面，随便输入S411111111111111111111，出现如下界面  
  
  
  
接着搜索字符串，找到关键位置，首先用IDA分析看一下，点击Search Text，输入the serial number，可以搜索到关键位置  
  
  
，   
  
  
可以看到sub_51C070如何检测错误之后，会进行错误信息的打印，所以该函数会对lincense进行检测  
```
BOOL __cdecl sub_51C070(char *Str, _DWORD *a2, _DWORD *a3, _DWORD *a4, int a5)
{
  char v5; // al
  char v6; // al
  char v7; // al
  char v8; // al
  int v10; // [esp+4h] [ebp-18h] BYREF
  char Destination[20]; // [esp+8h] [ebp-14h] BYREF
&#8203;
  _strupr(Str);
  if ( strlen(Str) != 19 )
    return 0;
  if ( Str[4] != '-' )
    return 0;
  if ( Str[9] != '-' )
    return 0;
  if ( Str[14] != '-' )
    return 0;
  if ( *Str != 'S' )
    return 0;
  if ( a5 )
  {
    v5 = Str[6];
    if ( v5 != 'R' && v5 != 'G' && v5 != 'D' && v5 != 'F' )
      return 0;
  }
  v6 = Str[1];
  if ( v6 < '0' || v6 > '9' )
    return 0;
  *a4 = v6 - '0';
  v7 = Str[2];
  switch ( v7 )
  {
    case 'T':
      *a3 = 1;
      break;
    case 'B':
      *a3 = 3;
      break;
    case 'S':
      *a3 = 0;
      break;
    case 'U':
      *a3 = 0;
      break;
    default:
      return 0;
  }
  v8 = Str[3];
  if ( v8 == 'G' )
  {
    *a2 = 1;
  }
  else
  {
    if ( v8 != 'R' )
      return 0;
    *a2 = 0;
  }
  if ( !a5 )
    return 1;
  strcpy(Destination, Str);
  Destination[15] = 0;
  sub_51B7A0(Destination, 15, &unk_612298, &v10);
  return *(_DWORD *)(Str + 15) == v10;
}
```  
  
  
格式如下：- 长度为19个字符  
  
- 以S开始，5,10,15出位"-"字符，类似xxxx-xxxx-xxxx-xxxx这样的形式  
  
- 第7个字符，RGDF中字符一个  
  
- 第2个字符，> '0'，< '9'，字符  
  
- 第3个字符，TBSU字符中一个  
  
- 第4个字符，GR字符中一个  
  
所以初步格式如下：  
  
S(0-9)(T/B/S/U)(G/R)-x(RGDF)xx-xxxx-xxxx接着sub_51B7A0会对lincense进一步进行检查  
  
```
int __cdecl sub_51B7A0(_BYTE *a1, unsigned int a2, int a3, int a4)
{
  unsigned int i; // esi
  unsigned __int8 v5; // cl
  unsigned int j; // eax
  int result; // eax
&#8203;
  for ( i = 0; i < 4; *(_BYTE *)(i + a4 - 1) = byte_612178[v5 % 26] )
  {
    v5 = *(_BYTE *)((unsigned __int8)(i + *a1) + a3);
    for ( j = 1; j < a2; ++j )
      v5 = *(_BYTE *)((v5 ^ (char)a1[j]) + a3);
    result = a4;
    ++i;
  }
  return result;
}
```  
  
  
观察如上函数，- a1是字符串的前15个字符，a2=15，a3是table表，a4是最后4字节的地址  
  
- 所以该函数就是利用前15个字符，生成最后4个字符  
  
license 函数生成如下：  
```
#include <stdint.h>
&#8203;
// 外部数组声明
extern unsigned char byte_612178[];  // 实际上应该是 byte_612178，
extern unsigned char byte_612298[];  // 根据您的数据
&#8203;
// 代码中引用的 byte_612178，
// 可能是地址偏移或者重命名，这里我们使用 byte_612298
#define SBOX_SIZE 26  // 代码中使用 v5 % 26 作为索引
&#8203;
unsigned char byte_612178[] = { "KV96GMJYH7QF5TCW4U3XZPRSDN" };
&#8203;
int sub_51B7A0(unsigned char *a1, unsigned int a2, int a3, int a4)
{
    unsigned int i;
    unsigned char v5;
    unsigned int j;
    int result;
&#8203;
    // 循环4次，生成4个字节的输出
    for (i = 0; i < 4; i++)
    {
        // 初始值：从 a1[0] 和 i 计算索引，然后从 a3 指向的表中取值
        v5 = *(unsigned char *)((unsigned char)(i + *a1) + a3);

        // 内层循环：对 a1[1] 到 a1[a2-1] 进行异或操作
        for (j = 1; j < a2; j++)
        {
            v5 = *(unsigned char *)((v5 ^ a1[j]) + a3);
        }

        // 将结果通过 S-box (byte_612178) 转换后存储到 a4 指向的缓冲区
        *(unsigned char *)(i + a4 ) = byte_612178[v5 % 26];

        result = a4;  // 返回原始指针 a4
    }

    return result;
}
&#8203;
#include <stdio.h>
#include <stdint.h>
#include <string.h>
&#8203;
// 根据您提供的数组数据定义
// 注意：原始数据从 612298 开始，
unsigned char byte_612298[] = {
    0x23, 0xDD, 0x78, 0xB5, 0x33, 0x6F, 0xD4, 0xF9, 0xA6, 0xE8,
    0xCC, 0x7C, 0x9F, 0xB3, 0x22, 0xDA, 0x32, 0xDF, 0x71, 0xB7,
    0x61, 0x3D, 0x6B, 0x57, 0xD7, 0xA1, 0x34, 0x38, 0xF2, 0xE1,
    0xF3, 0xB8, 0x1A, 0x80, 0xF5, 0xFE, 0x91, 0x01, 0x3C, 0x73,
    0x93, 0x48, 0xA0, 0xE0, 0x94, 0xAA, 0x39, 0x8F, 0x58, 0xE2,
    0x31, 0x0B, 0xBB, 0xCE, 0x4C, 0xD2, 0x56, 0xC2, 0x5E, 0x27,
    0xB6, 0xFB, 0x65, 0xAE, 0x55, 0x60, 0xBD, 0x10, 0x86, 0xF7,
    0xC1, 0x88, 0x12, 0xED, 0x67, 0xC4, 0x74, 0x30, 0x1B, 0xBC,
    0x9A, 0xB0, 0xEF, 0x36, 0xC5, 0x72, 0x5B, 0x7E, 0x54, 0x2C,
    0x0F, 0xF6, 0xA9, 0x85, 0x2A, 0xB1, 0x37, 0xF1, 0x2F, 0x4E,
    0xE7, 0x6A, 0x75, 0xA8, 0x26, 0xEB, 0x3F, 0x6C, 0x69, 0x20,
    0x87, 0x62, 0x8D, 0x68, 0xA5, 0xFA, 0x3A, 0x04, 0x21, 0x1F,
    0xAC, 0x05, 0xA4, 0x76, 0x11, 0x70, 0x9E, 0x46, 0x24, 0x5D,
    0xC6, 0xE4, 0x95, 0x82, 0x1C, 0xBA, 0x59, 0x09, 0xD9, 0x44,
    0x98, 0x92, 0x07, 0xAF, 0xA7, 0x41, 0x96, 0x90, 0xB4, 0x42,
    0x63, 0x99, 0xD0, 0x4D, 0x97, 0xBE, 0x40, 0xCF, 0x84, 0xE5,
    0x1D, 0x5A, 0x0C, 0x7F, 0xC7, 0xEA, 0xEE, 0xEC, 0x00, 0xD5,
    0x49, 0x2D, 0x51, 0xAD, 0xB9, 0x89, 0x77, 0x52, 0x3E, 0x8C,
    0xE6, 0xFF, 0x15, 0xDE, 0x6D, 0x14, 0xA2, 0xCD, 0xA3, 0xD6,
    0x17, 0x81, 0xC8, 0x45, 0x4B, 0x35, 0x0A, 0x0D, 0xFC, 0x9D,
    0x16, 0x3B, 0xD3, 0x7D, 0xD1, 0xF4, 0xFD, 0xCA, 0x25, 0x06,
    0x6E, 0xF8, 0x5F, 0xBF, 0x8A, 0x7B, 0x50, 0xD8, 0x79, 0x9C,
    0xAB, 0x43, 0x53, 0xCB, 0x8E, 0x4F, 0xE3, 0xC9, 0x8B, 0xDC,
    0x5C, 0xC0, 0x1E, 0x9B, 0x18, 0x02, 0x47, 0x03, 0x2B, 0x0E,
    0x66, 0x4A, 0xB2, 0xF0, 0xE9, 0x19, 0x29, 0x7A, 0xC3, 0x08,
    0x83, 0xDB, 0x64, 0x13, 0x2E, 0x28
};
&#8203;
// 函数声明
int sub_51B7A0(unsigned char *a1, unsigned int a2, int a3, int a4);
&#8203;
// 测试函数
void main()
{

    unsigned char input[19] = {"S4SR-1R23-4567-xxxx"};  // 示例输入
    unsigned char output[4];    // 输出缓冲区 a4

    // 调用函数
    sub_51B7A0(input, 15, (int)byte_612298, (int)output);

    // 打印输出
    printf("Output: ");
    for (int i = 0; i < 4; i++)
    {
        input[15+i]=output[i];
        printf("%c \t", output[i]);
    }
    printf("\n");
    printf("%s\r\n",input);
}
```  
  
  
  
  
过掉该license函数检查下面，其实还有对上面license的补充说明，比如- 第2字符必须是4，因为这个是SourceInsight4版本，dword_6696F8为04 byte  
  
  
```
if ( *((_DWORD *)ArgList + 0x181) != HIBYTE(dword_6696F8) )
  {
    sub_40B560(
      "The serial number you entered is for a different version of Source Insight.\n"
      "\n"
      "This version requires a version 4.x serial number.",
      v7,
      v8,
      Destination[0],
      Destination[1],
      Destination[2],
      v10,
      v11,
      v12,
      v13);
    sub_406DF0(a1, 30);
    sub_404830();
    return 0;
  }
```  
  
  
  
  
接着该版本为release版本，所以该值不能为3，标准版为0  
  
```
if ( *((_DWORD *)ArgList + 0x183) == 3 )
  {
    sub_40B560(
      "The serial number cannot be used with the 'release' version of Source Insight.",
      v7,
      v8,
      Destination[0],
      Destination[1],
      Destination[2],
      v10,
      v11,
      v12,
      v13);
    sub_404830();
    return 0;
  }
```  
  
  
这里检查license的长度，以及版本情况，如果是U，会走到版本更新检查的逻辑。  
  
```
BOOL __cdecl sub_51C1A0(char *Str)
{
  return strlen(Str) == 19 && Str[2] == 'U';
}
```  
  
  
所以生成符合上面的字符串就可以过掉检查，到达如下界面联网激活，点击取消，  
  
  
  
  
临时lincense 激活，使用  
  
  
  
```
lincense如下：<!--
    Source Insight 4.x License File
&
#8203
;
    DO NOT EDIT THIS FILE. Doing so will render it unusable.
&
#8203
;
    This license was created for:
&
#8203
;
        111111111
&
#8203
;
-->
<SourceInsightLicense>
    <LicenseProperties
        ActId="Deferred"
        Serial="S4SR-1R23-4567-CQCF"
        LicensedUser="111111111"
        Organization=""
        Email=""
        Type="Standard"
        Version="4"
        MinorVersion="0"
        Date="2026-03-08"
    />
    <Signature
        Value="TsJB9VMBkOWbUTxjfnW0Iwr064zOlB29eQ4T0RvbUEMYNuQ+wIjf3don6ImpeFYlIIpv4tIxTJHJHlj6KS9yuJOqxP0WsSLZuU/uEcsDlkhhKBU0FHGCw0ZpBKASrM2BRdz7apy31dOfmXQPX0Tm6Rqvhv+/52UQe0en8vy7g6I="
    />
</SourceInsightLicense>
```  
  
  
3、 联网激活分析  
  
  
可以使用SourceInsight打开工程使用，但是临时重新启动软件就不行了，还得重新激活，所以需要过掉联网激活  
  
  
联网lincese会进行检查  
  
  
为什么联网部分以及验签检查不用IDA查看， 因为可能有花指令导致混淆了，IDA反编译失败，所以后面都调试分析  
  
联网检查完成之后，会进行本地的签名校验，联网检查，这里是以试用lincense过掉的。签名校验的流程可以以试用lincense进行跟踪，断点设置在加解密函数上面，然后持续单步跟着走，就可以走到  
  
  
  
  
然后断点可以断下来，说明到了加解密函数地方  
  
  
  
  
找到verify函数，根据加密的一般知识可以得到，这里是验证签名的地方  
  
  
  
  
单步走过之后函数返回值如下：0x1CE  
  
  
  
单步之后，这个0x7A9916函数没什么作用，返回值做了保留  
  
  
  
  
出来之后，这里会与0xC8进行比较，说明这里就是关键点，后面的je指令可以直接修改为jmp，则可以跳过签名检查。  
  
  
  
后续发现上面过了之后，还有签名检查，但是地方不一样，  
  
  
  
  
  
  
之后则校验成功  
  
  
**-官方论坛**  
  
www.52pojie.cn  
  
  
  
**👆👆👆**  
  
公众号  
**设置“星标”，**  
您  
**不会错过**  
新的消息通知  
  
如**开放注册、精华文章和周边活动**  
等公告  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/LFPriaSjBUZK0l7v6mmrudZKXzpdM1WcomgJQnibvLzBUFRSurSkmIfl0ZrDNvSy3MszKNY3XOkcuUbWp31HMjLQ/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=e9ekqttt&tp=webp#imgIndex=11 "")  
  
