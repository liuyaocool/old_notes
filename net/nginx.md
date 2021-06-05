# 特殊字符

```
http://www.fhdq.net/
← ↑ → ↓ ↖ ↙ ↗ ↘ ↔ ↕ ↯ ↰ ↱ ↲ ↳ ⏎
﹢﹣×÷±/=≌∽≦≧≒﹤﹥≈≡≠=≤≥<>≮≯∷∶∫∮∝∞∧∨∑∏∪∩∈∵∴⊥∥∠⌒⊙√∟⊿㏒㏑%‰⅟½⅓⅕⅙⅛⅔⅖⅚⅜¾⅗⅝⅞⅘≂≃≄≅≆≇≈≉≊≋≌≍≎≏≐≑≒≓≔≕≖≗≘≙≚≛≜≝≞≟≠≡≢≣≤≥≦≧≨≩⊰⊱⋛⋚∫∬∭∮∯∰∱∲∳%℅‰‱øØπ

解压缩命令 tar -zxvf xxx.tar.gz

```

# location

```
location / {            定位资源:本地磁盘目录 -> URL对应关系
    root html
    index index.html
    proxy_pass http(s)://baidu.com  # 代理路径
}
```

## 代理

通过快递员,快递员起代理作用

### 反向代理

    location /baidu{
        proxy_pass http(s)://baidu.com
    }
    https 返回302,再进行跳转 http直接返回html
    服务器 <==> 反向代理服务器(nginx) <==> 互联网 <==> 客户端
    代理服务器: 负载高(I/O高),需要负载均衡
        服务器 <== 反向代理服务器 <==> 互联网 <==> 客户端
          ↓                                     ↑
          ->----------->----------->------------>

### 正向代理

服务器 <==> 互联网 <==> 正向代理服务器 <==> 客户端

## IP访问控制

    location{
        deny IP/IP段; # 192.168.1.11
        allow 192.168.1.12/13;192.168.2.22/33;...
    }

## 用户认证

    # ~模式匹配
    location ~(.*)\.avi${  # ~后跟 精确地址 或 正则表达式, 此处为任意avi文件
        auth_basic "closed site";
        auth_basic_user_file users; # users文件,httpd-tools工具(yum install httpd)生成
    }

## 虚拟目录

    location /aa {
        root aa   # 加载静态资源 跟路径 只能配一个
        index index.html
    }
    location /bb {
        alias bb # 配置虚拟目录, 第二个root 用alias配
        index index.html
    }
    location /cc {
        alias cc
        index index.html
    }

## 动静分离

    location ~.*\.(js|css|png|gif|jpg){
        root /var/project/file; # root配置了可以用alias
    }

# SSL

    Host文件\网关 DNS劫持
    443端口:传证书
    
    https:
        CA 解包后再次私钥加密 劫持者不能更改客户端浏览器的ca.公钥 所以劫持者不能改
        CA与浏览器关联

# TLS

```
ca - 浏览器
charles 抓包工具
```

# 集群: 负载均衡

    upstream tomcats{ # 轮询方式 一人一下 负载到两台机器上
    
        # weight(权重 此处1:10); max_conns=800(最大连接数) max_fails fail_timeout
        server 192.168.1.11:8080 weight=1;
        server 192.168.1.12:8080 weight=10;
    
        # uri_hash-需要第三方模块或自己写
        ip_hash; # 第一次访问 客户机取一个hash值
    
        # 健康检查模块 tengine
        check interval=3000 rise=2 fail=5 timeout=1000 type=http;
        check_http_send "HEAD / HTTP/1.0\r\n\r\n";
        check_http_expect_alive http_2xx http_3xx;
    }
    location / {
        proxy_pass http://tomcats; # 协议://占位 去tomcats替换 请求中转到后台
    }
    location ~.*\.(js|css|png|gif|jpg){
        root /var/project/file; # root配置了可以用alias
    }
    location /status { # 健康检查模块 tengine
        check_status;
    }

# session共享

    memcached (yum -y install memcache)
    tomcat context.xml memcached存储session
    车祸原因:服务器时间不一致 service ntpd status

# 开机启动

    chkconfig --list
    chkconfig --add nginx
    chkconfig --nginx on

# 示例

1. A

```
# 可以配置多个server
server {
    listen 80;
    server_name taobao.com;
    location / {
        root /var/html/taobao.com;
        autoindex on;
    }
}
```

2. 

```
http{
	server {
		listen 80;
		server_name taobao.com;
		
		upstream sdgh_loadbalance {
    	    server   cloud.21tb.com;
	    }
	    location / {
	    	proxy_pass   http://sdgh_loadbalance/;
             proxy_set_header host $host;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             client_max_body_size 2000m;
         }

         location /wx/ { # 开头匹配，/wxIndex会匹配上一个规则
             proxy_pass   http://127.0.0.1:8085/wx;
             proxy_set_header host $host;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             client_max_body_size 2000m;
         }
	}
}
```