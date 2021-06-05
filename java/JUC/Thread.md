# synchronized 

```java
final Object lock = new Object();
synchronized(lock) {
    
}
lock.wait(); // 线程等待 阻塞 释放锁
lock.notify(); // 唤醒线程 不释放锁
sleep(); // 不释放锁
```

# volatile

禁止指令重排序

保证线程可见性

# 并行 并发

- 并发：concurrent，任务提交，好多任务同时涌过来
- 并行：parallel，任务执行，多个任务同时进行(多核CPU)
- 并行是并发的子集

# JUC

## atomic包-CAS

- cas 不一定比synchronized 快

  ```
  synchronized long c
  AtomicLong // CAS 无锁
  LongAdder // 分段锁    超高并发 最快 
  ```

## lock-AQS

### VarHandle

- jdk1.9+
- o 指向 对象 ，VarHandle 也指向对象的引用
- 普通属性原子操作
- 比反射快：反射会先做检查 VarHandle不需要 
  - 直接操作二进制码

```java
public class A {
    int x = 8;
    private static VarHandle handle;
    static {
        try {
            handle = MethodHandles.lookup()
                .findVarHandle(A.class, "x", int.class);
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        A t = new A();
        //plain read / write
        System.out.println((int)handle.get(t));
        handle.set(t,9);
        System.out.println(t.x);

        handle.compareAndSet(t, 9, 10); // 原子操作 t.x=10不是原子操作
        System.out.println(t.x);

        handle.getAndAdd(t, 10);  // 原子操作 t.x+=10不是原子操作
        System.out.println(t.x);
    }
}
```



### AQS 

AbstractQueuedSynchronizer.java (CLH)

核心：

	- volatile state 跟着一个队列Node
		ReentrantLock 抢到+1 重入+1
		CountDownLatch 初始值设置
	- Node { thread } 双向链表队列 监控state
		state是0 拿到锁 
		不是0进队列 AQS.acquireQueued()
		双向是因为要考虑到前边节点状态，若取消 则跳过
		永远是头节点 获得锁
	- CAS 方式向队列加东西 （cas操作替代了锁整条链表）
	- CAS 方式抢锁

### ReentrantLock

可重入锁

1. 源码实现

   ```
   继承关系： xxxLock.Sync → AQS
   state 抢锁用的 重入一次+1
   
   lock() → Sync.acquire() => AQS.acquire() → AQS.tryAcquire() => RL重写AQS的Sync.tryAcquire() → ...
   
   Sync.tryAcquire(1) {
   	if (state == 0) { cas state=1 获得锁}
   	else if( 是重入) { state++ }
   }
   AQS.acquire(1) {
   	tryAcquire(1) 
   	// Node.EXCLUSIVE 排他的队列
   	acquireQueued(addWaiter(Node.EXCLUSIVE), 1)
   	interrupt
   }
   AQS.addWaiter(node) {
   	for(;;) { 多线程 cas node 加到Node队列尾巴 }
   }
   AQS.acquireQueued(node, 1) {
   	if ishead && Sync.tryAcquire(1)  {}
   	else park()
   }
   
   ```

2. 可调用自己的加锁方法

   ```java
   class A {
   	synchronized void m1() {
   		m2(); // 此处为重入锁
   	}
   	synchronized void m2() {	}
   }
   ```

3. ReentrantLock

   ```java
   // ture 公平锁-讲究先来后到
   ReentrantLock lock = new ReentrantLock(true); 
   void m1() {
   	try {
           lock.lock();
           System.out.println("m1 ...");        
           m2(); // 重入锁
           TimeUnit.SECONDS.sleep(7);
   	} finally { lock.unlock();  }
   }
   void m2(){
       try {
           lock.lock();
           System.out.println("m2 ...");
   	} finally { lock.unlock();  }
   }
   void m3(){
       try {
           // 尝试加锁
           lock.trylock(5, TimeUnit.SECONDS);
           System.out.println("m3 ...");
   	} finally { lock.unlock();  }
   }
   void m4(){
       try {
           // 可被打断的锁
           lock.lockInterruptibly();
           System.out.println("m4 ...");
   	} catch (InterruptedException e) {
           e.printStackTrace();
       } finally { lock.unlock();  }
   }
   ```

4. ReentrantLock condition

   **本质是不同的等待队列**

   ```java
   ReentrantLock lock = new ReentrantLock(); 
   Condition consumer = lock.newCondition();
   Condition producer = lock.newCondition();
   
   final private LinkedList<T> list = new LinkedList<>();
   final private int MAX = 10;
   void produce(T t) {
       lock.lock();
       while(list.size() == MAX) {
           producer.await();
       }
       list.add(t);
       consumer.signalAll();
       lock.unlock();
   }
   T consumer() {
       lock.lock();
       while(list.size == 0) {
           consumer.await();
       }
       T res = lists.removeFirst();
       producer.signalAll();
       lock.unlock();
       return res;
   }
   ```

   

   

### CountDownlatch

```java
CountDownLatch latch = new CountDownLatch(thread.length);
latch.countDown(); // 数量-1
latch.await(); //停住
```

### CyclicBarrier

一般来说 使用 Guava RateLimiter，google 限流辅助类

```java
CyclicBarrier barrier = new CyclicBarrier(20, () -> {
	System.out.println("满20个线程 执行");
});
for(100) {
	new Thread(()-{
		barrier.await(); // 等着20个线程到达
		sout("执行");
	})
}
```

### Phaser 阶段

```java
static class PhaserPerson implements Runnable{
    
	public static void main(String[] args){
        int pnum = 5;
        phaser.bulkRegister(pnum + 2);
        for (int i = 0; i < pnum; i++) {
            new Thread(new PhaserPerson("pp" + i)).start();
        }
        new Thread(new PhaserPerson("新郎")).start();
        new Thread(new PhaserPerson("新娘")).start();
    }
    
    Phaser phaser = new Phaser(){
        @Override
        protected boolean onAdvance(int phase, int count) {
            switch (phase){ // 对应 run方法 第几次调用phaser.xxx
                case 0: sout("所有人到齐了：" + count + "人\n"); return false;
                case 1: sout("所有人吃完了：" + count + "人\n"); return false;
                case 2: sout("所有人离开了：" + count + "人\n"); return false;
                case 3: sout("婚礼结束，洞房：" + count + "人\n");return true;
                default: return true;
            }
        }
    };

    String name;
    public PhaserPerson(String name) { this.name = name; }

    public void normalEvent(String action){
        msleep(1000);
        System.out.printf("%s %s.\n", this.name, action);
        phaser.arriveAndAwaitAdvance();
    }
    public void hugLove(){
        switch (this.name){
            case "新郎":
            case "新娘":
                msleep(5000);
                System.out.printf("%s 洞房！\n", name);
                phaser.arriveAndAwaitAdvance();
                break;
            default:
//                    msleep(1000);
//                    System.out.printf("%s 回家！\n", name);
                phaser.arriveAndDeregister();
//                    phaser.register();
                break;
        }
    }
    @Override
    public void run() {
        normalEvent("到达饭店");
        normalEvent("吃完");
        normalEvent("离开饭店");
        hugLove();
    }
}
```

### ReadWriteLock

```java
// ReadWriteLock rwlock = new ReentrantReadWriteLock();
// Lock readlock = rwlock.readLock();
// Lock writelock = rwlock.writeLock();

// 升级版
StampedLock lock = new StampedLock();
Lock readlock = lock.asReadLock();
Lock writelock = lock.asWriteLock();

Runnable readr = ()->{
    try {
        readlock.lock();
        msleep(1000);
        System.out.println("read over.");
    }finally {
        readlock.unlock();
    }
};
Runnable writer = ()->{
    try {
        writelock.lock();
        msleep(1000);
        System.out.println("write over.");
    }finally {
        writelock.unlock();
    }
};
for (int i = 0; i < 18; i++) new Thread(readr).start();
for (int i = 0; i < 5; i++) new Thread(writer).start();      
```

### Semaphore 信号量

限流

```java
Semaphore s = new Semaphore(1);// 参数为几 就允许几个同时进行
// s = new Semaphore(2, true);//公平

for (int i = 0; i < 2; i++) {
    new Thread(()->{
        try {
            s.acquire();//没抢到的阻塞在这
            msleep(2000);
            log("end");
        } finally {
            s.release();
        }
    }, "semaphore_" + i).start();
}
```

### Exchanger

交换 两两进行

```java
Exchanger<String> exchanger = new Exchanger<>();
new Thread(()->{
    String s = "t1";
    s = exchanger.exchange(s); // 在这阻塞
    log(s);
}, "exchange_1").start();
new Thread(()->{
    String s = "t2";
    s = exchanger.exchange(s);  // 这里执行完毕 上一个线程执行
    log(s);
}, "exchange_2").start();
```

### LockSupport

```java
Thread t = new Thread(()->{
    for (int i = 0; i < 10; i++) {
        msleep(1000);
        System.out.println(i);
        if (5 == i){
            LockSupport.park(); //停止
        }
    }
});

t.start();
// LockSupport.unpark(t);

msleep(10000);
System.out.println("main thread sleep 10 seconds.");
LockSupport.unpark(t);  // 叫醒指定线程
```

# ThreadLocal

```java
ThreadLocal<String> tl = new ThreadLocal<>();	
public static void main(String[] args) {
    new Thread(()->{
        sleep(2s);
        System.out.println(tl.get());
    }).start();
    new Thread(()->{
        sleep(1s);
        tl.set(new String("t2"));
    }).start();
}
```

用途： 声明式事务 保证同一个connection

源码解读

```

```

# 引用类型

## finalize()

垃圾回收会调用 finalize() 方法 

```java
class M{
    @Override
    protected void finalize() throws Throwable {
        System.out.println("finalize");
    }
}

public static void main(String[] args) {
    M m = new M();
    m = null;
    System.gc();
    msleep(1000);
    System.out.println("finish sleep 1s");
}
```

## 强

```java
new M();
```

## 软

```java
/**
 * 软引用：内存不够用 回收
 * 用处：缓存
 * 需要配置启动参数进行测试
 *  -Xms20M -Xmx20M 分配20M堆内存(heap)
 */
public static void soft(){
    // 10M
    SoftReference<byte[]> soft = new SoftReference<>(new byte[1024*1024*10]);
    System.out.println(soft.get());
    System.gc();

    msleep(1000);
    System.out.println(soft.get());

    // 再分配数组,堆内存将装不下,这时候系统会垃圾回收,先回收一次,如果不够,会把软引用干掉
    byte[] b = new byte[1024*1024*20];
    System.out.println(soft.get());
}
```

## 弱

```java
/**
 * 弱引用
 *  只要垃圾回收 直接干掉
 *  一般用在容器里
 *  如果有一个强引用指向,只要强引用消失,就会被回收
 *
 *  WeakHashMap
 */
public static void weak(){
    WeakReference<M> m = new WeakReference<>(new M());
    System.out.println(m.get());
    System.gc();
    System.out.println(m.get());

    ThreadLocal<M> tl = new ThreadLocal<>();
    tl.set(new M());
    // 涉及到ThreadLocal中可key弱引用回收为null指向value,value不会回收,仍然会内存泄漏
    // 所以需要remove
    tl.remove();
}
```

## 虚

```java
/**
 * 虚引用
 *  写JVM的人管理堆外内存用的
 *  NIO.DirectByteBuffer 指向堆外内存
 * UNSAFE.class 可以回收堆外内存
 *
 *  -Xms20M -Xmx20M 分配20M堆内存(heap)
 */
public static void phantom(){

    // 引用队列
    final ReferenceQueue<M> QUEUE = new ReferenceQueue();
    final List LIST = new ArrayList();

    PhantomReference re = new PhantomReference(new M(), QUEUE);

    new Thread(()->{
        while (true){
            LIST.add(new byte[1024*1024]);
            msleep(1000);
            System.out.println(re.get());
        }
    }).start();

    new Thread(()->{
        while (true){
            Reference<? extends M> poll = QUEUE.poll();
            if (null != poll){
                System.out.println("-- 虚引用对象被jvm回收了 --" + poll);
            }
        }
    }).start();

    msleep(500);
}
```

# 容器

## Collection

### List

只为了装东西

- ArrayList、LinkedList、Vector(synchronized) | Stack
- CopyOnWriteList：写时复制
  - 插入时会copy一份，替换原数组
  - 读不加锁，可能会读到原来的数组

### Set  唯一

HashSet | LinkedHashSet、SortedSet | TreeSet、EnumSet、CopyOnWriteArraySet、ConcurrentSkipListSet

### Queue

为了实现任务的取和装 为了高并发做准备

```java
// Queue
add(); // 满了报异常
// 线程友好
offer(); // =List.add() 满了返回值判断是否成功 可以加延时添加
poll(); // 取并删
peek(); // 取不删
// BlockingQueue
put();
take();
// 阻塞原理：Condition.await() → LockSupport.park()
```

- Deque：

  - ArrayDeque、
  - BlockingDeque | LinkedBlockingDeque

- BlockingQueue：

  - ArrayBlockingQueue：有界
  - LinkedBlockingQueue：无界
  - PriorityBlockingQueue：
  - SynchronousQueue：手递手
    - 容量为0 不能装东西
    - put(); // 阻塞
    - take(); // 取走 put解开阻塞
    - 两个线程传数据
    - 对比Exchanger
  - TransferQueue ← LinkedTransferQueue：多人手递手
    - 容量不为0
    - 多个线程消费
    - transfer(E e); //装完 阻塞 等有人处理
    - take(); // 取走 上方法继续
  - DelayQueue：
    - 元素实现Delayed接口
    - 时间排序 短的优先执行
    - 用途：按时间进行任务调度

- PriorityQueue：排序 二叉树

- ConcurretLinkedQueue：并发链表


## Map

- HashMap | LinkedHashMap、TreeMap(红黑树)、WeakHashMap、IdentityHashMap
- ConcurrentHashMap
  - 插慢 读快 底层CAS
  - HashTable(全是synchronized锁) → Collections.synchronizedMap(new HashMap()) (全是synchronized锁) → ConsurrentHashMap (新的锁CAS)
- ConcurrentSkipListMap：跳表
- 

# ThreadPool

## 几个类

### 常用

Executor ← ExecutorService ← xxx

```java
// ExecutorService
execute(); // 马上执行
Future submit(); // 仍给线程池 异步执行

Future; // 存储结果
FutureTask; // 即是任务 又存结果
Future.get(); // 阻塞 拿到线程执行的结果

Callable; // 有返回值 类似Runable
Runnable; // 没有返回值
```

### CompletableFuture

底层ForkJoinPool

```java
// 第一种
CompletableFuture<Double>[] f = new CompletableFuture[3];
f[1] = CompletableFuture.supplyAsync(() -> c1());
f[2] = CompletableFuture.supplyAsync(() -> c2());
f[3] = CompletableFuture.supplyAsync(() -> c3());
Void join = CompletableFuture.allOf(f[1], f[2], f[3]).join(); //?

// 第二种
CompletableFuture.supplyAsync(()->c1())
    .thenApply(String::valueOf)
    .thenApply(str -> "price " + str)
    .thenAccept(System.out::println);

```

## ThreadPoolExecutor

维护了 线程集合 任务集合

* corePollSize 核心线程
* maxiunpoolSize 最大线程数
* keepAliveTime 多长时间没活干,归还OS,剩下核心线程
* unit
* blockingQueue 线程阻塞队列
* threadFactory 线程工厂
* handler 拒绝策略，超过maxiunpoolSize + workQueue启用
  *      Abort 不处理,抛异常
  *      Discard 不处理,不抛异常
  *      DiscardOldest 扔掉排队时间最久的,也就是最先加入的
  *      CallerRuns 调用者处理任务 --此处为方法调用者所在线程处理
  *      一般都是自定义策略 保存到mq DB等

估算： 线程池大小 = CPU核心数 * 期望CPU利用率(0~1) * (1 + 等待时间 / 计算时间)

再进行强力压测

## ForkJoinPool

- 分叉汇总
- 用很少的线程可以执行很多的任务(子任务)  TPE做不到先执行子任务
- CPU密集型

```java
// 任务实现接口
RecursiveAction; // 无返回值
RecursiveTask<V>; // 有返回值 调用join方法获得结果
```

有返回值示例

```java
psvm(){
    ForkJoinPool fjp = new ForkJoinPool();
    AddTaskRet task = new AddTaskRet(0, nums.length);
    fjp.execute(task);
    long result = task.join();
    System.out.println(result);
}

static int[] nums = new int[1000000];
static final int MAX_NUM = 50000;

static class AddTaskRet extends RecursiveTask<Long> {		
    private static final long serialVersionUID = 1L;
    int start, end;
    AddTaskRet(int s, int e) {
        start = s;
        end = e;
    }

    @Override
    protected Long compute() {
        if(end-start <= MAX_NUM) {
            long sum = 0L;
            for(int i=start; i<end; i++) sum += nums[i];
            return sum;
        } 
        int middle = start + (end-start)/2;

        // 分叉
        AddTaskRet subTask1 = new AddTaskRet(start, middle);
        AddTaskRet subTask2 = new AddTaskRet(middle, end);
        subTask1.fork();
        subTask2.fork();

        return subTask1.join() + subTask2.join();
    }
}
```

## Executors

线程池的工厂

- newSingleThreadExecutor
  - 任务队列
  - 生命周期管理
- newCachedThreadPool：来一个任务 起一个线程 最大Integert.MAX_VALUE
- newFixedThreadPool：固定线程数
- newScheduledThreadPool
  - scheduleAtFixedRate()
- ForkJoinPool
  - newWorkStealingPool
    - push、pop不加锁，poll加锁(多个线程来偷)
    - ![      ](img\work-steal.png)
  - ParallelStream
    - new ArrayList().parallelStream().foreach();

## 总结

ThreadPool：多个线程共享一个任务队列

FirkJoinPool：每个线程使用一个任务队列

# JMH 

Java Microbenchmark Harness 测试，由JIT的开发人员开发，后来归于openjdk

# Disruptor

- 分裂、瓦解
- 一个线程每秒处理600万订单
- 单机最快的MQ
- 性能极高，CAS，单机支持高并发
- 

无锁、高并发。使用**环形Buffer(RingBuffer)**，直接覆盖，不用清除旧数据，降低GC频率

- 维护sequence(position) 长度设置为2^n pos = num % size = num & (length - 1)

实现了基于事件的生产者消费者模式（观察者模式）

- 对比ConcurrentLinkedQueue：链表实现
- JDK没有ConcurrentArrayQueue
- Disruptor是数组实现的 环形





# other？

- 锁总线







