---
outline: deep
---

:::warning 参考来源：你不知道的JavaScript

:::

### 前言

### 1、什么是this

:::info 当一个函数被调用时，会创建一个活动记录（也成为`执行上下文`）。这个记录包含了函数在哪里被调用（`调用栈`）、函数的调用方法、传入的参数等信息。`this`就是记录的其中一个属性，会在函数执行过程中使用到

:::

### 2、this的使用

#### 2.1 调用位置

调用位置是函数在代码中被调用的位置（非声明位置），但某些编程模式会隐藏函数真正的调用位置，所以我们还需要分析调用栈（到达当前执行位置所调用的所有函数），调用位置就在当前正在执行的函数的`前一个调用`中，如下例子

```javascript
function baz() {
  // 当前调用栈：baz
  // 因此，当前调用位置是全局作用域

  console.log('baz')
  bar() // <-- bar的调用位置
}

function bar() {
  // 当前调用栈 baz -> bar
  // 因此当前调用位置在baz中
  console.log('bar')
  foo() // <-- foo的调用位置
}

function foo() {
  // 当前调用栈 baz -> bar -> foo
  // 因此当前调用位置在bar中
  console.log('foo')
}

baz() // <-- baz的调用位置
```

#### 2.2 绑定规则

1. **默认绑定**

   ```javascript
   function foo() {
     console.log(this.a)
   }
   
   lconst a = 2
   foo() // 2
   ```

   `foo`被调用时，`this.a`被解析成了全局变量`a`，因为在`this`指向了全局对象，因为`foo`是不带任何修饰符的函数进行调用，特别说的一点就是如果使用严格模式（`use strict`），那么`this`指向`undefined`

2. **隐式绑定**

   ```javascript
   function foo() {
     console.log(this.a)
   }
   
   lconst obj = {
     a: 2,
     foo: foo
   }
   obj.foo()
   ```

   首先需要注意的是` foo() `的声明方式，及其之后是如何被当作引用属性添加到` obj `中的。 但是无论是直接在` obj` 中定义还是先定义再添加为引用属性，这个函数严格来说都不属于 `obj `对象

   然而，调用位置会使用 `obj `上下文来引用函数，因此你可以说函数被调用时 `obj `对象“拥 有”或者“包含”它

   无论你如何称呼这个模式，当 `foo() `被调用时，它的落脚点确实指向 `obj` 对象。当函数引 用有上下文对象时，隐式绑定规则会把函数调用中的` this` 绑定到这个上下文对象。因为调 用 foo() 时 this 被绑定到 `obj`，因此 `this.a` 和 `obj.a` 是一样的

   :::info 关于执行上下文可以看下[这篇文章](https://juejin.cn/post/6844903474027560968)

   :::

   特别注意的是：对象属性引用链中只有最顶层或者说最后一层会影响调用位置

   ```javascript
   function foo() {
     console.log(this.a)
   }
   
   lconst obj2 = {
     a: 42,
     foo: foo
   }
   
   leconst obj1 = {
     a: 2,
     obj2: obj2
   }
   obj1.obj2.foo() // 42 因为obj2是最后调用foo的
   ```

   **隐式丢失**

   ```javascript
   function foo() {
     console.log(this.a)
   }
   
   lconst obj = {
     a: 2,
     foo: foo
   }
   
   leconst bar = obj.foo
   letconst a = 'oops, global'bar() // 'oops, global'
   ```

   虽然`bar`是`obj.foo`的一个引用，但是实际上，它引用的是 `foo` 函数本身，因此此时的` bar()` 其实是一个不带任何修饰的函数调用，因此应用了`默认绑定`

   一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时

   ```javascript
   function foo() {
     console.log(this.a)
   }
   function doFoo(fn) {
     // fn 其实引用的是 foo
     fn() // <-- 调用位置！
   }
   const obj = {
     a: 2,
     foo
   }
   const a = 'oops, global' // a 是全局对象的属性
   doFoo(obj.foo) // "oops, global"
   ```

   参数传递其实就是一种隐式赋值，因此我们传入函数时也会被隐式赋值

3. **显示绑定**

   ```javascript
   function foo() {
     console.log(this.a)
   }
   
   lconst obj = {
     a: 2
   }
   
   foo.call(obj)
   ```

   通过 `foo.call(..)`，我们可以在调用` foo` 时强制把它的 `this` 绑定到 `obj` 上。 如果你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作 `this` 的绑定对 象，这个原始值会被转换成它的对象形式（也就是 `new String(..)`、`new Boolean(..)` 或者 `new Number(..)`）。这通常被称为`装箱`

   :::info 然而`显示绑定`依然无法解决绑定丢失问题

   :::

   ```javascript
   function fn() {
     console.log(this.a)
   }
   const obj = {
     a: 1,
     fn
   }
   const bar = obj.fn
   bar() // undefined
   bar.call(obj) // 1
   ```

   为了解决此问题，所以便有了`硬绑定`

   **1. 硬绑定**

   ```javascript
   function foo() {
     console.log(this.a)
   }
   
    const obj = {
     a: 2
   }
   
   const bar = function () {
     foo.call(obj))
   }
   
   bar() // 2
   setTimeout(bar, 100) // 2
   // 硬绑定的 bar 不可能再修改它的 this
   bar.call(window)// 2
   ```

   创建了函数 `bar()`，并在它的内部手动调用 了 `foo.call(obj)`，因此强制把` foo` 的 `this` 绑定到了` obj`。无论之后如何调用函数 `bar`，它 总会手动在 `obj` 上调用 `foo`。这种绑定是一种显式的强制绑定，因此我们称之为`硬绑定`

4. **new绑定**

   在面向对象的语言中，`new`操作符通常用于实例化类，而`js`中`new`操作的调用的可能就是一个普通函数，使用`new`调用函数，会自动执行以下操作

   1. 创建一个全新的对象
   2. 对象的`__proto__`连接到构造函数的原型对象上
   3. 新对象绑定到函数调用的`this`
   4. 如果函数没有返回其他对象，那么返回这个新创建的对象

   ```javascript
   function creteNew(constructor. ...args) {
       const instance = Object.create(constructor.prototype)
       const result = constructor.apply(instance,args)
       return typeof result === 'object' && result !== null ? result : instance
   }
   ```

   

#### 2.3 优先级

首先`默认规则`是其他几个不匹配是才会考虑，所以优先级最低。

1. 比较`隐式绑定`和`显式绑定`的优先级

   ```javascript
   function foo() {
       console.log(this.a)
   }
   
   var obj1 = {
       a: 2,
       foo: foo
   }
   
   var obj2 = {
       a: 3,
       foo: foo
   }
   
   obj1.foo() // 2
   obj2.foo() // 3
   
   obj1.foo.call(obj2) // 3 this指向obj2 非obj1
   obj2.foo.call(obj1) // 2 this指向obj1 非obj2
   ```

   可以看出`显示绑定`的优先级高于`隐式绑定`

2. 比较`new绑定`和`隐式绑定`的优先级

   ```javascript
   function foo(something) {
       this.a = something
   }
   
   var obj1 = {
       foo: foo
   }
   
   var obj2 = {}
   
   obj1.foo(2)
   console.log(obj1.a) // 2
   
   obj1.foo.call(obj2, 3)
   console.log(obj2.a) // 3
   
   var bar = new obj1.foo(4) // 因为这里this绑定到bar 而非obj1上
   console.log(obj1.a) // 2
   console.log(bar.a) // 4
   ```

   `new`绑定的优先级高于`隐式绑定`

3. 比较`显示绑定`和`new 绑定`优先级



#### 2.4 绑定例外

#### 2.5 this词法
