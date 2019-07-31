---
layout: blog
title: IBM Developer：Java 8 新特性概述
author: 唐学波、林宝川、俞顺杰
time: 2014-10-20
categories: IBM-Developer
tags: Java
---

> 原文地址：https://www.ibm.com/developerworks/cn/java/j-lo-jdk8newfeature/index.html

## 函数式接口

Java 8 引入的一个核心概念是函数式接口（Functional Interfaces）。通过在接口里面添加一个抽象方法，这些方法可以直接从接口中运行。如果一个接口定义个唯一一个抽象方法，那么这个接口就成为函数式接口。同时，引入了一个新的注解：@FunctionalInterface。可以把他它放在一个接口前，表示这个接口是一个函数式接口。这个注解是非必须的，只要接口只包含一个方法的接口，虚拟机会自动判断，不过最好在接口上使用注解 @FunctionalInterface 进行声明。在接口中添加了 @FunctionalInterface 的接口，只允许有一个抽象方法，否则编译器也会报错。

java.lang.Runnable 就是一个函数式接口。

```java
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}
```

## Lambda 表达式

函数式接口的重要属性是：我们能够使用 Lambda 实例化它们，Lambda 表达式让你能够将函数作为方法参数，或者将代码作为数据对待。Lambda 表达式的引入给开发者带来了不少优点：在 Java 8 之前，匿名内部类，监听器和事件处理器的使用都显得很冗长，代码可读性很差，Lambda 表达式的应用则使代码变得更加紧凑，可读性增强；Lambda 表达式使并行操作大集合变得很方便，可以充分发挥多核 CPU 的优势，更易于为多核处理器编写代码；

Lambda 表达式由三个部分组成：第一部分为一个括号内用逗号分隔的形式参数，参数是函数式接口里面方法的参数；第二部分为一个箭头符号：->；第三部分为方法体，可以是表达式和代码块。语法如下：

1. 方法体为表达式，该表达式的值作为返回值返回。

```java
(parameters) -> expression
```

2. 方法体为代码块，必须用 {} 来包裹起来，且需要一个 return 返回值，但若函数式接口里面方法返回值是 void，则无需返回值。

```java
(parameters) -> { statements; }
```

例如，下面是使用匿名内部类和 Lambda 表达式的代码比较。

下面是用匿名内部类的代码：

```java
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        System.out.print("Helllo Lambda in actionPerformed");
    }
});
```

下面是使用 Lambda 表达式后：

```java
button.addActionListener(
    // actionPerformed 有一个参数 e 传入，所以用 (ActionEvent e)
    (ActionEvent e)-> 
        System.out.print("Helllo Lambda in actionPerformed")
);
```

上面是方法体包含了参数传入 (ActionEvent e)，如果没有参数则只需 ( )，例如 Thread 中的 run 方法就没有参数传入，当它使用 Lambda 表达式后：

```java
Thread t = new Thread(
    // run 没有参数传入，所以用 (), 后面用 {} 包起方法体
    () -> {
        System.out.println("Hello from a thread in run");
    }
);
```

通过上面两个代码的比较可以发现使用 Lambda 表达式可以简化代码，并提高代码的可读性。

为了进一步简化 Lambda 表达式，可以使用方法引用。例如，下面三种分别是使用内部类，使用 Lambda 表示式和使用方法引用方式的比较：

```java
// 1. 使用内部类
Function<Integer, String> f = new Function<Integer,String>() {
    @Override
    public String apply(Integer t) {
        return null;
    }
};

// 2. 使用 Lambda 表达式
Function<Integer, String> f2 = (t) -> String.valueOf(t); 

// 3. 使用方法引用的方式
Function<Integer, String> f1 = String::valueOf;
```

要使用 Lambda 表达式，需要定义一个函数式接口，这样往往会让程序充斥着过量的仅为 Lambda 表达式服务的函数式接口。为了减少这样过量的函数式接口，Java 8 在 java.util.function 中增加了不少新的函数式通用接口。例如：

* Function<T, R>：将 T 作为输入，返回 R 作为输出，他还包含了和其他函数组合的默认方法。
* Predicate<T> ：将 T 作为输入，返回一个布尔值作为输出，该接口包含多种默认方法来将 Predicate 组合成其他复杂的逻辑（与、或、非）。
* Consumer<T> ：将 T 作为输入，不返回任何内容，表示在单个参数上的操作。

例如，People 类中有一个方法 getMaleList 需要获取男性的列表，这里需要定义一个函数式接口 PersonInterface：

```java
interface PersonInterface {
    public boolean test(Person person);
}

public class People {

    private List<Person> persons= new ArrayList<Person>();

    public List<Person> getMaleList(PersonInterface filter) {
        List<Person> res = new ArrayList<Person>();
        persons.forEach((Person person) -> {
            if (filter.test(person)) {
                // 调用 PersonInterface 的方法
                res.add(person);
            }
        });
        return res;
    }

}
```

为了去除 PersonInterface 这个函数式接口，可以用通用函数式接口 Predicate 替代如下：

```java
class People {

    private List<Person> persons= new ArrayList<Person>();

    public List<Person> getMaleList(Predicate<Person> predicate) {
        List<Person> res = new ArrayList<Person>();
        persons.forEach(person -> {
            if (predicate.test(person)) {
                // 调用 Predicate 的抽象方法 test
                res.add(person);
            }
        });
        return res;
    }

}
```

## 接口的增强

Java 8 对接口做了进一步的增强。在接口中可以添加使用 default 关键字修饰的非抽象方法。还可以在接口中定义静态方法。如今，接口看上去与抽象类的功能越来越类似了。

### 默认方法

Java 8 还允许我们给接口添加一个非抽象的方法实现，只需要使用 default 关键字即可，这个特征又叫做扩展方法。在实现该接口时，该默认扩展方法在子类上可以直接使用，它的使用方式类似于抽象类中非抽象成员方法。但扩展方法不能够重载 Object 中的方法。例如：toString、equals、 hashCode 不能在接口中被重载。

例如，下面接口中定义了一个默认方法 count()，该方法可以在子类中直接使用。

```java
public interface DefaultFunInterface {

    // 定义默认方法 count
    default int count() {
        return 1;
    }

}
```

```java
public class SubDefaultFunClass implements DefaultFunInterface {

    public static void main(String[] args) {
        // 实例化一个子类对象，改子类对象可以直接调用父接口中的默认方法 count
        SubDefaultFunClass sub = new SubDefaultFunClass();
        sub.count();
    }

}
```

### 静态方法

在接口中，还允许定义静态的方法。接口中的静态方法可以直接用接口来调用。

例如，下面接口中定义了一个静态方法 find，该方法可以直接用 StaticFunInterface .find() 来调用。

```java
public interface StaticFunInterface {

    public static int find() {
        return 1;
    }

}
```

```java
public class TestStaticFun {

    public static void main(String[] args) {
        // 接口中定义了静态方法 find 直接被调用
        StaticFunInterface.fine();
    }

}
```

## 集合之流式操作

Java 8 引入了流式操作（Stream），通过该操作可以实现对集合（Collection）的并行处理和函数式操作。根据操作返回的结果不同，流式操作分为中间操作和最终操作两种。最终操作返回一特定类型的结果，而中间操作返回流本身，这样就可以将多个操作依次串联起来。根据流的并发性，流又可以分为串行和并行两种。流式操作实现了集合的过滤、排序、映射等功能。

Stream 和 Collection 集合的区别：Collection 是一种静态的内存数据结构，而 Stream 是有关计算的。前者是主要面向内存，存储在内存中，后者主要是面向 CPU，通过 CPU 实现计算。

### 串行和并行的流

流有串行和并行两种，串行流上的操作是在一个线程中依次完成，而并行流则是在多个线程上同时执行。并行与串行的流可以相互切换：通过 stream.sequential() 返回串行的流，通过 stream.parallel() 返回并行的流。相比较串行的流，并行的流可以很大程度上提高程序的执行效率。

下面是分别用串行和并行的方式对集合进行排序。

串行排序：

```java
List<String> list = new ArrayList<String>();
for (int i = 0; i < 1000000; i++) {
    double d = Math.random() * 1000;
    list.add(d+"");
}
long start = System.nanoTime(); // 获取系统开始排序的时间点
int count= (int) ((Stream) list.stream().sequential()).sorted().count();
long end = System.nanoTime(); // 获取系统结束排序的时间点
long ms = TimeUnit.NANOSECONDS.toMillis(end - start); // 得到串行排序所用的时间
System.out.println(ms + "ms");
```

并行排序：

```java
List<String> list = new ArrayList<String>();
for (int i = 0; i < 1000000; i++) {
    double d = Math.random() * 1000;
    list.add(d+"");
}
long start = System.nanoTime(); // 获取系统开始排序的时间点
int count = (int)((Stream) list.stream().parallel()).sorted().count();
long end = System.nanoTime(); // 获取系统结束排序的时间点
long ms = TimeUnit.NANOSECONDS.toMillis(end - start); // 得到并行排序所用的时间
System.out.println(ms + "ms");
```

串行输出为 1200ms，并行输出为 800ms。可见，并行排序的时间相比较串行排序时间要少不少。

### 中间操作

该操作会保持 stream 处于中间状态，允许做进一步的操作。它返回的还是的 Stream，允许更多的链式操作。常见的中间操作有：

* filter()：对元素进行过滤；
* sorted()：对元素排序；
* map()：元素的映射；
* distinct()：去除重复元素；
* subStream()：获取子 Stream 等。

例如，下面是对一个字符串集合进行过滤，返回以“s”开头的字符串集合，并将该集合依次打印出来：

```java
list.stream().filter((s) -> s.startsWith("s"))
    .forEach(System.out::println);
```

这里的 filter(...) 就是一个中间操作，该中间操作可以链式地应用其他 Stream 操作。

### 终止操作

该操作必须是流的最后一个操作，一旦被调用，Stream 就到了一个终止状态，而且不能再使用了。常见的终止操作有：

* forEach()：对每个元素做处理；
* toArray()：把元素导出到数组；
* findFirst()：返回第一个匹配的元素；
* anyMatch()：是否有匹配的元素等。

例如，下面是对一个字符串集合进行过滤，返回以“s”开头的字符串集合，并将该集合依次打印出来：

```java
list.stream() // 获取列表的 stream 操作对象
    .filter((s) -> s.startsWith("s")) // 对这个流做过滤操作
    .forEach(System.out::println);
```

这里的 forEach(...) 就是一个终止操作，该操作之后不能再链式的添加其他操作了。

## 注解的更新

对于注解，Java 8 主要有两点改进：类型注解和重复注解。

Java 8 的类型注解扩展了注解使用的范围。在该版本之前，注解只能是在声明的地方使用。现在几乎可以为任何东西添加注解：局部变量、类与接口，就连方法的异常也能添加注解。新增的两个注释的程序元素类型 ElementType.TYPE_USE 和 ElementType.TYPE_PARAMETER 用来描述注解的新场合。ElementType.TYPE_PARAMETER 表示该注解能写在类型变量的声明语句中。而 ElementType.TYPE_USE 表示该注解能写在使用类型的任何语句中（例如声明语句、泛型和强制转换语句中的类型）。

对类型注解的支持，增强了通过静态分析工具发现错误的能力。原先只能在运行时发现的问题可以提前在编译的时候被排查出来。Java 8 本身虽然没有自带类型检测的框架，但可以通过使用 Checker Framework 这样的第三方工具，自动检查和确认软件的缺陷，提高生产效率。

例如，下面的代码可以通过编译，但是运行时会报 NullPointerException 的异常。

```java
public class TestAnno {

    public static void main(String[] args) {
        Object obj = null;
        obj.toString();
    }

}
```

为了能在编译期间就自动检查出这类异常，可以通过类型注解结合 Checker Framework 提前排查出来：

```java
import org.checkerframework.checker.nullness.qual.NonNull;

public class TestAnno {

    public static void main(String[] args) {
        @NonNull Object obj = null;
        obj.toString();
    }

}
```

编译时自动检测结果如下：

```bash
C:\workspace\TestJava8\src\TestAnno.java:4: Warning:
  (assignment.type.incompatible) $$ 2 $$ null $$ @UnknownInitialization @NonNull Object $$ ( 152, 156 )
  $$ incompatible types in assignment.
@NonNull Object obj = null;
 ^
 found : null
 required: @UnknownInitialization @NonNull Object
```

另外，在该版本之前使用注解的一个限制是相同的注解在同一位置只能声明一次，不能声明多次。Java 8 引入了重复注解机制，这样相同的注解可以在同一地方声明多次。重复注解机制本身必须用 @Repeatable 注解。

例如，下面就是用 @Repeatable 重复注解的例子：

```java
@Retention(RetentionPolicy.RUNTIME) // 该注解存在于类文件中并在运行时可以通过反射获取
@interface Annots {
    Annot[] value();
}

@Retention(RetentionPolicy.RUNTIME) // 该注解存在于类文件中并在运行时可以通过反射获取
@Repeatable(Annots.class)
@interface Annot {
    String value();
}

@Annot("a1")
@Annot("a2")
public class Test {

    public static void main(String[] args) {
        Annots annots1 = Test.class.getAnnotation(Annots.class);

        System.out.println(annots1.value()[0] + ", " + annots1.value()[1]); 
        // 输出: @Annot(value=a1), @Annot(value=a2)

        Annot[] annots2 = Test.class.getAnnotationsByType(Annot.class);
        System.out.println(annots2[0] + ", " + annots2[1]); 
        // 输出: @Annot(value=a1), @Annot(value=a2)
    }

}
```

注释 Annot 被 @Repeatable( Annots.class ) 注解。Annots 只是一个容器，它包含 Annot 数组, 编译器尽力向程序员隐藏它的存在。通过这样的方式，Test 类可以被 Annot 注解两次。重复注释的类型可以通过 getAnnotationsByType() 方法来返回。

## 安全性

现今，互联网环境中存在各种各种潜在的威胁，对于 Java 平台来说，安全显得特别重要。为了保证新版本具有更高的安全性，Java 8 在安全性上对许多方面进行了增强，也为此推迟了它的发布日期。下面例举其中几个关于安全性的更新：

支持更强的基于密码的加密算法。基于 AES 的加密算法，例如 PBEWithSHA256AndAES_128 和 PBEWithSHA512AndAES_256，已经被加入进来。

在客户端，TLS1.1 和 TLS1.2 被设为默认启动。并且可以通过新的系统属性包 jdk.tls.client.protocols 来对它进行配置。

Keystore 的增强，包含新的 Keystore 类型 java.security.DomainLoadStoreParameter 和为 Keytool 这个安全钥匙和证书的管理工具添加新的命令行选项-importpassword。同时，添加和更新了一些关于安全性的 API 来支持 KeyStore 的更新。

支持安全的随机数发生器。如果随机数来源于随机性不高的种子，那么那些用随机数来产生密钥或者散列敏感信息的系统就更易受攻击。SecureRandom 这个类的 getInstanceStrong 方法如今可以获取各个平台最强的随机数对象实例，通过这个实例生成像 RSA 私钥和公钥这样具有较高熵的随机数。

JSSE（Java(TM) Secure Socket Extension）服务器端开始支持 SSL/TLS 服务器名字识别 SNI（Server Name Indication）扩展。SNI 扩展目的是 SSL/TLS 协议可以通过 SNI 扩展来识别客户端试图通过握手协议连接的服务器名字。在 Java 7 中只在客户端默认启动 SNI 扩展。如今，在 JSSE 服务器端也开始支持 SNI 扩展了。

安全性比较差的加密方法被默认禁用。默认不支持 DES 相关的 Kerberos 5 加密方法。如果一定要使用这类弱加密方法需要在 krb5.conf 文件中添加 allow_weak_crypto=true。考虑到这类加密方法安全性极差，开发者应该尽量避免使用它。

## IO/NIO 的改进

Java 8 对 IO/NIO 也做了一些改进。主要包括：改进了 java.nio.charset.Charset 的实现，使编码和解码的效率得以提升，也精简了 jre/lib/charsets.jar 包；优化了 String(byte[],*) 构造方法和 String.getBytes() 方法的性能；还增加了一些新的 IO/NIO 方法，使用这些方法可以从文件或者输入流中获取流（java.util.stream.Stream），通过对流的操作，可以简化文本行处理、目录遍历和文件查找。

新增的 API 如下：

* BufferedReader.line(): 返回文本行的流 Stream<String>
* File.lines(Path, Charset):返回文本行的流 Stream<String>
* File.list(Path): 遍历当前目录下的文件和目录
* File.walk(Path, int, FileVisitOption): 遍历某一个目录下的所有文件和指定深度的子目录
* File.find(Path, int, BiPredicate, FileVisitOption... ): 查找相应的文件

下面就是用流式操作列出当前目录下的所有文件和目录：

```java
Files.list(new File(".").toPath())
    .forEach(System.out::println);
```

## 全球化功能

Java 8 版本还完善了全球化功能：支持新的 Unicode 6.2.0 标准，新增了日历和本地化的 API，改进了日期时间的管理等。

Java 的日期与时间 API 问题由来已久，Java 8 之前的版本中关于时间、日期及其他时间日期格式化类由于线程安全、重量级、序列化成本高等问题而饱受批评。Java 8 吸收了 Joda-Time 的精华，以一个新的开始为 Java 创建优秀的 API。新的 java.time 中包含了所有关于时钟（Clock），本地日期（LocalDate）、本地时间（LocalTime）、本地日期时间（LocalDateTime）、时区（ZonedDateTime）和持续时间（Duration）的类。历史悠久的 Date 类新增了 toInstant() 方法，用于把 Date 转换成新的表示形式。这些新增的本地化时间日期 API 大大简化了了日期时间和本地化的管理。

例如，下面是对 LocalDate，LocalTime 的简单应用：

```java
// LocalDate
LocalDate localDate = LocalDate.now(); // 获取本地日期

localDate = LocalDate.ofYearDay(2014, 200); // 获得 2014 年的第 200 天 
System.out.println(localDate.toString()); // 输出：2014-07-19

localDate = LocalDate.of(2014, Month.SEPTEMBER, 10); //2014 年 9 月 10 日 
System.out.println(localDate.toString()); // 输出：2014-09-10

// LocalTime
LocalTime localTime = LocalTime.now(); // 获取当前时间
System.out.println(localTime.toString()); // 输出当前时间

localTime = LocalTime.of(10, 20, 50); // 获得 10:20:50 的时间点
System.out.println(localTime.toString()); // 输出: 10:20:50

// Clock 时钟
Clock clock = Clock.systemDefaultZone(); // 获取系统默认时区（当前瞬时时间）
long millis = clock.millis();
```

## Java 8 开发环境

随着 Java 8 正式发布，许多 IDE 也开始提供对 Java 8 的支持。Eclipse 是 Java 开发人员最为常用集成开发环境，在最新的 Eclipse Kepler 4.3.2 版本中已经默认增加了对 Java 8 的支持。要想在 Eclipse Kepler 的前期版本中添加对 Java 8 的支持，可以通过下面步骤来完成：

1. 选择 "Help > Eclipse Marketplace..."。
2. 在搜索框中输入 "Java 8 Kepler"。
3. 点击安装 Java 8 support for Eclipse Kepler SR2。

图 1. 安装 Java 8 support for Eclipse Kepler SR2

![图 1. 安装 Java 8 support for Eclipse Kepler SR2](https://www.ibm.com/developerworks/cn/java/j-lo-jdk8newfeature/img001.png "图 1. 安装 Java 8 support for Eclipse Kepler SR2")

接下来，就可以开启 Java 8 编程之旅。

图 2. Eclipse 编写的 Java 8 程序和运行结果：

![图 2. Eclipse 编写的 Java 8 程序和运行结果](https://www.ibm.com/developerworks/cn/java/j-lo-jdk8newfeature/img002.png "图 2. Eclipse 编写的 Java 8 程序和运行结果")

## 结束语

Java 8 正式版是一个有重大改变的版本，该版本对 Java 做了重大改进。本文通过文字描述及代码实例对新版本中主要新特性做了介绍：函数式接口、Lambda 表达式、集合的流式操作、注解、安全性、IO/NIO、全球化功能。除了文中介绍的这些重要的新功能之外，Java 8 还对 java 工具包 JDBC、Java DB、JavaFX 等方面都有许多改进和增强。这些新增功能简化了开发，提升了代码可读性，增强了代码的安全性，提高了代码的执行效率，为开发者带来了全新的 Java 开发体验，从而推动了 Java 这个平台的前进。

## 相关主题

* [Java SE](http://www.oracle.com/technetwork/java/javase/overview/index.html)，Java SE 官网。
* [JDK 8 新功能](http://www.oracle.com/technetwork/java/javase/8-whats-new-2157071.html)。
* [Eclipse 官网](http://www.eclipse.org/)。
* [Checker Framework](http://types.cs.washington.edu/checker-framework/)，Checker 框架主页。
* [developerWorks Java 技术专区](http://www.ibm.com/developerworks/cn/java/)：这里有数百篇关于 Java 编程各个方面的文章。