# 基本用例

使用 `uni-network` 基本用例

## GET 请求

```ts
import un from '@uni-helper/uni-network';

// 请求特定 ID 的用户数据
un.get('/user?ID=12345')
  .then((response) => {
    // 处理响应
    console.log('response', response);
  })
  .catch((error) => {
    // 处理错误
    console.log('error', error);
  })
  .finally(() => {
    // 总是会执行
  });

// 上述请求和以下等同
un.get('/user', {
  params: {
    ID: '12345',
  },
})
  .then((response) => {
    console.log('response', response);
  })
  .catch((error) => {
    console.log('error', error);
  })
  .finally(() => {
    // 总是会执行
  });
```

## async/await

```ts
async function getUser() {
  try {
    const response = await un.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

## POST 请求

```ts
un.post('/user', {
  firstName: 'Fred',
  lastName: 'Flintstone',
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

```ts
function getUserAccount() {
  return un.get('/user/12345');
}

function getUserPermissions() {
  return un.get('/user/12345/permissions');
}

Promise.all([getUserAccount(), getUserPermissions()]).then((responses) => {
  const acct = responses[0];
  const perm = responses[1];
});
```
