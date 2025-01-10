---
outline: deep
---

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
Foo.prototype.propA = 'p1'
o1.propA // 'p1'
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
function Foo() {}
const o1 = new Foo()
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

![proto](/public/proto.png)

1. `o1`的数据类型为对象，拥有独有属性`__proto__`，由于`prototype`是函数独有属性，所以`o1`的`prototype`是`undefined`
2. `Foo`的数据类型既是函数也是对象，所以同时拥有`prototype`和`__proto__`
3. `Function`的数据类型既是函数也是对象，所以同时拥有`prototype`和`__proto__`



#### （三）、隐式原型引用关系
