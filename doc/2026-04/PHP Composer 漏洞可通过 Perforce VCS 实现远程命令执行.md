#  PHP Composer 漏洞可通过 Perforce VCS 实现远程命令执行  
鹏鹏同学
                    鹏鹏同学  黑猫安全   2026-04-16 00:50  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DYqn7TU9icq1Nc8uVLRxibkgUMpqkcYvEzjOBGdZnbnpCiasDciaKYte4icM6PGQeJQQ5s1KgKywPd0eIz0HibTyQgBVPm4wiaGKSZ8BXHyONYFo1c/640?wx_fmt=png&from=appmsg "")  
  
PHP Composer 中存在两个高危漏洞，可能导致攻击者执行任意命令。PHP Composer 是 PHP 语言的依赖管理工具，帮助开发者安装和管理项目所需的库。通过在 composer.json  
 文件中定义包信息，Composer 会自动下载、更新这些包并解析其依赖关系。该工具简化了开发流程，广泛用于 Laravel 和 Symfony 等框架中。  
  
这些漏洞影响 Perforce VCS 驱动，根源在于输入验证不当和转义不足。攻击者可通过构造包含 shell 元字符的恶意 composer.json  
 或源引用，控制仓库配置，从而在用户系统上执行命令。  
  
公告指出：“请立即通过运行 composer.phar self-update  
 将 Composer 更新至 2.9.6 或 2.2.27（LTS）版本。新版本修复了 Perforce VCS 驱动中的两个命令注入安全漏洞。CVE-2026-40261 由 Koda Reef 报告，CVE-2026-40176 由 saku0512 报告。”  
  
以下是两个漏洞的详细描述：  
- **CVE-2026-40176（CVSS 评分：7.8）**  
：输入验证不当，允许攻击者通过一个包含 Perforce VCS 仓库的恶意 composer.json  
 注入任意命令，从而在运行 Composer 的用户上下文中执行。  
  
- **CVE-2026-40261（CVSS 评分：8.8）**  
：由于转义不足导致的输入验证不当，攻击者可通过包含 shell 元字符的恶意源引用注入任意命令。  
  
这两个漏洞均源于 Composer 的 Perforce VCS 驱动在构建 shell 命令时对输入转义不当。  
  
CVE-2026-40176 影响 generateP4Command()  
 方法，该方法在插入用户可控的连接参数（端口、用户名、客户端）时未进行清理。攻击者可通过恶意的 composer.json  
 注入命令，但仅在针对不受信任的根项目（而非依赖项）运行 Composer 时才能触发。  
  
CVE-2026-40261 影响 syncCodeBase()  
 方法，其中未转义的源引用使得攻击者能够通过构造的元数据注入命令。该漏洞可通过恶意或被入侵的仓库利用，即使系统中未安装 Perforce 也可被触发，尤其是在从源码安装或更新依赖项时。  
  
Composer 2.9.6（主线版本）和 2.2.27（2.2 LTS 版本）已修复上述两个漏洞。  
  
为缓解 CVE-2026-40261，应避免从源码安装依赖项，建议使用 --prefer-dist  
 或将 preferred-install  
 设置为 dist  
，并且仅依赖受信任的仓库。针对 CVE-2026-40176，应仔细审查 composer.json  
 文件，确保 Perforce 相关字段合法有效，并仅对受信任的项目运行 Composer。  
  
根据公告，对 Packagist.org 和 Private Packagist 的扫描尚未发现利用尝试。作为预防措施，Perforce 元数据发布功能及 Perforce VCS 驱动已于 2026 年 4 月 10 日被禁用。Private Packagist 自托管用户将收到更新通知，应尽快升级 Composer 并验证元数据。  
  
