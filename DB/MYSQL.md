# 书

高性能mysql 鸟

# 安装

## linux-yum 

没成功 centos8stream版本 需配置国内镜像 否则很慢

- 检查已安装
  - yum list installed | grep mysql
- 已安装 检查版本 版本不是所需 删除
  - yum -y remove mysql-libs.x86_64
- 安装rpm源
  - wget dev.mysql.com/get/mysql-community-release-el6-5.noarch.rpm
- 安装下好的rpm文件
  - yum install mysql-community-release-el6-5.noarch.rpm -y
  - 会在/etc/yum.repos.d 生成两个 mysql-***.repo 文件
    - vi mysql-community.repo
    - 默认5.6 的enable=1，将5.7的改为1，5.6改为0
  - 更换版本 可通过1 2步骤删除
- 安装mysql
  - yum install mysql-community-server -y

## linux-安装包

- 下载
  1. 官网找到下载页面
  2. 找到 [MySQL Community (GPL) Downloads »](https://dev.mysql.com/downloads/)
  3. 点击 MySql Community Server
  4. 选择系统 找到最大的两个包 根据cpu架构进行下载
  5. 点击 **[No thanks, just start my download.](https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.23-1.el8.x86_64.rpm-bundle.tar)**
  6. 迅雷下载更快哦
- 安装
  1. 解压到文件夹 tar -xf *.tar -C /folder
  2. 到解压目录下 执行 
     - yum install -y /folder/mysql-community-*
  3. Complete 完成

# 关于MySQL编码

使用utf8mb4 代替utf8

原因：utf8只支持每个字符3个字节，二真正的utf-8每个字符最多4个字节

# 使用

## 启动

- service mysqld start
  - 5.7启动报错 
    - 临时密码 证数过期 需要更新
    - 执行 yum update -y
    - 删除 rm -rf /var/lib/mysql/*
- 临时密码： 
  - cat /var/log/mysqld.log | grep password

## 登录

-  mysql -uroot -p → 输入密码
-  mysql -uroot -p123456    --123456为密码

## 设置密码

```
5.7
set global validate_password_policy=0;
set global validate_password_length=1;
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
```

SHOW VARIABLES LIKE 'validate_password%'; 可知 8.0版本参数变了

```
8.0
set global validate_password.policy=0;
set global validate_password.length=1;
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
```

## 访问权限

```
5.7
grant all privileges on *.* to 'root'@'%' identified by '123456' with grant option;
flush privileges;
```

```
8.0

# MySQL8.0之前的版本密码加密规则：mysql_native_password，
# MySQL8.0密码加密规则：caching_sha2_password
# 若不修改加密规则 则连接报错 caching_sha2_password

# 修改加密规则
ALTER USER 'root'@'localhost' IDENTIFIED BY '捏密码' PASSWORD EXPIRE NEVER;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '捏密码';
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '新的密码'

## 设置远程访问
use mysql
update user set host ='%' where user = 'root';
flush privileges;
GRANT ALL ON *.* TO 'root'@'%';
flush privileges;
```

## 开放端口

- centos8：firewall-cmd --zone=public --add-port=3306/tcp --permanent

# 架构

![](MYSQL\架构图.png)

1. 连接器
   1. 用户 权限验证
   2. show processlist    查看当前有多少连接
   3. wait_timeout 默认 没动静 8小时后 断开连接
   4. 连接分类
      1. 长连接：推荐，但要周期性断开
      2. 短连接
2. 查询缓存 8.0版本之后移除
   1. 之前执行过的sql及其结果 可能以k，v性质存储再缓存中
   2. sql语句中开启
   3. 不推荐
      1. 表更新，缓存清空
      2. 缓存对应新更新的数据命中率低，两次结果同样的情况效率低
3. 分析器
   1. 词法分析
   2. 语法分析
   3. → AST抽象语法树：一条sql识别成一堆token
   4. → 关键字拆分成token
   5. apache.shardingsphere.org → 文档 → 概念 → 数据分片 → 内部刨析 → 解析引擎
   6. calcite.apache.org
   7. 百度 antlr
4. 优化器
   1. 决定用哪个索引
   2. 决定表连接顺序
   3. 执行方式
      1. RBO：基于规则的优化 rule
      2. CBO：基于成本的优化 cast 偏多
5. 执行器

# 日志

启动日志 默认 /var/log/mysqld.log

## binlog

mysql server端日志，所有引擎都有，默认关闭 

可做数据恢复

查看： show variables like 'log_bin'; --8.0默认开启

开启：

![](MYSQL\binlog write.png)

- 写redolog 会写入磁盘 prepare状态
- 一但事务开启 redolog一直在写
- commit redolog该状态
- 文件日志用事务id、lsn(log sequence number)关联

## redolog

innodb存储引擎日志 保证数据持久化操作

WAL： write ahead log 预写日志 ，innodb为redolog

![](MYSQL\innoDB Engine.png)

![](MYSQL\innoDB write.png)

固定大小，循环写的过程。下图checkpoint--Wtire pos之间是需要写到磁盘的数据

![](MYSQL\innoDB redolog.png)



## undolog 

innoDB引擎日志 回滚日志 保证原子性 MVCC 

# 存储引擎

```
show engines;
FEDERATED 集群性质
MEMORY
InnoDB
PERFORMANCE_SCHEMA 监控
MyISAM
MRG_MYISAM
BLACKHOLE 黑洞
CSV
ARCHIVE 归档
```



|              |           MyISAM           |           InnoDB            |
| :----------: | :------------------------: | :-------------------------: |
|   索引类型   | 非聚簇索引（索引数据分离） |  聚簇索引（索引数据合并）   |
|   支持事务   |             ×              |              √              |
|   支持表锁   |             √              |              √              |
|   支持行锁   |             ×              |              √              |
|   支持外键   |             ×              |              √              |
| 支持全文索引 |             √              |          √（5.6+）          |
|   适合操作   |         大量select         | 大量 insert、delete、update |

# 索引

- xxx force index;  -- 强制索引
- optimize table tbname; -- 优化表

## 基础

- 局部性原理
- 磁盘预读 一般为页（page 多数为4k）的整数倍

## 分类

**不同的存储引擎，数据文件和素引文件存放的位置是不同的，因此有了分类：**

- 聚簇素引：数据和文件放在一起  innodb
  - .frm 存放表结构
  - .ibd 存放数据文件和索引文件
  - 注意：mysq的 innodb存储引擎默认情况下会把所有的数据文件放到表空间中,不会为每一个单独的表保存一份数据文件,如果需要将每一个表单独使用文件保存,设置如下属性
    - set global innodb_file_per_table=on      (show variables like '%per_table%')
- 非局促素引：数据和索引单独一个文件 MiSAM
  - .frm：存放表结构
  - .MYI：存放素引数据
  - .MYD：存放实际数据

## 存储结构 

hash表 → 多叉树 → 二叉树 → AVL树 → 红黑树 → B树 → B+树

在树的结构中，根节点左边数据小与根节点，右边数据大于根节点

磁盘分块4k 数据和索引是在一个一个磁盘块上存储的

1. hash表：

   - 适合场景：等值查询
   - 范围查询浪费时间，数据是无序的，需挨个遍历（企业中大部分查询是范围查询）
   - 使用的时候，全部数据加载到内存，消耗内存空间

2. 二叉树：二分查找。容易一边过长，变成链表，增加磁盘IO次数

   1. AVL树：插入过慢，因为数据量大则会有过多次数树的旋转
   2. 红黑树：AVL树变化出来的，左右最低子树相差2倍之内；牺牲部分查询性能，提高插入性能，

   - 二叉树及其变种都不适合 数的深度无法控制 插入性能低

3. 多叉树：从左到右有序

   1. B树：

      - 枝节点存数据(4k)，则树节点存很少的key，行数据会占用较大的节点空间，树的深度会很大，会加大磁盘的IO次数

   2. B+树

      - 数据只放在叶子节点

      - 叶子节点之间有一个顺序的双向链表

### 引擎区别

1. innoDB    --B+ tree
   1. innoDB是通过B+Tree对主键创建索引，然后叶子节点中存储记录
      - 索引创建优先级：主键 → 唯一键 → 6位row id
   2. 如果创建索引的键为其他字段，则叶子节点中存储该记录的主键，再通过主键索引找到对应的记录，叫做回表
2. myisam
   1. 索引 数据分离 
   2. 索引文件中 叶节点存数据节点地址

## 如何建

- 数据读取流程
  - 如果建立了索引 会先读索引 再读数据 
- 数据量少不适用 因为会读2次IO
- 建议主键自增

## 分类

1. 主键索引
   1. 唯一性索引,但它必须指定为 PRIMARY KEY,每个表只能有一个主键
   2. 自增：自增锁
2. 唯一索引  不需要回表
   1. 索引列的所有值都只能现一次,即必需唯一， 值可以为空。
3. 普通索引  回表
   1. 基本的素引类型，值可以为空，没有唯一性的限制。
   2. 覆盖索引：不需要回表 
      1. 如 id-主键索引 name-普通索引
      2. name B+tree中data存的是id
      3. 所以 select * from tb where name = 'li';
         - 对比 select id from tb where name = 'li';   此sql不需要回表 查询效率更快
   3. 索引下推：回表之前数据进行筛选，删除
4. 全文索引 myisam支持 innoDB5.6之后支持
   1. ES
   2. 全文索引的索引类型为 FULLTEXT.全文索引可以在 varchar、char、text类型的列上创建
5. 组合索引 
   1. 多列值组成一个索引,有用于组合搜素(最左匹配原则)
   2. (age，name) ：可同时支持单独搜索age 和 组合搜索name+age
   3. 例 需求 name、age、name+age
      - 建两个索引 (name,age), age 。原因 age 空间小， 所以单独的索引使用age不用name

谓词下推？

## 维护

索引在插入新的值的时候,为了维护索引的有序性,必须要维护,在维护索引的时候需要需要分以下集中情况：

1. 如果插入一个比较大的值,直接插入即可,几乎没有成本
2. 如果插入的是中间的某一个值,需要逻辑上移动后续的元素,空出位置
3. 如果需要插入的数据页满了,就需要单独申请一个新的数据页,然后移动部分数据过去,叫分裂,此时性能会受影响同时空间的使用率也会降低,除了页分裂之外还包含页合并

**尽量使用自增主键作为索引**

# 执行计划

语法：explain sql;  https://dev.mysql.com/doc/refman/8.0/en/explain-output.html



- id：越大越先执行
- select_type：
- table
- partitions
- type：
  - 效率排序 system> const > ea_ref > ref > fulltext > ref_or_null > index_merge > unique_subquery > index_ subquery > range > index > ALL
  - 一般 至少达到range级别 最好到ref
- possible_keys：可能使用的索引 但实际不一定用到
- key：实际用到的索引
- key_len：索引的 长度
- ref：
- rows：估算sql查出的行数 
- filtered：
- Extra：

在企业的应用场景中，为了知道优化SQL语句的执行，需要查看SQL语句的具体执行过程，以加快SQL语句的执行效率。

​       可以使用explain+SQL语句来模拟优化器执行SQL查询语句，从而知道mysql是如何处理sql语句的。

​	   官网地址： https://dev.mysql.com/doc/refman/5.5/en/explain-output.html 

执行计划中包含的信息

|    Column     |                    Meaning                     |
| :-----------: | :--------------------------------------------: |
|    **id**     |            The `SELECT` identifier             |
|  select_type  |               The `SELECT` type                |
|     table     |          The table for the output row          |
|  partitions   |            The matching partitions             |
|   **type**    |                 The join type                  |
| possible_keys |         The possible indexes to choose         |
|    **key**    |           The index actually chosen            |
|    key_len    |     组合索引  The length of the chosen key     |
|      ref      |       The columns compared to the index        |
|     rows      |        Estimate of rows to be examined         |
|   filtered    | Percentage of rows filtered by table condition |
|     extra     |             Additional information             |

**id**

select查询的序列号，包含一组数字，表示查询中执行select子句或者操作表的顺序

id号分为三种情况：

​		1、如果id相同，那么执行顺序从上到下

```sql
explain select * from emp e join dept d on e.deptno = d.deptno join salgrade sg on e.sal between sg.losal and sg.hisal;
```

​		2、如果id不同，如果是子查询，id的序号会递增，id值越大优先级越高，越先被执行

```sql
explain select * from emp e where e.deptno in (select d.deptno from dept d where d.dname = 'SALES');
```

​		3、id相同和不同的，同时存在：相同的可以认为是一组，从上往下顺序执行，在所有组中，id值越大，优先级越高，越先执行

```sql
explain select * from emp e join dept d on e.deptno = d.deptno join salgrade sg on e.sal between sg.losal and sg.hisal where e.deptno in (select d.deptno from dept d where d.dname = 'SALES');
```

**select_type**

主要用来分辨查询的类型，是普通查询还是联合查询还是子查询

| `select_type` Value  |                           Meaning                            |
| :------------------: | :----------------------------------------------------------: |
|        SIMPLE        |        Simple SELECT (not using UNION or subqueries)         |
|       PRIMARY        |                       Outermost SELECT                       |
|        UNION         |         Second or later SELECT statement in a UNION          |
|   DEPENDENT UNION    | Second or later SELECT statement in a UNION, dependent on outer query |
|     UNION RESULT     |                      Result of a UNION.                      |
|       SUBQUERY       |                   First SELECT in subquery                   |
|  DEPENDENT SUBQUERY  |      First SELECT in subquery, dependent on outer query      |
|       DERIVED        |                        Derived table                         |
| UNCACHEABLE SUBQUERY | A subquery for which the result cannot be cached and must be re-evaluated for each row of the outer query |
|  UNCACHEABLE UNION   | The second or later select in a UNION that belongs to an uncacheable subquery (see UNCACHEABLE SUBQUERY) |

```sql
--sample:简单的查询，不包含子查询和union
explain select * from emp;

--primary:查询中若包含任何复杂的子查询，最外层查询则被标记为Primary
explain select staname,ename supname from (select ename staname,mgr from emp) t join emp on t.mgr=emp.empno ;

--union:若第二个select出现在union之后，则被标记为union
explain select * from emp where deptno = 10 union select * from emp where sal >2000;

--dependent union:跟union类似，此处的depentent表示union或union all联合而成的结果会受外部表影响
explain select * from emp e where e.empno  in ( select empno from emp where deptno = 10 union select empno from emp where sal >2000)

--union result:从union表获取结果的select
explain select * from emp where deptno = 10 union select * from emp where sal >2000;

--subquery:在select或者where列表中包含子查询
explain select * from emp where sal > (select avg(sal) from emp) ;

--dependent subquery:subquery的子查询要受到外部表查询的影响
explain select * from emp e where e.deptno in (select distinct deptno from dept);

--DERIVED: from子句中出现的子查询，也叫做派生类，
explain select staname,ename supname from (select ename staname,mgr from emp) t join emp on t.mgr=emp.empno ;

--UNCACHEABLE SUBQUERY：表示使用子查询的结果不能被缓存
 explain select * from emp where empno = (select empno from emp where deptno=@@sort_buffer_size);
 
--uncacheable union:表示union的查询结果不能被缓存：sql语句未验证
```

**table**

对应行正在访问哪一个表，表名或者别名，可能是临时表或者union合并结果集
		1、如果是具体的表名，则表明从实际的物理表中获取数据，当然也可以是表的别名

​		2、表名是derivedN的形式，表示使用了id为N的查询产生的衍生表

​		3、当有union result的时候，表名是union n1,n2等的形式，n1,n2表示参与union的id

**type**

type显示的是访问类型，访问类型表示我是以何种方式去访问我们的数据，最容易想的是全表扫描，直接暴力的遍历一张表去寻找需要的数据，效率非常低下，访问的类型有很多，效率从最好到最坏依次是：

system > const > eq_ref > ref > fulltext > ref_or_null > index_merge > unique_subquery > index_subquery > range > index > ALL 

一般情况下，得保证查询至少达到range级别，最好能达到ref

```sql
--all:全表扫描，一般情况下出现这样的sql语句而且数据量比较大的话那么就需要进行优化。
explain select * from emp;

--index：全索引扫描这个比all的效率要好，主要有两种情况，一种是当前的查询时覆盖索引，即我们需要的数据在索引中就可以索取，或者是使用了索引进行排序，这样就避免数据的重排序
explain  select empno from emp;

--range：表示利用索引查询的时候限制了范围，在指定范围内进行查询，这样避免了index的全索引扫描，适用的操作符： =, <>, >, >=, <, <=, IS NULL, BETWEEN, LIKE, or IN() 
explain select * from emp where empno between 7000 and 7500;

--index_subquery：利用索引来关联子查询，不再扫描全表
explain select * from emp where emp.job in (select job from t_job);

--unique_subquery:该连接类型类似与index_subquery,使用的是唯一索引
 explain select * from emp e where e.deptno in (select distinct deptno from dept);
 
--index_merge：在查询过程中需要多个索引组合使用，没有模拟出来

--ref_or_null：对于某个字段即需要关联条件，也需要null值的情况下，查询优化器会选择这种访问方式
explain select * from emp e where  e.mgr is null or e.mgr=7369;

--ref：使用了非唯一性索引进行数据的查找
 create index idx_3 on emp(deptno);
 explain select * from emp e,dept d where e.deptno =d.deptno;

--eq_ref ：使用唯一性索引进行数据查找
explain select * from emp,emp2 where emp.empno = emp2.empno;

--const：这个表至多有一个匹配行，
explain select * from emp where empno = 7369;
 
--system：表只有一行记录（等于系统表），这是const类型的特例，平时不会出现
```

 **possible_keys** 

​        显示可能应用在这张表中的索引，一个或多个，查询涉及到的字段上若存在索引，则该索引将被列出，但不一定被查询实际使用

```sql
explain select * from emp,dept where emp.deptno = dept.deptno and emp.deptno = 10;
```

**key**

​		实际使用的索引，如果为null，则没有使用索引，查询中若使用了覆盖索引，则该索引和查询的select字段重叠。

```sql
explain select * from emp,dept where emp.deptno = dept.deptno and emp.deptno = 10;
```

**key_len**

表示索引中使用的字节数，可以通过key_len计算查询中使用的索引长度，在不损失精度的情况下长度越短越好。

```sql
explain select * from emp,dept where emp.deptno = dept.deptno and emp.deptno = 10;
```

**ref**

显示索引的哪一列被使用了，如果可能的话，是一个常数

```sql
explain select * from emp,dept where emp.deptno = dept.deptno and emp.deptno = 10;
```

**rows**

根据表的统计信息及索引使用情况，大致估算出找出所需记录需要读取的行数，此参数很重要，直接反应的sql找了多少数据，在完成目的的情况下越少越好

```sql
explain select * from emp;
```

**extra**

包含额外的信息。

```sql
--using filesort:说明mysql无法利用索引进行排序，只能利用排序算法进行排序，会消耗额外的位置
explain select * from emp order by sal;

--using temporary:建立临时表来保存中间结果，查询完成之后把临时表删除
explain select ename,count(*) from emp where deptno = 10 group by ename;

--using index:这个表示当前的查询时覆盖索引的，直接从索引中读取数据，而不用访问数据表。如果同时出现using where 表名索引被用来执行索引键值的查找，如果没有，表面索引被用来读取数据，而不是真的查找
explain select deptno,count(*) from emp group by deptno limit 10;

--using where:使用where进行条件过滤
explain select * from t_user where id = 1;

--using join buffer:使用连接缓存，情况没有模拟出来

--impossible where：where语句的结果总是false
explain select * from emp where empno = 7469;
```



# 事务

## 自动提交

- 查看自动提交：select @@autocommit;  1：开启  	0：关闭
- 关闭自动提交
  - 当前会话：set autocommit=0;   
  - 全局：set global autocommit=0;   

## 隔离级别

- 设置隔离级别语句：
  - set session transaction isolation level read committed;
  - set global transaction isolation level read committed;  -- 一般使用这句

级别越高 数据越安全

不同隔离级别产生的问题

| 隔离级别 | 脏读 | 不可重复度 | 幻读 | 设置             |
| -------- | ---- | ---------- | ---- | ---------------- |
| 读未提交 | √    | √          | √    | read uncommitted |
| 读已提交 | ×    | √          | √    | reaad commited   |
| 可重复读 | ×    | ×          | √    | repeatable read  |
| 序列化   | ×    | ×          | ×    | Serializable     |

- **脏读**：修改的数据未提交就被读出来了
- **不可重复读**：同一事务 两次查询（之间有另一个事务提交了数据）结果不一致
- **幻读**：插入的数据未提交就被读出来了

## 传播特性



# 锁

**协调多进程或多线程并发访问某一资源的机制**



不同存储引擎支持不同的锁机制。

- 表锁：大量查询适合用，不会死锁。myisam、memory、innoDB支持。
- 行锁：会死锁。innoDB支持。

- OLTP：在线事务，实时要求高
- OLAP：历史分析，未来决策产生影响。

## MyISAM表锁

```sql
-- 创建表时需要指定引擎
CREATE TABLE 'mylock'(***) ENGINE=MyISAM DEFAULT CHARSET=utf8
```

读阻塞写，不阻塞读

写阻塞读

实际操作不需要显示枷锁，MyISAM会自动加锁。

加锁 lock table 表名 read locak; 则read lock后，加上local字段，其他线程可以插入，但更新会阻塞。此时 当前session concurrent_insert=AUTO。

 可以通过检查**table_locks_waited**和**table_locks_immediate**状态变量来分析系统上的表锁定争夺： 

```sql
show status like 'table_locks%';
```



## innoDB行锁

可以通过检查InnoDB_row_lock状态变量来分析系统上的行锁的争夺情况： 

```sql
show status like 'innodb_row_lock%';
```

- 排他锁
  - select ... for update
- 共享锁
  - select ... lock in  share mode
- 行锁必须通过**索引条件**检索数据，否则还是使用表锁，因为行锁是通过给**索引值加锁**来实现的

## 查看

```
show engine innodb status\G;  -- 查看锁的信息
show variables like 'innodb_s%';
	innodb_status_output_locks 设置为 on 才能看到详细的执行过程
set global innodb_status_output_locks='on';
```

示例：

```
set autocommit=0;
begin;
select * from tbname fro update;
show engine innodb status\G;
-- 查看 TRANSACTIONS 部分

---TRANSACTION 4431, ACTIVE 110 sec
-- 三个行锁
2 lock struct(s), heap size 1136, 3 row lock(s)  
MySQL thread id 8078, OS thread handle 140018238723840, query id 2469891 localhost root starting
show engine innodb status
Trx read view will not see trx with id >= 4431, sees < 4431
-- IX：意向排他锁
TABLE LOCK table `springcloud`.`users` trx id 4431 lock mode IX 
-- X：临建锁（排他锁一种）
RECORD LOCKS space id 6 page no 4 n bits 72 index PRIMARY of table `springcloud`.`users` trx id 4431 lock_mode X
Record lock, heap no 1 PHYSICAL RECORD: n_fields 1; compact format; info bits 0
 0: len 8; hex 73757072656d756d; asc supremum;;

Record lock, heap no 2 PHYSICAL RECORD: n_fields 5; compact format; info bits 0
 0: len 6; hex 6c697579616f; asc liuyao;;
 1: len 6; hex 000000001117; asc       ;;
 2: len 7; hex 010000016d04f1; asc     m  ;;
 3: len 6; hex 313233343536; asc 123456;;
 4: len 1; hex 81; asc  ;;

Record lock, heap no 3 PHYSICAL RECORD: n_fields 5; compact format; info bits 0
 0: len 5; hex 7869736869; asc xishi;;
 1: len 6; hex 0000000006a7; asc       ;;
 2: len 7; hex 82000000b6011f; asc        ;;
 3: len 30; hex 24326124313024324f3954494a7171565364356a6b514356727231424f46; asc $2a$10$2O9TIJqqVSd5jkQCVrr1BOF; (total 60 bytes);
 4: len 1; hex 81; asc  ;;
```



# 集群

## 延时问题

5.7+，MySQL MST并行复制技术，永久解决复制延时问题。

## 一主一从 复制

1. 主服务器配置

```sh
#修改配置文件，执行以下命令打开mysql配置文件
vi /etc/my.cnf
#在mysqld模块中添加如下配置信息
log-bin=master-bin #二进制文件名称
binlog-format=ROW  #二进制日志格式，有row、statement、mixed三种格式，row指的是把改变的内容复制过去，而不是把命令在从服务器上执行一遍，statement指的是在主服务器上执行的SQL语句，在从服务器上执行同样的语句。MySQL默认采用基于语句的复制，效率比较高。mixed指的是默认采用基于语句的复制，一旦发现基于语句的无法精确的复制时，就会采用基于行的复制。
server-id=1		   #要求各个服务器的id必须不一样
binlog-do-db=msb   #同步的数据库名称
```

```sql
-- 登录mysql 

-- 授权
-- 5.7
set global validate_password_policy=0;
set global validate_password_length=1;
grant replication slave on *.* to 'root'@'%' identified by '123456';
-- 8.0
set global validate_password.policy=0;
set global validate_password.length=1;
grant replication slave on *.* to 'root'@'%'; 

-- 刷新权限
flush privileges;

-- 重启mysql
service mysqld restart
```

2. 从服务器配置

```shell
#修改配置文件，执行以下命令打开mysql配置文件
vi /etc/my.cnf
#在mysqld模块中添加如下配置信息
log-bin=master-bin	#二进制文件的名称
binlog-format=ROW	#二进制文件的格式
server-id=2			#服务器的id

## 重启mysql
service mysqld restart
```

```sql
-- 登录主服务器 --

-- 主服务器执行命令 查看一些参数
show master status;

-- 登录从服务器 --

-- 从服务器执行命令
-- 连接主服务器 相关参数为主服务器show master status命令的结果
-- 156表示初始化占用的字节数 要从这个位置开始读
change master to master_host='192.168.1.161',master_user='root',master_password='123456',master_port=3306,master_log_file='master-bin.000001',master_log_pos=156;
-- 启动slave
start slave
-- 查看slave的状态 (注意没有分号) G标识按照某些格式输出
show slave status\G
    -- Slave_IO_Running: Yes -- 只有这两个都是Yes才表示主从复制成功
    -- Slave_SQL_Running: Yes

```

## 读写分离

### Mysql proxy

不推荐使用

1. 配置过程

   ```
   #1、下载mysql-proxy
   https://downloads.mysql.com/archives/proxy/#downloads
   #2、上传软件到proxy的机器
   直接通过xftp进行上传
   #3、解压安装包
   tar -zxvf mysql-proxy-0.8.5-linux-glibc2.3-x86-64bit.tar.gz
   #4、修改解压后的目录
   mv mysql-proxy-0.8.5-linux-glibc2.3-x86-64bit mysql-proxy
   #5、进入mysql-proxy的目录
   cd mysql-proxy
   #6、创建目录
   mkdir conf
   mkdir logs
   #7、添加环境变量
   #打开/etc/profile文件
   vi /etc/profile
   #在文件的最后面添加一下命令
   export PATH=$PATH:/root/mysql-proxy/bin
   #8、执行命令让环境变量生效
   source /etc/profile
   #9、进入conf目录，创建文件并添加一下内容
   vi mysql-proxy.conf
   添加内容
   [mysql-proxy]
   user=root
   proxy-address=192.168.85.14:4040
   proxy-backend-addresses=192.168.85.11:3306
   proxy-read-only-backend-addresses=192.168.85.12:3306
   proxy-lua-script=/root/mysql-proxy/share/doc/mysql-proxy/rw-splitting.lua
   log-file=/root/mysql-proxy/logs/mysql-proxy.log
   log-level=debug
   daemon=true
   #10、开启mysql-proxy
   mysql-proxy --defaults-file=/root/mysql-proxy/conf/mysql-proxy.conf
   #11、查看是否安装成功，打开日志文件
   cd /root/mysql-proxy/logs
   tail -100 mysql-proxy.log
   #内容如下：表示安装成功
   2019-10-11 21:49:41: (debug) max open file-descriptors = 1024
   2019-10-11 21:49:41: (message) proxy listening on port 192.168.85.14:4040
   2019-10-11 21:49:41: (message) added read/write backend: 192.168.85.11:3306
   2019-10-11 21:49:41: (message) added read-only backend: 192.168.85.12:3306
   2019-10-11 21:49:41: (debug) now running as user: root (0/0)
   ```

2. 进行连接

   ```
   #mysql的命令行会出现无法连接的情况，所以建议使用客户端
   mysql -uroot -p123 -h192.168.85.14 -P 4040
   ```

3. 查看

   ```
   show databases;
   ```

### amoeba

阿里开源框架

### mycat 

生产中使用



# 进度

基础完成

优化 

0.0 

00:00:00   



