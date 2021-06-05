# 危害

- 网络钓鱼,盗取各类账号密码
  - 用户跳转登录页时,跳转到自己写的登录页, 当用户输入用户名密码后,保存到自己的数据库,然后在跳转登录到原系统主页
- 窃取用户 cookies资料-伪装成用户登录
  - firefox插件: Profile 1      TAB LOCK
- 强制弹出广告页面、刷流量:     <script>alert(1)</script>
- 进行大量的客户端攻击,如ddos攻击:    \<iframe src=http://baidu.com>
- 传播跨站蠕虫等:     \<meta http-equiv="refresh"content="o;url=http

# xss test

\<textarea>

aa</textarea> <script>alert(/xss/)</script><textarea>

\</textarea>

# Beef 工具

# XSS平台

