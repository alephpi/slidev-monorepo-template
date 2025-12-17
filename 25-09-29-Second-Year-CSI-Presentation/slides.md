---
theme: ../themes/telecom
layout: cover
class: text-left
authors:
  # First author should be the presenter
  - Sicheng Mao: []

meeting: "Second year CSI presentation"
preTitle: "Generative modeling for speaker diarization"
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

# Overview
<br>

This year we focus on two works:

- Regularize deep speaker embedding by hierarchical variational autoencoder
- Neural multichannel distant speaker diarization with heavy-tailed source separation model

<br><br><br>
<span text-red-6>The first work was submitted to WASPAA2025 and later APSIPA2025, but both of the conferences have rejected it due to the unsatisfying results. The second work have been just submitted to ICASSP2026.</span>

---
layout: pageBar
---

# First Work

<br>

## Issue
There are two common scoring backends in speaker verification task,

- cosine similarity: $\frac{x_1^Tx_2}{||x_1||||x_2||}$
- probabilistic linear discriminant analysis: suppose the following speaker embedding generation model and compute the similarity by hypothesis test based on likelihood.
$$
\begin{aligned}
P(\mathbf{y})&=\mathcal{N}(\mathbf{y}\mid\mathbf{m},\Phi_b)\\
P(\mathbf{x}\mid\mathbf{y})&=\mathcal{N}(\mathbf{x}\mid\mathbf{y},\Phi_w)\\
\end{aligned}
$$
<!-- 
Then by hypothesis test, we can compute the similarity as the loglike-ratio:
$$
\log R(\mathbf{x}_1,\mathbf{x}_2)=\log \frac{P\left(\mathbf{x}_1,\mathbf{x}_2|\mathcal{T},\theta\right)}{P\left(\mathbf{x}_1,\mathbf{x}_2|\mathcal{N},\theta\right)}=\log \frac{\int p(x_1|y)p(x_2|y)p(y)dy}{\int p(x_1|y)p(y)dy \int p(x_2|y)p(y)dy} \\= (x_1+x_2)^TG(x_1+x_2) - x_1^THx_1 - x_2^THx_2 
$$
where $G=\Phi_W^{-1}(\Phi_B^{-1}+2\Phi_W^{-1})\Phi_W^{-1}, H=\Phi_W^{-1}(\Phi_B^{-1}+\Phi_W^{-1})\Phi_W^{-1}$
 -->

PLDA was the SOTA in pre-DL era. However, for deep speaker embeddings, PLDA is no more performing as the simplest cosine similarity. We guess it's because the deep speaker embedding is extracted from a neural network which follows badly the Gaussianity assumption of PLDA.

---
layout: pageBar
---

## Extend PLDA to non-linear analog
<br>

Therefore, we consider to extend the PLDA to a non-linear analog to better cope with the deep speaker embedding distribution.

### Formulation
Instead of PLDA, we replace the linear dependency of utterance to speaker by non-linear one, i.e.

$$
\begin{align}
\mathbf{y}_i &\sim p(\mathbf{y}) = \mathcal{N}(\mathbf{y};\mathbf{0},\mathbf{I}),\\
\mathbf{z}_{ij}|\mathbf{y}_i=\mathbf{y} &\sim p(\mathbf{z}|\mathbf{y}) = \mathcal{N}(\mathbf{z};f_{\boldsymbol{\theta}}(\mathbf{y}),\mathbf{I}),\\
\mathbf{x}_{ij} &= g_{\boldsymbol{\theta}}(\mathbf{z}_{ij}),
\end{align}
$$

where $f_\theta$ and $g_\theta$ is generally non-linear and we keep the covariances independent of speakers and normalized.

---
layout: pageBar
---

## Training
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
hideInToc: true
---

## HVAE
<br>

<div class="grid grid-cols-3 gap-5">
<div class="col-span-2 flex flex-col justify-center">
The above objective can be modeled with a hierarchical VAE, since we have two KL-terms: one for speaker prior and one for speaker conditional.

We borrow the implementation from NVAE, adapt it with two stochatic layers and replace the convolution layers to fully-connected ones.

<br>

</div>
<img src="hvae.png" width="100%" height="100%">

</div>

---
layout: pageBar
---

## Scoring on hidden space
<br>

Once we get our regularized embeddings $y$, we can perform hypothesis test as follows:

$$
R(\mathbf{x}_1,\mathbf{x}_2)=\frac{P\left(\mathbf{x}_1,\mathbf{x}_2|\mathcal{T},\theta\right)}{P\left(\mathbf{x}_1,\mathbf{x}_2|\mathcal{N},\theta\right)}=\frac{\int p(x_1|y)p(x_2|y)p(y)dy}{p(x_1)p(x_2)}\\=\int\frac{p(x_1,y)p(x_2,y)}{p(x_1)p(x_2)p(y)}dy=\int\frac{p(y|x_1)p(y|x_2)}{p(y)}dy\\\approx \int\frac{q(y|x_1)q(y|x_2)}{q(y)}dy = x_1^Tx_2 + const.
$$

Such simplification of score is due to our assumptions on the identity covariances. If we also perform the common length-normalization trick, we conclude that the scoring of our regularized embedding reduced to the cosine similarity on hidden space $Y$.

---
layout: pageBar
---

## Experiment and Results
<br>

We perform regularizations over four kinds of the embeddings on two different dataset, 
however the results are not promising compared to the baselines, possibly due to KL-vanishing problem in HVAE training. 
<div flex justify-center>
<img src="eer results.png" width="80%" height="80%" >
</div>

<span text-red-6>A possible improvement is to use a better training strategy (e.g. diffusion or flow matching) to solve the hierarchical Gaussian model. There is a similar work on Interspeech2025 called SEED.</span>

---
layout: pageBar
---

# Second Work 

<br>

The biggest challenges in speaker diarization task are:
- complex acoustic environment
- overlap speeches 

Intuitively, if we can well separate a speech mixture, it would reduce the speaker diarization to a simpler voice activity detection task. Therefore we would like to learn both separation and diarization jointly.

A previous attempt: the neural FCASA

---
layout: pageBar
---
## Joint separation and diarization

<br>

## Generative model
Source model by variance modeling
$$
s_{nft} \sim \mathcal{N}_\mathbb{C}(0,\lambda_{nft})
$$

Mixture model with speaker activity temporal mask
$$
\mathbf{x}_{ft} = \sum_{n=1}^N u_{nt}\mathbf{x}_{nft} = \sum_{n=1}^N u_{nt}\mathbf{a}_{nf}s_{nft}
$$

Joint diagonalizable spatial covariance matrix for computational efficiency
$$
\mathbf{a}_{nf}\mathbf{a}^{\mathsf{H}}_{nf} = \mathbf{H}_{nf} = \mathbf{Q}_f^{-1}\operatorname{diag}(\mathbf{w}_{nf})\mathbf{Q}_f^{-\mathsf{H}}
$$

---
layout: pageBar
---

## Heavy-tailed modeling for source power specturm density

<br>

We replace the source model by heavy-tailed models for better robustness.

A heavy-tailed extension can be simply formulated by adding a random positive impulse variable $r_{ft}$ to the Gaussian variance, leading to a (circularly-symmetric) Gaussian Scalar Mixture~(GSM) model:

$$
s_{nft}|r_{ft} \sim \mathcal{N}(0,r_{ft} \lambda_{nft})
$$

where we can assume different prior distribution for $r_{ft}$. By marginalizing out it, we can get a specific heavy-tailed model for the mixture signal.

Particularly, we are interested in

$$
\begin{aligned}
    \mathbf{x}_{ft} &\sim \mathcal{GG}_\mathbb{C}^\beta(0,\mathbf{Y}_{ft}) &\text{(Leptokurtic)}, \\
    \mathbf{x}_{ft} &\sim \mathcal{T}_\mathbb{C}^{\nu}(0,\mathbf{Y}_{ft}) &\text{(Student-t)}
\end{aligned}
$$

where $\beta \in (0,2], \nu \in \mathbb{R}^+$ are shape parameters for Leptokurtic and Student-t distribution respectively.
Note that the GSM reduces to a Gaussian model hence to the vanilla neural FCASA when $r_{ft}$ is deterministic. 

---
layout: pageBar
---

## Training

<br>

We are going to solve the model by maximizing its ELBO function
$$
\begin{aligned}
&\log p_{\theta}(\mathbf{X})=\log\int p_{\theta}(\mathbf{X},\mathbf{U},\mathbf{Z})d\mathbf{U} d\mathbf{Z}
	\geq\underbrace{\mathbb{E}_{q_{\phi}(\mathbf{U}\mid\mathbf{X})q_{\phi}(\mathbf{Z}\mid\mathbf{X})}(\log p_{\theta}(\mathbf{X}\mid\mathbf{U},\mathbf{Z}))}_{\triangleq \mathcal{L}_1}\\
	&\underbrace{-\mathrm{KL}[q_{\phi}(\mathbf{Z}\mid\mathbf{X})\mid\mid p_{\theta}(\mathbf{Z})]}_{\triangleq \mathcal{L}_2}\underbrace{-\mathrm{KL}[q_{\phi}(\mathbf{U}\mid\mathbf{X})\mid\mid p_{\theta}(\mathbf{U})]}_{\triangleq \mathcal{L}_3}
\end{aligned}
$$

where 
$$
\begin{aligned}
\mathcal{L}_1
&\overset{Leptokurtic}{=}\sum_{f,t=1}^{F,T} \left[-\left(\sum_{m=1}^M \frac{|\tilde{x}_{ftm}|^2}{\tilde{y}_{:ftm}}\right)^{\frac{\beta}{2}}-\sum_{m=1}^M \log  \tilde{y}_{:ftm}\right] + T\sum_{f=1}^{F} \log |\mathbf{Q}_f\mathbf{Q}_f^\mathsf{H}|\\
&\overset{Student-t}{=}\sum_{f,t=1}^{F,T} \left[-\left(\frac{\nu}{2}+M \right)\log \left( 1+\frac{2}{\nu}\sum_{m=1}^M \frac{|\tilde{x}_{ftm}|^2}{\tilde{y}_{:ftm}}\right)-\sum_{m=1}^M \log  \tilde{y}_{:ftm},\right] + T\sum_{f=1}^{F} \log |\mathbf{Q}_f\mathbf{Q}_f^\mathsf{H}|\\
\end{aligned}
$$

---
layout: pageBar
---

<br>

$\mathcal{L}_2$ is KL divergence between two Gaussians and hence can be computed in closed form.

As to the third term, since we don't assume a prior model for speaker activity $\mathbf{U}$, we directly minimize the KL-divergence between the empirical posterior distribution and the surrogate, which is equivalent to minimizing the binary cross entropy:
$$
\mathcal{L}_3 
    \approx -\sum_{n,t=1}^{N,T}\text{BCE}[u_{nt}|\eta_{\phi, nt}].
$$

Finally, we combine the three terms with scaling hyperparameters.

$$
    \mathcal{L} = \frac{1}{TF} \left(\mathcal{L}_1+\delta\mathcal{L}_2\right) + \gamma\frac{1}{TN} \mathcal{L}_3,
$$

---
layout: pageBar
---

## Experiment and Results

<br>

<div class="grid grid-cols-2 gap-5">
<div class="col-span-1 flex flex-col">
<img src="der result1.png" width="100%" height="100%">
<br>
</div>
<div class="col-span-1 flex flex-col">
<img src="der result2.png" width="100%" height="100%">

We trained 9 heavy-tailed models and evaluate it on the AMI corpus with DER and JER score under 4 different setups. We improved the baseline by a large margin particularly for Student-t distribution with $\beta=0.1,1$
</div>

</div>
Future work: generalize for more heavy-tailed models and introduce a prior model for speaker activity label.

---
layout: pageBar
---

# Trainings and Teachings
<br>

<div class="grid grid-cols-2 gap-5">
<div class="col-span-1 flex flex-col">

The courses I took by the end of the second year amounts to 133 hours (63 hours of scientific course, 70 hours of transversal skills): the following course was what I took in the second year
- Deep Learning Optimisé sur Jean Zay, 32 h (scientific)

which have already fulfilled the training requirements.
</div>
<div class="col-span-1 flex flex-col">

During my second year of PhD, I also taught some pratical session of the following courses (all in Telecom Paris) as well as supervised some project/internship:

- CSC_5AI06_TP - Deep learning I(12h)
- APM_4AI01_TP - Représentations des signaux(1.5h)
- APM_0EL07_TP - Logic, Knowledge Representation and Probabilities(10.5h)
- Master 1 Data AI Research project (Cosupervised Taiwei Wu with Mathieu)
- Engineer 1A student internship (Cosupervised Baihan Li with Mathieu) 
</div>

</div>

---
layout: pageBar
---

# Plans

## For Interspeech 2026 or next year conferences:
- Generalize the second work by more heavy-tailed models and introduce a prior model for speaker activity label.
- Try the diffusion or the flow matching for the hierarchical Gaussian model training or try the hyperspherical distribution as a training target.

## For journal paper in next year:
- If everything goes well, extends the second work to a journal paper after the conferences end

## For thesis

- 3 or 4 months (In IP-Paris ED, should be 3 months before the defense)

---
layout: end
---
