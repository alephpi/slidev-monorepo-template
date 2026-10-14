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

<Toc/>

<!-- 
1. what is speaker diarization: data, objective
2. challenges in speaker diarization
3. three paradigms in speaker diarization
4. model-driven paradigm and neural fcasa
5. variational autoencoder
6. multi-label classification
7. speech separation signal processing model and generative modeling of NeuralFCASA
8. variational inference for joint diarization and separation
9. improvement of separation model
10. improvement of diarization model
11. joint improvements
12. conclusion
 -->

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

<span class="text-red-600">Our contributions fall in the model-driven and multi-label classification paradigm.</span>
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
We begin with a common generative model for multichannel source separation. [add ref]

Given $f,t$ as the frequency and time indices of a TF-domain representation. Denote $\lambda_{nft}$ the **power spectrum density (PSD)** of speaker $n$, the signal $s_{nft}$ is generated from the **Gaussian variance modeling**:

$$s_{nft} \sim \mathcal{N}_{\mathbb{C}}\left(0, \lambda_{nft}\right),$$

The image signal $\mathbf{x}_{nft}$ is generated from the source signal $s_{nft}$ modulated by the spatial covariance matrix $\mathbf{R}_{nf}$:

$$\mathbf{x}_{nft} \sim \mathcal{N}_{\mathbb{C}}\left(0, \lambda_{nft}\mathbf{R}_{nf}\right).$$

The mixture signal $\mathbf{x}_{ft}$ is the sum of the image signals of all speakers:

$$\mathbf{x}_{ft}=\sum_{n=1}^{N}\mathbf{x}_{nft}=\mathcal{N}_{\mathbb{C}}\left(0, \sum_{n=1}^{N}\lambda_{nft}\mathbf{R}_{nf}\right).$$

<!-- This model is used in many multichannel source separation algorithms, such as Independent Vector Analysis (IVA) and Multichannel Nonnegative Matrix Factorization (MNMF). -->

---
layout: pageBar
---

# NeuralFCA
<br>

NeuralFCA proposes a deep spectral features, together with the common separation model

---
layout: pageBar
---

# NeuralFCASA
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

<img src="/result1.png"/>

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
<img class="h-100" src="/result2.png"/>

<div>
Consistently better than the baseline model without Beta prior.
</div>

</div>

---
layout: end
---