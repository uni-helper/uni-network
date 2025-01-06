# 基本用例

## GET 请求

```typescript
import { un } from "@uni-helper/uni-network";

// 请求特定 ID 的用户数据
un.get("/user?ID=12345")
  .then((response) => {
    // 处理响应
    console.log("response", response);
  })
  .catch((error) => {
    // 处理错误
    console.log("error", error);
  })
  .finally(() => {
    // 总是会执行
  });

// 上述请求和以下等同
un.get("/user", {
  params: {
    ID: "12345",
  },
})
  .then((response) => {
    console.log("response", response);
  })
  .catch((error) => {
    console.log("error", error);
  })
  .finally(() => {
    // 总是会执行
  });
```

::: tip 名称

`un` 是 `uni` 和 `network` 的首字母缩写。如果你不习惯这个名称，你可以在导入时自行调整，比如使用 `uniNetwork`：`import { un as uniNetwork } from '@uni-helper/uni-network';`。

:::

## 使用 async/await 的 GET 请求

```typescript
import { un } from "@uni-helper/uni-network";

async function getUser() {
  try {
    const response = await un.get("/user?ID=12345");
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

## POST 请求

```typescript
import { un } from "@uni-helper/uni-network";

un.post("/user", {
  firstName: "Fred",
  lastName: "Flintstone",
})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(() => {});
```

## 并发请求

```typescript
import { un } from "@uni-helper/uni-network";

function getUserAccount() {
  return un.get("/user/12345");
}

function getUserPermissions() {
  return un.get("/user/12345/permissions");
}

Promise.all([getUserAccount(), getUserPermissions()]).then((responses) => {
  const acct = responses[0];
  const perm = responses[1];
});
```

基本用例应该能让你初步上手 `@uni-helper/uni-network`。你可以动手尝试一下，也可以继续往下阅读。
