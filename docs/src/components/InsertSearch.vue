<script setup>
import { reactive } from 'vue'
import CustomButton from './Button.vue'
import Container from './Container.vue'

const resModel = reactive({
  demo1: null,
  demo2: null,
  demo: null,
})
function searchInsert(nums, target) {
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    const mid = Math.floor((right - left) / 2) + left
    if (nums[mid] >= target) {
      right = mid - 1
    }
    else if (nums[mid] < target) {
      left = mid + 1
    }
  }
  // right 最终指向第一个小于target的数
  // left 指向大于等于target的数
  return left
}

function onClick1(nums, target) {
  resModel.demo1 = searchInsert(nums, target)
}

function onClick2(nums, target) {
  resModel.demo2 = searchInsert(nums, target)
}

function onClick3(nums, target) {
  resModel.demo3 = searchInsert(nums, target)
}
</script>

<template>
  <Container>
    <div class="color-zinc">
      示例1运行结果：{{ resModel.demo1 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick1([1, 3, 5, 6], 5)" />
    <div class="color-zinc mt-4">
      示例2运行结果：{{ resModel.demo2 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick2([1, 3, 5, 6], 2)" />
    <div class="color-zinc mt-4">
      示例3运行结果：{{ resModel.demo3 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick3([1, 3, 5, 6], 7)" />
  </Container>
</template>
