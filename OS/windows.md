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

## bat

- 修改编码：chcp 65001 改为utf-8，解决中文乱码

## 文件拖到bat

```
echo %1 --全路径
echo %~n1 --文件名（无后缀）
echo %~x1 --.后缀名
echo %~n1%~x1 --文件名.后缀名
```

