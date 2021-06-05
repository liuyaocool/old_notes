# JVM

## 下载

jdk的开源主要体现openjdk项目上，下面简单介绍一下jdk及其子项目hotspot的源码下载方式。

1. 首先我们进入网址：[http://hg.openjdk.java.net](http://hg.openjdk.java.net/)，这个网址下面列出了所有开源的openjdk项目，从中我们可以看到jdk项目。
2. 然后我们以jdk8u为例说明，该页面下列出了很多个版本的jdk8源码，读者可根据需要下载相应的版本，找到hotspot进入
3. 点击左侧 browse，就可以看到源码目录了
4. 最后点击zip，就可以下载源码的压缩包了。jdk方法相同

# JDK

## rt.jar

安装完JDK后，%JAVA_HOME% /jdk下src.zip对应rt.jar源码，但sun包下的文件不存在，也就是说sun包下的java源码并没有打包到src.zip中。

到 http://download.java.net/openjdk/jdk7/ 下载对应OpenJDK源码。

在\openjdk\jdk\src\share\classes 目录即为rt.jar源码，此文件夹源代码完整。