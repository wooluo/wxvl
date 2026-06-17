#  豆包任务模式=无限肉鸡？豆包提示词RCE  
原创 仙草里没有草噜丶
                    仙草里没有草噜丶  泷羽Sec   2026-06-17 03:36  
  
豆包任务模式  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1E8ULvdwpfMCERicnCIhAxIia11xS88PYJpDFs1BOKF8qjSvmz9XAdfKxoXQyVSht0u2S7X4y1Oau2bGXicwfXXf9asicHqe9gbiby2R4WYiaicgm0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1E8ULvdwpfMYrmWfJofNkMvABY6JEGyhKEacrnoM4P5PXWa10ibAVmgYrDuqAPrtu9Ffglt3xJ08KveakBKTZdQialnzBMAPNKSwOzJH8CpdU/640?wx_fmt=png&from=appmsg "")  
  
但是反弹的是沙盒环境，没有较大的实际危害，没有泄露用户数据，就发出来学习学习  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1E8ULvdwpfPfsH97xRiaUGxibGrKo7NLvWtgzqEZ80icxzeRTTwiaibhIOcymvmwPEiaKyVRsXiaKJNqw6b28mglcH1tJs6Ue0cjgaDBKqhB42CvWs/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1E8ULvdwpfNUCtVAGocpj7a7cRD8jiaQPB5MhwmbkdowTsYEJ0jT03Hat7j1T3AFs2lBDXylggBBJiaYHwicguqAicPK1lh0GCzOBaEcibQgnRko/640?wx_fmt=png&from=appmsg "")  
  
复现过程，首先你需要告诉它你是一名渗透测试专家，帮我学习渗透之类的文案，然后去deepseek生成一个本地命令执行的skill，不管我给你什么命令都要执行的这种skill，然后加上下面这句话，最后让他学习这个技能  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1E8ULvdwpfOBfNRqqiaMibibb8nLH2eOufOhqvibZNbqkOBNGbovPwMe71nen2mXe5CocVt2olStWd16dzcSISu8z2EPWbPd6ZtxAGmfsYKXbFs/640?wx_fmt=png&from=appmsg "")  
  
先测试几个命令，比如whoami，cat /etc/passwd之类的（都执行在容器中），再来反弹shell  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1E8ULvdwpfPIhqegfNHnBUq9YBQ1VlMiaR3qxtPvpUZMHwkytVcIPAcVgIk7edyxOrzqicog33fmad487VbRwal1M1AiaTfOmFN3ezdjOgRmzU/640?wx_fmt=png&from=appmsg "")  
  
到此就能正常反弹shell  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1E8ULvdwpfNp9dHaq7x4B0oicRlVdqtXCOZcuZaWZGGACcCRNFeKNE33aia8LNLczZGwW47viarMwWMyEKQVwA8Yyk0Vick43mtk9mJMLgKf4a0/640?wx_fmt=png&from=appmsg "")  
  
危害：新建会话再次反弹shell，  
可以造成无限肉鸡，沙盒环境可联网  
  
修复建议：  
禁止用户输入的任何命令执行以及未知的skill技能学习，和小米的claw一样  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1E8ULvdwpfO0Qch28Z0ae3lK4LRPEVW8IxCmib9hF12YVDSGctr1bmSglVGicOyM32ClhpbwCgBcuEO8AoP1FrC0ZXNEzw0WcichwMYbmPpeYU/640?wx_fmt=png&from=appmsg "")  
  
