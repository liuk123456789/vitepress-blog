<script setup>
import { reactive, ref } from 'vue'

defineOptions({
  name: 'ValidateDemo',
})

const registerFormRef = ref()

const errorMsg = ref('')

const strategies = {
  isNonEmpty(value, errorMsg) {
    if (value === '') {
      return errorMsg
    }
  },
  minLength(value, length, errorMsg) {
    if (value.length < +length) {
      return errorMsg
    }
  },
  isMobile(value, errorMsg) { // 手机号码格式
    if (!/^(?:(?:\+|00)86)?1(?:3\d|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8\d|9[1589])\d{8}$/.test(value)) {
      return errorMsg
    }
  },
}

const Validator = function () {
  this.cache = []
}

Validator.prototype.add = function (field, rules) {
  const self = this

  for (let i = 0, rule; rule = rules[i++];) {
    (
      function (rule) {
        const strategyAry = rule.strategy.split(':')
        const errorMsg = rule.errorMsg

        self.cache.push(() => {
          const strategy = strategyAry.shift()
          strategyAry.unshift(field.value)
          strategyAry.push(errorMsg)
          return strategies[strategy].apply(field, strategyAry)
        })
      }
    )(rule)
  }
}

Validator.prototype.start = function () {
  for (let i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
    const msg = validatorFunc()
    if (msg) {
      return msg
    }
  }
}

const validataFunc = function () {
  const validator = new Validator()

  validator.add(registerFormRef.value.userName, [{
    strategy: 'isNonEmpty',
    errorMsg: '用户名不能为空',
  }, {
    strategy: 'minLength:6',
    errorMsg: '密码长度不能小于6位',
  }])

  validator.add(registerFormRef.value.password, [{
    strategy: 'minLength:6',
    errorMsg: '密码长度不能小于6位',
  }])

  validator.add(registerFormRef.value.mobile, [{
    strategy: 'isMobile',
    errorMsg: '手机号码格式不正确',
  }])

  return validator.start()
}

function onSubmit() {
  const msg = validataFunc()
  errorMsg.value = msg || ''
}
</script>

<template>
  <div class="pt-6 pb-6 pl-6 pr-6 shadow shadow-coolGray">
    <form ref="registerFormRef" @submit.prevent>
      <div class="flex">
        <label class="color-zinc-400 font-size-13px w-120px">请输入用户名：</label>
        <input class="border b-rounded border-solid pl-2 pr-2 border-zinc-300" type="text" name="userName">
        <span>{{ }}</span>
      </div>
      <div class="flex mt-4">
        <label class="color-zinc-400 font-size-13px w-120px">请输入密码：</label>
        <input class="border b-rounded border-solid pl-2 pr-2 border-zinc-300" type="text" name="password">
      </div>
      <div class="flex mt-4">
        <label class="color-zinc-400 font-size-13px w-120px">请输入手机号码：</label>
        <input class="border b-rounded border-solid pl-2 pr-2 border-zinc-300" type="text" name="mobile">
      </div>
      <span v-if="errorMsg" class="block font-size-13px color-red-5">{{ errorMsg }}</span>
      <button class="b-rounded color-green-500 pl-3 pr-3 pt-1 pb-1 border-green-500 bg-green-100 mt-6 hover:color-green-300" @click.stop="onSubmit">
        提交
      </button>
    </form>
  </div>
</template>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>
