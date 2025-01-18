<script setup>
import { useAttrs } from 'vue'

defineOptions({
  name: 'CustomButton',
})
const props = defineProps({
  title: {
    type: String,
    default: '测试',
  },
})
const attrs = useAttrs()

function onClick() {
  attrs.onSubmit()
}
</script>

<template>
  <button
    class="b-rounded color-blue-500 pl-3 pr-3 pt-1 pb-1 border-blue-500 bg-blue-100 hover:color-blue-300"
    @click="onClick"
  >
    {{ props.title }}
  </button>
</template>
