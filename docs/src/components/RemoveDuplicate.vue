<script setup>
import { reactive } from 'vue'
import CustomButton from './Button.vue'
import Container from './Container.vue'

const resModel = reactive({
  demo1: null,
  demo2: null,
  demo3: null,
})

function removeDuplicates(nums) {
  const len = nums.length
  if (len === 0)
    return 0
  let slow = 1
  let fast = 1
  while (fast < len) {
    // 如果值相同，只需移动快指针即可
    if (nums[fast] === nums[fast - 1]) {
      fast++
    }
    else {
      // 更新slow的值为fast指针指向的值
      nums[slow] = nums[fast]
      slow++
      fast++
    }
  }
  return slow
};

function onClick1(nums) {
  resModel.demo1 = removeDuplicates(nums)
}

function onClick2(nums) {
  resModel.demo2 = removeDuplicates(nums)
}
</script>

<template>
  <Container>
    <div class="color-zinc">
      示例1运行结果：{{ resModel.demo1 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick1([1, 1, 2])" />
    <div class="color-zinc mt-4">
      示例2运行结果：{{ resModel.demo2 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick2([0, 0, 1, 1, 1, 2, 2, 3, 3, 4])" />
  </Container>
</template>
