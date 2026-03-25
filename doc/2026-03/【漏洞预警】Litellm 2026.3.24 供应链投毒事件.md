#  【漏洞预警】Litellm 2026.3.24 供应链投毒事件  
安全探索者
                    安全探索者  安全探索者   2026-03-25 07:10  
  
↑点击关注，获取更多漏洞预警，技术分享  
  
0x01 组件介绍  
  
    
LiteLLM作为一款热门开源AI模型网关，其SDK在Pypi仓库总下载量超过4.8亿次。该工具通过标准化  
OpenAI  
格式接口，支持对20多种大型语言模型（LLM）API的统一调用，兼容OpenAI、  
Azure  
、  
Anthropic  
、Google Vertex AI等主流服务，并允许通过配置接入私有化部署模型或小众API。  
  
其核心功能包括跨平台兼容性、统一API接口、多模型负载均衡、全链路成本追踪、企业级密钥管理及生产级速率限制，同时支持异步调用与流式处理。内置缓存与流量控制功能可优化调用效率，并提供请求缓存、用量统计、审计日志等企业级管理模块  
  
0x02 漏洞描述  
  
  
    2026年3月24日，互联网上披露 Litellm项目遭受供应链攻击。在 Litellm 的1.82.7 和 1.82.8 版本中存在proxy_server.py与litellm_init.pth恶意文件。安装受影响版本的包后，将造成包括SSH Key、云凭证等各类敏感信息泄漏。官方已下线相关影响包，建议客户尽快排查。  
目前官网已下架受影响版本，无1.82.7，1.82.8版本  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibWiaLKz39tdD0mRsJf7fFxOAYcibVIIbhOWSfRPnAwvrPc39xzNQEI6m1n315Hic8AicrddUVia5mBK70IUlOZckWvbpQXj2qQb9ZSU7P6rVoKEk/640?wx_fmt=png&from=appmsg "")  
  
  
0x03 影响版本  
  
LiteLLM 1.82.7  
  
LiteLLM 1.82.8  
<table><tbody><tr style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"></tr></tbody></table>  
  
0x04 漏洞影响  
  
由于该漏洞影响范围较广，危  
害较大  
。  
该漏洞已被黑客武器化，用于大规模蠕虫传播、勒索挖矿，建议您立即关注并修复。  
  
  
0x05 修复建议  
  
1.通过命令   
pip show litellm  
 查询是否已经安装投毒版本（1.82.7、1.82.8），如果已安装请立即使用   
pip install litellm==1.82.6   
 回滚到安全版本；  
  
2.排查并移除所有  
site-packages 目录下的 litellm_init.pth 文件；  
  
  
0X06 参考链接  
  
[紧急AI投毒情报 | 热门AI模型网关LiteLLM遭受供应链投毒，总下载量超4.8亿次！](https://mp.weixin.qq.com/s?__biz=MzA3NzE2ODk1Mg==&mid=2647798867&idx=1&sn=d51e8b89a95e1c12d7c4db220befd443&scene=21#wechat_redirect)  
  
  
https://github.com/BerriAI/litellm/issues/24512	  
  
  
0x07 免责声明  
  
> 本文所涉及的任何技术、信息或工具，仅供学习和参考之用。  
  
> 请勿利用本文提供的信息从事任何违法活动或不当行为。任何因使用本文所提供的信息或工具而导致的损失、后果或不良影响，均由使用者个人承担责任，与本文作者无关。  
  
> 作者不对任何因使用本文信息或工具而产生的损失或后果承担任何责任。使用本文所提供的信息或工具即视为同意本免责声明，并承诺遵守相关法律法规和道德规范。  
  
  
  
