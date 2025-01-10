<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div>
    The count is: {{ count }}
    <button :class="$style.button" @click="count++">
      Increment
    </button>
  </div>
</template>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>
