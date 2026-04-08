#  GPUBreach 漏洞利用 GPU 内存位翻转实现完整系统接管  
鹏鹏同学
                    鹏鹏同学  黑猫安全   2026-04-08 00:52  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DYqn7TU9icq1bD3wxlh2EmnvpkHyKSx8apicWCRrUGDNe1pzAic0zI5QJonribgCnJPJZE5QicmgRkwK8FenWPbLoP8bZiaE4C2me4sAm0QXgp2PQ/640?wx_fmt=png&from=appmsg "")  
  
新研究表明，像 GPUBreach 这样的攻击可以利用 GPU 内存（GDDR6）中的 RowHammer 位翻转，超越数据损坏。攻击者可以使用此技术提升特权，在某些情况下获得系统的完全控制。与早期的 GPUHammer 方法不同，这种方法证明了 GPU 内存故障可以直接影响 CPU 级别的安全性，使威胁更加严重。  
  
"GPUBreach 展示了 GPU Rowhammer 攻击可以从数据损坏推进到真正的特权提升。通过破坏 GPU 页表，非特权 CUDA 内核可以获得任意 GPU 内存读/写权限，然后通过利用 NVIDIA 驱动程序中新发现的内存安全漏洞，将该能力链接到 CPU 端的特权提升。"专家发布的文章写道。“结果是最高可达 root shell 的系统全面沦陷，与当代工作不同，无需禁用 IOMMU，使 GPUBreach 成为更强大的威胁。”  
  
通过针对内存中的 GPU 页表，攻击者可以通过位翻转操作它们，并获得对 GPU 内存的完全控制。  
  
研究人员克服了关键挑战：定位页表、高效填充内存并将它们放置在易受攻击区域附近。这实现了任意读/写访问、数据窃取（包括加密密钥）和机器学习操纵。  
  
"当密钥在密钥交换等操作期间驻留在 GPU DRAM 中时，从 NVIDIA cuPQC（一个用于加速后量子密码学的库）泄露密钥。"文章继续写道。“通过篡改 GPU 内存中 cuBLAS SASS 中的一个分支，我们普遍将准确率降低（例如从 80% 准确率降至 0%），比之前的权重篡改攻击更隐蔽；我们还展示了敏感 LLM 权重的泄露。”  
  
关键的是，该攻击还可以升级到 CPU 级别的特权，即使启用了输入-输出内存管理单元（IOMMU）等保护，允许攻击者获得 root 访问权限并完全沦陷系统。  
  
GPUBreach、GDDRHammer 和 GeForge 都表明 GPU Rowhammer 可以破坏页表并实现 GPU 端的特权提升。然而，GPUBreach 脱颖而出，因为它即使启用 IOMMU 也能实现 CPU 特权提升。  
  
虽然 GDDRHammer 无法达到 CPU 特权提升，GeForge 需要禁用 IOMMU，但 GPUBreach 通过针对 GPU 驱动程序中的漏洞绕过了这种保护。这允许攻击者在不禁用关键防御的情况下获得 root 访问权限，使其成为更先进和危险的技术。  
  
ECC 可以通过纠正单位错误和检测双位翻转来帮助缓解 Rowhammer，因此在支持的 GPU 上启用它是推荐的。然而，它对多位翻转无效，可能允许静默损坏。消费级 GPU 缺乏 ECC，使它们没有有效的保护。  
  
"ECC 不是针对 GPUBreach 的万无一失的缓解措施。"研究人员总结道。“在台式机或笔记本电脑 GPU 上，目前没有 ECC，据我们所知没有已知的缓解措施。”  
  
  
