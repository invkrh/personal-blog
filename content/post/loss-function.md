---
title: Loss Function in Logistic Regression
tags: [logistic regression]
categories: [machine learning]
date: "2015-03-30"
---

Logistic regression is usually used to classify points in a multi-dimensional space. A data set in which each point is labeled into *positive* and *negative* is given. The coordinate of each data point is known, which is called **features**. The goal of logistic regression is to find a target function which takes a point's feature as input and outputs a probability of being positive or negative. If the probability is high enough to make a decision, then the point will be predicted as the corresponding **label**.

Note that the target function has some unknown parameters, the learning process will find out these parameters by optimizing a **loss function** which could be defined by **likelihood**.

Actually, there are two fashions of labeling points. One is (0, 1), the other is (-1, 1). 1 is always considered as positive while the negatives could be 0 or -1. Both are fine, but we need to pay attention that the two different ways lead to different loss functions even if they share the same target function.

### Target function

In logistic regression, the target function $f(\mathbf{x})$ gives the probability of the label being positive or negative given $\mathbf{x}$ (the feature of the point) which is known as posterior, it can be represented as :

{{<katex>}}
P(y \mid \mathbf{x}) = \left \{
\begin{array}{ll}
f(\mathbf{x}), \ &\text{for} \ y \ \text{is positive}\\
1 - f(\mathbf{x}), \ &\text{for} \ y \ \text{is negative}
\end{array}
\right.
{{</katex>}}

The target function $f: \mathbb{R}^d \to [0, 1]$, where $d$ is the dimension of feature

Actually, what we want to learn is another function call **logistic function** or **sigmoid fucntion** which approximate $f(\mathbf{x})$

$$\theta(s) \approx f(\mathbf{x})$$

, where $s = \mathbf{w}^T \cdot \mathbf{x} + b$, and $\mathbf{w}$ is the vector of parameters to learn, called **weights**, since the features are *weighted* by these parameters, $b$ is also a parameter called **intercept**.

Once $\mathbf{w}$ and $b$ are known, then $f(\mathbf{x})$ can be computed.

Now, we introduce the logistic function $\theta(s)$:

$$\theta(s) = \frac{1}{1+exp(-s)}$$

It looks like the following figure:

{{<funcPlot
  title="Logistic Function"
  xTitle="s"
  yTitle="theta(s)"
  min="-6"
  max="6"
  step="0.2"
  func="1 / (1 + Math.exp(-x))" >}}

The logistic function has some beautiful properties which make it a good approximation of the target function, especially, in terms of the probability, some will be used to prove the loss function:

* $$\theta(s) + \theta(-s) = 1$$
* $$\theta: \mathbb{R} \to (0, 1)$$
* $$\lim_{s \to +\infty} \theta(s) = 1$$
* $$\lim_{s \to -\infty} \theta(s) = 0$$

Since the logistic function is defined on $\mathbb{R}$ and the domain of the target function is $\mathbb{R}^d$, a transformation of $\mathbb{R}^d \to \mathbb{R}$ is carried out by taking the sum of weighted features, that's where the weights/parameters are introduced. This model is also called **linear model**, because $s$ is a linear combination of features.

Hence, the target function is declared as :

$$f(x) = \frac{1}{1+ exp(-s)}$$

, where $ s = \mathbf{w}^T \cdot \mathbf{x} + b$

*You may have some questions on this. Why use a logistic function? Where does it come from? why can it be interpreted as probability? then, what's the distribution? Don't worry, you will find all you would like to know in the following post. And in this post, we just focus on the loss function and take logistic function as granted.*

### Loss function

By taking the advantage of the form of the target function, we can easily deduce the to loss function by defining the likelihood of **(0,1) case** and **(-1, 1) case**.

In statistics, a likelihood function (often simply the likelihood) is a function of the **parameters** of a statistical model. The likelihood is the level of how likely an event is.

For example, given the parameters $\mathbf{w}$ and $b$, the likelihood of *one* point being *positive* is the following:

{{<katex>}}
\begin{array}{rl}
& L(\mathbf{w} \mid y \ \text{is positive,} \ \text{given} \ \mathbf{x})\\
= & P(y \ \text{is positive} \mid \mathbf{x}, \mathbf{w}) \\
= & f(\mathbf{x}) \\
= & \frac{1}{1+ exp(-s)}
\end{array}
{{</katex>}}

, where $ s = \mathbf{w}^T \cdot \mathbf{x} + b$

$\mathbf{x}$ is given by the feature of the point, the variable here is $\mathbf{w}$ and $b$.

This is just the likelihood for a specific positive point, what we want is to maximize the likelihood of the statistic model which needs all the data point, no matter what the point is likely to be.

Two things need to be done:

1. Define the likelihood of one point by unifying $P(y \mid \mathbf{x})$ (combine the two branches of posterior)
2. Take the average natural logarithm likelihood over all the data points as the global likelihood

>#### (0, 1) label

In this case, $1$ stands for positive, while $0$ stands for negative.

<div>
$$
   P(y \mid \mathbf{x}) = \left \{
   \begin{array}{ll}
   f(\mathbf{x}), \ & \text{for} \ y = 1\\
   1 - f(\mathbf{x}), \ & \text{for} \ y = 0
   \end{array}
   \right. = f(\mathbf{x})^y \cdot [1-f(\mathbf{x})]^{1-y}
$$
</div>

Given one data point $(\mathbf{x}_i, y_i)$, its likelihood is:

$$L(\mathbf{w};\mathbf{x}_i, y_i) = f(\mathbf{x}_i)^{y_i} \cdot [1-f(\mathbf{x}_i)]^{1-y_i}$$

, this is what we want to maximize.

For simplicity, we take the **natural logarithm** of both left and right-hand side, then

<div>
$$
\begin{array}{rl}
& \ln L(\mathbf{w};\mathbf{x}_i, y_i) \\
= & \ln f(\mathbf{x}_i)^{y_i} \cdot [1-f(\mathbf{x}_i)]^{1-y_i}\\
= & \ln f(\mathbf{x}_i)^{y_i} + \ln [1-f(\mathbf{x}_i)]^{1-y_i}\\
= & y_i \ln f(\mathbf{x}_i) + (1-y_i) \ln[1-f(\mathbf{x}_i)] \\
= & y_i \ln f(\mathbf{x}_i) + (1-y_i) \ln f(-\mathbf{x}_i) \\
= & y_i \ln\left(\frac{1}{1 + exp(-(\mathbf{w}^T \cdot \mathbf{x}_i + b))}\right) \\
  & + (1-y_i) \ln\left(\frac{1}{1 + exp(\mathbf{w}^T \cdot \mathbf{x}_i + b)}\right)\\
= & - y_i \ln[1 + exp(-(\mathbf{w}^T \cdot \mathbf{x}_i + b))] - (1-y_i) \ln[1 + exp(\mathbf{w}^T \cdot \mathbf{x}_i + b)]
\end{array}
$$
</div>

Finally, the loss function for **(0, 1)** case is the *opposite averaged* likelihood of the above:

$$ \frac{1}{n} \sum\limits_{i=1}^n y_i \ln[1 + exp(-(\mathbf{w}^T \cdot \mathbf{x}_i+b))] + (1-y_i) \ln[1 + exp(\mathbf{w}^T \cdot \mathbf{x}_i + b)] $$

We will just *minimize* the loss function to estimate the weights $\mathbf{w}$ and the intercept $b$.

Note that: maximizing likelihood is equivalent to minimizing loss

>#### (-1, 1) label

In this case, $1$ stands for positive, while $-1$ stands for negative.

<div>
$$
   P(y \mid \mathbf{x}) = \left \{
   \begin{array}{ll}
   f(\mathbf{x}), \ &\text{for} \ y = 1\\
   1 - f(\mathbf{x}), \ &\text{for} \ y = -1
   \end{array}
   \right. = f(y \cdot \mathbf{x})
$$
</div>

The same, given one data point $(\mathbf{x}_i, y_i)$, its likelihood is:

$$L(\mathbf{w};\mathbf{x}_i, y_i) = f(y_i \cdot \mathbf{x}_i)$$

, this is what we want to maximize.

For simplicity, we take again the **natural logarithm** of both left and right-hand side, then

<div>
$$
\begin{array}{rl}
\ln L(\mathbf{w};\mathbf{x}_i, y_i) & = \ln f(y_i \cdot \mathbf{x}_i)\\
& = \ln f(y_i \cdot \mathbf{x}_i)\\
& = \ln \frac{1}{1 + exp(-y_i (\mathbf{w}^T \cdot \mathbf{x}_i + b))}\\
& = -\ln [1 + exp(-y_i (\mathbf{w}^T \cdot \mathbf{x}_i + b))]
\end{array}
$$
</div>

Finally, the overall loss function for **(-1, 1)** case is the following:

$$ \frac{1}{n} \sum\limits_{i=1}^n \ln [1 + exp(-y_i(\mathbf{w}^T \cdot \mathbf{x}_i+b))]$$
