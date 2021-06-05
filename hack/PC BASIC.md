# Windows

## 目录

- 用户密码文件:  C:\Windows\System32\config\SAM

## dos

### 网络磁盘映射

- net use k: \\192.168.1.1\c$
- net use k: \\192.168.1.1\c$ /del

### 服务

- net start --查看开启了哪些服务
- net start 服务名 --开启服务, 如:net start telnet, net start schedule
- net stop 服务名 --停止某服务

### 用户操作

- net user  --查看有哪些用户
- net user 用户名  --查看账户属性
- net user 用户名 密码   --修改密码
- net user 用户名 密码 /add(/ad)  --创建用户
- net uer 用户名 /del  --删除用户
- net user guest /active:yes  --激活用户
- net localgroup "administrators" 用户名 /ad(/add)  --提升用户权限

### 共享

- net share  --查看本地开启的共享
- net share  ipc$  --开启ipc$共享
- net share  ipc$ /del  --删除ipc$共享

### 进程

- tasklist  --查看进程
- taskkill  --杀死进程

### 文件操作

- copy con a.bat  --创建文件 ctrl+z 结束编辑
- type a.bat  --命令行查看文件

### 其他

- at --计划任务
- msg 用户名 /server:目标服务器 "消息内容"

## 常见端口

- HTTP协议代理服务器: 80 8080 3128 8081 9080
- FTP(文件传输)协议代理服务器: 21
- Telnet(远程登录)协议代理服务器: 23
- TFTP(Trivial File Transfer Protocol): 69/udp
- SSH SCP 端口重定向: 22/tcp
- SMTP(Simple Mail Transfer Protocol)(E-mail): 25/tcp
  - 木马Antigen\Email Password Sender\Haebu Coceda\Shtrilitz Stealth\WinPC\WinSpy都开放这个端口
- POP3(Post Office Protocol)(E-mail): 110/tcp
- tomcat: 8080
- win2003远程登录: 3389
- oracle: 1521
- MS SQL Server: 1433/tcp 1433/udp
- qq: 1080/udp

## 计算机管理 --compmgmt.msc

### 日志: 系统工具→时间查看器→windows日志

## 注册表  --regedit

### 说明

HKEY_CLASSES_ROOT:  管理文件系统. 根据windows中安装的应用程序扩展名,该跟键指明其文件类型的名称,相应打开该文件所要调用的程序等等信息

HKEY_CURRENT_USER:  管理系统当前的用户信息. 根键保存了本地计算机中存放的当前登录的用户信息, 包括用户登录用户名和暂存的密码. 在用户登录windows 98, 其信息从HKEY_USERS中相应的项拷贝到此键

HKEY_LOCAL_MACHINE:  管理当前系统硬件配置. 根键保存了本地计算机硬件配置数据, 此根键下的子关键字包含在SYSTEM.DAT中, 用来提供此根键所需的信息, 或在远程计算机中可访问的一组键中

此根键里的许多子健与System.ini文件中设置项类似

HKEY_USERS:  管理系统的用户信息. 根键中保存了存放在本地计算机口令列表中的用户标识和密码列表. 同时每个用户的预配置信息都存储在此根键中. 

此根键是远程计算机中访问的根键之一

HKEY_CURRENT_CONFIG:  管理当前用户的系统配置. 此根键中保存着定义当前用户桌面配置(如显示器等)的数据, 该用户使用过的文档列表(MRU), 应用程序配置和其他有关当前用户的windows98中文版的安装信息

### 入侵常用

- HKEY_LOCAL_MACHINE\
  - software\hzhost\config\settings\
    - mysqlpass
    - mssqlpss
    - mastersvrpass
  - SYSTEM\LIWEIWENSOFT\
    - INSTALLFREEADMIN\11
    - INSTALLFreeHost\11



## 系统配置 --msconfig

# linux

## 黑客常用命令

- tuch /var/www/html/* --更新时间,简单隐藏踪迹











