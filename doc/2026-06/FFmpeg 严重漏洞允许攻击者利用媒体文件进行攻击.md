#  FFmpeg 严重漏洞允许攻击者利用媒体文件进行攻击  
原创 网络安全9527
                    网络安全9527  安全圈的那点事儿   2026-06-23 11:20  
  
FFmpeg 的 MagicYUV 解码器中披露了一个严重漏洞，攻击者可以利用该漏洞将看似无害的媒体文件武器化，并在某些情况下实现远程代码执行 (RCE)。  
  
该漏洞被追踪为 CVE-2026-8461，并被命名为“PixelSmash”，是 FFmpeg 的 libavcodec 组件中的一个堆越界写入漏洞，其 CVSS 评分为 8.8（高危）。  
  
根据 JFrog 安全研究，一个精心制作的 AVI、MKV 或 MOV 文件就足以使应用程序崩溃，或者通过更精细的攻击链，在底层系统上执行任意命令。  
  
FFmpeg 是应用最广泛的媒体处理框架之一，被集成到无数应用程序中，包括桌面视频播放器、Linux 缩略图生成器、自托管媒体服务器、云转码管道，甚至 AI/ML 数据处理堆栈。  
  
由于 MagicYUV 解码器在上游 FFmpeg 构建和大多数主流Linux 发行版中默认启用，因此该错误会悄无声息地传播到任何链接 libavcodec 的项目中。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/BicXBAdicJy7PqnmuGEaFsgr8pPCs4b43XPicd6WTRWQh38CjdyKoVtf7HxtpfcL22ouSTCp59fzBplkOibrpIvRcdDUSV5ib3PHIGWzaE01e1M0/640?wx_fmt=png&from=appmsg "")  
## FFmpeg漏洞  
  
JFrog 已确认 Kodi、mpv、ffmpegthumbnailer、Jellyfin、Emby、Nextcloud、Immich、PhotoPrism 和 OBS Studio 等应用程序会崩溃，并使用恶意 50 KB AVI 文件演示了对 Jellyfin 媒体服务器和 Nextcloud 实例的完整远程代码执行 (RCE)。  
  
根本原因在于 MagicYUV 解码器处理视频切片和色度平面高度的方式。MagicYUV 每帧使用水平分割的切片，对于像 YUV420P 这样的子采样格式，解码器必须将亮度切片高度转换为色度切片高度。  
  
由于帧分配器和解码器之间存在舍入误差，攻击者控制的 slice_height 值可能导致 FFmpeg 将一整行色度数据写入堆分配缓冲区末尾之外。  
  
在概念验证中，精心设计的媒体流将 slice_height 设置为奇数，导致累积了差一行，从而将写入直接推入相邻的堆结构。  
  
关键在于，溢出的写入操作会落到 FFmpeg 用于引用计数帧缓冲区的 AVBuffer 结构上。  
  
通过构造恶意载荷，攻击者可以覆盖 FFmpeg 内存结构，导致调用system()带有攻击者控制命令的函数，从而实现远程代码执行。  
  
在 JFrog 的 Jellyfin 漏洞利用中，它被武器化为一个反向 shell，一旦媒体库扫描触发了恶意文件的 ffprobe，该反向 shell 就会以 Jellyfin 服务账户的身份执行。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/BicXBAdicJy7PWDcS3gjMzicec2xrNj2F5Qz8Mvvg3ibM3BREOtxxxyINVTlDIDECFR2pVmBpZpTcrliaDX9ptFPlOEJiardSxOkmn2N7WibVa7ZC0/640?wx_fmt=png&from=appmsg "")  
  
攻击面很广，而且通常“几乎无需点击”。在桌面系统上，只需浏览到某个文件夹即可通过 ffmpegthumbnailer 触发缩略图生成，从而激活该漏洞。  
  
在服务器上，Jellyfin、Emby 和 Nextcloud 等媒体平台会在新文件出现或被查看时自动调用 ffmpeg 或 ffprobe 来生成预览和元数据。  
  
JFrog 还警告说，在云媒体管道和使用 FFmpeg（直接或通过 PyAV/OpenCV）解码用户提供的视频的 AI/ML 环境中也存在类似的向量。  
  
将 PixelSmash 变成共享推理或数据处理工作进程中潜在的拒绝服务或攻击原语。  
  
要利用 PixelSmash 漏洞，攻击者只需将精心制作的媒体文件提供给任何使用启用了 MagicYUV 的 FFmpeg 解码视频的应用程序即可。  
  
除了能够上传、共享或放置文件进行自动处理之外，无需任何身份验证或高级权限。  
  
这使得像 torrent 客户端直接写入媒体库目录这样的常见设置变得特别危险，因为 Jellyfin 式的自动扫描可以在下载后立即处理恶意内容，而无需任何用户交互。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/BicXBAdicJy7P0dbf4wiaE7h6KAX9PcBWeFoXxibFiaArByjgDqYLvIE9y5pcjtkgcVFzjI3OuibxG9Bz3NMBCicc4Atowto4L46exc6cwOcLkiaoIo/640?wx_fmt=png&from=appmsg "")  
  
该漏洞已在已打补丁的 FFmpeg 版本中修复（例如，应用了 MagicYUV 边界检查的 8.1.2 或更高版本），强烈建议用户尽快升级其 FFmpeg 版本。  
  
作为临时缓解措施，管理员可以重新构建 FFmpeg 并禁用 MagicYUV 解码器，或者应用最小补丁，在解码之前拒绝无效的 slice_height 值。  
  
由于这是基础库中的供应链问题，建议嵌入 FFmpeg 的项目审核其构建，尽可能减少启用的编解码器，并采用类似于 Plex 的最小解码器配置的允许列表策略，以限制未来的影响范围。  
  
