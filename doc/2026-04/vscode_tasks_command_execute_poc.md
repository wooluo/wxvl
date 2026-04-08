#  vscode_tasks_command_execute_poc  
 TtTeam   2026-04-08 05:45  
  
通过 .vscode/tasks.json 在打开文件夹时执行任意命令  
  
无工作区信任提示：光标  
  
工作区信任提示：VS Code、Antigravity、TRAE  
  
触发步骤  
- 下载或克隆此存储库，如果是 ZIP 文件，请将其解压缩。  
  
- 启动 Cursor / VS Code / Antigravity / TRAE，然后选择文件 → 打开文件夹。  
  
- 选择解压后的文件夹。  
  
- 验证 PoC 触发器：检查终端输出并注意计算器的启动。参考屏幕截图：./screenshot/。  
  
PoC密钥：.vscode/tasks.json  
  
步骤（推荐）：  
- 按 Ctrl + Shift + P（Mac：⇧ Shift + ⌘ Command + P）  
  
- 打开用户设置 → 功能 → 允许自动任务 → 设置为“关闭”  
  
- 如果 Ctrl + Shift + P 直接打开用户设置（JSON），只需设置：task.allowAutomaticTasks: "off"  
  
- 这适用于 Cursor / VS Code / Antigravity / TRAE 以及基本上任何基于 VS Code 构建的 IDE。  
  
如果您使用的是 Cursor，您还可以启用：  
  
安全 → 工作区 → 信任 → 已启用  
  
启用此功能后，首次打开新文件夹时会收到工作区信任警告。即使您选择信任该工作区，一旦“允许自动任务”关闭，隐藏在 .vscode/tasks.json 中的命令也将不再自动运行。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/5EoVWMDZd6FrAXd45gJwnWgkfjD2ETHNibxNfXxUvBpuayYKwULJtcibic4SlulBBOMUdrjuWFoMQXjiczSTPwKhqsaG8X32Wfrucu5dD3hKP9E/640?wx_fmt=png&from=appmsg "")  
  
