# Un 实例

## 创建实例

可以使用自定义配置创建一个实例。

### un.create([config])

```ts
const instance = un.create({
  baseUrl: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
});
```

```ts
instance.request({
  method: 'POST',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```
