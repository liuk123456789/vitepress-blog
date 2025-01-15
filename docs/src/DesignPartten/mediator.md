---
outline: deep
---

:::warning 参考：《JavaScript设计模式与开发实践》
:::

### 概念说明

:::info 中介者模式的作用就是解除对象与对象之间的紧耦合关系。增加一个中介者对象后，所有的相关对象都通过中介者对象进行通信，而不是互相引用，所以当一个对象发生改变时，只需要通知中介者对象即可。中介者使各对象之间耦合松散，而且可以独立地改变它们之间的交互。中介者模式使网状的多对多关系变成了相对简单的一对多关系

:::

### 现实中的中介者

**机场指挥塔**

:::info 中介者也被称为调停者，我们想象一下机场的指挥塔，如果没有指挥塔的存在，每一架飞机要和方圆 100 公里内的所有飞机通信，才能确定航线以及飞行状况，后果是不可想象的。现实中的情况是，每架飞机都只需要和指挥塔通信。指挥塔作为调停者，知道每一架飞机的飞行状况，所以它可以安排所有飞机的起降时间，及时做出航线调整。

:::

**菠菜公司**

:::info 打麻将的人经常遇到这样的问题，打了几局之后开始计算钱，A 自摸了两把，B 杠了三次，C 点炮一次给 D，谁应该给谁多少钱已经很难计算清楚，而这还是在只有 4 个人参与的情况下。在世界杯期间购买足球彩票，如果没有博彩公司作为中介，上千万的人一起计算赔率和输赢绝对是不可能实现的事情。有了博彩公司作为中介，每个人只需和博彩公司发生关联，博彩公司会根据所有人的投注情况计算好赔率，彩民们赢了钱就从博彩公司拿，输了钱就交给博彩公司。

:::

### 实际开发中的应用

:::info 中介者模式和发布订阅模式感觉非常类似，子组件之前通过父组件通信其实也是一种中介者模式

这里就给出一个使用中介者模式实现的简单示例，其中包含了三个组件：用户组件、订单组件和库存组件。

```javascript
class Mediator {
    constructor() {
        this.components = {};
    }

    registerComponent(name, component) {
        this.components[name] = component;
    }

    notify(componentName, event, data) {
        if (this.components[componentName] && this.components[componentName][event]) {
            this.components[componentName][event](data);
        }
    }
}
```

接下来，我们定义三个组件类，每个类都有一个方法用于处理来自中介者的通知：

```javascript
class UserComponent {
    constructor(mediator) {
        this.mediator = mediator;
        this.mediator.registerComponent('user', this);
    }

    userLoggedIn(data) {
        console.log('User logged in:', data);
        // 通知其他组件用户已登录
        this.mediator.notify('order', 'onUserLoggedIn', data);
        this.mediator.notify('inventory', 'onUserLoggedIn', data);
    }
}

class OrderComponent {
    constructor(mediator) {
        this.mediator = mediator;
        this.mediator.registerComponent('order', this);
    }

    onUserLoggedIn(data) {
        console.log('Order component received user login:', data);
        // 这里可以执行订单相关的逻辑
    }
}

class InventoryComponent {
    constructor(mediator) {
        this.mediator = mediator;
        this.mediator.registerComponent('inventory', this);
    }

    onUserLoggedIn(data) {
        console.log('Inventory component received user login:', data);
        // 这里可以执行库存相关的逻辑
    }
}
```

最后，我们创建一个中介者实例，并使用它来初始化组件和触发事件:

```javascript
const mediator = new Mediator();

const userComponent = new UserComponent(mediator);
const orderComponent = new OrderComponent(mediator);
const inventoryComponent = new InventoryComponent(mediator);

// 模拟用户登录事件
userComponent.userLoggedIn({ userId: 123, username: 'john_doe' });

```

