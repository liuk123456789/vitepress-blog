---
outline: deep
---

:::danger  [本文引用地址](https://mp.weixin.qq.com/s/909OhmzcNxXMmRdL5bDf_A)

如果侵权，请告知删除

:::

### 前言

### 什么是原型链

::: info 每个对象（Object）都有一个私有属性指向另一个名为**原型**（prototype）的对象。原型对象也有一个自己的原型，层层向上直到一个对象的原型为 `null`。根据定义，`null` 没有原型，并作为这个**原型链**（prototype chain）中的最后一个环节。

摘自：MDN - 继承与原型链
:::

### 一、名词说明

了解原型链，首先得介绍两个名词`prototype`和`__proto__`，例子如下

定义一个函数`Foo`，而后创建一个`Foo`的实例对象`o1`

```javascript
function Foo() {}

const o1 = new Foo()
```

#### （一）、 原型对象

:::info 所有的函数都是对象，拥有独有属性`prototype`

:::

`prototype`原型对象，是函数的独有属性。该属性指向一个对象。当函数（如：`Foo`）被实例化成一个对象（如：`o1`）后，实例对象（`o1`）可以访问到函数（`Foo`）的原型对象（`prototype`）

如：在`Foo`的`prototype`上增加属性`propA`，其值为`'p1'`，可以发现在`o1`上也可以获取到属性`propA`，其值同样为`'p1'`

```javascript
Foo.prototype.propA = 'p1'
o1.propA// 'p1'
```

那么`o1`是如何获取到`Foo.prototype`上的方法的呢，这就要介绍另一个概念，隐式原型`__proto__`

#### （二）、隐式原型（`__proto__`）

:::info 所有非内置对象都是函数的实例，拥有独有属性`__proto__`

:::

```tex
内置对象如下

Object、Function、Array、String、Number、Boolean、Date、RegExp、Math、Json等
```

`__proto__`隐式原型，是对象的独有属性，对象（如：`o1`）的`__proto__`属性指向其构造函数（如：`Foo`）的原型对象（`prototype`）。所有非内置对象都是函数的实例，同时拥有一个构造函数。如：对象`o1`的构造函数为`Foo`

如：`o1`上访问到的属性`propA`实际上是其构造函数`Foo`的`prototype`的属性`propA`。这里将`Foo.prototype.propA`设置为一个对象，来防止因基本类型的值比较方式导致结论误差

```javascript
o1.constructor === Foo // true

Foo.prototype.propA = {}
o1.propA

o1.propA === o1.__proto__.propA // true
o1.__proto__.propA === Foo.prototype.propA // true
```

### 二、原型链

还是沿用之前使用的例子来进行原型链的介绍

```javascript
function Foo() {}
const o1 = new Foo()
```

#### （一）、实例化关系

首先分析下实例化关系。

```javascript
o1.constructor === Foo // true
Foo.constructor === Function // true
Function.constructor === Function // true
```

1. `o1`是对象，是由`Foo`构造，是`Foo`的实例
2. `Foo`既是函数也是对象，是由`Function`构造，是`Function`的实例
3. `Function`既是函数也是对象，是由`Function`构造，是`Function`的实例

#### （二）、独有属性分析

在实例化基础上，继续分析每一级的属性关系。其中绿色代表函数独有属性，红色代表对象独有属性

![proto](/proto.png)

1. `o1`的数据类型为对象，拥有独有属性`__proto__`，由于`prototype`是函数独有属性，所以`o1`的`prototype`是`undefined`
2. `Foo`的数据类型既是函数也是对象，所以同时拥有`prototype`和`__proto__`
3. `Function`的数据类型既是函数也是对象，所以同时拥有`prototype`和`__proto__`

#### （三）、隐式原型引用关系

:::info 对象的隐式原型（`__proto__`）属性指向其构造函数（`constructor`）的原型对象（`prototype`）
:::

![proto_two](/proto_two.png)

1. `o1.__proto__`指向`Foo.prototype`，因为`o1.constructor === Foo `
2. `Foo.__proto__`指向`Function.prototype`，因为`Foo.constructor === Function`
3. `Function.__proto__`指向`Function.prototype`，因为`Function.constructor === Function`

由于函数的原型对象( `prototype` )属性的数据类型为对象，因此同样具有对象的独有属性`__proto__`。如下图

![proto_three](/proto_three.png)

默认情况下，对象隐式原型( `__proto__` )指向其构造函数的原型对象( `prototype` )，那么`Foo.prototype`和`Function.prototype`的构造函数又指向哪里呢？

:::info 所有函数的原型对象（`prototype`）的构造函数均指向其自身

:::

通过测试代码进行验证

```javascript
Foo.prototype.constructor === Foo // true
Function.prototype.constructor === Function // true
```

内置函数对象的原型对象( `prototype` )，其隐式原型( `__proto__` )也指向其自身

```javascript
RegExp.prototype.constructor === RegExp // true
Date.prototype.constructor === Date // true
Map.prototype.constructor === Map // true
Array.prototype.constructor === Array // true
Number.prototype.constructor === Number // true
Object.prototype.constructor === Object // true
```

然而一些内置对象由于其没有函数特征，所以其原型对象( `prototype` )属性为`undefined`，其自身的`constructor`指向`Object`。

```javascript
Math.prototype // undefined
Math.constructor === Object // true

JSON.prototype // undefined
JSON.constructor === Object // true
```

由于`所有函数`的`原型对象( `prototype` )`的`构造函数`均为其自身，则如若`Foo.prototype.__proto__`指向其`构造函数`的`prototype`，即`Foo.prototype.__proto__`指向`Foo.prototype`。那么原型链的查找将进入无限循环。为了避免这个问题，则将所有函数原型对象( `prototype` )的隐式原型(`__proto__`)均指向`Object.prototype`。

![proto_four](/proto_four.png)

测试代码

```javascript
Foo.prototype.__proto__ === Object.prototype // true
Function.prototype.__proto__ === Object.prototype // true
```

那么问题来了

1. `Object`既是`函数`也是对象，那么它的`__proto__`指向哪里呢？
2. `Object.prototype`类型是一个对象，如果其`__proto__`指向`Object.prototype`，那么原型链查找进入了无限循环，它最终指向哪里呢？

![proto_five](/proto_five.png)

针对第1点，`Object`自身既是函数又是对象，其作为对象的独有属性隐式原型( **__proto__** )应指向其构造函数的原型对象( prototype )。Object对象的构造函数为Function，所以其隐式原型( **__proto__** )指向`Function.prototype`

测试代码

```javascript
Object.constructor === Function // true
Object.__proto__ === Function.prototype // true
```

![proto_six](/proto_six.png)

针对第2点，它最终指向`null`

![proto_seven](/proto_seven.png)



### 三、总结

对象通过隐式原型( `__proto__` )属性指向其构造函数的原型对象( `prototype` )，进而通过原型对象( `prototype` )的隐式原型( `__proto__` )属性指向更高层级的原型对象( `prototype` )，最终指向`null`而停止所形成的链条，则称其为**原型链**。
