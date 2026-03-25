#  从目录删除到RCE：GCP Looker漏洞剖析  
Dubito
                    Dubito  云原生安全指北   2026-03-25 00:35  
  
   
  
> 注：本文翻译自 GMO Flatt Security 的文章  
《Remote Command Execution in Google Cloud with Single Directory Deletion》[1]  
，可点击文末“阅读原文”按钮查看英文原文。  
  
  
全文如下：  
## 摘要  
  
Google Cloud 有一款名为 Looker 的产品，该产品具备管理 Git 仓库的功能。  
  
当用户删除一个目录时，Looker 对目标目录的验证存在缺陷，导致可以删除包含仓库本身所在的目录。由于其他 Git 操作可以同时进行，因此在目录删除过程中有可能触发与 Git 相关的操作。  
  
通过利用此条件竞争漏洞，攻击者可以在 Looker 服务器上执行任意命令。  
  
虽然各实例通过 Kubernetes 进行了隔离，但 Looker 服务账户权限配置不当，可能允许攻击者进行权限提升，从而访问同一 Kubernetes 集群内的其他实例。  
  
在向 Google 报告此漏洞后，他们修复了远程命令执行漏洞和权限提升漏洞。  
## 一、引言  
  
你好，我是   
RyotaK[2]  
 (  
@ryotkak[3]  
 )，GMO Flatt Security Inc. 的一名安全工程师。  
  
不久前，我参加了由 Google 组织的现场黑客活动   
Google Cloud VRP bugSWAT[4]  
。  
  
在此次活动中，我发现了 Google Cloud 某服务中的一个远程命令执行漏洞。由于该漏洞现已修复，我将在本文中分享其技术细节。  
## 二、关于 Looker  
  
Looker 是一个商业智能（BI）与数据分析平台，属于 Google Cloud 的一部分。它使组织能够通过交互式仪表板和报告来探索、分析和可视化其数据。Looker 可连接多种数据源，允许用户创建自定义数据模型并执行分析。  
  
Looker 有两种部署类型：云托管和自托管。由于我可以在 Google Cloud VRP bugSWAT 活动中获取自托管的 Looker 实例，因此我专注于对自托管 Looker 进行逆向工程。  
## 三、技术细节  
### 3.1 Looker 中的 Git 集成  
  
Looker 提供了一项功能，用于在 Git 仓库（Looker 称之为“项目”）中管理名为 LookML 的模型文件。用户可以执行拉取或推送操作来同步 Git 仓库中的更改，Looker 会相应地应用这些更改。  
  
为了与外部 Git 服务集成，Looker 通常使用 JGit 库（Git 的纯 Java 实现）。但是，当通过 SSH 配置远程 Git 仓库时，Looker 会使用原生 Git 命令行工具，而非 JGit。  
  
它会在 Looker 服务器上的特定目录下创建签出（checked-out）的仓库，并针对该目录执行 Git 命令。  
```
    def self._cli_git_command(working_directory, command_words)
      [...]
          command_with_dir = "cd #{working_directory} && #{command}"          Looker::Log.log_block_latency(:git, "_cli_git_command: command: #{command_with_dir}") do            Open3.capture3(command_with_dir)          end
      [...]
```  
  
除了标准的 Git 操作外，Looker 还提供了一项从 Web 界面管理文件的功能。用户可以通过 Looker 界面创建、编辑或删除文件及目录。  
### 3.2 目录删除中的验证缺陷  
  
当用户删除一个目录时，Looker 会执行以下代码：  
```
    post("/api/internal/projects/:project_id/delete_dir") do |_project_id|
      [...]
        dir_path_array = body["dir_path_array"]        @project.delete_dir(dir_path_array)
      [...]
```  
```
      def delete_dir(dir_path_array)
        dir_name = dir_path_array.reject(&:empty?).join("/")
        dir_name = validate_dir_name(dir_name)
        dir_path = File.join(path, dir_name)
        [...]        FileUtils.rm_rf(dir_path)
```  
  
validate_dir_name  
 方法用于确保保留目录（reserved directories）不会被篡改：  
```
      def validate_dir_name(dir_name)
        [...]        if path_array.include?(Looker::Model::Project::DOT_GIT)          raise(InvalidFileNameError.new("New path cannot include .git"))        else          nil        end        File.join(path_array.map do |s|          Looker::Utils.sanitize_file_or_dir_name(s)          HellToolJava        end)      end
```  
  
由于如果 .git  
 目录损坏或被删除，可能欺骗 Git 使用伪造的 Git 配置，因此 validate_dir_name  
 方法会检查待删除的目录是否包含 .git  
，若包含则抛出错误。  
  
例如，考虑一个具有如下结构的仓库：  
```
--- .git directory (Can't be controlled by the user) ---
.git/
    HEAD
    config
...
--- worktree (Controllable by the user) ---
HEAD
config
objects/
refs/
```  
  
如果 .git  
 目录被删除，那么接下来针对该仓库执行的 Git 命令将无法找到 .git  
 目录，转而会在工作树（worktree）目录中寻找 Git 配置。  
  
因此，如果工作树中包含的文件结构与 .git  
 目录的内容相似，Git 命令将会使用这些配置。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Kric7mM9eA5DodUloHezPRzPdNgq1D0QzN6dRBDP40wwjfvibeWeMZEKy8PcRAWFAWmGoQwS0UT46j5AExYVQulIH71nYBMzzeHibdWXdHliajk/640?from=appmsg "null")  
  
例如，如果将以下配置作为 config  
 文件放置在工作树中，并在 .git  
 目录被删除后运行 git status  
 或类似命令时，fsmonitor  
 钩子（hook）将被触发，进而执行 whoami  
 命令：  
```
[core]
        bare = false
        worktree = "."
        fsmonitor = "whoami"
```  
  
现在让我们回到 validate_dir_name  
 方法。该方法会正确检查待删除的目录是否包含 .git  
：  
```
      def validate_dir_name(dir_name)
        [...]        if path_array.include?(Looker::Model::Project::DOT_GIT)          raise(InvalidFileNameError.new("New path cannot include .git"))        else          nil        end        File.join(path_array.map do |s|          Looker::Utils.sanitize_file_or_dir_name(s)          HellToolJava        end)      end
```  
  
然而，当 dir_name  
 为 /  
 时，此检查无法拦截。  
  
在 validate_dir_name  
 方法返回后，delete_dir  
 方法会通过拼接基础路径和 dir_name  
 来构造待删除的完整路径：  
```
      def delete_dir(dir_path_array)
        dir_name = dir_path_array.reject(&:empty?).join("/")
        dir_name = validate_dir_name(dir_name)
        dir_path = File.join(path, dir_name)
        [...]        FileUtils.rm_rf(dir_path)
```  
  
因此，将 dir_path_array  
 指定为 ["/"]  
 会导致 dir_name  
 为 /  
，此时待删除的完整路径就变成了仓库目录本身。  
  
话虽如此，即便攻击者可以删除整个仓库目录，前面所述的攻击仍需要在工作树中存在伪造的 Git 配置文件。这意味着，如果整个仓库被删除，该攻击似乎无法实现。  
  
……真的如此吗？  
### 3.3 FileUtils.rm_rf 的内部机制  
  
FileUtils.rm_rf  
 方法是 Ruby 标准库中的一个方法，用于递归删除文件和目录。  
  
追踪其内部实现，可以看到以下代码：  
```
  def remove_entry(path, force = false)    Entry_.new(path).postorder_traverse do |ent|      begin
        ent.remove      rescue        raise unless force      end    end
```  
  
如上所示，它使用了 Entry_.postorder_traverse  
 方法以后序遍历（post-order）的方式遍历目录树，即先处理目录下的所有子项，再处理该目录本身。  
  
如果我们诱使 Looker 删除仓库中包含数千个文件和子目录的目录，会发生什么情况？  
  
确实，删除所有这些文件和目录需要相当长的时间。如果我们能够在 .git  
 目录被删除之后、整个仓库删除完成之前，触发对该目录的删除，那么我们仍有机会针对这个部分删除的仓库执行 Git 命令。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Kric7mM9eA5Cs42qtyuL21fUvE6HrfeM3Bwm3RKBPzPRLicpcBYibvjuRaKlQpEFwibmWpRZoMdubFtj5CCSqkGhAGBWgUXkfibhnuOcM4HQoIGU/640?from=appmsg "null")  
### 3.4 控制删除顺序  
  
Entry_.postorder_traverse  
 方法内部使用 Dir.children  
 方法来列出目录内容，该方法通过 readdir  
 系统调用来读取目录条目。  
  
dir.c 第 952 行[5]  
```
while ((dp = READDIR(dirp->dir, dirp->enc)) != NULL) {  const char *name = dp->d_name;
  [...]
```  
  
由于 readdir  
 返回条目的顺序取决于文件系统实现且可能有所不同，因此无法保证删除时文件和目录的处理顺序。  
  
但从攻击者的角度来看，在 ext4 文件系统上，readdir  
 返回的条目顺序具有一定确定性。这使得攻击者可以通过精心命名目录来影响删除顺序。  
  
因此，我通过以下方式“喷洒”目录名，以确定哪种目录名能确保 .git  
 目录在删除过程中被优先处理：  
```
.git/
aaa/
aab/
    dir1/
        file1
        file2
        file3
        ...
    dir2/
        file1
        file2
        file3
        ...
    ...
    dir10000/
        ...
aac/
...
ccb/
ccc/
```  
  
通过在一个特定目录下放置大量文件和子目录，并测量触发删除后仓库变得不可用所需的时间，我可以找到最优的目录名，使得 .git  
 目录被优先删除，从而创造一个时间窗口，对部分删除的仓库触发 Git 操作。  
### 3.5 远程命令执行  
  
现在我们已经能够控制 .git  
 目录的删除时机，就可以尝试在 Looker 服务器上执行任意命令了。  
  
攻击步骤如下：  
1. 1. 创建一个 Git 仓库，其工作树中包含伪造的 Git 配置，利用 fsmonitor  
 钩子（hook）执行任意命令。  
  
1. 2. 创建一个包含大量文件和子目录的随机名称目录，然后使用 POST /api/internal/projects/:project_id/delete_dir  
 API 尝试删除仓库本身。  
  
1. 3. 测量仓库变得不可用的时间。如果时间较长，则返回步骤 2 重试（这表明 .git  
 目录没有被优先删除）。  
  
1. 4. 找到最优目录名后，重新准备仓库，并持续访问那些会触发 Git 操作（例如 git status  
）的端点。在我的测试中，每秒 1 个请求就足够了。  
  
1. 5. 调用 POST /api/internal/projects/:project_id/delete_dir  
 API 删除仓库目录。这将首先删除 .git  
 目录，但删除那个包含大量文件的大目录仍需一段时间。  
  
1. 6. 此时，步骤 4 中触发的 Git 操作将尝试使用这个已被部分删除的仓库，从而导致工作树中的 Git 配置被使用，并执行任意命令。  
  
我使用了以下 Git 配置来测试命令执行：  
```
[core]
        bare = false
        worktree = "."
        fsmonitor = "echo \"$(whoami) $(uname -a)\" > ../output/pwned.model.lkml"
```  
  
一旦在仓库删除过程中执行了 git status  
，命令 whoami  
 和 uname -a  
 就会被执行，其输出结果会被写入 ../output/pwned.model.lkml  
 文件中，该文件位于另一个我可以正常访问的仓库内。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Kric7mM9eA5DW4z4QwU3ibLTYg5zwysjmSJAiczthTxpDhUhneh8MuEeHkAiaicA0FUCDia0dNH0RquxhzrozzUTHEadC1BKGWiaK9GJM8kicqlYTF8/640?from=appmsg "null")  
### 3.6 针对其他 Looker 实例的权限提升  
  
此时，我向 Google Cloud 团队询问是否可以进一步调查该漏洞的影响，他们欣然准许。  
  
在获得 Looker 实例的反弹 shell 后不久，我注意到该实例被隔离在 Kubernetes Pod 中，这限制了对其他 Looker 实例的影响范围。  
  
然而，在检查挂载于 /var/run/secrets/kubernetes.io/serviceaccount  
 的 Kubernetes 服务账户（Service Account）凭证时，我发现其权限过大：  
```
{  "kind": "SelfSubjectAccessReview",  "apiVersion": "authorization.k8s.io/v1",  [...]  "spec": {    "resourceAttributes": {      "namespace": "looker",      "verb": "update",      "resource": "secrets"    }  },  "status": {    "allowed": true,    "reason": "RBAC: allowed by RoleBinding..."  }}
```  
  
Looker 服务账户拥有更新 looker  
 命名空间（namespace）中 secrets 的权限，而该命名空间被多个 Looker 实例共享。  
  
由于未授予对 secrets 的读取权限，我无法直接读取现有的 secrets，因此很难进行安全的测试。没有读取权限，我无法在修改前备份现有 secrets，这意味着任何更新都将是不可逆的，并可能影响其他 Looker 实例的正常运行。这一限制使我无法在不影响生产系统的情况下展示该漏洞的完整影响。  
  
因此，我将这一发现分享给 Google Cloud 团队以供进一步调查。  
  
经过调查，他们确认通过滥用此权限确实可以实现权限提升，从而访问同一 Kubernetes 集群中的其他实例，并将该漏洞评定为 S0 等级。  
  
截至本文发布时，Google Cloud 团队已修复了远程命令执行漏洞和权限提升漏洞。  
## 四、结论  
  
在本文中，我分享了在 Google Cloud VRP bugSWAT 活动期间发现的 Google Cloud Looker 产品中的一个远程命令执行漏洞的技术细节。  
  
虽然该漏洞源于目录删除功能中一个小小的验证错误，但通过恰当利用，却能够实现远程命令执行。此漏洞凸显了正确进行输入验证的重要性——即使是微小的错误也可能导致严重的安全问题。  
  
我要感谢 Google Cloud 安全团队举办 Google Cloud VRP bugSWAT 活动，并感谢他们在漏洞披露过程中的快速响应与支持。  
#### 引用链接  
  
[1]  
 《Remote Command Execution in Google Cloud with Single Directory Deletion》: https://flatt.tech/research/posts/remote-command-execution-in-google-cloud-with-single-directory-deletion/[2]  
 RyotaK: https://ryotak.net/[3]  
 @ryotkak: https://twitter.com/ryotkak[4]  
 Google Cloud VRP bugSWAT: https://bughunters.google.com/blog/5364401980899328/hardening-google-cloud-insights-from-the-latest-cloud-vrp-bugswat[5]  
 dir.c 第 952 行: https://github.com/ruby/ruby/blob/c5bd4acd30320a8e180ce9fcb24acdab4e10c73a/dir.c#L952  
  
   
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Kric7mM9eA5DhnPE1KRLom4ChVKicecFfL6YM3L0ncuynLYEsfUY5DnzVujngUOleGcK1ibqAib1OIM6Zg8SyxEnrQqQNSVyBO5zQeDBurAHEgc/640?wx_fmt=gif&from=appmsg "")  
  
  
  
**交流群**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Kric7mM9eA5D52JJd2JSibRicuMDePsEH41vJLYRaPwNdsic2Y3ojzj6diaFwRGDPgt1lpa0DvQicRrhcgiabtsfnibwoA910JypDz5AbKWKlvrK2Fk/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
