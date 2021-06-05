# Fusion 12

## 修改nat模式网段

1. sudo su

2. cd /Library/Preferences/VMware\ Fusion/

3. cp networking networking.bak

4. vi networking 修改

   ```
   answer VNET_8_HOSTONLY_NETMASK 255.255.255.0
   answer VNET_8_HOSTONLY_SUBNET 192.168.61.0
   ```

5. cd vmnet8 

6. cp nat.conf nat.conf.bak

7. vi nat.conf 修改

   ```
   # NAT gateway address
   ip = 192.168.61.1
   netmask = 255.255.255.0
   ```

   