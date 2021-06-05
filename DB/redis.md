# 好用网站

- 数据库排名: https://db-engines.com/en/
- redis-spring: spring官网 找到projects redis属于spring-data 有两个页面小标签 主要是learn Reference Doc.
- proxy: github 搜 twitter/twemproxy readme.md

# 安装

## 下载

- https://redis.io/
- 右键复制链接地址 是一个压缩包的资源链接地址
- linux 可以使用 wget程序下载

## 安装

通读readme.md,一般安装方法都在这里

- 解压缩: tar xf file
- 安装编译器  yum install gcc 如果安装过跳过
- 编译: 执行命令 make    -- makefile 文件
  - make distclean    --清除错误的编译文件 再重新make
- 安装: make install PREFIX=/opt/soft/redis6 可执行文件
  - 实际执行 src/Makfile 文件进行安装
- 启动
  - cd src 目录 → 执行 ./redis-server
  - 安装路径/bin/redis-server    --前台启动
  - 安装路径/bin/redis-server /***/6379.conf    --后台启动
- 命令行客户端：./redis-cli
- 停止
  - kill pid    --不推荐
  - ./redis-cli shutdown
  - 或 在命令行客户端 执行shutdown命令

## 做成服务 

个人不推荐 跟其他应用乱 有的成服务 有的不成 有的开机启动 有的不启动

干脆 不做成服务 不做成开机启动

- 先编译

- 安装路径添加到path: /opt/soft/redis6/bin

- cd utils → 执行 ./install_server.sh  --重复此步骤可安装多个服务 并多启

- 根据提示输入配置信息或直接回车选择默认值

- 会在/etc/init.d文件夹生成 redis_号码(端口号) 启动脚本
      /etc/redis/9001.conf
      /var/log/redis_9001.log
      /var/lib/redis/9001
      /opt/soft/redis6/bin/redis-server
      /opt/soft/redis6/bin/redis-cli

- 错误: This systems seems to use systemd.  

  - ./install_server.sh中注释以下代码

  - ```sh
    #bail if this system is managed by systemd
    #_pid_1_exe="$(readlink -f /proc/1/exe)"
    #if [ "${_pid_1_exe##*/}" = systemd ]
    #then
    #       echo "This systems seems to use systemd."
    #       echo "Please take a look at the provided example service unit files in this directory, and adapt and install them. Sorry!"
    #       exit 1
    #fi
    ```

- 启动服务: service redis_号码 start/stop/status


## 开放端口 

见linux 防火墙

- 问题1:开放端口后外机仍无法访问
  - 原因: lsof -i: 可查看到name 为localhos:redis,为只允许本机访问
  - 解决: vi /etc/redis/0000.conf 中找到bind，改为 0.0.0.0，则lsof中name由localhost:redis→*:redis

# 常识

- 磁盘 寻址-ms 带宽-G/M
- 内存 寻址-ns 带宽-很大
  - 内存比磁盘快10W倍
- i/o buffer：成本问题
  - 磁盘与磁道
  - 扇区，一扇区512byte，成本变大--索引
  - 格式化磁盘 4k对齐，操作系统，无论读多少，最少4k从磁盘拿
  - 文件变大 速度变慢
- 数据库
  - data page  4k
  - 索引  4k B+Tree
  - 建表必须给出schema：表的列 列的类型
- 为的是磁盘io慢 就要减少IO

# 内核

- man 2 read
- man 2 socket
- man 2 select
- man 2 mmap
  - 共享空间
  - 内核位置对应用户位置 
  - 红黑树 链表
- man epoll
- man 2 sendfile 0拷贝 内核空间到用户空间

ll /proc/$$/fd    --查看shell文件描述符

```shell
[root@lynode01 ~]# ps -ef | grep redis
root        1175       1  0 Mar26 ?        00:22:54 /opt/soft/redis6/bin/redis-server 0.0.0.0:6379
root       12116   11098  0 10:17 pts/0    00:00:00 grep --color=auto redis
[root@lynode01 ~]# ll /proc/1175/fd
total 0
lrwx------. 1 root root 64 Apr  4 10:18 0 -> /dev/null
lrwx------. 1 root root 64 Apr  4 10:18 1 -> /dev/null
lrwx------. 1 root root 64 Apr  4 10:18 2 -> /dev/null
lr-x------. 1 root root 64 Apr  4 10:18 3 -> 'pipe:[30660]'
l-wx------. 1 root root 64 Apr  4 10:18 4 -> 'pipe:[30660]'
lrwx------. 1 root root 64 Apr  4 10:18 5 -> 'anon_inode:[eventpoll]'
lrwx------. 1 root root 64 Apr  4 10:18 6 -> 'socket:[30670]'
```



# 原理

- redis 单线程 单实例 单进程 处理用户请求，还有其他线程 跟用户无关
- 每连接内顺序一致性

- cpu 只有1颗
- JVM: 一个线程的成本默认 1MB，可以调
- 问题
  1. 线程多了调度成本CPU浪费
  2. 内存成本
- 使用epoll 内核 多路复用 (见 linux.md:epoll)

# 使用

- 默认16个库

# 基本命令

- info    --查看节点信息（集群、）