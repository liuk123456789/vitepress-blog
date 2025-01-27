---
outline: deep
---

###

### 前置准备

可以通过以下方式运行`ts`文件

```bash
npm i typescript -g

tsc --init

# 检测目录中.ts文件的变化
tsc --watch/-w
```

### 原始类型

#### string

表示字符串类型，如：`'kona'`

#### number

表示数值类型，如：10

#### boolean

表示布尔类型，存在两个值：`true`和`false`

### 数组

如存在一个`[1,2,3,4,5,6]`数组，需要用到`number[]`语法，也可以使用`array<number>`，这种泛型语法后面会介绍到

### any

`ts`的一种特殊类型，不希望值进行类型检查时报错时，使用`any`，`tsconfig.json`中`noImplicitAny`设置为`true`时，当类型设置为`any`时，`ts`会抛错

### 变量的类型注解

当使用`const`、`var`、`let`声明一个变量，可以添加一个类型注解，显式指定变量的类型

```typescript
const myName: string = 'Alice'
```

很多时候，`ts`会进行类型推断，所以大部分是不必须的

### 函数

#### 参数类型注解

声明一个函数时，可以在每个参数后面添加一个类型注解，声明函数可以接受什么类型参数。参数类型注解跟在参数名字后面

```typescript
function foo(name: string) {
  return name
}
```

参数进行类型注解后，`ts`会检查函数实参

```typescript
// Would be a runtime error if executed!
foo(42)
// Argument of type 'number' is not assignable to parameter of type 'string'.
```

#### 返回值类型注解

可以添加返回值的类型注解，跟在参数列表后面

```typescript
function bar(): number {
  return 10
}
```

同变量类型注解，不需要总是添加返回值类型注解，`ts`会基于`return `语句推断函数返回类型。

#### 匿名函数

匿名函数不同于函数声明，当`ts`知道一个匿名函数被怎样调用时，参数会被自动指定类型

```typescript
// No type annotations here, but TypeScript can spot the bug
const names = ['Alice', 'Bob', 'Eve']

// Contextual typing for function
names.forEach((s) => {
  console.log(s.toUppercase())
  // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
})

// Contextual typing also applies to arrow functions
names.forEach((s) => {
  console.log(s.toUppercase())
  // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
})
```

尽管参数`s`并未添加类型注解，但`ts`根据`forEach`函数类型，以及传入的数组类型，最后推断出`s`的类型

这个过程称为`上下文推断`

### 对象类型

除了原始类型，最常见类型就是对象类型。

如下：

```typescript
// The parameter's type annotation is an object type
function printCoord(pt: { x: number, y: number }) {
  console.log(`The coordinate's x value is ${pt.x}`)
  console.log(`The coordinate's y value is ${pt.y}`)
}
printCoord({ x: 3, y: 7 })
```

#### 可选属性

对象类型可以指定一些甚至所有的属性为可选，只需在属性名后添加一个`?`

```typescript
function printName(obj: { first: string, last?: string }) {
  // ...
}
// Both OK
printName({ first: 'Bob' })
printName({ first: 'Alice', last: 'Alisson' })
```

在`js`中，获取一个不存在的属性，会得到一个`undefined`而不是一个运行时错误。因此，获取一个可选属性时，需要在使用它前，检查一个是否是`undefined`

```typescript
function printName(obj: { first: string, last?: string }) {
  // Error - might crash if 'obj.last' wasn't provided!
  console.log(obj.last.toUpperCase())
  // Object is possibly 'undefined'.
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase())
  }

  // A safe alternative using modern JavaScript syntax:
  console.log(obj.last?.toUpperCase())
}
```

### 联合类型

#### 定义一个联合类型

联合类型是由两个或者更多类型组成的类型，表示值可能是这些类型中的任意一个

```typescript
function printId(id: number | string) {
  console.log(`Your ID is: ${id}`)
}
// OK
printId(101)
// OK
printId('202')
// Error
printId({ myID: 22342 })
// Argument of type '{ myID: number; }' is not assignable to parameter of type 'string | number'.
// Type '{ myID: number; }' is not assignable to type 'number'.
```

#### 使用联合类型

`ts`要求使用类型时必须让其对每个联合的成员都有效

```typescript
function printId(id: number | string) {
  console.log(id.toUpperCase())
  // Property 'toUpperCase' does not exist on type 'string | number'.
  // Property 'toUpperCase' does not exist on type 'number'.
}
```

解决方案是用代码收窄联合类型，就像你在`js`没有类型注解那样使用。当 `ts`可以根据代码的结构推断出一个更加具体的类型时，类型收窄就会出现。

举个例子，`ts`知道，对一个 `string` 类型的值使用 `typeof` 会返回字符串 `"string"`：

```typescript
function printId(id: number | string) {
  if (typeof id === 'string') {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase())
  }
  else {
    // Here, id is of type 'number'
    console.log(id)
  }
}
```

再举一个例子，使用函数，比如 `Array.isArray`:

```typescript
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // Here: 'x' is 'string[]'
    console.log(`Hello, ${x.join(' and ')}`)
  }
  else {
    // Here: 'x' is 'string'
    console.log(`Welcome lone traveler ${x}`)
  }
}
```

注意在 `else`分支，我们并不需要做任何特殊的事情，如果 `x` 不是 `string[]`，那么它一定是 `string` .

有时候，如果联合类型里的每个成员都有一个属性，举个例子，数组和字符串都有 `slice` 方法，你就可以直接使用这个属性，而不用做类型收窄：

```typescript
// Return type is inferred as number[] | string
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3)
}
```

### 类型别名

所谓类型别名，就是指代任意类型的名字

```typescript
interface PosType {
  x: number
  y: number
}

function foo(pt: PosType) {
  console.log(pt.x)
  console.log(pt.y)
}
foo({ x: 10, y: 10 })
```

注意别名是唯一的别名，不能使用类型别名创建同一个类型的不同版本。当使用类型别名的时候，它就跟编写的类型是一样的。换句话说，代码看起来可能不合法，但对 `ts`依然是合法的，因为两个类型都是同一个类型的别名:

```typescript
type UserInputSanitizedString = string

function sanitizeInput(str: string): UserInputSanitizedString {
  return sanitize(str)
}

// Create a sanitized input
let userInput = sanitizeInput(getInput())

// Can still be re-assigned with a string though
userInput = 'new input'
```

### 接口

接口声明是命名对象类型的一种方式

```typescript
interface Ipos {
  x: number
  y: number
}

function foo(pt: Ipos) {
  console.log(pt.x)
  console.log(pt.y)
}
foo({ x: 10, y: 10 })
```

### 类型别名和接口的不同

类型别名和接口非常类似，大部分时候可以任意使用。接口几乎所有特性可以在`type`中使用，最关键差别在于类型别名本身无法添加新属性，接口可以进行扩展

```typescript
// Interface
// 通过继承扩展类型
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

const bear = getBear()
bear.name
bear.honey

// Type
// 通过交集扩展类型
interface Animal {
  name: string
}

type Bear = Animal & {
  honey: boolean
}

const bear = getBear()
bear.name
bear.honey
```

```typescript
// Interface
// 对一个已经存在的接口添加新的字段
interface Window {
  title: string
}

interface Window {
  ts: TypeScriptAPI
}

const src = 'const a = "Hello World"'
window.ts.transpileModule(src, {})

// Type
// 创建后不能被改变
interface Window {
  title: string
}

interface Window {
  ts: TypeScriptAPI
}

// Error: Duplicate identifier 'Window'.
```

### 类型断言

有些使用，使用者自己知道值的类型，但是`ts`不知道，这时，可以通过类型断言将其指定为一个更具体类型

```typescript
const myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement
```

就像类型注解一样，类型断言会被编译器移除，并且不会影响任何运行时行为

:::warning 因为类型断言会在编译时移除，所以运行时不会有类型断言的检查，即使类型断言是错误的，也不会有异常或者`null`的产生

:::

`ts`仅仅允许类型断言转换为一个更加具体或者不具体类型。这个规则可以阻止不可能的类型转换

```typescript
const x = 'hello' as number
// Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
```

有的时候，这条规则会显得非常保守，阻止了你原本有效的类型转换。如果发生了这种事情，你可以使用双重断言，先断言为 `any` （或者是 `unknown`），然后再断言为期望的类型：

```typescript
const a = (expr as any) as T
```

### 字面量类型

除了常见的`string`和`number`，也可以将类型声明为更具体的数字或者字符串

众所周知，在 JavaScript 中，有多种方式可以声明变量。比如 `var` 和 `let` ，这种方式声明的变量后续可以被修改，还有 `const` ，这种方式声明的变量则不能被修改，这就会影响 `ts`为字面量创建类型。

```typescript
let changingString = 'Hello World'
changingString = 'Olá Mundo'
// Because `changingString` can represent any possible string, that
// is how TypeScript describes it in the type system
changingString
// let changingString: string
```

```typescript
const constantString = 'Hello World'
// Because `constantString` can only represent 1 possible string, it
// has a literal type representation
constantString
// const constantString: "Hello World"
```

字面量类型看起来好像没什么用，但是结合联合类型，就显得有用多了

```typescript
function printText(s: string, alignment: 'left' | 'right' | 'center') {
  // ...
}
printText('Hello, world', 'left')
printText('G\'day, mate', 'centre')
// Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
```

数字字面量类型也是一样的：

```typescript
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1
}
```

和非字面量类型联合

```typescript
interface Options {
  width: number
}
function configure(x: Options | 'auto') {
  // ...
}
configure({ width: 100 })
configure('auto')
configure('automatic')

// Argument of type '"automatic"' is not assignable to parameter of type 'Options | "auto"'.
```

还有一种字面量类型，布尔字面量。因为只有两种布尔字面量类型， `true` 和 `false` ，类型 `boolean` 实际上就是联合类型 `true | false` 的别名。

### 字面量推断

当你初始化变量为一个对象的时候，`ts`会假设这个对象的属性的值未来会被修改，举个例子，如果你写下这样的代码：

```typescript
const obj = { counter: 0 }
if (someCondition) {
  obj.counter = 1
}
```

`ts`并不会认为 `obj.counter` 之前是 `0`， 现在被赋值为 `1` 是一个错误。换句话说，`obj.counter` 必须是 `string` 类型，但不要求一定是 `0`，因为类型可以决定读写行为。

这也同样应用于字符串:

```typescript
declare function handleRequest(url: string, method: 'GET' | 'POST'): void

const req = { url: 'https://example.com', method: 'GET' }
handleRequest(req.url, req.method)

// Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
```

在上面这个例子里，`req.method` 被推断为 `string` ，而不是 `"GET"`，因为在创建 `req` 和 调用 `handleRequest` 函数之间，可能还有其他的代码，或许会将 `req.method` 赋值一个新字符串比如 `"Guess"` 。所以 `ts`就报错了。

两种方式解决

1. 添加类型断言改变推断结果

   ```typescript
   // Change 1:
   const req = { url: 'https://example.com', method: 'GET' as const }
   // Change 2
   handleRequest(req.url, req.method as 'GET')
   ```

   修改 1 表示“我有意让 `req.method` 的类型为字面量类型 `"GET"`，这会阻止未来可能赋值为 `"GUESS"` 等字段”。修改 2 表示“我知道 `req.method` 的值是 `"GET"`”.

2. 可以使用`as const`把整个对象转为一个类型字面量

   ```typescript
   const req = { url: 'https://example.com', method: 'GET' } as const
   handleRequest(req.url, req.method)
   ```

   `as const` 效果跟 `const` 类似，但是对类型系统而言，它可以确保所有的属性都被赋予一个字面量类型，而不是一个更通用的类型比如 `string` 或者 `number` 。

### null和undefined

`js`有两个原始类型的值，用于表示空缺或者未初始化，他们分别是 `null` 和 `undefined` 。

`ts`有两个对应的同名类型。它们的行为取决于是否打开了 [strictNullChecks](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23strictNullChecks) 选项。

### `strictNullChecks` 关闭

当 [strictNullChecks](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23strictNullChecks) 选项关闭的时候，如果一个值可能是 `null` 或者 `undefined`，它依然可以被正确的访问，或者被赋值给任意类型的属性。这有点类似于没有空值检查的语言 (比如 C# ，Java) 。这些检查的缺少，是导致 bug 的主要源头，所以我们始终推荐开发者开启 [strictNullChecks](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23strictNullChecks) 选项。

### `strictNullChecks` 打开

当 [strictNullChecks](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23strictNullChecks) 选项打开的时候，如果一个值可能是 `null` 或者 `undefined`，你需要在用它的方法或者属性之前，先检查这些值，就像用可选的属性之前，先检查一下 是否是 `undefined` ，我们也可以使用类型收窄（`narrowing`）检查值是否是 `null`：

```typescript
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  }
  else {
    console.log(`Hello, ${x.toUpperCase()}`)
  }
}
```

## 非空断言操作符

`ts`提供了一个特殊的语法，可以在不做任何检查的情况下，从类型中移除 `null` 和 `undefined`，这就是在任意表达式后面写上 `!`  ，这是一个有效的类型断言，表示它的值不可能是 `null` 或者 `undefined`：

```typescript
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed())
}
```

就像其他的类型断言，这也不会更改任何运行时的行为。重要的事情说一遍，只有当你明确的知道这个值不可能是 `null` 或者 `undefined` 时才使用 `!` 。

## 枚举

枚举是 `ts`添加的新特性，用于描述一个值可能是多个常量中的一个。不同于大部分的 `ts`特性，这并不是一个类型层面的增量，而是会添加到语言和运行时。因为如此，你应该了解下这个特性。但是可以等一等再用，除非你确定要使用它。你可以在[枚举类型](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2Fenums.html)页面了解更多的信息。

## 不常见的原始类型（Less Common Primitives）

我们提一下在 JavaScript 中剩余的一些原始类型。但是我们并不会深入讲解。

### bigInt

ES2020 引入原始类型 `BigInt`，用于表示非常大的整数：

```typescript
// Creating a bigint via the BigInt function
const oneHundred: bigint = BigInt(100)

// Creating a BigInt via the literal syntax
const anotherHundred: bigint = 100n
```

你可以在 [TypeScript 3.2 的发布日志](the TypeScript 3.2 release notes)中了解更多信息。

### symbol

这也是 JavaScript 中的一个原始类型，通过函数 `Symbol()`，我们可以创建一个全局唯一的引用：

```typescript
const firstName = Symbol('name')
const secondName = Symbol('name')

if (firstName === secondName) {
  // This condition will always return 'false' since the types 'typeof firstName' and 'typeof secondName' have no overlap.
  // Can't ever happen
}
```
