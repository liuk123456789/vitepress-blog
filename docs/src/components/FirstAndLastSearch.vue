<script setup>
import { reactive } from 'vue'
import CustomButton from './Button.vue'
import Container from './Container.vue'

const resModel = reactive({
  demo1: null,
  demo2: null,
  demo3: null,
})

function searchRange(nums, target) {
  let left = 0
  let right = nums.length - 1
  let first = -1
  let last = -1
  while (left <= right) {
    const mid = left + ((right - left) >>> 1)
    if (nums[mid] === target) {
      first = mid
      // 寻找靠近左侧的target
      right = mid - 1
    }
    else if (nums[mid] > target) {
      right = mid - 1
    }
    else {
      left = mid + 1
    }
  }

  // 最后一个等于target的位置
  left = 0
  right = nums.length - 1
  while (left <= right) {
    const mid = left + ((right - left) >>> 1)
    if (nums[mid] === target) {
      last = mid
      // 寻找靠近右侧的target
      left = mid + 1
    }
    else if (nums[mid] > target) {
      right = mid - 1
    }
    else {
      left = mid + 1
    }
  }

  return [first, last]
};

function onClick1(nums, target) {
  resModel.demo1 = searchRange(nums, target)
}

function onClick2(nums, target) {
  resModel.demo2 = searchRange(nums, target)
}

function onClick3(nums, target) {
  resModel.demo3 = searchRange(nums, target)
}
</script>

<template>
  <Container>
    <div class="color-zinc">
      示例1运行结果：{{ resModel.demo1 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick1([5, 7, 7, 8, 8, 10], 8)" />
    <div class="color-zinc mt-4">
      示例2运行结果：{{ resModel.demo2 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick2([5, 7, 7, 8, 8, 10], 6)" />
    <div class="color-zinc mt-4">
      示例3运行结果：{{ resModel.demo3 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick3([], 0)" />
  </Container>
</template>
