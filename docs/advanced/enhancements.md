# 高级功能

::: tip WIP

该部分目前较为简陋。欢迎 PR 贡献！🫡

:::

对于缓存、去重、重试的高级功能，建议结合 [@tanstack/query](https://tanstack.com/query/)、[swrv](https://docs-swrv.netlify.app/)、[vue-request](https://www.attojs.com/)、[alova](https://alova.js.org/zh-CN/) 等库使用。

如果你不希望引入过多的库导致占用体积过多，你也可以参考以下内容以实现部分高级功能。

## 缓存

请参考 [Axios 如何缓存请求数据](https://juejin.cn/post/6974902702400602148)。

## 去重

请参考 [Axios 如何取消重复请求](https://juejin.cn/post/6955610207036801031) 和 [Axios 如何取消重复请求？取消重复请求方法有哪几种？](https://apifox.com/apiskills/axios-repeated-request/)。

## 重试

请参考 [Axios 如何实现请求重试？](https://juejin.cn/post/6973812686584807432)。

## 响应失败不抛出错误

在某些情况下，你可能不希望响应失败抛出错误，这时候可以使用响应拦截器来处理。

```typescript
import { un } from "@uni-helper/uni-network";

// 添加响应拦截器
un.interceptors.response.use(
  (response) => response,
  // 直接返回错误，不再需要使用 catch 来捕获
  // 需要注意返回值可能是 UnError 类型
  (error) => error
);
```

## 无感刷新登录态

在某些情况下，你可能希望无感刷新登录态，避免当前登录态过期后用户手动登录。

如果你有一个可以使用过期登录态换取新鲜登录态的接口，请参考 [uni-ajax - FAQ - 无感刷新 Token](https://uniajax.ponjs.com/guide/question#%E6%97%A0%E6%84%9F%E5%88%B7%E6%96%B0-token)。
该部分代码实现略经修改也适用于使用双登录态的认证系统。

如果你正在使用一个使用双登录态的认证系统，请参考 [项目中前端如何实现无感刷新 token！](https://juejin.cn/post/7254572706536734781) 和 [基于 Axios 封装一个完美的双 token 无感刷新](https://juejin.cn/post/7271139265442021391)。

## 全局请求加载

请参考 [uni-ajax - FAQ - 配置全局请求加载](https://uniajax.ponjs.com/guide/question#%E9%85%8D%E7%BD%AE%E5%85%A8%E5%B1%80%E8%AF%B7%E6%B1%82%E5%8A%A0%E8%BD%BD)。这类做法不适用于局部加载展示。
