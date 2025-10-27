# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
