---
layout: home

hero:
  name: 'Uni Network'
  tagline: 为 uni-app 打造的基于 Promise 的 HTTP 客户端。
  actions:
    - theme: brand
      text: 起步 →
      link: /guide/installation
    - theme: alt
      text: 介绍
      link: /guide/introduction
  image:
    src: /logo.svg
    alt: Uni Network

features:
  - title: 📝 支持 Promise API
    details: 所有请求都返回 Promise，可以直接用 async/await 处理
  - title: 🛠 请求响应拦截器
    details: 请求和响应都能挂拦截器，统一加 header、改数据或处理错误
  - title: 🔌 取消请求
    details: 支持 AbortController 和 CancelToken，随时中止进行中的请求
  - title: 🦾 TypeScript 支持
    details: 内置类型定义，响应数据和请求数据都可以用泛型指定
  - title: 🧱 组合式函数
    details: 提供 useUn，在 Vue 2/3 里直接管理请求状态
  - title: 📤 支持上传下载
    details: 同一套配置覆盖 uni.request、uni.uploadFile 和 uni.downloadFile
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
