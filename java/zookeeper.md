# ZAB协议

- 知识点
  - Automatic-原子: 要么成功 要么失败 没有中间状态(队列+两阶段提交)
  - Broadcast-广播: 分布式多节点 不代表全部知道(过半通过)
  - 队列: 先进先出 顺序性
  - zk的数据在内存(write内存)
  - 用磁盘保存日志(log)
- 最终一致性流程 --可用状态

<img src="zookeeper\ZAB.png" align="left">

# 选主流程

- 不可用状态
- 场景: 第一次启动集群,重启集群,leade挂了后
- 自己会有myid Zxid
- 新leader: 数据最全(Zxid) myid最大
- 所有数据都是要过半通过
- 过程:
  - 推选制
  - 3888两两通信
  - 只要有人投票,准leader定会发起对自己的投票
  - 推选制,先比较zxid,再比较myid,都是大的优先

<img src="zookeeper\chooseleader.png" align="left">

