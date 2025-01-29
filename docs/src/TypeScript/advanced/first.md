---
outline: deep
---
### 类型收窄

试想我们有这样一个函数，函数名为` padLeft`：

```typescript
function padLeft(padding: number | string, input: string): string {
  throw new Error('Not implemented yet!')
}
```

该函数实现的功能是：

如果参数 `padding` 是一个数字，我们就在 `input` 前面添加同等数量的空格，而如果 `padding` 是一个字符串，我们就直接添加到 `input` 前面。

让我们实现一下这个逻辑：

```typescript
function padLeft(padding: number | string, input: string) {
  return new Array(padding + 1).join(' ') + input
  // Operator '+' cannot be applied to types 'string | number' and 'number'.
}
```

如果这样写的话，编辑器里 `padding + 1` 这个地方就会标红，显示一个错误。

这是`ts`在警告我们，如果把一个 `number` 类型 (即例子里的数字 1 )和一个 `number | string` 类型相加，也许并不会达到我们想要的结果。换句话说，我们应该先检查下 `padding` 是否是一个 `number`，或者处理下当 `padding` 是 `string` 的情况，那我们可以这样做：

```typescript
function padLeft(padding: number | string, input: string) {
  if (typeof padding === 'number') {
    return new Array(padding + 1).join(' ') + input
  }
  return padding + input
}
```

这个代码看上去也许没有什么有意思的地方，但实际上，`ts`在背后做了很多东西。

`ts`要学着分析这些使用了静态类型的值在运行时的具体类型。目前 `ts`已经实现了比如 `if/else` 、三元运算符、循环、真值检查等情况下的类型分析。

在我们的 `if` 语句中，`ts`会认为 `typeof padding === number` 是一种特殊形式的代码，我们称之为**类型保护 (type guard)**，`ts`会沿着执行时可能的路径，分析值在给定的位置上最具体的类型。

`ts`的类型检查器会考虑到这些类型保护和赋值语句，而这个**将类型推导为更精确类型的过程，我们称之为收窄 (narrowing)**

#### 真值收窄

在 JavaScript 中，我们可以在条件语句中使用任何表达式，比如 `&&` 、`||`、`!` 等，举个例子，像 `if` 语句就不需要条件的结果总是 `boolean` 类型

```typescript
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return `There are ${numUsersOnline} online now!`
  }
  return 'Nobody\'s here. :('
}
```

这是因为 JavaScript 会做隐式类型转换，像 `0` 、`NaN`、`""`、`0n`、`null` `undefined` 这些值都会被转为 `false`，其他的值则会被转为 `true`。

当然你也可以使用 `Boolean` 函数强制转为 `boolean` 值，或者使用更加简短的`!!`：

```typescript
// both of these result in 'true'
Boolean('hello') // type: boolean, value: true
!!'world' // type: true,    value: true
```

这种使用方式非常流行，尤其适用于防范 `null`和 `undefiend` 这种值的时候。举个例子，我们可以在 `printAll` 函数中这样使用：

```typescript
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === 'object') {
    for (const s of strs) {
      console.log(s)
    }
  }
  else if (typeof strs === 'string') {
    console.log(strs)
  }
}
```

可以看到通过这种方式，成功的去除了错误。

但还是要注意，在基本类型上的真值检查很容易导致错误，比如，如果我们这样写 `printAll` 函数：

```typescript
function printAll(strs: string | string[] | null) {
  // !!!!!!!!!!!!!!!!
  //  DON'T DO THIS!
  //   KEEP READING
  // !!!!!!!!!!!!!!!!
  if (strs) {
    if (typeof strs === 'object') {
      for (const s of strs) {
        console.log(s)
      }
    }
    else if (typeof strs === 'string') {
      console.log(strs)
    }
  }
}
```

我们把原本函数体的内容包裹在一个 `if (strs)` 真值检查里，这里有一个问题，就是我们无法正确处理空字符串的情况。如果传入的是空字符串，真值检查判断为 `false`，就会进入错误的处理分支。

如果你不熟悉 JavaScript ，你应该注意这种情况。

另外一个通过真值检查收窄类型的方式是通过`!`操作符。

```typescript
function multiplyAll(
  values: number[] | undefined,
  factor: number
): number[] | undefined {
  if (!values) {
    return values
    // (parameter) values: undefined
  }
  else {
    return values.map(x => x * factor)
    // (parameter) values: number[]
  }
}
```

#### 等值收窄

`ts`也会使用`switch`语句和等值检查如`===` `!==` `==` `!=`进行类型收窄

#### in操作符收窄

JavaScript 中有一个 `in` 操作符可以判断一个对象是否有对应的属性名。TypeScript 也可以通过这个收窄类型。

举个例子，在 `"value" in x` 中，`"value"` 是一个字符串字面量，而 `x` 是一个联合类型：

```typescript
interface Fish { swim: () => void }
interface Bird { fly: () => void }

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    return animal.swim()
    // (parameter) animal: Fish
  }

  return animal.fly()
  // (parameter) animal: Bird
}
```

通过 `"swim" in animal` ，我们可以准确的进行类型收窄。

而如果有可选属性，比如一个人类既可以 `swim` 也可以 `fly` (借助装备)，也能正确的显示出来：

```typescript
interface Fish { swim: () => void }
interface Bird { fly: () => void }
interface Human { swim?: () => void, fly?: () => void }

function move(animal: Fish | Bird | Human) {
  if ('swim' in animal) {
    animal // (parameter) animal: Fish | Human
  }
  else {
    animal // (parameter) animal: Bird | Human
  }
}
```

#### instanceof 收窄

`instanceof` 也是一种类型保护，`ts`也可以通过识别 `instanceof` 正确的类型收窄

#### 赋值语句

`ts`可以根据赋值语句的右值，正确的收窄左值

#### 类型谓词

```typescript
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}
```

在这个例子中，`pet is Fish`就是我们的类型判断式，一个类型判断式采用 `parameterName is Type`的形式，但 `parameterName` 必须是当前函数的参数名。

当 isFish 被传入变量进行调用，TypeScript 就可以将这个变量收窄到更具体的类型：

```typescript
// Both calls to 'swim' and 'fly' are now okay.
const pet = getSmallPet()

if (isFish(pet)) {
  pet.swim() // let pet: Fish
}
else {
  pet.fly() // let pet: Bird
}
```

注意这里，TypeScript 并不仅仅知道 `if` 语句里的 `pet` 是 `Fish` 类型，也知道在 `else` 分支里，`pet` 是 `Bird` 类型，毕竟 `pet` 就两个可能的类型。

你也可以用 `isFish` 在 `Fish | Bird` 的数组中，筛选获取只有 `Fish` 类型的数组：

```typescript
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()]
const underWater1: Fish[] = zoo.filter(isFish)
// or, equivalently
const underWater2: Fish[] = zoo.filter(isFish) as Fish[]

// 在更复杂的例子中，判断式可能需要重复写
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === 'sharkey')
    return false
  return isFish(pet)
})
```

#### 可辨别联合

让我们试想有这样一个处理 `Shape` （比如 `Circles`、`Squares` ）的函数，`Circles` 会记录它的半径属性，`Squares` 会记录它的边长属性，我们使用一个 `kind` 字段来区分判断处理的是 `Circles` 还是 `Squares`，这是初始的 `Shape` 定义：

```typescript
interface Shape {
  kind: 'circle' | 'square'
  radius?: number
  sideLength?: number
}
```

注意这里我们使用了一个联合类型，`"circle" | "square"` ，使用这种方式，而不是一个 `string`，我们可以避免一些拼写错误的情况：

```typescript
function handleShape(shape: Shape) {
  // oops!
  if (shape.kind === 'rect') {
    // This condition will always return 'false' since the types '"circle" | "square"' and '"rect"' have no overlap.
    // ...
  }
}
```

现在我们写一个获取面积的 `getArea` 函数，而圆和正方形的计算面积的方式有所不同，我们先处理一下是 `Circle` 的情况：

```typescript
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2 // 圆的面积公式 S=πr²
  // Object is possibly 'undefined'.
}
```

在 `strictNullChecks` 模式下，TypeScript 会报错，毕竟 `radius` 的值确实可能是 `undefined`，那如果我们根据 `kind` 判断一下呢？

```typescript
function getArea(shape: Shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius ** 2
    // Object is possibly 'undefined'.
  }
}
```

你会发现，TypeScript 依然在报错，即便我们判断 `kind` 是 `circle` 的情况，但由于 `radius` 是一个可选属性，TypeScript 依然会认为 `radius` 可能是 `undefined`。

我们可以尝试用一个非空断言 (non-null assertion), 即在 `shape.radius` 加一个 `!` 来表示 `radius` 是一定存在的。

```typescript
function getArea(shape: Shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius! ** 2
  }
}
```

但这并不是一个好方法，我们不得不用一个非空断言来让类型检查器确信此时 `shape.raidus` 是存在的，我们在 radius 定义的时候将其设为可选属性，但又在这里将其认为一定存在，前后语义也是不符合的。所以让我们想想如何才能更好的定义。

此时 `Shape`的问题在于类型检查器并没有方法根据 `kind` 属性判断 `radius` 和 `sideLength` 属性是否存在，而这点正是我们需要告诉类型检查器的，所以我们可以这样定义 `Shape`:

```typescript
interface Circle {
  kind: 'circle'
  radius: number
}

interface Square {
  kind: 'square'
  sideLength: number
}

type Shape = Circle | Square
```

在这里，我们把 `Shape` 根据 `kind` 属性分成两个不同的类型，`radius` 和 `sideLength` 在各自的类型中被定义为 `required`。

让我们看看如果直接获取 `radius` 会发生什么？

```typescript
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
Property 'radius' does not exist on type 'Shape'.
  Property 'radius' does not exist on type 'Square'.
}
```

就像我们第一次定义 `Shape` 那样，依然有错误。

当最一开始定义 `radius` 是 `optional` 的时候，我们会得到一个报错 (`strickNullChecks` 模式下)，因为`ts`并不能判断出这个属性是一定存在的。

而现在报错，是因为 `Shape` 是一个联合类型，`ts`可以识别出 `shape` 也可能是一个 `Square`，而 `Square` 并没有 `radius`，所以会报错。

但这时我们再根据 `kind` 属性检查一次呢？

![image.png](https://cdn.jsdelivr.net/gh/mqyqingfeng/picture/%E5%8F%AF%E8%BE%A8%E5%88%AB%E8%81%94%E5%90%881.png)

你会发现，报错就这样被去除了。

当联合类型中的每个类型，都包含了一个共同的字面量类型的属性，`ts`就会认为这是一个**可辨别联合（discriminated union）**，然后可以将具体成员的类型进行收窄。

在这个例子中，`kind` 就是这个公共的属性（作为 Shape 的**可辨别(discriminant)** 属性 ）。

这也适用于 `switch` 语句: ![image.png](https://cdn.jsdelivr.net/gh/mqyqingfeng/picture/%E5%8F%AF%E8%BE%A8%E5%88%AB%E8%81%94%E5%90%882.png)

这里的关键就在于如何定义 `Shape`，告诉`ts`，`Circle` 和 `Square` 是根据 `kind` 字段彻底分开的两个类型。这样，类型系统就可以在 `switch` 语句的每个分支里推导出正确的类型。

#### never

never 类型可以赋值给任何类型，然而，没有类型可以赋值给 `never` （除了 `never` 自身）。这就意味着你可以在 `switch` 语句中使用 `never` 来做一个穷尽检查。

举个例子，给 `getArea` 函数添加一个 `default`，把 `shape` 赋值给 `never` 类型，当出现还没有处理的分支情况时，`never` 就会发挥作用。

```typescript
type Shape = Circle | Square

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.sideLength ** 2
    default:
      const _exhaustiveCheck: never = shape
      return _exhaustiveCheck
  }
}
```

当我们给 `Shape` 类型添加一个新成员，却没有做对应处理的时候，就会导致一个`ts`错误：

```typescript
interface Triangle {
  kind: 'triangle'
  sideLength: number
}

type Shape = Circle | Square | Triangle

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.sideLength ** 2
    default:
      const _exhaustiveCheck: never = shape
      // Type 'Triangle' is not assignable to type 'never'.
      return _exhaustiveCheck
  }
}
```

因为`ts`的收窄特性，执行到 `default` 的时候，类型被收窄为 `Triangle`，但因为任何类型都不能赋值给 `never` 类型，这就会产生一个编译错误。通过这种方式，你就可以确保 `getArea` 函数总是穷尽了所有 `shape` 的可能性

### 泛型
