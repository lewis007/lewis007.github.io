---
layout: blog
title: 深入理解 Java 函数式编程，第 2 部分
subtitle: 函数式编程中的重要概念
author: 成富
time: 2018-12-03
categories: IBM-Developer
tags: Java
---

> 原文地址：https://www.ibm.com/developerworks/cn/java/j-understanding-functional-programming-2/index.html
> 
> **系列内容：**
> 
> 此内容是该系列 5 部分中的第 2 部分： **深入理解 Java 函数式编程**
> * [第 1 部分: 函数式编程思想概论](functional-programming-1.html)
> * 第 2 部分: 函数式编程中的重要概念
> * [第 3 部分: Java 8 的 Lambda 表达式和流处理](functional-programming-3.html)
> * [第 4 部分: 使用 Vavr 进行函数式编程](functional-programming-4.html)
> * [第 5 部分: 深入解析 Monad](functional-programming-5.html)

本系列的[上一篇](functional-programming-1.html)文章对函数式编程思想进行了概述，本文将系统地介绍函数式编程中的常见概念。这些概念对大多数开发人员来说可能并不陌生，在日常的编程实践中也比较常见。

## 函数式编程范式的意义

在众多的编程范式中，大多数开发人员比较熟悉的是面向对象编程范式。一方面是由于面向对象编程语言比较流行，与之相关的资源比较丰富；另外一方面是由于大部分学校和培训机构的课程设置，都选择流行的面向对象编程语言。面向对象编程范式的优点在于其抽象方式与现实中的概念比较相近。比如，学生、课程、汽车和订单等这些现实中的概念，在抽象成相应的类之后，我们很容易就能理解类之间的关联关系。这些类中所包含的属性和方法可以很直观地设计出来。举例来说，学生所对应的类 Student 就应该有姓名、出生日期和性别等基本的属性，有方法可以获取到学生的年龄、所在的班级等信息。使用面向对象的编程思想，可以直观地在程序要处理的问题和程序本身之间，建立直接的对应关系。这种从问题域到解决域的简单对应关系，使得代码的可读性很强。对于初学者来说，这极大地降低了上手的难度。

函数式编程范式则相对较难理解。这主要是由于函数所代表的是抽象的计算，而不是具体的实体。因此比较难通过类比的方式来理解。举例来说，已知直角三角形的两条直角边的长度，需要通过计算来得到第三条边的长度。这种计算方式可以使用函数来表示。length(a, b)=√a²+b² 就是具体的计算方式。这样的计算方式与现实中的实体没有关联。

基于计算的抽象方式可以进一步提高代码的复用性。在一个学生信息管理系统中，可能会需要找到一个班级的某门课程的最高分数；在一个电子商务系统中，也可能会需要计算一个订单的总金额。看似风马牛不相及的两件事情，其实都包含了同样的计算在里面。也就是对一个可迭代的对象进行遍历，同时在遍历的过程中执行自定义的操作。在计算最高分数的场景中，在遍历的同时需要保存当前已知最高分数，并在遍历过程中更新该值；在计算订单总金额的场景中，在遍历的同时需要保存当前已累积的金额，并在遍历过程中更新该值。如果用 Java 代码来实现，可以很容易写出如下两段代码。

清单 1 计算学生的最高分数。

清单 1. 计算学生的最高分数的代码

```java
int maxMark = 0;
for (Student student : students) {
    if (student.getMark() > maxMark) {
        maxMark = student.getMark();
    }
}
```

清单 2 计算订单的总金额。

清单 2. 计算订单的总金额的代码

```java
BigDecimal total = BigDecimal.ZERO;
for (LineItem item : order.getLineItems()) {
    total = total.add(item.getPrice().multiply(new BigDecimal(item.getCount())));
}
```

在面向对象编程的实现中，这两段代码会分别添加到课程和订单所对应的类的某个方法中。课程对应的类 Course 会有一个方法叫 getMaxMark，而订单对应的类 Order 会有一个方法叫 getTotal。尽管在实现上存在很多相似性和重复代码，由于课程和订单是两个完全不相关的概念，并没有办法通过面向对象中的继承或组合机制来提高代码复用和减少重复。而函数式编程可以很好地解决这个问题。

我们来进一步看一下清单 1 和清单 2 中的代码，尝试提取其中的计算模式。该计算模式由 3 个部分组成：

* 保存计算结果的状态，有初始值。
* 遍历操作。
* 遍历时进行的计算，更新保存计算结果的状态值。

把这 3 个元素提取出来，用伪代码表示，就得到了清单 3 中用函数表示的计算模式。iterable 表示被迭代的对象，updateValue 是遍历时进行的计算，initialValue 是初始值。

清单 3. 计算模式的伪代码

```js
function(iterable, updateValue, initialValue) {
    value = initialValue
    loop(iterable) {
        value = updateValue(value, currentValue)
    }
    return value
}
```

了解函数式编程的读者应该已经看出来了，这就是常用的 reduce 函数。使用 reduce 对清单 1 和清单 2 进行改写，可以得到清单 4 中的两段新的代码。

清单 4. 使用 reduce 函数改写代码

```java
reduce(students, (mark, student) -> {
    return Math.max(student.getMark(), mark);
}, 0);
 
reduce(order.lineItems, (total, item) -> {
    return total.add(item.getPrice().multiply(new BigDecimal(item.getCount())))
}, BigDecimal.ZERO);
```

## 函数类型与高阶函数

对函数式编程支持程度高低的一个重要特征是函数是否作为编程语言的一等公民出现，也就是编程语言是否有内置的结构来表示函数。作为面向对象的编程语言，Java 中使用接口来表示函数。直到 Java 8，Java 才提供了内置标准 API 来表示函数，也就是 java.util.function 包。Function<T, R> 表示接受一个参数的函数，输入类型为 T，输出类型为 R。Function 接口只包含一个抽象方法 R apply(T t)，也就是在类型为 T 的输入 t 上应用该函数，得到类型为 R 的输出。除了接受一个参数的 Function 之外，还有接受两个参数的接口 BiFunction<T, U, R>，T 和 U 分别是两个参数的类型，R 是输出类型。BiFunction 接口的抽象方法为 R apply(T t, U u)。超过 2 个参数的函数在 Java 标准库中并没有定义。如果函数需要 3 个或更多的参数，可以使用第三方库，如 Vavr 中的 Function0 到 Function8。

除了 Function 和 BiFunction 之外，Java 标准库还提供了几种特殊类型的函数：

* Consumer<T>：接受一个输入，没有输出。抽象方法为 void accept(T t)。
* Supplier<T>：没有输入，一个输出。抽象方法为 T get()。
* Predicate<T>：接受一个输入，输出为 boolean 类型。抽象方法为 boolean test(T t)。
* UnaryOperator<T>：接受一个输入，输出的类型与输入相同，相当于 Function<T, T>。
* BinaryOperator<T>：接受两个类型相同的输入，输出的类型与输入相同，相当于 BiFunction<T,T,T>。
* BiPredicate<T, U>：接受两个输入，输出为 boolean 类型。抽象方法为 boolean test(T t, U u)。

在本系列的第一篇文章中介绍 λ 演算时，提到了高阶函数的概念。λ 项在定义时就支持以 λ 项进行抽象和应用。具体到实际的函数来说，高阶函数以其他函数作为输入，或产生其他函数作为输出。高阶函数使得函数的组合成为可能，更有利于函数的复用。熟悉面向对象的读者对于对象的组合应该不陌生。在划分对象的职责时，组合被认为是优于继承的一种方式。在使用对象组合时，每个对象所对应的职责单一。多个对象通过组合的方式来完成复杂的行为。函数的组合类似对象的组合。上一节中提到的 reduce 就是一个高阶函数的示例，其参数 updateValue 也是一个函数。通过组合，reduce 把一部分逻辑代理给了作为其输入的函数 updateValue。不同的函数的嵌套层次可以很多，完成复杂的组合。

在 Java 中，可以使用函数类型来定义高阶函数。上述函数接口都可以作为方法的参数和返回值。Java 标准 API 已经大量使用了这样的方式。比如 Iterable 的 forEach 方法就接受一个 Consumer 类型的参数。

在清单 5 中，notEqual 返回值是一个 Predicate 对象，并使用在 Stream 的 filter 方法中。代码运行的输出结果为 2 和 3。

清单 5. 高阶函数示例

```java
public class HighOrderFunctions {

    private static <T> Predicate<T> notEqual(T t) {
        return (v) -> !Objects.equals(v, t);
    }
​
    public static void main(String[] args) {
        List.of(1, 2, 3)
            .stream()
            .filter(notEqual(1))
            .forEach(System.out::println);
    }

}
```

## 部分函数

部分函数（partial function）是指仅有部分输入参数被绑定了实际值的函数。清单 6 中的函数 f(a, b, c) = a + b + c 有 3 个参数 a、b 和 c。正常情况下调用该函数需要提供全部 3 个参数的值。如果只提供了部分参数的值，如只提供了 a 值，就得到了一个部分函数，其中参数 a 被绑定成了给定值。假设给定的参数 a 的值是 1，那新的部分函数的定义是 fa(b, c) = 1 + b + c。由于 a 的实际值可以有无穷多，也有对应的无穷多种可能的部分函数。除了只对 a 绑定值之外，还可以绑定参数 b 和 c 的值。

清单 6. 部分函数示例

```js
function f(a, b, c) {
    return a + b + c;
}
​
function fa(b, c) {
    return f(1, b, c);
}
```

部分函数可以用来为函数提供快捷方式，也就是预先绑定一些常用的参数值。比如函数 add(a, b) = a + b 用来对 2 个参数进行相加操作。可以在 add 基础上创建一个部分函数 increase，把参数 b 的值绑定为 1。increase 相当于进行加 1 操作。同样的，把参数值 b 绑定为 -1 可以得到函数 decrease。

Java 标准库并没有提供对部分函数的支持，而且由于只提供了 Function 和 BiFunction，部分函数只对 BiFunction 有意义。不过我们可以自己实现部分函数。部分函数在绑定参数时有两种方式：一种是按照从左到右的顺序绑定参数，另外一种是按照从右到左的顺序绑定参数。这两个方式分别对应于 清单 7 中的 partialLeft 和 partialRight 方法。这两个方法把一个 BiFunction 转换成一个 Function。

清单 7. 部分函数的 Java 实现

```java
public class PartialFunctions {

    private static  <T, U, R> Function<U, R> partialLeft(BiFunction<T, U, R> biFunction, T t) {
        return (u) -> biFunction.apply(t, u);
    }
​
    private static  <T, U, R> Function<T, R> partialRight(BiFunction<T, U, R> biFunction, U u) {
        return (t) -> biFunction.apply(t, u);
    }
​​
    public static void main(String[] args) {
        BiFunction<Integer, Integer, Integer> biFunction = (v1, v2) -> v1 - v2;
        Function<Integer, Integer> subtractFrom10 = partialLeft(biFunction, 10);
        Function<Integer, Integer> subtractBy10 = partialRight(biFunction, 10);
        System.out.println(subtractFrom10.apply(5)); // 5
        System.out.println(subtractBy10.apply(5));   // -5
   }

}
```

## 柯里化

柯里化（currying）是与 λ 演算相关的重要概念。通过柯里化，可以把有多个输入的函数转换成只有一个输入的函数，从而可以在 λ 演算中来表示。柯里化的名称来源于数学家 Haskell Curry。Haskell Curry 是一位传奇性的人物，以他的名字命令了 3 种编程语言，Haskell、Brook 和 Curry。柯里化是把有多个输入参数的求值过程，转换成多个只包含一个参数的函数的求值过程。对于清单 6 的函数 f(a, b, c)，在柯里化之后转换成函数 g，则对应的调用方式是 g(a)(b)(c)。函数 (x, y) -> x + y 经过柯里化之后的结果是 x -> (y -> x + y)。

柯里化与部分函数存在一定的关联，但两者是有区别的。部分函数的求值结果永远是实际的函数调用结果；而柯里化函数的求值结果则可能是另外一个函数。以清单 6 的部分函数 fa 为例，每次调用 fa 时都必须提供剩余的 2 个参数。求值的结果都是具体的值；而调用柯里化之后的函数 g(a) 得到的是另外的一个函数。只有通过递归的方式依次求值之后，才能得到最终的结果。

## 闭包

闭包（closure）是函数式编程相关的一个重要概念，也是很多开发人员比较难以理解的概念。很多编程语言都有闭包或类似的概念。

在上一篇文章介绍 λ 演算的时候提到过 λ 项的自由变量和绑定变量，如 λx.x+y 中的 y 就是自由变量。在对 λ 项求值时，需要一种方式可以获取到自由变量的实际值。由于自由变量不在输入中，其实际值只能来自于执行时的上下文环境。实际上，闭包的概念来源于 1960 年代对 λ 演算中表达式求值方式的研究。

闭包的概念与高阶函数密切相关。在很多编程语言中，函数都是一等公民，也就是存在语言级别的结构来表示函数。比如 Python 中就有函数类型，JavaScript 中有 function 关键词来创建函数。对于这样的语言，函数可以作为其他函数的参数，也可以作为其他函数的返回值。当一个函数作为返回值，并且该函数内部使用了出现在其所在函数的词法域（lexical scope）的自由变量时，就创建了一个闭包。我们首先通过一段简单的 JavaScript 代码来直观地了解闭包。

清单 8 中的函数 idGenerator 用来创建简单的递增式的 ID 生成器。参数 initialValue 是递增的初始值。返回值是另外一个函数，在调用时会返回并递增 count 的值。这段代码就用到了闭包。idGenerator 返回的函数中使用了其所在函数的词法域中的自由变量 count。count 不在返回的函数中定义，而是来自包含该函数的词法域。在实际调用中，虽然 idGenerator 函数的执行已经结束，其返回的函数 genId 却仍然可以访问 idGenerator 词法域中的变量 count。这是由闭包的上下文环境提供的。

清单 8. JavaScript 中的闭包示例

```java
function idGenerator(initialValue) {
    let count = initialValue;
    return function() {
        return count++;
    };
}
​
let genId = idGenerator(0);
genId(); // 0
genId(); // 1
```

从上述简单的例子中，可以得出来构成闭包的两个要件：

* 一个函数
* 负责绑定自由变量的上下文环境

函数是闭包对外的呈现部分。在闭包创建之后，闭包的存在与否对函数的使用者是透明的。比如清单 8 中的 genId 函数，使用者只需要调用即可，并不需要了解背后是否有闭包的存在。上下文环境则是闭包背后的实现机制，由编程语言的运行时环境来提供。该上下文环境需要为函数创建一个映射，把函数中的每个自由变量与闭包创建时的对应值关联起来，使得闭包可以继续访问这些值。在 idGenerator 的例子中，上下文环境负责关联变量 count 的值，该变量可以在返回的函数中继续访问和修改。

从上述两个要件也可以得出闭包这个名字的由来。闭包是用来封闭自由变量的，适合用来实现内部状态。比如清单 8 中的 count 是无法被外部所访问的。一旦 idGenerator 返回之后，唯一的引用就来自于所返回的函数。在 JavaScript 中，闭包可以用来实现真正意义上的私有变量。

从闭包的使用方式可以得知，闭包的生命周期长于创建它的函数。因此，自由变量不能在堆栈上分配；否则一旦函数退出，自由变量就无法继续访问。因此，闭包所访问的自由变量必须在堆上分配。也正因为如此，支持闭包的编程语言都有垃圾回收机制，来保证闭包所访问的变量可以被正确地释放。同样，不正确地使用闭包可能造成潜在的内存泄漏。

闭包的一个重要特性是其中的自由变量所绑定的是闭包创建时的值，而不是变量的当前值。清单 9 是一个简单的 HTML 页面的代码，其中有 3 个按钮。用浏览器打开该页面时，点击 3 个按钮会发现，所弹出的值全部都是 3。这是因为当点击按钮时，循环已经执行完成，i 的当前值已经是 3。所以按钮的 click 事件处理函数所得到是 i 的当前值 3。

清单 9. 闭包绑定值的演示页面

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Test</title>
</head>
<body>
    <button>Button 1</button>
    <button>Button 2</button>
    <button>Button 3</button>
</body>
<script>
    var buttons = document.getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {          
        buttons[i].addEventListener("click", function() {
            alert(i);              
        });
    }
</script>
</html>
```

如果把 JavaScript 代码改成清单 10 所示，就可以得到所期望的结果。我们创建了一个匿名函数并马上调用该函数来返回真正的事件处理函数。处理函数中访问的变量 i 现在成为了闭包的自由变量，因此 i 的值被绑定到闭包创建时的值，也就是每个循环执行过程中的实际值。

清单 10. 使用闭包解决绑定值的问题

```js
var buttons = document.getElementsByTagName("button");
for (var i = 0; i < buttons.length; i++) {          
    buttons[i].addEventListener("click", function(i) {
        return function() {
            alert(i);              
        }
    }(i));
}
```

在 Java 中有与闭包类似的概念，那就是匿名内部类。在匿名内部类中，可以访问词法域中声明为 final 的变量。不是 final 的变量无法被访问，会出现编译错误。匿名内部类提供了一种方式来共享局部变量。不过并不能对该变量的引用进行修改。在清单  11 中，变量 latch 被两个匿名内部类所使用。

清单 11. Java 中的匿名内部类

```java
public class InnerClasses {
​
    public static void main(String[] args) {
        final CountDownLatch latch = new CountDownLatch(1);
        ​
        final Future<?> task1 = ForkJoinPool.commonPool().submit(() -> {
            try {
                Thread.sleep(ThreadLocalRandom.current().nextInt(2000));
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                latch.countDown();
            }
        });
        ​
        final Future<?> task2 = ForkJoinPool.commonPool().submit(() -> {
            final long start = System.currentTimeMillis();
            try {
                latch.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                System.out.println("Done after " + (System.currentTimeMillis() - start) + "ms");
            }
        });
        ​
        try {
            task1.get();
            task2.get();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

}
```

可以被共享的变量必须声明为 final。这个限制只对变量引用有效。只要对象本身是可变的，仍然可以修改该对象的内容。比如一个 List 类型的变量，虽然对它的引用是 final 的，仍然可以通过其方法来修改 List 内部的值。

## 递归

递归（recursion）是编程中的一个重要概念。很多编程语言，不仅限于函数式编程语言，都有递归这样的结构。从代码上来说，递归允许一个函数在其内部调用该函数自身。有些函数式编程语言并没有循环这样的结构，而是通过递归来实现循环。递归和循环在表达能力上是相同的，只不过命令式编程语言偏向于使用循环，而函数式编程语言偏向于使用递归。递归的优势在于天然适合于那些需要用分治法（divide and conquer）解决的问题，把一个大问题划分成小问题，以递归的方式解决。经典的通过递归解决的问题包括阶乘计算、计算最大公约数的欧几里德算法、汉诺塔、二分查找、树的深度优先遍历和快速排序等。

递归分为单递归和多递归。单递归只包含一个对自身的引用；而多递归则包含多个对自身的引用。单递归的例子包括列表遍历和计算阶乘等；多递归的例子包括树遍历等。在具体的编程实践中，单递归可以比较容易改写成使用循环的形式，而多递归则一般保持递归的形式。清单 12 给出了 JavaScript 实现的计算阶乘的递归写法。

清单 12. 递归方式计算阶乘

```js
int fact(n) {
    if (n === 0) {
        return 1;
    } else {
        return n * fact(n - 1);
    }
}
```

而下面的清单 13 则是 JavaScript 实现的使用循环的写法。

清单 13. 循环方式计算阶乘

```js
int fact_i(n) {
    let result = 1;
    for (let i = n; i > 0; i--) {
        result = result * i;
    }
    return result;
}
```

有一种特殊的递归方式叫尾递归。如果函数中的递归调用都是尾调用，则该函数是尾递归函数。尾递归的特性使得递归调用不需要额外的空间，执行起来也更快。不少编程语言会自动对尾递归进行优化。

下面我们以欧几里德算法来说明一下尾递归。该算法的 Java 实现比较简单，如清单 14 所示。函数 gcd 的尾调用是递归调用 gcd 本身。

清单 14. 尾递归的方式实现欧几里德算法

```java
int gcd(x, y) {
    if (y == 0) {
        return x;
    }
    return gcd(y, x % y);
}
```

尾递归的特性在于实现时可以复用函数的当前调用栈的帧。当函数执行到尾调用时，只需要简单的 goto 语句跳转到函数开头并更新参数的值即可。相对于循环，递归的一个大的问题是层次过深的函数调用栈导致占用内存空间过大。对尾递归的优化，使得递归只需要使用与循环相似大小的内存空间。

## 记忆化

记忆化（memoization）也是函数式编程中的重要概念，其核心思想是以空间换时间，提高函数的执行性能，尤其是使用递归来实现的函数。使用记忆化要求函数具有引用透明性，从而可以把函数的调用结果与调用时的参数关联起来。通常是做法是在函数内部维护一个查找表。查找表的键是输入的参数，对应的值是函数的返回结果。在每次调用时，首先检查内部的查找表，如果存在与输入参数对应的值，则直接返回已经记录的值。否则的话，先进行计算，再用得到的值更新查找表。通过这样的方式可以避免重复的计算。

最典型的展示记忆化应用的例子是计算斐波那契数列 (Fibonacci sequence)。该数列的表达式是 F[n] = F[n-1] + F[n-2] (n >= 2, F[0] = 0, F[1] = 1)。清单 15 是斐波那契数列的一个简单实现，直接体现了斐波那契数列的定义。函数 fib 可以正确完成数列的计算，但是性能极差。当输入 n 的值稍微大一些的时候，计算速度就非常之慢，甚至会出现无法完成的情况。这是因为里面有太多的重复计算。比如在计算 fib(4) 的时候，会计算 fib(3) 和 fib(2)。在计算 fib(3) 的时候，也会计算 fib(2)。由于 fib 函数的返回值仅由参数 n 决定，当第一次得出某个 n 对应的结果之后，就可以使用查找表把结果保存下来。这里需要使用 BigInteger 来表示值，因为 fib 函数的值已经超出了 Long 所能表示的范围。

清单 15. 计算斐波那契数列的朴素实现

```java
import java.math.BigInteger;

public class Fib {

    public static void main(String[] args) {
        System.out.println(fib(40));
    }

    private static BigInteger fib(int n) {
        if (n == 0) {
            return BigInteger.ZERO;
        } else if (n == 1) {
            return BigInteger.ONE;
        }
        return fib(n - 1).add(fib(n - 2));
    }

}
```

清单 16 是使用记忆化之后的计算类 FibMemoized。已经计算的值保存在查找表 lookupTable 中。每次计算之前，首先查看查找表中是否有值。改进后的函数的性能有了数量级的提升，即便是 fib(100) 也能很快完成。

清单 16. 使用记忆化的斐波那契数列计算

```java
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

public class FibMemoized {

    public static void main(String[] args) {
        System.out.println(fib(100));
    }

    private static Map<Integer, BigInteger> lookupTable = new HashMap<>();

    static {
        lookupTable.put(0, BigInteger.ZERO);
        lookupTable.put(1, BigInteger.ONE);
    }

    private static BigInteger fib(int n) {
        if (lookupTable.containsKey(n)) {
            return lookupTable.get(n);
        } else {
            BigInteger result = fib(n - 1).add(fib(n - 2));
            lookupTable.put(n, result);
            return result;
        }
    }

}
```

很多函数式编程库都提供了对记忆化的支持，会在本系列后续的文章中介绍。

## 总结

本文对函数式编程相关的一些重要概念做了系统性介绍。理解这些概念可以为应用函数式编程实践打下良好的基础。本文首先介绍了函数式编程范式的意义，接着介绍了函数类型与高阶函数、部分函数、柯里化、闭包、递归和记忆化等概念。[下一篇](functional-programming-3.html)文章将介绍 Java 8 所引入的 Lambda 表达式和流处理。

## 参考资源

* 了解更多关于[柯里化](https://en.wikipedia.org/wiki/Currying)的内容。
* 了解更多关于[递归](https://en.wikipedia.org/wiki/Recursion_(computer_science))的内容。
* 了解更多关于[记忆化](https://en.wikipedia.org/wiki/Memoization)的内容。