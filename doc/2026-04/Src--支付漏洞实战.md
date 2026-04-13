#  Src--支付漏洞实战  
 赤弋安全团队   2026-04-13 01:31  
  
**[免责声明]**  
  
**请勿利用文章内的相关技术从事非法测试，由于传播、利用本公众号所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，本公众号及作者不为此承担任何责任，一旦造成后果请自行承担！**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eWHbZ5PaxD9icHWzC8CHWomzh4erhHy4h5hA6frbBMxkwcqC8jnLIiaPgxquQwicuxRxKBicrSrTk8aeibteFNP6gSg/640?wx_fmt=png&from=appmsg "")  
  
当时拿到了感觉好难，不知道从哪里下手，到处点点，后面看到一个新上线没多久的商品，哎~众所周知，新上的出成果的几率大  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eWHbZ5PaxD9icHWzC8CHWomzh4erhHy4hv1CLscic2Y3huLbngO4zZgOUicPZKBflaU1twIU8F05mlPKXEsOAZn2w/640?wx_fmt=png&from=appmsg "")  
  
看到这个嘛，必然尝试哈支付漏洞呗，商品大部分无非只能在挑选商品的时候和创建订单的时候修改数据。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eWHbZ5PaxD9icHWzC8CHWomzh4erhHy4h50ekVUnjbtoYELu0VicNqbNBmeKHoj8BzYrW08XynzkKicCld2UdulzQ/640?wx_fmt=png&from=appmsg "")  
  
然后就进行抓包修改金额，尝试修改为0.01，发现修改失败，然后修改0，后面发现修改是能修改，但是支付时显示异常。（失败过程就忽略了）  
  
多种尝试下修改为1  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eWHbZ5PaxD9icHWzC8CHWomzh4erhHy4hQ9F6gJk5zSgXCSQOtt3IicXN5L7G1zVvyib2o9G9SsFY3VR60A4lMlbw/640?wx_fmt=png&from=appmsg "")  
  
再看看返回包，是修改成功的  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eWHbZ5PaxD9icHWzC8CHWomzh4erhHy4hQK5oJI93wZ1o4Mia3v3K0Kf3uelugVj98NFQPmPmd0FNHR4icKia0qC3A/640?wx_fmt=png&from=appmsg "")  
  
放包后，直接跳到了支付页面  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eWHbZ5PaxD9icHWzC8CHWomzh4erhHy4hqVbHZ5X5xWUj60YpUz1lvnJ7eNPFIQZ0365IGzWmppIrePfKJGic9sA/640?wx_fmt=png&from=appmsg "")  
  
                                        ![](https://mmbiz.qpic.cn/mmbiz_png/eWHbZ5PaxD9icHWzC8CHWomzh4erhHy4hBT4ec8JzfDHl15ojzNtgLOUdF1AnOmjcmibj6RJ7aEtfaKia4HTolfkA/640?wx_fmt=png&from=appmsg "")  
  
  
直接支付  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eWHbZ5PaxD9icHWzC8CHWomzh4erhHy4hQJ90auyNtCalib6ODiaiadYhJJvbD90bIwKahgEtOUBMBURmUcCFQqACA/640?wx_fmt=png&from=appmsg "")  
  
成功拿下  
  
过程比较简单，总而言之支付漏洞就是不断尝试，查看他的数据包，去找，有可能他需要改很多返回包才可以篡改数据  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eWHbZ5PaxD9icHWzC8CHWomzh4erhHy4h5SAk5HjF0ziaFo7H9dqaoj5cxImzSDAkFrRnw2apAflm2Yibu8m4Jueg/640?wx_fmt=png&from=appmsg "")  
  
  
