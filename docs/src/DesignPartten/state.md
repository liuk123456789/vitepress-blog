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
    nextState(state) {
        throw new Error('Function next is not implement')
    }
}
```

**定义几种状态类**

```typescript
// 扫描中
class ScaningState extends BaseState {
    constructor() {
        super('扫描中')
    }
    nextState(instance) {
        instance.setState(new UploadingState())
    }
}

// 上传中
class UploadingState extends BaseState {
    constructor() {
        super('上传中')
    }
    nextState(instance) {
        instance.setState(new DoneState())
    }
}

//上传完成
class DoneState extends BaseState {
    constructor() {
        super('上传完成')
    }
    nextState() {
        
    }
}

// 上传失败
class ErrorState extends BaseState {
    constructor() {
        super('上传失败')
    }
    nextState() {
        
    }
}

// 暂停上传
class PauseState extends BaseState {
    constructor() {
        super('暂停上传')
    }
    nextState() {
        
    }
}
```

### 实发开发应用