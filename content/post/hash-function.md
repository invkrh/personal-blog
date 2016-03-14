---
title: Hash Function and Coprime Numbers
tags: [number theory, machine learning]
date: "2015-02-28"
---

## Problem:
Given a number $n \in \mathbb{N}^*$, find $(a, b) \in \mathbb{N}^2$, such that

<div>
$$ \{ y \mid y = (ax + b) \% n, \quad x \in \{0,1, ..., n-1\} \} = \{0,1, ..., n-1\} $$
</div>

, where $\%$ is modulo operator.

Note that this is an equation between two set, so element's order is not important.

For simplicity, mark the set on left hand side as set $A$, the right one as set $B$, so the equality becomes $\mid A \mid = \mid B \mid$

This makes the function $f(x) = (ax + b) \% n$ become a **perfect hashing function** which hashes the input $x$ to a set of integers, with *no* collision. Furthermore, since the modulo $n$ operation is used, then the domain and range are the *same*.

<div>
$$
f: \{0,1, .., n-1\} \rightarrow \{0,1, .., n-1\}
$$
</div>

## Example:
Given $n = 12$

1.

<div>
$$
\begin{array}{rll}
(3, 4) &\rightarrow &f(x) = (3x + 4) \% 12 \\
x = 0, 1, 2 .. 11 &\rightarrow &f(x) = 4, 7, 10, 1, 4, 7, 10, 1, 4, 7, 10, 1
\end{array}
$$
</div>

The result set $\{1,4,7,10\}$ does not contain all nature numbers between $0$ and $N - 1$, because we have some collision like: $f(0) = f(4), f(1) = f(5)$ .., etc.

So, $(3, 4)$ is not a validate pair.

2.

<div>
$$
\begin{array}{rll}
(7, 4) &\rightarrow &f(x) = (7x + 4) \% 12 \\
x = 0, 1, 2 .. 11 &\rightarrow &f(x) = 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2, 9
\end{array}
$$
</div>

Obviously, $(7, 4)$ is a validate pair we are looking for. No collision found here.

3.

<div>
$$
\begin{array}{rll}
(7, 5) &\rightarrow &f(x) = (7x + 5) \% 12 \\
x = 0, 1, 2 .. 11 &\rightarrow &f(x) = 5, 0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10
\end{array}
$$
</div>

Obviously, $(7, 5)$ is also a validate pair.

After trying out a lot of possible $(a, b)$ pairs, I found that when $a$ and $n$ are **co-prime**. no matter what $b$ is, $(a, b)$ are validate pair.

In addition, $b$ is not important in term of perfect hashing, but it is essential to generate further more distinct hash functions when $a$ is fixed. These functions just shift the sequence of the output w.r.t the fixed $a$, like in example 3. Randomly picking validate $a$ and $b$ gives a random sequence of output (pseudo random permutation).

Finally, we need to prove the hypothesis we found.

## Hypothesis:

Given a function $f(x) = (ax + b) \% n$, where $n \in \mathbb{N}^*$, $a,b \in \mathbb{N}$,
$a$ and $n$ are co-prime $\Longleftrightarrow \nexists x_1, x_2 \in \{0, 1, .., n-1\}$, $x_1 \neq x_2$, such that $f(x_1) = f(x_2)$ (no collision, perfect hashing)

## Demonstration:

> Sufficiency:

$\exists x_1, x_2 \in [0, n-1], x_1 \neq x_2$, such that $f(x_1) = f(x_2) \Rightarrow a$ and $n$ are *NOT* coprime

* Proof:

<div>
$$
\begin{array}{rcl}
f(x_1) = f(x_2) &\Rightarrow& (a\cdot x_1) \% n = (a\cdot x_2) \% n \\
&\Rightarrow& a\cdot x_1 - k\cdot n = a\cdot x_2 - k^\prime \cdot n \\
&\Rightarrow& a\cdot (x_1 - x_2) = (k - k^\prime) \cdot n
\end{array}
$$
</div>

Assume that $a$ and $b$ are co-prime. We know that $x_1 - x_2 \neq 0$ then

<div>
$$
\left \{
\begin{array}{rcl}
x_1 - x_2 &=& C \cdot n \\
k - k^\prime &=& C \cdot a
\end{array}
\right.
$$
</div>

, where $C \in \mathbf{N}^*$

So $x_1 - x_2 \ge n$

Knowing that $x_1, x_2 \in \{0, 1, .., n - 1\}$, then $x_1 - x_2 \le n-1 \Rightarrow$ *contradiction*

Hence, the assumption is broken, then $a$ and $b$ are *NOT* co-prime.

Sufficiency proved.

> Necessity:

$a$ and $n$ are *NOT* co-prime $\Rightarrow \exists x_1, x_2 \in {0,1,2, .., n-1}, x_1 \neq x_2$, such that $f(x_1) = f(x_2)$

* Proof:

Since $a$ and $n$ are *not* co-prime, then $a$ and $n$ can be factorized by the common prime factor, denoted as $p$ :

<div>
$$
\left \{
\begin{array}{ll}
a = p \cdot q \\
n = p \cdot q^\prime
\end{array}
\right.
$$
</div>

where $q, q^\prime \in \mathbb{N}^*$

then, $ (ax + b)\% n = y \rightarrow \exists k \in \mathbb{Z}$, such that $ a \cdot x + b = n \cdot k + y$, where $y \in \{0,1,2, .. n-1\}$

can be rewritten as:

$p \cdot q \cdot x + b = p \cdot q^\prime \cdot k + y \Longleftrightarrow p \cdot (q \cdot x-q^\prime \cdot k) = y - b$

Since $b$ is a free nature number, for simplicity, we can assume that $b \in {0,1,2, .., n-1}$, then there must be a $y = b$, our proof is focused on that $y$, then we get:

$q \cdot x-q^\prime \cdot k = 0$

Knowing that:

<div>
$$
\left \{
\begin{array}{ll}
x \in \{0,1,2, .., n-1\}\\
p < n \\
q^\prime < n
\end{array}
\right.
$$</div>

, then there are two solution for $\{x, k\}$:

<div>
$$
\left \{
\begin{array}{ll}
x = q^\prime\\
k = q
\end{array}
\right.
$$
</div>

<div>
$$   
\left \{
\begin{array}{ll}
x = 0\\
k = 0
\end{array}
\right.
$$
</div>

then $f(0) = f(q^\prime)$, which is what we want to prove.

You may wonder what if $b \ge n$. Essentially, this case could be normalized to $b \in {0,1,2, .., n-1}$:

<div>
$$
\begin{array}{rcl}
y = (a \cdot x + b) \% n = [(a \cdot x \% n) + (b \% n)] \% n &\Rightarrow& (a \cdot x \% n) + (b \% n) = k \cdot n + y \\
&\Rightarrow& (a \cdot x - k^\prime \cdot n) + b \% n = k \cdot n + y \\
&\Rightarrow& a \cdot x + b \% n = (k + k^\prime) \cdot n + y
\end{array}
$$
</div>

, where $\quad k \in \mathbb{Z}, \quad k^\prime \in \mathbb{Z}$

now for a given $y$, we can take a $b$ such that, $b \% n = y$, that leads to

<div>
$$a \cdot x = k^{\prime\prime} \cdot n$$
</div>

, where $k^{\prime\prime} = k + k^\prime$.

This is what we just proved.

Necessity proved.

Q.E.D.

## Diversity analysis

If we just want to find *one* perfect hashing function, it is true that $a$ could just be any prime number which is not a prime factor of $n$.

We have a prime number pool in hand, then randomly pick those not the prime factor of $n$ to be an $a$, that's it.

So far so good.

But if we need to generate as many as possible different this kind of perfect hash function, now we get a problem here.

Let's take an example:

Given $n=4$, then $a$ can not be $2$

you can try as many as possible different prime number $a$, you will just find the following sequence:

$ f(0) = 0, f(1) = 1, f(2) = 2, f(3) = 3 $

$ f(0) = 0, f(1) = 3, f(2) = 2, f(3) = 1 $

you will never get a sequence like the following situation :

**case 1:** $ f(0) = 0, f(1) = 2, f(2) = 1, f(3) = 3 $

**case 2:** $ f(0) = 0, f(1) = 3, f(2) = 1, f(3) = 2 $

WHY ?

For **case 1**,

For simplicity, we can pose that $b = 0$

$f(0) = 0 \rightarrow a\cdot 0 = 4k + 0 \rightarrow k = 0$

But, $f(1) = 2 \rightarrow a\cdot 1 = 4k + 2$ has no solution, since $a$ must be a odd number (a prime number which is not $2$) and $4k + 2 = 2 (2k +1) $ must be a even number.

Hence, $f(1) \neq 2$.

The lack of diversity is obvious when $n$ is a even number.

Even when $n$ is a odd number, the incompleteness still exists.

If we take a close at **case 2**, we find that

<div>
$$
\begin{array}{clc}
f(1) - f(0) &= 3\\
f(2) - f(1) &= -2\\
f(3) - f(2) &= 1
\end{array}
$$
</div>

The delta between two successive function values is not unique. This kind of sequence can not be generated by our hash function $f(x) = (ax +b)\%n$, since the function value is increased by a unique step $a \% n$, which is easy to prove.

Hence, the function $f(x) = (ax +b)\%n$ can not generate all the possible sequence for a given $n$. The number of sequence could be generated is easy to compute, which is equal to $p \cdot n $, where $p$ is the number of $n$'s coprime numbers(1 included) which are less than $n$ (as we have **modulo** here). A validate $a$ gives a validate step, a step gives a validate sequence start with 0, while $b$ can increment each function value by $b\%n$. As $b$ can be any value, a 0-leading sequence can have $n$ derivative sequences. That's why $p \cdot n$

Let's take again the example $n=4$, $\{1, 3\}$ is validate step. So $n \cdot p == 4 \cdot 2 = 8$. As a result, for $n=4$, there are $\frac{8}{4!} = \frac{1}{3}$ distinct sequences can be reached by our hash function model.

There are another hash function model can be used in order to get more distinct sequence:

Given $n$, find the prime number $p$ which is bigger than $n$, then $a$ can be any number below $p$. Hence, the number of sequence distinct is $p^2 (\ge n^2)$. Note that the diversity is gained by loosing the constraint, because in this way, the function value can be any nature number between $0$ and $p$. It is not equivalent to permutation, but what's important is that it is a perfect hashing. That depends on your need. And in my [spark-LSH](https://github.com/invkrh/spark-LSH) project, such model is used in order to generate more min hash functions.

This variant could be used where $n$ is not big enough to generate many hash functions than needed.

We can conclude that the incompleteness of sequence will exist for sure. In practice, as $n$ a large number, the generated distinct sequences are already enough. Even if it is not complete, we can still do the right thing.

## Use case

Given a large amounts of sets where each set has lots of elements, Locality-Sensitive Hashing (LSH) is used to find same sets or similar sets quickly and accurately.

The whole data set can be represented as a matrix, where each column corresponds to a set and each row corresponds to a universal element of all sets.

What we need to do is to find all the columns which are exactly the same or similar to some extent.

However, it is an *expensive* operation to compare two large column.

What we do is use a min-hash function to hash a set to a signature. By hashing a set to a signature multiple times, we get the same number of signature for the set, which is a much smaller vector than the universal element vector and more easy to compare.

The signature is created by permutation of rows, and for each column, take the row number of the first row where the value is 1.

Actually, permutation all rows of a large matrix is very expensive. Instead, we create a hash function which takes a row number as input, and the output is a row number after permutation. It is obvious that the input and output are in the same range [0, # total rows -1], and even if the inputs are in order, the output can be in any order. This is exactly the functions we discussed in previous sections.

Given a total row number $n$, we just pick a random nature number $a$ which is co-prime to $n$, then the function is created easily:

<div>
$$
f(x) = (a\cdot x + b) \% n
$$
</div>

When creating a signature, we don't need to hash $n$ rows numbers, we will filter all rows where the value is 1 and hash these row numbers, finally, we take the smallest hashed row number as the signature.

The theory behind this method is that:

<div>
$$P[h_{min}(A) = h_{min}(B)] = J(A, B)$$, where $$J(A, B) = \frac{\#(A \cap B)}{\#(A \cup B)}$$
</div>

The probability that the min-hash value of two sets is the **Jaccard similarity** of $A$ and $B$.

The proof is that:

<div>
$h_{min}(A)=h_{min}(B)$ if and only if $h_{min}(A \cup B)=h_{min}(A)=h_{min}(B)$. Let $x$ be the member of $A\cup B$ that produces the minimum hash value. The probability that $A$ and $B$ share the minimum hash is equivalent to the probability that $x$ is in both $A$ and $B$. Since any element of $A\cup B$ has an equal chance of having the *unique* minimum hash value, it becomes $P[h_{min}(A) = h_{min}(B)] = \frac{\#(A \cap B)}{\#(A \cup B)}$
</div>

Now, let's take an example:

$A = \{a, b\}$ and $B = \{a, c\}$, the universal set is $\{a,b,c,d\}$

the matrix is:

element|A|B
---|---|---
a|1|1
b|1|0
c|0|1
d|0|0

$n = 4$, a hash function can be $f(x) = (3*x + 2) \% 4$.

For $A$, $\{0,1\}$ are row numbers we need to check:

<div>
$$
\left \{
\begin{array}{ll}
f(0) = 2\\
f(1) = 1
\end{array}
\right. \Rightarrow h_{min}(A) = 1
$$
</div>

, which is the signature of $A$

the same for $B$,

<div>
$$
\left \{
\begin{array}{ll}
f(0) = 2\\
f(2) = 0
\end{array}
\right. \Rightarrow h_{min}(B) = 0
$$
</div>

, which is the signature of $B$

<div>
We need to compute some more $h_{min}$ in order to estimate $P[h_{min}(A) = h_{min}(B)]$, which is the Jaccard similarity of $A$ and $B$   
</div>