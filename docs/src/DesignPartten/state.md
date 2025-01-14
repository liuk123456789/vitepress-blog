---
outline: deep
---

:::warning 参考：《JavaScript设计模式与开发实践》

:::

### 概念说明

:::info 状态模式定义一个对象，这个对象可以通过管理其状态从而使得应用程序做出相应的变化。状态模式是一个非常常用的设计模式，

它主要有两个角色组成：

- 环境类：拥有一个状态成员，可以修改其状态并做出相应的反应
- 状态类：表示一种状态，包含其对应的处理方式

:::

### 应用场景

:::info 案例取自`JavaScript设计模式与开发实践`

:::

文件上传程序中有扫描、正在上传、暂停、上传成功、上传失败集中状态，音乐播放器也可以分为加载中、正在播放、暂停、播放完毕这几种状态。点击同一个按钮，在上传中和暂停状态下的行为表现是一样的，同时它们的样式`class`不同

- 文件扫描状态，是不能进行任何操作的，既不能暂停也不能删除文件，只能等待扫描完成。扫描完成后，根据文件的`md5`值判断，若文件存在服务器，那么直接跳到文件上传完成状态。如果文件超过允许上传的最大值，或者文件损坏，跳文件上传失败状态
- 上传过程中可以点击暂停上传，暂停后点击同一个按钮会继续上传
- 扫描和上传过程中，点击删除按钮无效，只要在暂停、上传完成、上传失败之后，才能删除文件

**定义状态的基类**

```typescript
class BaseState {
  constructor(name) {
    this.name = name
  }

  handleAction(instance) {
    throw new Error('Function handleAction is not implement')
  }
}
```

**定义几种状态类**

```typescript
// 等待上传
class PendingState extends BaseState {
  constructor() {
    super('上传')
  }

  handleAction(context) {
    context.setSate(new ScaningState())
  }
}

// 扫描中
class ScaningState extends BaseState {
  constructor() {
    super('扫描中')
  }

  handleAction(context) {
    context.setState(new UploadingState())
  }
}

// 上传中
class UploadingState extends BaseState {
  constructor() {
    super('上传中')
  }

  handleAction(context) {
    context.setState(new DoneState())
  }
}

// 上传完成
class DoneState extends BaseState {
  constructor() {
    super('上传完成')
  }

  handleAction(context) {
    context.setState()
  }
}

// 上传失败
class ErrorState extends BaseState {
  constructor() {
    super('上传失败')
  }

  handleAction(context) {
    context.setState()
  }
}

// 暂停上传
class PauseState extends BaseState {
  constructor() {
    super('暂停上传')
  }

  handleAction(context) {
    context.setState(new UploadingState())
  }
}
```

**上下文对象Context**

```typescript
class Context {
  constructor() {
    // 设置初始状态 这里默认待上传
    this.stateInstance = new PendingState()
  }

  setState(stateInstance) {
    this.stateInstance = stateInstance || new PendingState()
  }

  request() {
    this.stateInstance.handleAction.apply(this)
  }
}
```

**使用**

```typescript
const context = new Context()
// 点击上传 进入扫描中
context.request()
// 上传中
context.request()
// 点击暂停按钮触发中断上传
context.setState(new PauseState())
// 点击继续上传
context.request()
// 上传失败
context.setState(new ErrorState())
// 重新上传
context.setState(new UploadingState())
// 上传成功
context.request()
```

### 实际开发应用

**订单状态**

在实际应用场景中，订单可能存在以下几种状态

1. 待支付
2. 取消支付
3. 已支付
4. 待发货
5. 发货中
6. 已完成

```typescript
// 抽象状态类
class OrderState {
  next(order) {}
}

// 待支付
class PendingPaymentState extends OrderState {
  next(order) {
    order.setState(new PaidState())
  }
}
// 取消支付
class CancelPaymentState extends OrderState {
  next(order) {
    console.log('用户已取消支付')
  }
}

// 已支付
class PaidState extends OrderState {
  next(order) {
    order.setState(new ShippingState())
  }
}

// 发货中
class ShippingState extends OrderState {
  next(order) {
    order.setState(new CompletedState())
  }
}

// 已完成
class CompletedState extends OrderState {
  next(order) {
    console.log('Order has been completed.')
  }
}

// 上下文类
class Order {
  constructor() {
    this.state = new PendingPaymentState()
  }

  setState(state) {
    this.state = state
  }

  nextStep() {
    this.state.next(this)
  }
}
```

**使用**

```typescript
const order = new Order()
order.nextStep()
order.nextStep()
order.nextStep()
```

