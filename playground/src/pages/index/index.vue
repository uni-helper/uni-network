<script setup lang="ts">
import { un } from "@uni-helper/uni-network";
import { useUn } from "@uni-helper/uni-network/composables";
import { ref, watchEffect } from "vue";

const title = ref("Hello");

// 直接请求
un.get("https://jsonplaceholder.typicode.com/todos")
  .then((data) => {
    console.log("direct request data", data);
  })
  .catch((error) => {
    console.log("direct request error", error);
  });

// Vue Composition
const { data, error, isLoading } = useUn(
  "https://jsonplaceholder.typicode.com/todos",
);
watchEffect(() => {
  console.log("composition data", data.value);
  console.log("composition error", error.value);
  console.log("composition isLoading", isLoading.value);
});

// 自定义实例
const unInstance = un.create({ timeout: 10000 });
unInstance
  .get("https://jsonplaceholder.typicode.com/todos")
  .then((data) => {
    console.log("custom instance data", data);
  })
  .catch((error) => {
    console.log("custom instance error", error);
  });
</script>

<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"/>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
