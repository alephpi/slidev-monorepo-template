---
theme: ../themes/telecom
layout: cover
class: text-left
authors:
  # First author should be the presenter
  - Sicheng Mao: []

meeting: "ADASP Formal Presentation"
preTitle: "Regularize deep speaker embedding by HVAE"
---

---
layout: pageBar
hideInToc: true
---

# Outline

<Toc/>

<!--
I assume that most of you are not familiar with the speaker diarization task so I will give a brief overview of it, 
what's the objective? how do we evaluate it? what's the general pipeline to do this task?
Then I will focus on a baseline model called VBx. I will its underlying generative model, which involves several aspects: the speaker space, the speaker model and the conversation model. And how do we perform inference with the model.
Finally a little words on the future work I plan.
-->

---
layout: pageBar
---

# Speaker verification
<br>

## Objective
Decide whether two speech segments come from the same speaker or not

## Method

- Front-end feature extraction: extract utterance-level speaker embeddings from audio segments, e.g. i-vector, **x-vector**.

- Back-end scoring: compute the similarity score between two embeddings and decide against a preset threshold. 

---
layout: pageBar
hideInToc: true
---
# Scoring methods
<br>

- cosine similarity: $\frac{x_1^Tx_2}{||x_1||||x_2||}$
- probabilistic linear discriminant analysis: 

Suppose the speaker embedding is generated from the following model
$$
\begin{aligned}
P(\mathbf{y})&=\mathcal{N}(\mathbf{y}\mid\mathbf{m},\Phi_b)\\
P(\mathbf{x}\mid\mathbf{y})&=\mathcal{N}(\mathbf{x}\mid\mathbf{y},\Phi_w)\\
\end{aligned}
$$

Then by hypothesis test, we compute the similarity as the loglike-ratio:
$$
\log R(\mathbf{x}_1,\mathbf{x}_2)=\log \frac{P\left(\mathbf{x}_1,\mathbf{x}_2|\mathcal{T},\theta\right)}{P\left(\mathbf{x}_1,\mathbf{x}_2|\mathcal{N},\theta\right)}=\log \frac{\int p(x_1|y)p(x_2|y)p(y)dy}{\int p(x_1|y)p(y)dy \int p(x_2|y)p(y)dy} \\= (x_1+x_2)^TG(x_1+x_2) - x_1^THx_1 - x_2^THx_2 
$$
where $G=\Phi_W^{-1}(\Phi_B^{-1}+2\Phi_W^{-1})\Phi_W^{-1}, H=\Phi_W^{-1}(\Phi_B^{-1}+\Phi_W^{-1})\Phi_W^{-1}$

---
layout: pageBar
---

# Decision
<br>

## Decision by threshold
Given a threshold $\theta$, we decide pairs with scoring $s$

$$
\begin{equation}
\left\{
\begin{array}{lr}
s\geq \theta, & \text{same speaker} \\
s<\theta, & \text{different speakers}\\
\end{array}
\right.
\end{equation}
$$

## Two types of error in decision

- False Reject: If two segments from a same speaker are decided to be from different speakers
- False Accept: If two segments from different speakers are decided to be from a same speaker.

Therefore if we have a large threshold, the system tends to be very conservative, which increases FR error but lowers FA and vice versa.

In practice, the setting of threshold depends on the application: "security-first" or "convenience-first".

---
layout: pageBar
---

# Evaluation
<br>

Regardless of pratical context, to evaluate the verification system, we have two typical methods:

- Draw the FA-FR curve: draw the (FA, FR) curve parametrized by the threshold.

<img src="fa-fr.png" height="25%" width="25%"/>

- Report the Equal Error Rate (i.e. the cross point of the curve and $y=x$)

---
layout: pageBar
---
# Issue
<br>

Before deep speaker embeddings (x-vectors), PLDA is the major scoring method for the previous SOTA embedding(i-vector). However, when deep speaker embeddings come to play, cosine similarity is better than PLDA.

## Guess

Unlike i-vector which is extracted from a GMM, x-vector which is extracted from a neural network (one or two layers before the classification head) follows badly the Gaussianity assumption of PLDA.

## Attemps

We try to regularize the deep speaker embedding to make it appropriate for PLDA.
---
layout: pageBar
---

# Previous works

1. Gaussian-constrained xvector training: regularization during training of feature extractor
2. regularization of xvector by VAE
3. regularization of xvector by Normalizing flow

<br>

## Shortbacks

- Method 1 needs to train everything from scratch
- Method 2 only constrain the speaker prior $p(y)$ to Gaussian but not the conditional $p(x|y)$
- Method 3 only constrain the speaker marginal $p(x)$

We propose an HVAE to contrain both the speaker prior and speaker conditional to Gaussian.

---
layout: pageBar
---

# Extend PLDA to non-linear analog
<br>

We hypothesize that the PLDA works no more due to the non-linearity of neural embeddings.

## Formulation
Instead of Probablistic Linear discriminant analysis, we replace the linear dependency of utterance to speaker by non-linear one, i.e.

$$
\begin{align}
\mathbf{y}_i &\sim p(\mathbf{y}) = \mathcal{N}(\mathbf{y};\mathbf{0},\mathbf{I}),\\
\mathbf{z}_{ij}|\mathbf{y}_i=\mathbf{y} &\sim p(\mathbf{z}|\mathbf{y}) = \mathcal{N}(\mathbf{z};f_{\boldsymbol{\theta}}(\mathbf{y}),\mathbf{I}),\\
\mathbf{x}_{ij} &= g_{\boldsymbol{\theta}}(\mathbf{z}_{ij}),
\end{align}
$$

where $f_\theta$ and $g_\theta$ is generally non-linear and we keep the covariances independent of speakers and normalized.

### About naming
- Linear discriminant analysis by Gaussian Mixture point of view
- Generalize mixture prior from a finite sum of Dirac to a continuous Gaussian

---
layout: pageBar
---
# Solving the model by VI
<br>

The ELBO function for the observed $N_i$ utterances $\mathbf{X}_i=\{\mathbf{x}_{ij}\}_{j=1}^{N_i}$ with hidden utterances $\mathbf{Z}_i=\{\mathbf{z}_{ij}\}_{j=1}^{N_i}$ from speaker $\mathbf{y}_i$ of the model:

$$
\begin{align}
    &\mathcal{L}(\boldsymbol{\theta},\boldsymbol{\phi};\mathbf{X}):= \mathbb{E}_{q_{\boldsymbol{\phi}}(\mathbf{y},\mathbf{Z}|\mathbf{X})}[\log \frac{p_{\boldsymbol{\theta}}(\mathbf{X},\mathbf{Z},\mathbf{y})}{q_{\boldsymbol{\phi}}(\mathbf{y},\mathbf{Z}|\mathbf{X})}],\\
    &=\mathbb{E}_{q(\mathbf{y},\mathbf{Z}|\mathbf{X})}
    \left[\log p(\mathbf{X}|\mathbf{Z})\right]-\text{KL}(q(\mathbf{y},\mathbf{Z}|\mathbf{X})||p(\mathbf{y},\mathbf{Z})),
\end{align}
$$

By top-down inference: $q(\mathbf{y,Z|X})=q(\mathbf{y|X})q(\mathbf{Z|y,X})$

$$
\begin{equation}
\begin{split}
    &\text{KL}(q(\mathbf{y},\mathbf{Z}|\mathbf{X})||p(\mathbf{y},\mathbf{Z}))=\\
    &\text{KL}(q(\mathbf{y}|\mathbf{X})||p(\mathbf{y}))+\mathbb{E}_{q(\mathbf{y}|\mathbf{X})}[\text{KL}(q(\mathbf{Z}|\mathbf{y},\mathbf{X})||p(\mathbf{Z}|\mathbf{y}))].
\end{split}
\end{equation}
$$
---
layout: pageBar
---
# Solving the model by VI
<br>

Factorize the speaker conditional KL by the indepency between utterances from the same speaker.
$$
\begin{equation}
    \text{KL}(q(\mathbf{Z}|\mathbf{y},\mathbf{X})||p(\mathbf{Z}|\mathbf{y})) = \sum_{j=1}^{N_i} \text{KL}(q(\mathbf{z}_{j}|\mathbf{y},\mathbf{X})||p(\mathbf{z}_{j}|\mathbf{y}))
\end{equation}
$$

The ELBO for the whole dataset of all speakers is the sum of individual ELBOs, by the independency between speakers:

$$
\begin{equation}
     \log p_{\boldsymbol{\theta}}(\mathbf{X}) = \sum_{i=1}^S \log p_{\boldsymbol{\theta}}(\mathbf{X}_i) \geq \mathcal{L}(\boldsymbol{\theta},\boldsymbol{\phi};\mathbf{X}) = \sum_{i=1}^S \mathcal{L}(\boldsymbol{\theta},\boldsymbol{\phi};\mathbf{X}_i)
\end{equation}
$$
---
layout: pageBar
---
# HVAE
<br>

The above objective can be modeled with a hierarchical VAE, since we have two KL-terms: one for speaker prior and one for speaker conditional.

<div class="grid grid-cols-3 gap-5">
<div class="col-span-2 flex flex-col">
We borrow the implementation from NVAE, adapt it with two stochatic layers and replace the convolution layers to fully-connected ones.

<br>

</div>
<img src="hvae.png" width="60%" height="60%">

</div>

---
layout: pageBar
---
# Scoring on hidden space
<br>

Once we get our regularized embeddings $y$, we can perform hypothesis test as follows:

$$
R(\mathbf{x}_1,\mathbf{x}_2)=\frac{P\left(\mathbf{x}_1,\mathbf{x}_2|\mathcal{T},\theta\right)}{P\left(\mathbf{x}_1,\mathbf{x}_2|\mathcal{N},\theta\right)}=\frac{\int p(x_1|y)p(x_2|y)p(y)dy}{p(x_1)p(x_2)}\\=\int\frac{p(x_1,y)p(x_2,y)}{p(x_1)p(x_2)p(y)}dy=\int\frac{p(y|x_1)p(y|x_2)}{p(y)}dy\\\approx \int\frac{q(y|x_1)q(y|x_2)}{q(y)}dy = x_1^Tx_2 + const.
$$

Such simplification of score is due to our assumptions on the identity covariances. If we also perform the common length-normalization trick, we conclude that the scoring of our regularized embedding reduced to the cosine similarity on hidden space $Y$.

---
layout: pageBar
hideInToc: true
---
# Experiment and Results
<br>
We use two extractors in experiments: one come from Sidiar(weaker), and one come from Wenet(Stronger), both of them are trained on Voxceleb.

| embedding | Vox1o(Sidiar/Wenet) | CN-Celeb(Sidiar/Wenet) |
| --------- | ------------------- | ---------------------- |
| x(cos)    | 2.1/0.9703          | 19.42/11.0673          |
| x(plda)   | 2.7/2.2             | 21.58/16               |
| y(cos)    | 3.1/2.6             | 18.38/13.9847          |
| z(cos)    | -/1.696             | -/13.8439              |

On weaker checkpoint, the regularization seems to benefit the out-of-domain data (CN-Celeb), but when we switch to stronger checkpoint, we no more benefit from such regularization.

---
layout: pageBar
---
# Future improvements
<br>

1. Change the prior from Gaussian to vMF.
2. Adding supervised labels in the HVAE loss.

---
layout: end
---
