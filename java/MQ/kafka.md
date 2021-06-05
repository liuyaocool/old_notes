# 引入

## AKF划分

### x：可靠性

- 副本 出主机的
- kafka只允许主节点 读写
- 可以有读写分离，容易出现一致性问题

### y：业务-topic
### z：分区分治

-  分区内有序 分区外部无序 offset
- 无关的可分治
- 有关 的 顺序一致性问题 
  - equip连续报警问题：
  - 创建新的主题，单一分区或一个测点一个分区

## 其他

- 分布式
- 可靠的(高可用)、可扩展、高性能
- 单点问题
- 性能问题

# 前瞻

## zookeeper

- broker选主用

## admin-api
   -    通过zookeeper找到controller
-    创建topic

## producer

- 老版本 从zookeeper拿主地址，zookeeper会有负担
-  新版本 不从zookeeper拿 通过一个连接列表找到主
-  并发下 数据顺序一致性问题

## consumer

- 与分区关系 同一分组 1:1 1:n

## offset --消费进度

- 老版本 维护到zk
-  第三方(过渡期) redis db
-  新版本 kafka自己维护了一个topic 保存offset
  - 先在内存中（metadata） 后到持久层
-  方案 --节奏？频率？先后？
  - 1 异步 5s 先干活 持久化offset：重复消费
  - 2 同步的 业务操作和offset持久化
  - 3 没有控制好顺序 offset持久了 但业务写失败了

## controller-主
- 确定之后会有cluster metadata(元数据) 同步到集群所有节点

## 集群

- 业务层次上，各角色之间进行通信，不能因为业务需求，加大zookeeper负担
-  broker1-jvm(controller)     p0主(topicA)     p1从
-  broker2-jvm                      p1主(topicA)     p0从、





# consume-trnasform-produce

- 生产消息与消费提交偏移在同一个事务里 是原子的
- 生产者相关配置
  - transaction.id
  - enable.idempotence=true # 幂等 配置了transaction.id此设置默认开启，不需要再配置
- 消费者配置
  - enable.auto.commit=false
  - isolation.level=read_committed // 设置隔离级别
- java代码
  - producer.initTransactions();  // 初始化事务
  - producer.beginTransaction(); // 开启事务
  - producer.sendOffsetsToTransaction(commits, "group0323"); // 提交偏移量
  - producer.commitTransaction(); // 事务提交
  - producer.abortTransaction(); // 事务回滚

# 问题

- last-record.offset + 1 = consumer.endOffsets(records.partitions())
  - org.apache.kafka
  - kafka-clients
  - 2.6.0

# 进度

第二节课

