<script setup>
import { reactive } from 'vue'
import CustomButton from './Button.vue'
import Container from './Container.vue'

const resModel = reactive({
  demo1: null,
  demo2: null,
  demo3: null,
})
function search(nums, target) {
  if (nums.length === 0)
    return -1
  let l = 0
  let r = nums.length - 1
  while (l <= r) {
    const mid = l + ((r - l) >>> 1)
    if (target === nums[mid])
      return mid
    // [left,mid]
    if (nums[l] <= nums[mid]) {
      if (target >= nums[l] && target < nums[mid]) {
        r = mid - 1
      }
      else {
        l = mid + 1
      }
    }
    else { // [mid,right]区间
      if (target > nums[mid] && target <= nums[r]) {
        l = mid + 1
      }
      else {
        r = mid - 1
      }
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

function onClick3(nums, target) {
  resModel.demo3 = search(nums, target)
}
</script>

<template>
  <Container>
    <div class="color-zinc">
      示例1运行结果：{{ resModel.demo1 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick1([4, 5, 6, 7, 0, 1, 2], 0)" />
    <div class="color-zinc mt-4">
      示例2运行结果：{{ resModel.demo2 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick2([4, 5, 6, 7, 0, 1, 2], 3)" />
    <div class="color-zinc mt-4">
      示例3运行结果：{{ resModel.demo3 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick3([1], 0)" />
  </Container>
</template>
