# 改动日志

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
