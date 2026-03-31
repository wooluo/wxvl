#  【零基础可复现】2026 春节 Android 中级题（Java→so→unidbg 全流程）  
原创 吾爱pojie
                        吾爱pojie  吾爱破解论坛   2026-03-31 10:17  
  
作者**论****坛账号：破解小白：）**  
## 哈基米吾爱破解2026南北绿豆？？？！！！（零基础完整版）  
> PS：  
> 阅读时间约93min。本教程不是一篇传统意义上的write_up，而是面向完全零基础读者的教程。借助ida-mcp进行了部分静态分析，借助大模型进行了markdown排版与部分代码注释，核心内容为手动撰写。不要觉得代码太长就跳过去了，我都做了详细注释的>_<可以随时参考正己老师的详细教程吾爱破解安卓逆向入门教程《安卓逆向这档事》Java与native部分章末均附有详细流程图，大家可以先看这一部分  
  
### 0. 开始之前：你需要准备什么  
#### 0.1 需要的工具（按使用顺序）  
<table><thead><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">工具</span></section></th><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">用途</span></section></th><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">下载地址</span></section></th><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">必需性</span></section></th></tr></thead><tbody><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><strong style="overflow-wrap: break-word;font-weight: 700;"><span leaf="">7-Zip</span></strong></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">解压 APK（APK 本质是 ZIP）</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">https://www.7-zip.org/</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">可选</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);background-color: rgb(246, 248, 250);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><strong style="overflow-wrap: break-word;font-weight: 700;"><span leaf="">JADX-GUI</span></strong></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">查看 Java 代码</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">https://github.com/skylot/jadx/releases</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">必需</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><strong style="overflow-wrap: break-word;font-weight: 700;"><span leaf="">IDA Pro</span></strong></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">查看 native 代码（so 文件）</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">https://down.52pojie.cn/Tools/Disassemblers/</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">必需</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);background-color: rgb(246, 248, 250);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><strong style="overflow-wrap: break-word;font-weight: 700;"><span leaf="">Java 17+</span></strong></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">运行 unidbg</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">https://adoptium.net/</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">必需</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><strong style="overflow-wrap: break-word;font-weight: 700;"><span leaf="">Maven</span></strong></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">构建 Java 项目</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">https://maven.apache.org/download.cgi</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">必需</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);background-color: rgb(246, 248, 250);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><strong style="overflow-wrap: break-word;font-weight: 700;"><span leaf="">Python 3.8+</span></strong></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">运行自动化脚本</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">https://www.python.org/downloads/</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">必需</span></section></td></tr></tbody></table>#### 0.2 工具安装检查清单  
  
在开始之前，在命令行（PowerShell 或 CMD）里运行这些命令，确保都能正常输出版本号：  
```
# 检查 Java（应该显示 17 或更高版本）
java -version

# 检查 Maven（应该显示 3.6 或更高版本）
mvn -version

# 检查 Python（应该显示 3.8 或更高版本）
python --version
```  
  
我的环境：  
  
  
如果任何一个命令报错"找不到命令"，请先安装对应工具并配置环境变量，详细安装步骤这里不再赘述。  
  
### 1. 第一步：解压 APK，看看里面有什么  
#### 1.1 为什么要解压 APK  
  
APK 文件本质上是一个 ZIP 压缩包，里面包含：  
- **Java 代码**  
（编译后的 .dex  
 文件）  
  
- **Native 代码**  
（.so  
 文件，通常在 lib/  
 目录）  
  
- **资源文件**  
（图片、配置、数据包等，在 assets/  
 或 res/  
 目录）  
  
我们需要先把它解压，才能用工具分析这些文件。  
#### 1.2 具体操作步骤  
1. **找到 APK 文件**  
假设你的 APK 文件名是 app.apk  
，放在桌面上。  
  
1. **右键点击 APK 文件**  
选择 7-Zip → 解压到 "app\"  
（注意：不是"解压到当前文件夹"，那样会把文件散落一地）。  
  
1. **解压完成后，你会看到一个新文件夹 app/**  
进入这个文件夹，你应该看到这样的结构：  
  
```
app/
├── AndroidManifest.xml    # 应用配置文件
├── classes.dex            # Java 代码（编译后）
├── lib/                   # Native 库目录
│   ├── arm64-v8a/         # 64 位 ARM 架构
│   │   └── libhajimi.so   # 我们要分析的 native 库
│   └── armeabi-v7a/       # 32 位 ARM 架构（本题不用）
├── assets/                # 资源文件目录
│   └── hjm_pack.bin       # 关键数据包（后面会用到）
└── res/                   # 其他资源（图片、布局等）
```  
- **记住这个文件夹的路径**  
例如：C:\Users\你的用户名\Desktop\app\  
后面会频繁用到这个路径。  
  
### 2. 第二步：用 JADX 看 Java 层代码  
#### 2.1 为什么先看 Java 层  
  
在 Android 应用里，Java 层负责：  
- **界面逻辑**  
（按钮点击、文本输入）  
  
- **流程控制**  
（什么时候调用 native 函数）  
  
- **参数准备**  
（把用户输入传给 native）  
  
如果你直接去看 native 代码（so 文件），你会不知道：  
- 这个函数什么时候被调用  
  
- 参数从哪里来  
  
- 返回值给了谁  
  
所以正确顺序是：**先看 Java 层找到调用链，再去 native 层看具体实现**  
。  
#### 2.2 打开 JADX-GUI 并加载 APK  
1. **下载 JADX**  
从 https://github.com/skylot/jadx/releases 下载最新版的 jadx-gui-x.x.x.with-jre-win.zip  
。  
  
1. **解压并运行**  
解压后，双击 jadx-gui-x.x.x.exe  
（Windows）。  
  
1. **在 JADX 加载 APK**  
在 JADX 窗口里，点击 File → Open files...  
，选择 app.apk  
。或者直接把 app.apk  
 从文件资源管理器拖到 JADX 窗口里。  
  
1. **反编译结果**  
可以在左侧窗口清晰看到apk的包结构。  
  
#### 2.3 分析策略：双管齐下  
  
拿到一个安卓逆向题目，分析 Java 层有两个经典的入手点，可以**同时进行**  
：  
1. **查看 MainActivity**  
：从应用入口顺着代码往下走，了解整体架构。  
  
1. **全局搜索关键字符串**  
：直接搜索界面上可见的文字（比如"验证"），精准定位到关键代码。  
  
这两条路最终会汇合到同一个地方——flag 的验证逻辑。  
> **补充知识**  
：这道题使用的是 **Jetpack Compose**  
 框架（而非传统的 XML 布局）来构建 UI。反编译 Compose 代码时会看到大量无意义的字母（如 C0712u  
、F0.b  
），这是正常现象。Compose 编译器为了节省内存，会把相似的 UI 组件合并到同一个类里，用 switch  
 语句区分——后面你会反复看到这种模式。  
  
#### 2.4 路线一：从 MainActivity 入手  
##### 如何在 JADX 里找到 MainActivity？  
1. **在 JADX 左侧的包列表里，展开应用包名**  
本题的包名是 com.zj.wuaipojie2026_2  
（你可以在 AndroidManifest.xml  
 里确认，通常有 LAUNCHER  
 标记）。  
  
1. **找到 MainActivity 类**  
点开左侧列表的源代码标签，路径是：com.zj.wuaipojie2026_2 → MainActivity  
  
1. **双击打开，查看 onCreate 方法**  
##### 原始代码片段截图  
  
  
##### MainActivity.onCreate 完整代码（带注释）  
```
package com.zj.wuaipojie2026_2;

import A.e;
import Q0.AbstractC0080d;
import a.AbstractC0154a;
import android.content.res.Resources;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import androidx.activity.l;  // l 是混淆后的类名，实际是 ComponentActivity
import androidx.compose.ui.platform.C0204f0;

publicfinalclassMainActivityextendsl {

    @Override
    publicfinalvoidonCreate(Bundle bundle) {
        super.onCreate(bundle);

        // 【前面这一大段都是在设置系统窗口、状态栏、沉浸式背景等，不用管】
        inti2= m.f1921a;
        Aa2= A.f1870j;
        Bb2=newB(0, 0, a2);
        Bb3=newB(m.f1921a, m.f1922b, a2);
        ViewdecorView= getWindow().getDecorView();
        // ... 窗口配置代码省略 ...

        // ★【关键点 1】准备主界面的 UI 内容
        // AbstractC0080d.f1133b 就是整个 App 主界面的入口！
        eeVar= AbstractC0080d.f1133b;

        // 中间这段是在寻找或创建一个叫做 ComposeView 的容器
        C0204f0c0204f02=newC0204f0(this);
        c0204f02.setParentCompositionContext(null);

        // ★【关键点 2】把界面内容塞进容器里
        c0204f02.setContent(eVar);

        // ... 绑定生命周期 ...

        // ★【关键点 3】将容器设置为当前 Activity 的主视图
        setContentView(c0204f02, AbstractC0154a.f1861a);
    }
}
```  
  
**这段代码告诉我们什么？**  
- **MainActivity 只是一个空壳**  
，它真正的界面逻辑都藏在 AbstractC0080d.f1133b  
 这个变量背后。  
  
- 这是典型的 **Jetpack Compose**  
 架构：用代码"画"界面，而不是用 XML 布局文件。  
  
- 顺着 AbstractC0080d.f1133b  
 往下追，可以找到完整的 UI 逻辑。但 Compose 的反编译代码层层套娃、极度混淆，正向追踪效率不高。  
  
> 所以我们换一个更高效的方式——**直接搜索界面上可见的字符串**  
。  
  
#### 2.5 路线二：搜索"验证"字符串，定位按钮代码  
##### 为什么搜字符串？  
  
你在 App 界面上能看到的文字（比如"验证 flag"、"验证"、"FLAG{...}"），大概率会以字符串常量的形式存在于代码中。搜到它们，就能**瞬间定位**  
到对应的代码位置。  
  
  
  
在这道题目中，我们搜索“验证”字符串，因为它与按钮绑定，而按钮事件往往绑定着验证flag的核心逻辑。  
  
##### 具体操作  
1. **在 JADX 中按 Ctrl + Shift + F 打开全局文本搜索**  
（也可以点击 Navigation → Text Search  
）  
  
1. **输入 验证，回车搜索**  
1. **在搜索结果中，找到 Q0.C0077a 类**  
，双击跳转  
  
##### C0077a 完整代码（带注释）  
```
package Q0;

import androidx.compose.material3.F0;
import t.AbstractC0713v;
import t.C0681X;
import t.C0712u;

publicfinalclassC0077aextendsf1.i implementse1.f {

    // ★ 静态变量：预先创建好的 UI "零件"
    // 构造参数 (3, 0) 中的第二个数字，就是后面 switch 的分支编号
    publicstaticfinalC0077af1120k=newC0077a(3, 0);  // → case 0："验证"
    publicstaticfinalC0077af1121l=newC0077a(3, 1);  // → default："取消"

    // 这个变量保存了构造时传入的第二个数字，决定走哪个 switch 分支
    publicfinalint f1122j;

    publicC0077a(int i2, int i3) {
        super(i2);
        this.f1122j = i3;  // ★ 保存分支编号
    }

    @Override
    publicfinal Object J(Object obj, Object obj2, Object obj3) {
        S0.kkVar= S0.k.f1286a;
        // ★ 根据 f1122j 决定画哪个按钮文字
        switch (this.f1122j) {
            case0:
                C0712uc0712u= (C0712u) obj2;
                intiIntValue= ((Number) obj3).intValue();
                f1.h.e((l.N) obj, "$this$TextButton");
                if ((iIntValue & 81) == 16 && c0712u.A()) {
                    c0712u.T(); // Compose 内部刷新逻辑，忽略
                } else {
                    C0681Xc0681x= AbstractC0713v.f6691a;
                    // ★★★ 在屏幕上画出 "验证" 两个字！
                    F0.b("验证", null, 0L, 0L, null, null, null, 0L,
                         null, null, 0L, 0, false, 0, 0, null, null,
                         c0712u, 6, 0, 131070);
                }
                break;
            default:
                C0712uc0712u2= (C0712u) obj2;
                intiIntValue2= ((Number) obj3).intValue();
                f1.h.e((l.N) obj, "$this$TextButton");
                if ((iIntValue2 & 81) == 16 && c0712u2.A()) {
                    c0712u2.T();
                } else {
                    C0681Xc0681x2= AbstractC0713v.f6691a;
                    // ★ 画出 "取消" 两个字
                    F0.b("取消", null, 0L, 0L, null, null, null, 0L,
                         null, null, 0L, 0, false, 0, 0, null, null,
                         c0712u2, 6, 0, 131070);
                }
                break;
        }
        return kVar;
    }
}
```  
  
**这段代码背后的原理是什么？**  
  
这是 Compose 编译器的典型行为：它把"验证"按钮和"取消"按钮的**文字绘制逻辑**  
合并到了同一个类里，用 switch  
 分支区分。创建对象时传入的数字（0  
 或 1  
）保存在 f1122j  
 里，执行 J()  
 方法时就根据这个数字决定画哪个文字。  
- f1120k  
（构造参数 0  
）→ case 0  
 → 画 **"验证"**  
  
- f1121l  
（构造参数 1  
）→ default  
 → 画 **"取消"**  
  
> 但注意：这个类只负责**画文字**  
，不负责处理点击事件。我们需要用**交叉引用**  
功能追踪谁使用了这些零件。  
  
#### 2.6 交叉引用追踪：从按钮文字到点击事件  
  
在 JADX 中，选中 f1120k  
，按 **X 键**  
（查找交叉引用 / Find Usage），然后逐级往上追踪。在 Compose 逆向中，这种"套娃式"追踪非常常见。  
##### 第一跳：AbstractC0079c（零件包装层）  
```
package Q0;

publicabstractclassAbstractC0079c {
    // 把 "验证" 按钮文字零件 (f1120k) 打包成标准 Compose 组件
    publicstaticfinal A.ef1128a= R.c.n(-1658915235, false, C0077a.f1120k);
    // 把 "取消" 按钮文字零件 (f1121l) 打包
    publicstaticfinal A.ef1129b= R.c.n(-307530017, false, C0077a.f1121l);
    // 把 "验证 flag" 标题零件打包
    publicstaticfinal A.ef1130c= R.c.n(1079854244, false, C0078b.f1123k);
    // 把 "FLAG{...}" 输入框占位符零件打包
    publicstaticfinal A.ef1131d= R.c.n(1253103359, false, C0078b.f1124l);
}
```  
  
这是 Compose 的"中间包装层"——把裸零件套上标准接口，方便传递。R.c.n()  
 中的整数参数是组件的唯一 ID，系统刷新界面时靠它来快速识别。  
##### 第二跳：Q0.C（验证按钮总装）  
  
继续对 f1128a  
 按 X  
 键查找交叉引用，找到调用它的地方：  
```
package Q0;

import android.content.Context;
import t.C0712u;
import t.InterfaceC0680W;

publicfinalclassCextendsf1.i implementse1.e {

    // 构造函数接收了大量"状态水桶"（Compose 的 MutableState）
    publicfinal InterfaceC0603z f1040j;  // 协程作用域
    publicfinal InterfaceC0680W f1041k;  // 用户输入文本
    publicfinal InterfaceC0680W f1042l;  // 提示信息
    publicfinal InterfaceC0680W f1043m;  // 加载状态
    publicfinal InterfaceC0680W f1044n;  // pack 数据
    publicfinal Context f1045o;           // 上下文
    publicfinal InterfaceC0680W f1046p;  // 其他状态
    publicfinal InterfaceC0680W f1047q;  // 其他状态

    // ... 构造函数省略 ...

    @Override
    publicfinal Object N(Object obj, Object obj2) {
        C0712uc0712u= (C0712u) obj;
        if ((((Number) obj2).intValue() & 11) == 2 && c0712u.A()) {
            c0712u.T(); // Compose 刷新逻辑，忽略
        } else {
            // ★★★ 组装"验证"按钮
            // E.c 就是 Compose 的 TextButton 组件
            // 参数 1：new B(...) 是按钮的 onClick 点击事件！
            // 最后的 AbstractC0079c.f1128a 是按钮上显示的文字（"验证"）
            androidx.compose.material3.E.c(
                newB(this.f1040j, this.f1041k, this.f1042l, this.f1043m,
                      this.f1044n, this.f1045o, this.f1046p, this.f1047q),
                null, false, null, null, null, null, null, null,
                AbstractC0079c.f1128a,  // ← "验证" 文字，这个地方调用了我们之前的零件
                c0712u, 805306368, 510);
        }
        return S0.k.f1286a;
    }
}
```  
  
**找到了！**  
 在 Compose 中，TextButton  
 的第一个参数就是 onClick  
 回调。这里的 new B(...)  
 就是点击"验证"按钮后执行的逻辑。下一步去看 Q0.B  
。  
#### 2.7 "验证"按钮的点击事件：Q0.B  
  
打开 Q0 包下的 B  
 类：  
```
package Q0;

import android.content.Context;
import java.util.List;
import o1.InterfaceC0603z;
import t.InterfaceC0680W;

publicfinalclassBextendsf1.i implementse1.a {

    publicfinal InterfaceC0603z f1032j;   // 协程作用域
    publicfinal InterfaceC0680W f1033k;   // ★ 用户输入的文本（状态水桶）
    publicfinal InterfaceC0680W f1034l;   // ★ 提示信息
    publicfinal InterfaceC0680W f1035m;   // 加载状态
    publicfinal InterfaceC0680W f1036n;   // pack 数据
    publicfinal Context f1037o;           // 上下文
    publicfinal InterfaceC0680W f1038p;   // 其他状态
    publicfinal InterfaceC0680W f1039q;   // 其他状态

    // ... 构造函数省略 ...

    @Override
    publicfinal Object o() {
        Listlist= N.f1106a;  // 全局配置，忽略

        // ★ 第一步：检查输入是否为空
        // this.f1033k.getValue() 从"水桶"里取出用户输入的 FLAG 文本
        // n1.k.c0 是 Kotlin 的 isBlank() 方法
        booleanzC0= n1.k.c0((String) this.f1033k.getValue());

        InterfaceC0680WinterfaceC0680W=this.f1034l;  // 提示信息的水桶

        if (zC0) {
            // ★ 如果没输入内容，直接提示
            interfaceC0680W.setValue("请先输入 flag");
        } else {
            // ★ 如果有输入，开始验证流程

            // 禁用按钮，防止重复点击
            this.f1035m.setValue(Boolean.FALSE);

            // 显示"验证中..."
            interfaceC0680W.setValue("验证中...");

            // ★★★ 启动后台协程，把所有状态水桶打包交给 A 类去处理
            // o1.A.o() 就是 Kotlin 协程的 launch{}
            o1.A.o(this.f1032j, null, 0,
                newA(this.f1036n, this.f1037o, this.f1033k,
                      this.f1038p, this.f1039q, this.f1034l, null), 3);
        }
        return S0.k.f1286a;
    }
}
```  
  
**这段代码告诉我们什么？**  
1. 用户输入为空时，直接提示"请先输入 flag"，不进入验证。  
  
1. 输入不为空时，界面显示"验证中..."，然后把**所有状态数据打包交给了 Q0.A**  
 在后台执行。  
  
#### 2.8 协程调度器：Q0.A  
> 这里有一个坑，jadx直接双击A，跳转到的是o1.A类，因为这里两个A直接重名了。我们直接在软件里搜索类名Q0.A  
，跳转。Shift+Ctrl+F。  
  
  
  
  
打开 Q0 包下的 A  
 类。由于 Kotlin 协程底层会被编译成复杂的状态机，**jadx 很可能反编译失败**  
，显示类似这样的错误：  
  
```
Method dump skipped, instruction units count: 263
To view this dump change 'Code comments level' option to'DEBUG'
```  
  
**解决方法**  
：在 jadx 设置中勾选 **Show inconsistent code**  
（显示不一致的代码），或者使用Simple模式`，然后 jadx 会输出一段半 Java、半底层指令的"降级版"代码。这里我们使用Simple模式。可以直接在jadx下方切换，如下图箭头所示。  
  
##### Q0.A.g() 降级模式代码（带注释）  
  
这个方法是一个**协程状态机**  
，通过 this.f1024q  
（步骤编号）来控制执行流程。核心分为三步：  
```
@Override
publicfinal Object g(Object r13)throws Throwable {
    X0.ar02= X0.a.f1576i;
    intr12=this.f1024q;  // ★ 当前步骤编号
    // ...

    if (r12 == 0) goto L128;      // 步骤 0：读取加密文件
    if (r12 == 1) goto L125;      // 步骤 1：发起验证
    if (r12 != 2) goto L124;      // 步骤 2：处理结果

    // ============= 步骤 2（L142）：处理底层返回的结果 =============
    R.c.Y(r13);

    // ★ 尝试把底层返回的字节数组解析成对象
    C0081er132= h1.a.S((byte[]) r13);

    if (r132 == null) goto L155;   // 解析失败 → Flag 不正确

    // 解析成功，更新界面状态...
    Stringr135="验证成功";       // ★ 验证通过！
    r03.setValue(r135);
    // ...

L155:
    r135 = "Flag 不正确";          // ★ 验证失败
    // ...

L159:
    // 异常处理
    Log.e("Hajimi", "verify flag failed", r137);
    r3.setValue("验证出错");

    // ============= 步骤 1（L125）：发起底层验证 =============
L125:
    R.c.Y(r13);
    r9.setValue((byte[]) r13);      // 保存读到的字节数组
    byte[] r139 = (byte[]) r13;

    // ★★★ 创建 z 类，把加密字节数组和用户输入一起传给它
    zr10=newz(r139, r8, null);
    this.f1024q = 2;                // 设置下一步为步骤 2
    r13 = o1.A.v(r92, r10, this);  // 执行 z（调用 NativeBridge），挂起等待
    // ...

    // ============= 步骤 0（L128）：读取加密文件 =============
L128:
    R.c.Y(r13);
    byte[] r18 = (byte[]) r9.getValue();  // 先检查内存里有没有缓存

    if (r18 != null) goto L137;           // 有缓存，直接用

    // ★ 没有缓存，派 y 类去读取 assets/hjm_pack.bin
    yr112=newy(r1311, null);
    this.f1024q = 1;                       // 设置下一步为步骤 1
    r13 = o1.A.v(r19, r112, this);        // 执行 y（读文件），挂起等待
    // ...
}
```  
  
**翻译成白话**  
：  
1. **步骤 0**  
（首次执行）：检查内存里有没有 hjm_pack.bin  
 的数据。如果没有，派 Q0.y  
 去读取。  
  
1. **步骤 1**  
（文件读完后）：创建 Q0.z  
，把字节数组和用户输入一起传给它，调用底层验证。  
  
1. **步骤 2**  
（底层返回后）：尝试解析返回值。成功显示"验证成功"，失败显示"Flag 不正确"，异常显示"验证出错"。  
  
#### 2.9 读取加密文件：Q0.y  
  
在 A  
 的步骤 0 中，y  
 类负责读取文件：  
```
package Q0;

import android.content.Context;
import java.io.InputStream;

publicfinalclassyextendsY0.i implementse1.e {

    publicfinal Context f1216m;

    publicy(Context context, W0.d dVar) {
        super(2, dVar);
        this.f1216m = context;
    }

    // ... N() 和 c() 方法省略 ...

    @Override
    publicfinal Object g(Object obj)throws Throwable {
        R.c.Y(obj);

        // ★★★ 从 APK 的 assets 目录打开 hjm_pack.bin 文件
        InputStreaminputStreamOpen=this.f1216m.getAssets().open("hjm_pack.bin");

        try {
            f1.h.b(inputStreamOpen);
            // ★ 把文件内容读成字节数组
            byte[] bArrJ = b0.g.J(inputStreamOpen);
            c0.d.p(inputStreamOpen, null);  // 关闭流
            return bArrJ;  // ★ 返回字节数组给 A 类
        } finally {
        }
    }
}
```  
  
**真相大白**  
：传给底层验证函数的第一个参数 byte[]  
，就是 APK 中 assets/hjm_pack.bin  
 文件的全部内容。这个文件在我们解压 APK 后的 app/assets/  
 目录里。  
#### 2.10 最终移交底层：Q0.z  
  
在 A  
 的步骤 1 中，z  
 类负责调用 native 方法：  
```
package Q0;

import com.zj.wuaipojie2026_2.NativeBridge;
import java.util.List;
import t.InterfaceC0680W;

publicfinalclasszextendsY0.i implementse1.e {

    publicfinalbyte[] f1217m;          // ★ 加密的字节数组（来自 hjm_pack.bin）
    publicfinal InterfaceC0680W f1218n;  // ★ 用户输入的状态水桶

    publicz(byte[] bArr, InterfaceC0680W interfaceC0680W, W0.d dVar) {
        super(2, dVar);
        this.f1217m = bArr;
        this.f1218n = interfaceC0680W;
    }

    // ... N() 和 c() 方法省略 ...

    @Override
    publicfinal Object g(Object obj)throws Throwable {
        R.c.Y(obj);

        // 获取 NativeBridge 单例
        NativeBridgenativeBridge= NativeBridge.INSTANCE;
        Listlist= N.f1106a;

        // ★★★ 终极调用！
        // 1. this.f1217m → hjm_pack.bin 的字节数组
        // 2. 从水桶取出用户输入，trim 去掉首尾空格
        // 3. 调用 NativeBridge.verifyAndDecrypt → 进入 libhajimi.so
        return nativeBridge.verifyAndDecrypt(
            this.f1217m,
            n1.k.j0((String) this.f1218n.getValue()).toString()
        );
    }
}
```  
  
**至此，Java 层的数据流终于抵达了终点**  
：用户输入的 flag 字符串（经过 trim  
）和 hjm_pack.bin  
 的内容，一起被传入了 NativeBridge.verifyAndDecrypt  
。  
#### 2.11 NativeBridge：通往底层的桥梁  
  
最后来看 com.zj.wuaipojie2026_2.NativeBridge  
，这是 Java 和 C/C++ 之间的"翻译官"：  
```
package com.zj.wuaipojie2026_2;

import f1.h;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

publicfinalclassNativeBridge {

    publicstaticfinalintSCORE_GOOD=1;     // 音游评分常量
    publicstaticfinalintSCORE_MISS=0;
    publicstaticfinalintSCORE_PERFECT=2;
    publicstaticfinalintERR_CHEAT= -7;

    publicstaticfinalNativeBridgeINSTANCE=newNativeBridge();  // 单例

    static {
        // ★ 加载底层库 libhajimi.so（"哈基米"，出题人的致敬彩蛋）
        System.loadLibrary("hajimi");
    }

    privateNativeBridge() { }

    // ========== native 方法声明（实现在 libhajimi.so 里） ==========

    // 方法 1：初始化游戏会话（传字节数组版本）
    privatefinalnativevoidstartSessionBytes(long j2, byte[] bArr, int i2);

    // Java 封装：把 int[] 节拍数据转成小端序 byte[] 后调用 native
    publicfinalvoidstartSession(long j2, int[] iArr, int i2) {
        h.e(iArr, "beatMapMs");
        ByteBufferbyteBufferOrder= ByteBuffer.allocate(iArr.length * 4)
                                                .order(ByteOrder.LITTLE_ENDIAN);
        for (int i3 : iArr) {
            byteBufferOrder.putInt(i3);
        }
        byte[] bArrArray = byteBufferOrder.array();
        h.d(bArrArray, "array(...)");
        startSessionBytes(j2, bArrArray, i2);
    }

    // 方法 2：检查节奏（音游判定）
    publicfinalnativeintcheckRhythm(long j2, int i2, long j3, int i3);

    // 方法 3：更新经验值
    publicfinalnativelongupdateExp(int i2, int i3, long j2);

    // 方法 4：解密帧数据
    publicfinalnativebyte[] decryptFrames(byte[] bArr, long j2);

    // 方法 5：设置调试绕过
    publicfinalnativevoidsetDebugBypass(boolean z2);

    // ★★★ 方法 6：验证并解密（我们要分析的核心方法）
    publicfinalnativebyte[] verifyAndDecrypt(byte[] bArr, String str);
}
```  
  
**这段代码告诉我们什么？**  
1. native 库的名字是 hajimi  
，对应文件是 libhajimi.so  
。  
  
1. 从常量和方法名可以看出，**这个 App 实际上是一个隐藏的音乐节奏游戏**  
（SCORE_GOOD  
、SCORE_PERFECT  
、checkRhythm  
、beatMapMs  
）。  
  
1. startSession  
 方法揭示了一个重要细节：Java 层的 int[]  
 节拍数据会被转成**小端序（Little-Endian）**  
的 byte[]  
 传递给 native 层。  
  
1. 有 6 个 native 方法，我们主要关注 verifyAndDecrypt  
。  
  
#### 2.12 Java 层分析小结  
  
到这里，Java 层的调查**完美收官**  
。整个 flag 的调用逻辑已经闭环：  
```
用户点击 "验证" 按钮
  ↓
Q0.B.o()  ← 检查输入不为空，显示"验证中..."
  ↓
Q0.A.g()  ← 协程调度器（状态机）
  ↓
Q0.y.g()  ← 读取 assets/hjm_pack.bin（加密数据）
  ↓
Q0.z.g()  ← 最终移交
  ↓
NativeBridge.verifyAndDecrypt(pack字节数组, trim后的用户输入)
                    ↓
            libhajimi.so（C/C++ 底层验证）
                    ↓
         返回 byte[]：成功可解析 → "验证成功"
                      解析失败   → "Flag 不正确"
                      抛出异常   → "验证出错"
```  
> **关于核心包**  
：Q0  
 是混淆后的 UI 逻辑大本营（A  
、B  
、C  
、D  
、y  
、z  
 等类原本可能叫 VerifyViewModel  
、OnClickVerify  
 之类的名字）。com.zj.wuaipojie2026_2  
 是不能被混淆的主包，里面只有系统入口 MainActivity  
 和必须按名字对接 C/C++ 的 NativeBridge  
。  
  
  
**我们现在知道了什么？**  
1. 用户输入会被 trim  
（去掉首尾空格）。  
  
1. 验证需要两个输入：assets/hjm_pack.bin  
 的内容 + 用户输入的字符串。  
  
1. 真正的验证逻辑在 libhajimi.so  
 里的 verifyAndDecrypt  
 函数。  
  
1. 这个 App 是一个音乐节奏游戏，NativeBridge  
 中的 startSession  
、checkRhythm  
 等方法会在游戏过程中初始化和更新全局状态。  
  
1. 详细流程图如下：  
  
**下一步要做什么？**  
  
去 IDA 里分析 libhajimi.so  
，看 verifyAndDecrypt  
 到底做了什么。  
### 3. 第三步：用 IDA 看 Native 层代码  
#### 3.1 为什么要用 IDA  
  
libhajimi.so  
 是编译后的机器码，不能直接阅读。IDA Pro 可以：  
- 把机器码反汇编成汇编代码  
  
- 进一步反编译成类似 C 的伪代码  
  
- 提供交叉引用、函数调用图等分析功能  
  
#### 3.2 打开 so 文件  
1. **启动 IDA Pro**  
双击 IDA 的可执行文件（ida64.exe  
 或 ida.exe  
）。  
  
1. **选择要分析的文件**  
点击 File → Open  
，导航到你解压 APK 后的目录：app/lib/arm64-v8a/libhajimi.so  
，arm64-v8a  
与我们的主流手机架构一致，方便后续进入unidbg调试  
  
1. **选择处理器类型**  
IDA 会弹出一个对话框，问你要用哪个处理器。   
保持默认选项 ARM64 (AArch64)  
（因为我们分析的是 64 位 ARM 架构）然后一路狂点OK。  
  
1. **等待分析完成**  
IDA 会自动分析 so 文件，这个过程可能需要几秒到几分钟。  
当左下角显示 AU: idle  
 时，表示分析完成。  
  
#### 3.3 找到 JNI_OnLoad 函数  
##### 为什么要找 JNI_OnLoad？  
  
在 Java 层，我们看到 NativeBridge  
 里有 6 个 native 方法。但在 so 文件里，这些方法的名字可能不是 verifyAndDecrypt  
，而是一串混淆后的地址。  
  
JNI_OnLoad  
 是 JNI 库的初始化函数，它会告诉 JVM："Java 方法 verifyAndDecrypt  
 对应 native 函数地址 0x12345  
"。这个过程叫**动态注册**  
。  
  
所以我们要先找到 JNI_OnLoad  
，从里面提取"Java 方法名 → native 函数地址"的映射表。  
##### 如何在 IDA 里找到 JNI_OnLoad？  
1. **打开函数窗口**  
按 Shift + F3  
（或点击 View → Open subviews → Functions  
）。默认就是左侧那一列显示函数列表。  
  
1. **在函数列表里搜索**  
在函数窗口，按 Ctrl + F  
，输入 JNI_OnLoad  
，按回车。  
  
1. **双击搜索结果**  
IDA 会跳转到 JNI_OnLoad  
 函数的反汇编视图。  
  
1. **切换到伪代码视图**  
按 F5  
（或右键 → Generate pseudocode  
）。  
  
##### JNI_OnLoad 伪代码分析  
```
jint JNI_OnLoad(JavaVM *vm, void *reserved)
{
  JavaVM v2; // x8 — JNI 函数表指针（*vm 解引用后得到 JNIInvokeInterface_）
  __int64 v4; // x0 — 保存 FindClass 返回的 jclass 引用
  _QWORD v5[2]; // [xsp+0h] [xbp-10h] BYREF — v5[0] 用来接收 JNIEnv*

  // ── 栈 canary 初始化（ARM64 标准 guard，防止栈溢出攻击）──
  v5[1] = *(_QWORD *)(_ReadStatusReg(TPIDR_EL0) + 40);

  v2 = *vm;   // 解引用 JavaVM**，得到 JNIInvokeInterface_ 函数表
  v5[0] = 0;  // 清零，确保 GetEnv 失败时 v5[0] 不是野指针

  // ── 第 1 步：通过 JavaVM->GetEnv 拿到当前线程的 JNIEnv* ──
  // 65542 = 0x10006 = JNI_VERSION_1_6；失败（线程未 attach）返回非零 → 直接返回 -1
  if ( v2->GetEnv(vm, (void **)v5, 65542) )
    return-1;

  // ── 第 2 步：调用 JNIEnv->FindClass，在虚拟机中查找目标类 ──
  // *(_QWORD *)v5[0]       = JNINativeInterface_ 函数表首地址
  // + 48LL                 = 偏移 0x30，对应 FindClass（第 6 个槽，每槽 8 字节）
  // 参数：JNI 内部类名，使用 '/' 分隔包名
  v4 = (*(__int64 (__fastcall **)(_QWORD, constchar *))(*(_QWORD *)v5[0] + 48LL))(
         v5[0],
         "com/zj/wuaipojie2026_2/NativeBridge");  // 要注册 native 方法的 Java 类
  if ( !v4 )
    return-1;  // 类找不到（通常是 ClassLoader 问题），终止加载

  // ── 第 3 步：调用 JNIEnv->RegisterNatives，批量注册 native 方法 ──
  // + 1720LL               = 偏移 0x6B8，对应 RegisterNatives（第 215 个槽）
  // off_5E6F8              = JNINativeMethod[] 数组首地址（name / signature / fnPtr 三元组）
  // 6                      = 数组长度，即注册 6 个 native 方法
  // 返回非零表示注册失败（某个方法名/签名在类中找不到）
  if ( (*(unsignedint (__fastcall **)(_QWORD, __int64, char **, __int64))(*(_QWORD *)v5[0] + 1720LL))(
         v5[0],
         v4,
         off_5E6F8,   // → 见 3.4 节，映射表记录了 6 个 Java 方法 → native 函数的绑定
         6) )
  {
    return-1;
  }

  return65542;  // 返回 JNI_VERSION_1_6，通知 JVM 该 so 支持的 JNI 版本
}
```  
  
**这段代码告诉我们什么？**  
- 关键信息在 off_5E6F8  
 这个数组里。  
  
- 我们要去看这个数组的内容。  
  
#### 3.4 查看 native 方法映射表  
##### 如何跳转到 off_5E6F8？  
1. **在伪代码窗口里，把光标放在 off_5E6F8 这个词上**  
1. **按 Enter 键**  
（或双击）  
  
1. **IDA 会跳转到数据段，显示这个数组的内容**  
##### 映射表数据分析  
  
IDA 会显示类似这样的数据：  
```
.data:000000000005E6F8 off_5E6F8       DCQ aStartsessionby     ; DATA XREF: LOAD:00000000000000F8↑o
.data:000000000005E6F8                                         ; JNI_OnLoad+74↑o
.data:000000000005E6F8                                         ; "startSessionBytes"
.data:000000000005E700                 DCQ aJBiV               ; "(J[BI)V"
.data:000000000005E708                 DCQ sub_247B0
.data:000000000005E710                 DCQ aCheckrhythm        ; "checkRhythm"
.data:000000000005E718                 DCQ aJijiI              ; "(JIJI)I"
.data:000000000005E720                 DCQ sub_24DA8
.data:000000000005E728                 DCQ aUpdateexp          ; "updateExp"
.data:000000000005E730                 DCQ aIijJ               ; "(IIJ)J"
.data:000000000005E738                 DCQ sub_24EA4
.data:000000000005E740                 DCQ aDecryptframes      ; "decryptFrames"
.data:000000000005E748                 DCQ aBjB                ; "([BJ)[B"
.data:000000000005E750                 DCQ sub_2541C
.data:000000000005E758                 DCQ aVerifyanddecry     ; "verifyAndDecrypt"
.data:000000000005E760                 DCQ aBljavaLangStri     ; "([BLjava/lang/String;)[B"
.data:000000000005E768                 DCQ sub_257DC
.data:000000000005E770                 DCQ aSetdebugbypass     ; "setDebugBypass"
.data:000000000005E778                 DCQ aZV                 ; "(Z)V"
.data:000000000005E780                 DCQ sub_25C90
```  
##### 如何理解这个数据结构？  
  
这个数组是 JNINativeMethod  
 结构体的数组，每个结构体占 24 字节（3 个指针，每个 8 字节）：  
```
structJNINativeMethod {
    constchar* name;        // Java 方法名（8 字节指针）
    constchar* signature;   // 方法签名（8 字节指针）
    void*       fnPtr;       // native 函数地址（8 字节指针）
};
```  
  
所以我们可以把上面的数据按每 3 行分组：  
<table><thead><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">Java 方法名</span></section></th><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">方法签名</span></section></th><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">Native 函数地址</span></section></th></tr></thead><tbody><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">startSessionBytes</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">(J[BI)V</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">sub_247B0</span></code><section><span leaf=""> (0x247B0)</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);background-color: rgb(246, 248, 250);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">checkRhythm</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">(JIJI)I</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">sub_24DA8</span></code><section><span leaf=""> (0x24DA8)</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">updateExp</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">(IIJ)J</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">sub_24EA4</span></code><section><span leaf=""> (0x24EA4)</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);background-color: rgb(246, 248, 250);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">decryptFrames</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">([BJ)[B</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">sub_2541C</span></code><section><span leaf=""> (0x2541C)</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">verifyAndDecrypt</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">([BLjava/lang/String;)[B</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">sub_257DC</span></code><section><span leaf=""> (0x257DC)</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);background-color: rgb(246, 248, 250);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">setDebugBypass</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">(Z)V</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">sub_25C90</span></code><section><span leaf=""> (0x25C90)</span></section></td></tr></tbody></table>  
**这个表格告诉我们什么？**  
- Java 方法 verifyAndDecrypt  
 对应的 native 函数地址是 0x257DC  
。  
  
- 在 IDA 里，这个函数被自动命名为 sub_257DC  
（sub 表示 subroutine，子程序）。  
  
#### 3.5 分析 verifyAndDecrypt 函数  
##### 如何跳转到这个函数？  
1. **在映射表数据窗口里，把光标放在 sub_257DC 这个词上**  
1. **按 Enter 键**  
（或双击）  
  
1. **IDA 会跳转到这个函数的反汇编视图**  
1. **按 F5 切换到伪代码视图**  
##### verifyAndDecrypt 完整伪代码（IDA 反编译）  
  
下面是 IDA 对 sub_257DC  
（即 verifyAndDecrypt  
）的完整反编译结果。变量名是 IDA 自动生成的（v5  
、v8  
 等），初看很晦涩，但不必逐行阅读——重要的是理解整体流程。  
> **阅读建议**  
：先大致浏览代码结构，然后跳到代码块后方的「逐段拆解」部分对照理解。  
  
```
__int64 __fastcall sub_257DC(__int64 *a1, __int64 a2, __int64 a3, __int64 a4)
{
  __int64 v5; // x8
  int v8; // w0
  size_t v9; // x23
  unsignedint v10; // w21
  _DWORD *v11; // x0
  char *v12; // x25
  _DWORD *v13; // x19
  __int64 v14; // x8
  __int64 v15; // x0
  __int64 v16; // x22
  __int64 v18; // x0
  int v19; // w2
  int v20; // w3
  int v21; // w4
  int v22; // w5
  int v23; // w6
  int v24; // w7
  int v25; // w10
  __int64 v26; // x9
  __int64 v27; // x8
  unsigned __int64 v28; // x9
  unsigned __int64 v29; // x9
  unsigned __int64 v30; // x10
  __int128 v31; // t2
  int v32; // w26
  int v33; // w10
  int v34; // w24
  int v35; // w25
  int v36; // w8
  __int64 v37; // x0
  __int64 v38; // x26
  int v39; // w28
  char v40; // w24
  size_t v41; // x2
  unsignedint v42; // w0
  unsignedint v43; // w1
  int v44; // [xsp+0h] [xbp-40h]
  int v45[2]; // [xsp+8h] [xbp-38h] BYREF
  int v46[2]; // [xsp+10h] [xbp-30h]
  int v47[2]; // [xsp+18h] [xbp-28h]
  void *s2; // [xsp+20h] [xbp-20h] BYREF
  _BYTE *v49; // [xsp+28h] [xbp-18h]
  int v50; // [xsp+30h] [xbp-10h]
  void *v51; // [xsp+38h] [xbp-8h]
  __int64 vars0; // [xsp+40h] [xbp+0h]

  v51 = *(void **)(_ReadStatusReg(TPIDR_EL0) + 40);
  v5 = *a1;
  if ( a3 && a4 )
  {
    v8 = (*(__int64 (__fastcall **)(__int64 *, __int64))(v5 + 1368))(a1, a3);
    if ( v8 > 0 )
    {
      v9 = (unsignedint)v8;
      v10 = v8;
      v11 = (_DWORD *)operator new((unsignedint)v8);
      v12 = (char *)v11 + v9;
      v13 = v11;
      *(_QWORD *)v45 = v11;
      *(_QWORD *)v47 = (char *)v11 + v9;
      memset(v11, 0, v9);
      v14 = *a1;
      *(_QWORD *)v46 = v12;
      (*(void (__fastcall **)(__int64 *, __int64, _QWORD, _QWORD, _DWORD *))(v14 + 1600))(a1, a3, 0, v10, v13);
      if ( v10 <= 0x33 || *v13 != 827148872 )
        goto LABEL_6;
      v18 = sub_25EF8(a1);
      v25 = dword_5EA50 + HIDWORD(v18);
      v26 = dword_5EA4C | (unsignedint)v18;
      if ( dword_5EA50 + HIDWORD(v18) >= 12 )
        v25 = 12;
      dword_5EA4C |= v18;
      dword_5EA50 = v25;
      if ( v25 < 4 )
      {
        v27 = qword_5EA28;
        if ( byte_5EA54 != 1 )
        {
          v32 = 0;
          goto LABEL_20;
        }
      }
      else
      {
        v27 = qword_5EA28;
        byte_5EA54 = 1;
      }
      v28 = (v25 ^ (unsigned __int64)(v26 << 32) ^ 0x1A8CBC5B802E097CLL) - 0x61C8864680B583EBLL;
      v29 = 0x94D049BB133111EBLL
          * ((0xBF58476D1CE4E5B9LL * (v28 ^ (v28 >> 30))) ^ ((0xBF58476D1CE4E5B9LL * (v28 ^ (v28 >> 30))) >> 27));
      v30 = v29 ^ (v29 >> 31);
      if ( v30 )
      {
        *((_QWORD *)&v31 + 1) = v29 ^ (v29 >> 31);
        *(_QWORD *)&v31 = v29;
        v27 ^= (v31 >> 35) ^ v30;
      }
      v32 = 1;
LABEL_20:
      v33 = v13[2];
      qword_5EA30 = v27;
      if ( v33 )
      {
        v34 = v13[3];
        if ( v34 )
        {
          v35 = v13[4];
          if ( v35 )
          {
            v36 = v13[1];
            if ( v36 == 2 )
            {
              if ( (v32 | (unsigned __int8)byte_5EA40) & 1 | (byte_5EB88 != 0) )
              {
                if ( byte_5EB88 )
                  v42 = sub_2DCDC();
                else
                  v42 = qword_5EA38;
                if ( v32 )
                  v43 = v42 ^ 0xA5A5A5A5;
                else
                  v43 = v42;
                if ( (sub_2DDF8(
                        (int)v45,
                        v43,
                        v19,
                        v20,
                        v21,
                        v22,
                        v23,
                        v24,
                        v44,
                        v45[0],
                        v46[0],
                        v47[0],
                        (int)s2,
                        (int)v49,
                        v50,
                        v51,
                        vars0)
                    & 1) == 0 )
                {
LABEL_47:
                  v15 = (*(__int64 (__fastcall **)(__int64 *, _QWORD))(*a1 + 1408))(a1, 0);
                  goto LABEL_7;
                }
LABEL_29:
                v38 = (*(__int64 (__fastcall **)(__int64 *, __int64, _QWORD))(*a1 + 1352))(a1, a4, 0);
                if ( v38 )
                {
                  v39 = v35 * v34;
                  sub_2D46C((int)&s2, (unsignedint)(v35 * v34) >> 3);
                  v40 = sub_2E5FC(v38, v34, v35, s2, v49 - (_BYTE *)s2);
                  (*(void (__fastcall **)(__int64 *, __int64, __int64))(*a1 + 1360))(a1, a4, v38);
                  if ( (v40 & 1) != 0
                    && (unsignedint)v39 >= 8
                    && (v41 = (unsigned __int64)v39 >> 3, v41 + 52 <= v9)
                    && !memcmp(v13 + 13, s2, v41) )
                  {
                    v16 = (*(__int64 (__fastcall **)(__int64 *, _QWORD))(*a1 + 1408))(a1, v10);
                    (*(void (__fastcall **)(__int64 *, __int64, _QWORD, _QWORD, _DWORD *))(*a1 + 1664))(
                      a1,
                      v16,
                      0,
                      v10,
                      v13);
                  }
                  else
                  {
                    v16 = (*(__int64 (__fastcall **)(__int64 *, _QWORD))(*a1 + 1408))(a1, 0);
                  }
                  if ( s2 )
                  {
                    v49 = s2;
                    operator delete(s2);
                  }
                  goto LABEL_8;
                }
                goto LABEL_47;
              }
            }
            elseif ( v36 == 1 )
            {
              if ( v32 )
                v37 = 1515870653;
              else
                v37 = 999;
              sub_2D4F0(v37, v13 + 6, v13 + 10, &s2);
              sub_2D678(v13 + 13, v9 - 52, &s2, v13 + 10);
              goto LABEL_29;
            }
          }
        }
      }
LABEL_6:
      v15 = (*(__int64 (__fastcall **)(__int64 *, _QWORD))(*a1 + 1408))(a1, 0);
LABEL_7:
      v16 = v15;
LABEL_8:
      operator delete(v13);
      return v16;
    }
    v5 = *a1;
  }
  return (*(__int64 (__fastcall **)(__int64 *, _QWORD))(v5 + 1408))(a1, 0);
}
```  
##### 逐段拆解  
  
IDA 生成的变量名很晦涩（a1  
 v5  
 v13  
...），但只要掌握 JNI 函数偏移表，就能把关键操作一一还原。  
<table><thead><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">伪代码表达式</span></section></th><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">对应的含义</span></section></th></tr></thead><tbody><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">*(v5 + 1368)(a1, a3)</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">env-&gt;GetArrayLength(pack_bytes)</span></code><section><span leaf=""> — 获取 pack 字节数组长度</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);background-color: rgb(246, 248, 250);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">*(v5 + 1600)(a1, a3, 0, v10, v13)</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">env-&gt;GetByteArrayRegion(pack, 0, len, buf)</span></code><section><span leaf=""> — 拷贝 pack 到 native 缓冲区</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">*(v5 + 1352)(a1, a4, 0)</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">env-&gt;GetStringUTFChars(input_str, NULL)</span></code><section><span leaf=""> — 获取用户输入的字符串</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);background-color: rgb(246, 248, 250);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">*(v5 + 1408)(a1, v10)</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">env-&gt;NewByteArray(len)</span></code><section><span leaf=""> — 创建返回给 Java 的字节数组</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">*(v5 + 1664)(a1, v16, 0, v10, v13)</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">env-&gt;SetByteArrayRegion(result, 0, len, buf)</span></code><section><span leaf=""> — 写入结果数据</span></section></td></tr></tbody></table>  
**第一段：获取 pack 数据并校验头部**  
```
v8 = (*(v5 + 1368))(a1, a3);     // GetArrayLength → pack 长度
v13 = operator new(v8);           // 分配 native 缓冲区
(*(v14 + 1600))(a1, a3, 0, v10, v13); // GetByteArrayRegion → 拷贝数据
if ( v10 <= 0x33 || *v13 != 827148872 )  // 长度 > 51 且魔数 = 'HJM1'
    goto LABEL_6;                 // 校验失败 → 返回 null
```  
- v10 <= 0x33  
 → pack 长度必须 > 51（即至少有 52 字节的完整头部）  
  
- *v13 != 827148872  
 → 827148872 = 0x314D4A48  
，即 "HJM1"  
 的小端序表示，这是文件格式的魔数校验  
  
**第二段：环境混入与状态更新**  
```
v18 = sub_25EF8(a1);              // ★ 环境指纹探测
v25 = dword_5EA50 + HIDWORD(v18);
v26 = dword_5EA4C | (unsignedint)v18;
// ... SplitMix64 派生 ...
v28 = (v25 ^ (v26 << 32) ^ 0x1A8CBC5B802E097CLL) - 0x61C8864680B583EBLL;
v29 = 0x94D049BB133111EBLL * ((0xBF58476D1CE4E5B9LL * (v28 ^ (v28 >> 30))) ^ ...);
v30 = v29 ^ (v29 >> 31);
if ( v30 ) { v27 ^= (v31 >> 35) ^ v30; }
qword_5EA30 = v27;               // ★ 更新全局 seed
```  
- sub_25EF8  
 是**环境指纹探测器**  
：它会访问 /proc/zoneinfo  
、读取设备属性（ro.build.fingerprint  
 等）、做 JNI 类存在性检测，最终返回一个混合指纹值  
  
- 返回值被混入 dword_5EA4C  
 和 dword_5EA50  
 两个全局累积状态  
  
- 接着用 **SplitMix64**  
 风格的运算从上述状态派生出新的 qword_5EA30  
  
- 这意味着 **qword_5EA30 不是静态值**  
——它在每次调用 verifyAndDecrypt  
 时都可能被更新  
  
**第三段：按 mode 分派**  
```
v36 = v13[1];  // header 偏移 4 → mode 字段
if ( v36 == 2 ) { ... }  // mode=2：解密+比较位图（本题走这条路）
if ( v36 == 1 ) { ... }  // mode=1：不同的处理逻辑
```  
  
本题的 pack 文件 mode=2  
，进入最关键的分支。  
  
**第四段：获取 seed 并解密位图**  
```
if ( (v32 | (unsigned __int8)byte_5EA40) & 1 | (byte_5EB88 != 0) ) {
    if ( byte_5EB88 )            // debug bypass 标志
        v42 = sub_2DCDC();       // 从全局状态计算 seed
    else
        v42 = qword_5EA38;       // 使用存储的 seed
    if ( v32 )
        v43 = v42 ^ 0xA5A5A5A5;  // 额外 XOR
    else
        v43 = v42;
    sub_2DDF8(&pack_vec, v43, ...); // ★ 解密 pack 位图
}
```  
  
三个要点：  
1. **状态门控**  
：必须满足 (v32 | byte_5EA40) & 1  
 或 byte_5EB88 != 0  
，否则直接返回 null。这就是「App 内验证需要先玩游戏才行」的根因  
  
1. **seed 来源有两条路**  
：byte_5EB88  
（debug bypass 标志）决定走 sub_2DCDC()  
 还是 qword_5EA38  
  
1. **可选 XOR**  
：v32  
 控制是否在 seed 上做 ^ 0xA5A5A5A5  
  
**第五段：渲染用户输入并比较位图**  
```
v38 = GetStringUTFChars(a1, a4, 0);   // 获取用户输入的文本
sub_2D46C(&s2, v39 >> 3);              // 分配位图缓冲区
v40 = sub_2E5FC(v38, v34, v35, s2, ...); // ★ 渲染文本为 1-bit 位图
...
memcmp(v13 + 13, s2, v41);             // ★ 比较 pack 位图与渲染位图
```  
- sub_2E5FC  
 负责将用户输入的字符串渲染成一幅 1-bit 位图  
  
- v13 + 13  
 即 pack_ptr + 52  
（跳过 52 字节头部），指向 pack 中存储的位图（此时已被 sub_2DDF8  
 原地解密）  
  
- 如果两个位图完全相同（memcmp == 0  
），验证通过，返回 pack 数据；否则返回 null  
  
**这段代码告诉我们什么？**  
1. **验证逻辑不是简单的字符串比较**  
，而是：  
  
1. 把用户输入渲染成位图  
  
1. 把 pack 里的加密位图解密出来  
  
1. 比较两个位图是否完全相同  
  
1. **关键函数有三个**  
：  
  
1. sub_2DCDC  
：获取 seed（依赖全局状态）  
  
1. sub_2DDF8  
：解密 pack 位图（需要正确的 seed）  
  
1. sub_2E5FC  
：渲染文本为位图（需要字模数据）  
  
1. **为什么不能直接用 Python 复现？**  
  
1. 因为 sub_2DCDC  
 返回的 seed 依赖全局状态（qword_5EA30  
 等变量）  
  
1. 这些状态是由 startSessionBytes  
 等函数在运行时设置的  
  
1. 如果状态不对，解密出来的位图就是错的  
  
#### 3.6 查看全局状态变量  
##### 为什么要看全局变量？  
  
从上面的分析我们知道，sub_2DCDC  
 会读取全局状态。我们需要找到这些变量，才能在 unidbg 里正确初始化它们。  
##### 如何找到全局变量？  
1. **在伪代码窗口里，双击 sub_2DCDC 跳转到这个函数**  
1. **按 F5 查看伪代码**  
```
__int64 sub_2DCDC()
{
  // 这个函数直接返回一个全局变量
  // qword_5EA30 是一个 64 位整数（8 字节）
  return qword_5EA30;
}
```  
1. **双击 qword_5EA30 跳转到这个变量的定义**  
```
.bss:000000000005EA30 qword_5EA30     DQ ?    ; 未初始化的全局变量
```  
  
**这告诉我们什么？**  
- qword_5EA30  
 是一个全局变量，初始值未定义。  
  
- 它的偏移地址是 0x5EA30  
（相对于 so 文件起始位置）。  
  
- 我们需要找到哪个函数会设置这个变量。  
  
##### 如何找到设置这个变量的函数？  
1. **在 IDA 伪代码窗口里，Alt+T 搜索 qword_5EA30 ，右键点击，注意在伪代码窗口里Crtl+F无法搜索！！！**  
1. **选择 Jump to xref to operand...（跳转到交叉引用）或者直接按X**  
1. **IDA 会列出所有读写这个变量的地方**  
你会看到 sub_247B0  
（也就是 startSessionBytes  
，我们最初分析 JNI_OnLoad  
 的时候获得）会写入这个变量。以下是完整的 IDA 反编译伪代码：  
  
```
__int64 __fastcall sub_247B0(__int64 a1, __int64 a2, __int64 a3, __int64 a4, int a5)
{
  int v9; // w0
  unsignedint v10; // w9
  unsignedint v11; // w9
  __int64 v12; // x27
  int8x16_t v13; // q2
  int8x16_t v14; // q3
  int8x16_t v15; // q4
  int8x16_t v16; // q5
  __int64 v17; // x9
  __int64 v18; // x0
  __int64 v19; // x22
  __int64 v20; // x14
  __int64 v21; // x13
  constchar *v22; // x12
  int8x16_t *v23; // x13
  __int64 v24; // x10
  int8x16_t v25; // q6
  int8x16_t v26; // q7
  int32x4_t v27; // q18
  int32x4_t v28; // q19
  int32x4_t v29; // q2
  int8x16_t *v30; // x14
  constchar *v31; // x12
  __int64 v32; // x13
  int8x16_t v33; // q18
  __int64 v34; // x10
  __int64 v35; // x9
  unsigned __int64 v36; // x11
  _DWORD *v37; // x10
  __int64 v38; // x11
  int v39; // w12
  __int64 v40; // x9
  __int64 v41; // x11
  void **v42; // x21
  __int64 v43; // x8
  __int64 v44; // x9
  __int64 v45; // x0
  __int64 v46; // x9
  int v47; // w10
  __int64 v48; // x8
  void **v49; // x23
  unsigned __int64 v50; // x9
  unsigned __int64 v51; // x10
  unsigned __int64 v52; // x9
  __int128 v53; // t2
  unsigned __int64 v54; // x9
  unsigned __int64 v55; // x10
  unsigned __int64 v56; // x9
  __int64 v57; // x14
  unsigned __int64 v58; // x12
  unsigned __int64 v59; // x9
  unsigned __int64 v60; // x11
  __int64 result; // x0
  unsigned __int64 v62; // [xsp+10h] [xbp-210h] BYREF
  int v63; // [xsp+18h] [xbp-208h]
  int v64; // [xsp+1Ch] [xbp-204h]
  __int64 v65; // [xsp+20h] [xbp-200h]
  __int64 v66; // [xsp+28h] [xbp-1F8h]
  __int64 v67; // [xsp+30h] [xbp-1F0h]
  __int64 v68; // [xsp+210h] [xbp-10h]
  int8x8x4_t v69; // 0:kr00_32.32
  int8x16x4_t v70; // 0:q4.16,16:q5.16,32:q6.16,48:q7.16

  v68 = *(_QWORD *)(_ReadStatusReg(TPIDR_EL0) + 40);
  v9 = (*(__int64 (__fastcall **)(__int64, __int64))(*(_QWORD *)a1 + 1368LL))(a1, a4);
  if ( v9 <= 0 )
    v10 = 0;
  else
    v10 = v9;
  v11 = v10 >> 2;
  if ( v11 >= 0x80 )
    v12 = 128;
  else
    v12 = v11;
  if ( !(_DWORD)v12 )
  {
    v18 = 0;
    dword_5EA18 = 0;
    v19 = a3;
    dword_5EA1C = a5;
    qword_5EA20 = a3;
    goto LABEL_26;
  }
  (*(void (__fastcall **)(__int64, __int64, _QWORD, _QWORD, unsigned __int64 *))(*(_QWORD *)a1 + 1600LL))(
    a1,
    a4,
    0,
    (unsignedint)(4 * v12),
    &v62);
  if ( (unsignedint)v12 >= 8 )
  {
    if ( (unsignedint)v12 >= 0x10 )
    {
      v17 = (unsigned __int8)v12 & 0xF0;
      v14.n128_u64[1] = 0xFFFFFF03FFFFFF02LL;
      v30 = (int8x16_t *)&unk_5E818;
      v31 = (constchar *)&v62;
      v13.n128_u64[1] = 0xFFFFFF0BFFFFFF0ALL;
      v32 = v17;
      do
      {
        v70 = vld4q_s8(v31);
        v31 += 64;
        v32 -= 16;
        v33 = vqtbl1q_s8(v70.val[0], (int8x16_t)xmmword_14140);
        v30[2] = vorrq_s8(
                   vorrq_s8(
                     vshlq_n_s32(vqtbl1q_s8(v70.val[1], (int8x16_t)xmmword_14130), 8u),
                     vqtbl1q_s8(v70.val[0], (int8x16_t)xmmword_14130)),
                   vorrq_s8(
                     vshlq_n_s32(vqtbl1q_s8(v70.val[2], (int8x16_t)xmmword_14130), 0x10u),
                     vshlq_n_s32(vqtbl1q_s8(v70.val[3], (int8x16_t)xmmword_14130), 0x18u)));
        v30[3] = vorrq_s8(
                   vorrq_s8(
                     vshlq_n_s32(vqtbl1q_s8(v70.val[1], (int8x16_t)xmmword_14120), 8u),
                     vqtbl1q_s8(v70.val[0], (int8x16_t)xmmword_14120)),
                   vorrq_s8(
                     vshlq_n_s32(vqtbl1q_s8(v70.val[2], (int8x16_t)xmmword_14120), 0x10u),
                     vshlq_n_s32(vqtbl1q_s8(v70.val[3], (int8x16_t)xmmword_14120), 0x18u)));
        v70.val[0] = vorrq_s8(
                       vshlq_n_s32(vqtbl1q_s8(v70.val[1], (int8x16_t)xmmword_141A0), 8u),
                       vqtbl1q_s8(v70.val[0], (int8x16_t)xmmword_141A0));
        v16 = vorrq_s8(
                vorrq_s8(vshlq_n_s32(vqtbl1q_s8(v70.val[1], (int8x16_t)xmmword_14140), 8u), v33),
                vorrq_s8(
                  vshlq_n_s32(vqtbl1q_s8(v70.val[2], (int8x16_t)xmmword_14140), 0x10u),
                  vshlq_n_s32(vqtbl1q_s8(v70.val[3], (int8x16_t)xmmword_14140), 0x18u)));
        v15 = vorrq_s8(
                v70.val[0],
                vorrq_s8(
                  vshlq_n_s32(vqtbl1q_s8(v70.val[2], (int8x16_t)xmmword_141A0), 0x10u),
                  vshlq_n_s32(vqtbl1q_s8(v70.val[3], (int8x16_t)xmmword_141A0), 0x18u)));
        *v30 = v15;
        v30[1] = v16;
        v30 += 4;
      }
      while ( v32 );
      if ( v17 == v12 )
        goto LABEL_23;
      if ( (v12 & 8) == 0 )
        goto LABEL_21;
    }
    else
    {
      v17 = 0;
    }
    v20 = v17;
    v21 = 4 * v17;
    v17 = (unsigned __int8)v12 & 0xF8;
    v22 = (char *)&v62 + v21;
    v23 = (int8x16_t *)((char *)&unk_5E818 + v21);
    v24 = v20 - v17;
    do
    {
      v69 = vld4_s8(v22);
      v13.n128_u64[0] = v69.val[0].n64_u64[0];
      v14.n128_u64[0] = v69.val[1].n64_u64[0];
      v15.n128_u64[0] = v69.val[2].n64_u64[0];
      v16.n128_u64[0] = v69.val[3].n64_u64[0];
      v22 += 32;
      v25 = vqtbl1q_s8(v13, (int8x16_t)xmmword_14140);
      v24 += 8;
      v26 = vqtbl1q_s8(v13, (int8x16_t)xmmword_141A0);
      v27 = vqtbl1q_s8(v15, (int8x16_t)xmmword_14140);
      v28 = vqtbl1q_s8(v15, (int8x16_t)xmmword_141A0);
      v29 = vqtbl1q_s8(v16, (int8x16_t)xmmword_14140);
      v15 = vorrq_s8(vshlq_n_s32(vqtbl1q_s8(v14, (int8x16_t)xmmword_141A0), 8u), v26);
      v16 = vorrq_s8(vshlq_n_s32(v28, 0x10u), vshlq_n_s32(vqtbl1q_s8(v16, (int8x16_t)xmmword_141A0), 0x18u));
      v13 = vorrq_s8(
              vorrq_s8(vshlq_n_s32(vqtbl1q_s8(v14, (int8x16_t)xmmword_14140), 8u), v25),
              vorrq_s8(vshlq_n_s32(v27, 0x10u), vshlq_n_s32(v29, 0x18u)));
      v14 = vorrq_s8(v15, v16);
      *v23 = v14;
      v23[1] = v13;
      v23 += 2;
    }
    while ( v24 );
    if ( v17 == v12 )
      goto LABEL_23;
    goto LABEL_21;
  }
  v17 = 0;
LABEL_21:
  v34 = 4 * v17;
  v35 = v12 - v17;
  v36 = (unsigned __int64)&v62 + v34;
  v37 = (_DWORD *)((char *)&unk_5E818 + v34);
  v38 = v36 | 3;
  do
  {
    v39 = *(_DWORD *)(v38 - 3);
    --v35;
    v38 += 4;
    *v37++ = v39;
  }
  while ( v35 );
LABEL_23:
  v40 = 0;
  dword_5EA18 = v12;
  dword_5EA1C = a5;
  qword_5EA20 = a3;
  do
  {
    v41 = 4 * v40++;
    *(_DWORD *)((char *)&v62 + v41) = *(_DWORD *)((char *)&unk_5E818 + v41);
  }
  while ( v12 != v40 );
  v19 = a3;
  v18 = sub_25CA8(&v62, (unsignedint)(4 * v12), 0x1A8CBC5B802E097CLL);
LABEL_26:
  qword_5EA38 = 0;
  qword_5EA28 = v18;
  byte_5EA48 = 0;
  qword_5EA30 = v18;
  byte_5EA40 = 0;
  dword_5EA44 = 0;
  byte_5E7E0 = 0;
  dword_5EA4C = 0;
  dword_5EA50 = 0;
  byte_5EA54 = 0;
  if ( qword_5E808 )
  {
    v42 = (void **)qword_5E800;
    if ( qword_5E800 )
    {
      do
      {
        v49 = (void **)*v42;
        if ( ((_BYTE)v42[2] & 1) != 0 )
          operator delete(v42[4]);
        operator delete(v42);
        v42 = v49;
      }
      while ( v49 );
    }
    v43 = qword_5E7F8;
    qword_5E800 = 0;
    if ( qword_5E7F8 )
    {
      v44 = 0;
      do
        *(_QWORD *)(*((_QWORD *)&xmmword_5E7E8 + 1) + 8 * v44++) = 0;
      while ( v43 != v44 );
    }
    qword_5E808 = 0;
  }
  *(_QWORD *)&xmmword_5E7E8 = 0;
  qword_5EA58 = 0;
  qword_5EA60 = 0;
  v45 = sub_25EF8(a1);
  v46 = dword_5EA4C | (unsignedint)v45;
  if ( dword_5EA50 + HIDWORD(v45) >= 12 )
    v47 = 12;
  else
    v47 = dword_5EA50 + HIDWORD(v45);
  dword_5EA4C |= v45;
  dword_5EA50 = v47;
  if ( v47 < 4 )
  {
    v48 = qword_5EA28;
    if ( byte_5EA54 != 1 )
    {
      v52 = 0;
      goto LABEL_44;
    }
  }
  else
  {
    v48 = qword_5EA28;
    byte_5EA54 = 1;
  }
  v50 = (v47 ^ (unsigned __int64)(v46 << 32) ^ 0x1A8CBC5B802E097CLL) - 0x61C8864680B583EBLL;
  v51 = 0x94D049BB133111EBLL
      * ((0xBF58476D1CE4E5B9LL * (v50 ^ (v50 >> 30))) ^ ((0xBF58476D1CE4E5B9LL * (v50 ^ (v50 >> 30))) >> 27));
  v52 = v51 ^ (v51 >> 31);
  if ( v52 )
  {
    *((_QWORD *)&v53 + 1) = v51 ^ (v51 >> 31);
    *(_QWORD *)&v53 = v51;
    v48 ^= (v53 >> 35) ^ v52;
  }
LABEL_44:
  v54 = (v52 ^ ((unsigned __int64)(unsignedint)dword_5EA18 << 32) ^ v19 ^ 0x1A8CBC5B802E097CLL) - 0x61C8864680B583EBLL;
  dword_5EA98 = 0;
  v55 = 0xBF58476D1CE4E5B9LL
      * (((v48 ^ 0x1A8CBC5B802E097CLL) - 0x61C8864680B583EBLL)
       ^ (((v48 ^ 0x1A8CBC5B802E097CuLL) - 0x61C8864680B583EBLL) >> 30));
  qword_5EA30 = v48;
  dword_5EAA0 = 0;
  qword_5EA88 = 0;
  v56 = 0x94D049BB133111EBLL
      * ((0xBF58476D1CE4E5B9LL * (v54 ^ (v54 >> 30))) ^ ((0xBF58476D1CE4E5B9LL * (v54 ^ (v54 >> 30))) >> 27));
  v67 = 0;
  qword_5EA90 = (0x94D049BB133111EBLL * (v55 ^ (v55 >> 27))) ^ ((0x94D049BB133111EBLL * (v55 ^ (v55 >> 27))) >> 31);
  dword_5EA80 = 0;
  v57 = ((v56 ^ (v56 >> 31) ^ ((v56 ^ (v56 >> 31)) >> 32)) << 32) ^ 0x1A8CBC5B802E097CLL;
  v65 = 0;
  v66 = qword_5EA90;
  v58 = 0xBF58476D1CE4E5B9LL * ((v57 - 0x61C8864680B583EBLL) ^ ((unsigned __int64)(v57 - 0x61C8864680B583EBLL) >> 30));
  dword_5EA78 = v56 ^ (v56 >> 31) ^ ((v56 ^ (v56 >> 31)) >> 32);
  v63 = dword_5EA78;
  v64 = 0;
  v59 = 0x94D049BB133111EBLL
      * ((0xBF58476D1CE4E5B9LL
        * (((v57 ^ qword_5EA90) - 0x61C8864680B583EBLL)
         ^ (((v57 ^ (unsigned __int64)qword_5EA90) - 0x61C8864680B583EBLL) >> 30)))
       ^ ((0xBF58476D1CE4E5B9LL
         * (((v57 ^ qword_5EA90) - 0x61C8864680B583EBLL)
          ^ (((v57 ^ (unsigned __int64)qword_5EA90) - 0x61C8864680B583EBLL) >> 30))) >> 27));
  v60 = 0x94D049BB133111EBLL
      * ((0xBF58476D1CE4E5B9LL * ((v57 + 0x3C6EF372FE94F82ALL) ^ ((unsigned __int64)(v57 + 0x3C6EF372FE94F82ALL) >> 30)))
       ^ ((0xBF58476D1CE4E5B9LL * ((v57 + 0x3C6EF372FE94F82ALL) ^ ((unsigned __int64)(v57 + 0x3C6EF372FE94F82ALL) >> 30))) >> 27));
  qword_5EA68 = v59 ^ (v59 >> 31);
  v62 = v59 ^ (v59 >> 31);
  result = sub_2D248(
             &v62,
             40,
             (0x94D049BB133111EBLL * (v58 ^ (v58 >> 27))) ^ ((0x94D049BB133111EBLL * (v58 ^ (v58 >> 27))) >> 31),
             v60 ^ (v60 >> 31));
  qword_5EA70 = result;
  byte_5EAA4 = 1;
  return result;
}
```  
##### 逐段拆解  
  
这段代码很长（大量 NEON SIMD 指令用于字节重排），但核心逻辑只有三步：  
  
**第一步：获取 beatMap 并存入全局缓冲区**  
```
v9 = GetArrayLength(a1, a4);     // 获取 beatMap 字节数组长度
v11 = v10 >> 2;                   // 元素个数 = 字节长度 / 4
if ( v11 >= 0x80 ) v12 = 128;    // 最多 128 个元素
GetByteArrayRegion(a1, a4, 0, 4*v12, &v62);  // 拷贝到栈上
```  
  
中间大段的 NEON 指令（vld4q_s8  
、vqtbl1q_s8  
、vshlq_n_s32  
 等）是 ARM 的 SIMD 向量操作，功能是将 beatMap 字节做**交错重排（deinterleave）**  
，结果写入全局数组 unk_5E818  
。这部分不影响我们的 unidbg 复现策略，可以跳过。  
  
**第二步：计算 seed 并初始化全局状态**  
```
v18 = sub_25CA8(&v62, 4 * v12, 0x1A8CBC5B802E097CLL);  // ★ hash 函数
qword_5EA38 = 0;
qword_5EA28 = v18;        // seed 备份
qword_5EA30 = v18;        // seed 主变量（后续 sub_2DCDC 读取的就是它）
byte_5EA40 = 0;
dword_5EA44 = 0;
// ... 以及一系列其他全局变量清零 ...
```  
- sub_25CA8  
 是一个 64-bit hash 函数，输入=beatMap 字节 + 常量 0x1A8CBC5B802E097C  
  
- 计算结果同时写入 qword_5EA28  
（备份）和 qword_5EA30  
（主变量）  
  
- **这就是我们在 unidbg 里需要复现的关键操作**  
**第三步：环境混入 + 状态派生**  
```
v45 = sub_25EF8(a1);             // ★ 环境指纹（同 verifyAndDecrypt 里的那个）
v46 = dword_5EA4C | v45;
v47 = dword_5EA50 + HIDWORD(v45);
// ... SplitMix64 派生 ...
qword_5EA30 = v48;               // ★ 再次更新 qword_5EA30
```  
  
最后还会调用 sub_2D248  
（SipHash 风格的 PRF）进一步派生更多全局状态（qword_5EA68  
、qword_5EA70  
、qword_5EA90  
 等），这些是游戏运行时的内部状态机。  
  
**这段代码告诉我们什么？**  
1. qword_5EA30  
 是由 startSessionBytes  
 函数设置的。  
  
1. 它的值是通过 sub_25CA8  
 函数计算出来的。  
  
1. 计算需要三个输入：  
  
1. beatMap 数据（从 Java 层传来）  
  
1. beatMap 长度（4 * beat_count  
）  
  
1. 固定常量 0x1A8CBC5B802E097C  
  
#### 3.7 IDA 分析小结  
  
到这里，我们已经完整理解了 native 层的逻辑：  
```
verifyAndDecrypt (0x257DC)
  ↓
解析 pack header（获取 mode, width, height）
  ↓
如果 mode == 2：
  ↓
  sub_2DCDC (0x2DCDC) ← 读取 qword_5EA30
  ↓
  sub_2DDF8 (0x2DDF8) ← 解密 pack 位图
  ↓
  sub_2E5FC (0x2E5FC) ← 渲染用户输入为位图
  ↓
  memcmp ← 比较两个位图
```  
  
**我们现在知道了什么？**  
1. 验证逻辑是"位图比较"，不是"字符串比较"。  
  
1. 解密 pack 位图需要正确的 seed（存储在 qword_5EA30  
）。  
  
1. seed 是由 startSessionBytes  
 函数初始化的。  
  
1. 如果我们能拿到解密后的 pack 位图，就能获取正确的 flag。  
  
1. 详细流程图如下：  
  
**下一步要做什么？**  
  
用 unidbg 模拟执行 native 代码，拿到解密后的 pack 位图。  
### 4. 第四步：为什么需要 unidbg  
#### 4.1 纯 Python 复现的困境  
  
你可能会想：既然我们已经知道了算法流程，为什么不直接用 Python 写一遍？  
##### 问题 1：状态依赖太复杂  
- qword_5EA30  
 的初始化需要调用 sub_25CA8  
（一个复杂的 hash 函数）。  
  
- sub_25CA8  
 内部可能还调用了其他函数。  
  
- 手动用 Python 复现这些函数，工作量巨大且容易出错。  
  
##### 问题 2：中间状态难以验证  
- 即使你用 Python 写出了 sub_25CA8  
，你怎么知道写对了？  
  
- 如果中间某一步算错了，后面的结果全错，但你不知道错在哪里。  
  
##### 问题 3：反调试和环境检测  
- native 代码里有反调试逻辑（检测是否在调试器里运行）。  
  
- 有环境检测（检测是否在真实 Android 设备上）。  
  
- 纯 Python 无法绕过这些检测。  
  
#### 4.2 unidbg 的优势  
  
unidbg 是一个基于 Unicorn 引擎的 Android 模拟器，它可以：  
1. **直接执行 native 代码**  
：不需要手动复现算法，让原始代码自己跑。  
  
1. **模拟 Android 环境**  
：提供 JNI 接口、系统调用等，让 native 代码以为自己在真实设备上。  
  
1. **可控的执行**  
：你可以在任意位置打断点、查看内存、修改变量。  
  
**用 unidbg 的策略**  
：  
- 不追求"一次性算出 flag"。  
  
- 先追求"拿到解密后的 pack 位图"（中间态）。  
  
- 再用 Python 做 OCR 识别（简单任务）。  
  
这样把复杂问题拆成两个简单问题，降低了失败风险。  
### 5. 第五步：用 unidbg 获取解密后的位图  
#### 5.1 unidbg 项目结构  
  
**本地真实目录结构如下**  
（APK 已解压在 app/  
，unidbg 项目在同级的 unidbg_runner/  
）：  
```
Arnold逆向教程/                          ← 项目根目录
├── app/                                 ← 第一步解压得到的 APK 目录（保持原位即可）
│   ├── assets/
│   │   └── hjm_pack.bin               ← 加密数据包（Runner.java 会自动找到）
│   └── lib/
│       └── arm64-v8a/
│           └── libhajimi.so             ← native 库（Runner.java 会自动找到）
├── unidbg_runner/                       ← unidbg Java 项目
│   ├── pom.xml                          ← Maven 配置文件
│   ├── unidbg_dump.bin                  ← 运行后自动生成在这里（解密结果）
│   └── src/
│       └── main/
│           └── java/
│               └── com/
│                   └── ctf/
│                       └── Runner.java  ← unidbg 主程序（包名 com.ctf）
├── dump_flag.py                         ← 运行 unidbg 的 Python 封装
└── solve_flag.py                        ← 提取位图并生成预览
```  
> **关键点**  
：libhajimi.so  
 和 hjm_pack.bin  
 **不需要手动复制**  
到 Java 项目里。Runner.java  
 内置了 locateExtractedApkDir()  
 方法，会自动在当前目录和父目录中递归搜索这两个文件，找到后直接使用。只要 unidbg_runner/  
 和 app/  
 放在同一父目录下，就能零配置运行。  
  
  
**第一步：用 Maven 创建项目骨架**  
  
在 Arnold逆向教程/  
 目录下打开命令行，运行：  
```
mvn archetype:generate -DgroupId=com.ctf -DartifactId=unidbg_runner -DarchetypeArtifactId=maven-archetype-quickstart-DinteractiveMode=false
```  
> 解释：让 Maven 自动生成一个包名为 com.ctf  
、项目名为 unidbg_runner  
 的标准 Java 工程骨架。  
  
  
看到 BUILD SUCCESS  
 后，Maven 会生成如下结构：  
```
unidbg_runner/
├── pom.xml
└── src/
    ├── main/
    │   └── java/
    │       └── com/
    │           └── ctf/
    │               └── App.java   ← Maven 自动生成的占位类，后面替换为 Runner.java
    └── test/                      ← 测试目录，CTF 中用不到，可忽略
```  
  
**第二步：将 App.java 替换为 Runner.java**  
  
把 src/main/java/com/ctf/App.java  
 删除（或直接覆盖），新建同路径的 Runner.java  
，内容见 5.3 节。无需创建 resources  
 目录，也无需复制任何 so 或 bin 文件。  
#### 5.2 pom.xml 配置文件  
  
这个文件告诉 Maven 项目的依赖和构建配置。  
```
<projectxmlns="http://maven.apache.org/POM/4.0.0"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <!-- ===== 项目坐标（唯一标识这个项目） ===== -->
  <!-- groupId：组织/公司标识，CTF 项目随便填，不影响运行 -->
  <groupId>local</groupId>
  <!-- artifactId：项目名，Maven 命令和目录名都以此为准 -->
  <artifactId>unidbg-runner</artifactId>
  <!-- version：SNAPSHOT 表示仍在开发中的快照版本 -->
  <version>1.0-SNAPSHOT</version>

  <!-- ===== 全局属性（可在下方用 ${变量名} 引用） ===== -->
  <properties>
    <!-- 指定用 Java 17 编译源码；unidbg 0.9.8 要求 Java 11+，推荐 17 -->
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <!-- 源码和资源文件统一用 UTF-8，避免中文路径乱码 -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <!-- 统一管理 unidbg 版本号，改这一处即可同步升级所有相关依赖 -->
    <unidbg.version>0.9.8</unidbg.version>
  </properties>

  <!-- ===== 依赖声明（Maven 会自动从远程仓库下载这些 jar） ===== -->
  <dependencies>

    <!-- unidbg 核心：提供 Android 模拟器、Dalvik VM、JNI 环境 -->
    <dependency>
      <groupId>com.github.zhkl0228</groupId>
      <artifactId>unidbg-android</artifactId>
      <version>${unidbg.version}</version>
    </dependency>

    <!-- Dynarmic 后端：高性能 ARM 动态翻译引擎，大幅加快 native 代码执行速度 -->
    <!-- 不加这个也能跑，但会慢很多（回退到纯解释执行） -->
    <dependency>
      <groupId>com.github.zhkl0228</groupId>
      <artifactId>unidbg-dynarmic</artifactId>
      <version>${unidbg.version}</version>
    </dependency>

    <!-- 日志框架：让 unidbg 的内部日志能正常输出到控制台 -->
    <!-- 不加会报 "SLF4J: No SLF4J providers were found." 警告 -->
    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-simple</artifactId>
      <version>2.0.13</version>
    </dependency>

  </dependencies>

  <!-- ===== 构建插件配置 ===== -->
  <build>
    <plugins>
      <!-- exec-maven-plugin：让 "mvn exec:java" 命令能直接运行指定的主类 -->
      <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>exec-maven-plugin</artifactId>
        <version>3.3.0</version>
        <configuration>
          <!-- 告诉插件入口类是哪个；包名 com.ctf 必须与 Runner.java 的 package 声明完全一致 -->
          <mainClass>com.ctf.Runner</mainClass>
        </configuration>
      </plugin>
    </plugins>
  </build>

</project>
```  
#### 5.3 Runner.java 主程序  
  
下面是完整的 Runner.java  
。它的核心思路：**不模拟完整的 startSessionBytes，而是只调用关键的子函数 + 手动写入全局变量**  
，用最少的操作拿到解密后的 pack 位图。  
> 注意：实际代码中的 locateExtractedApkDir()  
 方法会自动在当前目录和父目录下搜索 libhajimi.so  
，所以你不需要手动指定路径。  
  
```
package com.ctf;

import com.github.unidbg.AndroidEmulator;
import com.github.unidbg.Module;
import com.github.unidbg.linux.android.AndroidEmulatorBuilder;
import com.github.unidbg.linux.android.AndroidResolver;
import com.github.unidbg.linux.android.dvm.DalvikModule;
import com.github.unidbg.linux.android.dvm.VM;
import com.github.unidbg.memory.Memory;
import com.github.unidbg.memory.MemoryBlock;
import com.github.unidbg.pointer.UnidbgPointer;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

publicclassRunner {

    // ===== 关键函数在 so 中的偏移量（相对于加载基址）=====
    // 这些值通过 IDA 静态分析得到，代表每个函数从 so 文件 .text 段开头算起的字节偏移。
    // 运行时：函数真实地址 = 模拟器分配的 base 地址 + 这里的偏移量

    // sub_25CA8：接收节拍数组，计算并返回全局哈希常量 qword_5EA30
    privatestaticfinallongOFF_sub_25CA8=0x25CA8;
    // sub_2DCDC：读取 qword_5EA30，生成解密用的随机种子 seed
    privatestaticfinallongOFF_sub_2DCDC=0x2DCDC;
    // sub_2DDF8：核心解密函数，用 seed 对内存中的 pack 数据进行就地解密
    privatestaticfinallongOFF_sub_2DDF8=0x2DDF8;

    // ===== 关键全局变量在 so 中的偏移量 =====
    // dword_5EA18：存储节拍数组的元素个数（int，4 字节），sub_2DCDC 内部会读取
    privatestaticfinallongOFF_dword_5EA18=0x5EA18;
    // qword_5EA30：存储由节拍数据计算出的核心哈希值（long，8 字节），sub_2DCDC / sub_2DDF8 均依赖它
    privatestaticfinallongOFF_qword_5EA30=0x5EA30;

    publicstaticvoidmain(String[] args)throws Exception {
        // ===== 第一步：定位 APK 解压目录 =====
        // 优先解析命令行的 --appDir 参数；若未指定，则调用 locateExtractedApkDir() 自动搜索
        PathappDir= parseAppDirArg(args).orElseGet(() -> {
            try {
                return locateExtractedApkDir();
            } catch (IOException e) {
                thrownewRuntimeException(e);
            }
        });
        // 拼接出 so 库和加密 pack 的完整路径
        PathsoPath= appDir.resolve(Path.of("lib", "arm64-v8a", "libhajimi.so")).normalize();
        PathpackPath= appDir.resolve(Path.of("assets", "hjm_pack.bin")).normalize();
        // 解密结果写到当前目录下的 unidbg_dump.bin
        PathoutPath= Path.of(".", "unidbg_dump.bin").normalize();

        // 提前检查文件是否存在，给出清晰错误提示，避免后续运行时报迷惑性错误
        if (!Files.isRegularFile(soPath)) {
            thrownewFileNotFoundException("Missing native library: " + soPath.toAbsolutePath());
        }
        if (!Files.isRegularFile(packPath)) {
            thrownewFileNotFoundException("Missing pack file: " + packPath.toAbsolutePath());
        }

        // ===== 第二步：创建 ARM64 模拟器实例 =====
        // for64Bit() 指定模拟 64 位 ARM 架构（对应 lib/arm64-v8a/ 目录下的 so）
        // setProcessName 设置模拟进程名与真实 APK 包名一致，
        //   防止 so 内的反调试逻辑（检测进程名）被触发
        AndroidEmulatoremulator= AndroidEmulatorBuilder.for64Bit()
                .setProcessName("com.zj.wuaipojie2026_2")
                .build();

        // ===== 第三步：配置模拟器内存与系统库解析器 =====
        // Memory 接口负责管理整个模拟内存空间（so 加载、malloc、指针读写）
        Memorymemory= emulator.getMemory();
        // AndroidResolver(30) = 模拟 Android 11（API 30）的系统共享库（libc.so 等）
        memory.setLibraryResolver(newAndroidResolver(30));

        // ===== 第四步：创建 Dalvik 虚拟机（提供 JNI 运行环境）=====
        // 传 null 表示不加载真实 dex，只创建最小化的 JNI 环境供 so 调用
        VMvm= emulator.createDalvikVM((File) null);
        vm.setVerbose(false); // 关闭 JNI 调用的逐行日志，保持输出简洁

        // ===== 第五步：加载 so 文件并触发初始化 =====
        // loadLibrary 把 so 映射进模拟内存，false = 不立即执行初始化（延迟到 callJNI_OnLoad）
        DalvikModuledm= vm.loadLibrary(soPath.toFile(), false);
        // callJNI_OnLoad 触发 so 的 JNI_OnLoad 函数：注册 JNI 方法、初始化全局静态变量等
        dm.callJNI_OnLoad(emulator);
        Modulemodule= dm.getModule();
        longbase=module.base; // so 被分配到的基址（每次运行由模拟器随机分配）
        System.out.println("[+] libhajimi.so base=0x" + Long.toHexString(base));

        // ===== 第六步：读取加密包，准备节拍数据 =====
        byte[] pack = Files.readAllBytes(packPath); // 将整个加密 bin 文件读入内存

        // beatMap 是节拍时间戳数组，由对 Java 层代码的逆向分析得出
        // 单位：毫秒，表示游戏中节拍出现的时刻
        int[] beatMap = newint[] { 0, 250, 500, 750 };
        // ARM 是小端序（Little-Endian），必须把 int[] 转为小端字节序才能被 so 正确读取
        byte[] beatBytes = toLittleEndianIntBytes(beatMap);

        // 在模拟器内存中分配空间并写入节拍字节数据
        MemoryBlockbeatBlock= memory.malloc(beatBytes.length, true); // true = 分配时清零
        UnidbgPointerbeatPtr= beatBlock.getPointer();                // 获取该内存块的指针
        beatPtr.write(0, beatBytes, 0, beatBytes.length);              // 把节拍数据写进去

        // ===== 第七步：调用 sub_25CA8，计算全局哈希 qword_5EA30 =====
        // 参数依次为：
        //   beatPtr              → 节拍数据数组的内存指针
        //   beatBytes.length     → 数组字节总长度
        //   0x1A8CBC5B802E097CL  → 硬编码初始哈希常量（通过逆向 so 中的魔数得出）
        // 返回值：计算得到的 64 位哈希，即全局变量 qword_5EA30 的目标值
        longqword5ea30=module.callFunction(
                emulator,
                OFF_sub_25CA8,
                beatPtr,
                beatBytes.length,
                0x1A8CBC5B802E097CL).longValue();

        // ===== 第八步：手动写入全局变量（绕过完整的 Java 层初始化流程）=====
        // 正常运行时，这两个变量由 Java 层的 startSessionBytes() 函数初始化。
        // unidbg 不跑完整 Java 层，所以我们直接用指针把正确的值写进 so 的数据段。
        UnidbgPointerpDword5ea18= UnidbgPointer.pointer(emulator, base + OFF_dword_5EA18);
        UnidbgPointerpQword5ea30= UnidbgPointer.pointer(emulator, base + OFF_qword_5EA30);
        pDword5ea18.setInt(0, beatMap.length);   // 写入节拍数组元素个数（int）
        pQword5ea30.setLong(0, qword5ea30);      // 写入刚才计算出的哈希（long）
        System.out.println("[+] set dword_5EA18=" + beatMap.length + " qword_5EA30=0x" + Long.toHexString(qword5ea30));

        // ===== 第九步：调用 sub_2DCDC，生成解密种子 seed =====
        // 此函数内部读取 dword_5EA18 和 qword_5EA30，执行一段伪随机算法，返回 seed
        // seed 是后续解密的"钥匙"，必须与加密时一致才能解出正确数据
        longseed=module.callFunction(emulator, OFF_sub_2DCDC).longValue();
        System.out.println("[+] seed(sub_2DCDC)=0x" + Long.toHexString(seed));

        // ===== 第十步：将 pack 数据写入模拟器内存，构造向量结构体 =====
        MemoryBlockdataBlock= memory.malloc(pack.length, true);
        UnidbgPointerdataPtr= dataBlock.getPointer();
        dataPtr.write(0, pack, 0, pack.length); // 把加密数据拷进模拟内存

        // sub_2DDF8 接收的不是裸指针，而是 C++ std::vector<uint8_t>& 风格的结构体：
        //   { uint8_t* begin;  (8 字节，数据起始地址)
        //     uint8_t* end;    (8 字节，数据结束地址) }
        // 分配 16 字节，手动填写 begin / end 指针
        MemoryBlockvecBlock= memory.malloc(16, true);
        UnidbgPointervecPtr= vecBlock.getPointer();
        vecPtr.setLong(0, dataPtr.peer);               // begin = 数据起始地址
        vecPtr.setLong(8, dataPtr.peer + pack.length); // end   = 数据结束地址（左闭右开）

        // ===== 第十一步：调用 sub_2DDF8 就地解密 pack 数据 =====
        // 函数直接修改 vecPtr 指向的内存区域（就地解密，不另开缓冲区）
        // 返回值：1 = 解密成功，0 = 失败（通常是 seed 或全局变量有误）
        Numberok=module.callFunction(emulator, OFF_sub_2DDF8, vecPtr, seed);
        System.out.println("[+] sub_2DDF8 ret=" + ok);

        // ===== 第十二步：从模拟内存读回解密结果，写入磁盘文件 =====
        byte[] out = dataPtr.getByteArray(0, pack.length);
        Files.write(outPath, out);
        System.out.println("[+] wrote " + out.length + " bytes to: " + outPath.toAbsolutePath());

        // ===== 第十三步：释放内存块并关闭模拟器（防止资源泄漏）=====
        vecBlock.free();
        dataBlock.free();
        beatBlock.free();
        emulator.close();
    }

    /**     * 将 int 数组按小端序（Little-Endian）转换为字节数组。     *     * <p>ARM 处理器使用小端序存储多字节整数：低位字节存放在低地址。     * 例如整数 0x01020304 在小端内存中排列为：04 03 02 01。     * 如果直接用 Java 默认的大端序写入，so 读出的值会完全错误，     * 导致哈希计算结果不一致，最终解密失败。     *     * @Param ints 原始 int 数组（节拍时间戳，单位毫秒）     * @Return 按小端序排列的等价字节数组     */
    privatestaticbyte[] toLittleEndianIntBytes(int[] ints) {
        ByteBufferbb= ByteBuffer.allocate(ints.length * 4).order(ByteOrder.LITTLE_ENDIAN);
        for (int v : ints) {
            bb.putInt(v);
        }
        return bb.array();
    }

    /**     * 解析命令行参数，提取 --appDir 选项指定的路径。     *     * <p>用法示例：java Runner --appDir C:\Users\xxx\Desktop\app     * 若命令行未提供此参数，返回 Optional.empty()，     * 调用方随后会使用 locateExtractedApkDir() 自动搜索。     *     * @param args main 方法接收的命令行参数数组     * @return 包含 APK 解压目录路径的 Optional；未指定时为 Optional.empty()     */
    privatestatic Optional<Path> parseAppDirArg(String[] args) {
        for (inti=0; i < args.length; i++) {
            if ("--appDir".equals(args[i]) && i + 1 < args.length) {
                return Optional.of(Path.of(args[i + 1]).normalize());
            }
        }
        return Optional.empty();
    }

    /**     * 自动在当前目录及父目录中递归搜索已解压的 APK 根目录。     *     * <p>判断标准：目录下必须同时存在：     * <ul>     *   <li>lib/arm64-v8a/libhajimi.so（native 库）</li>     *   <li>assets/hjm_pack.bin（加密数据包）</li>     * </ul>     *     * <p搜索深度上限为 8 层，避免遍历整个文件系统造成性能问题。     * 搜索范围包含当前工作目录（unidbg_runner/）和其父目录（项目根目录），     * 这样无论从哪个目录执行 mvn exec:java 都能正确找到文件。     *     * @return 找到的 APK 解压根目录的规范化路径     * @throws FileNotFoundException 若两个搜索根均未找到符合条件的目录，     *         提示用户通过 --appDir 手动指定     */
    privatestatic Path locateExtractedApkDir()throws IOException {
        Pathcwd= Path.of("").toAbsolutePath().normalize();
        // 同时搜索当前目录和父目录，覆盖从不同工作目录启动的情况
        List<Path> searchRoots = List.of(cwd, cwd.getParent() != null ? cwd.getParent() : cwd);
        // 用路径中包含标准 lib 目录结构作为识别 APK 解压目录的特征
        Stringneedle= File.separator + "lib" + File.separator + "arm64-v8a" + File.separator + "libhajimi.so";

        for (Path root : searchRoots) {
            if (root == null || !Files.isDirectory(root)) {
                continue;
            }

            // Files.find 递归遍历，返回第一个文件名匹配且路径符合特征的 so 文件
            Optional<Path> so = Files.find(
                    root,
                    8,          // 最大递归深度，防止无限遍历
                    (p, a) -> a.isRegularFile()
                            && "libhajimi.so".equals(p.getFileName().toString())
                            && p.toString().contains(needle))
                    .findFirst();

            if (so.isEmpty()) {
                continue;
            }

            // so 路径结构：<appDir>/lib/arm64-v8a/libhajimi.so
            // 连续向上三级（arm64-v8a → lib → appDir）即可得到 APK 解压根目录
            PathappDir= so.get().getParent().getParent().getParent();
            Pathpack= appDir.resolve(Path.of("assets", "hjm_pack.bin"));
            // 必须同时存在 pack 文件，才认定这是完整的 APK 解压目录
            if (Files.isRegularFile(pack)) {
                return appDir.normalize();
            }
        }

        thrownewFileNotFoundException(
                "Could not locate extracted APK dir. Pass it explicitly via: --appDir <path>");
    }
}
```  
  
确实，配环境特别复杂，这里我用LLM直接帮我构建的环境。XD  
#### 5.4 运行 unidbg 脚本  
##### 第一步：安装依赖  
  
在 unidbg_runner/  
 目录下打开命令行（PowerShell 或 CMD），运行：  
```
# 下载依赖并编译项目
mvn clean compile
```  
  
你应该看到类似输出：  
```
PS unidbg_runner> mvn clean compile  
[INFO] Scanning for projects...
[INFO] 
[INFO] ------------------------< local:unidbg-runner >-------------------------
[INFO] Building unidbg-runner1.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- clean:3.2.0:clean (default-clean) @ unidbg-runner---
[INFO] Deleting <项目目录>\unidbg_runner\target
[INFO]
[INFO] --- resources:3.3.1:resources (default-resources) @ unidbg-runner---
[INFO] skip non existing resourceDirectory <项目目录>\unidbg_runner\src\main\resources
[INFO]
[INFO] --- compiler:3.13.0:compile (default-compile) @ unidbg-runner---
[INFO] Recompiling the module because of changed source code.
[INFO] Compiling 1 source file with javac [debugtarget17] to target\classes
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  1.130 s
[INFO] Finished at: 2026-03-03T22:12:50+08:00
[INFO] ------------------------------------------------------------------------
```  
  
如果看到 BUILD SUCCESS  
，说明编译成功。  
##### 第二步：运行程序  
```
# 运行主程序
mvn -q exec:java
```  
  
参数说明：  
- -q  
：安静模式（只显示关键输出，不显示 Maven 的详细日志）  
  
- exec:java  
：执行 Java 程序（主类在 pom.xml 里配置过了）  
  
你应该看到类似输出：  
```
信息: [libhajimi.so]getpid symbol is missing before init relocationAddr=RW@0x4005d6f0[libhajimi.so]0x5d6f0
[+] libhajimi.so base=0x40000000
[+] set dword_5EA18=4 qword_5EA30=0x810a3647628f0212
[+] seed(sub_2DCDC)=0xd2c13a26769ce7e0
[+] sub_2DDF8 ret=1
[+] wrote 564 bytes to: <项目目录>\unidbg_runner\unidbg_dump.bin
```  
  
**关键检查点**  
：  
1. sub_2DDF8 ret=1  
：表示解密成功（如果是 0，说明失败）  
  
1. wrote 564 bytes  
：输出文件大小应该和输入一样（564 字节）  
  
1. 文件路径：确认 unidbg_dump.bin  
 已经生成  
  
### 6. 第六步：用 Python 封装 unidbg 流程  
#### 6.1 为什么需要这个脚本  
  
虽然我们已经有了 Runner.java  
，但每次运行都要：  
1. 打开命令行  
  
1. 切换到 unidbg_runner/  
 目录  
  
1. 输入 mvn -q exec:java  
  
1. 检查输出文件  
  
这个流程对新手不友好，容易出错。所以我们写一个 Python 脚本，把这些步骤自动化。  
#### 6.2 dump_flag.py 完整代码  
  
实际脚本比较精简——验证输入文件头部、调用 Maven、验证输出文件头部，三步完成：  
```
from __future__ import annotations

import argparse
import shutil
import struct
import subprocess
import sys
from pathlib import Path

# ===== 路径常量定义 =====
# ROOT：本脚本所在的目录（即项目根目录），用于推导所有相对路径
ROOT = Path(__file__).resolve().parent
# RUNNER_DIR：unidbg Java 项目的根目录，包含 pom.xml，是 mvn 命令的工作目录
RUNNER_DIR = ROOT / "unidbg_runner"
# DEFAULT_DUMP：unidbg Runner.java 执行后输出的解密文件路径
DEFAULT_DUMP = ROOT / "unidbg_dump.bin"
# PACK_PATH：从 APK 中提取的原始加密数据包路径
PACK_PATH = (
    ROOT
    / "app"
    / "assets"
    / "hjm_pack.bin"
)

defparse_hjm_header(buf: bytes) -> tuple[int, int, int, int, int]:
    """    解析 HJM 自定义文件格式的头部，提取关键元数据。    HJM 头部结构（共 52 字节，全部采用小端序）：      偏移  字节数  字段名        说明      0     4       magic         魔数，固定为 0x314D4A48（ASCII 小端 = "HJM1"）      4     4       mode          数据模式（2 = 1-bit 单色位图）      8     4       frame_count   帧数（本题为 1 帧）      12    4       width         位图宽度（单位：像素）      16    4       height        位图高度（单位：像素）      20    32      （保留字段，此函数不解析）    Args:        buf: 文件的完整字节数据    Returns:        (magic, mode, frame_count, width, height) 五元组    Raises:        ValueError: 文件数据不足 52 字节    """
    iflen(buf) < 52:
        raise ValueError("file too small for HJM header")
    magic, mode, frame_count, width, height = struct.unpack_from("<5I", buf, 0)
    return magic, mode, frame_count, width, height

defrun_unidbg() -> None:
    """    在子进程中调用 Maven 执行 unidbg Runner.java，完成 so 加载与解密。    执行流程：      1. 检测 mvn 命令是否在系统 PATH 中（未找到则报错提示安装）      2. 检验 RUNNER_DIR 目录是否存在      3. 在 RUNNER_DIR 下执行：mvn -q -DskipTests exec:java         - -q            : 静默模式，减少 Maven 构建日志输出         - -DskipTests   : 跳过单元测试，提升执行速度         - exec:java     : 运行 pom.xml 中 mainClass 配置的主类（com.ctf.Runner）      4. 过滤输出，只打印包含 "[+]" 的关键信息行      5. 若 Maven 返回非零退出码，输出完整 stderr 并抛出 RuntimeError    注意：Runner.java 会自动搜索 libhajimi.so 和 hjm_pack.bin，          此处无需手动传递文件路径。    """
    mvn = shutil.which("mvn")  # 在系统 PATH 中查找 mvn 可执行文件
    if mvn isNone:
        raise RuntimeError("`mvn` not found in PATH. Please install Maven first.")
    ifnot RUNNER_DIR.exists():
        raise RuntimeError(f"Runner directory not found: {RUNNER_DIR}")

    cmd = [mvn, "-q", "-DskipTests", "exec:java"]
    # capture_output=True 把 stdout/stderr 捕获到变量，而不打印到终端
    proc = subprocess.run(cmd, cwd=RUNNER_DIR, text=True, capture_output=True)

    # 只打印含 "[+]" 的关键输出行，过滤 Maven 的冗余日志
    out = proc.stdout.strip()
    if out:
        for line in out.splitlines():
            if"[+]"in line:
                print(line)

    # 构建失败时打印完整 stderr，帮助定位问题（编译错误、找不到类等）
    if proc.returncode != 0:
        sys.stderr.write(proc.stderr)
        raise RuntimeError(f"unidbg runner failed with code {proc.returncode}")

defmain() -> None:
    """    主流程：验证输入文件 → 运行 unidbg → 验证输出文件。    三个步骤：      步骤 1  解析并校验 hjm_pack.bin 的文件头（确认魔数正确）      步骤 2  调用 run_unidbg() 执行解密（可通过 --skip-unidbg 跳过）      步骤 3  解析并校验 unidbg_dump.bin 的文件头（确认解密后格式正确）    命令行参数：      --skip-unidbg   跳过 unidbg 执行，仅验证已有的 dump 文件（调试用）      --dump PATH     指定 dump 输出文件路径（默认：./unidbg_dump.bin）    正常完成时打印两行 header 信息供人工核查；    任何步骤异常都会直接抛出对应类型的异常。    """
    parser = argparse.ArgumentParser(
        description="Reproduce dump pipeline: assets/hjm_pack.bin -> unidbg_dump.bin"
    )
    parser.add_argument(
        "--skip-unidbg",
        action="store_true",
        help="Do not execute unidbg; only validate existing dump/header",
    )
    parser.add_argument(
        "--dump",
        type=Path,
        default=DEFAULT_DUMP,
        help="Expected dump output path (default: ./unidbg_dump.bin)",
    )
    args = parser.parse_args()

    # ===== 步骤 1：验证原始加密包的文件头 =====
    ifnot PACK_PATH.exists():
        raise FileNotFoundError(f"assets pack not found: {PACK_PATH}")
    pack = PACK_PATH.read_bytes()
    pmagic, pmode, pframes, pwidth, pheight = parse_hjm_header(pack)
    # 校验魔数：0x314D4A48 = 小端序的 "HJM1"，确保文件格式正确
    if pmagic != 0x314D4A48:
        raise ValueError(f"Unexpected pack magic: 0x{pmagic:08x}")
    print(
        "pack_header: "
        f"mode={pmode} frame_count={pframes} width={pwidth} height={pheight} size={len(pack)}"
    )

    # ===== 步骤 2：运行 unidbg 执行解密（可通过 --skip-unidbg 跳过）=====
    ifnot args.skip_unidbg:
        run_unidbg()

    # ===== 步骤 3：验证解密后 dump 文件的文件头，确认解密成功 =====
    dump_path = args.dump.resolve()
    ifnot dump_path.exists():
        raise FileNotFoundError(f"dump not found: {dump_path}")

    dump = dump_path.read_bytes()
    dmagic, dmode, dframes, dwidth, dheight = parse_hjm_header(dump)
    # dump 的魔数应与原始 pack 完全相同，否则说明文件损坏或解密流程异常
    if dmagic != 0x314D4A48:
        raise ValueError(f"Unexpected dump magic: 0x{dmagic:08x}")
    # 位图数据大小 = (宽 × 高) ÷ 8（每像素 1 bit，8 个像素合为 1 字节）
    bitmap_len = (dwidth * dheight) // 8
    print(
        "dump_header: "
        f"mode={dmode} frame_count={dframes} width={dwidth} height={dheight} "
        f"bitmap_len={bitmap_len} size={len(dump)}"
    )
    print(f"dump_path={dump_path}")

if __name__ == "__main__":
    main()
```  
#### 6.3 运行 dump_flag.py  
```
# 正常运行（会调用 unidbg）
python dump_flag.py
```  
  
你应该看到类似输出：  
```
pack_header: mode=2 frame_count=1 width=64 height=64 size=564
[+] libhajimi.so base=0x40000000
[+] set dword_5EA18=4 qword_5EA30=0x810a3647628f0212
[+] seed(sub_2DCDC)=0xd2c13a26769ce7e0
[+] sub_2DDF8 ret=1
[+] wrote 564 bytes to: <项目目录>\unidbg_runner\unidbg_dump.bin
dump_header: mode=2 frame_count=1 width=64 height=64 bitmap_len=512 size=564
dump_path=<项目目录>\unidbg_dump.bin
```  
  
**关键检查点**  
：  
1. pack_header  
 和 dump_header  
 的 mode/frame_count/width/height  
 应该一致  
  
1. bitmap_len=512  
（64 * 64 / 8 = 512 字节）  
  
1. dump_path  
 指向正确的输出文件  
  
### 7. 第七步：提取位图数据  
#### 7.1 为什么要单独提取位图  
  
unidbg_dump.bin  
 包含完整的 HJM 文件结构（52 字节头部 + 512 字节位图）。  
  
  
我们需要：  
  
1. 提取纯位图数据（512 字节）  
  
1. 转换成可视化格式（BMP 图像、ASCII 预览）  
  
1. 为后续 OCR 做准备  
  
#### 7.2 solve_flag.py 完整代码  
  
本脚本输出的是**标准 BMP 格式**  
，可以直接用任何图片查看器打开：  
```
from pathlib import Path
import argparse
import struct

deffind_existing_path(candidates: list[Path]) -> Path:
    """    从候选路径列表中，按优先级返回第一个实际存在于磁盘上的文件。    设计意图：同一类文件可能位于不同路径（如命令行指定路径、默认路径），    通过优先级列表让调用方统一处理，而无需关心具体路径细节。    Args:        candidates: 按优先级从高到低排列的路径列表    Returns:        列表中第一个 exists() 为 True 的 Path    Raises:        FileNotFoundError: 所有候选路径均不存在时抛出，并列出全部路径供排查    """
    for p in candidates:
        if p.exists():
            return p
    raise FileNotFoundError(
        "No input file found. Expected one of: "
        + ", ".join(str(p) for p in candidates)
    )

defparse_header(buf: bytes) -> dict:
    """    解析并严格校验 HJM 文件格式的头部，返回后续处理所需的元数据字典。    HJM 文件整体布局：      字节  0 - 51 ：头部（固定 52 字节，小端序）      字节 52 - 末尾：位图数据（1-bit 单色，高位优先 MSB first）    头部各字段说明：      偏移  大小  字段          说明      0     4     magic        魔数，固定 0x314D4A48（小端 ASCII = "HJM1"）      4     4     mode         数据模式（2 = 1-bit 单色位图）      8     4     frame_count  帧数（本题固定为 1）      12    4     width        图像宽度（像素）      16    4     height       图像高度（像素）      20    32    （保留字段）    Args:        buf: 完整文件的字节数据    Returns:        包含以下键的字典：          "mode"        数据模式          "frame_count" 帧数          "width"       宽（像素）          "height"      高（像素）          "bitmap_len"  位图字节数 = (width × height) ÷ 8          "bitmap_off"  位图在文件中的起始字节偏移（固定为 52）    Raises:        ValueError: 文件过短、魔数不匹配、宽高为零、或位图超出文件范围    """
    iflen(buf) < 52:
        raise ValueError("Input is too short to contain HJM header")
    magic, mode, frame_count, width, height = struct.unpack_from("<5I", buf, 0)
    if magic != 0x314D4A48:  # 'HJM1' in little-endian
        raise ValueError(f"Bad magic: 0x{magic:08x}, expected HJM1")
    if width == 0or height == 0:
        raise ValueError("Invalid width/height in header")
    # 1-bit 位图：每像素 1 bit，8 个像素合为 1 字节，向下整除
    bitmap_len = (width * height) // 8
    end = 52 + bitmap_len
    if end > len(buf):
        raise ValueError(
            f"Bitmap out of range: need {end} bytes, file has {len(buf)} bytes"
        )
    return {
        "mode": mode,
        "frame_count": frame_count,
        "width": width,
        "height": height,
        "bitmap_len": bitmap_len,
        "bitmap_off": 52,   # 头部固定 52 字节，位图紧随其后
    }

defbits_get(bitmap: bytes, width: int, x: int, y: int) -> int:
    """    读取位图中坐标 (x, y) 处的像素值（高位优先 MSB first 格式）。    存储格式图解（以宽度 8 的第一行为例）：      字节 0：bit7  bit6  bit5  bit4  bit3  bit2  bit1  bit0               x=0   x=1   x=2   x=3   x=4   x=5   x=6   x=7    计算步骤：      1. 线性索引  idx = y × width + x   （把二维坐标展开为一维）      2. 字节索引       = idx >> 3        （等价于 idx // 8）      3. 位偏移         = 7 - (idx & 7)  （高位 = 最左边像素 = bit7）      4. 提取该位       = (字节 >> 位偏移) & 1    Args:        bitmap: 原始 1-bit 位图字节序列        width:  图像宽度（像素），用于计算行偏移        x:      列坐标，0-based，从左到右        y:      行坐标，0-based，从上到下    Returns:        0（白色/背景）或 1（黑色/前景字符笔画）    """
    idx = y * width + x           # 展开为线性像素索引
    b = bitmap[idx >> 3]          # 定位到包含该像素的字节
    return (b >> (7 - (idx & 7))) & 1  # 提取对应比特位

defwrite_bmp(bitmap: bytes, width: int, height: int, out_path: Path) -> None:
    """    将 1-bit MSB-first 位图数据写成标准单色 BMP 文件（1bpp）。    BMP 文件结构（按字节顺序）：      1. BMP 文件头      14 字节  含魔数 "BM"、文件总大小、像素数据偏移量      2. DIB 信息头      40 字节  含宽高、色深（1）、压缩方式（0=无压缩）      3. 调色板           8 字节  2 种颜色，每种 4 字节（Blue/Green/Red/Reserved）           索引 0 → 0xFFFFFF（白色，背景区域）           索引 1 → 0x000000（黑色，字符笔画）      4. 像素数据        每行字节数向上对齐到 4 的整数倍（BMP 规范强制要求）    关于高度正负值：      BMP 默认自底向上存储（文件中最先出现的行 = 图像最底行）。      在 DIB 头中传入 -height（负数），切换为自顶向下顺序，      与我们逐行读取 bitmap 的顺序完全一致，避免图像上下颠倒。    Args:        bitmap:   原始 1-bit 位图字节数据（MSB first 格式）        width:    图像宽度（像素）        height:   图像高度（像素）        out_path: 输出 BMP 文件路径    """
    # BMP 规范：每行字节数必须是 4 的倍数（不足则在行尾补 0x00 填充）
    dst_row_bytes = (width + 31) // 32 * 4

    pixel_data = bytearray()
    for y inrange(height):
        # 构造当前行的像素字节，保持 MSB first 格式与 BMP 1bpp 规范一致
        row = bytearray((width + 7) // 8)
        for x inrange(width):
            if bits_get(bitmap, width, x, y):
                # 像素为黑色（值 1）：在对应字节的对应比特位置 1
                row[x // 8] |= (1 << (7 - (x % 8)))

        # 在行尾补 0x00，确保行长度满足 4 字节对齐
        row += b'\x00' * (dst_row_bytes - len(row))
        pixel_data.extend(row)

    image_size = len(pixel_data)
    # 像素数据在文件中的起始偏移 = BMP文件头(14) + DIB信息头(40) + 调色板(8)
    offset = 14 + 40 + 8
    file_size = offset + image_size

    # 1. 构造 BMP 文件头（14 字节）
    #    格式：签名(2B) + 文件总大小(4B) + 保留1(2B) + 保留2(2B) + 像素数据偏移(4B)
    bmp_header = struct.pack("<2sIHHI", b"BM", file_size, 0, 0, offset)

    # 2. 构造 DIB 信息头（40 字节，BITMAPINFOHEADER 格式）
    #    各字段：头大小(4) + 宽(4) + 高(4，负数=自顶向下) + 色平面数(2)
    #            + 位深(2，1=单色) + 压缩方式(4，0=不压缩) + 像素数据大小(4)
    #            + X分辨率(4) + Y分辨率(4) + 调色板颜色数(4) + 重要颜色数(4)
    dib_header = struct.pack("<IiiHHIIiiII", 40, width, -height, 1, 1, 0, image_size, 0, 0, 2, 2)

    # 3. 构造调色板（每种颜色 4 字节顺序：Blue, Green, Red, Reserved）
    #    索引 0（背景）→ 纯白 0xFFFFFF；索引 1（前景）→ 纯黑 0x000000
    palette = b"\xff\xff\xff\x00" + b"\x00\x00\x00\x00"

    # 按顺序将各段写入文件
    with out_path.open("wb") as f:
        f.write(bmp_header)
        f.write(dib_header)
        f.write(palette)
        f.write(pixel_data)

defwrite_ascii_preview(bitmap: bytes, width: int, height: int, out_path: Path) -> None:
    """    将 1-bit 位图转换为 ASCII 字符画并保存为 UTF-8 文本文件。    字符映射规则：      像素值 1（黑色/笔画） → '#'（视觉上较"重"，突出字形）      像素值 0（白色/空白） → '.'（视觉上较"轻"，表示背景）    用途：无需图像查看器，直接在终端或文本编辑器中查看 flag 字符内容，    方便快速验证解密结果是否正确。    Args:        bitmap:   原始 1-bit 位图字节数据        width:    图像宽度（像素）        height:   图像高度（像素）        out_path: 输出 .txt 文件路径    """
    lines = []
    for y inrange(height):
        row = []
        for x inrange(width):
            row.append("#"if bits_get(bitmap, width, x, y) else".")
        lines.append("".join(row))
    out_path.write_text("\n".join(lines), encoding="utf-8")

defmain() -> None:
    """    主流程：读取 HJM 格式文件 → 提取纯位图数据 → 输出三种格式文件。    输出文件（由 --out-prefix 指定前缀，默认 bitmap_pre_ocr）：      <prefix>.bin   原始位图字节数据（可用 hex 编辑器查看裸字节）      <prefix>.bmp   标准 1bpp BMP 图像（可直接用图片查看器打开）      <prefix>.txt   ASCII 字符画预览（终端直接可读，无需任何工具）    命令行参数：      -i / --input       显式指定输入文件路径（默认自动搜索 unidbg_dump.bin）      -o / --out-prefix  输出文件名前缀（默认：bitmap_pre_ocr）    """
    parser = argparse.ArgumentParser(
        description="Extract pre-OCR bitmap from unidbg_dump.bin / hjm_pack.bin as BMP"
    )
    parser.add_argument(
        "-i",
        "--input",
        type=Path,
        default=None,
        help="Optional explicit input file path",
    )
    parser.add_argument(
        "-o",
        "--out-prefix",
        type=Path,
        default=Path("bitmap_pre_ocr"),
        help="Output prefix for .bin/.bmp/.txt",
    )
    args = parser.parse_args()

    # 构建候选路径列表（命令行指定的路径优先级最高，其次是默认 dump 文件）
    candidates = []
    if args.inputisnotNone:
        candidates.append(args.input)
    candidates.extend(
        [
            Path("unidbg_dump.bin"),  # unidbg 解密后的 dump 文件（通常首选）
        ]
    )
    # 找到第一个实际存在的文件作为输入
    in_path = find_existing_path(candidates)
    buf = in_path.read_bytes()

    # 解析头部，获取图像尺寸和位图区域的偏移量
    hdr = parse_header(buf)
    off = hdr["bitmap_off"]          # 位图数据起始偏移（头部结束后，固定为 52）
    end = off + hdr["bitmap_len"]    # 位图数据结束偏移（不含此位置）
    bitmap = buf[off:end]            # 切片提取：仅保留纯位图字节，去掉文件头

    # 根据前缀生成各输出文件的完整路径
    raw_path = args.out_prefix.with_suffix(".bin")  # 原始位图字节
    bmp_path = args.out_prefix.with_suffix(".bmp")  # 标准 BMP 图像
    txt_path = args.out_prefix.with_suffix(".txt")  # ASCII 字符画

    # 依次写出三种格式
    raw_path.write_bytes(bitmap)                              # 直接写入原始字节
    write_bmp(bitmap, hdr["width"], hdr["height"], bmp_path) # 生成标准 BMP
    write_ascii_preview(bitmap, hdr["width"], hdr["height"], txt_path)  # 生成字符画

    # 打印摘要，便于确认路径和参数是否正确
    print(f"input={in_path}")
    print(
        "header: "
        f"mode={hdr['mode']} frame_count={hdr['frame_count']} "
        f"width={hdr['width']} height={hdr['height']} bitmap_len={hdr['bitmap_len']}"
    )
    print(f"bitmap_raw={raw_path.resolve()}")
    print(f"bitmap_bmp={bmp_path.resolve()}")
    print(f"bitmap_preview={txt_path.resolve()}")

if __name__ == "__main__":
    main()
```  
#### 7.3 运行 solve_flag.py  
```
# 从 unidbg_dump.bin 提取位图
python solve_flag.py
```  
  
你应该看到类似输出：  
```
input=unidbg_dump.bin
header: mode=2 frame_count=1 width=64 height=64 bitmap_len=512
bitmap_raw=<项目目录>\bitmap_pre_ocr.bin
bitmap_bmp=<项目目录>\bitmap_pre_ocr.bmp
bitmap_preview=<项目目录>\bitmap_pre_ocr.txt
```  
#### 7.4 查看位图内容  
##### 方法 1：直接查看原始位图bitmap_pre_ocr.bmp  
  
  
##### 方法 2：用文本编辑器打开bitmap_pre_ocr.txt  
```
................................................................
................................................................
（中间省略空白行）
................................................................
..#####.#......###...###....##..#...#...###.#...#.#...#..###....
..#.....#.....#...#.#...#...#...#...#....#..##.##.#...#.#...#...
..####..#.....#...#.#.......#...#####....#..#.#.#.#...#.#...#...
..#.....#.....#####.#.###..#....#...#....#..#...#.#.#.#.#####...
..#.....#.....#...#.#...#...#...#...#....#..#...#.#.#.#.#...#...
..#.....#.....#...#.#...#...#...#...#.#..#..#...#.##.##.#...#...
..#.....#####.#...#..###....##..#...#..##...#...#.#...#.#...#...
................................................................
..####....###..###...###...###...###..#...#.####..#.....####....
..#...#....#..#...#.#...#.#...#.#.....##..#.#...#.#.....#...#...
..#...#....#......#.#..##.....#.#.....#.#.#.#...#.#.....#...#...
..####.....#.....#..#.#.#....#..####..#..##.####..#.....#...#...
..#........#....#...##..#...#...#...#.#...#.#...#.#.....#...#...
..#.....#..#...#....#...#..#....#...#.#...#.#...#.#.....#...#...
..#......##...#####..###..#####..###..#...#.####..#####.####....
................................................................
..............................##................................
...............................#................................
...............................#................................
................................#...............................
...............................#................................
...............................#................................
..............................##................................
................................................................
（后面省略空白行）
```  
  
**最终 flag**  
：FLAG{HJMWAPJ2026NBLD}  
哈基米吾爱破解2026南北绿豆？？？！！！  
### 8. 完整复现流程总结  
#### 8.1 一次性运行所有步骤  
```
# 第一步：生成解密后的 dump
python dump_flag.py

# 第二步：提取位图并生成预览
python solve_flag.py

# 第三步：查看 type bitmap_pre_ocr.txt 或者直接打开 bitmap_pre_ocr.bmp

```  
#### 8.2 预期输出检查清单  
<table><thead><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">步骤</span></section></th><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">文件</span></section></th><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">大小</span></section></th><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">关键内容</span></section></th></tr></thead><tbody><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">1</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">unidbg_dump.bin</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">564 字节</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">sub_2DDF8 ret=1</span></code></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);background-color: rgb(246, 248, 250);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">2</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">bitmap_pre_ocr.bin</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">512 字节</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">原始位图数据</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">2</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">bitmap_pre_ocr.bmp</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">~574 字节</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">BMP 图像</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);background-color: rgb(246, 248, 250);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">2</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><code style="overflow-wrap: break-word;font-family: Consolas, Monaco, &#34;Andale Mono&#34;, monospace;"><span leaf="">bitmap_pre_ocr.txt</span></code></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">~4KB</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">ASCII 预览</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">3</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">终端输出</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">-</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">可见的 flag 文本</span></section></td></tr></tbody></table>#### 8.3 如果某一步失败怎么办  
##### 问题 1：dump_flag.py 报错 "mvn not found"  
  
**原因**  
：Maven 未安装或未配置环境变量。  
  
**解决方法**  
：  
1. 下载 Maven：https://maven.apache.org/download.cgi  
  
1. 解压到任意目录（例如 C:\apache-maven-3.9.5  
）  
  
1. 添加到 PATH 环境变量：  
  
1. 打开"系统属性" → "环境变量"  
  
1. 在"系统变量"里找到 Path  
，点击"编辑"  
  
1. 添加 C:\apache-maven-3.9.5\bin  
  
1. 重新打开命令行，运行 mvn -version  
 验证  
  
##### 问题 2：dump_flag.py 报错 "sub_2DDF8 ret=0"  
  
**原因**  
：全局状态初始化不正确，导致解密失败。  
  
**可能的原因**  
：  
- beatMap  
 数据错误（检查 Runner.java  
 里的 int[] beatMap = {0, 250, 500, 750}  
）  
  
- qword_5EA30  
 计算错误（检查 sub_25CA8  
 的参数）  
  
- 字节序错误（检查 ByteOrder.LITTLE_ENDIAN  
）  
  
**调试方法**  
：  
1. 在 Runner.java  
 里添加更多日志：  
```
System.out.println("[DEBUG] beatBytes=" + Arrays.toString(beatBytes));
System.out.println("[DEBUG] qword5ea30=0x" + Long.toHexString(qword5ea30));
```  
  
1. 对比 IDA 里的预期值  
  
##### 问题 3：solve_flag.py 生成的 ASCII 预览全是乱码  
  
**原因**  
：unidbg_dump.bin  
 没有正确解密。  
  
**解决方法**  
：  
1. 检查 dump_flag.py  
 的输出，确认 sub_2DDF8 ret=1  
  
1. 如果返回值是 0，回到问题 2 的调试方法  
  
1. 如果返回值是 1 但位图还是乱码，可能是 sub_2DDF8  
 内部的解密逻辑依赖其他全局状态  
  
##### 问题 4：中文路径导致的编码问题  
  
**症状**  
：  
- Maven 报错 "Invalid byte sequence"  
  
- 文件找不到（明明存在）  
  
**解决方法**  
：  
1. 把 APK 解压目录重命名为纯英文（例如 app/  
）  
  
1. 修改 Runner.java  
 和 dump_flag.py  
 里的路径常量  
  
1. 或者在 pom.xml  
 里添加编码配置：  
```
<properties>
   <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
   <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
</properties>
```  
  
如果还有其他问题，去问 AI 吧，哈哈。  
### 9. 疑难杂症——为什么「网页验证通过，但 App 验证失败」  
#### 9.1 现象描述  
- 在网页版验证平台输入 FLAG{HJMWAPJ2026NBLD}  
，显示"正确"  
  
- 在 App 里输入同样的 flag，显示"Flag 不正确"或"验证出错"  
  
#### 9.2 根本原因：App 有额外的运行时状态检查  
##### 证据 1：verifyAndDecrypt 有状态门控  
  
在 IDA 里，verifyAndDecrypt_native  
 的伪代码（简化版）：  
```
__int64 sub_257DC(JNIEnv *env, jobject this, jbyteArray pack, jstring input)
{
  // ... 前面的代码省略 ...

  // 关键行：状态门控
  // byte_5EA40 和 byte_5EB88 是全局状态标志
  if ( (v32 | (unsigned __int8)byte_5EA40) & 1 | (byte_5EB88 != 0) )
  {
    // 只有当状态标志满足条件时，才进入解密+验证逻辑
    // ...
  }
  else
  {
    // 如果状态不对，直接返回 null（验证失败）
    return0LL;
  }
}
```  
  
**这意味着什么？**  
- 即使你的 flag 文本正确，如果全局状态不对，验证也会失败。  
  
- 这些状态标志是由 startSessionBytes  
、checkRhythm  
、updateExp  
 等函数在游戏过程中设置的。  
  
##### 证据 2：startSessionBytes 绑定在游戏生命周期  
  
在 JADX 里，Q0.C.B.d0  
 方法（游戏状态更新回调）：  
```
# 获取当前时间戳（纳秒）invoke-static {}, Landroid/os/SystemClock;->elapsedRealtimeNanos()Jmove-result-wide v2

# 调用 startSession（初始化会话状态）invoke-virtual {v4, v2, v3, v5, v6}, Lcom/zj/wuaipojie2026_2/NativeBridge;->startSession(J[II)V
```  
  
**这意味着什么？**  
- startSession  
 不是在点击"验证"按钮时调用的，而是在游戏运行过程中调用的。  
  
- 如果你没有玩游戏，直接输入 flag，startSession  
 可能没有被调用，导致状态未初始化。  
  
##### 证据 3：checkRhythm 和 updateExp 持续更新状态  
  
这两个函数会在游戏过程中被频繁调用，更新全局状态（例如 qword_5EA30  
）。  
  
如果你跳过游戏直接验证，这些状态可能是错误的。  
#### 9.3 为什么网页验证能通过  
  
网页版验证平台通常只做简单的字符串比较：  
```
# 网页后端的验证逻辑（伪代码）
defverify_flag(user_input):
    correct_flag = "FLAG{HJMWAPJ2026NBLD}"
    return user_input.strip() == correct_flag
```  
  
它不会检查 native 状态，所以只要文本正确就能通过。  
#### 9.4 小结  
  
**网页验证和 App 验证的区别**  
：  
<table><thead><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">验证方式</span></section></th><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">检查内容</span></section></th><th style="overflow-wrap: break-word;text-align: left;font-weight: 600;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">难度</span></section></th></tr></thead><tbody><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">网页</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">只检查 flag 文本</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">简单</span></section></td></tr><tr style="overflow-wrap: break-word;border-top: 1px solid rgb(198, 203, 209);background-color: rgb(246, 248, 250);"><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">App</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">检查 flag 文本 + native 运行时状态</span></section></td><td style="overflow-wrap: break-word;font-size: 14px;padding: 6px 13px;border: 1px solid rgb(198, 203, 209);"><section><span leaf="">复杂</span></section></td></tr></tbody></table>  
**对新手的建议**  
：  
- 如果只是为了学习逆向流程，拿到 flag 文本就够了（网页验证通过即可）。  
  
- 如果想完整通过 App 验证，需要理解游戏的完整状态机（这超出了本教程的范围）。  
  
### 10. 常见问题 FAQ  
#### Q1：为什么不直接用 Python 写一个 AES 解密脚本？  
  
**A**  
：因为这题的解密不是简单的 AES，而是：  
1. 需要正确的 seed（依赖全局状态）  
  
1. seed 的计算涉及复杂的 hash 函数（sub_25CA8  
）  
  
1. 手动用 Python 复现这些函数，工作量大且容易出错  
  
1. 当然，文末有我的失败Python实现，各位想挑战自己的大佬可以彻底完善这个功能  
  
用 unidbg 可以直接执行原始 native 代码，避免手动复现算法。  
#### Q2：为什么要拆成两个脚本（dump_flag.py 和 solve_flag.py）？  
  
**A**  
：职责分离，降低复杂度。  
- dump_flag.py  
：负责调用 unidbg，生成 dump  
  
- solve_flag.py  
：负责提取位图，生成预览  
  
如果合并成一个脚本，一旦出错，你不知道是 unidbg 的问题还是位图提取的问题。  
#### Q3：这个方法能用在其他题目上吗？  
  
**A**  
：核心思路可以复用，但具体实现要根据题目调整。  
  
**可复用的思路**  
：  
1. 先看 Java 层找调用链  
  
1. 再看 native 层找算法逻辑  
  
1. 用 unidbg 获取中间态（而不是一次性算出答案）  
  
1. 把复杂问题拆成简单问题  
  
**需要调整的部分**  
：  
- 函数偏移地址（每个 so 文件都不同）  
  
- 全局变量地址（每个 so 文件都不同）  
  
- 参数和返回值类型（每个函数都不同）  
  
### 11. 学习路径建议  
#### 11.1 如果你是完全零基础  
##### 第一阶段：工具熟悉（1-2 周）  
1. 学会用 7-Zip 解压 APK  
  
1. 学会用 JADX 查看 Java 代码  
  
1. 学会用 IDA 查看 native 代码  
  
1. 学会用 Python 写简单脚本  
  
##### 第二阶段：跟着本教程实操（1 周）  
1. 完整走一遍本教程的所有步骤  
  
1. 遇到问题先看 FAQ，再搜索错误信息  
  
1. 把每一步的输出都保存下来（截图或文本）  
  
##### 第三阶段：尝试类似题目（2-4 周）  
1. 找其他 Android native 题目练习  
  
1. 尝试不看 writeup，自己分析  
  
1. 卡住时再参考本教程的思路  
  
#### 11.2 如果你有一定基础  
  
**直接实战**  
：  
1. 拿到一个新题目  
  
1. 按照本教程的"决策树"分析：  
  
1. 先看 Java 层找调用链  
  
1. 再看 native 层找算法  
  
1. 判断是否需要 unidbg  
  
1. 遇到新问题时，回来查阅对应章节  
  
#### 11.3 推荐的学习资源  
  
**Android 逆向基础**  
：  
- 《Android 软件安全与逆向分析》（丰生强）  
  
- 看雪论坛 Android 版块  
  
- 吾爱破解论坛-正己-吾爱破解安卓逆向入门教程《安卓逆向这档事》  
  
**unidbg 学习**  
：  
- unidbg 官方文档：https://github.com/zhkl0228/unidbg  
  
- unidbg 示例代码：https://github.com/zhkl0228/unidbg/tree/master/unidbg-android/src/test/java/com/github/unidbg/android  
  
- 《安卓逆向这档事》第二十三课、黑盒魔法之Unidbg  
  
**IDA 使用**  
：  
- 《IDA Pro 权威指南》（第二版）  
  
- Hex-Rays 官方教程  
  
- IDA-MCP  
  
### 12. 总结：这篇教程教会了你什么(你需要有的印象与全局思维)  
#### 12.1 技术层面  
1. **完整的 Android native 逆向流程**  
：  
  
1. APK 解压 → JADX 分析 Java 层 → IDA 分析 native 层 → unidbg 模拟执行  
  
1. **关键技能**  
：  
  
1. 如何从 MainActivity  
 开始追踪调用链  
  
1. 如何在 IDA 里找 JNI_OnLoad  
 和动态注册的函数  
  
1. 如何用 unidbg 模拟 native 函数执行  
  
1. 如何处理全局状态依赖  
  
1. **工具使用**  
：  
  
1. JADX：查看 Java 代码、搜索字符串、追踪引用  
  
1. IDA：反编译 native 代码、查看全局变量、分析函数调用  
  
1. unidbg：加载 so 文件、调用函数、读写内存  
  
#### 12.2 方法论层面  
1. **"为什么"比"怎么做"更重要**  
：  
  
1. 每一步都先解释为什么要这样做，再给出具体操作  
  
1. 避免"照抄代码但不知道为什么"的陷阱  
  
1. **降维策略**  
：  
  
1. 不追求一次性解决所有问题  
  
1. 把复杂问题拆成简单问题（dump 阶段 + OCR 阶段）  
  
1. 先拿到中间态，再逐步推进  
  
1. **可复现性**  
：  
  
1. 每一步都有检查点（预期输出、文件大小、关键日志）  
  
1. 失败时能快速定位问题（是 Maven 的问题？路径的问题？还是算法的问题？）  
  
#### 12.3 心态层面  
1. **逆向不是"猜答案"**  
：  
  
1. 不是靠运气试出来的  
  
1. 每一步都有证据支撑（IDA 截图、JADX 代码、执行日志）  
  
1. **工具是辅助，理解是核心**  
：  
  
1. unidbg 能帮你执行代码，但不能帮你理解代码  
  
1. 你要知道为什么调用这个函数，为什么传这些参数  
  
1. **遇到问题不要慌**  
：  
  
1. 先看错误信息（是文件找不到？还是函数返回值不对？）  
  
1. 再查 FAQ 或搜索引擎或者问 AI  
  
1. 实在不行，回到上一个成功的检查点，重新开始  
  
**最后，祝你在逆向的道路上越走越远！再次致谢正己老师的详细教程与本次活动的技术支持~**  
  
**附录：完整文件清单**  
：  
```
project/
├── dump_flag.py                    # unidbg 流程自动化脚本
├── solve_flag.py                      # 位图提取脚本
├── unidbg_runner/                     # unidbg 项目目录
│   ├── pom.xml                        # Maven 配置
│   └── src/main/java/com/ctf/
│       └── Runner.java                # unidbg 主程序
├── app/     # APK 解压目录
│   ├── lib/arm64-v8a/libhajimi.so    # native 库
│   └── assets/hjm_pack.bin            # 数据包
├── unidbg_dump.bin                    # unidbg 输出（解密后的 dump）
├── bitmap_pre_ocr.bin                 # 原始位图数据
├── bitmap_pre_ocr.bmp                 # BMP 图像
└── bitmap_pre_ocr.txt                 # ASCII 预览（可直接看到 flag）
```  
  
**最终 flag**  
：FLAG{HJMWAPJ2026NBLD}  
### 附录：solve_flag_failed.py 为何失败（IDA-MCP 辅助复盘）  
#### TL;DR（一句话总结）  
  
solve_flag_failed.py  
 失败不是“少调几个参数”，而是**路径假设错误**  
：脚本把 seed  
 当成纯函数计算，并默认走 debug-bypass  
 种子分支，但真实 verifyAndDecrypt_native  
 会先调用 sub_25EF8  
 混入环境指纹，再基于全局状态重算 qword_5EA30  
，同时 seed  
 选择依赖 byte_5EB88/byte_5EA54/dword_5EA4C/dword_5EA50/qword_5EA38  
 等状态。结果是：即使 AES-CTR 逻辑接近正确，**输入状态不一致导致解出来的 bitmap 完全错位**  
，OCR 再严格匹配就必失败。  
  
这与 report.md  
/tutorial.md  
 的结论一致：本题关键是“状态机 + 环境混入 + 解包”，**不是单纯密码学复刻**  
。  
#### A.1 题内文档的「约束条件」总结（必要前提）  
  
来自 report.md  
 / tutorial.md  
 的关键结论：  
- verifyAndDecrypt_native  
 并不是简单比较文本，而是**先解包位图、再渲染输入文本、最后 memcmp**  
。  
  
- sub_25EF8  
 是**环境指纹混入器**  
，会被 startSessionBytes_native  
、verifyAndDecrypt_native  
、decryptFrames_native  
 多处调用，影响全局状态。  
  
- setDebugBypass  
 仅设置全局 byte_5EB88  
，影响种子来源，但不会禁用所有状态依赖。  
  
- 推荐路径是 unidbg -> dump -> Python OCR  
，而不是纯 Python 复刻整个 native 状态机。  
  
这些约束直接否定了“只要 port 了 AES 就行”的路线。  
#### A.2 关键证据 1：verifyAndDecrypt_native 先混入环境，再重算 qword_5EA30  
  
来自 IDA 反编译（verifyAndDecrypt_native @ 0x257dc  
）：  
```
v18 = sub_25EF8(a1);                     // 环境混入
v25 = dword_5EA50 + HIDWORD(v18);
v26 = dword_5EA4C | (unsignedint)v18;
...
dword_5EA4C |= v18;
dword_5EA50 = v25;
...
// 基于 v25/v26 重算 qword_5EA30
v28 = (v25 ^ (v26 << 32) ^ 0x1A8CBC5B802E097C) - 0x61C8864680B583EB;
v29 = 0x94D049BB133111EB * (0xBF58476D1CE4E5B9 * ...);
v30 = v29 ^ (v29 >> 31);
if (v30) { v27 ^= (v31 >> 35) ^ v30; }
qword_5EA30 = v27;
```  
  
这说明 **qword_5EA30 在 verify 阶段再次被改写**  
，不是“只依赖 beatMap 的纯函数”。  
  
而 solve_flag_failed.py  
 只做了：  
```
qword_5ea28 = sub_25ca8(beat_bytes, 0x1A8CBC5B802E097C)
qword_5ea30 = qword_5ea28
```  
  
这在真实路径上只相当于 startSession  
 初始态的一部分，**缺失后续混入步骤**  
。  
#### A.3 关键证据 2：seed 来源不是固定 sub_2DCDC，而是「状态分支」  
  
依旧来自 verifyAndDecrypt_native @ 0x257dc  
：  
```
if ((v32 | (unsigned __int8)byte_5EA40) & 1 | (byte_5EB88 != 0)) {
    if (byte_5EB88)
        v48 = sub_2DCDC();          // 仅 debug-bypass 才走这条
    else
        v48 = qword_5EA38;          // 正常路径
    if (v32)
        v49 = v48 ^ 0xA5A5A5A5;     // 额外异或
    else
        v49 = v48;
    if ((unpack_mode2_bitmap(..., v49, ...) & 1) == 0) return null;
}
```  
  
而 solve_flag_failed.py  
 直接假设：  
```
seed = sub_2dcdc(qword_5ea30, dword_5ea18)
```  
  
这等于**默认开了 setDebugBypass(true)**  
，同时忽略了 qword_5EA38  
、v32  
 的控制分支。只要 byte_5EB88  
 没设、或 v32  
 状态不同，**seed 就必定错**  
。  
#### A.4 关键证据 3：sub_25EF8 确实在做环境指纹  
  
sub_25EF8 @ 0x25EF8  
 的反编译里出现大量环境探测：  
```
v325 = access("/proc/zoneinfo", 4);
v326 = access("/sys/devices/system/cpu/online", 4);
...
__system_property_get("ro.build.fingerprint", ...);
__system_property_get("ro.product.model", ...);
__system_property_get("ro.product.device", ...);
__system_property_get("ro.hardware", ...);
__system_property_get("ro.product.brand", ...);
...
FindClass("java/lang/String");
GetMethodID(..., "length", "()I");
FindClass("no/such/Class");
...
return v332 | (unsignedint)v340 | (unsigned __int64)(v324 << 32);
```  
  
这意味着：在不同环境（真机 / 模拟器 / unidbg / 本地 Python）里，sub_25EF8  
 的返回值几乎必然不同，进而影响 dword_5EA4C/dword_5EA50/qword_5EA30  
。  
  
**脚本没有任何环境混入模拟**  
，所以从 seed 开始链条就偏了。  
#### A.5 关键证据 4：sub_2DDF8 的解包依赖 qword_5EA30 + seed  
  
unpack_mode2_bitmap @ 0x2DDF8  
 明确依赖这两个全局/入参：  
```
derive_mix16(a2, qword_5EA30);   // a2 = seed
...
v33 = hash64_mix(&v56, 32, 0x1357);
v34 = hash64_mix(&v56, 32, 0x2468);
...
// AES-CTR nonce 从 qword40/dword48 + chunk_index + w20(qword_5EA30) 拼装
WORD2(v56) ^= (unsigned __int16)v26 ^ WORD2(v26);
BYTE6(v56) ^= ((unsignedint)v26 ^ HIDWORD(v26)) >> 16;
BYTE7(v56) ^= ((unsignedint)v26 ^ HIDWORD(v26)) >> 24;
aes_ctr_xor_inplace(...)
```  
  
这意味着：seed/qword_5EA30  
 **任意一处错误**  
都会导致 key/nonce 派生链路整体失配，AES-CTR 结果完全错位。  
#### A.6 失败原因归因（对照 solve_flag_failed.py）  
  
核心问题不是 AES 细节，而是**状态模型假设错误**  
。  
1. solve_flag_failed.py  
 只把 qword_5EA30  
 当成 “beatMap 的哈希值”。  
实际：qword_5EA30  
 在 verifyAndDecrypt_native  
 内会根据 sub_25EF8  
 的环境反馈和全局状态重算。  
  
1. 脚本默认 seed = sub_2DCDC(...)  
，等价于“开启 debug bypass”。  
实际：正常路径会用 qword_5EA38  
，并可能再异或 0xA5A5A5A5  
。  
  
1. 脚本没有模拟 sub_25EF8  
 的环境混入。  
结果：dword_5EA4C/dword_5EA50/byte_5EA54  
 状态与真实环境不一致，导致 qword_5EA30  
 与 seed  
 继续偏移。  
  
1. OCR 太严格。decode_key_from_bitmap  
 只接受完整 5x7 点阵的**字模完美匹配**  
，遇到任何“装饰/噪声/局部错位”都会 fail；而一旦 seed 错，位图噪声极高，OCR 肯定失败。  
  
#### A.7 为什么 unidbg 路线成功（而 Python 复刻失败）  
  
unidbg 解决了最关键的问题：**让 native 自己处理状态与环境依赖**  
。  
- sub_25EF8  
 的环境探测在 unidbg 内执行，至少可得到一致输出。  
  
- qword_5EA30  
 / qword_5EA38  
 / byte_5EA54  
 等全局状态在 native 内保持一致。  
  
- unpack_mode2_bitmap  
 能稳定返回正确解包结果（ret=1  
），再交给 Python OCR。  
  
这也正是 tutorial.md  
 强调的“先拿中间态，再 OCR”的路线。  
#### 附：本次复盘引用的关键文件（包含solve_flag_failed.py）见左下角原文  
  
  
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
  
