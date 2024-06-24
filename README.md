# manage multiple slidev in pnpm workspace

<div  align="center" style="display: grid; grid-template-columns: repeat(1, 1fr)">
  <div style="display: grid; grid-template-rows: subgrid">

[![Article][zenn-logo]][atricle-href]
[![License][license-logo]][license-href]

  </div>
  <div style="display: grid; grid-template-rows: subgrid"> 
  
  [![ESLint][eslint-logo]][eslint-href]
  [![Textlint][textlint-logo]][textlint-href]
  [![Prettier][prettier-logo]][prettier-href]
  </div>
</div>

## About

Manage multiple slides (used **slidev**) using pnpm workspace and deploy to **Cloudflare Pages**.

### Draft: Article

Look at [this article]().

### Draft: Slides

|   スライド名   | 概要              |
| :------------: | :---------------- |
| [スライド 1]() | これはテストです  |
| [スライド 2]() | This is test page |

### Architecture

必要に応じて共通コンポーネント/レイアウト/アセットを import する

```mermaid
%%{init:{'theme':'forest'}}%%
graph LR
  classDef pg fill:#faae40,color:#404041
  classDef common fill:skyblue

  subgraph Cloudflare
    pg1(Pages1):::pg
    pg2(Pages2):::pg
    pg3(pages3):::pg
    pg4(...and more):::pg
  end
  style Cloudflare fill:#f38020

  subgraph ws[pnpm workspace]
    c_c[共通 Components]:::common
    c_l[共通 Layouts]:::common
    c_a[共通 Assets]:::common

    sl1（スライド 1)
    sl2（スライド 2)
    sl3（スライド 3)
    sl4(...and more)
  end

  c_c ..->|import| sl1
  c_l ..->|import| sl1
  c_c ..->|import| sl2
  c_l ..->|import| sl2
  c_c ..->|import| sl3
  c_l ..->|import| sl3
  c_a ..->|import| sl3

  sl1 -->|Deploy from GitHub Actions| pg1
  sl2 -->|Deploy from GitHub Actions| pg2
  sl3 -->|Deploy from GitHub Actions| pg3
```

## Usage

`target`は任意です。
本サンプルでは`target = slide1` or `target = slide2`となります。

### Build

```sh
slide=target pnpm build
```

### Development

show http://localhost:3000 .

```sh
slide=target pnpm dev
```

### Export to PDF

```sh
slide=target pnpm export
```

### Deploy to Cloudflare Pages

```sh
slide=target pnpm deploy:pages
```

## Linter

### ESLint

```sh
pnpm lint:eslint
# using --fix
pnpm lint:eslint:fix
```

### Textlint

```sh
pnpm lint:text
# using --fix
pnpm lint:text:fix
```

## LICENSE

This repository is licensed under [the MIT License](./LICENSE).

## Author

- GitHub: [@shinGangan](https://github.com/shinGangan)
- X (formerly Twitter): [@gangan_nikki](https://twitter.com/gangan_nikki)

<!--
  Badges
-->

[zenn-logo]: https://img.shields.io/badge/Zenn-Show_article-0078D4.svg?style=plastic&logo=zenn
[atricle-href]: https://zenn.dev/gangannikki
[textlint-logo]: https://img.shields.io/badge/textlint-v13.4.x-F35776?style=plastic&logo=textlint&colorA=2AE2F2
[textlint-href]: https://textlint.github.io/
[eslint-logo]: https://img.shields.io/badge/ESLint-v8.54.x-4B32C3?style=plastic&logo=eslint
[eslint-href]: https://eslint.org/
[prettier-logo]: https://img.shields.io/badge/Prettier-v3.1.x-F7B93E?style=plastic&logo=prettier
[prettier-href]: https://prettier.io/
[license-logo]: https://img.shields.io/github/license/shinGangan/exp-slidev-monorepo?style=plastic
[license-href]: ./LICENSE
