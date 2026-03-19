#  实战复现：10 个真实 SRC 逻辑漏洞  
原创 混饭吃的混子
                    混饭吃的混子  什么安全Sec   2026-03-19 03:27  
  
**[免责声明]**  
  
**请勿利用文章内的相关技术从事非法测试，由于传播、利用本公众号所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，本公众号及作者不为此承担任何责任，一旦造成后果请自行承担！**  
  
不讲长篇大论的理论。  
  
只给**你照着做就能复现**  
的干货：  
  
👉 什么功能点  
  
👉 抓包改哪个参数  
  
👉 怎么判断“中洞了”  
  
👉 **代码是怎么写错的**  
  
**建议收藏**  
，挖洞时翻出来对着看。  
## ⚠️ 阅读前必读  
  
本文所有漏洞均为**作者在众测/企业SRC亲手挖掘**  
的真实案例。  
  
🚨 **重要提醒**  
：  
  
请仅在**自己搭建的靶场**  
或**有授权的测试环境**  
中复现。  
  
未经授权测试他人系统属于违法行为。  
## 📦 漏洞 1：水平越权 — 看光所有人订单  
### 场景  
  
电商类APP/网站的“我的订单”功能  
### 复现步骤  
  
**1️⃣ 登录你的账号A**  
，进入“我的订单”页面  
  
**2️⃣ 打开抓包工具**  
（浏览器F12 → Network，或Burp Suite）  
  
**3️⃣ 找到关键接口**  
  
点击任意订单详情，找到类似请求：  
```
GET /api/order/detail?order_id=123456 HTTP/1.1
```  
  
**4️⃣ 修改订单ID**  
  
改成另一个数字：order_id=123457  
，或用Burp遍历1-1000  
  
**5️⃣ 判断是否中洞**  
  
如果返回包直接显示：  
```
{
  "name": "张三",
  "phone": "138****0000",
  "address": "北京市朝阳区xxx"
}
```  
  
**恭喜，中洞了！ 🎯 你可以遍历所有人的订单。**  
### ❌ 错误代码（PHP示例）  
```
// 直接从GET参数获取订单ID
$order_id = $_GET['order_id'];

// 只查询订单，不校验归属
$sql = "SELECT * FROM orders WHERE id = $order_id";
$result = mysqli_query($conn, $sql);
$order = mysqli_fetch_assoc($result);

// 直接返回订单数据
echo json_encode($order);
```  
  
**问题本质**  
：只校验了“用户是否登录”，**没校验“这个订单属于谁”**  
。  
## 📦 漏洞 2：水平越权 — 改掉别人的收货地址  
### 场景  
  
收货地址管理  
### 复现步骤  
  
**1️⃣ 账号A新建地址**  
，抓修改地址的包：  
```
POST /api/address/update
address_id=101&address=北京市xxx
```  
  
**2️⃣ 修改address_id**  
  
改成另一个数字：address_id=102&address=北京市xxx（已篡改）  
  
**3️⃣ 判断是否中洞**  
  
登录账号B，如果账号B的地址被改掉——**漏洞到手！**  
 🎯  
### ❌ 错误代码（Java Spring Boot示例）  
```
@PostMapping("/address/update")
public Result updateAddress(@RequestParam Long addressId, 
                           @RequestParam String address) {
    // 直接从数据库更新，不校验所有权
    String sql = "UPDATE addresses SET address = ? WHERE id = ?";
    jdbcTemplate.update(sql, address, addressId);

    return Result.success("修改成功");
}
```  
  
**问题本质**  
：只校验address_id是否存在，**没校验这个地址是谁的**  
。  
## 📦 漏洞 3：支付逻辑 — 任意改价下单  
### 场景  
  
下单、结算、提交订单  
### 复现步骤  
  
**1️⃣ 选商品加入购物车**  
（原价199元）  
  
**2️⃣ 抓提交订单的包**  
，找到：  
  
json  
```
```  
  
  
**3️⃣ 修改金额**  
：  
  
json  
```
```  
  
  
**4️⃣ 判断是否中洞**  
  
支付页面显示**只需支付1分钱**  
，支付成功且订单正常——**漏洞到手！**  
 🎯  
### ❌ 错误代码（Python Flask示例）  
```
@app.route('/api/order/create', methods=['POST'])
def create_order():
    data = request.get_json()

    # 直接信任前端传的金额
    order = Order(
        goods_id=data['goods_id'],
        price=data['price'],        # 直接从请求里取，没校验
        total_fee=data['total_fee']  # 直接从请求里取，没校验
    )

    db.session.add(order)
    db.session.commit()
    return jsonify({'code': 200})
```  
  
**问题本质**  
：**后端信任前端传的金额**  
，没有从数据库重新取原价。  
## 📦 漏洞 4：支付逻辑 — 负数购买刷钱刷库存  
### 场景  
  
购物车、购买数量  
### 复现步骤  
  
**1️⃣ 抓提交订单的包**  
，找到数量参数：  
  
json  
```
```  
  
  
**2️⃣ 改成负数**  
：  
  
json  
```
```  
  
  
**3️⃣ 判断是否中洞**  
  
可能出现：  
- ✅ 订单扣款为负 → 账户余额**增加**  
  
- ✅ 库存异常增加  
  
- ✅ 生成异常订单  
  
**任何一种都算洞！**  
 🎯  
### ❌ 错误代码（PHP示例）  
```
$quantity = $_POST['quantity'];
$price = $_POST['price'];

// 直接入库，没校验正负
$total = $price * $quantity;

// 如果quantity是负数，stock反而增加
$sql = "UPDATE inventory SET stock = stock - $quantity WHERE goods_id = 1";
mysqli_query($conn, $sql);
```  
  
**问题本质**  
：**未校验数量必须为正数**  
，直接把负数传到数据库。  
## 📦 漏洞 5：验证码漏洞 — 不绑定用户，越权改密  
### 场景  
  
忘记密码、修改手机号  
### 复现步骤  
  
**1️⃣ 用自己的手机号获取验证码**  
：13800138000 → 1234  
  
**2️⃣ 抓提交验证码的包**  
：  
  
text  
```
```  
  
  
**3️⃣ 把手机号改成目标**  
：  
  
text  
```
```  
  
  
**4️⃣ 判断是否中洞**  
  
如果返回“验证成功”或进入下一步——**你可以重置任意账号密码！**  
 🎯  
### ❌ 错误代码（Node.js示例）  
```
app.post('/api/check_code', (req, res) => {
  const { phone, code } = req.body;

  // 只查验证码对不对，没查发给谁的
  const sql = 'SELECT * FROM verify_codes WHERE code = ? AND expire_time > NOW()';
  db.query(sql, [code], (err, result) => {
    if (result.length > 0) {
      res.json({ code: 200, msg: '验证成功' }); // ❸ 直接通过
    } else {
      res.json({ code: 400, msg: '验证码错误' });
    }
  });
});
```  
  
**问题本质**  
：**验证码只校验“对不对”，没校验“发给谁的”**  
。  
## 📦 漏洞 6：验证码漏洞 — 可复用、不失效  
### 场景  
  
登录、注册、短信验证  
### 复现步骤  
  
**1️⃣ 获取一次验证码**  
：1234  
  
**2️⃣ 第一次提交**  
：成功  
  
**3️⃣ 等几分钟，用同一个验证码再次提交**  
：还是成功  
  
**4️⃣ 反复提交10次**  
：依然能通过  
### ❌ 错误代码（Python示例）  
```
def verify_code(phone, code):
    # 查询是否有这个验证码
    sql = "SELECT * FROM verify_codes WHERE phone = ? AND code = ?"
    result = db.execute(sql, [phone, code]).fetchone()

    if result:
        return True  # 验证码存在就通过，用完不删
    return False
```  
  
**问题本质**  
：**验证码使用后没有销毁**  
，也没有设置过期时间。  
## 📦 漏洞 7：密码找回 — 跳过步骤直接重置  
### 场景  
  
忘记密码流程（正常：验证账号 → 验证短信 → 重置密码）  
### 复现步骤  
  
**1️⃣ 抓最后一步“提交新密码”的包**  
：  
  
text  
```
```  
  
  
**2️⃣ 直接访问这个接口**  
，不需要带上一步的验证码  
  
**3️⃣ 判断是否中洞**  
  
直接用别人的用户名发包，如果密码修改成功——**高危漏洞！**  
 🎯  
### ❌ 错误代码（Java示例）  
```
@PostMapping("/reset_pwd")
public Result resetPassword(@RequestParam String username,
                           @RequestParam String newPwd) {
    // 直接更新密码，没有任何校验
    String sql = "UPDATE users SET password = MD5(?) WHERE username = ?";
    jdbcTemplate.update(sql, newPwd, username);

    return Result.success("密码修改成功");
}
```  
  
**问题本质**  
：**后端不校验步骤**  
，谁都能调用最终的重置接口。  
## 📦 漏洞 8：条件竞争 — 一次领取多次到账  
### 场景  
  
签到、领券、领取积分  
### 复现步骤  
  
**1️⃣ 找到领取接口**  
：  
  
text  
```
```  
  
  
**2️⃣ 用Burp快速连发10-20个包**  
（Ctrl+Enter）  
  
**3️⃣ 判断是否中洞**  
  
本来只能领1张券，连发后收到5张、10张——**漏洞到手！**  
 🎯  
### ❌ 错误代码（PHP示例）  
```
// 领取优惠券
function receive_coupon($user_id, $coupon_id) {
    // 查询是否已领取
    $check = "SELECT * FROM user_coupons WHERE user_id = $user_id AND coupon_id = $coupon_id";
    $result = mysqli_query($conn, $check);

    if (mysqli_num_rows($result) == 0) {
        // 没领过 → 发放
        $sql = "INSERT INTO user_coupons (user_id, coupon_id) VALUES ($user_id, $coupon_id)";
        mysqli_query($conn, $sql);
        return "领取成功";
    }
    return "已领取过";
}
```  
  
**问题本质**  
：**没加锁、没做幂等**  
，并发请求同时通过校验。  
## 📦 漏洞 9：注册逻辑 — 账号覆盖登录  
### 场景  
  
手机号注册  
### 复现步骤  
  
**1️⃣ 找一个已注册的手机号**  
：13900001111  
  
**2️⃣ 用这个手机号重新注册**  
，走完整个流程  
  
**3️⃣ 判断是否中洞**  
  
注册成功后，用新密码登录——如果登录进了**原账号**  
，恭喜！🎯  
### ❌ 错误代码（PHP示例）  
```
// 用户注册
$phone = $_POST['phone'];
$password = md5($_POST['password']);

// 直接插入，没判断手机号是否已存在
$sql = "INSERT INTO users (phone, password) VALUES ('$phone', '$password')";
mysqli_query($conn, $sql);

// 直接登录
$_SESSION['user_id'] = mysqli_insert_id($conn);
```  
  
**问题本质**  
：**注册时不判断手机号是否已存在**  
，直接覆盖入库。  
## 📦 漏洞 10：垂直越权 — 普通用户进后台  
### 场景  
  
管理员后台  
### 复现步骤  
  
**1️⃣ 用普通用户账号登录**  
  
**2️⃣ 找到后台接口**  
（从JS文件翻或猜路径）：  
  
text  
```
```  
  
  
**3️⃣ 直接访问**  
  
**4️⃣ 判断是否中洞**  
  
如果返回所有用户列表、或成功删除数据——**经典越权漏洞！**  
 🎯  
### ❌ 错误代码（Java示例）  
```
@GetMapping("/api/admin/user/list")
public Result listAllUsers() {
    // 只查询所有用户，没校验权限
    String sql = "SELECT * FROM users";
    List<User> users = jdbcTemplate.query(sql, new BeanPropertyRowMapper(User.class));

    return Result.success(users);
}
```  
  
**问题本质**  
：**后台接口没做角色判断**  
，只校验了“是否登录”，没校验“是不是管理员”。  
## 只要你照着上面的步骤：  
- 找一个你测试过的系统  
  
- 找到对应的功能点  
  
- 抓包、改参数、观察返回  
  
**大概率能挖到至少1-2个同类漏洞。**  
  
  
  
  
