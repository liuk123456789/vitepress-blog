<script setup>
import { reactive } from 'vue'
import CustomButton from './Button.vue'
import Container from './Container.vue'

const resModel = reactive({
  demo1: null,
  demo2: null,
})

function maxArea(height) {
  if (height.length === 0)
    return 0
  let l = 0
  let r = height.length - 1
  let res = 0
  while (l < r) {
    // 最多可容纳水的量取决于height[l]和height[r]小的值
    // 将值和res进行比较，取大的
    // 同时移动height[l]和height[r]小点的值
    res = height[l] < height[r] ? Math.max(res, (r - l) * height[l++]) : Math.max(res, (r - l) * height[r--])
  }
  return res
};

function onClick1(nums) {
  resModel.demo1 = maxArea(nums)
}

function onClick2(nums) {
  resModel.demo2 = maxArea(nums)
}
</script>

<template>
  <Container>
    <div class="color-zinc">
      示例1运行结果：{{ resModel.demo1 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick1([1, 8, 6, 2, 5, 4, 8, 3, 7])" />
    <div class="color-zinc mt-4">
      示例2运行结果：{{ resModel.demo2 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick2([1, 1])" />
  </Container>
</template>
