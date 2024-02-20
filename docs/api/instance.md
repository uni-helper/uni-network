# 实例

可以使用自定义配置创建一个实例。

## un.create([config])

```typescript
const instance = un.create({
  baseUrl: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
});
```

```typescript
instance.request({
  method: 'POST',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

## 实例方法

以下是可用的实例方法。指定的配置将与实例的配置合并。

- `un.request(config)`
- `un.download(config)`
- `un.upload(config)`
- `un.get(url[, config])`
- `un.delete(url[, config])`
- `un.head(url[, config])`
- `un.options(url[, config])`
- `un.trace(url[, config]])`
- `un.connect(url[, config]])`
- `un.post(url[, data[, config]])`
- `un.put(url[, data[, config]])`
- `un.patch(url[, data[, config]])`
- `un.getUri([config])`
