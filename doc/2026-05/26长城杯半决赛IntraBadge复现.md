#  26长城杯半决赛IntraBadge复现  
原创 浪漫土狗
                    浪漫土狗  正在思考ing   2026-05-07 07:29  
  
### 参考链接  
  
https://mei-debug.github.io/2026/03/24/2026CISCN-CCB%E5%8D%8A%E5%86%B3%E8%B5%9B/  
  
  
### 攻击思路  
  
  
  
 通过上传头像url读取存在redis中的flag->利用/avatar/refresh路由解析flag值->写入自定义模板利用可以读取信息的函数->利用沙箱二次渲染执行自定义模板回显flag->访问preview路由读取flag  
### 代码审计  
  
题目描述：某企业开发了一套用于内部员工展示的“徽章卡片系统”，员工可自定义展示模板并填写头像 URL，由系统自动抓取并缓存头像资源后进行页面渲染。在开发阶段，为了便于调试与快速上线，部分模板渲染与资源抓取功能未进行严格安全限制。  
  
题目并没有想象中那么难，关键还是要看懂代码逻辑，把每个路由的作用审清楚。  
```
@app.get("/prefs")def prefs():    u = safe_key(request.args.get("u", "guest"))    resp = make_response(redirect(url_for("dashboard")))    resp.set_cookie("user", u, max_age=86400, path="/")    return resp
```  
  
该路由的主要作用是设置用户cookie，然后跳转到dashboard路  
```
@app.get("/dashboard")def dashboard():    user = _get_user()#从用户cookie中获取用户名    tpl = _get_tpl(user)#通过用户名在redis中获取模板    avatar_url = _get_avatar_url(user)#在redis中获取头像url    avatar_data, avatar_ctype, avatar_updated = _get_avatar_blob(user)#获取头像二进制数据及原信息(二进制数据、MIME 类型、更新时间字符串)    avatar_ok = avatar_ctype.startswith("image/") and len(avatar_data) > 0    return render_template(        "dashboard.html",        user=user,        tpl=tpl,        avatar_url=avatar_url,        avatar_ok=avatar_ok,        avatar_ctype=avatar_ctype or"-",        avatar_size=len(avatar_data),        avatar_updated=avatar_updated or"-",    )#对dashboard.html进行渲染
```  
  
下面是获取自定义模板的代码，我们可以点击主页上的Edit Template按钮跳转至template路由修改自定义的模板  
```
def _get_tpl(user):    k = f"tpl:{user}"    if not rdb.exists(k):        rdb.set(            k,            """<div class="badge">  <div class="badge-left">    <div class="avatar">      {% if avatar_ok %}        <img src="/avatar/file" alt="avatar"/>      {% else %}        <div class="avatar-ph">No Avatar</div>      {% endif %}    </div>  </div>  <div class="badge-right">    <div class="title">{{ name }}</div>    <div class="sub">IntraBadge · Internal</div>    <div class="meta">Last refresh: {{ avatar_updated or "never" }}</div>  </div></div>""",        )    return (rdb.get(k) or b"").decode("utf-8", "ignore")
```  
  
审计dashboard路由，可以看到，虽然tpl是我们可以自定义进行操作，但是因为这里没有二次渲染，也不好进行ssti，接着往下审计  
```
@app.post("/avatar")def avatar_set():    user = _get_user()    url = (request.form.get("avatar_url", "") or "").strip()    rdb.set(f"avatar_url:{user}", url[:2000])#这里仅仅是保存头像url    return redirect(url_for("dashboard"))
```  
  
设置头像 URL，然后存储在redis数据库中，接着再跳转到dashboard路由  
```
@app.post("/avatar/refresh")def avatar_refresh():    user = _get_user()    url = _get_avatar_url(user)    ifnot url:        return redirect(url_for("dashboard"))        try:        data, ctype, meta = fetch_resource(url)    except Exception:        rdb.set(f"avatarbin:{user}", b"")        rdb.set(f"avatarctype:{user}", "application/octet-stream")        rdb.set(f"avatarupd:{user}", "fetch failed")        return redirect(url_for("dashboard"))    rdb.set(f"avatarbin:{user}", data[:MAX_AVATAR])    rdb.set(f"avatarctype:{user}", ctype[:120])    rdb.set(f"avatarupd:{user}", "just now")    rdb.set(f"avatarmeta:{user}", str(meta)[:500])    return redirect(url_for("dashboard"))
```  
  
可以看到这段代码是在解析头像url，并且会调用fetch_resource函数，函数逻辑如下。分析可知，该函数主要作用是获取头像url的信息，支持http协议和redis请求  
```
def fetch_resource(url: str, timeout: float = 2.0):    u = urlparse((url or"").strip())    scheme = (u.scheme or"").lower()    if scheme in ("http", "https"):        resp = requests.get(url, timeout=timeout, allow_redirects=True)        ctype = resp.headers.get("Content-Type", "application/octet-stream")        data = (resp.content orb"")[:200000]        return data, ctype, {"scheme": scheme, "status": resp.status_code}    if scheme == "redis":        host = u.hostname or"127.0.0.1"        port = u.port or6379        path = (u.path or"/").lstrip("/")        parts = path.split("/", 1)        db = int(parts[0]) if parts and parts[0].isdigit() else0        key = parts[1] if len(parts) > 1else""        r = redis.Redis(host=host, port=port, db=db, socket_timeout=1)        val = r.get(key) orb""        return val[:200000], "application/octet-stream", {"scheme": "redis", "db": db, "key": key}    raise ValueError("unsupported scheme")
```  
  
当我们使用redis://127.0.0.1:6379/0/flag  
时，被解析的时候就会通过127.0.0.1:6379连接redis的0号数据库然后读取flag的键值，这里选0号数据库是因为代码里面有。  
```
def get_redis():    return redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, socket_timeout=1)
```  
  
综上，当我们访问/avatar/refresh路由时，就会解析我们指定的头像的url，如果flag存放在redis数据库中，就可以利用这个路由解析到flag的键值。但是现在有一个问题，就是如何才能回显出flag？我们继续往下审计  
```
@app.get("/preview")def preview():    user = _get_user()    tpl = _get_tpl(user)    avatar_url = _get_avatar_url(user)    avatar_data, avatar_ctype, avatar_updated = _get_avatar_blob(user)    avatar_ok = (avatar_ctype or"").startswith("image/") and len(avatar_data) > 0    def avatar_raw_text():        try:            return (avatar_data[:2000]).decode("utf-8", "ignore")#尝试将头像二进制数据以 UTF-8 文本形式返回        except Exception:            return""    def avatar_raw_b64():        return base64.b64encode(avatar_data[:5000]).decode("ascii", "ignore")#将头像二进制数据以 Base64 编码返回    try:        rendered = render_user_template(            tpl,            name=user,            avatar_url=avatar_url,            avatar_ok=avatar_ok,            avatar_ctype=avatar_ctype or"",            avatar_updated=avatar_updated or"",            avatar_size=len(avatar_data),            avatar_raw_text=avatar_raw_text,            avatar_raw_b64=avatar_raw_b64,        )    except TemplateError as e:        rendered = (            f"<div class='alert alert-danger'>Template error: {type(e).__name__}</div>"        )    return render_template(        "preview.html",        user=user,        rendered=rendered,        tpl=tpl,        avatar_url=avatar_url,        avatar_ctype=avatar_ctype or"-",        avatar_size=len(avatar_data),        avatar_updated=avatar_updated or"-",    )
```  
  
preview路由中的第一次渲染是通过render_user_template函数实现的，跟进查看会发现调用了沙箱，并且将tpl参数值，也就是将我们可以控制的值作为能够安全执行的模板。审计preview路由相关的代码看到两个可以获取到图片内容的函数，avatar_raw_text和avatar_raw_b64，可以任选其一完成回显flag的目标  
```
_user_tpl_env = SandboxedEnvironment(    autoescape=True,  )def render_user_template(tpl: str, **context) -> str:    template = _user_tpl_env.from_string(tpl or "")    return template.render(**context)
```  
  
  
### 过程复现  
  
  
  
我这里是先通过prefs路由设置了一个用户的cookie，传参u=qwe  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/g673ce4c7rnwKL1jXYOK3MDMf2r6FGcFfpgicibsoBtN1B4CeiaiaBpjHVaXe2QUPJLmRMebDRJVUObDdgzHKv52BNibgWM1leQgbf5ic31rexIv0/640?wx_fmt=png&from=appmsg "")  
  
然后在上传头像url的位置传入redis请求读取flag，先后点击图中标注的按钮，解析flag的值  
  
![](https://mmbiz.qpic.cn/mmbiz_png/g673ce4c7rks1ibiadkianrquSHFp5zsgIgyKicVnBGaAZcAqA0x5icMhicjmyBF6XROJyE7cBhwuUeIsR5jGV0CzOHqDQkYauSBniaoKKodjTc16s/640?wx_fmt=png&from=appmsg "")  
  
接着再修改自定义模板，执行源码中的缺陷函数，让我们在访问preview路由时能回显flag值  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/g673ce4c7rkHbgppPZmvcZZyU26XeJzPcpCjowFhzL2XwSIJWKWuRDpsJS1pPeXZTF2U4JnPGzUHePEldmX4b2fmbF2vjfibVpVicK9Qtquks/640?wx_fmt=png&from=appmsg "")  
  
  
