---
layout: home

hero:
  name: 'Uni Network'
  text: 'Uni Helper 官方维护的请求库'
  tagline: 为 uni-app 打造的基于 Promise 的 HTTP 客户端。
  actions:
    - theme: brand
      text: 起步 →
      link: /guide/installation
    - theme: alt
      text: 介绍
      link: /guide/introduction
  image:
    src: /logo.png
    alt: Uni Helper

features:
  - title: 📝 支持 Promise API
    details: 默认支持 Promise API，可直接使用 async/await，更加简洁明了
  - title: 🛠 请求响应拦截器
    details: 可配置请求和响应拦截器，自定义处理数据
  - title: 🔌 取消请求
    details: 可扩展请求取消，完全可控请求状态
  - title: 🦾 TypeScript 支持
    details: 基于 TypeScript 开发，默认支持 TypeScript，安全可控
  - title: 🧱 组合式函数
    details: 提供组合式函数，更加方便地使用 Uni Network
  - title: 📤 支持上传下载
    details: 基于 uni.request、uni.uploadFile、uni.downloadFile 内部封装
---

<!-- markdownlint-disable -->
<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(
    315deg,
    #42d392 25%,
    #647eff
  );
  --vp-home-hero-image-background-image: linear-gradient(
    -45deg,
    #41b88380 30%,
    #35495e80
  );
  --vp-home-hero-image-filter: blur(30px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
<!-- markdownlint-disable -->
