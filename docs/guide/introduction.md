# 介绍

`@uni-helper/uni-network` 是一个为 [uni-app](https://uniapp.dcloud.io/) 打造的 [基于 Promise](https://javascript.info/promise-basics) 的 HTTP 客户端。

底层基于 `uni.request`，封装增加了一些功能，使其支持 Promise 现代化的使用，功能包括:

- 默认请求使用 [uni.request](https://uniapp.dcloud.io/api/request/request.html)
- 上传文件使用 [uni.uploadFile](https://uniapp.dcloud.io/api/request/network-file.html#uploadfile)
- 下载文件使用 [uni.downloadFile](https://uniapp.dcloud.io/api/request/network-file.html#downloadfile)
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- [拦截请求和响应的数据](../advanced/interceptors.md)
- [取消请求](../advanced/cancellation.md)
- [TypeScript 支持](../advanced/ts-support.md)
- [组合式函数](../advanced/composition-api.md)

`@uni-helper/uni-network` 灵感和代码绝大部分源于 `axios@0.27.2`。如果你想了解 `@uni-helper/uni-network` 与 `axios`、其它类似库的差别，请参考 [比较](../other/why-not.md) 部分的说明。

## 设备和浏览器支持

请查看 [构建](../other/build.md) 部分的说明。
