---
outline: deep
---

:::warning 参考：《JavaScript设计模式与开发实践》
:::

### 概念说明

:::info 发布—订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。在 JavaScript 开发中，我们一般用事件模型来替代传统的发布—订阅模式。

:::

### 通用版本

完成发布订阅模式，需要考虑一下几点

1. `Publisher`：发布者，消息发生时负责通知订阅者
2. `Subscriber`：订阅者，当消息发生时被通知的对象
3. `SubscriberMap`：持有不同`type`的数组，存储所有的订阅者的数组
4. `type`：消息类型，订阅者可以订阅不同的消息类型
5. `subscribe`：该方法为`SubscribeMap`中删除订阅者
6. `unSubscribe`：该方法为`SubscribeMap`中删除订阅者
7. `notify`：该方法遍历通知`SubscribeMap`中对应`type`的每个订阅者

```javascript
class EventEmitter {
  constructor() {
    // 订阅者
    this.subscriber = {}
  }

  // 单例
  static get instance() {
    if (!this.instance) {
      this.instance = new EventEmitter()
    }
    return this.instance
  }

  // 订阅方法
  subscribe(key, fn) {
    if (!this.subscriber[key]) {
      this.subscriber[key] = {}
    }
    this.subscriber[key].push(fn) // 订阅消息添加进缓存列表
  }

  // 通知订阅者
  notify(args) {
    const key = args.shift()
    const fns = this.subscriber[key]
    if (!fns || !fns.length) {
      console.log('fns is null or non array!')
      return false
    }
    for (const fn of fns) {
      // 绑定this
      fn.apply(this, args)
    }
  }

  // 解绑订阅者
  unsubscribe(key, fn) {
    const fns = this.subscriber[key]
    if (!fns) { // 如果key对应的消息没有被人订阅，则直接返回
      return false
    }

    if (!fn) { // 如果没有传入fn,那么就是取消key的所有订阅
      fns && (fns.length = 0)
    }
    else {
      const idx = fns.findIndex(_fn => _fn === fn)
      if (idx !== -1)
        fns.splice(idx, 1)
    }
  }
}
```

**使用**

```javascript
const eventEmitInstance = EventEmitter.instance
eventEmitInstance.subscribe('key', fn)
```

**使用命名空间**

```javascript
class EventEmitter {
  static instance = null
  static nameSpaceCache = {}
  static nameSpace = '_default'

  /* 省略部分代码 */

  // 创建命名空间
  static create(namespace) {
    namespace = namespace || this.namespace
    this.nameSpaceCache[namespace] = this.nameSpaceCache[namespace] || this.instance
    return this.nameSpaceCache[namespace]
  }
}
```

**修改使用**

```javascript
EventEmitter.create('namespace1').subscribe('key', fn)
```

### 实际项目中的应用

一、在`uniapp`生成的小程序，订单详情页进行数据的改动，导致订单状态发生变更，而在订单列表是在`onLoad`进行接口请求。那么有两种方法解决列表订单状态和详情页不同步的问题

1. `onShow`进行接口请求
2. 使用`uni.$on`和`uni.$emit`

这里说说第二种，因为它就是属于发布订阅模式，伪代码如下

**订单列表页**

```vue
<script>
export default {
  onLoad() {
    // 相当于
    uni.$on('updateStatus', () => {
      /* doSomething */
    })
  },

  onUnload() {
    // 移除监听器
    uni.$off('updateStatus')
  }
}
</script>
```

**订单详情页**

```vue
<script>
export default {
  methods: {
    // 取消订单
    onCancelOrder() {
      // notify 订阅者
      uni.$emit('updateStatus')
    }
  }
}
</script>
```

二、`vue`项目中使用`vuex`也是一种常见的发布订阅模式

```javascript
export class Store {
  constructor() {
    this._actions = Object.create(null)
    // action订阅者
    this._actionSubscribers = []
    // 订阅者
    this._subscriblers = []
  }

  // 订阅方法
  subscribe(fn, options) {
    return genericSubscribe(fn, this._subscribers, options)
  }

  subscribeAction(fn, options) {
    const subs = typeof fn === 'function' ? { before: fn } : fn
    return genericSubscribe(subs, this._actionSubscribers, options)
  }

  // publisher notfiy
  commit(_type, _payload, _options) {
    // notify
    this._subscribers
      .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
      .forEach(sub => sub(mutation, this.state))
  }

  dispatch(_type, _payload) {
    try {
      // action 分发之前执行
      this._actionSubscribers
        .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
        .filter(sub => sub.before)
        .forEach(sub => sub.before(action, this.state))
    }
    catch (e) {
      if (__DEV__) {
        console.warn(`[vuex] error in before action subscribers: `)
        console.error(e)
      }
    }

    const result = entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)

    return new Promise((resolve, reject) => {
      result.then((res) => {
        try {
          // action 分发之后执行
          this._actionSubscribers
            .filter(sub => sub.after)
            .forEach(sub => sub.after(action, this.state))
        }
        catch (e) {
          if (__DEV__) {
            console.warn(`[vuex] error in after action subscribers: `)
            console.error(e)
          }
        }
        resolve(res)
      }, (error) => {
        try {
          this._actionSubscribers
            .filter(sub => sub.error)
            .forEach(sub => sub.error(action, this.state, error))
        }
        catch (e) {
          if (__DEV__) {
            console.warn(`[vuex] error in error action subscribers: `)
            console.error(e)
          }
        }
        reject(error)
      })
    })
  }
}
```
