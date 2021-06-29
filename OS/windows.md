# 通用

- 注册表: regedit
- 服务：services.msc
- 配置管理：gpedit.msc

# win10 关闭自动更新

1. win+r -> 输入 services.msc
2. “常规”中禁用，“恢复”中将第一次失败改为“误操作”，应用
3. win+r -> 输入 gpedit.msc
4. 计算机配置 -> 管理模板 → Windows 组件 → Windows 更新 
5. 找到配置自动更新，将其禁用

# XP

## 开启445端口

- 打开注册表
- HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\NetBT\Parameters
- SMBDeviceEnabled DWORD 键值 改为1
- 重启
- 执行命令 netstat -an 即可看到

## 无法访问文件共享问题

xp 使用SMBv1协议, 而比较新的系统都是SMBv2 SMBv3等高版本, 协议不对应

# DOS

## 命令

- 查看内存频率：wmic memorychip

- ```
  扫描3389端口 for /l %a in (1,1,254) do start /min /low telnet 192.168.0.%a 8090
  
  
  for 是批处理中的循环语句
  for /l 就是递增循环格式
  for /l %a in (初始值,递增值,结束值) 
  do 批处理命令这里填的是 1，1,254 就是从1到254增加
  start 是执行命令 
  /min 参数就是最小化执行 
  /low参数就是优先执行
  telnet 192.168.0.%a 3389 的含义就是扫描 192.168.0.%a的3389端口是否开放这里的%a就是for循环递增的值也就是 1,2,3,4,5,6,7......到254这条命令
  虽然可以扫描一个网段的3389端口,但是执行效率不高,速度很慢,因为原理是用telnet 去连接对方的3389端口
  
  扫描网段所有ip和所有端口 65535最大端口
  for /l %a in (1,1,254) do for /l %b in (1,1,65535) do start /low/min telnet 192.168.0.%a %b
  ```

- 

## bat

- 修改编码：chcp 65001 改为utf-8，解决中文乱码

## 文件拖到bat

```
echo %1 --全路径
echo %~n1 --文件名（无后缀）
echo %~x1 --.后缀名
echo %~n1%~x1 --文件名.后缀名
```

