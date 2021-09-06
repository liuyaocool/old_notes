# 敏感信息收集

Github是一个分布式的版本控制系统,目前拥有140多万开发者用户。随着越来越多的应用程序转移到了云上, Github已经成为了管理软件开发以及发现已有代码的首选方法。众所周知,当今是大数据时代，大规模数据泄露事情一直在发生,从未停止过,但有些人不知道的是**很多时候一些敏感信息的泄露其实我们自己无意中造成的**,然而一个小疏忽,往往却造成一系列连锁反应。 Github上敏感信息的泄露,就是一个典型的例子, Github虽然方便开发者,但其中也埋藏着一些安全隐患

1. Github之邮件配置信息泄露
   1. ste:Github.com smtp
   2. site:Github.com smtp @qq.com
2. Github之数据库信息泄露
   1. site:Github.com sa password
   2. site:Github.com root password
   3. site:Github.com User ID='sa' ;Password
3. Github之sⅦn信息泄露
   1. site:Github.com svn
   2. site:Github,com svn username
4. Github之综合信息泄露:
   1. site:Github.com password
   2. site:Github.com ftp ftppassword
   3. site:Github.com 密码
   4. site:Github.com 内部

# 泄漏原理

1. 通过泄露的.git文件夹下的文件,还原重建工程源代码
2. 解析 git/index文件,找到工程中所有的:(文件名,文件sha1)
3. 去 git/objects/文件夹下下载对应的文件
4. zlib解压文件,按原始的目录结构写入源代码
5. 渗透测试人员、攻击者,可以进一步审计代码,挖掘文件上传,SQL注射等安全漏洞。

# 漏洞利用

1. 获得.git 目录：https://ip/.get

