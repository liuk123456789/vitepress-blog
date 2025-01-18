<script setup>
import { reactive } from 'vue'
import CustomButton from './Button.vue'
import Container from './Container.vue'

const resModel = reactive({
  demo1: null,
  demo2: null,
})
function search(nums, target) {
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2)
    if (target === nums[mid]) {
      return mid
    }
    else if (target < nums[mid]) {
      right = mid - 1
    }
    else {
      left = mid + 1
    }
  }
  return -1
};

function onClick1(nums, target) {
  resModel.demo1 = search(nums, target)
}

function onClick2(nums, target) {
  resModel.demo2 = search(nums, target)
}
</script>

<template>
  <Container>
    <div class="color-zinc">
      示例1运行结果：{{ resModel.demo1 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick1([-1, 0, 3, 5, 9, 12], 9)" />
    <div class="color-zinc mt-4">
      示例2运行结果：{{ resModel.demo2 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick2([-1, 0, 3, 5, 9, 12], 2)" />
  </Container>
</template>
