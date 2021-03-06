---
title: The Story about Logistic Function
tags: [logistic function]
categories: [statistic]
date: "2015-04-28"
---

In logistic regression, we take advantage of logistic function to interpret the probability of a data point being a certain label. It seems that we take the logistic function as granted. In this post, I will try to tell some interesting things(at least for me) about logistic function and why it is chosen to be used in classification.

### Long Long ago ...

A Brussels mathematician gave a common model of population growth. He found that the rate of reproduction is proportional to both the existing population and a number of available resources. The differential equation is the following:

{{<katex>}}
\left \{
   \begin{array}{ll}
   \frac{dP}{dt} = rP(1-\frac{P}{K})\\
   \lim_{t \to +\infty} P(t) = K
   \end{array}
\right.
{{</katex>}}

where the constant $r$ defines the growth rate and $K$ is the carrying capacity which means the maximum population size that the environment can sustain indefinitely.

Pierre François Verhulst, the Brussels, is the first one named the solution to this the **logistic function**

Since $r$ and $K$ are constant, we can take $r = K = 1$ in order to show an ordinary form of the solution. We denote $y$ as $P(t)$, then the equation becomes:

$$\frac{dy}{dx}=y \cdot (1-y)$$

it is an ordinary differential equation.

Solution:

{{<katex>}}
\begin{array}{rl}
x &= \int^{y} \frac{dy}{y-y^2} + C^\prime\\
&= - \ln(\frac{1-y}{y}) + C\\
&= \ln(\frac{y}{1-y}) + C
\end{array}
{{</katex>}}

If $C = 0$, then what we get is the following:

$$y = \frac{1}{1+exp(-x)}$$

Yes, the logistic function I have met before.

### Probability & Distribution

In logistic regression, we map features to a probability by using a logistic function. It works because the logistic function is a **Cumulative Distribution Function (CDF)**.

Every function $F(x)$ with the four following properties is a CDF:

* $$non-decreasing$$
* $$right-continous$$
* $$\lim_{x \to -\infty} F(x) = 0$$
* $$\lim_{x \to +\infty} F(x) = 1$$

It is obvious that logistic function has the four properties. Furthermore, it has 2 additional properties.

* $$F(x) = F(-x)$$
* $$F(x) = 1 - F(-x)$$

Wait a minute, it looks like I am talking about the properties of CDF of **normal distribution**. You will know that's why soon.

Why not check the **Probability Distribution Function (PDF)** for more details.

Knowing that PDF is just the derivative of CDF:

$$f(x) = \frac{dF(x)}{dx} = \frac{1}{2 + exp(-x) + exp(x)}$$

The curve is the following:

{{<funcPlot
  title="PDF"
  xTitle="x"
  yTitle="f(x)"
  min="-6"
  max="6"
  step="0.1"
  func="1 / (2 + Math.exp(-x) + Math.exp(x))" >}}

The "bell curve" is very like the pdf of the normal distribution. Actually, this distribution is called logistic distribution. It resembles the normal distribution in shape but has heavier tails (higher kurtosis, see appendices).

So why CDF of logistic distribution is used instead of the one of normal distribution ?

The answer is obvious: CDF of the normal distribution can not be represented by elementary functions.

Because of that, we can not pin down and compute the loss function, not even to mention estimate the parameters. However, we really need normal distribution, since it can be a reasonable assumption of an unknown distribution in many cases. It is pretty useful. As a result, we need to find a reasonable distribution to approximate normal distribution by conserving all its properties and make sure the pdf of the new distribution resembles the one of the normal distribution.

The solution to this is **logistic function**.

In fact, we can never guess the CDF of the distribution by trying a different kind of function. Actually, we already have a clue about what the CDF looks like.

You can find the **clue** in my next post. =)

### Appendices

Normal distribution $N(\mu, \sigma)$:

* PDF
  $$ f(x) = \frac{1}{\sigma\sqrt{2\pi}}exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right) $$

* CDF
  $$ F(x) = \int_{-\infty}^{x} \frac{1}{\sigma\sqrt{2\pi}}exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right) dx $$, where the integral can not be expressed in terms of elementary functions

In statistic, one uses **error function** $erf(x)$ to estimate CDF of normal distribution:

$$F(x) = \Phi \left ( \frac{x - \mu}{\sigma}\right) = \frac{1}{2}\left[ 1 + erf \left( \frac{x - \mu}{\sqrt{2}\sigma}\right)\right]$$

where $erf(x) = \frac{1}{\sqrt{\pi}} \int_{-x}^{x} exp(-t^2) dt$, whose value can be looked up in stable pre-computed by numerical analysis.

The $PDF$ curve of $N(0, 1)$ can be plotted as following:

{{<funcPlot
  title="PDF of N(0,1)"
  xTitle="x"
  yTitle="f(x)"
  min="-4"
  max="4"
  step="0.1"
  func="Math.exp(-0.5 * x * x) / (Math.sqrt(2 * 3.1415926))" >}}

The $CDF$ curve of $N(0, 1)$ can be plotted as following:

{{<funcPlot
  title="CDF of N(0,1)"
  xTitle="x"
  yTitle="f(x)"
  min="-4"
  max="4"
  step="0.1"
  func="1/ (Math.exp(-358 * x / 23 + 111* Math.atan(37 * x / 294)) + 1)" >}}
