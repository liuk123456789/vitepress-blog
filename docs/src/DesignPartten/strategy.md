---
outline: deep
---

<script setup>
import ValidateDemo from '../components/ValidateDemo.vue'
</script>

### 概念说明

:::info 策略模式是一种简单却常用的设计模式，它的应用场景非常广泛。我们先了解策略模式的概念，在通过代码示例来更清晰的认识它。策略模式由两部分构成：一部分是封装不同策略的策略组，另一部分是 Context。通过组合和委托来让 Context 拥有执行策略的能力，从而实现可复用、可扩展和可维护，并且避免大量复制粘贴的工作。

:::

### 应用场景

> 下面的案例均来自`JavaScript设计模式与开发实践`

1. 使用策略模式计算奖金

   很多公司的年终奖是根据员工的工资基数和年底绩效情况来发放的。例如，绩效为 S 的人年

   终奖有 4 倍工资，绩效为 A 的人年终奖有 3 倍工资，而绩效为 B 的人年终奖是 2 倍工资。假设财

   务部要求我们提供一段代码，来方便他们计算员工的年终奖。

   ```javascript
   const strategies = {
     S(salary) {
       return salary * 4
     },
     A(salary) {
       return salary * 3
     },
     B(salary) {
       return salary * 2
     }
   }

   const calculateBouns = function (level, salary) {
     return strategies[level](salary)
   }

   console.log(calculateBouns('S', 20000)) // 输出：80000
   console.log(calculateBouns('A', 10000)) // 输出：30000
   ```

2. 表单校验

   1. 实现表单的第一个版本

      ```html
      <html>
       <body>
           <form action="http:// xxx.com/register" id="registerForm" method="post">
               请输入用户名：<input type="text" name="userName"/ >
               请输入密码：<input type="text" name="password"/ >
               请输入手机号码：<input type="text" name="phoneNumber"/ >
               <button>提交</button>
           </form>
           <script>
               var registerForm = document.getElementById( 'registerForm' );
               registerForm.onsubmit = function(){
                   if ( registerForm.userName.value === '' ){
                   alert ( '用户名不能为空' );
                   return false;
                   }
                   if ( registerForm.password.value.length < 6 ){
                       alert ( '密码长度不能少于 6 位' );
                       return false;
                   }
                   if ( !/(^1[3|5|8][0-9]{9}$)/.test( registerForm.phoneNumber.value ) ){
                       alert ( '手机号码格式不正确' );
                       return false;
                   }
               }
           </script>
       </body>
      </html>
      ```

      :::warning 缺点如下

      1. `registerForm.onsubmit`函数比较庞大，包含了很多`if-else`语句，这些语句需要覆盖所有的校验规则
      2. `registerForm.onsubmit`函数缺乏弹性，增加了校验规则
      3. 或者想把密码的长度校验从 6 改成 8，我们都必须深入`registerForm.onsubmit `函数的内部实现，这是违反开放—封闭原则的。
      4. 算法的复用性差，程序中增加另外一个表单，这个表单也有类似校验，那么校验逻辑遍地都是

      :::

   2. 策略模式重构表单校验

      ```javascript
      const strategies = {
        isNonEmpty(value, errorMsg) {
          if (value === '') {
            return errorMsg
          }
        },
        minLength(value, length, errorMsg) {
          if (value.length < length) {
            return errorMsg
          }
        },
        isMobile(value, errorMsg) { // 手机号码格式
          if (!/(^1[3|58]\d{9}$)/.test(value)) {
            return errorMsg
          }
        }
      }
      ```

      接下来我们准备实现 `Validator` 类。`Validator `类在这里作为` Context`，负责接收用户的请求

      并委托给 `strategy` 对象。在给出 `Validator` 类的代码之前，有必要提前了解用户是如何向 `Validator`

      类发送请求的，这有助于我们知道如何去编写 `Validator `类的代码。代码如下：

      ```javascript
      const validataFunc = function () {
        const validator = new Validator()

        validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空')
        validator.add(registerForm.password, 'minLength:6', '密码长度不能少于 6 位')
        validator.add(registerForm.phoneNumber, 'isMobile', '手机号码格式不正确')

        consterrorMsg = validator.start()
         eturn errorMsg
      }

      const registerForm = document.getElementById('registerForm')

      registerForm.onsubmit = function () {
        const errorMsg = validataFunc()
        if (errorMsg) {
          alert(errorMsg)
          return false
        }
      }
      ```

      先创建了一个`validator`对象，然后通过`validator.add`方法

      往 `validator` 对象中添加一些校验规则。`validator.add `方法接受 3 个参数，以下面这句代码说明：

      ```javascript
      validator.add(registerForm.password, 'minLength:6', '密码长度不能少于 6 位')
      ```

      - `registerForm.password`为参与校验的`input`输入框
      - `minLenght:6`是一个以冒号隔开的字符串。冒号前面的`minLength`代表客户挑选的`strategy`对象，冒号后面的数字`6`表示在校验过程中所必须的一些参数。`minLength:6`的意思就是校验 `registerForm.password `这个文本输入框的 `value `最小长度为 6。如果这个字符串中不包含冒号，说明校验过程中不需要额外的参数信息，比如`isNonEmpty`。
      - 第三个参数校验未通过返回的错误信息

      **完成`Validator`类**

      ```javascript
      const Validator = function() {
          this.cache = []; //保存校验规则
      }

      Validator.prototype.add = function(field,rule,errorMsg) {
          const ary = rule.split(':')
          this.cache.push(function() {
              const strategy = ary.shift()
              ary.unshift(field.value)
              ary.push(errorMsg)
              return strategies[strategy].apply(field, ary)
          })
      }

      Validator.prototype.start = function() {
          for(let i = 0, validatorFunc; validatorFunc = this.cache[i++]) {
              const msg = validatorFunc()
              if(msg) {
                  return msg
              }
          }
      }
      ```

      **给输入框添加多种校验规则**

      ```javascript
      /**************策略对象**************/
      const strategies = {
          isNonEmpty: function(value, errorMsg) {
             if(value === '') {
                 return errorMsg
             }
          },
          minLength: function(value,length,errorMsg) {
              if(value.length < length) {
                  return errorMsg
              }
          },
          isMobile: function( value, errorMsg ){ // 手机号码格式
               if ( !/(^1[3|5|8][0-9]{9}$)/.test( value ) ){
                   return errorMsg;
               }
          }
      }

      /**************Validator类**************/
      const Validator = function() {
          this.cache = []
      }

      Validator.prototype.add = function(field, rules) {
          const self = this

          for(let i = 0, rule; rule = rules[i++]) {
              (
              	function(rule) {
                      const strategyAry = rule.strategy.split( ':' );
                      const errorMsg = rule.errorMsg;

                      self.cache.push(function() {
                          const strategy = strategyAry.shift()
                          strategyAry.unshift(field.value)
                          strategyAry.push(errorMsg)
                          return strategies[strategy].apply(field, strategyAry)
                      })
                  }
              )(rule)
          }
      }

      Validator.prototype.start = function() {
          for(let i = 0, validatorFunc; validatorFunc = this.cache[i++]) {
              const msg = validatorFunc()
              if(msg) {
                  return msg
              }
          }
      }

      /*****************客户端代码****************/
      const registerForm = document.getElementById('registerForm')

      const validataFunc = function() {
          const validator = new Validator()

          validator.add(registerForm.userName, [{
              strategy: 'isNonEmpty',
              errorMsg: '用户名不能为空'
          }, {
              strategy: 'minLength:6',
              errorMsg: '密码长度不能小于6位'
          }]);

          validator.add( registerForm.password, [{
              strategy: 'minLength:6',
              errorMsg: '密码长度不能小于6位'
          }]);

          validator.add( registerForm.phoneNumber, [{
              strategy: 'isMobile',
              errorMsg: '手机号码格式不正确'
          }]);

      	return validator.start()
      }

      registerForm.onsubmit = function() {
          const errorMsg = validataFunc()
          if(errorMsg) {
              alert(errorMsg)
              return false
          }
      }
      ```
    <ValidateDemo></ValidateDemo>
   
   ### 实际开发应用
