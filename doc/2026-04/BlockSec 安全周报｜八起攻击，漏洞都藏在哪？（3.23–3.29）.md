#  BlockSec 安全周报｜八起攻击，漏洞都藏在哪？（3.23–3.29）  
原创 BlockSec
                    BlockSec  BlockSec   2026-04-03 10:00  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/2ibKZs4HxyqsOqPBjTxpX6xrzEK5EtzTY5tCcmsnagVxUhSJH3JU3VpnJoRb25pBSGW9g05aQnY5htKFgUk6SoiccfxuR8FKlmQwzpxZ204ZY/640?wx_fmt=gif&from=appmsg "")  
  
在过去一周(2026/03/23 - 2026/03/29),BlockSec 共检测并分析了八起攻击事件,预估总损失约 $1.53M。下表总结了这些事件,各事件的详细分析见后续章节。八起攻击事件中，有四起仅定位到受损合约，无法定位到具体项目方，因此下文中以unknown Incident标示。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqsxv7fZa5SyfERgdQxjEQKZa3UcVva20Rx8WdZVYWps6p6tDTu9YcI1fdU0sr9ibCELckmiaON2SHzNVTfRyJbVbCu7czIqHU8zw/640?wx_fmt=png&from=appmsg "")  
  
**Unknown Incident 1**  
  
**简要概述**  
  
2026年3月23日,Ethereum 上一个未验证合约因分发逻辑中的整数溢出漏洞遭到攻击,损失约 $97K。函数   
0x317d  
e4f6()  
 累加用户控制的代币数量时缺少溢出保护,攻击者触发溢出后,仅支付 1 wei   
USDT  
 便通过   
claim()  
 提取了合约全部   
USDT  
 余额。  
  
**漏洞分析**  
  
根本原因是合约 [0xF0a105...568C97](https://etherscan.io/address/0xf0a105d93eec8781e15222ad754fcf1264568c97) 中函数   
0x317de4f6()  
 的整数溢出。该函数接受一组记录(每条包含账户和金额),通过遍历数组将所有金额累加到   
totalAmount  
 中。由于累加过程缺少溢出检查,攻击者可以精心构造记录,使金额之和超出   
uint256  
 上限后回绕为任意小值,而各条记录对应的分配额度依然很大。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqtRZOZtMQJZqavmdL1cx44R0Av33BrwXfiaP7Y33lJibWErXC8yEQlOZ5xGdF3iaLO0DWxmJ70MNn3dzqdlybPV5Sibkccuhwer9lI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqvpZ9F5VTXMpPLtGArjNsJlUIiawNMTnDwTUuuT21w62hCYsrKibEm7LE8rdydR9FLE4puJJAxtCr4Y0B7NOJNIb2iaq4SQFX0Vog/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqunTsewHQTOVw5OKI1UsD3IDQwicrG7IqFEqaeoufI5iakvlYtLXXLd8Gj6GvOL024gulYqs934aice2QIR74Qh3fRUibJ8jAKC0jo/640?wx_fmt=png&from=appmsg "")  
  
**攻击分析**  
  
以下分析基于交易 [0x73bd1384...630b053](https://app.blocksec.com/phalcon/explorer/tx/eth/0x73bd1384e7b628a29542239be4bc96af0871f7aa22d410c0b38d62367630b053)。  
  
Step 1: 攻击者从 Uniswap V4 借入 1 wei   
USDT  
 作为攻击的初始资金。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqukJ3jUsbxEficMXQw0kTicV0NUo6MSia7KmgZTPHLNcwMWIe0ZAVgxC6lokTiaykVuK1fdE7e97ZJAiaK8jNasYomGTw0o25uMGrDs/640?wx_fmt=png&from=appmsg "")  
  
Step 2: 攻击者查询受害合约的   
USDT  
 余额,然后使用精心构造的数组调用   
0x317de4f6()  
。其中一个金额设置为接近   
uint256  
 上限,另一个设置为受害合约的   
USDT  
 余额。两者之和溢出为 1,使攻击者仅需支付 1 wei   
USDT  
,却记录了等于受害合约全部   
USDT  
 余额的分配额度。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqugpm3jpzBBMhRWrhlO0HibVr2BuCT3fHTiapRic1CUk99jXdJzn4znPsFfmxcd0kRhUTRicvPwXqTdYiaNgYgrYujvSa1354cI8CuE/640?wx_fmt=png&from=appmsg "")  
  
Step 3: 攻击者调用   
claim()  
 从受害合约提取了 97,812e6   
USDT  
。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqsSYZmNPbvMudW2PNs5iaYqulUt4GkbadSyLUKibKqkhcNHr8AttM6ibc7PKSl057pBnT6tzmtVVSEar0mmcbxkJU6kyH7LgakmFY/640?wx_fmt=png&from=appmsg "")  
  
Step 4: 攻击者偿还了从 Uniswap V4 借入的 1 wei   
USDT  
,并将剩余   
USDT  
 兑换为   
WETH  
,完成攻击。  
  
**结论**  
  
此事件凸显了在 Solidity 0.8.0 之前版本中使用未检查算术运算的风险。所有关键的财务计算都应显式使用溢出安全的算术运算(如 SafeMath 或 Solidity >=0.8.x)以防止溢出问题。  
  
**Unknown Incident 2**  
  
**简要概述**  
  
2026年3月23日,Ethereum 上一个未验证合约因重入漏洞遭到攻击,损失约 $11K。函数   
0xbe16634e()  
 在结算前就更新了流动性记账,并且在没有重入保护的情况下调用了外部回调。攻击者趁前一次调用尚未结算便反复重入该函数,虚增了自身的流动性记录,随后提取了超出实际存入量的   
USDC  
 和   
WETH  
。  
  
**漏洞分析**  
  
根本原因是合约 [0x39Ed37...9C6b08](https://etherscan.io/address/0x39ed372f8e9f316029994ca7f73b6683829c6b08) 中函数   
0xbe16634e()  
 的重入问题。该函数在结算前就更新了流动性相关状态(包括用户流动性和 tick 储备),随后通过   
msg.sender.call()  
 调用外部回调,且未设置任何重入防护。由于余额检查针对每次调用独立进行,攻击者可以递归重入该函数来虚增内部流动性记账,而最深层调用中只需一次代币转账即可满足所有嵌套的余额检查。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqsIpw2nXqLwYcOTAMP0fD9wCnfb8xgykBnNPHG2GEKETUDp50oS9obqpKYKLuIIq6PpnOWE7e0P5Lr3sAj26yZNPzXTbASVsvs/640?wx_fmt=png&from=appmsg "")  
  
**攻击分析**  
  
以下分析基于交易 [0x1382e898...fad993](https://app.blocksec.com/phalcon/explorer/tx/eth/0x1382e898ae7582d184903b504aa43191a5d240851d5477a7464a29e262fad993)。  
  
Step 1: 攻击者从 Uniswap V4 借入 100e8   
USDC  
 和 10e18   
WETH  
 作为攻击的初始资金。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqu5nqCm68mngpQPsPB7LicrV6ZibicrUHzibqSmS8bgaDA6LgFnK7bRUPWRM9Vpk2neZ0tJT4bnuhicH2WYgrDqQBgS16U2ZhbeaIVw/640?wx_fmt=png&from=appmsg "")  
  
Step 2: 攻击者调用   
0xbe16634e()  
 添加流动性。在执行过程中,受害合约调用了攻击者的函数   
0x7c65be42()  
,该函数在前一次调用结算前重入了   
0xbe16634e()  
。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqsccG7UnATXhHBiaRvxF9UM3ovJRBadJgzF61OO4ZhG0cWw0IFQNKGuibQ4iaF7X9VxyvO4aLaAbKA6mTzslDVPdEImmgPoTzsZG4/640?wx_fmt=png&from=appmsg "")  
  
Step 3: 通过多次重复此重入流程,攻击者持续增加了自己记录的流动性。在最深层调用中,攻击者转入所需代币一次,就足以满足嵌套的余额检查。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqv6gY9KUjY1Z2Igxv12DselsVEQhPzgX1YSkiaJWrPY5lsibQfxKQYHWu3Xo7dqtXDOKRceLBqB4MlaksgTlnLk504KjZUOh8m4M/640?wx_fmt=png&from=appmsg "")  
  
Step 4: 虚增流动性记录后,攻击者检查了池子状态,并向池中转入额外资金,确保池中有足够的   
USDC  
 和   
WETH  
 来满足即将进行的提取。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqsclrKica9dtXBwVq01ZWTNWhfb6w6gNQJnTibzDlyGK6n6z6yvdUkFvsbVc75xyic0cfvFXAbFGlb9JO2NibxzNZVkJBRGbkrviatY/640?wx_fmt=png&from=appmsg "")  
  
Step 5: 攻击者再次调用   
0xbe16634e()  
 移除流动性,并基于虚增的记账数据从池中提取了   
USDC  
 和   
WETH  
。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqsdaxicN57fj2w7ib8fVXicZF07zUSAN1V8xibaXszys1rWOhKUgmfWWnv749j9PZYeZXnMsBLoNzicpSTT36We3u631V75DqfU1Jlg/640?wx_fmt=png&from=appmsg "")  
  
Step 6: 攻击者偿还了 Uniswap V4 的借款,将剩余   
USDC  
 兑换为   
WETH  
,完成攻击。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqthC3FDCQiaoicx3Hy2Vz6Y5xfib60rbX0XvPTgZA4WBBKEia9maLWokyqETdUyA3jwH55cNdfa03iccQnbaRYnickuOyt5QESXS4dx0/640?wx_fmt=png&from=appmsg "")  
  
**结论**  
  
此事件表明,在调用未受保护的外部回调的同时在结算前更新流动性记账是非常危险的。为防止类似攻击,协议应严格遵循 checks-effects-interactions 模式,并为外部回调添加重入保护。  
  
**Cyrus Finance Incident**  
  
**简要概述**  
  
2026年3月23日,BNB Chain 上的收益农场协议 Cyrus Finance 因流动性移除公式依赖池子当前现货价格遭到攻击,损失约 $512K。该协议使用 CYRP NFT 仓位表示用户在 PancakeSwap V3 流动性中的份额,但将份额转换为底层流动性时读取了同交易内可操纵的   
slot0()  
。攻击者通过闪电贷大额交换移动价格,虚增了 NFT 仓位对应的流动性价值,提取了超出合理权益的流动性。  
  
**背景**  
  
Cyrus Finance 是 BNB Chain 上的收益农场协议,负责管理 PancakeSwap V3 池中的流动性仓位。用户存入   
USDT  
 后获得 CYRP NFT 仓位,代表其在协议多个 PancakeSwap V3 仓位中的份额。用户可通过   
exit()  
 函数提取本金和收益。  
  
**漏洞分析**  
  
漏洞位于   
CyrusTreasury  
（[0xb042Ea...0aE10b](https://bscscan.com/address/0xb042ea7b35826e6e537a63bb9fc9fb06b50ae10b)）的   
withdrawUSDTFromAny()  
 函数。执行提取时,该函数从 PancakeSwap V3 池的 slot0() 读取 sqrtPriceX96(即当前现货价格),传入 getAmountsForLiquidity() 估算协议完整仓位当前对应的   
amount0  
 /   
amount1  
。  
  
随后,函数据此算出   
availableUSDT  
,再用以下公式确定需要移除的流动性:  
  
$liquidityToUse = liquidity  \cdot  remaining / availableUSDT$  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqsiarsMsTqMXTNG6eLlRn6Xj1g3PW5ISicrbZFvw9x3agYP8FUTO3nTZdhF8cjiaZq1u7tMYJScVB834fbTAahGNLQy6CodzjB3cc/640?wx_fmt=png&from=appmsg "")  
  
也就是说,合约不是直接按固定份额赎回,而是先用实时池价格估算仓位的 USDT 等值,再将请求的   
USDT  
 金额反推为对应的流动性数量。  
  
问题在于   
slot0()  
 在同一交易内可被操纵。攻击者只要临时移动池价格,就能扭曲   
availableUSDT  
,进而放大计算出的   
liquidityToUse  
。  
  
**攻击分析**  
  
以下分析基于交易 [0x85ac5d15...46d452](https://app.blocksec.com/phalcon/explorer/tx/bsc/0x85ac5d15f16d49ae08f90ab0e554ebfcb145712342c5b7704e305d602146d452)。  
  
Step 1: 攻击者从 PancakeSwap V3 池发起闪电贷,借入约 1,798   
ETH  
。  
  
Step 2: 攻击者在协议维护流动性的目标池中执行了大额   
ETH  
 换   
USDT  
 的交换,故意移动了池价格和当前 tick。同时,攻击者通过   
safeTransferFrom()  
 将 CYRP NFT 仓位 [#15505]()  
 从   
0x01737d...6ffa3  
 转移到攻击合约。  
  
Step 3: 攻击者在   
CyrusTreasury  
 上调用   
exit(15505)  
。执行过程中,  
withdrawUSDTFromAny()  
 从 PancakeSwap V3 池读取   
slot0()  
 并基于被操纵的现货价格计算   
availableUSDT  
。由于 tick 被扭曲,协议高估了 NFT 份额对应的流动性价值。随后调用   
decreaseLiquidity()  
 和   
collect()  
,释放了超出 Cyrus 仓位合理价值的   
USDT  
。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqtib3fcG3SF6zNjr8IGUibrervlDAaXo5A3sJNOibibMQc5dWus4xAocVygj57ZLkeD2acRwgibntep4JqzqlS6dNt9TTceD4xxVssk/640?wx_fmt=png&from=appmsg "")  
  
Step 4: 攻击者恢复池状态,偿还闪电贷,并将剩余利润(约 $512K)转至 EOA   
0xf96EB1...3b63b  
。  
  
**结论**  
  
缓解措施应将现货   
slot0()  
 定价替换为抗操纵定价(足够长观察窗口的 TWAP,或 Chainlink 等外部预言机),然后再将流动性转换为可提取的   
USDT  
。  
  
**BCE Token Incident**  
  
**简要概述**  
  
2026年3月23日,BNB Chain 上 PancakeSwap 的   
BCE  
-  
USDT  
 池因   
BCE  
 代币的销毁机制缺陷被攻击,损失约 $679K。攻击者部署了两个恶意合约绕过   
BCE  
 的买卖限制,并触发了针对流动性池储备的代币销毁,操纵池价格并抽取了池中的   
USDT  
。  
  
**漏洞分析**  
  
漏洞源于   
BCE  
 代币（[0xcdb189...999999](https://bscscan.com/address/0xcdb189d377ac1cf9d7b1d1a988f2025b99999999)）的销毁机制缺陷。核心问题在于：用户可影响的状态变量   
scheduledDestruction  
 被用于直接从 PancakeSwap 交易对地址销毁代币,而非从用户自身余额中扣除。在卖出操作中,合约基于交易量和当前池储备将销毁金额累积到   
scheduledDestruction  
 中,该值不从卖方余额扣除,而是之后通过单独的代码路径从交易对地址销毁代币并调用   
sync()  
。  
  
由于攻击者可控制交易量并操纵池储备,因此可以将   
scheduledDestruction  
 设为任意值,触发销毁以压缩交易对的   
BCE  
 储备,从而扭曲池价格。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqvkeVo4XiaZAn9WdfFFrBrpeyJHs0MSX56XAltqq2UIBzgicFoMJIVyGJ7OQ8aicDSkXXBo6X7thkpKVKhiaQh9Ywg83t902sr3vsY/640?wx_fmt=png&from=appmsg "")  
  
**攻击分析**  
  
以下分析基于交易 [0x85ac5d15...46d452](https://app.blocksec.com/phalcon/explorer/tx/bsc/0x85ac5d15f16d49ae08f90ab0e554ebfcb145712342c5b7704e305d602146d452)。  
  
Step 1: 攻击者调用恶意合约(MC1)通过多笔闪电贷和一个借贷池借入 123.5M   
USDT  
。  
  
Step 2: 攻击者部署第二个恶意合约(MC2),并将所有借入的   
USDT  
 转至 MC2。  
  
Step 3: 攻击者(通过 MC2)在   
BCE  
-USDT 池中将 2.222M   
USDT  
 兑换为 5.529M   
BCE  
。  
  
Step 4: 攻击者将 5.529M   
BCE  
 从 MC2 转至 MC1(通过   
MC1.drain()  
),由于销毁机制,MC1 收到 2.764M   
BCE  
。  
  
Step 5: 攻击者(通过 MC1)将 2.488M   
BCE  
 兑换为 1.368M   
USDT  
,将变量   
scheduledDestruction  
 更新为约 174K(基于池储备和交换金额)。该变量随后被用作销毁数量。  
  
Step 6: 攻击者(通过 MC2)将 34.9M   
USDT  
 兑换为 3.484M   
BCE  
,进一步将   
BCE  
 储备操纵至约 174K。  
  
Step 7: 攻击者将 3.484M   
BCE  
 和剩余   
USDT  
 从 MC2 转至 MC1。由于   
scheduledDestruction  
 大于 0(即约 174K),  
BCE  
 的转账触发了销毁,将   
BCE  
 储备压缩至约 10,000。  
  
Step 8: 攻击者以被操纵的价格将剩余   
BCE  
 兑换为   
USDT  
。  
  
Step 9: 攻击者偿还所有贷款,净赚约 $679K。  
  
**结论**  
  
此事件是代币经济逻辑中的根本缺陷导致的,用户可影响的状态变量被用于修改流动性池的余额而非用户自身余额。合约隐含假设交易活动产生的销毁会反映用户成本,但实际上,攻击者可以构造针对 LP 储备结算的延迟销毁。因此,攻击者可以用有限的资金敞口操纵池深度和定价,从流动性提供者处榨取价值。  
  
**Unknown Incident 3**  
  
**简要概述**  
  
2026年3月25日,BNB Chain 上一个未验证的质押合约因多种质押模式之间的记账不一致被攻击,损失约 $1.2K。该合约对   
stake2()  
/  
withdraw2()  
 和   
stake3()  
/  
withdraw3()  
 使用了相同的仓位变量,尽管这些函数处理的代币组合和比例不同。攻击者通过较轻量的   
stake2()  
 模式存入,再通过较重的   
withdraw3()  
 模式赎回,反复提取多余代币。  
  
**背景**  
  
该质押合约提供多种质押和提取模式。标准的   
stake()  
 /   
withdraw()  
 是完整模式,涵盖   
Pangolin  
、  
Bzzt  
 和   
Bzzone  
 三种代币及奖励记账。  
stake3()  
 /   
withdraw3()  
 使用同样的三代币组合和存取比例,但跳过奖励记账。  
stake2()  
 /   
withdraw2()  
 则是轻量模式,只处理   
Pangolin  
 和   
Bzzt  
,代币组合和比例与前两种模式不同。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqs51M2uqeJ87lzLYxoJdcy8I0uwic9ibuP1K2xfDuZP8kD69L8lkiawib3Co2vduajaXeqjqJvnhB4e1BXs0DLmHl4zvHelHUibPzGw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqtSFadQbKv2vtLl1YHYa1VDkCzaPR9chiaSlGaZdvGCIANDfVtpdwSBHdbTpIFb70D6xzUGKrzicBibXR81vzvTkdtuzy2wiaDUGLc/640?wx_fmt=png&from=appmsg "")  
  
**漏洞分析**  
  
根本原因是合约 [0x29d36c...774137](https://bscscan.com/address/0x29d36c4e97e0bbdc1382a4a71656ed226d774137) 中这些质押模式之间的记账不一致。虽然   
stake2()  
/  
withdraw2()  
和   
stake3()  
/  
with  
dr  
aw3()  
 处理不同的代币组合,但它们都更新相同的变量   
_exit[msg.sender]  
 和   
_totalSupply  
。因此,通过较轻量的   
stake2()  
 模式创建的仓位可以通过较重的   
withdraw3()  
 模式赎回。  
  
具体来说,  
stake2(amount)  
 仅拉取   
amount  
 个   
Pangolin  
 和   
amount  
 个   
Bzzt  
,而   
withdraw3(amount)  
 则转出   
amount  
 个   
Pangolin  
、  
10 * amount  
 个   
Bzzt  
 和   
10 * amount  
 个   
Bzzone  
。例如,通过   
stake2()  
 质押 20e18 个   
Pangolin  
 和 20e18 个   
Bzzt  
 后,攻击者可通过   
withdraw3()  
 提取 20e18 个   
Pangolin  
、200e18 个   
Bzzt  
 和 200e18 个   
Bzzone  
。反复利用此不匹配,攻击者持续从合约中提取多余代币。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqsGFGD96lDK1gPIiakBApcpKtQibHSNjn74S69USkRlNEAQyWFibjgeVWWhOYEF5qMn9nic2vvTcVwGvyuBZ6OWR4ySGH3e3k1iaibS4/640?wx_fmt=png&from=appmsg "")  
  
**攻击分析**  
  
以下分析基于交易 [0x7fcd5882...323f8d](https://app.blocksec.com/phalcon/explorer/tx/bsc/0x7fcd5882da17dea5c5a7e6be4e3c2c856891dec4ea10f463fd220cd61c323f8d)。  
  
Step 1: 攻击者在   
0x9bce07d8bbe4f19dfe465710ff9612878bfe3302  
 部署合约,注入 0.05   
BNB  
,将资金包装为   
WBNB  
,兑换为恰好 20e18   
Pangolin  
、20e18   
Bzzt  
 和 200e18   
Bzzone  
,并授权质押合约使用这些代币。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqvMtVicQgv6NgSJMd4ibfzW2zTWOnc3q9iaP21AiaibQmJ4DbnVw0ibSdf5j6OibvvjA6o1qibWzaA3NIB1V6ZecCCY2gxFDkDibHNL9jjQ/640?wx_fmt=png&from=appmsg "")  
  
Step 2: 攻击者以 20e18 为输入调用   
stake2()  
,将 20e18   
Pangolin  
 和 20e18   
Bzzt  
 转入质押合约,并将攻击者的共享   
_exit  
 余额增加 20e18。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4Hxyqtv47ZypRoibrsrA5GHwic3uLT6mNicG3HXibFy8MP31fvpjFXEJIVeqMcXMhgT6XYbQtVsATV1o3mChbOP0QHYu4oS1xTroDKvUkw/640?wx_fmt=png&from=appmsg "")  
  
Step 3: 攻击者以 20e18 为输入调用   
withdraw3()  
。由于   
withdraw3()  
 仅检查共享的   
_exit  
 余额,合约转回了 20e18   
Pangolin  
、200e18   
Bzzt  
 和 200e18   
Bzzone  
,尽管该仓位是通过   
stake2()  
 创建的。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqsp8icad6kUa0VFLlJkhZaSbN5LAg7nO7drK0EagedE11JjQl2vPxarsbSunFiclB119KTrhibKC8YibGW9YH7k2dOkts6VHywKicTg/640?wx_fmt=png&from=appmsg "")  
  
Step 4: 攻击者在同一交易中多次重复   
stake2()  
 ->   
withdraw3()  
 循环。每轮中,返回的   
Pangolin  
 和一小部分   
Bzzt  
 被用于下一次   
stake2()  
 调用,而   
Bzzone  
 被送回质押合约以确保后续   
withdraw3()  
 调用能继续成功。通过此循环,攻击者将其   
Bzzt  
 余额从 20e18 增加到 16,400e18。  
  
Step 5: 攻击者将获取的代币兑换回   
WBNB  
,解包为   
BNB  
,并将约 2.007e18   
BNB  
 转回攻击者 EOA,完成攻击。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4Hxyqv5rO0oYN70YVp1tsGEHAp62JW3wX1cic5eXmcHpl1eico0ibzleplFNxiaVLU93f9zmhLm44TL63nIXZjt7Y7ewPnDmHEer10liaBI/640?wx_fmt=png&from=appmsg "")  
  
**结论**  
  
为防止类似攻击,质押合约应隔离每种模式的记账,并确保每条提取路径与其对应的存入路径的资产组合和比例完全匹配。  
  
**MYX Incident**  
  
**简要概述**  
  
2026年3月25日,MYX Network 在 Ethereum 上的   
sMYX  
 合约遭到攻击,约 667 万   
MYX  
 代币被抽取(利润约 $3.6K)。根本原因是   
sMYX  
 合约的转账函数在供应量记账和分红分发两方面存在缺陷。攻击者在受控账户之间反复转账   
sMYX  
,虚增了 profit-per-share 变量,凭空制造分红,最终提取了超出实际存入量的   
MYX  
。  
  
**背景**  
  
sMYX  
 合约（[0x404328...d27F66](https://etherscan.io/address/0x40432844506f3a51c266ecabad2beb23cad27f66)）采用分红代币模型。用户存入   
MYX  
 获得   
sMYX  
 份额,分红通过全局累加器 profit-per-share（存储在   
stor_11  
）跟踪。每个用户的可领取分红 = 其份额对应的累积利润 - 已记录的支付基准。该模型类似于早期的反射型代币:新流入的价值按比例分配给现有持有者。  
  
**漏洞分析**  
  
漏洞出在转账函数对供应量和分红的处理上。每次转账时,函数将转账金额除以当前总供应量,把结果加到全局 profit-per-share 上,但这并没有对应任何真实的   
MYX  
 流入,相当于凭空创造了分红。与此同时,由于减法辅助函数的语义反转,转账还会把总供应量减去转账金额,尽管实际上并没有代币被销毁。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyquN6YtoPxCuCXGibTicw7atiaialB32iaKX06TMQ0MuzEpjISlcXZUqRbcFSX8vKepRlUH67rs8voVsQ9EbQPbEApqfvOthszz44hibI/640?wx_fmt=png&from=appmsg "")  
  
两个效果叠加后,每次转账都会使 profit-per-share 的增量更大,因为同样的转账金额要除以越来越小的总供应量。  
  
**攻击分析**  
  
以下分析基于交易 [0x843c9ea7...a55b90](https://app.blocksec.com/phalcon/explorer/tx/eth/0x843c9ea7edf09ea234d99de189c6a6ba9b79d958bbbbdbc56fd477028ea55b90)。  
  
Step 1: 攻击者通过闪电兑换获取初始资金并将其转换为   
MYX  
,然后存入   
sMYX  
 合约以获取分红系统中的主导份额仓位,确保控制未来大部分奖励分配。  
  
Step 2: 攻击者将仓位分散到两个受控合约中,并启动一个协调循环,交替进行分红实现和状态操纵,使其能反复遍历有漏洞的记账路径。  
  
Step 3: 通过在受控账户之间反复转账,攻击者人为虚增了协议的 profit-per-share 变量,同时减少了记录的总供应量,创造了无支撑的分红并放大了分配率。  
  
Step 4: 在每个操纵周期后持续提取,攻击者提取了这些虚假奖励的大部分,在不引入新资金的情况下有效地从协议中抽取了   
MYX  
 储备。  
  
Step 5: 攻击者退出所有仓位,将提取的   
MYX  
 兑换回   
WETH  
,偿还闪电贷,并保留剩余余额作为利润。  
  
**结论**  
  
此事件的本质不是类 Ponzi 的经济模型问题,而是分红记账实现中的关键缺陷。转账操作不应影响总供应量或触发分红分发,profit-per-share 的更新只应在有真实资产流入时发生。  
  
**Unknown Incident 4**  
  
**简要概述**  
  
2026年3月26日,BNB Chain 上一个带推荐奖励的   
TUR  
 质押合约遭到攻击,损失约 $133.5K。  
Stake  
 合约使用实时 AMM 现货价格计算存款价值,而该价格在单笔交易内可被操纵。攻击者通过闪电贷虚增   
TUR  
 价格,在价格膨胀窗口期内质押,并通过自控推荐人账户领取了远超合理水平的   
TUR  
 奖励。  
  
**背景**  
  
Stake  
 合约（[0x03D809...415Abe](https://bscscan.com/address/0x03d8096377ea7683d840e395d72439f7b6415abe)）是一个带推荐奖励的   
TUR  
 质押合约。用户先通过   
bind()  
 绑定上线,再调用   
stake()  
 质押   
TUR  
（代币被发送到   
0xdead  
 销毁）,同时获得内部   
power  
 值,这个权重决定了用户之后能领取多少   
TUR  
 奖励。  
  
power  
 的计算不是按固定比率,而是通过   
getPowerAmount()  
 将存入的   
TUR  
 按实时 AMM 价格（  
TUR/NOBEL  
 ×   
NOBEL/USDT  
,均从当前交易对储备读取）折算为 USDT 计价的权重。此外,合约还通过   
_distributeRefPower()  
 向一级和二级推荐人发放额外 power。  
  
**漏洞分析**  
  
根本原因是   
Stake  
 合约中不安全的现货价格依赖。每次存款时,  
stake()  
 计算   
uValue = getPowerAmount(amount)  
,将其转换为   
_power = _uValue * 100  
,更新质押者的记账,然后调用   
_distributeRefPower()  
 向上游推荐人传播额外算力。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyqvRicxobLwiaDo30LfiagISO256WCUpIj0HhBY66q9JgHg9R3uHkAuJ5o4Pz5EPSplibMiaIjtgAoOHHXrfOMU8FicIibFvAIkNbsDaRQ/640?wx_fmt=png&from=appmsg "")  
  
uValue  
 的具体计算如下:  
  
$uValue = getPowerAmount(amount)$  
  
其中   
getPowerAmount()  
 实际上是:  
  
$amount \times \text{TUR/NOBEL spot price} \times \text{NOBEL/USDT spot price}$  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyquKfOzXFpb403qc8PQibORleQ5iblicYicicLe3tbUUjsrUQKd60iaR5Ygr4dehOwmk4BLZHmiawxIVjgfumjoURNSibRGQlAQPGtdw6Sk/640?wx_fmt=png&from=appmsg "")  
  
实现直接通过   
getReserves()  
 从当前交易对储备读取这些价格,因此质押估值完全依赖于同交易现货价格,而非抗操纵的预言机或 TWAP。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqtY86zJG0jjuaQoe6DwwyXaOj2iaO2HvCmfXniaicfMqZsUcBib2PpKj7f3NHnQsfMuiaIZtpWkRa3Bib4cHyyaUmgxB7U6V7UkPeeqM/640?wx_fmt=png&from=appmsg "")  
  
这使攻击者可以临时虚增   
TUR  
 的链上估值,在操纵窗口期内质押,获得远超实际价值的   
uValue  
 和   
power  
。  
  
推荐逻辑进一步放大了影响:  
_distributeRefPower()  
 将质押者 20% 的算力分给一级推荐人、5% 分给二级推荐人,但这些额外算力没有同步更新推荐人的   
rewardDebt  
。攻击者控制的推荐人账户因此可以立即领取远超合理水平的   
TUR  
 奖励。  
  
攻击分析  
  
以下分析基于交易 [0x96c9ce3c...81e348](https://app.blocksec.com/phalcon/explorer/tx/bsc/0x96c9ce3c527681bf0da18511d142efb5769ad8dac1d9d659a6b70a697381e348)。  
  
Step 1: 攻击者从 ListaDAO 的 Moolah 合约借入 1,900,000e18   
USDT  
 作为闪电贷资金。  
  
Step 2: 攻击者使用借入资金操纵   
NOBEL  
-  
USDT  
 和   
TUR  
-  
NOBEL  
 池,临时大幅推高   
TUR  
 的现货估值。  
  
Step 3: 在被操纵的窗口期内,攻击者将 7,770,707e18   
TUR  
 质押到   
Stake  
 合约。交易发出的   
StakeEvent  
 显示了大幅虚增的   
uValue  
 为 8,283,864e18,对应   
power  
 为 828,386,488e18。  
  
Step 4: 由于攻击者已预先安排了自控推荐人账户,  
_distributeRefPower()  
 向其授予了来自被操纵质押的额外奖励算力。一级和二级推荐人分别获得了预期的 20% 和 5% 推荐分配。  
  
Step 5: 获得提升的推荐人账户随后从 Stake 合约领取了   
TUR  
 奖励。在同一交易中,  
Stake  
 向   
0xFd11...AcEaB  
 转账 15,238,941e18   
TUR  
,向   
0x9007...E550B  
 转账 3,809,924e18   
TUR  
,两个地址立即将相同金额转发给攻击者。4:1 的支付比率与合约 20% 对 5% 的推荐算力分配一致。  
  
Step 6: 交易还显示领取费用从   
Stake  
 流向资金钱包   
0xb302...89923  
,与   
claim()  
 实现中在向领取者发送奖励前收取 3%   
TUR  
 费用一致。  
  
Step 7: 提取放大的   
TUR  
 奖励后,攻击者将所得兑换回   
USDT  
,偿还 1,900,000   
USDT  
 闪电贷,并将 133,490e18   
USDT  
 转至   
0xEf67...4e5898  
 作为利润。  
  
**结论**  
  
问题出在   
Stake  
 合约的奖励估值模型可被操纵,而非   
TUR  
 代币自身的 LP 分红记账。由于质押算力和推荐奖励都绑定在实时 AMM 储备比率上,攻击者可以用闪电贷虚增   
TUR  
 现货价格,制造远超实际的奖励算力,再通过自控推荐人账户从质押合约中提取   
T  
U  
R  
。更安全的做法是用抗操纵的预言机或足够长的 TWAP 替代现货储备定价,同时确保推荐算力的增加都配有一致的 reward-debt 更新。  
  
**EST Token Incident**  
  
**简要概述**  
  
2026年3月27日,BNB Chain 上的   
BNBDeposit  
 合约遭到攻击,损失约 $92.3K。事件涉及两个问题:  
BNBDeposit  
 的现货价格依赖和   
EST  
 代币的销毁机制缺陷。攻击者先利用价格依赖获取大量 EST,再利用销毁机制缺陷通过三明治式操纵从   
EST  
-  
WBNB  
 池中抽取资金。  
  
**漏洞分析**  
  
事件的根本原因有两方面:  
  
1.   
BNBDeposit  
 合约（[0xE71547...d29A61](https://bscscan.com/address/0xe71547170c5ad5120992b85cf1288fab23d29a61)）中的函数   
onTokenReceived()  
 基于合约余额和   
EST  
 的现货价格计算用户的可领取金额,两者都容易被操纵。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2ibKZs4HxyquWjtbHmTTytJJ9r4QR6rEb7wtiaKTtT5fWnmy4a7W4Onc00WvTBsE5ofiaod0fhZiasDU4YKor018e2FicjDcDjoPOTawzXNKCTzk/640?wx_fmt=png&from=appmsg "")  
  
2.   
EST  
 代币（[0xD4524B...498a91](https://bscscan.com/address/0xd4524be41cd452576ab9ff7b68a0b89af8498a91)）实现了有缺陷的销毁机制,攻击者可以通过直接向池转账   
EST  
 来销毁   
EST  
-  
WBNB  
 池中的   
EST  
。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2ibKZs4HxyqvibfNvG7DZ1KhGyWQSj532Auwn7QZpxJZZEhIw1jmAC1tYibjG1iagt9mJhKKzQllEo2xIc7ktrXxpuTs4Dwk4L7kRd2YZdX8eLk/640?wx_fmt=png&from=appmsg "")  
  
攻击者结合这两个漏洞发起三明治攻击,从   
EST  
-  
WBNB  
 池中抽取了   
WBNB  
。  
  
**攻击分析**  
  
以下分析基于交易 [0x2f1c33ea...bd1626](https://app.blocksec.com/phalcon/explorer/tx/bsc/0x2f1c33eaaaace728f6101ff527793387341021ef465a4a33f53a0037f5bd1626)。  
  
Step 1: 攻击者通过 Moolah 借入 250,000e18   
WBNB  
,并将 15e18   
WBNB  
 解包为   
BNB  
 用于攻击。  
  
Step 2: 攻击者向   
BNBDeposit  
 重复转账 0.3e18   
BNB  
 共 34 次(总计 10.2e18   
BNB  
)。每次直接转账都触发了存款逻辑。在此步骤中,攻击者获得了约 9,100e18 LP 代币(虚拟记账)和 2.65e18   
WBNB  
 奖励。  
  
Step 3: 攻击者将 400e18   
WBNB  
 兑换为约 822Me18   
EST  
,并将 BNBDeposit 设为接收者,同时虚增了   
BNBDeposit  
 的   
EST  
 余额和池中的   
EST  
 价格。  
  
Step 4: 攻击者向   
BNBDeposit  
 转账 1e18   
EST  
 以触发领取机制,基于放大的价格和余额获得了 20Me18   
EST  
。  
  
Step 5: 攻击者将 245,000e18   
WBNB  
 兑换为约 330Me18   
EST  
,并将   
BNBDeposit  
 设为接收者。  
  
Step 6: 攻击者执行了约 150 次 transfer-skim 操作,持续销毁   
EST  
-  
WBNB  
 池中的   
EST  
。  
  
Step 7: 攻击者将剩余   
EST  
 兑换为 245,560e18   
WBNB  
。  
  
Step 8: 攻击者偿还闪电贷,净赚 150   
WBNB  
。  
  
**结论**  
  
此事件由现货价格依赖和销毁机制缺陷共同导致。项目方应在部署前确保使用可靠的价格预言机,并验证代币销毁逻辑的安全性。  
  
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
   
  
