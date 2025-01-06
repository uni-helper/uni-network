# 响应结构

一个请求的响应包应含以下信息。

```typescript
const res = {
  // `errMsg` 是可选的错误信息
  errMsg: "",

  // `errno` 是可选的错误代码
  errno: 0,

  // `profile` 是可选的调试信息
  profile: {},

  // `config` 是 `un` 请求的配置信息
  config: {},

  // `task` 是对应的 task 信息
  task: {},

  // `status` 来自服务器响应的 HTTP 状态码
  status: 200,

  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: "OK",

  // `headers` 是服务器响应头
  // 所有的 header 名称都是小写，而且可以使用方括号语法访问
  // 例如: `response.headers['content-type']`
  headers: {},

  // `data` 是由服务器提供的响应数据
  data: {},

  // request 特有
  // 服务器提供的 cookies 数据
  cookies: [],

  // download 特有
  // 临时本地文件路径
  // 没传入 filePath 指定文件存储路径时会返回，下载后的文件会存储到一个临时文件
  tempFilePath: "",

  // download 特有
  // 用户本地文件路径
  // 传入 filePath 时会返回，跟传入的 filePath 一致
  filePath: "",
};
```

当使用 then 时，你将接收如下响应：

```typescript
un.get("/user/12345").then((response) => {
  console.log("errMsg", response?.errMsg);
  console.log("errno", response?.errno);
  console.log("profile", response?.profile);
  console.log("config", response?.config);
  console.log("status", response?.status);
  console.log("statusText", response?.statusText);
  console.log("headers", response?.headers);
  console.log("data", response?.data);
  console.log("cookies", response?.cookies);
  console.log("tmpFilePath", response?.tmpFilePath);
  console.log("filePath", response?.filePath);
});
```

当使用 `catch`，或者传递一个 `rejection callback` 作为 `then` 的第二个参数时，响应可以作为 `error` 对象被使用，正如在 [错误处理](../advanced/handling-errors.md) 部分解释的那样。
