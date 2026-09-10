# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.0](https://github.com/uni-helper/uni-network/compare/v0.24.2...v1.0.0) (2026-09-10)

### Features

* 新增 520 状态码和 413/422 的 RFC 9110 别名, sync https://github.com/axios/axios/pull/11067, https://github.com/axios/axios/pull/11082 ([7a7fab3](https://github.com/uni-helper/uni-network/commit/7a7fab370383ca49741b01e0aa131162991dd0b5)) - by @ModyQyW

### Bug Fixes

* mergeConfig 保留 symbol 键的配置项, sync https://github.com/axios/axios/pull/11043 ([472a4ff](https://github.com/uni-helper/uni-network/commit/472a4ff2b37f3facd8f8d2b9cf386b59197c7f91)) - by @ModyQyW
* 不再在同步请求拦截器失败后继续发请求, sync https://github.com/axios/axios/pull/11071 ([cfa13fb](https://github.com/uni-helper/uni-network/commit/cfa13fbfdd164c447f7e4c6f8bb3691c8426d7c6)) - by @ModyQyW
* 同步 axios 上游修复 ([eea8cac](https://github.com/uni-helper/uni-network/commit/eea8cac125f04a9ae9080c5e0eb3be100a946e2d)), closes [axios#11038](https://github.com/uni-helper/axios/issues/11038) [axios#11109](https://github.com/uni-helper/axios/issues/11109) [axios#11071](https://github.com/uni-helper/axios/issues/11071) - by @ModyQyW
* 将 UnError[#cause](https://github.com/uni-helper/uni-network/issues/cause) 设为不可枚举,避免循环引用导致 JSON 序列化失败, sync https://github.com/axios/axios/pull/10913 ([377174c](https://github.com/uni-helper/uni-network/commit/377174cd0f34755d038dbb46655815f6fed15675)) - by @ModyQyW
* 拦截器移除后裁剪末尾空位,避免数组无限增长, sync https://github.com/axios/axios/pull/11087 ([c45fda9](https://github.com/uni-helper/uni-network/commit/c45fda97ca8d270b95375a0e92d8e3b2772bf489)) - by @ModyQyW

## [0.24.2](https://github.com/uni-helper/uni-network/compare/v0.24.1...v0.24.2) (2026-06-15)

### Bug Fixes

* malformed http urls, https://github.com/axios/axios/pull/11000 ([0098b5d](https://github.com/uni-helper/uni-network/commit/0098b5df3b4d4f7356c0e5fee46bab6258224308)) - by @

## [0.24.1](https://github.com/uni-helper/uni-network/compare/v0.24.0...v0.24.1) (2026-05-07)

### Bug Fixes

* fix exports ([4d5a6f1](https://github.com/uni-helper/uni-network/commit/4d5a6f1a3b1fa1e097454e5badd8f6700fd47017)) - by @

## [0.24.0](https://github.com/uni-helper/uni-network/compare/v0.23.1...v0.24.0) (2026-05-07)

### Features

* add ECONNREFUSED error code constant to UnError, sync https://github.com/axios/axios/pull/10680 ([f8e7821](https://github.com/uni-helper/uni-network/commit/f8e78219571e9a58df405308bc08375cab05db6c)) - by @

### Bug Fixes

* add 'bun' package.json 'exports' condition ([ac2f400](https://github.com/uni-helper/uni-network/commit/ac2f40042d66e946f4f19e60a67438f573b3cafb)) - by @
* add create to index exports, sync https://github.com/axios/axios/pull/6460 ([93135b8](https://github.com/uni-helper/uni-network/commit/93135b85157ddf842f288026a93b817be8001db0)) - by @
* add input validation to isAbsoluteUrl, sync https://github.com/axios/axios/pull/7326 ([64a7aa7](https://github.com/uni-helper/uni-network/commit/64a7aa77dbcde6b6a7d17328acca3fe9f4b58c73)) - by @
* allow cancelToken to be undefined, sync https://github.com/axios/axios/pull/5560 ([676424a](https://github.com/uni-helper/uni-network/commit/676424a0c8d984261692340b6fedcfe65154c878)) - by @
* allow runWhen to be null, sync https://github.com/axios/axios/pull/7529 ([ce60a5e](https://github.com/uni-helper/uni-network/commit/ce60a5e97a337fe9708e8ca25abe2b2a6562ad98)) - by @
* copy status from source error in UnError.from, sync https://github.com/axios/axios/pull/7403 ([ad65dc8](https://github.com/uni-helper/uni-network/commit/ad65dc87b2f71b06deb2a63f68014c01140d82f6)) - by @
* handle optional response data safely, sync https://github.com/vueuse/vueuse/pull/5318 ([b4c83f7](https://github.com/uni-helper/uni-network/commit/b4c83f7c741e4cf748b5939ff0fe49d293ab53bd)) - by @
* improve error handling, sync https://github.com/axios/axios/pull/5558 ([c432b84](https://github.com/uni-helper/uni-network/commit/c432b8495d70708d4680b151e5952f58ea0e1140)) - by @
* improve error stack handling in Un class, sync https://github.com/axios/axios/pull/10660 ([375f8f6](https://github.com/uni-helper/uni-network/commit/375f8f6b25eedb13736df22be122c0b8beae8d37)) - by @
* intellisense for string literals in a widened union, sync https://github.com/axios/axios/pull/6134 ([e87723f](https://github.com/uni-helper/uni-network/commit/e87723f0a317986298ff37e6b5e20063391c594d)) - by @
* prevent undefined error codes in settle, sync https://github.com/axios/axios/pull/7276 ([54cd388](https://github.com/uni-helper/uni-network/commit/54cd3889aaa2ea899a355af2a1f4fb848875fd6f)) - by @
* unsubscribe cancelToken and signal on error, timeout, and abort paths, sync https://github.com/axios/axios/pull/10787 ([b656d90](https://github.com/uni-helper/uni-network/commit/b656d90365466dca6d4467e93c49f6b65a3ff219)) - by @

## [0.23.1](https://github.com/uni-helper/uni-network/compare/v0.23.0...v0.23.1) (2025-12-18)

**Note:** Version bump only for package @uni-helper/uni-network

## [0.23.0](https://github.com/uni-helper/uni-network/compare/v0.22.0...v0.23.0) (2025-10-27)

### Features

* support more request options, omit request/upload/download config nullish value ([24f7619](https://github.com/uni-helper/uni-network/commit/24f7619d1b88f59108a0165b7ffb189df1a31258)) - by @

## [0.22.0](https://github.com/uni-helper/uni-network/compare/v0.21.5...v0.22.0) (2025-09-16)

### ⚠ BREAKING CHANGES

* improve types

### Bug Fixes

* improve types ([de364a9](https://github.com/uni-helper/uni-network/commit/de364a9287d30ae38b36b0e2fcd7370db5a05056)) - by @

## [0.21.5](https://github.com/uni-helper/uni-network/compare/v0.21.4...v0.21.5) (2025-07-24)

### Bug Fixes

* allow no instanceConfig and use {} ([ed30fd3](https://github.com/uni-helper/uni-network/commit/ed30fd3bc9814b34233f3a0fdf5685114ed895df)) - by @

## [0.21.4](https://github.com/uni-helper/uni-network/compare/v0.21.3...v0.21.4) (2025-07-24)

### Bug Fixes

* replace Array.prototype.at to improve compatibility ([#62](https://github.com/uni-helper/uni-network/issues/62)) ([e591a26](https://github.com/uni-helper/uni-network/commit/e591a265ce31ff59ddaeb280bbb921e5be1b2d07)) - by @vfiee

## [0.21.3](https://github.com/uni-helper/uni-network/compare/v0.21.2...v0.21.3) (2025-05-15)

### Bug Fixes

* useUn narrow type of data when initialValue is provided, https://github.com/vueuse/vueuse/pull/4419/files ([33ef53b](https://github.com/uni-helper/uni-network/commit/33ef53bb266d2d158ed2f3bff440348634bab051)) - by @

## [0.21.2](https://github.com/uni-helper/uni-network/compare/v0.21.1...v0.21.2) (2025-05-14)

### Bug Fixes

* fix the Un constructor implementation to treat the config argument as optional, https://github.com/axios/axios/pull/6881 ([7086fb8](https://github.com/uni-helper/uni-network/commit/7086fb86f159428e4b0eb2ac46328d7b72afe506)) - by @

## [0.21.1](https://github.com/uni-helper/uni-network/compare/v0.21.0...v0.21.1) (2025-03-25)

### Bug Fixes

* fix buildFullPath judgement ([fbe706a](https://github.com/uni-helper/uni-network/commit/fbe706a16d9abed6fe39b15c259c764874f5e63b)) - by @

## [0.21.0](https://github.com/uni-helper/uni-network/compare/v0.20.0...v0.21.0) (2025-03-18)

### Features

* add allowAbsoluteUrls option ([79c4581](https://github.com/uni-helper/uni-network/commit/79c4581620717485ff2e83b0fecde92c44707c64)) - by @

## [0.20.0](https://github.com/uni-helper/uni-network/compare/v0.19.3...v0.20.0) (2025-01-06)

### ⚠ BREAKING CHANGES

* improve error handling (#56)

### Features

* improve error handling ([#56](https://github.com/uni-helper/uni-network/issues/56)) ([0b6aa80](https://github.com/uni-helper/uni-network/commit/0b6aa80afa231cce891e288c309d278bf86fd7f4)) - by @peerless-hero

### Bug Fixes

* syntax error on ios, axios/axios[#6608](https://github.com/uni-helper/uni-network/issues/6608) ([2f51786](https://github.com/uni-helper/uni-network/commit/2f51786702e6f0c69930002356941fce8f1db2c7)) - by @

## [0.19.3](https://github.com/uni-helper/uni-network/compare/v0.19.2...v0.19.3) (2024-09-20)

### Features

* add toAbortSignal to UnCancelToken, axios[#6582](https://github.com/uni-helper/uni-network/issues/6582) ([738486c](https://github.com/uni-helper/uni-network/commit/738486cc1404ffc6ed1df3103a23f55f2ecaf563)) - by @ModyQyW

### Bug Fixes

* add the missed implementation of UnError[#status](https://github.com/uni-helper/uni-network/issues/status) property, axios[#6573](https://github.com/uni-helper/uni-network/issues/6573) ([43b5bc5](https://github.com/uni-helper/uni-network/commit/43b5bc541f79f00d6cd95e406205ecfe95f484dd)) - by @ModyQyW
* allow vueuse v11 ([cd84a78](https://github.com/uni-helper/uni-network/commit/cd84a784a9f0ed67d018a19da48c267f1e3ed274)) - by @ModyQyW
* disregard protocol-relative URL to remediate SSRF, axios[#6539](https://github.com/uni-helper/uni-network/issues/6539) ([025cd49](https://github.com/uni-helper/uni-network/commit/025cd49fbf44493f97db3f340762de1599d31910)) - by @ModyQyW
* fix main entry ([7c6561c](https://github.com/uni-helper/uni-network/commit/7c6561ca770a9cdc0f1c861a0d9506cb3f31fe86)) - by @ModyQyW
* fix node10 ts support ([ad3b98c](https://github.com/uni-helper/uni-network/commit/ad3b98cf958bfdb0aeff06dafe7dd3996bcbbd9b)) - by @ModyQyW
* replace statuses with statuses-es for better compact compatibility ([#53](https://github.com/uni-helper/uni-network/issues/53)) ([4806357](https://github.com/uni-helper/uni-network/commit/48063578403e1cbd1f8dcfc602c7d0df026bb995)) - by @wtto00
