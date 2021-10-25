# 内核

## 版本号

- XX.YY.ZZ --版本 如 2.5.7
  - XX: 主版本号
  - YY: 奇数表示开发板,偶数表示稳定版
  - ZZ: 升级次数

## man

- yum install man man-pages
- man ls
- man 2 read
- man 2 socket

## I/O

### BIO

- 同步阻塞
- socket在这个时期是blocking
- 开多线程 线程切换是有成本的

<img src="linux\BIO.png" align="left">

### NIO

- 同步非阻塞
- socket fd nonblock
- 同步非阻塞  NIO
- 如果有1000fd，代表用户进程轮询调用1000次kernel
- 问题：成本问题

<img src="linux\NIO.png" align="left">

### selector

- man 2 select
- 多路复用 NIO
- 问题：
  1. 用户态 内核态 切换
  2. fd相关数据考来考去

<img src="linux\SELECTOR.png" align="left">

### epoll

- man epoll
- eventpoll
- 多路复用 NIO
- man 2 mmap
  - 共享空间
  - 内核空间 映射 用户空间

<img src="linux\EPOLL.png" align="left">

## 零拷贝

- man 2 sendfile

<img src="linux\0COPY.png" align="left">

# 公钥私钥免密登录

## linux

- 1 客户机执行命令 ssh-keygen -t rsa -P "",  一路回车
  - 会在 ~/.ssh 中生成一对密钥
- 2 客户机执行命令ssh-copy-id 用户名@ip, 输入密码
- 3 ssh免密登录即可

#  常见发行版本

- 红帽体系 RedHat  --学linux常用
  - RHEL-RedHat Enterprise (所谓的RedHat Advance Server, 收费)
  - Fedora Core (由原来RedHat桌面版本发展而来, 免费)
  - CentOS (试验场, REHL(第一条)的社区克隆版本, 一些新的 不稳定的程序都在里边, 免费)
- Debian Linux (唯一 非商业组织维护 功能强大)
- Ubuntu (基于Debian的unstable版本加强而来) 
  - 常用与日常办公 图形化强大
  - 安装使用免费 维护服务收费
  - kai
  - deepin  --国产
  - 麒麟  --国产
- SuSe Linux (Novell公司产品, 欧洲常用)

# 语言包

yum makcache 出现 Failed to set locale, defaulting to C.UTF-8 错误

- locale -a    --查看安装的语言

  ​	locale: Cannot set LC_CTYPE to default locale: No such file or directory
  ​	locale: Cannot set LC_MESSAGES to default locale: No such file or directory
  ​	locale: Cannot set LC_ALL to default locale: No such file or directory

  ​	。。。

  ​	可知没有安装en_US.UTF-8语言

- 语言包安装

  - dnf install glibc-langpack-en -y
  - 或 dnf install langpacks-en glibc-all-langpacks -y
  - 再查看可知语言安装成功

- 若已安装但还报错

  - echo "export LC_ALL=en_US.UTF-8"  >>  /etc/profile 
  - echo "export LC_CTYPE=en_US.UTF-8"  >>  /etc/profile 
  - source /etc/profile

- 安装中文语言包

  - yum install glibc-langpack-zh

# 安装

## 分区

- swap 内存交换分区 现在电脑内存足够 不需要了
- /home ：尽量设置大一点 保证系统崩溃后不丢数据
- / ：剩余分区

## ubuntu示例

ubuntu 20.04 LTS(长期支持) 60GB

1. 欢迎页，选英文，install Ubuntu
2. 键盘布局，选默认（US）
3. 更新和其他软件，只选 Minimal installation
4. 安装类型，选Erase disk and install Ubuntu，install now，continue
5. 您在什么地方，Shanghai
6. 您是谁，填写用户信息，继续
7. 安装完成，修改root 密码 ：sudo passwd root
8. 关机，取消CD/DVD挂载
9. 开机，安装 VMware Tools
   1. cd/dvd 改为使用物理驱动器
   2. 打开系统 解压光盘 ***.tar.gz 到系统
   3. root权限执行 ./VMWare***.pl
   4. ok

- 参考分区
  - /dev/sda1 efi                                 512MB
  - /dev/sda1 biosgrub                       512MB
  - /dev/sda1 ext4            /home        40960MB
  - /dev/sda1 ext4            /                 22439MB

# yum

包管理器

## 基本操作

- 查找软件包：yum search php
- 卸载yum包装：yum remove PACKAGE_NAME
- 列出所有可安装的软件包：yum list php
- 列出所有可更新的软件包：yum list updates 
- 列出所有已安装的软件包：yum list installed
- 列出所有已安装但不在 Yum Repository 内的软件包：yum list extras 
- 列出所指定的软件包：yum list +包名
- 使用YUM获取软件包信息、显示yum包的信息：yum info PACKAGE_NAME
- 搜索yum包：yum search PACKAGE_NAME
- 列出所有可更新的软件包信息：yum info updates 
- 列出所有已安装的软件包信息：yum info installed 
- 列出所有已安装但不在 Yum Repository 内的软件包信息：yum info extras
- 列出软件包提供哪些文件：yum provides
- 更新具体的yum包：yum update PACKAGE_NAME
- 显示已启用的yum存储库的列表：yum repolist
- 清除yum缓存：yum clean all
- 找出哪个yum包提供了一个特定的文件（例如：/usr/bin/nc)）：yum whatprovides "*bin/nc"
- 取出yum包装：yum downloader PACKAGE_NAME
- 重新安装一个yum包：yum reinstall PACKAGE_NAME

# apt



## 报错

yum install 报错 failed to download metadata for repo 'AppStream'

## CentOS ??

- 1 配置阿里镜像：https://developer.aliyun.com/mirror/
- 2 cd /etc/yum.repos.d
  - 此路径包含很多镜像 
  - 如果用到哪一个，可以vi *.repo，把baseurl放开
- 3 *.repo 说明
  - name=CentOS Stream $releasever - Extras
    mirrorlist=http://mirrorlist.centos.org/?release=$stream&arch=$basearch&repo=extras&infra=$infra
    baseurl=http://mirror.centos.org/$contentdir/$stream/extras/$basearch/os/
    gpgcheck=1
    enabled=1
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
- 如何使用tuna的epel镜像
  - 启用Extras源， 见2
  -  Extras源（[tuna](https://mirrors.tuna.tsinghua.edu.cn/help/centos)也有镜像）里安装epel-release：yum install epel-release
  - 其他方式见 https://mirrors.tuna.tsinghua.edu.cn/help/epel/

## epel源

- yum install epel-release -y
- 或配置阿里云epel源

## KDE

### Centos8

Centos7 上的安装方法不适用于此版本

- 安装epel源: 
- 更新: yum update -y , 需等待更新完成
- dnf config-manager --enable PowerTools
  - 失败则执行: dnf config-manager --set-enabled powertools
- dnf group install kde-desktop kde-media kde-apps -y
- 启动
  - startkde
    - 报错 $DISPLAY is not set or cannot connect to the X server
    - 输入命令: xinit /usr/bin/startkde --display :1 -- /usr/bin/Xorg :1
  - 开机默认启动
    - 重启
    - 点击"齿轮"图标
    - 点击"plasma"
    - 输入密码后回车

### Centos7

- yum install kdepim
- yum groupinstall "X Window System"
- yum groupinstall "KDE (K Desktop Environment)"
- or  ??
  - yum install -y kdebase-workspace kdebase kdeadmin kdenetwork kdeutils kde-l10n-Chinese kde-i18n-Chinese wqy-zenhei-fonts cjkuni-uming-fonts cjkuni-ukai-fonts
- 连接: xinit /usr/bin/startkde --display :1 -- /usr/bin/Xorg :1
- 卸载:
  - yum groupremove "KDE (K Desktop Environment)"
  - yum groupremove "X Window System"
  - um remove kdepim

# 远程桌面

网不好会不好用

https://www.laozuo.org/2912.html

## 安装

- 安装桌面系统  如KDE GNOME

- 安转vnc

  - yum -y install vnc vnc-server
  - 或 yum install -y tigervnc-server tigervnc

- 启动vnc

  - vncserver  →  设置vnc密码
  - vncserver :1   --??

- 停止vnc

  - vncserver -kill :1

- 查看vnc 相关

  -  ls /root/.vnc/

- 组织vnc进程

  - pkill -9 vnc
  - rm -rf /tmp/.X1*

- 配置文件 

  - /root/.vnc/xstartup

  - ```sh
    #!/bin/sh
    unset SESSION_MANAGER
    exec /etc/X11/xinit/xinitrc
    [ -x /etc/vnc/xstartup ] && exec/etc/vnc/xstartup
    [ -r $HOME/.Xresources ] && xrdb$HOME/.Xresources
    xsetroot -solid grey
    vncconfig -iconic &
    xterm -geometry 80x24+10+10 -ls -title "$VNCDESKTOP Desktop"&
    startkde & #kde desktop
    ```

  - vnc分辨率 /etc/sysconfig/vncservers

    - VNCSERVERS="1:root"
    - VNCSERVERARGS[1]="-geometry 1024x768"

- 设置权限 开机启动

  - chmod +x /root/.vnc/xstartup
  - service vncserver restart
  - chkconfig vncserver on

- 安装firefox

  - yum -y instal  firefox x11-xorg

## 连接

- 下载vnc viewer 客户端
- 本机执行命令 建立通道, 使用ssh通道加密
  - ssh -p 27085 root@144.34.187.149 -L 5901:127.0.0.1:5901
- vnc viewer 连接
  - 连接ip: 127.0.0.1:5901 不建立通道 连接144.34.187.149:1
  - 密码: vnc密码

# dnf

新一代 rpm软件包管理器, yum的升级替代品, 使用rpm libsolv hawkey库进行包管理操作, 克服了yum的一些瓶颈, 提升了用户体验 内存占用 依赖分析 运行速度等. 

它能自动完成更多的操作。因为高度自动化, 不受技术高者欢迎

1. 在 DNF 中没有 –skip-broken 命令，并且没有替代命令供选择。
2. 在 DNF 中没有判断哪个包提供了指定依赖的 resolvedep 命令。
3. 在 DNF 中没有用来列出某个软件依赖包的 deplist 命令。
4. 当你在 DNF 中排除了某个软件库，那么该操作将会影响到你之后所有的操作，不像在 YUM 下那样，你的排除操作只会咋升级和安装软件时才起作用

## 安装

- 安装epel源: yum install epel-release -y
- yum install dnf
- dnf config-manager --set-enabled powertools

## 使用

- dnf –version    --查看dnf版本
- dnf repolist    --查看系统中可用的 DNF 软件库
- dnf repolist all    --显示系统中可用和不可用的所有的 DNF 软件库
- dnf list    --列出 软件库的可用软件包 已经安装在系统上的软件包
- dnf list installed    --列出所有安装了的 RPM 包
- dnf list available    --列出所有可供安装的 RPM 包
- dnf search nano    --搜索软件库中的 RPM 包
- dnf provides /bin/bash    --查找某一文件的提供者
- dnf info nano    --查看软件包详情
- dnf install nano    --安装软件包
- dnf update systemd    --升级软件包
- dnf check-update    --检查系统软件包的更新
- dnf update 或 # dnf upgrade    --升级所有系统软件包
- dnf remove nano 或 # dnf erase nano    --删除软件包
- dnf autoremove    --删除无用孤立的软件包
  - 用处：当没有软件再依赖它们时，某一些用于解决特定软件依赖的软件包将会变得没有存在的意义，该命令就是用来自动移除这些没用的孤立软件包。
- dnf clean all    --删除缓存的无用软件包
  - 用处：在使用 DNF 的过程中，会因为各种原因在系统中残留各种过时的文件和未完成的编译工程。我们可以使用该命令来删除这些没用的垃圾文件。
- dnf help clean    --获取有关某条命令的使用帮助
- dnf help    --查看所有的 DNF 命令及其用途
- dnf history    --查看 DNF 命令的执行历史
- dnf grouplist    --查看所有的软件包组
- dnf groupinstall ‘xxx’    --安装一个软件包组
- dnf groupupdate ‘xxx’    --升级一个软件包组中的软件包
- dnf groupremove ‘xxx’    --删除一个软件包组
- dnf –enablerepo=epel install xxx    --从特定的软件包库安装特定的软件
  - 本例在epel中安装
- dnf distro-sync    --更新软件包到最新的稳定发行版
- dnf reinstall xxx    --重新安装特定软件包
- dnf downgrade xxx    --回滚某个特定软件的版本

# 网络

- ss -lna
- netstat -natp
  - tp tcp

## 无线

- wireless
- 802.11

## 有线

- GbE

## 主机名

- 修改主机名
  - vi  /etc/sysconfig/network
    - NETWORKING=yes
    - HOSTNAME=lynode01.com
  - vi /etc/hosts
    - 127.0.0.1   localhost   localhost.localdomain   localhost4 localhost4.localdomain4
    - 127.0.0.1   node01      lynode01.com            localhost4 localhost4.localdomain4
  - vi /etc/hostname --centos7之后只需修改这里
    - lynode01.com

## 修改网络连接方式

```
vim /etc/sysconfig/network-scripts/ifcfg-*
ONBOOT=yes // 网卡是否启用
BOOTPROTO=dhcp // 动态 static-静态
#IPADDR=192.168.1.160
#NETMASK=255.255.255.0
#GATEWAY=192.168.1.1
#DNS1=114.114.114.114
#DNS2=8.8.8.8
#PREFIX=24

重新获得ip:
dhclient
ifdown ens33
ifup ens33
无效 ifconfig ens33 down \ ifconfig ens33 up

重启网卡
1: nmcli c reload
2: 三选一
	nmcli c up ens33
	nmcli d reapply ens33
	nmcli d connect ens33
```



# 防火墙

## centos 7.0+

- firewall-cmd --zone=public --list-ports --查看开放的端口列表           
- firewall-cmd --query-port=3306/tcp --查看防火墙某个端口是否开放           
- firewall-cmd --zone=public --add-port=3306/tcp --permanent --开放端口            
- firewall-cmd --zone=public --add-port=40000-45000/tcp --permanent --开放一段端口           
- firewall-cmd --reload --重启防火墙          
- systemctl start/stop/status firewalld --防火墙操作

## 开放端口 iptables

- redhat
  - iptables -L -n --查看开放端口
  - iptables --list-rules           
  - iptables -A IN_public_allow -p tcp -m tcp --dport 10001 -m conntrack --ctstate NEW -j ACCEPT
- centos7+ 见防火墙

# 四大组成

( 程序或服务... 	(系统调用接口...	(内核...	(硬件...))))

- 内核
  - 
- shell
  - shell 提供用户与内核交互的接口
- 文件系统
  - **文件在存储设备上(如磁盘)的组织方式**
  - 支持多种异构文件系统, 如ext2 ext3 fat vfat(fat32) ISO9660 nft ...
    - 上下排列 左右排列
  - 格式化 就是把格式转了一遍, 让看不懂原来的排序
- 应用系统

# shell

可直接调用内核

## 查看支持shell

- cat /etc/shells  --解析器 解析哪些shell
- echo $SHELL  --查看当前正使用

## 与终端的区别

终端输入 → shell → 调用内核

## 释伴#!

SheBang  脚本解释器

https://blog.csdn.net/u012294618/article/details/78427864

1. 允许脚本和数据文件充当系统命令

2. #!/usr/bin/env 解释器 --多平台通用

3. 用法

   - 脚本文件没有#!这一行，执行时会默认采用当前Shell去解释这个脚本(即：$SHELL环境变量）。

   - #!之后的解释程序是一个可执行文件，执行这个脚本时，它会把文件名及其参数一起作为参数传给那个解释程序去执行。

   - 若#!指定的解释程序没有可执行权限，则会报错“bad interpreter: Permissiondenied”。

   - 若#!指定的解释程序不是一个可执行文件，那么指定的解释程序会被忽略，转而交给当前的SHELL去执行这个脚本。

   - 若#!指定的解释程序不存在，那么会报错“bad interpreter: No such file or directory”。

   - 注意：#!之后的解释程序需写**绝对路径**（如：#!/bin/bash），它是不会自动到$PATH中寻找解释器的。

   - 显式指定bash（如：bash test.sh），#!这一行将会被忽略掉

4. 总结

   - #! 必须连接在一起
   - #! 一句必须在文件的最开始，第一行
   - #! 开头的一行会设置解释器运行环境
   - #! 对文件的内容没有影响，#开头会被当成注释

## 重定向 >  >>  >&  <&  <  <<

https://www.runoob.com/linux/linux-shell-io-redirections.html 

```
文件描述符
    0 标准输入(stdin)
    1 标准输出(stdout)
    2 标准错误(stderr)

    1>/dev/null --标准输出指向空，即控制台无内容
    2>/dev/null --标准错误指向空

echo "123" >> 文件名 --文件内容追加一行数据
echo "123" > 文件名 --文件内容替换为数据

>& ： >代表重定向 &代表指向文件描述符,不指向文件

socket连接示例
    cd /proc/$$/fd
        $$: 当前解释程序进程id号
        fd: 文件描述符
    exec 8<> /dev/tcp/www.baidu.com/80 --建立socket连接
        <>: I/O 数入/输出
        8<>: 8指向socket(套接字通信,内核中转换为套接字)
    echo -e 'get / http/1.0\n' >& 8 --http协议输送到百度
        >: 重定向输出
        &: 代表8是文件描述符,不是文件
        -e: \n 转化为换行符
        ''之间: 最简单http协议
    cat 0<& 8 --读取返回结果
        标准输入0 来自文件描述符8
        cat: 读文件,从标准输入读东西
    exec 8<& - --关掉
```

## 语法

### shell参数

例如： start.sh app1 start

- ${0} = start.sh
- ${1} = app1
- ${2} = start
- 。。。

### 判断 if

```sh
# 格式
if [[ -f trials ]]; then 
	# 命令
fi
if [[ ! -f trials ]]; then 
	# 命令
fi

# 条件
-a file exists.
-b file exists and is a block special file.
-c file exists and is a character special file.
-d file exists and is a directory.
-e file exists (just the same as -a).
-f file exists and is a regular file.
-g file exists and has its setgid(2) bit set.
-G file exists and has the same group ID as this process.
-k file exists and has its sticky bit set.
-L file exists and is a symbolic link.
-n string length is not zero.
-o Named option is set on.
-O file exists and is owned by the user ID of this process.
-p file exists and is a first in, first out (FIFO) special file or named pipe.
-r file exists and is readable by the current process.
-s file exists and has a size greater than zero.
-S file exists and is a socket.
-t file descriptor number fildes is open and associated with a terminal device.
-u file exists and has its setuid(2) bit set.
-w file exists and is writable by the current process.
-x file exists and is executable by the current process.
-z string length is zero.
```



# 常用软件

- make：yum -y install gcc automake autoconf libtool make
- gcc： yun install gcc
- wget：yum install wget    --可下载网络资源

# 定时任务

1. 命令：crontab --help
2. 规则保存位置：/var/spool/cron/用户名对应文件
3. 添加规则： echo "*/1 * * * * command" >> /var/spool/cron/root # id
4. 删除规则：
   1. 
5. 清空规则：crontab -r
6. 不推荐：crontab ./scheduler.crontab，删除原来的 使用crontab文件中的规则

# 常用操作

## 安装.rpm软件



## 文件操作

    ./ 当前路径
    / 根路径
    ../ 上级路径
    
    echo `dirname $0`
        /Users/liuyao/Desktop/PROJECT/BrowserInWeb --mac
        ./ --linux
    echo $(cd `dirname $0`;pwd)
        /Users/liuyao/Desktop/PROJECT/BrowserInWeb --mac/linux
    mac中双击shell可执行程序
        pwd = /Users/liuyao
    
    单文件
        上传: scp local_file linux_user@ip:linux_folder（/filename）
        下载: scp linux_user@linux_ip:linux_file local_folder
    多文件
        上传: scp local_file1 local_file2 ... linux_user@ip:linux_folder
    文件夹
        上传: scp -v -r local_folder linux_user@ip:linux_folder
        上传到相同目录下: scp -r ./folder/ root@ip:`pwd` // tab按键与esc按键之间那个
        下载: scp -r linux_user@linux_ip:linux_folder local_folder
    
    tar解压: tar xf ***.tar.gz

## 配置环境变量

- vi /etc/profile
- 末尾追加
  - export REDIS_HOME=/opt/soft/redis6
  - export PATH=$PATH:$REDIS_HOME/bin
- source /etc/profile    --使配置生效
- echo $PATH    --查看path

## 编译 安装

- 编译：make all  （ 一般源码根目录下执行）
- 安装：make install prefix=/opt/xxx  （源码根路径下执行）

## 压缩

- 解压：tar -xf xxx.tar
  - x    --提取
  - f    --使用文档
  - v    --打印解压列表
  - -C /folder    --解压到指定目录
- 解压：tar -xf xxx.tar.gz
  - tar -zxvf *.tar.gz
- 压缩：tar -zcvf ***.tar.gz /folder

## 查看系统

https://blog.csdn.net/qq_31278903/article/details/83146031

### 系统

- redhat系列：cat /etc/redhat-release

### 内核

- cat /proc/version
- uname -r    --显示内核版本
  - -a    --显示主机名 内核版本 硬件平台等

### CPU

- cat /proc/cpuinfo
- lscpu

### 内存

- cat /proc/meminfo | grep MemTotal

### 磁盘

- lsblk
- fdisk -l
- df -k
  - -h

### 主机名称

hostname

## 其他查看

- CPU使用情况: ps auxw|head -1;ps auxw|sort -rn -k3|head -10
  - top
  - top -Hp
- 内存使用: ps auxw|head -1;ps auxw|sort -rn -k4|head -10
- 虚拟内存使用: ps auxw|head -1;ps auxw|sort -rn -k5|head -10

```
uname -a # 查看内核/操作系统/CPU信息的linux系统信息  
head -n l /etc/issue # 查看操作系统版本  
cat /proc/cpuinfo # 查看CPU信息  
hostname # 查看计算机名的linux系统信息命令  
lspci -tv # 列出所有PCI设备   
lsusb -tv # 列出所有USB设备的linux系统信息命令  
lsmod # 列出加载的内核模块   
env # 查看环境变量资源  
free -m # 查看内存使用量和交换区使用量   
df -h # 查看各分区使用情况  
du -sh # 查看指定目录的大小   
grep MemTotal /proc/meminfo # 查看内存总量  
grep MemFree /proc/meminfo # 查看空闲内存量   
uptime # 查看系统运行时间、用户数、负载  
cat /proc/loadavg # 查看系统负载磁盘和分区   
mount | column -t # 查看挂接的分区状态  
fdisk -l # 查看所有分区   
swapon -s # 查看所有交换分区  
hdparm -i /dev/hda # 查看磁盘参数(仅适用于IDE设备)   
dmesg | grep IDE # 查看启动时IDE设备检测状况网络  
ifconfig # 查看所有网络接口的属性   
iptables -L # 查看防火墙设置  
route -n # 查看路由表   
netstat -lntp # 查看所有监听端口  
netstat -antp # 查看所有已经建立的连接   
netstat -s # 查看网络统计信息进程  
ps -ef # 查看所有进程   
top # 实时显示进程状态用户  
w # 查看活动用户   
id # 查看指定用户信息  
last # 查看用户登录日志   
cut -d: -f1 /etc/passwd # 查看系统所有用户  
cut -d: -f1 /etc/group # 查看系统所有组   
crontab -l # 查看当前用户的计划任务服务  
chkconfig –list # 列出所有系统服务   
chkconfig –list | grep on # 列出所有启动的系统服务程序  
rpm -qa # 查看所有安装的软件包   
cat /proc/cpuinfo ：查看CPU相关参数的linux系统命令  
cat /proc/partitions ：查看linux硬盘和分区信息的系统信息命令   
cat /proc/meminfo ：查看linux系统内存信息的linux系统命令  
cat /proc/version ：查看版本，类似uname -r   
cat /proc/ioports ：查看设备io端口  
cat /proc/interrupts ：查看中断   
cat /proc/pci ：查看pci设备的信息  
cat /proc/swaps ：查看所有swap分区的信息  
```



# 正则



- 匹配操作符

  ```
   \		转义
   .		匹配任意单个字符
   [1236a]	匹配[]设定的任意单个字符
   [^12]		匹配任意非[^]设定单个字符
   [a-k]		匹配任意a-k单个字符
   ^		行首
   $		行尾
   \<,\>		单词首尾便捷
   \<***\>	规定死"***"这个单词
   |		连接操作符
   (,)	选择操作符
   \n		反向引用
  ```

- 重复操作符

  ```
  ？      匹配0-1次
  *       匹配0-多次
  +       匹配1~多次
  {n}     匹配n次
  {n,}    匹配n~多次
  {n,m}   匹配n~m次
  ```

## 例子

```
^ 行开头匹配
cat 6379.conf | grep ^#  # 查看#开头的行
cat 6379.conf | grep ^[^#]  # 查看非#开头的行

```

# ubuntu

## 修改主机名

vi /etc/hostname



# 脚本示例

## 示例1

- 自动发布重启.sh 本地机

```sh
#!/bin/sh
# 停止
ssh -p 27085 root@144.34.187.149 "sh /home/**/stop.sh"
# 上传
scp -P 27085 `dirname $0`/target/***.jar root@144.34.187.149:/home/**.jar
# 启动
ssh -p 27085 root@144.34.187.149 "sh /home/&&&/start.sh"
```

- stop.sh 服务器

```sh
a=(`/opt/java/jdk/jdk-11_0_10/bin/jps | grep BrowserInWeb.jar`)
echo kill ${a[0]}
kill ${a[0]}
```

- start.sh 服务器

```sh
a=$(cd `dirname $0`;pwd)
echo start $a/BrowserInWeb.jar
# 注意: 若要第一个脚本启动命令执行成功, java程序必须全路径
# 否则无法得到服务器PATH, 直接java -jar会报错找不到java
/opt/java/jdk/jdk-11_0_10/bin/java -jar $a/BrowserInWeb.jar &
```





# 技巧

```shell
# 打印特殊符号
echo echo -e "\x2A" # 打印*号，2A对应ascii
```



# 字典

| 名称          | 命令        |
| ------------- | ----------- |
| 查看 ASCII 表 | man 7 ascii |
|               |             |

