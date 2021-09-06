# docker

## 介绍

docker-ce 社区版

docker-ee

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
             FROM centos
             
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

          3. docker build if dockerfile -t NAME:TAG .

          4. docker history NAME:TAG ：查看构建历史

          5. docker run ........

          6. 进入容器：ping www.baidu.com

11. 扩展：portus 镜像仓库前端分布认证

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

1. Docker-compose：

   1. 在线
      1. cd /var/local
      2. sudo curl -L "https://github.com/docker/compose/releases/download/1.25.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
      3. 确保国内镜像加速
   2. 离线
      1. github.com/docker/compose/release
      2. mv xxx /usr/local/bin/docker-compose
      3. sudo chmod +x /usr/local/bin/docker-compose

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





# 进度

第10节 1



6节 未看  镜像push私有仓库、镜像pull私有仓库

1. 容器pause kill stop 。。。
2. 设置镜像tag。。。
3. 本地pull 镜像