# URL结构


|    ①    |  ②   |        ③        |    ④    |  ⑤   |       ⑥        |       ⑦       |     ⑧     |
| :-----: | :--: | :-------------: | :-----: | :--: | :------------: | :-----------: | :-------: |
| scheme: |  //  | login:password@ | address | port | /path/resource | ?query_string | #fragment |
①协议名称
②层级URL的标记符号(此项固定不变)
③访问资源需要的凭证信息(可选项)
④从哪个服务器获取数据
⑤需要连接的端口号(可选项)
⑥指向资源的层级Unix文件路径
⑦查询字符串参数(可选项)
⑧片段ID (可选项)

## ②层级URL的标记符号

```
➢http:example.com/
当没有符合要求的基础URL环境时，在Firefox、Chrome、Safari里该地址等同于
http://example.com，如果有基准URL，则会认为这是一个指向目录example.com的相对路径
➢javascript://example.com/%0Aalert(1)
在所有的常用浏览器里，会认为这个字符串是一个有效的分层级伪URL，并以JavaScript方式
来执行alert(1)这段代码
➢mailto://user@example.com
IE认为这是一个有效的指向电子邮件地址的非层级URL，“//” 部分会直接被忽视掉，其它
浏览器却不认可该写法
```

## ⑥层级Unix文件路径

```
即需要获取服务器上的文件路径，例如/document/data.txt，由于这个格式是直接从Unix目录语
义借用过来的，所以其支持在路径里出现的“/../” 及“/./”，而对非绝对路径形式的URL，也
会根据这种目录格式，加上基准路径再对应到其相对位置上去。
```





## 案例

http://example.com&test=1234@167772161/
该URL的目标地址，实际上是后面一串经过十进制编码的数据，解码过来其实就是10.0.0.1
十进制167772161转成十六进制为A000001，对应的是0A.00.00.01，即10.0.0.1
➢http://example.com\@coredump.cx/
在Firefox里，该URL 会把用户带往coredump.cx，因为example.com\会被认为是个合法的登录信息
而在其它浏览器里，“\” 会被认为是个路径分隔符，所以用户最终会访问example.com
➢http://example.com;.coredump.cx/
微软允许在主机名称里出现“;”，并成功解析到了这个地址，得coredump.cx提前做 了这样的域名解析设置
大多数其它浏览器会自动把URL纠正为http://example.com/;.coredump.cx，然后把用户带到example.com
Safari会认为该写法有语法错误

# HTTP协议

## 请求方法

HTTP / 1.1

GET  （HTTP / 0.9）
请求指定信息并返回实体
POST
多数指提交表单数据
HEAD
近似GET,仅响应头域
OPTIONS
响应服务端支持的方法
PUT
文件上传
DELETE
文件删除
TRACE
类似“ping"的请求，用于测试或诊断
CONNECT
通过HTTP代理服务器建立非HTTP类型连接

## 不确定性带来的隐患


```
➢问题1:向下兼容
HTTP/1.0规范要求HTTP/1.0客户端必须能够理解任何有效的HTTP/0.9或HTTP/1.0.格式的响应
➢问题2:换行处理
HTTP/1.1要求客户端不仅要接受CRLF和LF格式的换行符，还要接受单个的CR字符，除Firefox外的其它客户端都遵从，导致开发人员在处理HTTP头部攻击时，不仅要处理LF字符还要处理CR字符，由此造成的攻击也叫响应拆分( Response Spltting)
HTTP/1.1 200 OK [CR][LF]
Set-Cookie: last_search_term=[CR][CR]<html><body><h1>Hi![CR][LF]
[CR][LF]

对IE浏览器来说，该响应看起来类似
HTTP/1.1 200 OK
Set-Cookie: last_ search_ term=

<html><body><h1>Hi!


➢问题3:重复头域
RFC文档里建议在某些“无歧义”的场景里对某些特定的值，可采用较为宽松和对错误较为容
忍的解析方式。
●在请求中出现两个相同的http头，一半的浏览器以第一次出现的为准，另一半则以最后一次为准;在服务端，Apache则认可第一个host头的值，而IIS则完全不接受多个host头的情况
➢问题4:以分号做分隔符的头域
●在HTTP头域里，可使用分号来分割在同一行里的几对独立的“名称=值”数据组
Content-Disposition: attachment; filename=“evil_file.exe;.txt”
在微软的实现里，文件名会在有分号的地方被截断，导致文件最后被保存为evil_file.exe
●在同一个头域里，以分号分割的两个名称相同的字段
Content- Disposition: attachment; filename="name1.txt";filename="name2.txt”


```



# 响应码

- 2xx：成功
  - 200  OK，成功正常响应
  - 204  No Content,无内容
  - 206  Partial Content，部分内容，请求头range决定
- 3xx：跳转
  - 301 Moved Permanently,永久移动
  - 302 Found,找到
- 4xx：client错误
  - 400 Bad Request,不合规的请求
  - 401 Unauthorized,未授权
  - 403 Forbidden,禁止访问
  - 404 Not Found,资源找不到
- 5xx：server错误
  - 500 Internal Server Error,内部服务器错误
  - 503 Service Unavailable,服务不可用

# 认证

1. Basic（基本）认证
   - 用户名密码base64编码后以文本发至server
2. Digest（摘要）认证
   - 单次有效的加密摘要
   - 避免密码被铭文查看
   - **防止authorization头域被重用**

# 浏览器代理

请求会先经过代理 返回的请求也会先经过代理

## 工具

- brup suite pro  --licensed to LarryLau

## chrome

设置 → 最后“高级” → 代理设置

# HTTPS

HTTP + SSL