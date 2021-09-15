# docker

## 介绍

docker-ce 社区版

docker-ee

官方镜像仓库：hub.docker.com

## 概念

docker容器是由docker镜像创建的运行实例。镜像运行起来就是容器。

容器服务运行的过程中，基于原始镜像做了改变，比如安装了程序，添加了文件，也可以提交回去 (commit)成为镜像。

## 安装

1. 配置yum源为阿里云源：
   1. https://developer.aliyun.com/mirror/centos?spm=a2c6h.13651102.0.0.3e221b11TLXQbe
   2. 按照步骤操作即可
2. 配置阿里云 docker 源
   1. https://developer.aliyun.com/mirror/docker-ce?spm=a2c6h.13651102.0.0.3e221b11TLXQbe
   2. 按照步骤操作
   3. 注意 centos8 不支持yum makecache fast，改用yum makecache
3. 设置
   1. docker version
      1. Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running? 连接不上守护进程
   2. 手动开启docker守护进程：systemctl start docker
   3. docker version，验证docker client、docker server
   4. 开机启动：systemctl enable docker
4. 相关目录：/var/bin/docker

## 跨平台安装

docker官网 需要注册

## 手动安装

1. 阿里下载手动安装，需要多种依赖，操作复杂，**弃用**
   1. 1中链接找到下载地址，找到对应版本：https://mirrors.aliyun.com/docker-ce/linux/centos/8/
   2. 找到对应cpu架构，inter 选择x86_64
   3. 找到对应发布版本，stable 稳定版
   4. containerd.io、docker-ce、docker-ce-cli
      1. containerd.io ：- daemon to interface with the OS API (in this case, LXC - Linux Containers), essentially decouples Docker from the OS, also provides container services for non-Docker container managers
      2. docker-ce： - Docker daemon, this is the part that does all the management work, requires the other two on Linux
      3. docker-ce-cli ：- CLI tools to control the daemon, you can install them on their own if you want to control a remote Docker daemon

## 容器操作

1. 查看有哪些容器：docker ps
   1. 无参：显示运行中 不准确，看不到 通过docker logs、专业容器云管理平台
   2. -a ：显示所有
   3. -a ：只显示id，可配合删除等使用
   4. -n p ：列出近期（最近）前p个，可配合删除等使用
2. 创建容器：docker create --name web centos
3. 创建并启动容器：docker run -itd ubuntu:16.10
   1. -i ：STDIN标准输入缓冲区（流）
   2. -t ：终端或模拟终端
   3. -d ：后台运行
   4. --restart=always ：容器挂掉之后重启，**成产环境**
   5. --name ：
   6. -p ：
   7. --privileged=true ：centos7 因为selinux产生安全性问题，会对容器进行禁用
   8. 16.0 ：版本号 不加默认最新版本
   9. 本地没有，会去远程仓库拉取镜像
   10. create + run
4. 进入容器：
   1. docker exec -i -t 唯一id /bin/bash ：使用此命令，在exit退出时，容器不会退出
   2. attach ：exit退出时，容器也会终止
5. 退出容器：exit
6. 启动容器：docker start 唯一ID（ps命令可查看）
7. 停止容器：docker stop ID
8. 停止容器：docker restart ID
9. 删除容器：
   1. docker rm -f $(docker ps -a -q) ：删除所有容器
10. 查看日志：docker logs ID
11. 查看容器详情JSON：docker inspect ID
12. 查看容器进程信息：docker top ID/NAME
13. 重命名容器：rename
14. 检查容器文件系统变动：diff
15. 实时监控显示容器的资源使用情况：stats



## 镜像操作

1. 查找镜像：docker search IMAGE_NAME

2. 拉取镜像：docker pull IMAGE_NAME:VERSION，不指定版本，拉取最新的

   1. docker pull IP:PORT/image_name:tag ，可拉取私有仓库

3. 镜像列表：

   1. docker images
   2. docker image ls -q
      1. -q ：只显示id

4. 镜像导入：docker import ，docker load

5. 镜像导出、备份：docker export IMAGE_ID ，docker save ubuntu:18.04 -o ubuntu-18.04.tar

6. 删除镜像：

   1. docker rmi IMAGE_ID
      1. 删除失败，找到镜像，先停止再删除
      2. -f ：强制删除，可能曹成遗留问题
   2. docker image rm IMAGE_ID
   3. docker rmi NAME:TAG
      1. id重复（指向多个源）可用此法
      2. TAG ：docker images可查看
   4. 删除全部：docker rmi -f $(docker image ls -q)

7. 镜像标签（TAG）：docker tag IMAGE_ID REPOSITORY 1907/httpd:dev

   1. REPOSITORY（源）：docker images 可查看
   2. 1907/httpd ：源
   3. dev ： tag

8. 镜像提交：docker push

   1. 现有的镜像

   2. 现有的容器导出镜像

   3. push到仓库（私有、公共）

      1. docke官网注册docker hub账户

      2. 客户端登录：

         1. linux终端 ：docker login
         2. linux终端 ：docker logout
         3. win ：
         4. mac ：

      3. docker push username/image:tag

         denied：requested access to the resource is denied 故障

         1. 标准格式：docker push docker_hub_username/image_name:tag
         2. 镜像标签：docker tag docker_hub_username/image_name:tag
         3. 推送镜像

9. 镜像结构

   1. 数据：4个layer层
   2. 元数据：json文件
   3. docker inspect ID
   4. 千层饼结构：联合挂载，把多个镜像层统筹成一个可运行的容器

10. 创建镜像：

    1. 镜像提交：docker commit

       1. 容器打包成镜像
       2. 可以把数据打包到镜像中
       3. docker commit -m="update version" -a=liuyao ID liuyao/ubuntu:new
          1. -m : 本次提交message
          2. -a ：作者

    2. 镜像构建：

       1. docker build

       2. dockerfile 指令 ：www.jianshu.com/p/53123da7af41

          1. FROM ：基础镜像的来源
          2. RUN ：在镜像中执行了什么命令
          3. MAINTAINER
          4. ENV
          5. WORKDIR
          6. CMD
          7. VOLUME
          8. USER
          9. ADD
          10. COPY
          11. ONBUILD

       3. 企业级docker build 实战：Dockerfile自定义CentOS7系统镜像

          1. docker pull centos ：基础镜像

          2. 编写Dockerfile文件

             ```
             # 从哪一个基础镜像构建
             FROM centos:latest
             
             # 定义作者信息
             MAINTAINER 'liuyao'
             
             # 定义一个变量
             ENV newpath /tmp
             
             # 设置登录以后工作路径
             WORKDIR $newpath
             
             # 干了什么（执行需要的操作）
             RUN yum install -y vim
             RUN yum install -y net-tools
             
             # 开放指定端口
             EXPOSE 80
             EXPOSE 22
             # 要啥开啥 尽量少 安全
             
             # 执行命令
             CMD echo $newpath
             CMD echo "success-------ok"
             CMD /bin/bash
             ```

          3. docker build -f dockerfile -t NAME:TAG . ：注意最后那个点

          4. docker history NAME:TAG ：查看构建历史

          5. docker run ........

          6. 进入容器：ping www.baidu.com

11. 扩展：portus 镜像仓库前端分布认证

Dockerfile

```
## tomcat :
# 从哪一个基础镜像构建
FROM tomcat:latest

# 设置登录以后工作路径 路径不存在 创建
WORKDIR /usr/local/tomcat/webapps

# docker-web ：Dockerfile 同级文件夹
# ./docker-web ：容器 WORKDIR/docker-web
ADD docker-web ./docker-web
```

```
## redis :
FROM centos
RUN ["yum", "install", "-y", "gcc", "gcc-c++", "net-tools", "make"]
WORKDIR /usr/local
ADD redis-xxx.tar.gz .
WORKDIR /usr/local/redis-xxx/src
RUN make && make install
WORKDIR /usr/local/redis-xxx
ADD redis-7000.conf .
EXPOSE 7000
CMD ["redis-server", "redis-7000.conf"]
```



## 仓库操作

存储镜像

**原则：能用官方就用官方，search 中 stars多的**

1. 公共仓库
2. 私有仓库
3. 三方仓库

## 私有仓库搭建-Docker公司 ???

搭建 Docker-registry私有仓库组件

1. 主机规划
   1. node02 私有仓库：Docker-ce、Docker-registry组件
   2. node01 客户端：Docker-ce
2. 搜索镜像：docker search registry
3. 拉取镜像：docker pull registry
4. 启动容器-node02：docker run  -d -v  /registry:/home/docker-registry -p 5000:5000 --restart=always --privileged=true --name registry registry:latest

## 私有仓库搭建-VMWare公司

### 特点

安全、标识和管理、镜像复制、LDAP-用户身份验证和管理、国际化、图形化、审计管理、部署简单

### 搭建 Harbor组件 **企业级**

1. Docker-compose：docker compose 官网

   1. 在线
      1. cd /var/local
      2. sudo curl -L "https://github.com/docker/compose/releases/download/1.25.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
      3. 确保国内镜像加速
   2. 离线
      1. github.com/docker/compose/release
      2. mv xxx /usr/local/bin/docker-compose
      3. sudo chmod +x /usr/local/bin/docker-compose
   3. docker-compose version

2. harbor

   1. Github开源：github.com/goharbor/harbor/releases ，harbor-offline-installer-v1.9.4.tgz

   2. cd /usr/local

   3. tar -xvf xxx.tgz

   4. cd harbor

   5. ./prepare

   6. ./install.sh

   7. vi harbor.yml

      ```yaml
      # 不能是127.0.0.1、localhost
      hostname: ip
      harbor_admin_password: Harbor12345
      ```

   8. ./install.sh ：如果用其他方式搭建了私有仓库可能失败，需要删掉其他私有仓库（docker rm -f ID）

   9. successfully

### 使用

1. 访问 http://ip/ 登录系统
2. 创建项目：GUI web图形交互界面
3. 创建用户
4. 登录仓库：docker login IP
5. 镜像操作
   1. 镜像tag：标记镜像 docker tag local_img_name:tag remote_IP/harbor_Project/image_name:tag
      1. local_img_name : REPOSITORY
      2. harbor_Project : harbor GUI中创建的项目名
   2. 上传镜像：docker push remote_IP/harbor_Project/image_name:tag
   3. 下载镜像：docker pull remote_IP/harbor_Project/image_name:tag

## 配置私有仓库

1. 配置 /etc/docker/daemon.json

   新版本必须配置两个，不然docker启动报错

   ```json
   {
       "registry-mirrors": [ // 国内镜像加速
           "https://xxx.mirrors.aliyun.com"
       ],
       "insecure-registries": [ // 私有仓库
           "ip:port"
       ]
   }
   ```

2. systemctl restart docker

3. systemctl daemon-reload

## 阿里云仓库

### 创建

1. 官网注册，控制台 / 搜索 容器镜像服务
2. 创建个人实例，输入镜像密码
3. 创建命名空间，可5个，小写字母开头
4. 创建镜像仓库 -> 本地仓库

### 使用

1. 修改密码：个人实例 -> 访问凭证
2. 登录
   1. docker login --username=liuyaoshuaib registry.cn-hangzhou.aliyuncs.com
   2. 输入密码
3. 推送
   1. docker tag fb52e22af1b0  registry.cn-hangzhou.aliyuncs.com/main-ly/open-ly:v1
   2. docker push  registry.cn-hangzhou.aliyuncs.com/main-ly/open-ly:v1
   3. main-ly ：命名空间
   4. open-ly ：仓库名称
4. 拉取镜像：docker pull registry.cn-hangzhou.aliyuncs.com/main-ly/open-ly:v1

## 容器的网络

### 外部访问容器，也叫宿主机访问容器

1. 端口映射，容器与宿主机通信
   1. -p ：指定端口映射，经常使用，**多用于生产**，格式：主机(宿主):容器端口
   2. -P ：随机端口映射，容器内部的端口随机映射到主机的高端口，65535(2^16-1)
2. 端口暴露：Dockerfile：EXPOSE 80
3. 常见5种方式：
   1. 宿主机随机端口映射容器所有端口：docker run -itd -P nginx /bin/bash
   2. 宿主机随机端口映射容器的指定端口：docker run -itd -p 80 nginx /bin/bash
   3. **宿主机指定端口映射容器指定端口，常用**
      1. docker run -itd -p 80:80 nginx /bin/bash
      2. docker run -itd -p 8080:80 nginx /bin/bash
      3. docker run -itd -p 443:443 nginx /bin/bash
      4. docker run -itd -p 80:80 -p 443:443 nginx /bin/bash
      5. docker run -itd -p 80:80 -p 443:443 --restart=always nginx /bin/bash
   4. 宿主机随机端口映射到容器指定IP、指定端口：
      1. docker run -itd -p 172.0.0.10::80 nginx /bin/bash
      2. :: 中间为宿主机端口 不写为随机
      3. 多物理网卡使用
   5. 宿主机指定端口映射到容器指定IP、指定端口：
      1. docker run -itd -p 172.0.0.10:8080:80 nginx /bin/bash
      2. 8080 ：宿主机指定端口
      3. 多物理网卡使用
4. 底层原理 iptables
   1. docker run -d -p 方式启动的容器 自动添加一条NAT规则
      1. docker run -d -p 81:80 nginx
      2. http://192.168.61.161:81/ 可访问
   2. docker ps
      1. 0.0.0.0:81
         1. 宿主机
         2. 无固定ip，就是全网段 0.0.0.0
   3. 查看宿主机ip地址：ip a ，可以看到 docker0 这一个网桥
   4. 多块物理网卡，则可使用 -p 172.21.0.11:8080:80 指定某一块网卡 进行映射
5. 查看容器端口：docker port ID
6. 随机端口映射原理
   1. docker run -d -P nginx
   2. 与内核有关：sysctl -a | grep port | grep range ，随机端口范围

### 容器访问容器，也叫容器的互联

创建一个桥接方式的自定网络，宿主机虚拟网卡

1. docker network create -d bridge network_name
   1. -d ：指定docker网络类型
2. 例如
   1. docker run -itd -p 127.0.0.1:80:80 --name centos-01 --network network_name centos
   2. docker run -itd -p 127.0.0.1:81:81 --name centos-02 --network network_name centos
   3. 可以ping通
   4. docker inspect ID ：IPAddress，查看容器的ip
3. 例如2
   1. docker network connect my-bridge tomcat（or NAME）
   2. docker network connect my-bridge mysql
4. 生产案例
   1. docker run -d -P nginx
   2. docker run -d -P mysql
   3. docker network ls

容器单向通信

1. docker run -d --name tomcat --link mysql
2. 进入 tomcat ，ping mysql 可以通

容器双向通信

### 容器网络的几种模式

1. host，--net=host ：每个host模式容器 共享 宿主机的ip、port
2. container ，容器模式 ：容器2 共享容器1 的网卡 进行网络连接
3. none ：只有 lo 本地轮回
4. bridge，默认 ：通过 docker0虚拟网桥 互通
5. 自定义网络

## 容器数据共享

原理： 宿主机共享目录

1. -v ：挂载宿主机目录
   1. docker run --name t1 -v /usr/webapps:/usr/local/tomcat/webapps tomcat
   2. /usr/webapps ：宿主机路径
   3. /usr/local/tomcat/webapps ：容器路径
   4. 如：docker  run --name t1 -p 8000:8080 -d -v /usr/webapps:/usr/local/tomcat/webapps tomcat
2. --volumes-from ：共享容器内挂载点
   1. 创建共享容器，不运行，同一管理挂载点：docker create --name webpages -v /webapps:/tomcat/webapps tomcat /bin/true
   2. docker run --volumes-from webpages --name t1 -d tomcat ：使用共享容器的挂载配置
   3. 如：
      1. docker create --name webpage -v /usr/webapps:/usr/local/tomcat/webapps tomcat /bin/true
      2. docker run -p 8002:8080 --volumes-from webpages --name t1 -d tomcat

## docker 三剑客

docker machine

docker compose

docker swarm

## 总结

容器就是一个包，包含了应用以及所有依赖

。。。

# K8S kubernetes

## 介绍

容器集群管理工具，google开源：容器调度、容器管理、容器编排

我们对容器集群的自动化部署

优势：容器编排、轻量级、开源、弹性收缩、负载均衡

概括：一切皆容器

基础架构：

1. <font color="red">**主节点Master**</font>：
   1. 管理节点，集群里的大脑
   2. **主要职责就是容器的调度**，决定应用放在那里运行
   3. k8s-api + k8s核心组件等
   4. 可以设置一个主节点或多个主节点
2. <font color="red">**从节点Node**</font>-01：容器运行节点，可以理解成一个服务器
   1. 运行服务容器，由master节点管理
   2. **主要职责就是运行容器应用并监控并汇报容器状态**
   3. 根据Master的要求**管理容器的生命周期:(创建、开始、运行、停止、销毁)**
   4. 常见：**CentOS7.6、Ubuntu Server 16.04.4 LTS**
   5. k8s注册组件等服务
   6. 运行多个<font color="red">**工作单元pod**</font>
      1. pod：k8s中最小的工作单元，每一个pod包含一个或多个容器
      2. pod中的容器会被**视为一个整体**被master调度到一个node上运行
   7. <font color="red">**控制器 controller**</font>：
      1. k8s通常不会自己直接创建pod，而是通过controller来管理pod
      2. controller定义pod的部署特性，内部端口 外部端口
      3. 如：有几个剧本？在什么样的node上运行
      4. 为了满足不同的工作场景，k8s提供了多种controller
   8. <font color="red">**控制器 deployment**</font>：最常见的一种controller，管理pod的多个副本，并确保pod按照期望的状态运行
   9. <font color="red">**副本 eplica set**</font>：控制器中的一种，能够实现多副本管理
   10. <font color="red">**任务 job**</font>：用于运行结束就删除的应用，而其他的controller中的pod通常是可以长期持续运行的
   11. <font color="red">**服务service**</font>：
       1. deploment 可以部署多个副本，每个pod都有自己的IP，虚拟的网桥。外界如何来访问这些副本？
       2. 创建service：
          1. 定义外界访问一组特定的pod方式
          2. service有自己的ip和port
          3. service为pod提供了负载均衡等服务
       3. 在k8s中运行容器pod与访问容器：controller负责运行容器、service负责访问容器
   12. <font color="red">**命名空间namespace**</font>：
       1. 可以将集群逻辑上划分多个虚拟的 集群：如(default、public)，虚拟的集群，就是一个namespace，然后从这上边创建容器
       2. 不同namespace里的资源是相互隔离的
3. Node-02：容器运行节点
4. 。。。

## k8s 集群环境搭建

### 主机规划 至少4台

| 主机名称    | IP             | 系统环境                  | 备注                   |
| ----------- | -------------- | ------------------------- | ---------------------- |
| k8s master  | 192.168.61.151 | Ubuntu Server 18.04.3 LTS | Rancher 容器云管理平台 |
| k8s node-01 | 192.168.61.152 | Ubuntu Server 18.04.3 LTS | Rancher 容器云管理平台 |
| k8s node-02 | 192.168.61.153 | Ubuntu Server 18.04.3 LTS | Rancher 容器云管理平台 |

### 环境搭建 基于rancher1.6

安装 要注意版本一致（环境搭建时 版本不一致踩的坑） 见 https://rancher.com/docs/rancher/v1.6/en/hosts/#supported-docker-versions

>  新版本：https://rancher.com/docs/rancher/v2.x/en/

| ubuntu version          | docker version | rancher version | k8s version        |
| ----------------------- | -------------- | --------------- | ------------------ |
| ubuntu server 16.04 lts | 17.03          | v1.6.12         |                    |
| ubuntu server 18.04 lts | 18.09          | v1.6.26         | v1.12.7-rancher1-1 |
| ubuntu server 20.04     | 20.10          | 暂无兼容版本    |                    |

#### 

1. Ubuntu Server 18.04.3 LTS

   1. 分区 /root /home / ，home尽量大
   2. sudo passwd root ，输入密码
   3. su root
   4. apt-get update
   5. vim /etc/fstab ，注释交换空间
   6. ufw disable ，关闭防火墙

2. 安装docker

   1. curl https://releases.rancher.com/install-docker/18.09.sh | sh ：**注意版本兼容性**

   2. vi /etc/docker/daemon.json ，配置加速节点

      ```json
      {
        "registry-mirrors": ["https://1dr5t5mc.mirror.aliyuncs.com"]
      }
      ```

   3. systemctl restart docker ，重启docker

   4. systemctl enable docker ，开机启动

3. 关机power，创建快照，链接克隆两个节点，K8S-Node-01、K8S-Node-02

4. 安装rancher

   1. docker run -d --restart always --name rancher-server -p 80:8080 rancher/server:v1.6.26
   2. 浏览器输入 ip

5. 使用rancher

   1. 设置登录方式：ADMIN -> Access Control
      1. 选择LOCAL
      2. 输入用户名、密码：liuyao、123456
      3. 点击 Enable Local Auth，开启本地登录
      4. 退出，选择中文，登录
   2. 创建镜像库：基础架构 -> 镜像库
      1. 选择 DOCKERHUB，输入用户名密码：liuyao、123456
      2. 看到Active
   3. 环境模板：Default -> 环境管理
      1. 添加环境模板
      2. 选择 Kubernetes
      3. 添加名称、描述：K8S_CN、中国区K8S镜像加速
      4. 设置共享权限
      5. 点击编辑设置，选择k8s版本,1.12.x
      6. 配置4个参数
         1. Private Registry for Add-Ons and Pod Infra Container Image：registry.cn-shenzhen.aliyuncs.com
         2. Image namespace for  Add-Ons and Pod Infra Container Image：rancher_cn
         3. Image namespace for kubernetes-helm Image：rancher_cn ，高版本没有此选项
         4. Pod Infra Container Image：rancher_cn/pause-amd64:3.0
      7. 点击设置
      8. 最下边 点击创建
   4. 环境：Default -> 环境管理
      1. 添加环境
      2. 选择刚才创建的 K8S_CN
      3. 填写 名称、描述
      4. 设置访问控制
      5. 点击创建
      6. 找到创建的环境，最右侧三个点，依次点击 创建为缺省、切换至此环境
      7. 然后等待添加Node节点
   5. 添加节点：基础架构 -> 主机
      1. Master：点击添加主机，将脚本复制到master节点，（应该是rancher server 部署在哪台机器，那一台就是master节点）
      2. Node：点击添加主机，将脚本复制到多个Node节点
   6. 网络优化：service 添加端口映射 TCP
      1. 云主机：30000 ~ 32767
      2. 私有云虚拟机：firewall-cmd --permanent --add-port 30000-32767/tcp
   7. 集群创建容器应用：K8S UI，KUBERNETES -> 仪表盘 -> 概况(老版本 overview)
      1. 右上角创建，找到创建应用 选项卡（老版本为 单选框 填写应用详情）
      2. 例如：
         1. 应用名称：nging-test
         2. 容器镜像：nginx
         3. 容器组个数：1
         4. 服务：外部
         5. 端口：82，目标端口：80，协议：TCP
      3. 点击部署
      4. 找到服务，外部端点，即可打开nginx
      5. 访问不了，找到基础架构 -> 主机 -> 节点 -> 应用:kubernetes-loadbalances
   8. 使用私有镜像仓库：基础架构 -> 镜像库
      1. 点击 添加镜像库 
      2. 点击 Custom
      3. 输入信息：阿里云为例
         1. 登录，找到 容器镜像服务 控制台
         2. 个人实例 -> 镜像仓库 -> 点击仓库名称
         3. 复制公网地址，不要带https
         4. 登录阿里云Docker Registry 中找到username
         5. 输入镜像仓库密码
         6. 创建
      4. 从自己的镜像仓库拉取镜像
         1. 推送本地镜像到远程仓库
         2. 创建k8s 应用：如 阿里云仓库
            1. 找到仓库基本信息，找到镜像全名:tag
            2. registry.cn-hangzhou.aliyuncs.com/main-ly/open-ly:[镜像版本号]

# 进度

docker 基础 ：Dockerfile 构建镜像



6节 未看  镜像push私有仓库、镜像pull私有仓库

1. 容器pause kill stop 。。。
2. 设置镜像tag。。。
3. 本地pull 镜像