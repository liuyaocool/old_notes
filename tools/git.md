# 安装

## linux源码编译安装

- 官网下载源码，解压
- 源码根目录执行：
  - 编译：make all
  - 安装：make install prefix=/opt/git/xxx
- 配置环境变量：
  - vi /etc/profile
  - source /etc/profile
- 查看版本：git --version

## yum安装（版本低）

- 安装： yum -y install git
- 卸载：yum -y remove git

