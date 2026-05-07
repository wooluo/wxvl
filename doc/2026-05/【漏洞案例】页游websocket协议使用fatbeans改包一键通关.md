#  【漏洞案例】页游websocket协议使用fatbeans改包一键通关  
原创 挖个洞先
                        挖个洞先  挖个洞先   2026-05-07 01:38  
  
**“**  
   
你拥有的一切都过期了，你热爱的一切都旧了，所有你曾经嘲笑过的，你变成他们了。——《Forever Young》**”**  
  
  
  
  
01  
  
—  
  
  
操作步骤  
  
  
  
1、A活动  
当前进度通过第六关  
  
![](https://mmbiz.qpic.cn/mmbiz_png/vRTpz13XcL8ZU7SIFya3RFIW7x7MOSrVjeDvWS6PHFP4orSzJCQT8ZoqGHiccOS6yMrOiaz0Bc71X36r0nrf3VjUAEibgnIggS9B0ia6iaPTUL6w/640?wx_fmt=png&from=appmsg "")  
  
  
2、  
重放修改06为09发包  
```
https://fatbeans.cn/
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vRTpz13XcL9dpZRHjmia2X9OJCRQNtEdRI6UzL7giceh4ug3ic6O1c2YsEicAibOicBDf4DyDN87QqaMS0noibjlDECnwJFhAhzLwblkVFwicWlUIO0/640?wx_fmt=png&from=appmsg "")  
  
  
3、  
一键通关07-09关卡  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vRTpz13XcLic7WHOq42P1X4NgEIII8PjRsWyIoRRtuCaL3RARaLa8g1rsPF09qibzBdVtGNmSuhwCmz9cwyvsUFxKWiadTHomcrJ7WYQa4m1SQ/640?wx_fmt=png&from=appmsg "")  
  
  
4、  
修改21发包，也就是33关卡  
  
![](https://mmbiz.qpic.cn/mmbiz_png/vRTpz13XcLicQVbvMzlsAhYLicZOQcvWCF5StJ5GrVC4nJiayfic7mghpRnI2MxtibiaLHUPhFeiafG7o9srWVoqb58CxrG1wOBsUlFTTibVF0RMaus/640?wx_fmt=png&from=appmsg "")  
  
  
5、  
一键通关10-33，正常领取奖励  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vRTpz13XcLicy2ZadWad8ibXGJwzGv7LEc9mMDEFmrUorgakOQntjU8P3D6jkreoPbX0YYkibVkKbOA19YQ8BHwokP2934NzuqbUWNDavsSXvw/640?wx_fmt=png&from=appmsg "")  
  
  
6、B活动  
当前进度130分  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vRTpz13XcLicOXQibYumW7UvicWG6GhicsDFt6etx1iaoQbEL4I7j4h56lxDF7Csq0laxbqnB2frYMKEybwdAnSM8OUAye9SxaPUaaQLrBfMEbcI/640?wx_fmt=png&from=appmsg "")  
  
  
7、  
构造数据包，代表200分  
```
C8 的二进制是：1100 1000，最高位是 1（表示数据还没完）。去掉最高位，剩下有效数据 100 1000。
01 的二进制是：0000 0001，最高位是 0（表示数据结束了）。去掉最高位，剩下有效数据 000 0001。
高位：000 0001
低位：100 1000
拼接后的完整二进制：000000011001000
二进制的 11001000 转换成十进制：
128 + 64 + 8 = 200
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/vRTpz13XcLic3lrEW27UCjia3cmCkRygLyyn0IjV27Yw1ZNXgptHCx4FnQmc44dQ262CoaRFSvnHQWRiayXM95qw0CjwAMNnRnpzmJTRibRGNxg/640?wx_fmt=png&from=appmsg "")  
  
  
8、  
一键通关140-200  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vRTpz13XcL9V8kPFQ7QHukgjZXWeqK89Mu1nlOt4DUxkxWqDJWXDia3qVIs9uMCTITayYqYIV8VIZ9mE1Iya6GZzxvfVlrRiceoiaT5GnBQD6E/640?wx_fmt=png&from=appmsg "")  
  
  
9、  
构造数据包，代表300分  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vRTpz13XcL9e5wqKbJ2ic3vLYMnKdBUCiaUPXJO2PHbkT3KcwPPguxCy1OHh5jw2PRkibrpsBo67jia8qIFvXY9LFjB2vhFOuakaZrCkkO8a8ME/640?wx_fmt=png&from=appmsg "")  
  
  
10、  
一键通关210-300，正常领取  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vRTpz13XcL9UCPSibEJ616X4DNSoIoaMRAgicANaTpTb6am6wL9tx1TafOWQgdNPjKqxEeezUrT782AyFVoxibGIejz3UxB86ufGLLvDkXUVx0/640?wx_fmt=png&from=appmsg "")  
  
  
  
