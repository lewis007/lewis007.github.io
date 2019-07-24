---
layout: blog
title: Spring Boot 基础
subtitle: 开始使用 Spring Boot 编写能直接运行的 Spring 应用程序
author: J Steven Perry
time: 2019-05-05
categories: IBM-Developer
tags: Java Spring
---

> 原文地址：https://www.ibm.com/developerworks/cn/java/j-spring-boot-basics-perry/index.html

Spring Boot 是一个轻量级框架，可以完成基于 Spring 的应用程序的大部分配置工作。在本教程中，将学习如何使用 Spring Boot 的 starter、特性和可执行 JAR 文件结构，快速创建能直接运行的基于 Spring 的应用程序。

简单介绍 Spring Boot 后，我将引导您设置并运行两个 Spring Boot 应用程序：一个简单的 “Hello, World” 应用程序和一个稍微复杂一点的 Spring MVC RESTful Web 服务应用程序。请注意，我在应用程序示例中使用的是 Spring Boot V1.5.2。推荐您使用 V1.5.2 或更高版本，但这些示例应适用于任何高于 1.5 的版本。

### 前提条件

要充分掌握教程内容，您应该能熟练使用 Java™ Development Kit V8 (JDK 8)。还需要熟悉 Eclipse IDE、Maven 和 Git。

要顺利学习本教程，请确保安装了以下软件：

* [JDK 8 for Windows, Mac, and Linux。](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* [Eclipse IDE for Windows, Mac, and Linux。](http://www.eclipse.org/downloads/eclipse-packages/)
* [Apache Maven for Windows, Mac, and Linux。](https://maven.apache.org/download.cgi)
* [Git for Windows, Mac, and Linux。](https://git-scm.com/downloads)

深入介绍教程之前，我想简单介绍一下 Spring Boot。

## Spring Boot 是什么？

Spring Boot 的目的是提供一组工具，以便快速构建容易配置的 Spring 应用程序。

### 问题：Spring 很难配置！

如果您编写过基于 Spring 的应用程序，就会知道只是完成 “Hello, World” 就需要大量配置工作。这不是一件坏事：Spring 是一个优雅的框架集合，需要小心协调配置才能正确工作。但这种优雅的代价是配置变得很复杂（别跟我提 XML）。

### 解决方案：Spring Boot

开始介绍 Spring Boot。[Spring Boot 网站](https://projects.spring.io/spring-boot/)对它的介绍比我的简介更为简洁：

> “ Spring Boot 使您能轻松地创建独立的、生产级的、基于 Spring 且能直接运行的应用程序。我们对 Spring 平台和第三方库有自己的看法，所以您从一开始只会遇到极少的麻烦。”

基本上讲，这意味着您只需极少的配置，就可以快速获得一个正常运行的 Spring 应用程序。这些极少的配置采用了注释的形式，所以没有 XML。

这一切听起来很不错，对吧？但 Spring Boot 到底是怎么工作的？

### 首先，它很有主见

Spring Boot 拥有观点。换句话说，Spring Boot 拥有合理的默认值，所以您可以使用这些常用值快速构建应用程序。

例如，Tomcat 是一个非常流行的 Web 容器。默认情况下，Spring Boot Web 应用程序使用了一个嵌入式 Tomcat 容器。

### 其次，它可以自定义

如果无法改变其想法，具有主见的框架就不是很好的框架。您可以根据自己的喜好轻松地自定义 Spring Boot 应用程序，无论是在进行初始配置时还是在开发周期的后期阶段。

例如，如果喜欢 Maven，可以轻松地在 POM 文件中更改 `<dependency>` 来替换 Spring Boot 默认值。教程后面会这么做。

## 开始使用 Spring Boot

### Starter

starter 是 Spring Boot 的一个重要组成部分，用于限制您需要执行的手动配置依赖项数量。要想有效地使用 Spring Boot，您应该了解 starter。

starter 实际上是一组依赖项（比如 Maven POM），这些依赖项是 starter 所表示的应用程序类型所独有的。

所有 starter 都使用以下命名约定：spring-boot-starter-XYZ，其中 XYZ 是想要构建的应用程序类型。以下是一些流行的 Spring Boot starter：

* spring-boot-starter-web 用于构建 RESTful Web 服务，它使用 Spring MVC 和 Tomcat 作为嵌入式应用程序容器。
* spring-boot-starter-jersey 是 spring-boot-starter-web 的一个替代，它使用 Apache Jersey 而不是 Spring MVC。
* spring-boot-starter-jdbc 用于建立 JDBC 连接池。它基于 Tomcat 的 JDBC 连接池实现。

[Spring Boot starter 参考页面](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-starter)还列出了其他许多 starter。您可以访问该页面来了解每个 starter 的 POM 和依赖项。

### 自动配置

如果您允许的话，Spring Boot 会使用其 @EnableAutoConfiguration 注释自动配置您的应用程序。自动配置基于类路径中的 JAR 和定义 bean 的方式：

> **查看配置**：使用 --debug 选项启动您的 Spring Boot 应用程序，然后将向控制台生成一个自动配置报告。

* Spring Boot 使用您在 CLASSPATH 中指定的 JAR，形成一个有关如何配置某个自动行为的观点。例如，如果类路径中有 H2 数据库 JAR，而且您没有配置任何其他 DataSource bean，您的应用程序会自动配置一个内存型数据库。
* Spring Boot 使用您定义 bean 的方式来确定如何自动配置自身。例如，如果您为 JPA bean 添加了 @Entity 注释，Spring Boot 会自动配置 JPA，这样您就不需要 persistence.xml 文件。

### Spring Boot über jar

Spring Boot 旨在帮助开发人员创建能直接运行的应用程序。为实现该目的，它将应用程序及其依赖项包装在一个可执行 JAR 中。要运行您的应用程序，可以像这样启动 Java：

```bash
$ java -jar PATH_TO_EXECUTABLE_JAR/executableJar.jar
```

Spring Boot über JAR 不是一个新概念。因为 Java 没有提供加载嵌套式 JAR 的标准方式，所以开发人员多年来一直使用 [Apache Maven Shade 插件](https://maven.apache.org/plugins/maven-shade-plugin/)等工具来构建 “shaded” JAR。shaded JAR 仅包含来自应用程序的所有依赖 JAR 的 .class 文件。但随着应用程序复杂性的增加和依赖项的增多，shaded JAR 可能遇到两个问题：

* 名称冲突，不同 JAR 中的两个类采用了相同名称。
* 依赖项版本问题，两个 JAR 使用同一个依赖项的不同版本。

Spring Boot 解决这些问题的方法是定义一种 [特殊的 JAR 文件布局](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#executable-jar)，其中的 JAR 本身嵌套在 über JAR 中。Spring 支持工具（例如 spring-boot-maven 插件）随后会构建这个可执行的 über JAR，使其符合该布局（不只是像shaded JAR 一样解包和重新打包 .class 文件）。运行这个可执行 JAR 时，Spring Boot 使用了一个特殊的类加载器来处理嵌套式 JAR 中的类。

## 编写 Hello, World!

现在您已准备好开始直接使用 Spring Boot 了。本节中的示例基于一个名为 HelloSpringBoot 的简单应用程序。您可以和我一起练习这个应用程序开发示例，但是，如果想立即开始使用应用程序代码，可以从 Github [下载](https://github.com/makotogo/HelloSpringBoot)它。

让我们行动起来，创建一个新的 Maven 项目！

### 创建 Maven 项目

在 Eclipse 中，转到 **File > New Project** 并选择 **Maven > Maven Project**，如图 1 所示。

图 1. 选择一个 Maven 项目

![用于选择 Maven 项目的 Eclipse New Project 对话框的屏幕截图。](https://www.ibm.com/developerworks/cn/java/j-spring-boot-basics-perry/Figure-1.png "用于选择 Maven 项目的 Eclipse New Project 对话框的屏幕截图。")

单击 Next，在随后的对话框中（未给出）再次单击 Next。

您会被要求选择新 Maven 项目的架构类型。选择 **maven-archetype-quickstart**，如图 2 所示。

图 2. 选择 Maven quickstart 架构类型

![用于选择 Maven 快速启动架构类型的 New Project 对话框的屏幕截图。](https://www.ibm.com/developerworks/cn/java/j-spring-boot-basics-perry/Figure-2.png "用于选择 Maven 快速启动架构类型的 New Project 对话框的屏幕截图。")

单击 Next。

最后，输入工件设置，如图 3 所示。

图 3. 选择 Maven 工件设置

![用于选择 Maven 架构类型设置的 New Project 对话框的屏幕截图。](https://www.ibm.com/developerworks/cn/java/j-spring-boot-basics-perry/Figure-3.png "用于选择 Maven 架构类型设置的 New Project 对话框的屏幕截图。")

我为 HelloSpringBoot 应用程序使用了以下设置：

* Group Id：com.makotojava.learn
* Artifact Id：HelloSpringBoot
* Version：1.0-SNAPSHOT
* Package：com.makotojava.learn.hellospringboot

单击 Finish 创建该项目。

### 创建 POM

修改 New Project 向导创建的 POM，使其类似于清单 1。

清单 1. HelloSpringBoot 的 POM 文件

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.makotojava.learn</groupId>
    <artifactId>HelloSpringBoot</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>
    <name>HelloSpringBoot</name>
    <url>http://maven.apache.org</url>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.2.RELEASE</version>
    </parent>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

请注意清单 1 中突出显示的行：

**第 10 至 14 行**显示了 <parent> 元素，它指定了 Spring Boot 父 POM，并包含常见组件的定义。您不需要手动配置这些组件。

**第 16 至 19 行**显示了 spring-boot-starter-web Spring Boot starter 上的 <dependency>。它们告诉 Spring Boot，该应用程序是 Web 应用程序。Spring Boot 会相应地形成自己的观点。

**第 25 至 30 行**告诉 Maven 使用 spring-boot-maven-plugin 插件生成该 Spring Boot 应用程序。

配置不是太多，对吧？请注意，这里没有 XML。我们使用 Java 注释完成剩余配置。

#### 进一步了解 Spring Boot 的观点

在进一步介绍之前，我想再讲讲 Spring Boot 的观点。换句话说，我认为有必要解释一下 Spring Boot 如何使用 spring-boot-starter-web 等 starter 来形成自己的配置观点。

示例应用程序 HelloSpringBoot 使用了 Spring Boot 的 Web 应用程序 starter spring-boot-starter-web。基于这个 starter，Spring Boot 形成了该应用程序的以下观点：

* 使用 Tomcat 作为嵌入式 Web 服务器容器
* 使用 Hibernate 进行对象-关系映射 (ORM)
* 使用 Apache Jackson 绑定 JSON
* 使用 Spring MVC 作为 REST 框架

我们来讲讲主见！据 Spring Boot 辩解，这些是最流行的 Web 应用程序默认设置 — 至少我一直在使用它们。

但是还记得我说过 Spring Boot 可以自定义吗？如果您想使用不同的技术组合，可以轻松地覆盖 Spring Boot 的默认设置。

我们接下来将演示一种简单的自定义。

#### 丢失 `<parent>`

如果您的 POM 中已有一个 `<parent>` 元素，或者如果不想使用它，该怎么办？ Spring Boot 是否仍会正常运行？

是的，它会正常运行，但您需要做两件事：

* 手动添加依赖项（包括版本）
* 向 spring-boot-maven-plugin 添加一个配置代码段，如清单 2 所示：

清单 2. 在不使用 `<parent>` POM 元素时，指定 repackage 目标

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <version>1.5.2.RELEASE</version>
            <executions>
                <execution>
                    <goals>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

一定要注意，Maven 的许多优秀功能都是在 `<parent>` 元素中实现的，所以如果您有合理的理由不使用它，继续操作时务必小心。确保向 spring-boot-maven-plugin 添加了一条 repackage 目标执行语句，[这里提供了解释](http://docs.spring.io/spring-boot/docs/current/maven-plugin/usage.html)。

> **检查依赖项**：如果您需要查看使用的 Spring Boot starter 拉入了哪些依赖项，请访问 [Spring Boot starter 参考页面](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-starter)。

该项目已配置和自定义。现在是时候构建可执行程序了。

### 构建可执行 JAR

要使用 Maven 构建可执行 JAR，有两种选择：

* 在 Eclipse 中运行 Maven 构建
* 从命令行运行 Maven 构建

我将介绍如何实现这两种方法。

#### 在 Eclipse 中构建

要在 Eclipse 中运行 Maven 构建，请右键单击 POM 文件并选择 **Run As > Maven Build**。在 Goals 文本字段中，输入 clean 和 package，然后单击 Run 按钮。

图 4. 在 Eclipse 中构建可执行 JAR

![在 Eclipse 中构建可执行的 JAR](https://www.ibm.com/developerworks/cn/java/j-spring-boot-basics-perry/Figure-4.png "在 Eclipse 中构建可执行的 JAR")

您会在控制台视图中看到一条消息，表明成功实现了构建：

```bash
.
.
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 2.440 s
[INFO] Finished at: 2017-04-16T10:17:21-05:00
[INFO] Final Memory: 30M/331M
[INFO] ------------------------------------------------------------------------
```

#### 从命令行构建

要从命令行运行 Maven 构建，请打开 Mac 终端窗口或 Windows 命令提示，导航到 HelloSpringBoot 项目目录，然后执行以下命令：

```bash
mvn clean package
```

您会在终端窗口或命令提示中看到一条消息，表明成功实现了构建。

```bash
$ cd HelloSpringBoot
$ pwd
/Users/sperry/home/HelloSpringBoot
$ mvn clean package
.
.
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 2.440 s
[INFO] Finished at: 2017-04-16T10:17:21-05:00
[INFO] Final Memory: 30M/331M
[INFO] ------------------------------------------------------------------------
$
```

现在您已准备好运行这个可执行 JAR 了。

### 运行可执行 JAR

要运行刚创建的可执行 JAR，请打开 Mac 终端窗口或 Windows 命令提示，导航到 HelloSpringBoot 项目文件夹，然后执行：

```bash
java -jar target/HelloSpringBoot-1.0-SNAPSHOT.jar
```

其中 target 是构建的默认输出目录。如果为它配置了不同的目录，请在上面的命令中进行相应的替换。

Spring Boot 的输出包含一个文本式 “启动屏幕”（第 2 至 7 行），以及其他输出，类似于下面的清单。我仅展示了部分行，以便让您了解在运行该应用程序时应看到的内容：

```bash
$ java -jar target/HelloSpringBoot-1.0-SNAPSHOT.jar
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v1.5.2.RELEASE)
2017-04-15 17:46:12.919  INFO 20096 --- [           main] c.makotojava.learn.hellospringboot.App   : Starting App v1.0-SNAPSHOT on Ix.local with PID 20096 (/Users/sperry/home/projects/learn/HelloSpringBoot/target/HelloSpringBoot-1.0-SNAPSHOT.jar started by sperry in /Users/sperry/home/projects/learn/HelloSpringBoot)
2017-04-15 17:46:12.924 DEBUG 20096 --- [           main] c.makotojava.learn.hellospringboot.App   : Running with Spring Boot v1.5.2.RELEASE, Spring v4.3.7.RELEASE
.
.
2017-04-15 17:46:15.221  INFO 20096 --- [           main] c.makotojava.learn.hellospringboot.App   : Started App in 17.677 seconds (JVM running for 18.555)
```

如果应用程序成功启动，Spring Boot 输出的最后一行会包含文字 “Started App”（第 13 行）。现在您已准备好体验自己的应用程序了，我们接下来就会来体验它。

### 体验该应用程序

可以打开浏览器并访问以下 URL，以便执行 HelloSpringBoot 的单一 REST 方法：

http://localhost:8080/hello

图 5. 开始使用 Spring Boot！

![HelloSpringBoot Web 应用程序的屏幕截图。](https://www.ibm.com/developerworks/cn/java/j-spring-boot-basics-perry/Figure-5.png "HelloSpringBoot Web 应用程序的屏幕截图。")

如果看到文本 “Hello, All your base are belong to us”（视频游戏 [Zero Wing](https://en.wikipedia.org/wiki/All_your_base_are_belong_to_us) 的主页），就会知道该应用程序在正常运行！

#### 更改 Spring Boot 的观点

Spring Boot 的观点基于 POM 的内容，包括您在初步配置应用程序时指定的 Spring Boot starter。形成有关想要构建的应用程序类型的观点后，Spring Boot 会提供一组 Maven 依赖项。图 6 展示了 Spring Boot 在 Eclipse 中设置的一些 Maven 依赖项，它们基于 POM 内容以及为 HelloSpringBoot 应用程序指定的 starter：

图 6. HelloSpringBoot 的初始依赖项

![HelloSpringBoot 的默认依赖配置。](https://www.ibm.com/developerworks/cn/java/j-spring-boot-basics-perry/Figure-6.png "HelloSpringBoot 的默认依赖配置。")

请注意，Tomcat 是默认的嵌入式 Web 服务器容器。现在我们假设您不想使用 Tomcat，而是想使用 Jetty。只需更改 POM 中的 <dependencies> 节（将清单 3 中第 5 至 15 行粘贴到 清单 1 中的第 19 行之前）：

清单 3. 更改 POM 来使用 Jetty 代替 Tomcat

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <exclusions>
            <exclusion>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-tomcat</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jetty</artifactId>
    </dependency>
</dependencies>
```

在下面可以注意到，Maven 的 Tomcat 依赖项消失了（得益于清单 3 中的第 5 至 10 行），取而代之的是 Jetty 依赖项（第 12 至 15 行）。

图 7. 自定义的 HelloSpringBoot 依赖项

![HelloSpringBoot 的自定义依赖配置。](https://www.ibm.com/developerworks/cn/java/j-spring-boot-basics-perry/Figure-7.png "HelloSpringBoot 的自定义依赖配置。")

实际上，一张屏幕截图无法显示所有 Jetty 依赖项，但它们都包含在这里，而且 Tomcat 依赖项消失了。您可以自行尝试并查看结果！

## 创建复杂的应用程序。

简单的示例虽然也能很好地展示 Spring Boot，但它能做的事情要多得多！在本节中，我将通过一个 Spring MVC RESTful Web 应用程序，介绍如何让 Spring Boot 充分发挥作用。要做的第一件事是设置新示例应用程序 SpringBootDemo。

#### SpringBootDemo

SpringBootDemo 是一个 Spring Boot 包装器，它包装了一个名为 oDoT 的基于 Spring 的简单 POJO 应用程序。（ToDo 中的反向排列……明白了吗？）它的目的是练习开发比简单 Hello, World 更复杂的应用程序的过程。您还会了解如何使用 Spring Boot 包装一个现有的应用程序。

要设置和运行 SpringBootDemo，需要做 3 件事：

* 从 GitHub 获取代码。
* 构建并运行可执行 JAR。
* 通过 SoapUI 访问该应用程序。

我创建了一个视频来帮助引导您完成此过程的每一步。现在可以启动该视频了。

**SpringBootDemo 演练**

![SpringBootDemo 演练](https://www.ibm.com/developerworks/cn/java/j-spring-boot-basics-perry/image-video.png "SpringBootDemo 演练")

[点击查看视频演示](http://v.youku.com/v_show/id_XMjg1MzgwNjQ2MA==.html) [查看抄本](http://www.ibm.com/developerworks/cn/java/j-spring-boot-basics-perry/spring-boot-basics-perry-transcript.txt)

### 获取代码

首先，您需要从相应的 GitHub 存储库克隆两个项目。第一个项目名为 odotCore，包含应用程序的业务逻辑，该项目编写为一个基于 Spring 的 POJO 应用程序。另一个项目名为 SpringBootDemo，是一个围绕 odotCore 的 Spring Boot 应用程序包装器。

要克隆 odotCore 存储库，请打开一个 Mac 终端窗口或 Windows 命令提示，导航到您想放入该代码的根目录，然后执行以下命令：

```bash
git clone https://github.com/makotogo/odotCore
```

要克隆 SpringBootDemo 存储库，可执行以下命令：


```bash
git clone https://github.com/makotogo/SpringBootDemo
```

请注意，两个项目被直接放在应用程序的根目录下。接下来将代码导入工作区中。

### 将代码导入 Eclipse 中

转到 **File > Import...** 并选择 **Maven > Existing Maven Projects**。

在下一个对话框中，使用 Browse 按钮导航到根目录。上一步中克隆的两个项目都应出现在对话框中，如下图所示：

图 8. 导入 Maven 项目

![对话框的屏幕截图：导入 Maven 项目。](https://www.ibm.com/developerworks/cn/java/j-spring-boot-basics-perry/Figure-8.png "对话框的屏幕截图：导入 Maven 项目。")

单击 Finish 将这些项目导入 Eclipse 工作区中。接下来将构建可执行 JAR。

### 构建可执行 JAR

要构建 SpringBootDemo，还需要构建 odotCore 和 SpringBootDemo 项目。可以从命令行构建这些项目，就像在 HelloSpringBoot 应用程序中所操作的那样。在本例中，我将指导您使用 Eclipse。

在 Eclipse 中，右键单击 odotCore 项目。选择 **Run As > Maven Build**，指定 clean 和 install 目标。install 目标会将 odotCore-1.0-SNAPSHOT.jar JAR 文件安装到本地 Maven 存储库中。在运行 SpringBootDemo Maven 构建时，可从这里以依赖项形式拉入它。

odotCore Maven 构建成功运行后，右键单击 SpringBootDemo 项目，选择 **Run As > Maven Build**，然后指定 clean 和 package 目标。

> **备注**：odotCore 项目包含多个单元测试。尽管我从不建议跳过单元测试，但您可以设置在 Eclipse 中构建 odotCore 项目的运行配置，让其跳过这些测试（Run Configuration 对话框上有一个对应的复选框）。

成功构建 SpringBootDemo 后，可以从命令行运行 SpringBootDemo über JAR。

### 运行可执行 JAR

从 Mac 终端窗口或 Windows 命令提示中导航到 SpringBootDemo 目录。假设构建输出目录名为 target（这是默认设置），执行以下命令：

```bash
java -jar target/SpringBootDemo-1.0-SNAPSHOT.jar
```

现在静候 Spring Boot 运行该应用程序。当看到文本 “App Started” 时，就可以体验该应用程序了。

### 体验该应用程序

作为一次快速冒烟测试，为了确保您的应用程序正常运行，可打开一个浏览器窗口并输入以下 URL：

http://localhost:8080/CategoryRestService/FindAll

这会访问 CategoryRestService 的 FindAll 方法，以 JSON 格式返回数据库中的所有 Category 对象。

图 9. 通过浏览器访问 SpringBootDemo

![通过浏览器访问 SpringBootDemo 应用程序。](https://www.ibm.com/developerworks/cn/java/j-spring-boot-basics-perry/Figure-9.png "通过浏览器访问 SpringBootDemo 应用程序。")

也可以通过 SoapUI 体验该应用程序。我不会演示该如何做，但本教程的视频中介绍了该过程。

表 1 给出了 SpringBootDemo 的每个服务中的服务和方法。

表 1. oDoT (SpringBootDemo) 服务和方法

| 服务 | 方法 | HTTP 方法 | 示例 URL @ http://localhost:8080 | |
| :----- | :----- | :----- | :----- | :----- |
| 类别 | FindAll | GET | /CategoryRestService/FindAll | 查找数据库中的所有 Category 对象。 |
| 类别 | FindById | GET | /CategoryRestService/FindbyId/1 | 查找 ID 值为 1 的类别。 |
| 类别 | FindById | GET | /CategoryRestService/FindbyName/MY_CATEGORY | 查找名称值为 “MY_CATEGORY” 的类别。 |
| 类别 | Add | PUT | /CategoryRestService/Add | 将指定的类别（作为请求主体中的 JSON 有效负载）添加到数据库中。返回：添加的 Category 对象（作为响应主体中的 JSON）。 |
| 类别 | 更新 | POST | /CategoryRestService/Update | 更新数据库中的指定类别（作为请求主体中的 JSON 有效负载）。返回：表示更新状态的字符串消息。 |
| 类别 | 删除 | DELETE | /CategoryRestService/Delete | 删除数据库中的指定类别（作为请求主题中的 JSON 有效负载）。返回：表示删除状态的字符串消息。 |
| 项 | FindAll | GET | /ItemRestService/FindAll | 查找数据库中的所有 Category 对象。 |
| 项 | FindById | GET | /ItemRestService/FindbyId/1 | 查找 ID 值为 1 的类别。 |
| 项 | FindById | GET | /ItemRestService/FindbyName/TODO_ITEM_1 | 查找名称值为 “TODO_ITEM_1” 的项。 |
| 项 | Add | PUT | /ItemRestService/Add | 将指定项（作为请求主体中的 JSON 有效负载）添加到数据库中。返回：添加的 Item 对象（作为响应主体中的 JSON）。 |
| 项 | Update | POST | /ItemRestService/Update | 更新数据库中的指定项（作为请求主体中的 JSON 有效负载）。返回：表示更新状态的字符串消息。 |
| 项 | Delete | DELETE | /ItemRestService/Delete | 删除数据库中的指定项（作为请求主体中的 JSON 有效负载）。返回：表示删除状态的字符串消息。 |

建议研究该代码，试用它，以便更深入地了解 Spring Boot 的工作原理。

## 结束语

本教程介绍了 Spring Boot 解决的问题，并简要介绍了它的工作原理。然后我演练了设置和运行一个简单的 Spring Boot 应用程序 HelloSpringBoot 的过程。最后展示了如何使用 Spring Boot 构建和体验 Spring MVC RESTful Web 服务应用程序。

那么您接下来会怎么做？

## 相关主题

* [Spring Boot 是什么？](https://projects.spring.io/spring-boot/)
* [如何将 Spring Boot 应用程序部署到 IBM Liberty 和 WAS 8.5 中](http://www.adeveloperdiary.com/java/spring-boot/deploy-spring-boot-application-ibm-liberty-8-5/)
* [Spring Boot：构建 Spring 应用程序的现代方式](https://www.ibm.com/developerworks/community/blogs/3302cc3b-074e-44da-90b1-5055f1dc0d9c/entry/spring-boot?lang=zh)