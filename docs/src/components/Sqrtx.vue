<script setup>
import { reactive } from 'vue'
import CustomButton from './Button.vue'
import Container from './Container.vue'

const resModel = reactive({
  demo1: null,
  demo2: null,
  demo: null,
})
function mySqrt(x) {
  let left = 0
  let right = x
  let res = 0
  while (left <= right) {
    const mid = Math.floor((right - left) / 2) + left
    if (mid * mid > x) {
      right = mid - 1
    }
    else if (mid * mid <= x) {
      // mid 此时是个备选的结果,s
      res = mid
      // 左指针右移
      left = mid + 1
    }
  }
  // 考虑到x为0这个场景，所以定义res这个变量，如果返回left-1,x为0,结果是不对的
  return res
};

function onClick1(num) {
  resModel.demo1 = mySqrt(num)
}

function onClick2(num) {
  resModel.demo2 = mySqrt(num)
}
</script>

<template>
  <Container>
    <div class="color-zinc">
      示例1运行结果：{{ resModel.demo1 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick1(4)" />
    <div class="color-zinc mt-4">
      示例2运行结果：{{ resModel.demo2 }}
    </div>
    <CustomButton class="mt-4" title="测试" @submit="onClick2(8)" />
  </Container>
</template>
