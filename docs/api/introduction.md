# API

可以直接向导入的 `un` 传递相关配置来发起请求。

## un(config)

```typescript
import { un } from '@uni-helper/uni-network';

// 发起 POST 请求
un({
  method: 'POST',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

## un(url[, config])

```typescript
import { un } from '@uni-helper/uni-network';

// 发起 GET 请求（默认请求方法）
un('/user/12345');
```

## 请求别名

为了方便起见，已经为所有支持的请求方法提供了别名。在使用别名方法时，`url`、`method`、`data` 不需要在 `config` 中指定。如果同时指定，`config` 中指定的字段会被覆盖掉。

- `un.request(config)`
- `un.download(config)`
- `un.upload(config)`
- `un.get(url[, config])`
- `un.delete(url[, config])`
- `un.head(url[, config])`
- `un.options(url[, config])`
- `un.trace(url[, config])`
- `un.connect(url[, config])`
- `un.post(url[, data[, config]])`
- `un.put(url[, data[, config]])`
- `un.patch(url[, data[, config]])`
