# 安装

- https://www.kali.org/downloads/ 下载
- 普通镜像: 可自行在vmware中安装
- vmware镜像: 安装好的,解压可直接打开 
- 用户:kali 密码:kali 
- 使用kali账号改密码
  - sudo su
  - passwd root 
  - 输入新root密码

# 更新kali系统

- Vi /etc/apt/sources.list
- deb 和 deb-src 两个替换为网上找到的镜像
- 执行 apt-get update && apt-get upgrade && apt-get dist-upgrade

# linux

## apt

- apt  把apt-get和apt-cache中常用的做了一个集合
- apt-get
- apt-cache
- apt install == apt-get install









