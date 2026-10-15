---
theme: ../themes/telecom
layout: cover
class: text-left
authors:
  # First author should be the presenter
  - Sicheng Mao: []

meeting: "PhD Defense"
preTitle: "Generative Modeling for Robust Speaker Diarization"
preTitleAbbr: "Generative Modeling for Robust SD"

canvasWidth: 1080
aspectRatio: 16/9
---

---
layout: pageBar
hideInToc: true
---

# Outline
<br>

1. Overview of speaker diarization
2. Paradigms of speaker diarization
3. Neural FCASA: joint modeling of diarization and separation
4. Our contributions: Beta FCASA and Heavy-tailed FCASA
5. Conclusion

---
layout: pageBar
---

# What is Speaker Diarization?
<br>

### Objective: Decide who speaks when
- Who: *Identify* the active speakers.
- When: Find the *boundary* of their speech/voice activity.
<v-click>

### Data
- Input: Mono-channel/Multi-channel audio
- Output: Rich Transcription Time Marked (RTTM) file
<br>
which stores file type, file name, channel ID, begin time, duration, speaker ID.
```csv
SPEAKER ES2005a 1 0.00 1.25 <NA> <NA> 1 <NA> <NA>
SPEAKER ES2005a 1 1.10 2.10 <NA> <NA> 2 <NA> <NA>
SPEAKER ES2005a 1 3.50 1.00 <NA> <NA> 1 <NA> <NA>
```
<img class="w-100%" src="/rttm.png" alt="RTTM Example" />
</v-click>

---
layout: twoCols
ratio: 2:1
gap: 20px
hideInToc: true
---

# Challenges of speaker diarization
<br>

#### Speaker diarization is a special case of pattern recognition problem.
<br>

::left::

<div v-click="1">

### Difference versus Identity

- The core problem in pattern recognition in general.
- Distinguish two types of variability:
  - **Intra-class variability**: differences that should be ignored, *style*.
  - **Inter-class variability**: differences that should be emphasized, *content*.
- The two types of variability are **entangled**.
</div>
  
<div v-click="2">

### Relative versus Absolute

- Relative: numbers are relative labels, e.g., anonymous speakers.
- Absolute: numbers are absolute labels, e.g., figures in MNIST.
</div>

::right::
<div v-click="1">
<img class="h-70" src="/mnist_hard.png"/>
</div>

---
layout: pageBar
---

# Challenges of speaker diarization 
<br>

#### Many factors contribute to the difficulty of speaker diarization problem.
<br>

<v-click>

### Speech variability in general
- Intra-speaker variability: phone, prosody, emotion... (more time varying)
- Inter-speaker variability: timbre, accent... (less time varying)
- They are entangled.
- Hard to define speaker identity in "positive terms" but rather specifying the differences and "modulo" them.
</v-click>

<v-click>

### Speech variability in meeting scenario
- Complex acoustic environment: noise, reverberation.
- Complex speech dynamics: overlap speech, indetermined number of speakers.
</v-click>

<v-click>

### Data scarcity
- The amount of labeled data is limited, e.g., AMI corpus (~100 h).
- The effective information in speech data is low, e.g., 3 mins of audio (30MB) $\approx$ 10 million of characters.
</v-click>

<!-- ### method
- Data-driven: large synthetic data(10K hours) + large Transformer model (EEND, 60M) -> recently jointly modeled as a General-ASR task with LLM backbone (VibeVoice-ASR, 9B), dominates signal channel diarization.
- Model-driven: particularly with signal models to exploit multi-channel information.

This presentation: **multichannel diarization with source separation models** -->

---
layout: twoCols
---

# How to address these challenges
<br>

<v-click>

### Entangled variabilities -> representation learning
- Minimize intra-speaker variability and maximize inter-speaker variability
- Representations are more separable hence identities are more distinguishable.

</v-click>
<br>
<v-click>

### Data scarcity -> generative modeling

- Incorporate prior knowledge to compensate the lack of data
- Compression of information via generative models
</v-click>

::left::

<div v-click="1">
<img src="/linear_separability.png"/>
</div>

::right::

<div v-click="2">
<img src="/low_dimension.png"/>
</div>

<!-- ---
layout: pageBar
---

# Generative modeling 
<br>

How can generative modeling help?

- Able to incorporate prior knowledge:
  - GMM-HMM
  - Probabilistic Linear Discriminant Analysis (PLDA)
- Deep generative models show effectiveness in representation learning:
  - **variational autoencoders (VAEs)**
  - normalizing flows (NFs)
  - diffusion models -->

---
layout: pageBar
---

# Evaluation metrics
<br>

To evaluate the performance of diarization system, we typically use the **Diarization Error Rate (DER)**, which includes three types of errors:
- **Missed** (Miss): a frame belongs to some speaker while it is not predicted to that speaker.
- **False alarm** (FA): a frame belongs to no speaker while it is predicted to some speaker.
- **Speaker confusion** (Conf.): a frame belongs to one speaker while it is predicted to another speaker.

The DER is computed as:
$$
\mathrm{DER} = \frac{\mathrm{FA} + \mathrm{Miss} + \mathrm{Conf.}}{\text{Total annotated duration}}
$$

Another commonly used metric is the **Jaccard Error Rate (JER)**, which evaluates the error rate speaker-wise:

$$
\mathrm{JER}=\frac1{N_{ref}}\sum_i^{N_{ref}}\frac{\mathrm{FA_i+Miss_i}}{\mathrm{TOTAL_i}}
$$

---
layout: pageBar
---

# Speaker diarization paradigms
<br>

### Paradigms based on the modeling approach
- Data-driven:
  - Large data for end-to-end training (e.g. EEND [Fujita et al., 2020])
  - Large parameter with LLM backbone (e.g. VibeVoice-ASR [Peng et al., 2026])

- Model-driven: particularly with signal models to exploit **multi-channel** information.

<br>

<v-click>

### Paradigms based on the modeling objective

- Segmentation-clustering paradigm: traditional models with modular pipeline
- Multi-label classification paradigm: end-to-end neural network model
- Text-generation paradigm: regarding speaker diarization as a text generation problem
</v-click>

<v-click>

<span text-red-600>Our contributions fall in the model-driven and multi-label classification paradigm.</span>
</v-click>

---
layout: twoCols
---

# Segmentation-clustering paradigm
<br>

::left::
### Pipeline
1. Cut the audio into short segments.
2. Extract speaker representations from the segments.
3. Cluster the speaker representations based on similarity scores.

::right::
<img class="w-100%" src="/ahc.png"/>

::bottom::
<v-click>

### Components
- Speaker embedding extractor
  - Representation learning using classification head and discriminative loss, e.g., cross-entropy loss, margin loss.
  - Can be trained only on massive single speaker recordings rather than labeled meeting data.
- Scoring method: cosine similarity (simple) v.s. PLDA (probabilistic).
- Clustering algorithm: AHC (time-independent) v.s. VB-HMM (time-dependent).

</v-click>
---
layout: pageBar
---

# Multi-label classification paradigm
<br>

### End-to-end neural diarization (EEND)
- Formulate the speaker diarization as a per-frame multi-label classification problem.
- Permutation invariant training (PIT) to handle the label ambiguity.
- Model the speaker variability and time variability jointly. 
- Synthetic conversational speech from single-speaker recordings to compensate for the data scarcity.

<br>

### Following works
- Stronger backbone to improve time dynamic modeling: EEND-EDA.
- Leverage multi-channel information: Multi-channel EEND.
- Joint source separation and diarization: EEND-SS.

However, these models are still problematic:
1. Still data-driven therefore data-hungry.
2. Gap between synthetic data and real conversational speech.

---
layout: pageBar
---

# Model-driven diarization?
<br>

#### Q: Can we incorporate prior knowledge of into diarization model to reduce the requirement training data?

#### A: We don't know how. We have little knowledge on the **speaker identity** or the **conversational dynamics**.
<br>

#### Q: Can other task help?
#### A: Yes! For example the source separation (SS) task.
- Intuitively, if we separate the sources perfectly, the diarization task becomes simply VAD.
- Experimentally, EEND-SS demonstrates the helpfulness.

<br>

#### Q: Do we have prior knowledge on the auxiliary task?
#### A: Yes! SS has been well studied during many years and there are many DSP models for it.

<br>

#### So we need to investigate model-driven source separation first!

---
layout: pageBar
---

# Model-driven separation
<br>
We begin with a common generative model for multichannel source separation.

Given $f,t$ as the frequency and time indices of a TF-domain representation. Denote $\lambda_{nft}$ the **power spectrum density (PSD)** of speaker $n$, the signal $s_{nft}$ is generated from the **Gaussian variance modeling**:

$$s_{nft} \sim \mathcal{N}_{\mathbb{C}}\left(0, \lambda_{nft}\right),$$

The image signal $\mathbf{x}_{nft}$ is generated from the source signal $s_{nft}$ modulated by the spatial covariance matrix $\mathbf{R}_{nf}$:

$$\mathbf{x}_{nft} \sim \mathcal{N}_{\mathbb{C}}\left(0, \lambda_{nft}\mathbf{R}_{nf}\right).$$

The mixture signal $\mathbf{x}_{ft}$ is the sum of the image signals of all speakers:

$$\mathbf{x}_{ft}=\sum_{n=1}^{N}\mathbf{x}_{nft}\sim\mathcal{N}_{\mathbb{C}}\left(0, \mathbf{Y}_{ft}\right).$$

where $\mathbf{Y}_{nft}=\lambda_{nft}\mathbf{R}_{nf}$ and $\mathbf{Y}_{ft}=\sum_{n=1}^{N}\mathbf{Y}_{nft}$.

<!-- This model is used in many multichannel source separation algorithms, such as Independent Vector Analysis (IVA) and Multichannel Nonnegative Matrix Factorization (MNMF). -->

---
layout: pageBar
---

# Source separation with hybrid models
<br>

### Neural Full-rank Covariance Analysis (Neural FCA)

On top of the common generation model for multichannel source separation, the neural FCA introduces a deep generative model for the source PSD, with a deep spectral feature $\mathbf{z}_{nt}$ and a neural network $g_{\theta, f}(\cdot)$:
$$
\begin{aligned}
\mathbf{z}_{nt}&\sim\mathcal{N}(\mathbf{0},\mathbf{I}),\\
\lambda_{nft}&=g_{\theta, f}(\mathbf{z}_{nt}),\\
\mathbf{x}_{ft}&\sim\mathcal{N}_{\mathbb{C}}\left(0, \mathbf{Y}_{ft}\right).
\end{aligned}
$$

### Hybrid inference
- Infer $g$ with variational autoencoder (VAE).
- Infer $\lambda_{nft}$ and $\mathbf{R}_{nf}$ with iterative source steering method (ISS).

**Blind source separation**: completely unsupervised, does not need supervised training with clean separated signals.

---
layout: pageBar
---

# Joint separation and diarization
<br>

### Neural FCA with Speaker Activity (Neural FCASA) [Bando et al., 2024]
Neural FCASA proposes a joint separation and diarization framework on top of the neural FCA, which incorporates speaker activity mask $u_{nt}\in \{0,1\}$ into the generation model:

$$
\mathbf{x}_{ft}\sim\mathcal{N}_{\mathbb{C}}\left(0, \mathbf{Y}_{ft}\right).
$$

where $\mathbf{Y}_{ft}=\sum_{n=1}^{N}\textcolor{red}{u_{nt}}\lambda_{nft}\mathbf{R}_{nf}$.

- It only needs speaker annotated mixture signals for training.
- It is data-efficient(90h) and parameter-efficient(~20M).

From a separation perspective, it is a source separation model with diarization annotations as weak supervision. 

<span text-red-600>From a diarization perspective, it is a diarization model incorporating prior knowledge from a source separation model.</span>

---
layout: pageBar
---

# Objective of neural FCASA
<br>

Under neural FCASA framework, diarization and separation are formalized as solving two probabilitic models:

<div text-center>

Diarization: $p(\mathbf{U}\mid\mathbf{X})$, and Separation: $p(\mathbf{Z}\mid\mathbf{X})$

</div>

However it is intractable to learn $p(\mathbf{X})$ -> variational inference.

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

# Variational Inference (VI)
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

When combined with neural FCASA, we call it **Beta FCASA** [Mao et al., 2026a][^1].
<br>

<br>

<br>

<br>

[^1]: Neural Multichannel Distant Speaker Diarization and Source Separation with Beta Speaker Activity Prior

---
layout: pageBar
---

# VI in Beta FCASA
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
layout: twoCols
hideInToc: true
---

# A subtlety of the Beta distribution
<br>

An illustration of the shape of Beta distribution w.r.t. its parametrization:

::left::
<img class="w-100" src="/beta-distribution.png"/>

::right::
<img class="w-100" src="/beta-pert.png"/>

::bottom::
In short, under PERT parametrization, we can directly optimize the shape.

---
layout: pageBar
---

# Wrap-up
<br>

<div class="flex mt-3 justify-center">
<img class="h-100" src="/beta-overview.png"/>
</div>

---
layout: twoCols
---

# Experiments and results
<br>

::left::
We choose different $m,\lambda$ for the prior model $p(\mathbf{H})$, and verify our methods on the AMI dataset.
- We observe consistently better performance than the baseline model (without Beta prior).
- $\lambda$ has less impact on the results, comparing to $m$.
- Following experiments on AliMeeting and CHiME-6 demonstrates the efficacy of our methods on broader datasets

::right::
<br>
<img src="/beta-result.png"/>

---
layout: pageBar
---

# Heavy-tailed separation model
<br>

- Gaussian variance modeling assumes the Gaussianity of speech signal.
- However speech signal shows more **heavy-tailedness**.
- We consider a heavy-tailed extension to the variance modeling in the **separation model**!

Under the **Gaussian Scalar Mixture (GSM)** model formulation:

$$
s_{nft}|r_{ft} \sim \mathcal{N}_{\mathbb{C}}(0,r_{ft} \lambda_{nft})
$$

where the impulsive variable $r$ is a random positive variable. By assuming different prior model for $r$ and marginalizing it, we obtain two types of heavy-tailed model families.

$$
\begin{array}{rlr}&{\mathbf{x}_{ft}\sim\mathcal{GG}_{\mathbb{C}}^{\beta}\left(0,\mathbf{Y}_{ft}\right)}&{\mathrm{(Leptokurtic)},}&\\
&{\mathbf{x}_{ft}\sim\mathcal{T}_{\mathbb{C}}^{\nu}\left(0,\mathbf{Y}_{ft}\right)}&{\mathrm{(Student~s~t)},}\end{array}
$$
<!-- Notice that the vanilla Gaussian variance implies $r$ is a deterministic variable. -->

Combined with the neural FCASA, we call this **Heavy-tailed FCASA** [Mao et al., 2026b][^2]
<br>

<br>

[^2]: Neural Multichannel Distant Speaker Diarization with Heavy-tailed Source Separation Model

---
layout: pageBar
---

# VI in Heavy-tailed FCASA
<br>

Inference model: same

ELBO function: 

1. $\mathcal{L}_{recons}^{(sep)}$ changes to the heavy-tailed version.
2. $\mathcal{L}_{kl}^{(sep)}$ remains the same as in the Gaussian case, as the prior of the latent feature $\mathbf{z}$ remains the same.
3. $\mathcal{L}^{(diar)}$ remains the same.

---
layout: pageBar
---

# Shape parameters of the heavy-tailedness
<br>

The Leptokurtic Generalized Gaussian distribution and the Student's t-distribution have **shape parameters** $\nu \in [0,2)$ and $\beta \in (0,+\infty)$, respectively. The shape parameter controls the degree of heavy-tailedness.

<div class="flex mt-3 justify-center">
<img class="h-80" src="/heavy-tail-models.png"/>
</div>

---
layout: pageBar
---

# Wrap-up
<br>

<div class="flex mt-3 justify-center">
<img class="h-100" src="/heavy-overview.png"/>
</div>

---
layout: twoCols
---

# Experiments and results
<br>

::left::
We choose different shape parameters for the two heavy-tailed models and verify their effectiveness on the AMI dataset.

- For some shape parameters, we observe consistently better performance than the baseline model (without heavy-tailed variance modeling).
- Following experiments on AliMeeting and CHiME-6 demonstrates the efficacy of our methods on broader datasets

::right::
<br>
<img src="/heavy-result1.png"/>
<img src="/heavy-result2.png"/>

---
layout: twoCols
---

# Joint Heavy-tailed and Beta FCASA
<br>

::left::
We combine both improvements together as they are independent modifications on the neural FCASA.
- We choose $m=0.5,\lambda=4.0$ for the Beta FCASA and $\nu=1$ for the Heavy-tailed FCASA with Student's t-distribution.
- We notice that the heavy-tailed FCASA and Beta FCASA model are compatible, the joint FCASA model, leading to better performance than individual improvements on AMI dataset.
- On AliMeeting and CHiME-6 datasets, the joint FCASA model consistently outperforms the baseline.

::right::
<br>
<img class="w-100%" src="/joint-result.png"/>

---
layout: twoCols
ratio: "2:1"
gap: 10px
---

# Conclusions
<br>

::left::
### Conclusions
In the joint modeling of separation and diarization:
- A heavy-tailed separation model improves the diarization performance.
- A Beta speaker prior model improves the diarization performance.
- Joint improvements are compatible and usually better than individual ones.

<br>

### Limitations
- Heavy-tailed FCASA is sensitive to hyperparameter tuning.
- Optimal combination of joint FCASA hyperparameters are not well searched.
- Threshold selection for the diarization model is not investigated.
- No evaluation on separation metrics.
- Evaluation of both improvements are tested only in joint modeling condition.

<br>

::right::
### Open-source link
[alephpi/neural-fcasa](https://github.com/alephpi/neural-fcasa)

<br>
<img class="h-30" src="/github-qr-code.png" alt="GitHub" />

---
layout: pageBar
---

# Future Work
<br>

- Address aforementioned limitations.
- Incorporate geometric configuration of the microphone array.
- Incorporate more complex conversational dynamics.
- Incorporate speaker localization task.

---
layout: end
---