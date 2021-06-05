# 综述

ORM 对象关系映射

# Bean Factory

## FactoryBean

定义bean对象 创建比较复杂的对象

创建bean对象 交给spring管理

## BeanFactory

获取实例的工厂 包括getBean containsBean等方法







# AOP

## 需要的包

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.3.5</version>
</dependency>
<!-- AOP context 默认有 -->
<!--        <dependency>-->
<!--            <groupId>org.springframework</groupId>-->
<!--            <artifactId>spring-aop</artifactId>-->
<!--            <version>5.3.5</version>-->
<!--        </dependency>-->
<!-- 动态代理 -->
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>3.3.0</version>
</dependency>
<!-- aop 扩展 -->
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.9.6</version>
</dependency>
```

## 注解方式

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
            http://www.springframework.org/schema/beans/spring-beans.xsd
            http://www.springframework.org/schema/context
            http://www.springframework.org/schema/context/spring-context.xsd
            http://www.springframework.org/schema/aop
            http://www.springframework.org/schema/aop/spring-aop.xsd"
>
    <!-- 开启包扫描 -->
    <context:component-scan base-package="com.liuyao.spcld.springall"></context:component-scan>
    <!-- 开启aop注解功能 -->
    <aop:aspectj-autoproxy></aop:aspectj-autoproxy>
</beans>
```

调用

```java
ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("aop.xml");
MyCalculator calculator = ctx.getBean(MyCalculator.class);

System.out.println(calculator.add(12,14));
```

切入点

```java

@Aspect
@Component
@Order(1) // 层级 数越小 越在外层
public class LogUtil {

    /**
     * 执行顺序
     *  @Around {
     *      @Before
     *      try{
     *          service()
     *          @AfterReturning
     *      } catch() {
     *          @AfterThrowing
     *      }
     *      @After
     *      return
     *  }
     *
     * 通配符
     *  *
     *      匹配一个或多个
     *      M*Calculator.add(Integer, Integer)
     *      MyCalculator.*(Integer, Integer)
     *      MyCalculator.add(Integer, *)
     *      只能匹配一层路径
     *      spcld.springall.*.MyCalculator.add(Integer, Integer)
     *      spcld.*.*.MyCalculator.add(Integer, Integer)
     *      不能匹配访问修饰符，访问修饰符不确定可不写
     *      返回值可以匹配
     *  ..
     *      匹配任何参数个数
     *      MyCalculator.add(..)
     *      匹配多层路径
     *      spcld..MyCalculator.add(Integer, Integer)
     *
     * 最偷懒的方式
     *  execution(* *(..))  --匹配所有
     *  execution(* *.*(..))  --匹配所有
     *  execution(* com..*(..))
     *  *开头 可以代替所有
     *
     * 逻辑操作
     *  execution(xxx) && execution(xxx) 多个同时满足
     *  execution(xxx) || execution(xxx) 多个满足一个
     *  !execution(xxx)  取反
     *
     */

    // 抽象
    @Pointcut("execution(* com.liuyao.spcld.springall.service.MyCalculator.*(Integer, Integer))")
    public void myPointCut() { }
    @Pointcut("execution(* *(..))")
    public void myPointCut1() { }

    /**
     * 参数严格限制
     *  JoinPoint 必须是第一个
     * @param jp
     */
    @Before("myPointCut()")
    private void before(JoinPoint jp) {
        // 获取方法签名
        Signature sign = jp.getSignature();
        System.out.println("@Before → " + sign.getName() + "方法开始执行，参数是：" + Arrays.asList(jp.getArgs()));
    }

    @After("myPointCut()")
    public void after(JoinPoint jp) { }

    @AfterThrowing(throwing = "e",
            value = "execution(public Integer com.liuyao.spcld.springall.service.MyCalculator.*(Integer, Integer))")
    public void error(JoinPoint jp, Exception e) { }

    @AfterReturning(returning = "result",
            value = "execution(public Integer com.liuyao.spcld.springall.service.MyCalculator.*(Integer, Integer))")
    public void finaly(JoinPoint jp, Object result) { }

    @Around("myPointCut()")
    public Object around(ProceedingJoinPoint pjp) {
        final Signature sign = pjp.getSignature();
        final Object[] args = pjp.getArgs();
        Object result = null;
        try {
            System.out.println("@Around → " + sign.getName() + "开始执行, 参数为：" + args);
            // 通过反射调用方法
            result = pjp.proceed(args);
            result = 100; // 修改 代理后的 返回值
            System.out.println("@Around → " + sign.getName() + "执行结束");
        } catch (Throwable throwable) {
            System.out.println("@Around → " + sign.getName() + "执行异常：" + throwable.getMessage());
        } finally {
        }
        System.out.println("@Around → " + sign.getName() + "方法返回,结果：" + result);
        return result;
    }
}
```



## 配置文件方式

调用

```java
ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("aop.xml");
MyCalculator calculator = ctx.getBean(MyCalculator.class);
calculator.div(12,0);
System.out.println(calculator.getClass());
```

配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
            http://www.springframework.org/schema/beans/spring-beans.xsd
            http://www.springframework.org/schema/aop
            http://www.springframework.org/schema/aop/spring-aop.xsd"
>

    <bean id="logUtil" class="com.liuyao.spcld.springall.util.LogUtil"></bean>
    <bean id="myAop" class="com.liuyao.spcld.springall.util.MyAop"></bean>
    <bean id="myCalculator" class="com.liuyao.spcld.springall.service.MyCalculator"></bean>

    <aop:config>
        <aop:pointcut id="globalPointCut" expression="execution(* com.liuyao.spcld.springall.service.MyCalculator.*(Integer, Integer))"/>
        <aop:aspect ref="logUtil">
            <!-- 抽象 公共 切入表达式 -->
            <aop:pointcut id="abPointCut" expression="execution(* com.liuyao.spcld.springall.service.MyCalculator.*(Integer, Integer))"/>
            <aop:before method="before" pointcut-ref="abPointCut"></aop:before>
            <aop:after method="after" pointcut-ref="abPointCut"></aop:after>
            <aop:after-returning method="afterReturning" returning="result" pointcut-ref="abPointCut"></aop:after-returning>
            <aop:after-throwing method="error" throwing="e" pointcut-ref="abPointCut"></aop:after-throwing>
            <aop:around method="around" pointcut-ref="abPointCut"></aop:around>
        </aop:aspect>
        <aop:aspect ref="myAop">
            <aop:before method="before" pointcut-ref="abPointCut"></aop:before>
            <aop:after method="after" pointcut="execution(* com.liuyao.spcld.springall.service.MyCalculator.*(Integer, Integer))"></aop:after>
            <aop:after-returning method="afterReturning" returning="result" pointcut-ref="globalPointCut"></aop:after-returning>
            <aop:after-throwing method="error" throwing="e" pointcut="execution(* com.liuyao.spcld.springall.service.MyCalculator.*(Integer, Integer))"></aop:after-throwing>
            <aop:around method="around" pointcut="execution(* com.liuyao.spcld.springall.service.MyCalculator.*(Integer, Integer))"></aop:around>
        </aop:aspect>
    </aop:config>
</beans>
```

# 事务

- 编程式事务：逻辑事务
- 声明式事务

## 声明式事务

配置文件方式

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
            http://www.springframework.org/schema/beans/spring-beans.xsd
            http://www.springframework.org/schema/context
            http://www.springframework.org/schema/context/spring-context.xsd
            http://www.springframework.org/schema/tx
            http://www.springframework.org/schema/tx/spring-tx.xsd
            http://www.springframework.org/schema/aop
            https://www.springframework.org/schema/aop/spring-aop.xsd
">

    <context:property-placeholder location="classpath:db.properties"></context:property-placeholder>

    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="username" value="${jdbc.username}"></property>
        <property name="password" value="${jdbc.password}"></property>
        <property name="url" value="${jdbc.url}"></property>
        <property name="driverClassName" value="${jdbc.driverName}"></property>
    </bean>
    <!-- JdbcTemplate注册为bean对象 -->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!-- 事务的配置 -->
    <!-- 声明一个事务管理器 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <aop:config>
        <aop:pointcut id="txPointcut" expression="execution(* com.liuyao.spcld.springall.service.*.*(..))" />
        <!-- 事务建议 -->
        <aop:advisor advice-ref="myAdvice" pointcut-ref="txPointcut"></aop:advisor>
    </aop:config>
    <tx:advice id="myAdvice" transaction-manager="transactionManager">
        <!-- 配置事务的属性 -->
        <tx:attributes>
            <!-- 配置哪些方法上添加事务 -->
            <tx:method name="addBook" propagation="REQUIRED" read-only="false" isolation="DEFAULT"/>
            <tx:method name="updatePrice" propagation="REQUIRED"></tx:method>
            <tx:method name="update*" propagation="REQUIRED"></tx:method>
        </tx:attributes>
    </tx:advice>
</beans>
```

注解方式

```
@Transactional {
	propagation // 传播特性 不同事务之间执行的关系 事务能不能套事务
	isolation 隔离级别 4中 引发不同的数据错乱问题
        DEFAULT(-1),
        READ_UNCOMMITTED(1),
        READ_COMMITTED(2),
        REPEATABLE_READ(4),
        SERIALIZABLE(8);	
	timeout //超时回滚 s
	readonly // 只读事务 true-数据修改不允许，否则抛异常 查询过程数据被修改，前后不一致
	noRollBackFor //设置哪些异常不回滚
	noRollBackForClassName //设置哪些异常不回滚 两种设置方式
	rollbackFor // 设置哪些异常回滚 
	rollbackForClassName // 设置哪些异常回滚 两种设置方式
}
```

spring事务传播特性：当一个事务A被另一个事务B调用时，事务A该如何进行。

- 不论外层是否捕获异常，spring的AOP都已经执行了，事务的传播行为已经确定。是否捕获异常的区别 只在于后续代码是否执行而已
- 外层与内层在同一类中，就是方法的调用，跟传播就没关系了

| 传播属性(A为内层事务) | 描述                                                         | 说明 基本正确，但需确认                                      |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| A = REQUIRED          | 如果有事务在运行，当前的方法就在这个事务内运行，<br/>否则，就启动一个新的事务，并在自己的事务内运行 | 外层**有**事务，**用外层**事务<br />外层**没**事务，**用自己**事务<br />外层异常，都回滚<br />外层捕获A的异常，外层都回滚<br />所有事务都依托于外层事务 |
| A = REQUIRED_NEW      | 当前的方法必须启动新事务，并在它自己的事务内运行.<br/>如果有事务正在运行，应该将它挂起 | 自己控制，外层事务对自己无效<br />外层捕获A的异常，外层调用的其他事务不回滚 |
| A = SUPPORTS          | 如果有事务在运行，当前的方法就在这个事务内运行.否则它可以不运行在事务中. | 是否有事务，全由外层事务控制                                 |
| A = NOT_SUPPORTED     | 当前的方法不应该运行在事务中.如果有运行的事务，将它挂起(等着) | 外层有事务，不会回滚                                         |
| A = MANDATORY         | 当前的方法必须运行在事务内部，如果没有正在运行的事务，就抛出异常 | 外层必须有事务，若没有则报错                                 |
| A = NEVER             | 当前的方法不应该运行在事务中，如果有运行的事务，就抛出异常   | 外层有事务 报错                                              |
| A = NESTED            | 如果有事务在运行，当前的方法就应该在这个事务的嵌套事务内运行，<br/>否则，就启动一个新的事务，并在它自己的事务内运行. | 与REQUIRED差不多<br />外层捕获A的异常，只有A回滚             |

