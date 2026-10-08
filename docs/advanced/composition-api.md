# 组合式函数

如果你还不了解组合式函数，请先阅读 [组合式 API 常见问答](https://cn.vuejs.org/guide/extras/composition-api-faq.html) 和 [组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)。

我们使用 [vue-demi](https://github.com/vueuse/vue-demi) 和 [@vueuse/core](https://vueuse.org/) 来同时支持 `vue2` 和 `vue3`。请先阅读它们的使用说明。

组合式函数通过可选依赖使用 `@vueuse/core`，支持的版本范围是 `^9.0.0 || ^10.0.0 || ^11.0.0 || ^12.0.0 || ^13.0.0 || ^14.0.0 || ^15.0.0`。

::: code-group

```shell [npm]
npm install @vueuse/core
```

```shell [yarn]
yarn add @vueuse/core
```

```shell [pnpm]
pnpm add @vueuse/core
```

:::

在 `uni-app` 中使用较新版本的 `@vueuse/core` 时如果遇到问题，可以查看 [dcloudio/uni-app#4604](https://github.com/dcloudio/uni-app/issues/4604) 内提供的解决方案。

从 `@uni-helper/uni-network/composables` 中导入组合式函数后即可使用。

```typescript
import { useUn } from "@uni-helper/uni-network/composables";
```

## useUn

`useUn` 的用法和 [useAxios](https://vueuse.org/integrations/useaxios/) 几乎完全一致。支持以下几种调用方式：

```typescript
// 传入 url，立即（immediate 默认为 true）发起请求
useUn(url, config?, options?);
useUn(url, instance?, options?);
useUn(url, config, instance, options?);

// 不传 url，等待手动调用 execute
useUn(config?, options?);
useUn(instance?, options?);
useUn(config, instance?, options?);
```

第二个参数是 `config` 还是实例 `un`，按对象类型自动区分；不传实例时使用全局的 `un`。

### 选项

```typescript
interface UseUnOptions<T> {
  // 当 useUn 被调用时，是否自动发起请求
  // 传入 url 字符串时默认为 true，否则默认为 false
  immediate?: boolean;
  // 是否使用 shallowRef，默认为 true
  shallow?: boolean;
  // 是否在新请求发起时中止之前的请求，默认为 true
  abortPrevious?: boolean;
  // 是否在执行前将请求数据重置为 initialData，默认为 false
  resetOnExecute?: boolean;
  // 在请求还未响应时使用的响应数据
  initialData?: T;
  // 发生错误时调用
  onError?: (e: unknown) => void;
  // 成功请求时调用
  onSuccess?: (data: T) => void;
  // 请求结束时调用
  onFinish?: () => void;
}
```

### 返回值

```typescript
const {
  // Un 响应
  response,
  // Un 响应数据
  data,
  // 发生的错误
  error,
  // 是否已经结束
  isFinished,
  // 是否正在请求
  isLoading,
  // 是否已经取消
  isAborted,
  // 取消当前请求
  abort,
  // 手动调用，可以传入新的 url 或 config
  execute,
} = useUn("/user/12345");
```

- `isCanceled` 是 `isAborted` 的别名，`cancel` 是 `abort` 的别名。
- `execute` 返回一个 Promise，请求结束时 resolve、出错时 reject，所以返回值也可以直接 `await`：

```typescript
// 第二个参数是请求配置，选项要放在第三个参数
const { data, execute } = useUn("/user/12345", {}, { immediate: false });

await execute();
```
