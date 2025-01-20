<script setup>
import { reactive } from 'vue'
import CustomButton from './Button.vue'
import Container from './Container.vue'

const resModel = reactive({
  demo1: null,
  demo2: null,
})
function findClosestNumber(nums) {
  if (nums.length === 0)
    return 0
  let slow = 0
  let fast = 0
  while (fast < nums.length) {
    if (Math.abs(nums[slow]) > Math.abs(nums[fast])) {
      slow = fast
    }
    if (Math.abs(nums[slow]) === Math.abs(nums[fast])) {
      if (nums[slow] < nums[fast]) {
        slow = fast
      }
    }
    fast++
  }
  return nums[slow]
};

function onClick1(nums) {
  resModel.demo1 = findClosestNumber(nums)
}

function onClick2(nums) {
  resModel.demo2 = findClosestNumber(nums)
}
</script>

<template>
  <Container>
    <div class="color-zinc">
      示例1运行结果：{{ resModel.demo1 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick1([-4, -2, 1, 4, 8])" />
    <div class="color-zinc mt-4">
      示例2运行结果：{{ resModel.demo2 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick2([2, -1, 1])" />
  </Container>
</template>
