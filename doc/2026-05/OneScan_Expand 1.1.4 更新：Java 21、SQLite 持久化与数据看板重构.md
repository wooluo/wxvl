#  OneScan_Expand 1.1.4 更新：Java 21、SQLite 持久化与数据看板重构  
原创 在稻香村养猪
                    在稻香村养猪  鉴帷安全   2026-05-24 17:52  
  
OneScan_Expand 1.1.4 做了一次偏底层和流程层面的更新。  
  
这次不是单纯增加几个 UI 按钮，而是围绕数据看板的数据生命周期做了整理： 从运行期数据展示，到本地持久化，再到历史加载和字段级导出，整体流程更完整。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/CrThU6KH4h4BznNHVLmVSYJFcUjibgw0rNlE1yZU7qN98EUT2mrDQRPqSyib1joJRC5YgDicUibl0DZPmlVy3yGnRbaicYscEDDXj7gn9fN3iakUU/640?wx_fmt=png&from=appmsg "")  
## 1. 项目升级到 Java 21  
  
本版本已经将项目构建目标升级到 Java 21，不再兼容 JDK 8。  
  
升级后，项目可以逐步使用 Java 21 的语言特性和标准库能力，后续维护也会更方便。 对于老环境来说，这是一个明确的兼容性变化：如果还在 JDK 8 环境下构建或运行，需要先升级 Java 环境。  
## 2. 新增 SQLite 持久化模块  
  
本次新增了基于 SQLite 的本地持久化能力，用于保存数据看板中的任务数据。  
  
新增的持久化逻辑主要覆盖：  
- 数据记录保存  
  
- 字段级数据写入  
  
- 历史数据标签管理  
  
- 按标签加载历史数据  
  
- CSV 导出  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/CrThU6KH4h6SicsGkFI6gN2Sibl10xtrUdsKTEibjoU8Q57FcJwFvThq3gGibQCtwuCRLP1wFCQHNYK5Z1TSPlmVQesfB9GEJf46SKxGyzGxOIE/640?wx_fmt=png&from=appmsg "")  
  
持久化数据不再只依赖当前 Burp 会话，关闭 Burp 后仍然可以从 SQLite 中读取历史结果。  
## 3. 数据标签自动生成  
  
之前如果每次保存都需要手动设置标签，操作成本比较高。 新版改为自动生成时间戳标签，精确到秒。  
  
标签格式用于区分不同保存批次，导入时可以按标签读取对应历史数据。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/CrThU6KH4h4yf0AwgXIhK8iccHySSmYqhdM8fuk9T9lgSiceWKcWP9dE5shjeMs5lqiaDbGViaS70l4s7QVWLib3v9xcTHeVBVB74RnYWVJhz8x8/640?wx_fmt=png&from=appmsg "")  
  
这样做的好处是：  
- 不需要每次手动输入标签  
  
- 每次保存天然具备时间标识  
  
- 历史数据更容易按时间追溯  
  
## 4. 新增手动保存与自动保存  
  
数据看板新增了“保存”按钮，用于手动保存当前表格数据。  
  
同时，设置中增加了自动保存间隔配置。 自动保存会按照配置间隔触发，并且会尽量避免无意义的重复保存。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/CrThU6KH4h6nXIwEeQ6OhiciaF9wJRV5jrzZpPXLNdaibLZmEsutKxPSuAoyRWiaNrr254NEHJpBJ3bCHEcRE7szowGKnIQ0RSEpRdG86xyKTdg/640?wx_fmt=png&from=appmsg "")  
  
这对长时间运行的扫描任务比较有用，可以降低中途关闭或异常退出导致数据丢失的风险。  
## 5. 字段级选择性持久化  
  
不同任务关注的字段不一样，如果全部保存，会增加无关数据。 新版支持配置持久化字段，只保存需要的字段。  
  
配置方式也做了调整，从原来的直接展示改为弹窗选择，减少设置页面占用空间。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/CrThU6KH4h6DQfxgWzYwvREWn92cZ7jY3icBg0vsqXibjUuRAPUkNAyfMxhLb1AUGEmCPicTBmMQUL5u7ASfXn3wYMNtT9GXokKzljP7FjUIbQ/640?wx_fmt=png&from=appmsg "")  
  
这部分主要解决两个问题：  
- 控制 SQLite 中保存的数据范围  
  
- 降低导出和复盘时的无效字段干扰  
  
## 6. 数据导入与导出流程调整  
  
数据看板现在支持从 SQLite 中导入历史数据。 导入时先选择数据标签，再将对应数据重新加载到数据面板。  
  
导出按钮也做了精简，操作入口更短、更直接。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/CrThU6KH4h5D9iaqHsOH5DZvr4gtI1JeHg6ALeGd6kLyG741WJW4UxfscJNHflyAUt0icSC09C2tnklvZVyz0FHp11Sr0LmPFheEdFPLcrLias/640?wx_fmt=png&from=appmsg "")  
  
整体流程变成：  
  
扫描产生数据 -> 手动保存或自动保存到 SQLite -> 按时间戳标签导入历史数据 -> 按需导出数据  
## 7. 对历史数据对象做了兼容处理  
  
由于从 SQLite 中导入的数据不再一定包含 Burp 原始请求响应对象，因此相关交互逻辑做了保护处理。 对于没有原始 IHttpRequestResponse 的历史数据，避免在选择、发送到 Repeater、Hash 计算等场景中触发异常。  
  
这让历史数据更适合用于查看、筛选和导出，而不是强行假设它仍然是运行期请求对象。  
## 8. 构建方式调整  
  
项目现在支持 Maven Wrapper 构建。  
  
Linux / macOS：  
  
./mvnw clean package  
  
Windows：  
  
.\mvnw.cmd clean package  
  
构建产物：  
  
extender/target/OneScan_Dev-v1.1.4.jar  
## 总结  
  
OneScan_Expand 1.1.4 的核心变化是：  
  
Java 21 化 + 数据看板持久化 + 历史数据可回看。  
  
如果你主要把它当作 Burp 中的结果看板，这一版会明显更完整。 数据不再只停留在当前会话里，而是可以保存、恢复、筛选和导出。  
  
#[#链接直达]()  
 latest:https://github.com/Zmz-c/OneScan_Expand/releases/download/1.1.4/OneScan_Dev-v1.1.4.jar  
  
  
