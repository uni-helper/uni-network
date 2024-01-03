# TypeScript 支持

`@uni-helper/uni-network` 使用 TypeScript 编写，你可以享受到完整的 TypeScript 支持。

最常见的一个类型问题是，调用 API 时得不到响应数据和请求数据的类型。

```typescript
import { un } from '@uni-helper/uni-network';

// response 的类型是 UnResponse<UnData, UnData>
// response.data 的类型是 UnData，你希望是 Record<string, any>
const response = await un({
  method: 'post',
  url: '/user/12345',
  // 以下 data 的类型是 UnData，你希望是 Record<string, string>
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

这可以通过设置两个泛型类型来解决，两个泛型类型依次分别对应响应数据和请求数据的类型。

```typescript
import { un } from '@uni-helper/uni-network';

// response 的类型是 UnResponse<Record<string, any>, Record<string, string>>
// response.data 的类型是 Record<string, any>
const response = await un<
  Record<string, any>, // 对应 response.data 类型
  Record<string, string>, // 对应传参中 data 类型
>({
  method: 'post',
  url: '/user/12345',
  // 以下 data 的类型是 Record<string, string>
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

而另一个常见的类型问题是，使用响应拦截器后响应类型不正确。

```typescript
import { un } from '@uni-helper/uni-network';

// 添加响应拦截器直接返回 response.data
un.interceptors.response.use((response) => response.data);

// response 的类型是 UnResponse<UnData, UnData>，你希望是 Record<string, any>
// response.data 的类型是 UnData，你希望是 Record<string, any>
const response = await un({
  method: 'post',
  url: '/user/12345',
  // 以下 data 的类型是 UnData，你希望是 Record<string, string>
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

这需要设置三个泛型类型来解决，三个泛型类型依次分别对应响应数据、请求数据、响应的类型。

```typescript
import { un } from '@uni-helper/uni-network';

// 添加响应拦截器直接返回 response.data
un.interceptors.response.use((response) => response.data);

// response 的类型是 Record<string, any>
// response.data 的类型是 Record<string, any>
const response = await un<
  Record<string, any>, // 对应 response.data 类型
  Record<string, string>, // 对应传参中 data 类型
  Record<string, any>, // 对应 response 类型
>({
  method: 'post',
  url: '/user/12345',
  // 以下 data 的类型是 Record<string, string>
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

::: tip 范型类型设计

如果你只想修改响应的类型，而不修改其它类型，你仍然需要书写三个泛型类型。这和 `axios` 的泛型类型设计不同，因为 `uni-app` 对数据类型有更严格的要求。

:::

你可以从 `@uni-helper/uni-network` 中导入 `UnData` 以保持前两个泛型类型的默认值。

```typescript
import { un, type UnData } from '@uni-helper/uni-network';

// 添加响应拦截器直接返回 response.data
un.interceptors.response.use((response) => response.data);

// response 的类型是 Record<string, any>
// response.data 的类型是 UnData
const response = await un<
  UnData, // 对应 response.data 类型
  UnData, // 对应传参中 data 类型
  Record<string, any>, // 对应 response 类型
>({
  method: 'post',
  url: '/user/12345',
  // 以下 data 的类型是 UnData
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```
