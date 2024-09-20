# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.19.3](https://github.com/uni-helper/uni-network/compare/v0.19.2...v0.19.3) (2024-09-20)

### Features

* add toAbortSignal to UnCancelToken, axios[#6582](https://github.com/uni-helper/uni-network/issues/6582) ([738486c](https://github.com/uni-helper/uni-network/commit/738486cc1404ffc6ed1df3103a23f55f2ecaf563)) - by @ModyQyW

### Bug Fixes

* add the missed implementation of UnError[#status](https://github.com/uni-helper/uni-network/issues/status) property, axios[#6573](https://github.com/uni-helper/uni-network/issues/6573) ([43b5bc5](https://github.com/uni-helper/uni-network/commit/43b5bc541f79f00d6cd95e406205ecfe95f484dd)) - by @ModyQyW
* allow vueuse v11 ([cd84a78](https://github.com/uni-helper/uni-network/commit/cd84a784a9f0ed67d018a19da48c267f1e3ed274)) - by @
* disregard protocol-relative URL to remediate SSRF, axios[#6539](https://github.com/uni-helper/uni-network/issues/6539) ([025cd49](https://github.com/uni-helper/uni-network/commit/025cd49fbf44493f97db3f340762de1599d31910)) - by @ModyQyW
* fix main entry ([7c6561c](https://github.com/uni-helper/uni-network/commit/7c6561ca770a9cdc0f1c861a0d9506cb3f31fe86)) - by @ModyQyW
* fix node10 ts support ([ad3b98c](https://github.com/uni-helper/uni-network/commit/ad3b98cf958bfdb0aeff06dafe7dd3996bcbbd9b)) - by @ModyQyW
* replace statuses with statuses-es for better compact compatibility ([#53](https://github.com/uni-helper/uni-network/issues/53)) ([4806357](https://github.com/uni-helper/uni-network/commit/48063578403e1cbd1f8dcfc602c7d0df026bb995)) - by @wtto00

# 改动日志

## 0.19.2 (2024-07-10)

- fix: 迭代对象键时跳过 constructor 和私有属性

## 0.19.1 (2024-07-05)

- fix: 修复类型

## 0.19.0 (2024-07-05)

- feat!: 优化类型
  - 移除了不安全的声明合并，[@typescript-eslint/no-unsafe-declaration-merging](https://typescript-eslint.io/rules/no-unsafe-declaration-merging/)
  - 移除了潜在有害的方法速记语法 Method Shorthand Syntax，[Method Shorthand Syntax Considered Harmful](https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful)
- fix(composables): 对齐 vueuse v10.8.0 改动
- fix: 封装错误以改进异步堆栈跟踪，仅捕获处理原生错误对象的异步堆栈

## 0.18.1 (2024-02-20)

- fix(composables): 对齐 vueuse v10.7.2 改动

## 0.18.0 (2024-01-03)

- feat!: 默认使用 [fast-querystring](https://github.com/anonrig/fast-querystring) 而不是 [query-string](https://github.com/sindresorhus/query-string) 序列化 `params`
  - `query-string@8.1.0` 和它所依赖的库存在 `try {} catch {}` 的用法，该用法不受支付宝小程序支持，需要用户侧额外处理

## 0.17.0 (2023-11-04)

- feat!: 现在要求 `node>=18`

## 0.16.1 (2023-08-08)

- fix: 移除默认的 timeout 值，修复 H5 端请求立即超时的问题，关闭 [#37](https://github.com/uni-helper/uni-network/issues/37)

## 0.16.0 (2023-07-03)

- feat!: 默认使用 [query-string](https://github.com/sindresorhus/query-string) 而不是 [qs](https://github.com/ljharb/qs) 序列化 `params`

  - `query-string@8.1.0` 支持 `node >= 14.16`，没有过多的历史包袱，而 `qs@6.11.2` 至今还在支持 `node >= 0.6`
  - `qs@6.10.0` 开始引入了 `get-intrinsic`，结合微信小程序和微信小程序插件使用时会出现报错，参考 [#31](https://github.com/uni-helper/uni-network/issues/31)，而 `query-string@8.1.0` 没有这个问题
  - 如果你的 `params` 对象内某个键的值为对象、数组或 Date，表现行为会不一致
  - 如果你更倾向于使用该库 0.15.0 版本或更早版本的默认设置，请安装 `qs@6.9.7`，并设置 `paramsSerializer`

  ```typescript
  {
    ...,
    paramsSerializer: (params: Record<string, any>) => {
      return Object.prototype.toString.call(params).includes('URLSearchParams')
        ? params.toString()
        : qs.stringify(params);
    },
    ...,
  }
  ```

## 0.15.0 (2023-04-16)

- feat(composables)!: 调整返回的 `error` Ref 类型为 `unknown`，对齐 `vueuse@10` 行为，查看 [vueuse/vueuse#2807](https://github.com/vueuse/vueuse/pull/2807) 了解更多
- feat(composables)!: 使用 `PromiseLike` 替换 `Promise`，对齐 `vueuse@10` 行为，查看 [vueuse/vueuse#2485](https://github.com/vueuse/vueuse/pull/2485) 了解更多
- feat(composables): 增加 `onFinish` 选项，对齐 `vueuse@10` 行为，查看 [vueuse/vueuse#2829](https://github.com/vueuse/vueuse/pull/2829) 了解更多
- feat(composables): 增加 `initialData` 和 `resetOnExecute` 选项，对齐 `vueuse@10` 行为，查看 [vueuse/vueuse#2791](https://github.com/vueuse/vueuse/pull/2791) 了解更多
- fix(composables): 修复 `UnConfig` 类型使用

## 0.14.0 (2023-02-28)

- feat: 新增组合式函数

## 0.13.3 (2023-02-08)

和 0.13.1 一样，但又修复了一个 ci 问题。

## 0.13.2 (2023-02-08)

和 0.13.1 一样，但修复了一个 ci 问题。

## 0.13.1 (2023-02-08)

- fix: 修复了 `un.download` 和 `un.upload` 没有正确设置 `adapter` 的问题，感谢 [@edazh](https://github.com/edazh) 在 [#25](https://github.com/uni-helper/uni-network/pull/25) 的贡献
- build: 构建工具切换到 `unbuild`

## 0.13.0 (2023-02-06)

调整了部分代码风格，同时更新了文档。

## 0.12.6 (2023-01-10)

- fix: 处理 `statuses` 可能抛出的错误，感谢 [@edazh](https://github.com/edazh) 在 [#18](https://github.com/uni-helper/uni-network/pull/18) 的贡献

## 0.12.5 (2023-01-04)

- build: 使用 `rollup` 构建
- perf: `mergeConfig` 实现调整

## 0.12.4 (2022-12-30)

- fix: 移除构建中 `qs` 相关代码以修复构建

## 0.12.3 (2022-12-30)

误发布，请勿使用。

## 0.12.2 (2022-12-30)

- fix: 修复构建

## 0.12.1 (2022-12-29)

- perf: 明确导入类型
- perf: 分离 `HttpStatusCode`
- perf: 暴露 `mergeConfig` 和 `HttpStatusCode`

## 0.12.0 (2022-12-28)

- feat!: 要求 `node >= 14.18`，这是为了对标 `rollup` 和 `vite`
- feat: esm 优先，但仍然提供 cjs 支持
- fix: 修复导出
- perf: 构建包含 `ramda`、`statuses` 和 `qs` 相关代码

## 0.11.1 (2022-11-16)

- fix: 修复构建

## 0.11.0 (2022-11-16)

- feat!: 迁移到 `@uni-helper/uni-network`，`Uan` 前缀调整为 `Un`
- perf: 移除 `lodash-es`

## 0.10.2 (2022-10-18)

- perf: 优化 `params` 类型
- perf: 分离 `mergeConfig` 方法
- fix: 修复 `UanCanceler` 类型

## 0.10.1 (2022-10-12)

- fix: 修复构建

## 0.10.0 (2022-10-11)

- feat!: 重命名一些 `request` 为 `task` 避免误导
- feat!: 调整类型，移除了 `UanBaseXxx`、`UanRequestXxx`、`UanDownloadXxx`、`UanUploadXxx` 等类型，可直接使用 `UanXxx`
- feat: 支持 `onProgress`、`onProgressUpdate`、`onDownloadProgress`、`onUploadProgressUpdate`、`onUploadProgress`、`onUploadProgressUpdate`

## 0.8.0 (2022-10-07)

- feat: 增加枚举数据
- fix: 修复类型定义
- perf: 优化类型定义
- feat!: 导出的 `isCancel` 调整为 `isUanCancel`

## 0.7.1 (2022-09-30)

- fix: 修复了构建不正常的问题

## 0.7.0 (2022-09-29)

- feat!: 现在要求使用 `node >= 14.16`
- feat!: 现在构建目标是 `esnext`
- fix: 修复了构建不正常的问题

## 0.6.0

- feat!: 重命名为 `uni-app-network`

## 0.4.8

- perf: 更新 `utils/extend`，匹配 `axios` 改动

## 0.4.7

- fix: 修复导出

## 0.4.6

- fix: 修复导出

## 0.4.5

- fix: 修复类型

## 0.4.4

- fix: 修复类型

## 0.4.3

- fix: 导出全部类型

## 0.4.2

修复说明文档错误。

## 0.4.1

- fix: 修复类型

## 0.4.0

- feat: 迁移到 TypeScript
- feat: 增加导出
- perf: 移除多余的向后兼容代码
- fix: 修复构建
- test: 修复测试

## 0.3.2

- fix: 修复类型

## 0.3.1

- fix: 修复方法没有正确挂载的问题
- fix: 修复错误解构的问题

## 0.3.0

- rewrite: 完全重写

## 0.2.1

- fix: 修复类型定义

## 0.2.0

- feat: `request` 支持使用字符串作为第一个参数
- feat: `useRequest` 支持使用字符串作为第一个参数
- fix: 修复类型定义
- fix: 修复导出

## 0.1.1

- fix: 修复 `request` 配置错误的问题

## 0.1.0

- feat: 提供 `request`
- feat: 提供 `useRequest`
- feat: 提供 `requestAdapter`
