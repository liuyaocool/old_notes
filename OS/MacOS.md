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

# 好用的终端 item2

https://www.jianshu.com/p/ba08713c2b19

## lrzsz 实现文件传输

1. brew install lrzsz

2. 在本地/usr/local/bin/目录下保存iterm2-send-zmodem.sh 和iterm2-recv-zmodem.sh两个脚本

3. chmod 777 /usr/local/bin/iterm2-*

4. 设置Iterm2的Tirgger特性，

   profiles -> default -> Advanced选项卡中的Tirgger -> Edit

   添加两条trigger，分别设置 Regular expression，Action，Parameters，Instant如下：

   ```
   1.第一条
           Regular expression: rz waiting to receive.\*\*B0100
           Action: Run Silent Coprocess
           Parameters: /usr/local/bin/iterm2-send-zmodem.sh
           Instant: checked
   2.第二条
           Regular expression: \*\*B00000000000000
           Action: Run Silent Coprocess
           Parameters: /usr/local/bin/iterm2-recv-zmodem.sh
           Instant: checked
   ```

**iterm2-recv-zmodem.sh**

```sh
#!/bin/bash
# 这个脚本来自 github，删掉了一些 ** 言论。

osascript -e 'tell application "iTerm2" to version' > /dev/null 2>&1 && NAME=iTerm2 || NAME=iTerm
if [[ $NAME = "iTerm" ]]; then
	FILE=$(osascript -e 'tell application "iTerm" to activate' -e 'tell application "iTerm" to set thefile to choose folder with prompt "Choose a folder to place received files in"' -e "do shell script (\"echo \"&(quoted form of POSIX path of thefile as Unicode text)&\"\")")
else
	FILE=$(osascript -e 'tell application "iTerm2" to activate' -e 'tell application "iTerm2" to set thefile to choose folder with prompt "Choose a folder to place received files in"' -e "do shell script (\"echo \"&(quoted form of POSIX path of thefile as Unicode text)&\"\")")
fi

if [[ $FILE = "" ]]; then
	echo Cancelled.
	# Send ZModem cancel
	echo -e \\x18\\x18\\x18\\x18\\x18
	sleep 1
	echo
	echo \# Cancelled transfer
else
	cd "$FILE"
	/usr/local/bin/rz -E -e -b --bufsize 4096
	sleep 1
	echo
	echo
	echo \# Sent \-\> $FILE
fi
```

**iterm2-send-zmodem.sh**

```sh
#!/bin/bash
# 这个脚本来自 github，删掉了一些 ** 言论。

osascript -e 'tell application "iTerm2" to version' > /dev/null 2>&1 && NAME=iTerm2 || NAME=iTerm
if [[ $NAME = "iTerm" ]]; then
	FILE=`osascript -e 'tell application "iTerm" to activate' -e 'tell application "iTerm" to set thefile to choose file with prompt "Choose a file to send"' -e "do shell script (\"echo \"&(quoted form of POSIX path of thefile as Unicode text)&\"\")"`
else
	FILE=`osascript -e 'tell application "iTerm2" to activate' -e 'tell application "iTerm2" to set thefile to choose file with prompt "Choose a file to send"' -e "do shell script (\"echo \"&(quoted form of POSIX path of thefile as Unicode text)&\"\")"`
fi
if [[ $FILE = "" ]]; then
	echo Cancelled.
	# Send ZModem cancel
	echo -e \\x18\\x18\\x18\\x18\\x18
	sleep 1
	echo
	echo \# Cancelled transfer
else
	/usr/local/bin/sz "$FILE" --escape --binary --bufsize 4096
	sleep 1
	echo
	echo \# Received $FILE
fi
```

