---
outline: deep
---

:::warning 参考：《JavaScript设计模式与开发实践》

:::

### 概念说明

:::info 确保一个类只有一个实例，并且提供全局访问。如`vuex`和`redux`

:::

### 实现方式

1. 实现最简单的单例模式

   ```javascript
   const Singleton = function (name) {
     this.name = name
   }

   Singleton.instance = null
   Singleton.prototype.getName = function () {
     console.log(this.name)
   }

   Singleton.getInstance = function (name) {
     if (!this.instance) {
       this.instance = new Singleton(name)
     }
     return this.instance
   }

   const a = Singleton.getInstance('a')
   const b = Singleton.getInstance('b')

   console.log(a === b)
   ```

2. 透明的单例模式

   利用`立即执行函数`避免创建全局变量，污染全局

   ```javascript
   const CreateDiv = (function () {
     let instance

     const CreateDiv = function (html) {
       if (instance) {
         return instance
       }
       this.html = html
       this.init()
       instance = this
     }

     CreateDiv.prototype.init = function () {
       const div = document.createElement('div')
       div.innerHtml = this.html
       document.body.appendChild(div)
       return CreateDiv
     }
   })()

   const a = new CreateDiv('sven1')
   const b = new CreateDiv('sven2')

   console.log(a)
   console.log(b)
   console.log(a === b)
   ```

3. 使用代理实现单例模式

   ```javascript
   const CreateDiv = function (html) {
     this.html = html
     this.init()
   }

   CreateDiv.prototype.init = function () {
     const div = document.createElement('div')
     div.innerHtml = this.html
     document.body.appendChild(div)
   }

   // 代理类 保证instance 不污染全局
   const ProxySingletonCreateDiv = (function () {
     let instance
     // 借助闭包，第一次创建完成后不会销毁instance
     return function (html) {
       if (!instance) {
         instance = new CreateDiv(html)
       }
       return instance
     }
   })()

   // 使用
   const a = new ProxySingletonCreateDiv('seven1')
   const b = new ProxySingletonCreateDiv('seven2')

   console.log(a)
   console.log(b)
   console.log(a === b) // true
   ```

4. 惰性单例

   ```javascript
   Singleton.getInstance = (function () {
     // 因为闭包，导致instance不会被销毁，同时无需将instance 挂到Singleton上
     let instance = null

     return function (props) {
       if (!instance) {
         instance = new Singleton(props)
       }
       return instance
     }
   })()
   ```

5. 通用惰性单例

   ```javascript
   const createInstance = function (name) {
     const instance = {
       id: 1,
       name
     }
   }
   const getSingle = function (fn) {
     let result // 闭包导致result不会被销毁
     return function () {
       return result || (result = fn.apply(this, arguments))
     }
   }
   const fn = getSingle(createInstance)

### 实际应用

#### 实现一个Storage存储器

```javascript
class MyStorage {
  static getInstance = () => {
    if (!MyStorage.instance) {
      MyStorage.instance = new MyStorage()
    }
    return MyStorage.instance
  }

  // 保存数据：通过key/value的形式传参
  setState(key, value) {
    window.localStorage.setItem(key, value)
  }

  // 通过key读取数据
  getState(key) {
    return localStorage.getItem(key)
  }

  // 删除key
  deleteState(key) {
    window.localStorage.removeItem(key)
  }

  // 清空
  clear() {
    window.localStorage.clear()
  }
}

// 测试代码
const store1 = MyStorage.getInstance()
store1.setState('name', '张三')
store1.setState('age', 24)
store1.setState('sex', '男')
const store2 = MyStorage.getInstance()
store2.getState('name')
```

#### Vuex的单例

```javascript
let Vue
// ...

export function install(_Vue) {
  // 这里就是和我们上面创建单例的思路一样
  // 首先判断是否已经创建过了唯一的 vuex 实例，创建过则直接返回
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  // 若没有，则为这个创建一个唯一的 Vuex
  Vue = _Vue
  // 将 Vuex 的初始化逻辑写进Vue的钩子函数里
  applyMixin(Vue)
}
```
