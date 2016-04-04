---
title: Naive Bayes and Logistic Regression
tags: [Bayes, logistic regression]
categories: [machine learning]
date: "2015-10-28"
---

To some extent, naive Bayes and logistic regression are the two sides of the same coin. It depends on what we want to model and the assumptions we make.

According to [this post]({{< relref "loss-function.md" >}}), given a data point, we want to compute the **posterior**.

If apply Bayes' rule to posterior, we get:

{{<katex>}}
P(y \mid \mathbf{x}) = \frac{P(\mathbf{x} \mid y)P(y)}{P(\mathbf{x})}
{{</katex>}}

The modeling can happen on two side, left hand side leads to logistic regression, while the right hand side leads to naive Bayes.

## Binary Classification

Let's take a look in the most simple case: binary classification.

$y$ could be $1$ and $0$, let's take $P(y=1 \mid \mathbf{x})$ as an example

{{<katex>}}
\begin{array}{rl}
P(y=1 \mid \mathbf{x}) &= \frac{P(\mathbf{x} \mid y =1)P(y=1)}{P(\mathbf{x}\mid y=1)P(y = 1)+ P(\mathbf{x}\mid y=0)P(y = 0)}\\
&= \frac{1}{1+exp\left(\ln\frac{P(\mathbf{x}\mid y=0)P(y=0)}{P(\mathbf{x}\mid y=1)P(y=1)}\right)}\\
&= \frac{1}{1+exp\left(\ln\frac{P(y = 0)}{P(y = 1)} + \ln\frac{P(\mathbf{x}\mid y=0)}{P(\mathbf{x}\mid y=1)}\right)}\\
&= \frac{1}{1+exp\left[-\left(\ln\frac{P(y = 1)}{P(y = 0)} + \ln\frac{P(\mathbf{x}\mid y=1)}{P(\mathbf{x}\mid y=0)}\right)\right]}\\
&= \frac{1}{1+exp(-\xi)}
\end{array}
{{</katex>}}

where $\xi$ is the discriminant and is considered as a "shell" for $\mathbf{x}$

$P(y=0 \mid \mathbf{x})$ can be computed in the same way.

So far so good, we have not made any assumption. It is just mathematical inference.

> For logistic aspect

{{<katex>}}
P(y \mid \mathbf{x}) = \left \{
\begin{array}{ll}
f(\mathbf{x}), \ &\text{for} \ y = 1\\
1 - f(\mathbf{x}), \ &\text{for} \ y = -1
\end{array}
\right.
{{</katex>}}

then

{{<katex>}}
\begin{array}{rl}
f(\mathbf{x}) &= P(y=1 \mid \mathbf{x}) \\
& = \frac{1}{1+exp\left[-\left(\ln\frac{P(y = 1)}{P(y = 0)} + \ln\frac{P(\mathbf{x}\mid y=1)}{P(\mathbf{x}\mid y=0)}\right)\right]}
\end{array}
\space(*)
{{</katex>}}

The form is very like logistic form, if we make the following assumptions,

1)  

{{<katex>}}
\ln\frac{P(y = 1)}{P(y = 0)} = C1
{{</katex>}}

2)  

{{<katex>}}
\ln\frac{P(\mathbf{x}\mid y=1)}{P(\mathbf{x}\mid y=0)} = \mathbf{w}^T\mathbf{x} + C2
{{</katex>}}

3)  

$$C1 + C2 = b$$

then $f(x) = \frac{1}{1+exp(-\left(\mathbf{w}^T\mathbf{x} + b)\right)}$, which is the logistic function we are familiar with.

In fact, the assumption 1) always holds, since the estimator of log odd is always a constant. The interesting part is that, actually, the assumption 2) holds for many common distributions.

Let's take **normal distribution** as an example and choose a particular form for the conditional probabilities $P(\mathbf{x} \mid y)$ (the class-conditional densities). Let us assume that they are multivariate Gaussian with identical covariance matrices $\Sigma$:

$$P(\mathbf{x} \mid y = 1) = \frac{1}{(2\pi)^{\frac{d}{2}}\begin{vmatrix}\Sigma\end{vmatrix}^{\frac{1}{2}}}exp\left(-\frac{1}{2}(\mathbf{x} - \mu_1)^T\Sigma^{-1}(\mathbf{x}-\mu_1)\right)$$

$$P(\mathbf{x} \mid y = 0) = \frac{1}{(2\pi)^{\frac{d}{2}}\begin{vmatrix}\Sigma\end{vmatrix}^{\frac{1}{2}}}exp\left(-\frac{1}{2}(\mathbf{x} - \mu_0)^T\Sigma^{-1}(\mathbf{x}-\mu_0)\right)$$

then we get:

{{<katex>}}
\begin{array}{rl}
\ln\frac{P(\mathbf{x}\mid y=1)}{P(\mathbf{x}\mid y=0)} &= \frac{1}{2}(\mathbf{x} - \mu_0)^T\Sigma^{-1}(\mathbf{x}-\mu_0) - \frac{1}{2}(\mathbf{x} - \mu_1)^T\Sigma^{-1}(\mathbf{x}-\mu_1)\\
&= (\mu_1^T\Sigma^{-1} - \mu_0^T\Sigma^{-1}) \mathbf{x} + \frac{\mu_0^T\Sigma^{-1}\mu_0 - \mu_1^T\Sigma^{-1}\mu_1}{2}
\end{array}
{{</katex>}}

So for normal distribution $f(x)$ is the logistic form, where

{{<katex>}}
\begin{array}{rl}
\mathbf{w} &= \mu_1^T\Sigma^{-1} - \mu_0^T\Sigma^{-1}, \\
b &= \ln\frac{P(y = 1)}{P(y = 0)} + \frac{\mu_0^T\Sigma^{-1}\mu_0 - \mu_1^T\Sigma^{-1}\mu_1}{2}
\end{array}
{{</katex>}}

$\mathbf{w}$ and $b$ can be trained by minimizing the [loss function]({{< relref "loss-function.md#loss-function" >}}).

In fact, all distributions of exponential family make these assumptions hold. The exponential family densities are all of the following form:

$$ P(\mathbf{x} \mid \theta, \phi) = exp\left(\frac{\theta^T\mathbf{x} - b(\theta)}{a(\phi)} + c(\mathbf{x}, \phi)\right) $$

where $\theta$ and $\phi$ are the parameters ($\theta$ is known as the **location parameter**, and $\phi$ is the **dispersion parameter**)

As a result, modeling $P(y\mid x)$ (or more precisely, $f(x)$) into a logistic function is a reasonable choice.

If we now assume that each of out class-conditional densities are members of the (same) exponential family distribution, with equal dispersion parameters, and substitute this general form into Eq. (*), we find that we once again obtain a linear form for the discriminant $\xi$. Thus in all cases the posterior probability is a logistic function of a linear combination of the components of $\mathbf{x}$

> For naive Bayes aspect

$$P(y \mid \mathbf{x}) = \frac{P(\mathbf{x} \mid y)P(y)}{P(\mathbf{x})}$$

as $P(x)$ is independent of $y$, then $P(y \mid \mathbf{x}) \propto P(\mathbf{x}\mid y)P(y)$

Now, we make two assumptions:

1)

$$\mathbf{x} = (x_1, x_2, .., x_p)^T$$

all components $x_i$s are independent to each other => *naive*

2)
$$(x_i \mid y) \sim N(\mu, \sigma)$$

then,

{{<katex>}}
\begin{array}{rl}
P(y \mid \mathbf{x}) &\propto P(\mathbf{x}\mid y)P(y)\\
& = P(x_1, x_2, .., x_p \mid y)P(y)\\
& = P(y)\prod_{i=1}^{p}P(x_i \mid y)
\end{array}
{{</katex>}}

So the naive Bayes rule is

{{<katex>}}
y_k \gets \arg \max_{k} P(y = k)\prod_{i=1}^{p}P(x_i \mid y = k)
{{</katex>}}

where $k \in \{0, 1\}$ for binary classification (2 class).

According to assumption 2), the class-conditional densities are Gaussian, we have $2pk$ parameters to estimate,
they are

{{<katex>}}
(\mu_{1k}, \mu_{2k}, .., \mu_{pk})
{{</katex>}}

and

{{<katex>}}
(\sigma_{1k}, \sigma_{2k}, .., \sigma_{pk})
{{</katex>}}

<!-- they are $(\mu_{1k}, \mu_{2k}, .., \mu_{pk})$ and $(\sigma_{1k}, \sigma_{2k}, .., \sigma_{pk})$. -->

Maximum Likelihood Estimation (MLE) gives their unbiased estimator for class $k$,

{{<katex>}}
\left \{
   \begin{array}{ll}
   \mu_{ik} &= \frac{1}{ \sum \delta_k (y) } \sum x_i \delta_k(y)\\
   \theta_{ik} &= \frac{1}{ \sum \delta_k (y) } \sum (x_i - \mu_{ik})^2 \delta_k(y)
   \end{array}
\right.
{{</katex>}}

where the summation are over all data points, x_i is the i-th component of the given data point's $\mathbf{x}$ vector, and $\delta_k (y) = 1$ iff data point's $y = k$.

Once all the parameters are estimated, for a given data point, we can know about the class in which it has the highest probability to be.

Naive Bayes rule is essentially based on $P(\mathbf{x} \mid y)$ and $P(y)$, no assumption is made on $P(y \mid \mathbf{x})$.

## What we have learned so far:

Logistic representation is invariant to a *family* of classification problems; those in which the class-conditional densities are in the exponential family (with equal dispersion parameters). In other words, we don't require a particular distribution to be specified when we use logistic function. The naive Bayes method, on the other hand, does require such a specification. If the specification isn't a good match to the data set, performance will suffer. In statistical language, logistic regression is more *robust* than naive Bayes classification. Another advantage of logistic regression is that its parameterization is simpler than that of naive Bayes ($\mathcal{O}(p)$ vs. $\mathcal{O}(pk)$).

Naive Bayes is more "modular" than logistic regression. The class-conditional densities are likely to be local, characteristic functions of the objects being classified, invariant to the nature an d number of the other classes.

Neither method is inherently better, they are two sides of the same coin and have complementary advantages and disadvantages. From a purely probabilistic point of view the two methods are equivalent parameterizations of the joint density. They are *not* equivalent, however, from a statistical point of view, and in particular situations statistical considerations, in conjunction with considerations such as modularity, stability, prototypicality, causality, etc., may lead one to prefer one over the other. The major statistical advantage of naive Bayes  is that if the model specification is nearly correct, the estimation in that method will be more *efficient* than estimation in logistic regression (will require fewer data points to obtain a given level of statistical accuracy). The statistical advantage of logistic regression, on the other hand, is that it is more *robust* to uncertainty about the data generation process.

*Some extension to binary classification, can be multi-class or non-linear transformation form of discriminant. The same analysis will still work.*

## Ending

To summarize, logistic regression directly estimates the parameters of $P(y \mid \mathbf{x})$, whereas Naive Bayes directly estimates parameters for $P(\mathbf{x} \mid y)$ and $P(y)$. We often call the former a discriminative classifier, and the latter a generative classifier.

When the Gaussian Naive Bayes(GNB) modeling assumptions do not hold, Logistic Regression(LR) and GNB typically learn different classifier functions In this case, the asymptotic (as the number of training examples approach infinity) classification accuracy for LR is ofter better than th asymptotic accuracy of GNB. Although LR is consistent with the NB assumption that input feature $x_i$ are conditionally independent given $y$, it is not rigidly tied to this assumption as is NB. Given data that disobeys this assumption, the conditional likelihood maximization algorithm for LR will adjust its parameters to maximize the fit to (the conditional likelihood of) the data, even if the resulting parameters are inconsistent with Naive Bayes parameter estimates.

One thing that I didn't mentioned in this post is that, essentially, GNB and LR converge toward their asymptotic accuracies at different rates. You can find more details in [2].

## Bibliography

[[1](/pdf/whylogistic.pdf)] Jordan, Michael I. "Why the logistic function? A tutorial discussion on probabilities and neural networks." (1995).

[[2](/pdf/discriminativegenerative.pdf)] Jordan, A. "On discriminative vs. generative classifiers: A comparison of logistic regression and naive Bayes." Advances in neural information processing systems 14 (2002): 841.
