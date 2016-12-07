---
title: Distribute (non-serializable) objects in Spark
tags: [Spark]
categories: [development]
date: 2016-01-16T23:06:08+01:00
draft: true
---

### Foreword

In this blog post, we will talk about how to distribute objects to spark executors properly and efficiently.
We will pay a lot of attention on the non-serializable objects because:

* They can not be distributed **directly** and often comes up with the famous `Task not serializable` exception.
* If an object is thread-safe, we really want it to be shared by threads by creating this kind of objects as few as possible .

### Distribute serializable object

When writing spark jobs with some `RDD` APIs, it is common to reference an object outside a closure.

Let's take a trivial example of serializable object:

```scala
class Ser(val a: Int) extends Serializable

val ref = new Ser(1) // referenced object
rdd // 100 elements, 4 partitions, 25 elements / partition
  .map {
  // closure
  x => x + ref.a
}
```

What happens here is that `serObj` is included in the closure distributed to executors.
Since `map` is a narrow dependence and the origin `rdd` has 4 partition, we have 4 tasks here.
Each task corresponds to a closure.
So object `serObj` is packaged into each task and sent to corresponding executors (4 times).

This works well, if the size of the distributed object and # partitions are not too big. Otherwise, broadcast variables is needed.

```scala
val bv = sc.broadcast(new Ser(1))
rdd.map { x => x + bv.value.a }
```

Not like the referenced object in closure which is send along with each task. The object is broadcast to each node only once, which saves a lot of bandwidth of network.

### "Distribute" non-serializable object

If an object is non-serializable, things become complicated.
Most of the spark users might encounter the following exception.

```java
org.apache.spark.SparkException: Task not serializable
  ...
Caused by: java.io.NotSerializableException: xxxxxx
  ...
Serialization stack:
  ...
```
If an non-serializable object is created on driver, you can not just send it to the executors *direactly* as describe in the previous section. In stead, you have to create the object on executors.

You may have some choice:

1.  Put the non-serializable object into an `object`
2.  Create `RDD` in `Spark Context`
3.  create

<script src="https://gist.github.com/invkrh/54f3d795b2719f600bef.js"></script>

Code example:

```scala
/**
 * A person has a name and an age.
 */
case class Person(name: String, age: Int)

abstract class Vertical extends CaseJeu
case class Haut(a: Int) extends Vertical
case class Bas(name: String, b: Double) extends Vertical

sealed trait Ior[+A, +B]
case class Left[A](a: A) extends Ior[A, Nothing]
case class Right[B](b: B) extends Ior[Nothing, B]
case class Both[A, B](a: A, b: B) extends Ior[A, B]

trait Functor[F[_]] {
  def map[A, B](fa: F[A], f: A => B): F[B]
}

// beware Int.MinValue
def absoluteValue(n: Int): Int =
  if (n < 0) -n else n

def interp(n: Int): String =
  s"there are $n ${color} balloons.\n"

type ξ[A] = (A, A)

trait Hist { lhs =>
  def ⊕(rhs: Hist): Hist
}

def gsum[A: Ring](as: Seq[A]): A =
  as.foldLeft(Ring[A].zero)(_ + _)

val actions: List[Symbol] =
  'init :: 'read :: 'write :: 'close :: Nil

trait Cake {
  type T;
  type Q
  val things: Seq[T]
  @override
  abstract class Spindler

  def spindle(s: Spindler, ts: Seq[T], reversed: Boolean = false): Seq[Q]
}

val colors = Map(
  "red"       -> 0xFF0000,
  "turquoise" -> 0x00FFFF,
  "black"     -> 0x000000,
  "orange"    -> 0xFF8040,
  "brown"     -> 0x804000)

lazy val ns = for {
  x <- 0 until 100
  y <- 0 until 100
} yield (x + y) * 33.33
```
