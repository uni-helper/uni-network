# 组合式函数

如果你还不了解组合式函数，请先阅读 [组合式 API 常见问答](https://cn.vuejs.org/guide/extras/composition-api-faq.html) 和 [组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)。

我们使用 [vue-demi](https://github.com/vueuse/vue-demi) 来同时支持 `vue2` 和 `vue3`。请先阅读它的使用说明。

你需要从 `@uni-helper/uni-network/composables` 中导入组合式函数。

```typescript
import { useUn } from '@uni-helper/uni-network/composables';
```

`useUn` 的用法和 [useAxios](https://vueuse.org/integrations/useaxios/) 几乎完全一致。这里不再赘述。
