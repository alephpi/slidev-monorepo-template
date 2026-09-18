---
theme: ../themes/telecom
layout: cover
class: text-left
authors:
  # First author should be the presenter
  - Sicheng Mao: []

meeting: "ADASP Formal Presentation"
preTitle: "Neural Joint Diarization and Seperation"
---

---
layout: pageBar
hideInToc: true
---

# Outline

<Toc/>

---
layout: pageBar
---

# Speech signals in meeting scenario
<br>

- Speaker-microphone at distance
- Multiple speakers speak
- Microphone array receive the speech mixture signals

### speaker diarization difficulties
- noisy, reverberation, far field condition
- overlap speech
- unknown number of speakers 

### method
- Data-driven: large synthetic data(10K hours) + large Transformer model (EEND, 60M) -> recently jointly modeled as a General-ASR task with LLM backbone (VibeVoice-ASR, 9B), dominates signal channel diarization.
- Model-driven: particularly with signal models to exploit multi-channel information.

This presentation: **multichannel diarization with source separation models**

---
layout: pageBar
---

# Baseline: NeuralFCASA
<br>

NeuralFCA proposed an unsupervised separation framework for multichannel mixtures.

NeuralFCASA proposed a joint separation and diarization framework, which tries to do source separation with diarization annotations.
- It is a weak supervision as it doesn't need clean separated signals of the mixtures.

Reversely, if we look from the diarization perspective, it only uses diarization annotation and the mixtures. And intuitively, diarization task reduce to VAD if we get clean separated signal, so jointly learn how to diarize and separate help each other.

Compared to the data-driven models, it is data-efficient(90h) and parameter-efficient(~20M).

---
layout: pageBar
---

## Generative modeling of NeuralFCASA
<br>

A deep latent source feature
$$\mathbf{z}_{nt}\sim\mathcal{N}\left(\mathbf{0},\mathbf{I}\right),$$
that generates the source power spectrum density (PSD)
$$\lambda_{nft}=g_{\theta, f}(\mathbf{z}_{nt}),$$
that generates the mixture signal PSD, with spatial covariance matrix and the speaker activity mask
$$\mathbf{Y}_{ft}=\sum_{n=1}^{N}u_{nt}\underbrace{\lambda_{nft}\mathbf{R}_{nf}}_{\triangleq\mathbf{Y}_{nft}},$$
Finally the mixture signal is realized as Gaussian variance modeling of the PSD
$$\mathbf{x}_{ft}\sim\mathcal{N}_{\mathbb{C}}\left(\mathbf{0},\mathbf{Y}_{ft}\right).$$

---
layout: pageBar
---

## Diarization and separation under NeuralFCASA
<br>

The objective of joint diarization and separation task is formalized as obtaining two probabilitic models:

<div text-center>

Diarization: $p(\mathbf{U}\mid\mathbf{X})$ and Separation: $p(\mathbf{Z}\mid\mathbf{X})$

</div>

However it is intractable to learn $p(\mathbf{x})$ -> variational inference.

Proposing two surrogate models

$$
\begin{array}{l}
q_{\mathbf{\phi}}(\mathbf{Z}\mid\mathbf{X})\triangleq\prod_{n,t,d=1}^{N,T,D}\mathcal{N}\left(z_{ntd}~;~{\mathbf{\mu}}_{\mathbf{\phi},ntd},{\mathbf{\sigma}}_{\mathbf{\phi},ntd}^{2}\right),\\
q_{\mathbf{\phi}}(\mathbf{U}\mid\mathbf{X})\triangleq\prod_{n,t=1}^{N,T}\mathrm{Bernoulli}\left(u_{nt}~;~{\mathbf{\eta}}_{\mathbf{\phi},nt}\right).
\end{array}
$$

and computing a tractable evidence lower bound (ELBO) for the likelihood

<!-- **(ML estimation)** The models are derived by the joint model that maximize the observed likelihood:

$$
\begin{aligned}
\log p(x) = \log p(x,u) &= \log\int p(x,u,z) dz = \log \int p(x|u,z)p(u)p(z)dz\\
&= \log \int p(x|u,z)p(z)dz + \log p(u)
\end{aligned}
$$

Two problems:
1. For separation likelihood: $p(x|u,z)$ and $p(z)$ are known by generative model assumptions, but the integral is intractable
2. For diarization likelihood: $p(u)$ is unknown -->

---
layout: pageBar
---

## Variational Inference
<br>

<!-- $$
\begin{aligned}\log\int p(x|u,z)p(z) dz &= \log \int q(z)\frac{p(x|u,z)p(z)}{q(z)} dz \geq \int q(z)\log\frac{p(x|u,z)p(z)}{q(z)} dz \\ &= \mathbb{E}_{q(z)} [\log p(x|u,z)]-\text{KL}[q(z)\|p(z)]\\\end{aligned}
$$ -->

$$
\begin{aligned}\log p_{\theta}\left(\mathbf{X}\right)&=\log\int p_{\theta}\left(\mathbf{X},\mathbf{U},\mathbf{Z}\right)d\mathbf{U}d\mathbf{Z}\\&=\log\int p_{\theta}\left(\mathbf{X},\mathbf{U},\mathbf{Z}\right)\frac{q_{\phi}\left(\mathbf{U},\mathbf{Z}\mid\mathbf{X}\right)}{q_{\phi}\left(\mathbf{U},\mathbf{Z}\mid\mathbf{X}\right)}d\mathbf{U}d\mathbf{Z}\\&\geq\mathbb{E}_{q_{\phi}\left(\mathbf{U},\mathbf{Z}\mid\mathbf{X}\right)}\left(\log\left(p_{\theta}\left(\mathbf{U},\mathbf{Z},\mathbf{X}\right)\right)\right)-\mathbb{E}_{q_{\phi}\left(\mathbf{U},\mathbf{Z}\mid\mathbf{X}\right)}\left(\log\left(q_{\phi}\left(\mathbf{U},\mathbf{Z}\mid\mathbf{X}\right)\right)\right)\\&=\mathbb{E}_{q_{\phi}\left(\mathbf{U},\mathbf{Z}\mid\mathbf{X}\right)}\left(\log\left(p_{\theta}\left(\mathbf{X}\mid\mathbf{U},\mathbf{Z}\right)p_{\theta}\left(\mathbf{Z}\mid\mathbf{X}\right)p_{\theta}\left(\mathbf{U}\mid\mathbf{X}\right)\right)\right)\\&-\mathbb{E}_{q_{\phi}\left(\mathbf{U}\mid\mathbf{X}\right)q_{\phi}\left(\mathbf{Z}\mid\mathbf{X}\right)}\left(\log\left(q_{\theta}\left(\mathbf{U}\mid\mathbf{X}\right)q_{\theta}\left(\mathbf{Z}\mid\mathbf{X}\right)\right)\right)\\&=\underbrace{\mathbb{E}_{q_{\phi}\left(\mathbf{U},\mathbf{Z}\mid\mathbf{X}\right)}\left(\log p_{\theta}\left(\mathbf{X}\mid\mathbf{U},\mathbf{Z}\right)\right)-\mathrm{KL}\left(q_{\phi}\left(\mathbf{Z}\mid\mathbf{X}\right)\mid\mid p_{\theta}\left(\mathbf{Z}\mid\mathbf{X}\right)\right)}_{\triangleq\frac{1}{FT}\mathcal{L}^{\left(\mathrm{sep}\right)}}\\&\underbrace{-\mathrm{KL}\left(q_{\phi}\left(\mathbf{U}\mid\mathbf{X}\right)\mid\mid p_{\theta}\left(\mathbf{U}\mid\mathbf{X}\right)\right)}_{\triangleq\frac{1}{NT}\mathcal{L}^{\left(\text{diar}\right)}}\end{aligned}
$$

---
layout: pageBar
---

# Improve the separation model
<br>

The Gaussian variance modeling assumes the Gaussianity of speech signal, however speech is more heavy-tailed, thus we consider a heavy-tailed extension to the variance modeling in the separation model, under the Gaussian Scalar Mixture (GSM) model formulation:

$$
s_{nft}|r_{ft} \sim \mathcal{N}_{\mathbb{C}}(0,r_{ft} \lambda_{nft})
$$

where the impulsive variable $r$ is a random positive variable. By assuming different prior model for $r$ and marginalizing it, we obtain two types of heavy-tailed model families.

$$
\begin{array}{rlr}&{\mathbf{x}_{ft}\sim\mathcal{GG}_{\mathbb{C}}^{\beta}\left(0,\mathbf{Y}_{ft}\right)}&{\mathrm{(Leptokurtic)},}&\\
&{\mathbf{x}_{ft}\sim\mathcal{T}_{\mathbb{C}}^{\nu}\left(0,\mathbf{Y}_{ft}\right)}&{\mathrm{(Student~s~t)},}\end{array}
$$

Notice that the vanilla Gaussian variance implies $r$ is a deterministic variable.

---
layout: pageBar
---
## Result
<br>

<img src="result1.png"/>

---
layout: pageBar
---

# Improvement the diarization model
<br>

The neuralFCASA doesn't implement a prior model over the diarization model, making the hybrid model not fully Bayesian. Also, what if we suppose the speaker activity follows a common prior as a regularization?

For Bernoulli variables, a common choice is the Beta prior (as the Bayesian conjugate prior)

$$
\begin{array}{l}{\eta_{nt}\sim\operatorname{Beta}(\alpha,\beta)}\\
{u_{nt}\sim\operatorname{Bernoulli}(\eta_{nt})}\end{array}
$$

To solve, still use variational inference, with the following inference model:

$$
{q_{\phi}(\mathbf{H}\mid\mathbf{X})\triangleq\prod_{n,t=1}^{N,T}\mathrm{Beta}\left(\eta_{nt}~\big|~\alpha_{\phi, nt},\beta_{\phi,nt}\right),}
$$

---
layout: pageBar
---

## Variantional Inference
<br>

$$
\begin{aligned}\log p(x,u) &= \log\int p(x,u,\pi,z) d\pi dz\\ &= \log \int q(\pi,z)\frac{p(x|u,z)p(u|\pi)p(z)p(\pi)}{q(\pi,z)} d\pi dz \\&\geq \int q(\pi,z)\log\frac{p(x|u,z)p(u|\pi)p(z)p(\pi)}{q(\pi,z)} d\pi dz \\ &= \mathbb{E}_{q(\pi)q(z)} [\log p(x|u,z)p(u|\pi)]-\text{KL}[q(z)\|p(z)] -\text{KL}[q(\pi)\|p(\pi)]\\&=\underbrace{\mathbb{E}_{q(\pi)q(z)} [\log p(x|u,z)]-\text{KL}[q(z)\|p(z)]}_{\mathcal{L}_{sep}} +\underbrace{\mathbb{E}_{q(\pi)} [\log p(u|\pi)]-\text{KL}[q(\pi)\|p(\pi)]}_{\mathcal{L}_{diar}} \end{aligned}
$$

---
layout: pageBar
---
## Result
<br>

<div class="flex mt-3">
<img class="h-100" src="result2.png"/>

<div>
Consistently better than the baseline model without Beta prior.
</div>

</div>

---
layout: end
---