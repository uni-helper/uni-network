<script setup lang="ts">
import { ref } from 'vue';
import { un } from '@uni-helper/uni-network';

const title = ref('Hello');
un.get('https://jsonplaceholder.typicode.com/todos')
  .then((data) => {
    console.log('data', data);
  })
  .catch((error) => {
    console.log('error', error);
  });
</script>

<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
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
