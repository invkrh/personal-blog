---
title: Distribute non-serializable objects in Spark
tags: [Spark]
date: 2016-01-16T23:06:08+01:00
draft: true
---

Recently, I’ve been playing with Docker and DaoCloud and I found both of them amazing. So I decided to see what they could do on dockerizing my Hugo site and integrate it with DaoCloud’s CI service. The main workflow is like this: I setup a repo of my dockerized site on Github, and everytime I commit the changes to the repo with a new tag, it will automatically trigger DaoCloud to build and update this very site.

This is some text $\frac{1}{2}$ other text $f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi$

$$
\begin{array}{clc}
(3, 4) & \rightarrow f(x) = (3x + 4) \% 12 \\
x = 0, 1, 2 ... 11 & \rightarrow f(x) = 4, 7, 10, 1, 4, 7, 10, 1, 4, 7, 10, 1
\end{array}
$$

If an non-serializable object is created on driver, you can not send it to the executors *direactly*.

Three ways to do that:

1.  create `RDD` in `Spark Context`
2.  create
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
