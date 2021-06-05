# brew

- 安装: 终端执行命令

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```



```
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```



# 网络相关

- nc -zv 192.168.1.2 8080-8090    --端口扫描

# 用户操作

- su  --切换root用户
- su username

# 权限

- sudo + 命令  --以root权限执行命令

# 程序操作

## 端口

- 查看：lsof -i:8000
- 关闭：kill pid