---
theme: ../themes/telecom
layout: cover
class: text-left
authors:
  # First author should be the presenter
  - Sicheng Mao: ["Telecom Paris, Institut Polytechnique de Paris"]
  - Mathieu Fontaine: ["Telecom Paris, Institut Polytechnique de Paris"]
  - Anthony Larcher: ["Université du Mans"]
  - Roland Badeau: ["Telecom Paris, Institut Polytechnique de Paris"]

meeting: "Interspeech 2026"
preTitle: "Neural Multichannel Distant Speaker Diarization and Source Separation
 with Beta Speaker Activity Prior"
preTitleAbbr: "Beta FCASA"
preDate: "30 September, 2026"
canvasWidth: 1080
aspectRatio: 16/9
---

<!-- ---
layout: pageBar
hideInToc: true
---

# Outline

<Toc/> -->

---
layout: pageBar
---

# Background
<br>

## Speaker diarization
Figure out *who spoke when* in a multi-speaker audio recording.

## Speech signals in meeting scenario
- Data: far field, multi-channel speech mixture signals
- Challenges: noise, reverberation; overlap speeches; unknown number of speakers 

## General paradigms
Data-driven:
  - Large data for end-to-end training (e.g. EEND [Fujita et al., 2020])
  - Large parameter with LLM backbone (e.g. VibeVoice-ASR [Peng et al., 2026])

<span class="text-red-600">Model-driven: Incorporate prior knowledge to reduce the data and parameter requirements.</span>

<!-- This presentation: **multichannel diarization with source separation models** -->

---
layout: pageBar
---

# Diarization meets separation 
<br>
A close relationship between source separation and speaker diarization:

- If separation is perfect, diarization reduces to VAD.
- If diarization is perfect, separation benefits from the speaker activity mask.

A baseline model: Neural FCASA[Bando et al., 2024]
- Stands for Neural **F**ull-rank **C**ovariance **A**nalysis with **S**peaker **A**ctivity.
- Marrying a source separation model and a diarization model to do joint task
- Compared to the data-driven models, it is data-efficient (~100h) and parameter-efficient(~20M)
<!-- - Source separation model: NeuralFCA
- Diarization model: EEND -->

From a separation perspective, it is a source separation model with diarization annotations as weak supervision. [Bando et al., 2024]

From a diarization perspective, it is a diarization model incorporating prior knowledge from a source separation model. [Our work]

<!-- NeuralFCASA proposed a joint separation and diarization framework, which tries to do source separation with diarization annotations (weakly-supervision in terms of separation task). -->

<!-- Reversely, if we look from the diarization perspective, it only uses diarization annotation and the mixtures. And intuitively, diarization task reduce to VAD if we get clean separated signal, so jointly learn how to diarize and separate help each other. -->

---
layout: pageBar
---

# Generative modeling in Neural FCASA
<br>

Given $n,t,f$ as the speaker, time and frequency indices: 
a deep latent source feature

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

# Objective of neural FCASA
<br>

Joint diarization and separation task is formalized as solving two probabilitic models:

<div text-center>

Diarization: $p(\mathbf{U}\mid\mathbf{X})$ and Separation: $p(\mathbf{Z}\mid\mathbf{X})$

</div>

However it is intractable to learn $p(\mathbf{x})$ -> variational inference.

Proposing two surrogate models

$$
\begin{array}{l}
q_{\mathbf{\phi}}(\mathbf{Z}\mid\mathbf{X})\triangleq\prod_{n,t,d=1}^{N,T,D}\mathcal{N}(z_{ntd}~;~{\mathbf{\mu}}_{\mathbf{\phi},ntd},{\mathbf{\sigma}}_{\mathbf{\phi},ntd}^{2}),\\
q_{\mathbf{\phi}}(\mathbf{U}\mid\mathbf{X})\triangleq\prod_{n,t=1}^{N,T}\mathrm{Bernoulli}(u_{nt};{\mathbf{\eta}}_{\mathbf{\phi},nt}),
\end{array}
$$

and computing a tractable evidence lower bound (ELBO) for the likelihood.

---
layout: pageBar
---

# Variational Inference
<br>

$$
\log p_{\theta}(\mathbf{X},\mathbf{U})\geq\underbrace{\mathbb{E}_{q_{\phi}(\mathbf{Z}\mid\mathbf{X})}[\log p_{\theta}(\mathbf{X}\mid\mathbf{U},\mathbf{Z})]}_{\mathcal{L}_{recons}^{(sep)}}
\underbrace{-\mathrm{KL}[q_{\phi}(\mathbf{Z}\mid\mathbf{X})\mid\mid p_{\theta}(\mathbf{Z})]}_{\mathcal{L}_{kl}^{(sep)}}+\underbrace{\log p(\mathbf{U})}_{\mathcal{L}^{(diar)}},
$$

$\mathcal{L}_{recons}^{(sep)}$ and $\mathcal{L}_{kl}^{(sep)}$: ELBO [Kingma et al., 2014a] for separation model, with a teacher-forcing trick ($\mathbf{U}$).

$\mathcal{L}^{(diar)}$: $\log p(\mathbf{U})$ is not defined in the generative model, instead, use $\log q_{\phi}(\mathbf{U}|\mathbf{X})$ as an approximation. Similar to semi-supervised VAE loss [Kingma et al., 2014b].

<br>

<div class="text-red-600">

Can we define a prior model for the speaker label $\mathbf{U}$, so that we can perform variational inference for the diarization model as well?
</div>

---
layout: pageBar
---

# Prior model for speaker activity 
<br>

A prior model for the speaker activity mask $\mathbf{U}$, which might intuitively capture prior knowledge about the speaker activity patterns, including:
  1. the speaker's character, e.g., whether he/she is outgoing or shy to speak,
  2. the ambiance of the conversation, e.g., whether it is encouraging or discouraging for the attendees to speak.

As the speaker activity mask $\mathbf{U}$ is a binary variable, we propose to model it as a Bernoulli variable with a Beta prior:
$$
\begin{array}{l}{\eta_{nt}\sim\operatorname{Beta}(\alpha,\beta)}\\
{u_{nt}\sim\operatorname{Bernoulli}(\eta_{nt})}\end{array}
$$

When combined with neural FCASA, we call it **Beta FCASA**.

---
layout: pageBar
---

# Variational Inference in Beta FCASA
<br>

Inference model:
$$
{q_{\phi}(\mathbf{H}\mid\mathbf{X})\triangleq\prod_{n,t=1}^{N,T}\mathrm{Beta}\left(\eta_{nt}~\big|~\alpha_{\phi, nt},\beta_{\phi,nt}\right),}
$$

ELBO for the joint likelihood now becomes:
$$
\begin{aligned}
\log p_{\theta}(\mathbf{X},\mathbf{U})
&\geq\underbrace{\mathbb{E}_{q_{\phi}(\mathbf{Z}\mid\mathbf{X},\mathbf{U})}[\log p_{\theta}(\mathbf{X}\mid\mathbf{U},\mathbf{Z})]}_{\mathcal{L}_{recons}^{(sep)}}\underbrace{-D_{\mathrm{KL}}[q_{\phi}(\mathbf{Z}\mid\mathbf{X})\| p_{\theta}(\mathbf{Z})]}_{\mathcal{L}_{kl}^{(sep)}}\\
&+\underbrace{\mathbb{E}_{q_{\phi}(\mathbf{H})}[\log p_{\theta}(\mathbf{U}\mid\mathbf{H})]}_{\mathcal{L}_{recons}^{(diar)}}\underbrace{-D_{\mathrm{KL}}(q_{\phi}(\mathbf{H})\| p_{\theta}(\mathbf{H}))}_{\mathcal{L}_{kl}^{(diar)}},
\end{aligned}
$$

i.e., for the diarization likelihood, we optimize explicitly its ELBO function.

---
layout: pageBar
---

# Tractablitity of the ELBO
<br>

- The separation part: standard (Gaussian) VAE ELBO, tractable (See VAE paper [Kingma et al., 2014a])
- The diarization part: 
  - Reconstruction loss: use Beta-Bernoulli conjugacy
    $$u\psi(\alpha_\phi)+(1-u)\psi(\beta_\phi)-\psi(\alpha_\phi+\beta_\phi)$$

  - KL divergence: use the closed-form of KL divergence between two Beta distributions
    $$\ln\frac{\Gamma(\alpha_\phi+\beta_\phi)\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha+\beta)\Gamma(\alpha_\phi)\Gamma(\beta_\phi)}+(\alpha_\phi-\alpha)\psi(\alpha_\phi)+(\beta_\phi-\beta)\psi(\beta_\phi)-(\alpha_\phi+\beta_\phi-\alpha-\beta)\psi(\alpha_\phi+\beta_\phi)$$
  where $\psi(\cdot)$ is the digamma function and $\Gamma(\cdot)$ is the gamma function.

---
layout: pageBar
---

# A subtlety of the Beta distribution
<br>

Under the canonical parametrization, the PDF of Beta distribution is:
$$\mathrm{Beta}(u;\alpha,\beta) = \frac{u^{\alpha-1}(1-u)^{\beta-1}}{B(\alpha,\beta)}, \quad u \in (0, 1)$$

- the shape parameters $\alpha$ and $\beta$ has no interpretable statistical meaning.
- Reparametrization in terms of *mode* $m$ and *concentration* $\lambda$ by the PERT parametrization (Malcolm et al. 1959):

$$
\begin{align*}
\mathrm{PERT}&:(\alpha,\beta) \mapsto \left(\frac{\alpha-1}{\alpha+\beta-2},\alpha+\beta-2\right),\\
\mathrm{PERT}^{-1}&: (m,\lambda) \mapsto (1 + \lambda m, 1 + \lambda ( 1 - m ))
\end{align*}
$$

This is a differentiable bijection for $\alpha,\beta>1$.

---
layout: pageBar
hideInToc: true
---

# A subtlety of the Beta distribution
<br>
An illustration of the shape of Beta distribution w.r.t. its parametrization:
<div class="flex mt-3">
<img class="w-100" src="/beta-distribution.png"/>

<div>
<img class="w-100" src="/beta-pert.png"/>
</div>

</div>

In short, under PERT parametrization, we can directly optimize the shape.

---
layout: pageBar
---

# Wrap-up

<div class="flex mt-3 justify-center">
<img class="h-100" src="/overview.png"/>
</div>

---
layout: pageBar
---

# Results
<br>
<div class="flex mt-3">
<img class="w-100" src="/result.png"/>

<div>

We choose different $m,\lambda$ for the prior model $p(\mathbf{H})$, and verify our methods on the AMI dataset.
- We observe consistently better performance than the baseline model (without Beta prior).
- $\lambda$ has less impact on the results, comparing to $m$.
- Following experiments on AliMeeting and CHiME-6 demonstrates the efficacy of our methods on broader datasets (Not shown in the paper but in my thesis)
</div>

</div>

---
layout: pageBar
---

# Future work
<br>

- The estimation of the optimal hyperparameter $m$ and $\lambda$.
- A better temporal model for speaker activity that incorporates more complex conversational dynamics.
- Improving diarization with a better separation model [Mao et al. 2026b] (Another work of us with heavy-tailed separation model, to be presented on SLT 2026 🤗 ).

<div class="fixed bottom-4 p-3">

[Mao et al. 2026b]: Neural Multichannel Distant Speaker Diarization with Heavy-tailed Source Separation Model
</div>
---
layout: pageBar
---

# Contacts
<br>

- GitHub Repo of this work: <img class="h-30" src="./github-qr-code.png" alt="GitHub" />
- LinkedIn: <img class="h-30" src="./linkedin-qr-code.png" alt="LinkedIn" />
- WeChat (ask me personally 😊 )

BTW, except for diarization, I'm also interested in audio codec, efficient TTS and low-resource TTS. If you are interested in or working on these topics, welcome to contact me as well.

---
layout: end
---

Thank you!