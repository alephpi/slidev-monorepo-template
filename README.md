A monprepo storing all my public presentations made with slidev, based on https://github.com/shinGangan/exp-slidev-monorepo 

# manage multiple slidev in pnpm workspace

## About

Manage multiple slides (used **slidev**) using pnpm workspace

## Usage

`target = slide1` or `target = slide2`.

### Build

```sh
slide=target pnpm build
```

### Development

```sh
slide=target pnpm dev
```

### Export to PDF

```sh
slide=target pnpm export
```
## LICENSE

This repository is licensed under [the MIT License](./LICENSE).