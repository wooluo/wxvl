#  BlockSec 安全周报｜九起攻击，从合约漏洞到治理失守（3.30–4.05）  
原创 BlockSec
                    BlockSec  BlockSec   2026-04-09 10:03  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/2ibKZs4HxyqsWDFIicic8P3BDA4tqxYBCvr95xoDscl7HG86SQeFeSGPDTdsAZ10o9X7vqbF6sV2jYpeRKS7Nx7QtNPJ5D5icHEH5oJhb554xrw/640?wx_fmt=gif&from=appmsg "")  
  
**引言**  
  
在过去一周 (2026/03/30 - 2026/04/05),BlockSec 检测并分析了 9 起攻击事件,估计总损失约为 $287M。下表汇总了这些事件,各事件的详细分析见后续小节。9 起攻击事件中，  
有两起仅定位到受损合约，无法定位到具体项目方，因此下文中以unknown Incident标示。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqu5HvAZibXYqggpt0vCudbiakwHoU3rI4sULwgCvh4ZngQ03mTRyOWU05ALIpfrsEmdcKia4T1TljZf2fAoKHMtQoLT2n8DN4YnEQ/640?wx_fmt=png&from=appmsg "")  
  
**Unknown Protocol Incident**  
  
**简要概述**  
  
2026 年 3 月 30 日,BNB Chain 上的一个未知协议因业务逻辑缺陷损失约 $10K。该协议会将用户存入资金的一部分用于购买平台代币   
PSTART  
 并添加流动性,这意味着用户实际上持有的是会随市场价格波动的 LP 头寸。然而在用户提取时,协议并未基于 LP 当前的实际可赎回价值进行结算,而是依然按照历史存入金额和预定义规则,承诺向用户支付固定金额的稳定币。结果,攻击者通过强制投资进入头寸后,便能够以预先约定的固定价值取回资金,实质上将本应由 LP 头寸承担的损失转嫁给协议本身,最终实现零成本获利。  
  
**背景**  
  
协议运作方式如下:用户存入   
BUSD  
 后,协议会自动用其中一部分资金购买   
PSTART  
,然后将其与剩余的   
BUSD  
 配对添加到资金池作为流动性。所得   
LP  
 份额由   
Vault  
 托管,同时协议会在内部账本中为该用户记录一笔订单,承诺固定的日收益。  
  
之后,用户可以按固定利率领取奖励,在退出时,  
Vault  
 会按预定义规则结算本金和收益,而不是严格按照底层   
LP  
 头寸当前的真实净资产值进行赎回。  
  
**漏洞分析**  
  
漏洞源于该协议合约 ([0x587984...73a43c](https://bscscan.com/address/0x587984549f7e61c0ed8131b1f6614f592573a43c[#code]()  
  
)) 的一个不合理设计:结算逻辑与底层资产的实际价值脱钩。  
  
用户存入   
BUSD  
 后,协议用其中一部分购买   
PSTART  
 并添加流动性,这意味着用户的真实底层头寸是一个价值随市场波动的   
LP  
 敞口。然而当用户退出时,协议并不按   
LP  
 当时的实际可赎回价值结算,而是仍按历史存入金额和预定义结算规则,承诺支付固定金额的稳定币。  
  
攻击者利用此缺陷,通过闪电贷获取大量资金,然后反复执行   
deposit()  
。在此过程中,攻击者迫使协议持续买入   
PSTART  
 并改变资金池的资产构成,从而人为推高   
PSTART  
 价格,制造出套利机会。  
  
随后攻击者执行   
withdraw()  
,以预先承诺的固定价值赎回资金,实际上把本应由底层   
LP  
 头寸承担的损失转嫁给了协议本身,最终实现 零成本获利。  
  
**攻击分析**  
  
以下分析基于交易 [0xf3b8...55e7](https://app.blocksec.com/phalcon/explorer/tx/bsc/0xf3b8ceae88818d7121c84b7f00f7c99d1c6c45409ceb9de2eae10a92391755e7)。  
  
**Step 1:**  
攻击者通过闪电贷获  
取约 2,0  
00,000e18   
BUSD  
,并在资金池中将其换成 19,013,120e18   
P  
STA  
RT  
。  
  
**Step 2:**  
攻击者反复调用合约的   
deposit()  
 函数进行质押。每次存款时,协议会计算应使用多少   
BUSD  
 购买代币,以使最终用于添加流动性的代币与   
BUSD  
 比例更接近资金池当前的比例。通过反复存款,攻击者不断向池中注入   
BUSD  
,而   
PSTART  
 数量几乎保持不变。结果   
PSTART  
 的价值持续上升。在此阶段,攻击者通过存款获得的   
LP  
 实际上是以亏损价格取得的。  
  
**Step 3:**  
接着攻击者将 Step 1 中购入的   
PSTART  
 卖回资金池。由于 Step 2 增加了池中的   
BUSD  
 储备,这次交换返还了约 2,010,655e18   
BUSD  
,在单个攻击周期内带来约 10,655   
BUSD  
 的利润。  
  
**Step 4:**  
最后,攻击者对 Step 2 开立的所有质押头寸执行   
withdraw()  
。此时这些头寸对应资产的市场价值已远低于其初始存入价值。在正常的经济逻辑下,本不应允许全额赎回。然而协议是基于历史存入金额计算可赎回的   
BUSD  
 数量,使攻击者得以在不承担任何损失的情况下,完整收回此前的强制投资成本。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqtXko3ibwxGQXDCagIp4OC0FHeGoaYesTibMd3VtgDIRCibOw7toeZZgINibWPTVgzWicXibfGHKCCZVicibSY1WQ2YMiboQMQWSYsbokJE/640?wx_fmt=png&from=appmsg "")  
  
**结论**  
  
本次事件的根本原因在于,协议将用户资金投入受市场价格波动影响的   
LP  
 头寸,却仍按历史存入金额和预定义规则承诺以固定数量的   
BUSD  
 进行结算。这造成了协议负债与底层资产真实价值之间的脱节。  
  
攻击者利用此缺陷,反复使用   
deposit()  
 改变池的资产结构,推高   
PSTART  
 价格,然后通过外部头寸完成套利,最后用   
withdraw()  
 以账面价值赎回此前的亏损头寸。本应由这些头寸自身承担的损失因此被转嫁给了协议,最终实现无风险获利。  
  
**WDGG Token Incident**  
  
**简要概述**  
  
2026 年 3 月 30 日,BNB Chain 上的   
WDGG  
 代币遭到攻击,造成约 $40K 损失。根本原因是   
burnFrom()  
 函数缺少访问控制。具体而言,  
burnFrom()  
 允许任意用户从任何地址销毁   
WDGG  
 代币。攻击者利用此漏洞从 PancakeSwap 池中销毁   
WDGG  
 代币,然后调用   
sync()  
 减少池中的   
WDGG  
 储备,随后执行反向交换提取利润。  
  
**背景**  
  
本事件涉及单一代币   
WDGG  
,这是一个分红型代币,在每次转账时收取手续费。  
  
**漏洞分析**  
  
WDGG  
 代币合约 ([0x512de7...6b90c5](https://bscscan.com/address/0x512de7b4da71e1ab1c4c186e80905b3ea46b90c5[#code]()  
  
)) 的   
burnFrom()  
 函数缺少调用者权限校验。因此,任何地址都可以从任意持有者(包括 PancakeSwap 池本身)销毁   
WDGG  
 代币。结合 PancakeSwap 公开可调用的   
sync()  
(用于将记录的储备与实际余额对齐),该漏洞使得池中的   
W  
DG  
G  
 储备可以被任意减少,恒定乘积不变量在没有任何合法交易的情况下被打破,从而暴露出价格失衡套利窗口。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqvRwVkS1SbCfO9reQqgaSdVrQaQ9JyAQwf04OicsloMhoqEyU6dFmibpiceaARibn5NSL0oxYBb3o5u82WDcBYsSlC8eic5aHibromHk/640?wx_fmt=png&from=appmsg "")  
  
另一处次要漏洞是   
setWdgAddress()  
 允许任意调用者将任意地址标记为手续费豁免,进一步放大了可通过此攻击面提取的利润。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyquEMic5XzN1oRm1ANIoxSiauna25EhibLOTeguddIUaWa4sicibnpntPlkZhIrXbCE58voGib5SEDJAxubpl6B2aLCyFwCfzETbniaC2E/640?wx_fmt=png&from=appmsg "")  
  
**攻击分析**  
  
以下分析基于交易 [0x2da5...0bd1](https://app.blocksec.com/phalcon/explorer/tx/bsc/0x2da59a05359c07bb640075ce99416846f6f26f9fb594dedaab9e1662de750bd1)。  
  
Step 1:   
攻击者首先调用  
setWdgAddress()  
,将自己的地址设为手续费豁免地址,使后续转账可绕过代币的转账费。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqvuQvFKwGxxFkiaU9BZutib5yjOo6tSjAwQhRt3vmRmTqQYBxj1dtRSt764xYeMU5HQichrqhIdlBGPBAxIiczJo3x8xJN8oSibvndg/640?wx_fmt=png&from=appmsg "")  
  
S  
tep  
 2:   
攻击者随后通过 PancakeSwap 池用少量   
BNB  
 换取   
WDGG  
 代币。  
  
Step 3:   
获得   
WDGG  
 后,攻击者调用   
burnFrom()  
 直接从 PancakeSwap 配对地址中销毁   
WDGG  
 代币。  
  
Step 4:   
攻击者随后调用   
sync()  
,迫使配对合约根据被操纵的代币余额更新储备。结果池中的   
WDGG  
 储备被减至 1 wei。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqsvxztOuib7DXicflDDcyLuE7Gyf13wZcOYibbg52woPOAYHdm0anuEp9LfbpibfHd2VRk3SMQDyoiaACFm8gDEgy159ic3wBAZ6wSp0/640?wx_fmt=png&from=appmsg "")  
  
Step 5:   
在池储备严重失衡后,攻击者执行反向交换,从价格失衡中提取利润。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqv6tnfc6YRuUCt3rJTg4Zt8nypSZYv79VhPOEExczpQECb3yx0u4WM6CiaRzHAxdVPfyksxakS1IC7xkhOMrLsHBcJXWM5a4TMY/640?wx_fmt=png&from=appmsg "")  
  
**结论**  
  
本次事件的根本原因是   
WDGG  
 代币合约的   
burnFrom()  
 函数缺少访问控制。攻击者得以直接从 PancakeSwap 池中销毁代币,通过   
sync()  
 操纵池储备,并利用由此产生的价格失衡获利。  
  
**i6Token Incident**  
  
**简要概述**  
  
2026 年 3 月 31 日,BNB Chain 上的   
i6  
 Token 损失约 $273.8K,原因是   
invest()  
 会推动池的现货价格,而   
withdraw()  
 依赖滞后更新的 TWAP 结算余额,两者可在同一交易内组合调用。攻击者通过   
invest()  
 抬高现货价格,再由   
withdraw()  
 以过期 TWAP 赎回超额的   
i6  
,随后把这些   
i6  
 卖回被推高的池中获利。  
  
**背景**  
  
协议运作方式如下。用户调用   
invest()  
 时,  
USDT  
 被存入,其中一部分用于在 PancakeSwap 上购买   
i6  
。所获得的   
i6  
 与剩余的   
USDT  
 一起作为流动性添加到   
USDT  
/  
i6  
 池中,所产生的 LP 代币会被销毁。协议以   
USDT  
 计价记录用户和推荐余额。  
  
调用   
withdraw()  
 时,协议以   
USDT  
 计算用户累计价值,然后通过协议维护的 TWAP 价格 (twapPrice) 将其换算为   
i6  
。  
  
**漏洞分析**  
  
根本原因在于协议合约 ([0x1cb36b...2a18a](https://bscscan.com/address/0x1cb36b0f1efd9b738997da3d5525364c7e82a18a[#code]()  
  
)) 中,  
invest()  
 在购买   
i6  
 并添加流动性的过程中会作为副作用推动   
USDT  
/  
i6  
 池的现货价格,而   
withdraw()  
 则使用协议维护的 TWAP (  
t  
wapPrice  
) 将累积的 USDT 计价余额结算为   
i6  
,该 TWAP 只有在时间窗口流逝后才会更新。合约本身没有任何机制阻止这两个函数在同一交易中被连续调用。  
  
由于   
invest()  
 可以在同一交易内推高现货价格,而紧随其后的   
withdraw()  
 读到的是尚未更新的 TWAP,两者事实上对同一池状态看到了两套不同的价格。通过   
withd  
ra  
w()  
 赎回的   
USDT  
 计价余额因此会按过期且显著偏低的价格支付 i6,而此时池中每一枚 i6 已经可以兑换远多于结算价的   
USDT  
。这一差距把协议内累积的任何   
USDT  
 余额,都变成了内部结算价与池现货价之间可被利用的价差。  
  
**攻击分析**  
  
以下分析基于交易 [0xc1b9...2f16](https://app.blocksec.com/phalcon/explorer/tx/bsc/0xc1b9a237a00b53a595e1e2d0d93841154ddcdf9aa217be8f395449b8e4ab2f16)。  
  
**Step 1:**  
攻击者首先通过闪电贷获取   
270,000 WBNB  
,然后将其作为抵押品供给 Venus 借出大量   
USDT  
。攻击者还在   
0xda49  
 部署攻击合约 A,在   
0x096a  
 部署辅助合约 B。  
  
**Step 2:**  
攻击合约执行第一次   
invest()  
。这一过程中,协议先用 531,489e18   
USDT  
 购入 234,188e18 i6,然后将 354,326e18   
USDT  
 与 72,607e18 i6 一起加入池中。结果池的现货价格从约 1.05159   
USDT/i6   
迅速涨到约 4.89287   
USDT/i6  
,而协议记录的   
TWAP  
 仍只是 1.05159。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqt6sIksK8GJr4YMROB0M1NtpmXgXe8gXSCN1P5dUOzCcZrcvYQ3MNjH1gCLZ8KFrRo9XapY1ONeIFqtMbaa6BbkKsB2hzhLvgM/640?wx_fmt=png&from=appmsg "")  
  
**Step 3:**  
 攻击者随后向辅助合约 B 转入 124,014,184e18   
U  
SDT  
,后者再以   
referrer = A  
 调用   
invest()  
。这一步再次迫使协议进行大规模   
USDT -> i6  
 购买和   
addLiquidity()  
,把池储备推到对应约 15,528   
USDT/i6  
 现货价格的新状态。然而由于没有新的时间窗口流逝,协议没有相应更新   
TWAP  
。  
  
**Step 4:**  
第二次   
invest()  
 完成后,作为  
推荐人的攻击合约 A 立即获得以   
USDT  
 计价的推荐奖励权益。攻击者随后调用   
withdraw()  
。协议使用过期的   
TWAP  
 计算应支付的   
i6  
 数量,并从自身余额中转出代  
币,最终一次性发放了 5,896,508e18   
i6  
。  
  
**Step 5:**  
收到   
i6  
 后,攻击者立即调用   
swapExactTokensForTokensSupportingFeeOnTransferTokens()  
,把全部   
5,896,508e18  
   
i6  
 卖回池中,换得 125,177,224e18   
U  
SD  
T  
。由于这些   
i6  
 是按约 1.05159   
USDT/i6  
 的过期   
TWAP  
 结算获得的,而被卖出时所  
对的池现货  
价格已被攻击者推高至约 15,528   
USDT/i6  
,攻击者得以直接落袋两者之间的巨大价差。  
  
Step 6:   
偿还闪电贷后,攻击者保留了 273,802e18   
U  
SD  
T  
,这就是本次攻击的实际利润。  
  
**结论**  
  
本次事件的根本原因在于,一个改变池现货价格的函数 (  
invest()  
) 和一个按 TWAP 结算的函数 (  
withdraw()  
) 可以在同一交易中被组合调用,使二者对同一池状态看到不同的价格。  
  
为防范此类缺陷,结合 AMM 交互与延迟定价机制的协议应当避免在同一交易内同时执行 "移动池现货价格" 和 "按 TWAP 结算余额" 这两类操作,并将支付锚定在池的实时可实现价值上,而不是过期或衍生出的价格。  
  
**Drift Protocol Incident**  
  
**简要概述**  
  
2026 年 4 月 1 日 (UTC),Drift Protocol 在 Solana 上遭到攻击,损失约 $285.3M。根本原因不是智能合约 bug,而是多签授权流程的失效,叠加 5 选 2 的安全委员会零时间锁配置以及 Solana 的 durable nonce 机制,这让预先收集到的多签批准可以无限期保持有效,直到攻击者选定时机再执行。经过数周的前置准备,攻击者诱导五位签名者中的两位预签了绑定到 durable nonce 账户的恶意治理交易,随后将其提交以夺取管理员控制权,继而引入伪造的抵押资产 (  
CVT  
),抬高其预言机价格,放宽取款限额,并通过 Drift Vault ([JCNCMF...XJfrw](https://solscan.io/account/JCNCMFXo5M5qwUPg2Utu1u6YWp3MbygxqBsBeXXJfrw)) 提走真实资产。  
  
**背景**  
  
Drift Protocol 是 Solana 上的一个 DeFi 协议,支持保证金交易、借贷、现货市场和衍生品。其高权限操作,包括管理员变更、市场创建、预言机配置、风险参数更新和取款限额调整,均由 Squads 多签框架治理,而不是由单个私钥直接控制。攻击发生时,Drift 的安全委员会采用 5 选 2 的阈值配置且零时间锁,意味着五位签名者中任意两位即可立即授权管理操作。这套系统的安全性不仅取决于签名者私钥的保管,还依赖于完整审批流水线的完整性:创建的是什么交易、签名者以为自己批准的是什么,以及最终执行的指令是否与其审阅上下文一致。  
  
另一方面,Solana 的 durable nonce 账户用一个专用账户中持久化的 nonce 替代短暂的 blockhash,使已签名交易可以无限期保持有效,直到 nonce 被推进。该机制原本是为离线签名和延迟提交等合法场景设计,但它把交易 "何时被签名" 与 "何时被执行" 解耦,由此引入了一个关键的攻击原语。一旦签名者对一笔 durable nonce 交易授权,该批准除非 nonce authority 手动推进 nonce 账户,否则无法被撤销。  
  
**漏洞分析**  
  
根本原因不是智能合约 bug,而是 Drift 治理配置中三处结构性缺陷的叠加,让一次社会工程攻击机会转化为 $285.3M 的资金流失。首先,durable nonce 去掉了签名过期的隐式安全网。在常规基于 blockhash 的交易下,被诱导签名的批准要么被及时执行,要么在很短的时间窗口内无害过期,这本身限制了多步协同利用的空间。durable nonce 则完全消除了这一约束:两位安全委员会签名者一旦通过具有误导性的签名请求批准了恶意治理交易,这些签名就会无限期保持可利用,攻击者因此完全掌握执行时机。  
  
其次,管理操作的零时间锁意味着预签名交易一经提交,管理员转移即刻生效,几乎不留任何检测或干预的窗口。第三,管理员角色的权限范围足以在一条特权路径上完成新建抵押市场、切换预言机、放宽取款限额等一系列高危操作,因此一次成功的治理接管就足以把任意资产转化为真实的资金外流,无需再越过任何额外的授权关卡。  
  
**攻击分析**  
  
整个攻击分为三个阶段:Pre-Attack Staging,攻击者花数周时间伪造抵押资产并通过具有误导性的签名请求获得治理访问权限;Governance Takeover,两笔预签名的 durable nonce 交易被快速连续提交以夺取管理员控制权;以及 Fund Extraction,攻击者操纵协议参数并通过协议的借贷路径提走真实资产。下图展示了这三个阶段的执行流程。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqvwSXiaALK6rtBpHB1Xyb5he73GicI81KNdNjxHBIvI9NMOzp6LA4qGqm23nMYWlib9ClIWycGNrqw0ZBXKEBNO9Wer6O9eRsC72g/640?wx_fmt=png&from=appmsg "")  
  
Phase 1 (Pre-Attack Staging):   
自 3 月 11 日起,攻击者从 Tornado Cash 提取 10   
ETH  
,并部署 CarbonVote Token (  
CVT  
),铸造 7.5 亿单位,随后在 Raydium 上注入流动性并通过对敲交易制造出接近 $1 的人为价格历史。与此同时,3 月 23 日出现了四个新建的 durable nonce 账户,其中两个与 Drift 安全委员会成员关联,另两个由攻击者控制,表明五位签名者中已有至少两位对绑定 durable nonce 账户的交易完成了签名。3 月 27 日,Drift 因成员变动执行了一次计划中的安全委员会迁移,使先前收集的签名失效;然而到 3 月 30 日,攻击者已在新配置下重新获得所需阈值,显示出对链上治理变更的主动监控和实时适应能力。  
  
Phase 2 (Governance Takeover):   
4 月 1 日约 16:05 UTC,在 Drift 对保险基金执行一次合法测试取款约一分钟后,攻击者间隔四个 slot 提交了两笔预签名的 durable nonce 交易。  
  
第一笔交易 ([2HvMSg...2C4H](https://app.blocksec.com/phalcon/explorer/tx/solana/2HvMSgDEfKhNryYZKhjowrBY55rUx5MWtcWkG9hqxZCFBaTiahPwfynP1dxBSRk9s5UTVc8LFeS4Btvkm9pc2C4H)) 创建并批准了恶意管理员转移提案。  
  
第二笔交易 ([4BKBmA...RsN1](https://app.blocksec.com/phalcon/explorer/tx/solana/4BKBmAJn6TdsENij7CsVbyMVLJU1tX27nfrMM1zgKv1bs2KJy6Am2NqdA3nJm4g9C6eC64UAf5sNs974ygB9RsN1)) 批准并执行了该提案,先以   
AdvanceNonceAccount  
 激活存储的 nonce,再依次调用   
proposalApprove  
 和   
vaultTransactionExecute  
,最终通过   
UpdateAdmin  
 将管理权限转移到攻击者控制的地址。  
  
Phase 3 (Fund Extraction):   
拥有完全管理员权限后,攻击者为   
CVT  
 创建了一个抵押市场,切换到攻击者控制的预言机以任意抬高其账面价格,并提高或移除主要资产市场的取款限额。攻击者随后将大量被高估的   
CVT  
 存入协议,在约 12 分钟内执行了 31 笔快速取款,提走了   
USDC  
、  
JLP  
、  
SOL  
、  
cbBTC  
、  
USDT  
、  
wETH  
、  
dSOL  
、  
WBTC  
、  
JTO  
 和   
FARTCOIN  
,总损失约 $285.3M,基于攻击者取款账户 ([HkGz4K...pZES](https://solscan.io/account/HkGz4KmoZ7Zmk7HN6ndJ31UJ1qZ2qgwQxgVqQwovpZES?exclude_amount_zero=true&from_address=JCNCMFXo5M5qwUPg2Utu1u6YWp3MbygxqBsBeXXJfrw&remove_spam=true&page_size=100[#transfers]()  
  
)) 计算所得。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqsicFyxXIJV5vqticc4b6h2qdnjR6XpBAAjw1RibQdtcs1tPsLD9ZPZ9k0RH4WsugBBWC3icgfjSJT6IJlfZSF1wdyGRPOibhpQ6U3E/640?wx_fmt=png&from=appmsg "")  
  
**结论**  
  
本次事件的根本原因不是智能合约漏洞,也不是私钥泄露,而是多签授权流程的失效,叠加基于 durable nonce 的延迟执行与零时间锁管理员路径。原本应在几分钟内过期的预收集批准变成无限期可利用的授权,一经提交,管理员接管与后续资金提取之间没有留下任何干预窗口。  
  
要缓解此类风险,需要保护完整的授权流水线而不只是签名者私钥,对高权限操作强制时间锁,并将 durable nonce 之类的延迟执行机制视为独立的威胁面,为其配套更高的签名阈值、时效受限或可撤销的批准,以及禁止已签名交易无限期有效的限制。  
  
**LML Staking Protocol Incident**  
  
**简要概述**  
  
2026 年 4 月 1 日,BNB Chain 上的   
LML  
 质押协议损失约 $950K。根本原因是其奖励计算逻辑中存在不一致: 奖励换算依赖一个被存储的带 3600 秒更新冷却的   
LML/USDT  
 价格,而发放的   
LML  
 可按实时 AMM 价格赎回,两者之间没有任何偏差校验。攻击者通过闪电贷抬高池的现货价格,并使用 EIP-7702 代码委托在单笔交易中为 11 个预先质押的 EOA 批量领取奖励,按过期的存储价取得超额   
LML  
,再将其卖回被推高的池中获利。  
  
**背景**  
  
LML  
 是 BNB Chain 上的一个质押协议,用户通过   
APower  
 合约质押   
BNB  
,赚取   
LML  
 代币作为奖励。奖励以   
USDT  
 计算,再基于协议维护的   
LML/USDT  
 价格换算为 LML 数量后发放。该价格通过   
updatePrice()  
 刷新,函数读取 AMM 现货价格,但要求两次更新之间至少间隔 3600 秒。奖励领取通过   
APower  
 的   
receive()  
 基于   
msg.sender  
 触发,因此只有原始质押地址才能为自己领取奖励。  
  
**漏洞分析**  
  
质押合约 ([0xbe9713...adce19](https://bscscan.com/address/0xbe97138647a993d9d1aabb25f10b3611c0adce19[#code]()  
  
)) 的核心缺陷在于,奖励的 "计提" 和 "赎回" 分别锚定在同一个池子的两个不同价格上,而合约对两者之间没有任何一致性校验。奖励公式   
reward += (10^18 * base_reward) / stored_price 使用 _prices[]   
计算发放给用户的   
LML  
 数量,这个协议存储的   
LML/USDT  
 价格只在   
updatePrice()   
被调用、且距上次更新至少 3600 秒后才刷新;然而发放出去的   
LML  
 立刻可以按实时 AMM 现货价赎回。任何在这个冷却窗口内移动现货价格的外部行为,都会在冻结的计提价与鲜活的赎回价之间撑开一个缺口,而合约不会因为这个缺口变得离谱就拒绝领取。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqvWBfpaxl8cxTNM11ArRa9uEO7eSVqno1R7z4Fn8y9K7pYx7zqezsk4y8BYrfy7HyjjCaP1libGXZHUFxA4rcuwV9MMWibG1XUWM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqsic98qswPszQ099iaNH8I1ald70O4vOzCG6vv4HVEdhBKAKNrfIcKjiaHrY1Ms8ItdAeoefyyt09YayWnOhIAdWbibicCbTdK7Fq3E/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqtibtpEPGAcWORY2OE8qYc23KwnTIQIibUnLeich3F8IOh4dHiaf6Ux7FCdiaicvDa04MvzqNukSUz1gFo4f1FaUfa2nEcN0dAevZ9xk/640?wx_fmt=png&from=appmsg "")  
  
第二处结构性缺陷在于奖励池的补给方式。当   
PROOF  
 合约的   
LML  
 余额不足以支付一次领取时,  
swapBack()   
通过调用   
supe  
r._transf  
er(swapPair, PROOF, deficit)  
 再   
sync()  
 来补充,直接从 LP 配对的储备中抽走   
LML  
 并重新对齐配对的存储状态,而不是走正常的 swap 路径。由于绕开了配对的价格发现机制,每一次触发该路径的领取都会减少配对中的   
LML  
   
储备  
并进  
一步挪动现货价格,而没有任何对冲的代币流入;因此反复领取会机械地不断拉大冻结的 stored_price 与实时卖出价之间的差距。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqtRRuXibMwtjqD5ubwncItMnbiaibjgeIU62wV5SrkobcfYTF6hibibTmDicah42bHoicVqXghg6Y8hvGibuF7pBf7rxFaLWdMiaCpVCOWo/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqvTZQz1piad6YUtXSlRITw8cepMRpg41t5hGGgwK8AuUmv2V9ZIC9RiclBDxcAIIU91OzU3tZSYaAaKFNoa6kCkaDMue8bN7ahRU/640?wx_fmt=png&from=appmsg "")  
  
**攻击分析**  
  
以下分析基于交易 [0x805d...5b47](https://app.blocksec.com/phalcon/explorer/tx/bsc/0x805d273a63d905d7827d43f6dc051eafdcd0cb69a07c7eb74358c6a5c6255b47),[0x70f7...3572](https://app.blocksec.com/phalcon/explorer/tx/bsc/0x70f7f898987ad159b678633805fad5c55452b3073d5f4c2500121633ee2f3572)。  
  
Step 1:   
攻击者通过来自 Moolah 的闪电贷,从 Venus 和 Moolah Pool 借款(以   
WBNB  
 作为抵押),以及来自 PancakeSwap V4、多个 V3 池和 V2 池的闪电贷,聚合了大量   
USDT  
 和   
WBNB  
。这些资本是用于操纵   
LML  
/  
USDT  
 配对价格所需。  
  
Step 2:   
攻击者调用   
LML  
 代币合约上的   
swapAndTrans()  
,将合约中累积的   
LML  
 手续费换为   
USDT  
。此举抽干了   
LML  
 合约自身的   
LML  
 余额,意味着它不能再作为本地代币来源,后续任何奖励发放都需要通过   
swapBack()  
 从 LP 配对中拉取   
LML  
。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqsiaQrskEEcy1G2czgvT3lrOgq7LTkV5VfF0OEGLS4QglTZCw43mVXaPJECIDr7ic7FrRZ1m6uialfKxxZ9RQ3PcBYg80tcGCwSPk/640?wx_fmt=png&from=appmsg "")  
  
Step 3:   
攻击者通过 PancakeRouter 的   
swapExactTokensForTokensSupportingFeeOnTransferTokens  
 将   
USDT  
 换成   
LML  
,接收方设为死亡地址。所购买的   
LML  
 代币被销毁,而非由攻击者接收。其唯一目的是从配对中抽干   
LML  
 并抬高   
LML  
 在 AMM 上的价格,攻击者本身并不需要这些代币,只需价格扭曲。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqtKticBRgavTP6LH2EjLkAnYEAu8lDR8d5n6icfpCtGicCfq1icjoYunfoJzwor3icOyFhicdTv3M3icrDCibaE2203iaN7nSZibl2GWZLPM/640?wx_fmt=png&from=appmsg "")  
  
Step 4:   
攻击者此前已经使用 11 个 EOA 地址向质押协议存款。由于 APower 的   
receive()  
 基于   
msg.sender  
 触发   
_claimReward(msg.sender)  
,只有存款地址本身才能领取奖励。为了在单笔交易内为这 11 个 EOA 全部领取奖励,攻击者使用 EIP-7702 在这些 EOA 上设置代码,使其能够被攻击者主合约作为合约调用。每个 EOA 执行一个   
transfer(rst, fte)  
 函数,向 APower 发送少量   
BNB  
,触发 receive() 和   
_claimReward(EOA)  
。在每次领取中:  
updatePrice()  
 被跳过(3600 秒冷却未到,所以   
stored_price  
 仍是历史低值),  
updateUser()  
 用过期低价计算奖励,  
sendMining()  
 把   
LML  
 从 PROOF 转入 APower 然后触发 swapBack(),后者通过从 LP 配对中拉取   
LML  
 并调用   
sync()   
补充 PROOF,进一步减少配对储备。最后   
claimReward()  
 把   
LML  
 分发给 EOA,每个 EOA 把收到的   
LML  
 转回攻击者合约。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqu7oUk40deXJL2RNmNbEbHWCYY22uRNiaN4iclZlKB2CgV6BiaqdibZwdgG7Vwok6SNYz8Lu3fzoUrInn3zzWUeUyGquVG4XFKeEfM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyquO2obZj98DpQf15XkdLSfV3JgqibSMPZPmt8nMicx5roLhNbUDu4CEfB82UBnKeslD6oRIp7VIeMqb6QNOBrZbU3thXBibUvTg2c/640?wx_fmt=png&from=appmsg "")  
  
Step 5:   
攻击者通过此时已被严重抽干的池,以极度抬高的价格把累积的   
LML  
 换回   
USDT  
。  
  
Step 6:   
偿还所有闪电贷、借款和手续费。转出剩余利润。  
  
**结论**  
  
根本原因在于质押合约中奖励计提与奖励赎回之间的定价不一致:奖励数量按一个被 3600 秒冷却锁住的存储   
LML  
/  
USDT  
 价格计算,而支付出去的   
LML  
 实际上按实时 AMM 价格赎回,两者之间没有任何偏差校验。  
swapBack()  
 补给路径进一步放大了这一缺陷,每次领取都会直接从 LP 配对抽走 LML,随着领取次数增加,机械地不断拉大冻结的存储价与实时卖出价之间的差距。  
  
对于使用 AMM 衍生价格计算奖励的质押协议,应当在领取时对存储价和当前现货价之间做偏差校验,偏差超过安全阈值即回滚;同时应避免使用绕开正常 swap 路径、直接改动 LP 储备的补给机制,这类机制会绕开原本能限制过期定价影响范围的价格发现过程。  
  
**Tactile Incident**  
  
**简要概述**  
  
2026 年 4 月 1 日,Polygon 上的分级存款协议 Tactile 损失约 $12K。根本原因是其存取结算逻辑中存在不一致: 入金和出金都按   
CES  
 的当前现货价格换算,而内部份额本身并未记录其被铸造时对应的资产价值。攻击者正是利用这一点,先抬高现货价格再存款以获得超额份额,再压低价格赎回得到更多   
CES  
,通过多个辅助合约反复循环提取利润。  
  
**背景**  
  
Tactile 是 Polygon 上的分级存款协议,用户按选定的等级向支付合约存入   
CES  
。所需存款金额根据   
CES  
 的当前现货价格和等级配置计算,用户被记入一个代表其头寸的内部记账份额。取款时,记录的份额按退出时刻的现货价格换算回 CES,而不是按最初存入金额结算。因此,用户余额实际上被作为价格相关的记账单位、而非固定资产数量来跟踪。  
  
**漏洞分析**  
  
支付合约 ([0x9153e1...09b654](https://polygonscan.com/address/0x9153e149b0d90dea634ed9f7df6ff71c2109b654[#code]()  
  
)) 的核心缺陷在于,入金和出金结算依赖同一个现货价格源、在两个不同时刻读取,而这两次读取之间缺乏任何不可变的锚。存款时,合约调用   
getActualPrice()  
 并基于当前价格把存入的   
CES  
 换算为内部份额;取款时,同一份额按赎回时刻的现货价格换算回   
CES  
。  
  
由于份额本身不保存其铸造时的价格或对应资产数量,这两个时点之间任何现货价格的移动都会直接转化为入金与出金之间的   
CES  
 差额,使协议的记账系统完全暴露于价格路径、而非锚定于底层资产价值。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqv8zXJ2brcZd18hDgmsZRug15m5pXfrzBiag01f8u99vicBST7QBe6gniauUJIqjULiaicxCmu5cMRbqUsM0UMk1QKUkaezLdeSLPOk/640?wx_fmt=png&from=appmsg "")  
  
**攻击分析**  
  
以下分析基于交易 [0xc321...da74](https://app.blocksec.com/phalcon/explorer/tx/polygon/0xc321335ef7fa3ab3390f069bb0c647f5578dad9e50f4a52c4aa3bd2012a9da74)。  
  
Step 1:   
攻击者首先从 Uniswap V3 闪电池借入 55,365e18   
CES  
,并将资金分配给 5 个辅助合约。每个辅助合约先收到 6,426e18   
CES  
,然后调用   
deposit(12)  
。在此过程中,每个辅助合约先查询   
getPriceForLevel(12)  
,然后基于当前价格准备此次存款所需的   
CES  
 数量。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqu12B5jpAVC0OnZ0cjDfjwdD0HppIWn8cG3rek8GrpNEsStxCB8XmHZX66vbfOAdDPxKXRSbgaibbfZEQia608e8Dk0ke8LVEdM8/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqvu4ev8KXVPgatTRelJUJo5E2xcEOtE8zRGZXfhkLfj2hhcSBs20zzd7JS6hxpdYs1CicA9O2FWy5IicZg6to9NtFOgMS6HVibpxE/640?wx_fmt=png&from=appmsg "")  
  
Step 2:   
5 个辅助合约完成第一轮   
deposit  
 后,攻击者在   
DEX  
 上抛出 300,000   
CES  
,把   
bank  
 使用的价格从 1.067585 压到 0.688542。5 个辅助合约随后逐一执行   
withdraw  
,把先前以高价创建的份额按现在的低价兑换成   
CES  
。每个辅助合约获得 9,427e18   
CES  
。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqt4YIiaX15u6j6rlT8qt4T1vEXzzb3PjUwbWjZRTPZ3xx0uoNoyKmBwqwYcCROyaM3d20UWibKXTdyZuyHgRmUPNalgRQED0RJ5U/640?wx_fmt=png&from=appmsg "")  
  
Step 3:   
完成第一轮   
withdraw  
 后,攻击者把所获得的对手方资产换回 CES,把价格再次推高。然后攻击者重复 Step 2-3。  
  
Step 4:   
最后,经过多轮攻击循环,在偿还闪电贷和 166.097975017841805126   
CES  
 闪电贷费后,攻击者剩余 567,736e18   
CES  
 作为利润。  
  
**结论**  
  
本次事件的根本原因是 Tactile 在存款和取款时都按可被操纵的现货价格结算,而没有把记账份额锚定到存入时刻的资产数量或价格,使其内部记账完全暴露于入金与出金之间的任何价格移动。  
  
对于以波动性资产铸造头寸份额的协议,每一份份额都应当锚定到铸造时刻的具体资产数量或价格,使赎回时还原原本的经济价值、而非按实时预言机重新计价。若结算函数必须引用当前价格,则应采用时间加权或其他抗操纵的价格源,并避免直接读取那些可以被与结算调用同一笔交易内的交易操纵的现货价格。  
  
**SAS Token Incident**  
  
**简要概述**  
  
2026 年 4 月 2 日,BNB Chain 上的   
SAS  
 代币被攻击,损失约 $12K。根本原因是其自定义 transfer 逻辑存在缺陷: 向 LP 池发送   
SAS  
 只会累加一个全局   
sellBurn  
 计数器,而之后任意一次普通 transfer 都可以直接从池中烧掉   
SAS  
 并调用   
sync()  
 重写储备,整个过程不经过   
AMM  
 的 swap 逻辑。攻击者正是利用这一点,先通过卖出累积 sellBurn,再触发一次无关的普通 transfer 从池中烧掉   
SAS  
 把储备压到 1 wei,最后把手中剩余的 SAS 反向换出获利。  
  
**背景**  
  
SAS  
 是 BNB Chain 上的一个通缩型代币,构建在一个 PancakeSwap V2 池之上,带有自定义的 transfer 逻辑。其   
transfer()  
 函数区分两条路径: 一条是卖出路径,当转账目的地为 LP 池时触发,按转账数量累加一个全局   
sellBurn  
 累加器;另一条是普通转账路径,当   
sellBurn  
 非零时,会直接从 LP 池中烧掉   
SAS  
,随后调用   
sync()  
 把池的储备更新为新的链上余额。两条路径本意是作为一种通缩机制协同工作,让池中   
SAS  
 储备随累积的卖压减少。  
  
**漏洞分析**  
  
SAS  
 代币合约 ([0xbfa266...3d91c6](https://bscscan.com/address/0xbfa266aeb18d34ef4f8749fc7a1b2064af3d91c6[#code]()  
  
)) 的核心缺陷在于其通缩机制与   
transfer()  
 的耦合方式。当   
SAS  
 被转入 LP 池时,合约会按转账数量累加一个全局   
sellBurn  
 累加器;之后任意一笔普通 transfer 只要发现 sellBurn 非零,就会调用 _burnFromPair() 直接从 LP 池中烧掉   
SAS  
,并紧接着调用   
sync()   
把池的储备重写为其链上余额。  
  
问题在于这条 burn-and-sync 路径不经过   
AMM  
 的 swap 逻辑就直接改写了池的储备。一旦   
sellBurn  
 已经通过向池中的转账被推高,只需一笔无关的普通 transfer 就能触发这次 burn 和 sync,把池中   
SAS  
 储备压向零,制造出可以通过一次正常 swap 收割的大幅价格扭曲。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqvZiauGtUPK3R8coTl1zWfVF0QuBe0UUicia0NQVlhrjicFvSNMYAoIe8VXdp9iaGof7Xf7NOCJSLiaDMmlswiaY5CJFHmwhuRgAFEiaPI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqv3eKGcFZ07AtgLqpm4nKTP8ZsHtM1rYiaMkeTdw7OI6zuNFwjTn5yb6DqKTZHY8qv77BDhyicdicpM06CoAGtwREfMGzIkwdqdrs/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqsy4n27SauLyCEn6pE0zfuwm9lK02BzauGy5micm5013u6braPBe5laUdSWhaw3uhAaWItNa6n0NgdapfrOzYAP40mR8XfIjlU4/640?wx_fmt=png&from=appmsg "")  
  
**攻击分析**  
  
以下分析基于交易 [0x878e...adc5](https://app.blocksec.com/phalcon/explorer/tx/bsc/0x878e214a895b057e2f284a084135a6dbe5fe3d696402da6380547a3e5696adc5)。  
  
St  
ep   
1:   
攻击者通过闪电贷借入   
WBNB  
。  
  
Step 2:   
攻击者把   
WBNB  
 换成   
SAS  
。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqs2PWhKV23RWwu2PKoJaQgKhctWr6AnTrRICpw5StVeibgF7JllALJXdYkUia5l3hcGZM5Q5iaWvqWdK1hdxrAJosjmnlmUum52nk/640?wx_fmt=png&from=appmsg "")  
  
Step 3:   
攻击者部署一个合约,并在   
constructor()  
 中执行攻击逻辑。这是为了绕过协议的   
is_contract()  
 检查,因为代币合约要求   
transfer()  
 的发起方必须是白名单地址或 EOA。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqvKrFqDxLUanBd1RAhnuGkjjAns9aicVA3spxricLNnngL7sJUZYVxJ3PsSbCTRHfPYg4WGfMr23n4gbGsPmYmdMVNjDwIX7ibpoI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqsobiac5yaulWWg9hibqqzuQiboeVCZO8ALTxCEPZgqicSXxJaa3FKI0KQpb7cwbhUV8CcRugMXT8WkmVgEREZbKKEic1ObIFricwoVA/640?wx_fmt=png&from=appmsg "")  
  
Step 4:   
攻击者把   
SAS  
 转入池中,触发卖出路径并累积   
sellBurn  
。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyquwdcQl2I0u4zdBYhjR8cmwuG5blLtuD3kleTfxzicDgXBNcnTkU7p9f8lYchOmUsOVhUUTDXEkoCL4ne29fW9QV2aib9lraEEt8/640?wx_fmt=png&from=appmsg "")  
  
Step 5:   
攻击者部署了第二个合约,同样在其   
constructor()  
 中发起一次普通 transfer。由于 Step 4 已经把   
sellBurn  
 推成非零,这次 transfer 触发了   
_burnFromPair()  
 函数,直接从 LP 池中烧掉   
SAS  
,再调用   
sync()  
 函数,把   
SAS  
 储备压到 1 wei。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyquZ2wAN6ZVICkibu3Fia7zWyViaqBYf03osCibDE422S6xR6g3pOuyortDgvzS8MzzASkEfWiaDdXiaLIs6blRqmmVTZ1XulL4e5gLZc/640?wx_fmt=png&from=appmsg "")  
  
Step 6:   
攻击者执行反向交换,把剩余的   
SAS  
 卖出获利。  
  
**结论**  
  
本次事件的根本原因是   
SAS  
 代币自定义 transfer 逻辑中的一个缺陷: 一笔普通 transfer 就能直接从 LP 池中烧掉   
SAS  
,并把储备 sync 到减少后的余额,使累积的卖出活动被转化为对池中   
SAS  
 储备的任意缩减,并进一步转化为可通过一次正常 swap 收割的大幅价格扭曲。  
  
代币合约不应伸手到外部   
AMM  
 池的内部,在正常 swap 路径之外改动其储备。如果通缩设计确实需要从池中烧币,烧币和随后的   
sync()   
必须绑定到一个严格受控的内部触发,例如可信 keeper 或限速的时间表,而不是搭载在任意用户的普通 transfer 上。  
  
**Unknown-EIP-7702 Incident**  
  
简要概述  
  
2026 年 4 月 3 日,BNB Chain 上一个通过 EIP-7702 启用了委托代码的用户账户被洗劫,损失约 $17.2K。该委托代码暴露了一个缺少访问控制的   
pancakeV3SwapCallback()  
 函数。攻击者直接以构造的 calldata 调用该回调,迫使受害者账户把代币转出到攻击者控制的地址。  
  
背景  
  
受害者 EOA 使用 EIP-7702 Type-4 交易设置了委托代码,使账户能够执行 swap 相关逻辑。然而委托实现中包含了一个公开的   
pancakeV3SwapCallback()  
 函数,本应只在合法的 PancakeSwap V3 池回调期间被调用。  
  
漏洞分析  
  
根本原因是被委托合约 ([0x02C809...aEDbAE](https://bscscan.com/address/0x02C8095eC0F464d8cEDA95E4981c2668A8aEDbAE[#code]()  
  
)) 的   
pancakeV3SwapCallback()  
 函数缺少访问控制。  
  
在正确的 UniswapV3/PancakeV3 回调设计中,回调必须验证   
msg.sender  
 是预期的规范池(由 factory + token pair + fee 派生,或对照可信池列表验证)。本次事件中该校验缺失,任何外部调用方都可以直接调用此回调。  
  
由于该回调会从承载它的账户中发起代币转账,缺失的   
msg.sender  
 校验意味着任何带有正   
amount0Delta  
/  
amount1Delta  
 的外部调用都会进入回调内部的支付路径,把代币从受害者账户中转出,而整个过程并不涉及任何真实的 swap。  
  
攻  
击分  
析  
  
以下分析基于交易 [0x5b2c...4261](https://app.blocksec.com/phalcon/explorer/tx/bsc/0x5b2cef3d601b84d91f653a07dd36ff9895e4f698a625a36d0049a7948d7e4261)。  
  
Step 1:   
攻击者使用构造的参数直接调用   
pancakeV3SwapCallback()  
,触发回调中的转账逻辑,将受害者的代币转移到攻击者控制的地址。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqsNNl4HqQCpUmOXJuHfs3IneJU4VlCiaSh6b6vKtRbickagxibE8f1q4Cc22Rlj4jSdBj0MkvcGrbu4iaKoA8x1EKgN0ibDlibTotPPQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqtos7xFZOrgAHnFicUQ0heic7V3x3kiaCoCOQowJictsiateBdOb49dVc3RIzB47Y1ap1SgXTM0NUYZ1ibjAmZa9NxVO17Dx5V0I7GOo/640?wx_fmt=png&from=appmsg "")  
  
结论  
  
本次事件的成因是把 swap 回调逻辑部署到 EIP-7702 账户时未实施严格的回调认证。由于   
pancakeV3SwapCallback()  
 缺少访问控制,该回调可以被任何外部调用方直接触发,并被用来从受害者账户中转出代币,而全程并没有发生任何合法的 swap。  
  
对于实现 V3 风格回调的任何合约或委托 EIP-7702 代码,开发者必须在回调进入任何转账逻辑之前验证   
msg.sender  
 是来自可信 factory、对应正确 token pair 与 fee tier 的规范 PancakeV3 池。  
  
Silo Finance Incident  
  
简要概述  
  
2026 年 4 月 3 日,Arbitrum 上的 Silo Finance   
soUSDC  
 金库被攻击,损失约 $359K。根因是三个缺陷的汇合:一个 immutable 的   
wstUSR  
 预言机,即使该代币的市场价格已经跌至 ~0.12,仍然把它定价在 ~1.133;一个只约束金库自身存款、不约束外部存款的 supply cap 机制;以及一个   
totalAssets()  
 记账缺陷,把外部记入的   
bUSDC  
 份额计入金库资产,却没有为之铸造对应的   
soUSDC  
 份额。攻击者通过直接向 supply cap 为 0 的   
wstUSR  
 市场存入   
USDC  
 并指定 receiver=soUSDC,抬高了金库的份额价格,然后用被高估的   
wstUSR  
 作抵押把同一笔   
USDC  
 借回来,并按抬高后的估值赎回先前获得的   
soUSDC  
 份额,缺口由提款队列中的其他健康市场承担。  
  
背景  
  
Silo Finance 是 Arbitrum 上的一个风险隔离借贷协议。每个 Silo 市场是一对双边借贷对(例如   
wstUSR  
/  
USDC  
):借款人存入抵押品(  
wstUSR  
)并借出借贷资产(  
USDC  
),而出借人存入   
USDC  
 并赚取利息。当出借人向某个特定市场存入 USDC 时,会获得该市场的存款份额代币。当借款人存入抵押品时,会获得一个抵押份额代币(例如   
bwstUSR-149  
)。  
  
soUSDC  
 是一个 SiloVault,坐落在多个 Silo 市场之上以聚合   
USDC  
 出借。用户向 soUSDC 存入   
USDC  
 并获得   
soUSDC  
 份额。金库根据分配器设定的 supply cap,把存入的 USDC 路由到已批准的 Silo 市场,金库自身持有它存入的每个市场的 bUSDC 份额。当用户赎回   
soUSDC  
 份额时,金库通过   
totalAssets()  
 计算这些份额值多少   
USDC  
,该函数遍历提款队列中的每个市场,把金库在每个市场的   
b  
US  
D  
C  
   
份额余额相加。然后金库从底层市场提取   
USDC  
 支付给赎回人。  
  
wstUSR  
(Wrapped Staked   
USR  
)是 Resolv 发行的   
USR  
 稳定币的质押衍生品。Resolv 被攻击后,  
USR  
 脱钩,  
stUSR  
 也失去锚定,  
wstUSR  
 在二级市场的价格跌至 ~0.12。然而,  
wstUSR  
 的 Chainlink feed 只跟踪   
wstUSR  
 到   
stUSR  
 的包装比率(~1.133),而协议默认 1 stUSR = 1 USD,所以预言机继续把   
wstUSR  
 定价在 ~1.133,与市场实际相比有 ~10 倍的差距。  
  
漏洞分析  
  
wstUSR  
/  
USDC  
 市场的预言机地址在   
SiloConfig  
 中被硬编码为 immutable,无法替换。预言机合约 ([0x836a1a...04425e](https://arbiscan.io/address/0x836a1ab8151db99ce5d4978d535595eb1604425e[#code]()  
  
)) 本身是一个   
ChainlinkV3Oracle  
,其底层 Chainlink feed(描述为 "  
wstUSR  
 /   
stUSR  
 Exchange Rate")只跟踪   
wstUSR  
 到   
stUSR  
 的包装比率(~1.133),而非二级市场价格。协议默认 1   
stUSR  
 = 1 USD,所以把   
wstUSR  
 定价在 ~1.133。  
USR  
 脱钩后,  
stUSR  
 也失去锚定,  
wstUSR  
 在公开市场跌至 ~0.12,但预言机继续报告 ~1.133,产生 ~10 倍的高估。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqtrSlQnYHIfeoBd3bXdEYudZ35w0YqibmjbyicjvVpKWq0hicVmQs6L50KdKsGiaF5z0rTCz90X8Vm9BUjFqBu2ZQlqRzRkHunYwX4/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqt6C9JK837aNKDJF5dhibms6mhuXDLZb7c43QibZ0lXRJ3MmQoTgyL3ECvfBb15j9WxKzfTibflibiaw5PXiaIDIpibVSfL86XxfzbfgU/640?wx_fmt=png&from=appmsg "")  
  
协议对此风险有一定意识:  
soUSDC  
 给   
wstUSR  
 市场的 supply cap 被设为 0,意味着金库永远不会主动把   
USDC  
 路由进该市场。然而这一上限只约束金库自身的对外   
deposit()   
调用。由于   
wstUSR_Market.deposit()  
 接受任意的   
receiver  
 参数,任何人都可以直接向   
wstUSR  
 市场存入   
USDC  
,并把所产生的   
bUSDC  
 份额记到   
soUSDC  
 的地址下,从而完全绕过 supply cap。  
  
这构成了核心攻击路径。当   
bUSDC  
 份额通过这种外部存款落入   
soUSDC  
 余额时,  
totalAssets()  
 会把它们计入:它遍  
历提款队列中的每个市场,读取金库实际的份额余额,并不检查头寸是否是主动进入的。与  
此同时,这些外部记入的头寸不会铸造新的   
so  
US  
DC  
   
份额,因为金库自身的 mint 逻辑从未被调用。结果是   
totalAssets  
 增加而   
totalShares  
 保持不变,  
s  
oUSDC  
 份额价格被抬高。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqsDTWuV9n8DmvQgPRaVvhYkibibKzib1TzWWqlZsiahgObpAiceGGw9sXqRwjtYnyO9icZOq6DJCdJg1dbFrmr1yHicIJsAaicGgNWM2ZE/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqvy62dL7MhhHbtlISs6XuhnfQZXNcpLH5mcMcnSuUYib0BzMx2iaT4ynjBiaibQibkRukEyffRzibbM0fgQUmiaT9apuyA5U5icegI5bVM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqs3YiapGqlyyHqZKVbVpAOibqedicfhVucKn4ibfq47kIVEkIVxjwiaIOba3OtyAlLy3Pyx4QgpkAHqE2oehLQrMlbvficO2l8SicUezo/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqvX3Y4rZz82qdDk3qaBhiaFAgBHb1c5Rw56YFYPMmt1GTKEZ7OoYMkibohPN0JKmFabt5DRYdc2qe9IB3D6nYGDEHuUKibLicQW16A/640?wx_fmt=png&from=appmsg "")  
  
**攻击分析**  
  
以下分析基于交易 [0xf77a...f3e1](https://app.blocksec.com/phalcon/explorer/tx/arbitrum/0xf77adca385ef4a85167fa8a14fccffd8d9d00d05d28dfa52e686cb5bffb5f3e1)。  
  
攻击者首先在二级市场以约 0.12 的价格购入   
wstUSR  
。  
  
**Step 1:**  
从 Morpho 闪电贷 ~4,236,352   
USDC  
。仅靠预言机定价错误并不够,因为   
wstUSR  
 市场没有   
USDC  
 流动性(cap=0,  
soUSDC  
 从未存入),所以没有可借的   
USDC  
 来对应高估的抵押。闪电贷为后续的存款和捐赠步骤提供了所需资本。  
  
**Step 2:**  
把   
wstUSR  
 作为抵押存入   
wstUSR  
 市场,获得   
bwstUSR-149  
。这是为 Step 5 的借款做准备:预言机把 13,797   
wstUSR  
 估值在 ~15,633(每个 1.133),即使攻击者只付了 ~1,656。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqtnmwuedXUZFNBib7N8ibkDHb4ibicQoibVM4oanUNv4Ezx0ynNibWwOBERsSZOiaeLXWMF142TcBRebpBic4J5CKibaIenrwaw2OSPUElg/640?wx_fmt=png&from=appmsg "")  
  
Step 3:   
向   
soUSDC  
 金库存入 ~4,222,007   
USDC  
,获得   
soUSDC  
 份额(总供应量的 ~91.5%)。金库把这些   
USDC  
 路由到现有的健康市场(不是   
wstUSR  
 市场,因为 cap=0)。这些   
soUSDC  
 份额是 Step 6 中提取利润的工具:攻击者持有的份额越多,在份额价格被抬高时获益越大。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqv5VpZh8N4l03CHYUgUvfJULma2cL8qB4UbLKicud9c6Hib8iby74ib9yxw9kZE5qEt0024Wch6OEppsVmwhqHXKVfuKQOHjY6QtGs/640?wx_fmt=png&from=appmsg "")  
  
**Step 4:**  
 通过   
wstUSR_Market.deposit(receiver=soUSDC)  
 直接向 wstUSR 市场存入 ~14,344   
USDC  
,并把   
bUSDC-149  
 铸造给   
soUSDC  
。所产生的   
bUSDC  
 份额被记到   
soUSDC  
 的地址下,而非攻击者。这是核心操纵:  
soUSDC  
 的   
totalAssets()  
 现在按面值(~14,344 USDC)计入了这些   
bUSDC  
 份额,但没有铸造新的   
soUSDC  
 份额,因为金库自身的存款逻辑从未被调用,  
totalAssets  
 上升而   
t  
ota  
lShares  
 保持不变,  
soUSDC  
 份额价格被抬高。同时,这一步在原本为空的   
wstUSR  
 市场创造了   
USDC  
 流动性,这对下一步是必要的。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqtRh6m1u0V0FPsmTuGuLdicWxPwDA3INrt0YR7uQ8PUm0oDcWkl0fDPUwfqyug3R2vP02sXiboV5SvxRX2Xe0ZZNZlmyicHibpn5Uo/640?wx_fmt=png&from=appmsg "")  
  
**Step 5:**  
用 Step 2 中存入的抵押从   
wstUSR  
 市场借出 ~14,344   
USDC  
。预言机把抵押定价在 ~15,633,在 92% maxLTV 下攻击者可以借 ~14,344。这一步把 Step 4 中捐入的   
USDC  
 收回,借款和捐赠在现金上是中性的。但   
wstUSR  
 市场此时已被完全抽干:所有   
USDC  
 都被借出,只剩一笔由几乎一文不值的   
wstUSR  
 抵押支撑的未偿贷款。  
soUSDC  
 在   
totalAssets()   
中仍然按面值持有这些   
bUSDC  
 份额。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqufm3VRU7zU006pVEpQIMkU33cXRNSLQe0NQQ9TpOdLzyQs80jdfcHCXWxyaTiargTrhXFneiaGiaeUpeMLXSZnQZbjGFGzUEDAzA/640?wx_fmt=png&from=appmsg "")  
  
**Step 6:**  
赎回 Step 3 中获得的所有   
soUSDC  
 份额。份额价格此时已被 Step 4 的捐赠抬高,所以攻击者收到 ~4,235,143   
USDC  
,比 Step 3 中存入的 4,222,007 多 ~13,136。金库尝试从   
wstUSR  
 市场提款,但发现没有任何流动性(已在 Step 5 中借出),于是从提款队列中的其他健康市场抽取缺口。这就是损失实现的地方:来自其他   
soUSDC  
 存款人市场的真实   
USDC  
 被转出来覆盖被抬高的赎回。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyquvXib9Du3y9aQZE3PcjDCzlVGYPg9Ig8ib4bdoJr367xbvazX4Huv5aNz1JwTx2w1hBUlBszcGjrrw8X34wknKEaBBgzITOCYp4/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqsMFtqNOHhSgzfTgfxVDafZTIrSLxcctH9T9eXw0bcWQltKaHyYXibXaLIEvj1qXyklDfNH72DWOJcKW2uI7uUZ4J92uwqNKGib4/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqv9kG5E8L7rGYNibRUetcpouk9lYld5lRYicrvic35SRjaadKEbR7zLHxJLd5AKGxmxxeszhvGHmM5CPZlOdVM1aK79icicicDVxTkjg/640?wx_fmt=png&from=appmsg "")  
  
**Step 7:**  
偿还闪电贷。  
  
经过 32 轮循环,  
soUSDC  
 最终持有   
wstUSR  
 市场中的   
bUSDC  
 头寸,这些头寸按面值约为 $359K,但被价值仅为其一小部分的   
wstUSR  
 抵押支撑,利用率达到 100%,实际上是无法收回的坏账,由剩下的   
soUSDC  
 存款人承担。  
  
**结论**  
  
本次事件的成因是多重因素汇合:一个跟踪质押兑换比率而非脱钩资产市场价格的预言机,一个把外部记入头寸纳入   
totalAssets()  
 而不铸造对应份额的金库记账系统,以及一个只限制金库自身存款而不限制外部存款的 supply cap 机制。预言机地址在   
SiloConfig  
 中被设为 immutable,使得问题暴露后任何紧急修复都无法进行。  
  
对于在借贷市场之上做聚合的金库协议,  
totalAssets()  
 应当只计入金库通过自身存款操作进入的头寸,而不包括外部记入的份额余额。预言机地址不应当被永久 immutable;在底层资产脱钩时,应当存在用于价格 feed 更新的紧急治理机制。  
  
BlockSec 将持续监控链上安全动态，每周为大家带来深度的安全事件复盘。如果您的协议需要专业的安全审计或实时监控服务，欢迎通过官网或点击  
【阅读原文】  
联系我们。  
  
  
     
   
关于Bloc  
kSec  
  
BlockSec 是全球领先的区块链安全和合规公司，于 2021 年由多位业内知名专家联合创立。BlockSec 致力于提升 Web3 世界的安全性和易用性，提供一站式安全服务，包括智能合约/链/钱包安全审计服务、协议安全和数字货币合规(AML/CFT)平台 Phalcon Security / Phalcon Compliance / Phalcon Network、资金追踪调查平台 MetaSleuth和区块链交易分析工具 Phalcon Explorer 等。  
  
目前，BlockSec 已服务全球逾 500 家客户，既涵盖 Web3 知名公司 Coinbase、Cobo、Uniswap、Compound、MetaMask、Bybit、Mantle、Puffer、FBTC、Manta、Merlin、PancakeSwap 等，也包括了权威监管机构及咨询机构，如联合国、SFC、PwC、FTI Consulting 等。  
  
官网：https://blocksec.com/  
  
Twitter：https://twitter.com/BlockSecTeam  
  
推荐阅读  
👇  
  
[](https://mp.weixin.qq.com/s?__biz=MzkyMzI2NzIyMw==&mid=2247490504&idx=1&sn=ed76941ba8ee144bdd12cb0ddb7df70c&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkyMzI2NzIyMw==&mid=2247491200&idx=1&sn=f0a133511ca63c3deb086c51654e4157&scene=21#wechat_redirect)  
  
[#BlockSec]()  
   
  
