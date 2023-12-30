# 默认配置

你可以指定默认配置，它将作用于每个请求。

## 全局配置默认值

```ts
un.defaults.baseUrl = 'https://api.example.com';
```

## 自定义实例默认值

```ts
// 创建实例时配置默认值
const instance = un.create({
  baseUrl: 'https://api.example.com',
});

// 创建实例后修改默认值
instance.defaults.baseUrl = 'https://api.another-example.com';
```

## 配置的优先级

配置将会按优先级进行合并。优先级从低到高是内置的默认值、实例的 `defaults` 配置、请求的 `config`。后面的优先级要高于前面的。下面有一个例子。

```ts
// 使用库提供的默认配置创建实例
// 此时超时配置的默认值是实际调用的 API 的默认值
const instance = un.create();

// 重写库的超时默认值
// 现在，所有使用此实例的请求都将等待 2.5 秒，然后才会超时
instance.defaults.timeout = 2500;

// 重写此请求的超时时间，因为该请求需要很长时间
instance.get('/longRequest', {
  timeout: 5000,
});
```
