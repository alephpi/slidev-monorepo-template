---
theme: ../themes/personal
layout: cover
class: text-left
preTitle: 深度学习概览

  及其在语音处理中的应用
meeting: 机器学习讨论班
authors:
  # First author should be the presenter
  - 毛思成 : []

---

---
layout: pageBar
hideInToc: true
---

# 大纲
<br>

<Toc/>

---
layout: center
---

# 机器学习概览
- 基本概念
- 模式识别
- 特征
- 表征
- 表征学习
- 什么是好的表征？
- 数据与标签
- 小节

---
layout: pageBar
hideInToc: true
---

# 基本概念
<br>

<div class="grid grid-cols-[6fr_4fr] gap-5">
<div class="flex flex-col">

机器学习：借助算法从数据中获得统计规律，并利用规律对未知数据进行预测。
<!-- 又称为统计学习。 -->

深度学习：专指以人工神经网络为主要模型的机器学习算法

算法 = 模型 + 训练 + 推理
- 模型 model：一种独立于数据的先验结构
- 训练 training：调整模型参数拟合已知数据的过程
- 推理 inference：固定模型参数预测未知数据的过程
</div>
<div class="flex flex-col">
<img src="/img/venn.png" class="w-100% mb-3">
</div>

</div>

---
layout: pageBar
hideInToc: true
---

# 模式识别 
Pattern Recognition

机器学习的经典任务是模式识别，其核心在于判断**是**与**不是**，即**什么属于同一模式，什么不属于同一模式**。

<div class="grid grid-cols-[7fr_3fr] gap-5">
<div class="flex flex-col">

例如经典的手写数字识别问题（MNIST， Lecun）

难点：

- 概念上**不同**的数字在像素空间中的实现**不同**（信号意义上的差异）
- 概念上**相同**的数字在像素空间中的实现**也不同**（噪声意义上的差异）
- 这两种差异在像素空间中的区别并不清晰（低信噪比）

由此使用统计模型，因其能够容忍噪声，在含有噪声的情况下进行推断。
</div>
<div class="flex flex-col">
<img src="/img/mnist2.png" class="w-100% mb-3">

</div>

</div>
---
layout: pageBar
hideInToc: true
---

# 特征
Feature

模式识别起决定性作用的因素。例如：8 的特征是什么？

<div class="grid grid-cols-6 gap-0">

<img src="/img/8.png" width="50%" height="50%">

<img src="/img/8_1.png" width="50%" height="50%">

<img src="/img/delta.png" width="50%" height="50%">

<img src="/img/lv.png" width="50%" height="50%">

<img src="/img/g.png" width="50%" height="50%">

<img src="/img/infty.png" width="50%" height="50%">

</div>

- 人眼很容易判断，但判断的依据很难用自然语言完整叙述

- Moravec 悖论：人类所独有的高阶智慧能力只需要非常少的计算能力，例如推理，但是无意识的技能和直觉却需要极大的运算能力。（所谓的高阶能力实际上是符号能力，而无意识的技能是前符号/符号化的能力。）

- 关键问题：应该如何表示这些特征使得机器能够识别相应的模式？

---
layout: pageBar
hideInToc: true
---

# 表征
Representation

常见信号的（原始）表征
- 文本表征为时间序列： $x \in V^N$，其中 $V$ 为字典， $N$ 为离散时间。
- 图片表征为像素空间中的点： $x \in \mathbb{R}^{W\times H\times C}$，其中 $W$ 为宽度，$H$ 为高度，$C$ 为通道数。
- 声音表征为时间序列： $x \in \mathbb{R}^T$，其中 $T$ 为时间。
<!-- - 视频表征为像素空间中的点列：$x \in \mathbb{R}^{W\times H\times C \times T}$。 -->
多维数组 array / 张量 tensor
<!-- - 无论是原始信号还是经过特征提取的抽象信号都使用多维数组来表示，它把质的差异统一为纯粹的量的差异。 -->

- 把质的差异统一为纯粹的量的差异
- 划分轴仅仅是为了方便操作

<div class="flex mt-3">
<img src="/img/array.png" class="w-30% h-auto">
<img src="/img/tensor.png" class="w-60% h-auto">
</div>

<!--（难以用语言形容的差异表征为纯粹的数字差异） -->

---
layout: pageBar
hideInToc: true
---

# 表征学习 
Representation learning

由于前面提到的信噪比问题，我们希望找到一个映射 $f: x \mapsto z$ 使得原数据 $x\in X$ 的表征 $z\in Z$ 具有**更好**的性质。这个任务被称为表征学习。

<img src="/img/representation_learning.png" class="w-50%">

根据语境的不同，这里的映射 $f$ 也被称为编码器 encoder，$Z$ 所在的空间被称为隐空间 latent space， $X,Z$ 也被称为流形 manifold，$z$ 也被称为嵌入 embedding 或者编码 code。

---
layout: pageBar
hideInToc: true
---

# 什么是好的表征？
<br>

<div class="grid grid-cols-[5fr_5fr] gap-5">
<div class="flex flex-col">
信噪比高（压缩率高）

MNIST 图像表征从原空间 $\mathbb{R}^{28\times 28\times 1}$ 映射到隐空间 $\mathbb{R}^{12}$
<a href="https://dpkingma.com/sgvb_mnist_demo/demo.html">
<img src="/img/low_dimension_representation.png">
</a>
</div>

<div class="flex flex-col">
（线性）可分性强

甜甜圈式二分类数据从原空间 $\mathbb{R}^3$ 映射到隐空间 $\mathbb{R}^{3}$

<br>

<img src="/img/linear_discriminant.png">
</div>

</div>

<!-- 注意这两种性质并不一致 -->

---
layout: pageBar
hideInToc: true
---

# 数据与标签
<br>

<div class="grid grid-cols-[5fr_5fr] gap-5">
<div class="flex flex-col">

数据常有：文本（网页、出版物），音频（播客、视频音轨），图像（照片、图画、截图）。

但标签不常有（电影影评打分）。标签因任务而异，多数情况靠人工打标。

学习数据是否自带标签？监督学习 vs 无监督学习

在无标数据集上如何巧妙的**构造**标签，决定了是否能够利用海量数据。一种新的构造方式设定了一种新的模式识别任务，这种人为构造的任务能够帮助真实任务。

</div>

<div class="flex flex-col">
<img src="/img/label.png">
</div>

</div>

---
layout: pageBar
hideInToc: true
---

# 小结
<br>

机器学习的基本假设：
1. 统计分布假设：数据集 $\mathcal{X}$ 总是服从于表征空间 $X$ 上的一个（未知的）数据分布 $p_{\mathcal{X}}$。数据点可以看成分布的独立同分布采样 sample/实现 realization $x_{1},\dots, x_{n}\stackrel{i.i.d.}{\sim}p_{\mathcal{X}}$，且这个分布一般默认存在密度函数。
2. 流形假设：存在一个好的表征映射，使得数据点可以嵌入到一个低维流形。

机器学习的目标：
1. 密度估计（生成式任务）：根据数据集估计分布，以便可以采样出**与数据集一致**的新数据。
2. 模式识别（判别式任务）： 根据带标签的数据集 $(x,y) \in X\times Y$，求后验分布 $p(y|x)$。
3. 表征学习：找到映射 $f:X\to Z$，使得变换后的表征空间 $Z$ 上的分布 $p_{\mathcal{Z}}$ 有更简单的形式。它使得生成式任务的采样更容易，使得判别式任务的决策更容易。

---
layout: center
---

# 深度学习基本概念
- 深度学习的特点
- 模型：人工神经网络
- 推理和训练
- 梯度优化器
- 正向传播和反向传播

---
layout: pageBar
hideInToc: true
---

# 深度学习的特点
<br>

<div class="grid grid-cols-[6fr_4fr] gap-5">
<div class="flex flex-col">

1. 匀质化：
    - 硬件：重复的简单计算单元。 <!--GPU,TPU 不像 CPU 一样有复杂的指令集。-->
    - 模型：重复的结构相似的神经网络层。<!--层与层之间的接口高度统一，没有复杂的格式转换、控制流。-->
    - 训练和推理：统一的计算过程，与模型解耦。<!--前-后向传播、梯度优化器与模型的解耦。-->
    - 数据：统一的张量表示不同模态的数据。<!--无论是文本、图像、音频、视频还是其他模态。-->
    - 任务：统一的计算处理不同任务。
<!-- 解耦的好处在于可以独立优化每个部分，而例如更好的优化器对各种模型适用，更好的模型比如 Transformer 对各种任务适用，更好的神经网络模块可以对任何模型适用 -->
2. 规模化：
    - 模型规模化 <!--匀质化的模型和计算过程使得它能够有效的堆叠参数量。-->
    - 数据规模化 <!--统一的表示使得它能够融合多种模态信息。-->
3. 端到端：传统机器学习流程中异质性的处理步骤不断被整合进匀质的神经网络计算。
<!--它导致了一个直接结果，就是 80%的脏活累活都发生在预处理和后处理阶段-->

</div>

<div class="flex flex-col">
<img src="/img/ml_vs_dl.png" class="w-100%">
</div>

</div>

---
layout: pageBar
hideInToc: true
---

# 模型：人工神经网络
<br>

- 感知机 perceptron (Rosenblatt,1958)：用线性变换加上一个非线性激活（例如 sigmoid, tanh, ReLU）
  $$f_\theta(x)=\sigma(w^\top x+b)$$ 
  模拟生物神经细胞对刺激的响应。（异或问题）
- 多层感知机 multilayer perceptron (Rumelhart,1987)：堆叠多层感知机
  $$f_\theta(x)=σ^{(L)}(W^{(L)}σ^{(L−1)}(\cdots σ^{(1)}(W^{(1)}x+b^{(1)})⋯)+b^{(L)})$$
  并提出相应的反向传播算法，[解决了异或问题](https://playground.tensorflow.org/#activation=relu&batchSize=10&dataset=xor&regDataset=reg-plane&learningRate=0.03&regularizationRate=0&noise=0&networkShape=4&seed=0.38991&showTestData=false&discretize=false&percTrainData=50&x=true&y=true&xTimesY=false&xSquared=false&ySquared=false&cosX=false&sinX=false&cosY=false&sinY=false&collectStats=false&problem=classification&initZero=false&hideText=false)。（通用逼近定理）

- 现代神经网络的基础模块：CNN(1998)，RNN/LSTM(1997)，ResNet(2015)，Attention(2014), Transformer(2017)

<!-- 此处的线性变换的作用在于混合不同神经元的信号，而非线性变换在于提升网络的表达能力 -->

---
layout: pageBar
hideInToc: true
---

# 推理和训练
<br>

- 训练：给定带标签数据集 $\mathcal{X}=\{(x_i,y_i)\}_{i=1}^N$，含参神经网络 $f_\theta$，损失函数 $\ell(\cdot,\cdot)$，优化参数 $\theta$

总体误差：
$$\mathcal{L}(\theta)=\frac{1}{N}\sum_{i=1}^{N}\ell(f_\theta(x_i),y_{i})$$

目标：
$$\hat{\theta}=\argmin_\theta \mathcal{L}(\theta)$$

- 推理：给定任意数据 $x$，预测其标签 $\hat{y} = f_{\hat{\theta}}(x)$。

<br>

---
layout: pageBar
hideInToc: true
---

# 梯度优化器
<br>

理论上 $\hat{\theta}=\argmin_\theta \mathcal{L}(\theta)$ 可以转化为 $\nabla_\theta{\mathcal{L}(\theta)} = 0$ 求驻点，再逐个代入找到最小值。

实际上 $\mathcal{L}$ 高度非线性，梯度方程没有解析解。常采用梯度下降法近似求解：
1. 从一个**好的初始化**参数 $\theta^{(init)}$ 出发
2. 不断迭代 $\theta^{(new)} \leftarrow \theta^{(old)} -\eta~\nabla\mathcal{L}(\theta^{(old)})$， $\eta$ 为一个**指定的**学习率。
3. 直至**收敛**。

随机梯度下降：实践中并不会计算总体损失 $\mathcal{L}$ ，而是一个随机批次的损失 $\mathcal{L}_\text{{mini-batch}}$。

<a href="https://distill.pub/2017/momentum/">
<img src='/img/optimizer.png' class="w-50%">
</a>

<!-- 细节：如何初始化？如何调度学习率？随机梯度下降的启发式改进（Adam, AdamW, Muon...） -->

<!-- 如何高效计算梯度：反向传播 -->

---
layout: pageBar
hideInToc: true
---

# 正向传播和反向传播
<br>

<div class="grid grid-cols-[6fr_4fr] gap-5">
<div class="flex flex-col">

- 可微映射诱导出切映射
    $$f:x \mapsto y \implies df_x: \frac{\partial\mathcal{L}}{\partial y} \mapsto \frac{\partial\mathcal{L}}{\partial x}$$
- 前向传播：可微函数复合链
- 反向传播：导函数乘积链（链式法则）

- 计算图：每个节点（神经元）记录前向传播的激活值和反向传播的梯度值；每条边（神经连接）记录映射/切映射。

- 实现：自动微分引擎是 PyTorch 等深度学习库最核心的部分
</div>

<div class="flex flex-col">
<img src='/img/autograd.png'>
</div>

</div>

---
layout: center
---

# 经典架构

- 多层感知机
- 卷积神经网络
- 循环神经网络
- 注意力机制
- 其他
- 小节

---
layout: pageBar
hideInToc: true
---

# 多层感知机
Multilayer Peceptron (MLP)，又名前馈 feedforward 网络 ，全连接 fully-connected 网络 

<div class="grid grid-cols-[4fr_6fr] gap-2">
<div class="flex flex-col mt-10">

- 生物神经元的最简化模拟
- 线性变换，特征混合
- 全连接，参数量大
- 其他神经网络结构的雏形

</div>

<div class="flex flex-col">
<img src="/img/mlp.png" class="w-100%">

</div>

</div>

<!-- 早期婴儿的神经元连接数远远大于成人，随着生长发育不断减少 -->
<!-- 类似于对称性破缺，出现特定的结构。特定的结构对特定的信号敏感 -->

---
layout: pageBar
hideInToc: true
---

# 卷积神经网络
Convolutional neural network (CNN)

<div class="grid grid-cols-[5fr_6fr]">
<div class="flex flex-col mt-10">

- 受灵长类视觉皮层启发 (Hubel,1961)
- 提取图像特征
- 局部性，平移不变性，权重共享

<img src="/img/weight_sharing.png" class="w-100%">

- 通过降采样实现信息的压缩
- 网络越深，特征图越小，特征越高级

</div>

<div class="flex flex-col">

<div class="grid grid-cols-[6fr_4fr]">

<div class="flex flex-col">
<img src="/img/cat.png" class="w-100%">
</div>

<div class="flex flex-col">
<img src="/img/convolution.gif" class="w-80%">
</div>

</div>

<img src="/img/CNN.png" class="w-100%">

</div>

</div>

---
layout: pageBar
hideInToc: true
---

# 循环神经网络
Recurrent neural network (RNN)

<div class="grid grid-cols-[4fr_6fr] gap-2">
<div class="flex flex-col mt-10">

- 自回归结构
- 提取序列特征
- 带门控机制的变体 (LSTM,GRU)

</div>

<div class="flex flex-col">
<img src="/img/RNN.png" class="w-70%">
<img src="/img/gate.png" class="w-70%">

</div>

</div>

<!-- 早期婴儿的神经元连接数远远大于成人，随着生长发育不断减少 -->

<!--
类似于对称性破缺，出现特定的结构。特定的结构对特定的信号敏感
-->

---
layout: pageBar
hideInToc: true
---

# 注意力机制
Attention

<div class="grid grid-cols-[4fr_6fr]">
<div class="flex flex-col">

- 建模序列 $x_{1,\cdots,N}$
- 输入表征 $x_i$ 线性变换得到查询、键、值表征（数据库信息检索范式）
- 注意力=随上下文变化的动态权重
  $$
  \begin{aligned}
  &q_i=W_qx_i,k_i=W_kx_i,v_i=W_vx_i\\
  &o_i=\sum_{j=1}^N \frac{\exp(q_i\cdot k_{j})}{\sum_{l=1}^{N}\exp(q_i\cdot k_{l})} v_j
  \end{aligned}
  $$

<div class="text-gray">

  $$o_i = \sum_{j=1}^N w_j x_i$$
</div>

</div>

<div class="flex flex-col">
<img src="/img/attention.png" class="w-100%">
</div>

</div>

---
layout: pageBar
hideInToc: true
---

# 其他

<div class="grid grid-cols-[5fr_6fr] gap-2 mt-10">
<div class="flex flex-col mt-10">

- 残差连接：解决深层网络训练的梯度传播问题
<!-- 从前向传播来看，后一层的表征不是从头学习，而是在前一层表征的基础上学习，学习其与前一层表征的差异，从反向传播来看，给梯度信号提供一个短路连接，防止爆炸或者趋于 0 -->
- 归一化层：解决激活值尺度不稳定的数值问题
- Dropout 层：随机丢弃激活信号，防止过拟合
<!-- 丢弃激活信号 -->

</div>

<div class="flex flex-col">
<img src="/img/residual.png" class="w-70%">
<img src="/img/dropout.png" class="w-100%">

</div>

</div>

---
layout: pageBar
hideInToc: true
---

# 小结
<br>

<div class="mt-10">

- 仿生学启发式
- 结构决定知识的性质
<!-- - 特定的先验结构善于提取特定性质的信号，同时弱于提取其他性质的信号。（归纳偏置 inductive bias） -->
- 数值问题、工程技巧
<!-- - 人工神经网络终究不是生物神经网络，需要考虑数值问题。 -->
</div>

---
layout: center
---

# 从 Transformer 到 GPT

- 从序列到序列
- Transformer
- GPT

---
layout: pageBar
hideInToc: true
---

# 从序列到序列
Sequence-to-sequence

<div class="grid grid-cols-[5fr_5fr] gap-1 ">
<div class="flex flex-col">

- 机器翻译，问答，续写
- 数据：一段文本序列 $X=(x_{1},x_{2},\cdots, x_{n})$
- 标签：另一段文本序列 $Y=(y_{1},y_{2},\cdots, y_{m})$
- 分词器 tokenizer：把文本切分为词元序列的映射
<!-- 启发式算法 -->
- 码本 codebook：把词元转换为词向量表征
- 从序列到序列的条件自回归建模 
 $$P(Y\mid X)=\prod_{t=1}^{m}P(y_{t}\mid y_{<t},X)$$
</div>

<div class="flex flex-col">
<a href="https://tiktokenizer.vercel.app/?model=gpt-4o">
<img src="/img/tokenizer.png">
</a>

</div>

</div>
  <!-- 
  词元示例：
  你好世界
  hello⋅world
  👋🌎
  world
  -->
---
layout: pageBar
hideInToc: true
---

# Transformer

<div class="grid grid-cols-[4fr_6fr] gap-1 mt-10">
<div class="flex flex-col">

- 可并行的自回归序列建模
- 工程优化的结晶
  - 对词向量的上下文建模<br> contextualized embedding
  - 自注意力机制：
    - 全局感受野（vs 卷积神经网络）
    - 可并行计算（vs 循环神经网络）
    - 动态的连接权重（vs 全连接层）
    - 低秩但多头
  - 全连接层：信息混合
  - 残差连接，归一化，Dropout

</div>

<div class="flex flex-col ml-2">
<img src="/img/contextual.png" class="w-100%">

</div>

</div>

---
layout: pageBar
hideInToc: true
---

# Transformer

<div class="grid grid-cols-[6fr_4fr] gap-2 mt-10">
<div class="flex flex-col">

- 可并行的自回归序列建模
- 工程优化的结晶
  - 对词向量的上下文建模<br> contextualized embedding
  - 自注意力机制
    - 全局感受野（vs 卷积神经网络）
    - 可并行计算（vs 循环神经网络）
    - 动态的连接权重（vs 全连接层）
    - 低秩但多头
  - 全连接层：信息混合
  - 残差连接，归一化，Dropout

</div>

<div class="flex flex-col">
<img src="/img/transformer.png" class="w-80%">

</div>

</div>

---
layout: pageBar
hideInToc: true
---

# GPT
生成式预训练的 Transformer，Generative Pretrained Transformer

<div class="grid grid-cols-[6fr_3fr] gap-2">
<div class="flex flex-col mt-10 mr-15">

- 构造预训练任务和标签：下一词预测 next-token prediction。<br>数据为上文，标签为下一词。
- 微调：将所有文本任务统一为带格式的序列生成任务 (T5)<br>
  如翻译任务：`<English> how are you? <Answer> ça va?`
- 从序列到序列转变成序列生成：纯解码器结构 decoder-only
- 掩码 mask：控制注意力区间在格式标记内
- 指令微调+偏好对齐：基于人类反馈的强化学习 RLHF
- Scale-up：1 亿 < 15 亿 < 1750 亿 < 1 万亿 < ???
- 聊天机器人 (ChatGPT)
```
  <Prompt> Translate to French: how are you?
  <Assistant> ça va?
```
</div>

<div class="flex flex-col">
<img src="/img/GPT.png" class="w-100%">

</div>

</div>
<!-- 作为对比，成年人脑神经元的个数约为 860 亿，其中负责认知的大脑皮层约 160 亿，负责运动的小脑约 690 亿 -->

---
layout: pageBar
hideInToc: true
hide: true
---

# 人人可用的 AI 模型
Democratic AI

- 预训练-微调
- 知识蒸馏，模型剪枝
- （人类偏好）对齐

---
layout: center
---

# 从文本到多模态

- 一切皆“文本”
- 统一模态空间
- 以语言为中介

---
layout: pageBar
hideInToc: true
---

# 一切皆“文本”
Transform everything as text

<br>

<div class="grid grid-cols-[5fr_5fr] gap-2">
<div class="flex flex-col mr-15">

Transformer 的并行化、规模化能力吸引人们把其他模态的信号都以文本的方式建模。
- 文本信号离散且信息率高，图像、声音信号连续且信息率低
<!--- 文本是经过人类高度符号化的信号，信息率高且天然离散，图像、声音等自然信号天然连续且信息率低，这意味着即使在原数据上进行离散采样，得到的序列也会非常长，有效信息量却很少-->
- （广义）分词器+编码器：把图像或声音等连续信号压缩成嵌入序列<br>
<!-- 以图像为例，先划分成一个个小补丁构成的序列，此时每个小补丁仍是信息率较低的原始表征，然后再把每个原始表征通过编码器映射成好的表征 -->
- 传入 Transformer，其余不变：适用于连续模态到离散模态（文本，类别）的任务
- 如果需要还原回连续模态，需要对应模态的解码器<br>

<!-- 一般和编码器联合训练 -->

</div>

<div class="flex flex-col">
<img src="/img/image_tokens.png"
</div>

</div>

---
layout: pageBar
hideInToc: true
---

# 统一模态空间
<br>

<div class="grid grid-cols-[3fr_5fr]">
<div class="flex flex-col">

 多模态任务需要在不同模态间转换
  - 图像到文本（图像描述）
  - 文本到图像（图像生成）
  - 声音到文本（语音识别）
  - 文本到声音（语音合成）
  - 视频到声音（视频配乐）
  - 视频到视频（自动剪辑）
  - 等等 ...

如何保证不同模态嵌入之间的语义一致性
</div>

<div class="flex flex-col mx-5">
<img src="/img/multimodal_alignment.png">

</div>

</div>

- 对齐：**以文本为锚点**，训练对齐映射使不同模态语义相近的嵌入在统一空间中，使向量距离反映语义距离
<!-- - 融合：真正的统一表征，施加不同解码器能得到不同模态的信息 -->

---
layout: pageBar
hideInToc: true
---

# 任意模态大模型
<br>

- 各自模态配备编码器、解码器、对齐映射
- 统一的大语言模型骨干网络建模

<img src="/img/any_modality.png" class="w-70%">

<!-- 我更愿意称之为大符号模型 -->

---
layout: center
---

# 深度学习时代的语音处理

- 语音的特殊性
- 传统语音处理
- 判别式任务举例：语音到文本（ASR）
- 生成式任务举例：文本到语音（TTS）

---
layout: pageBar
hideInToc: true
---

# 语音的特殊性

<div class="grid grid-cols-[3fr_5fr]">
<div class="flex flex-col">

信息密度低：
- 3 分钟的音乐波形文件大小<br>
  44100Hz×16bit×2×180s/8≈30.3 MB<br>
  相当于一本千万字小说
- 可用数据少
<!-- - ，可用的带标数据更少 -->
<!-- - 语音大模型至少需要 10 万小时音频 -->

信息层次丰富，多且杂：
- 音色
- 音素
- 韵律、语气、情绪
- 副语言现象

</div>

<div class="flex flex-col">
<img src="/img/audio_data.png">
</div>

</div>

---
layout: pageBar
hideInToc: true
---

# 传统语音处理

<div class="grid grid-cols-[5fr_3fr]">
<div class="flex flex-col">

- 人耳是傅立叶分析器
<!-- 因为时间和频率是一组傅立叶共轭变量，服从不确定性原理，因此要权衡时域与频域的分辨率-->
- 模型：语音信号建模为局部广义平稳过程
- 表征映射：短时傅立叶变换，Mel 滤波器组
- 表征：从时域表征（波形）到时频域表征（频谱图）
- 作为深度学习的特征提取步骤
<!-- 多个卷积核 -->

<img src="/img/STFT.png" class="w-60%">
</div>

<div class="flex flex-col">
<img src="/img/cochlea.png" class="w-80%">
</div>

</div>

---
layout: pageBar
hideInToc: true
---

# 作为图像的声音

- 频谱图：关于时间和频率的二元函数
- 似图非图
  - 时间轴和频率轴非对称
  - 视觉对象只有覆盖无重叠，声音事件可重叠
- 计算机视觉方法迁移：卷积神经网络
<!-- 时域平移不变，频率无平移不变 -->

<img src="/img/spectrogram.png" class="mt-5 w-100%">

---
layout: pageBar
hideInToc: true
---

# 判别式任务举例：语音识别

<img src="/img/whisper.png">

---
layout: pageBar
hideInToc: true
---

# 生成式任务举例：语音合成

<img src="/img/vall-e.png">

---
layout: pageBar
---

# 感想
<br>

<div class="grid grid-cols-[3fr_8fr] gap-20">
<div class="flex flex-col">

- 通用人工智能问题
- 涌现还是误认
- 新的物神
- AI 工具的使用体验
- 炒作和投机：
  - 混乱的术语
  - 社交媒体中的科研
  - 模型/测试造假
  - 指标与现实需要脱节
  - 头部公司互保
</div>
<div class="flex flex-col ml-10">
  <img src="/img/naming.png" class="w-60%">
</div>

</div>

---
layout: center
---

<a href="https://texocr.netlify.app/ocr">
<h1> 彩蛋 </h1>
</a>

---
layout: end
---

谢谢