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
  return Array.from({ length: padding + 1 }).join(' ') + input
  // Operator '+' cannot be applied to types 'string | number' and 'number'.
}
```

如果这样写的话，编辑器里 `padding + 1` 这个地方就会标红，显示一个错误。

这是`ts`在警告我们，如果把一个 `number` 类型 (即例子里的数字 1 )和一个 `number | string` 类型相加，也许并不会达到我们想要的结果。换句话说，我们应该先检查下 `padding` 是否是一个 `number`，或者处理下当 `padding` 是 `string` 的情况，那我们可以这样做：

```typescript
function padLeft(padding: number | string, input: string) {
  if (typeof padding === 'number') {
    return Array.from({ length: padding + 1 }).join(' ') + input
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
  return Math.PI * shape.radius ** 2
  // Property 'radius' does not exist on type 'Shape'.
  // Property 'radius' does not exist on type 'Square'.
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

#### Generics 初探（Hello World of Generics）

让我们开始写第一个泛型，一个恒等函数（identity function）。所谓恒等函数，就是一个返回任何传进内容的函数。你也可以把它理解为类似于 `echo` 命令。

不借助泛型，我们也许需要给予恒等函数一个具体的类型：

```typescript
function identity(arg: number): number {
  return arg
}
```

或者，我们使用 `any` 类型：

```typescript
function identity(arg: any): any {
  return arg
}
```

尽管使用 `any` 类型可以让我们接受任何类型的 `arg` 参数，但也让我们丢失了函数返回时的类型信息。如果我们传入一个数字，我们唯一知道的信息是函数可以返回任何类型的值。

所以我们需要一种可以捕获参数类型的方式，然后再用它表示返回值的类型。这里我们用了一个**类型变量（type variable）**，一种用在类型而非值上的特殊的变量。

```typescript
function identity<Type>(arg: Type): Type {
  return arg
}
```

现在我们已经给恒等函数加上了一个类型变量 `Type`，这个 `Type` 允许我们捕获用户提供的类型，使得我们在接下来可以使用这个类型。这里，我们再次用 `Type` 作为返回的值的类型。在现在的写法里，我们可以清楚的知道参数和返回值的类型是同一个。

现在这个版本的恒等函数就是一个泛型，它可以支持传入多种类型。不同于使用 `any`，它没有丢失任何信息，就跟第一个使用 `number` 作为参数和返回值类型的的恒等函数一样准确。

在我们写了一个泛型恒等函数后，我们有两种方式可以调用它。第一种方式是传入所有的参数，包括类型参数：

```typescript
const output = identity<string>('myString') // let output: string
```

在这里，我们使用 `<>` 而不是 `()`包裹了参数，并明确的设置 `Type` 为 `string` 作为函数调用的一个参数。

第二种方式可能更常见一些，这里我们使用了**类型参数推断（type argument inference）**（部分中文文档会翻译为“**类型推论**”），我们希望编译器能基于我们传入的参数自动推断和设置 `Type` 的值。

```typescript
const output = identity('myString') // let output: string
```

注意这次我们并没有用 `<>` 明确的传入类型，当编译器看到 `myString` 这个值，就会自动设置 `Type` 为它的类型（即 `string`）。

类型参数推断是一个很有用的工具，它可以让我们的代码更短更易阅读。而在一些更加复杂的例子中，当编译器推断类型失败，你才需要像上一个例子中那样，明确的传入参数。

#### 使用泛型类型变量（Working with Generic Type Variables）

当你创建类似于 `identity` 这样的泛型函数时，你会发现，编译器会强制你在函数体内，正确的使用这些类型参数。这就意味着，你必须认真的对待这些参数，考虑到他们可能是任何一个，甚至是所有的类型（比如用了联合类型）。

让我们以 `identity` 函数为例：

```typescript
function identity<Type>(arg: Type): Type {
  return arg
}
```

如果我们想打印 `arg` 参数的长度呢？我们也许会尝试这样写：

```typescript
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length)
  // Property 'length' does not exist on type 'Type'.
  return arg
}
```

如果我们这样做，编译器会报错，提示我们正在使用 `arg` 的 `.length`属性，但是我们却没有在其他地方声明 `arg` 有这个属性。我们前面也说了这些类型变量代表了任何甚至所有类型。所以完全有可能，调用的时候传入的是一个 `number` 类型，但是 `number` 并没有 `.length` 属性。

现在假设这个函数，使用的是 `Type` 类型的数组而不是 `Type`。因为我们使用的是数组，`.length` 属性肯定存在。我们就可以像创建其他类型的数组一样写：

```typescript
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length)
  return arg
}
```

你可以这样理解 `loggingIdentity` 的类型：泛型函数 `loggingIdentity` 接受一个 `Type` 类型参数和一个实参 `arg`，实参 `arg` 是一个 `Type` 类型的数组。而该函数返回一个 `Type` 类型的数组。

如果我们传入的是一个全是数字类型的数组，我们的返回值同样是一个全是数字类型的数组，因为 `Type` 会被当成 `number` 传入。

现在我们使用类型变量 `Type`，是作为我们使用的类型的一部分，而不是之前的一整个类型，这会给我们更大的自由度。

我们也可以这样写这个例子，效果是一样的：

```typescript
function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length) // Array has a .length, so no more error
  return arg
}
```

#### 泛型类型 (Generic Types)

在上个章节，我们已经创建了一个泛型恒等函数，可以支持传入不同的类型。在这个章节，我们探索函数本身的类型，以及如何创建泛型接口。

泛型函数的形式就跟其他非泛型函数的一样，都需要先列一个类型参数列表，这有点像函数声明：

```typescript
function identity<Type>(arg: Type): Type {
  return arg
}

const myIdentity: <Type>(arg: Type) => Type = identity
```

泛型的类型参数可以使用不同的名字，只要数量和使用方式上一致即可：

```typescript
function identity<Type>(arg: Type): Type {
  return arg
}

const myIdentity: <Input>(arg: Input) => Input = identity
```

我们也可以以对象类型的调用签名的形式，书写这个泛型类型：

```typescript
function identity<Type>(arg: Type): Type {
  return arg
}

const myIdentity: { <Type>(arg: Type): Type } = identity
```

这可以引导我们写出第一个泛型接口，让我们使用上个例子中的对象字面量，然后把它的代码移动到接口里：

```typescript
interface GenericIdentityFn {
  <Type>(arg: Type): Type
}

function identity<Type>(arg: Type): Type {
  return arg
}

const myIdentity: GenericIdentityFn = identity
```

有的时候，我们会希望将泛型参数作为整个接口的参数，这可以让我们清楚的知道传入的是什么参数 (举个例子：`Dictionary<string>` 而不是 `Dictionary`)。而且接口里其他的成员也可以看到。

```typescript
interface GenericIdentityFn<Type> {
  (arg: Type): Type
}

function identity<Type>(arg: Type): Type {
  return arg
}

const myIdentity: GenericIdentityFn<number> = identity
```

注意在这个例子里，我们只做了少许改动。不再描述一个泛型函数，而是将一个非泛型函数签名，作为泛型类型的一部分。

现在当我们使用 `GenericIdentityFn` 的时候，需要明确给出参数的类型。(在这个例子中，是 `number`)，有效的锁定了调用签名使用的类型。

当要描述一个包含泛型的类型时，理解什么时候把类型参数放在调用签名里，什么时候把它放在接口里是很有用的。

除了泛型接口之外，我们也可以创建泛型类。注意，不可能创建泛型枚举类型和泛型命名空间。

#### 泛型类（Generic Classes）

泛型类写法上类似于泛型接口。在类名后面，使用尖括号中 `<>` 包裹住类型参数列表：

```typescript
class GenericNumber<NumType> {
  zeroValue: NumType
  add: (x: NumType, y: NumType) => NumType
}

const myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function (x, y) {
  return x + y
}
```

在这个例子中，并没有限制你只能使用 `number` 类型。我们也可以使用 `string` 甚至更复杂的类型：

```typescript
const stringNumeric = new GenericNumber<string>()
stringNumeric.zeroValue = ''
stringNumeric.add = function (x, y) {
  return x + y
}

console.log(stringNumeric.add(stringNumeric.zeroValue, 'test'))
```

就像接口一样，把类型参数放在类上，可以确保类中的所有属性都使用了相同的类型。

正如我们在 Class 章节提过的，一个类它的类型有两部分：静态部分和实例部分。泛型类仅仅对实例部分生效，所以当我们使用类的时候，注意静态成员并不能使用类型参数。

#### 泛型约束（Generic Constraints）

在早一点的 `loggingIdentity` 例子中，我们想要获取参数 `arg` 的 `.length` 属性，但是编译器并不能证明每种类型都有 `.length` 属性，所以它会提示错误：

```typescript
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length)
  // Property 'length' does not exist on type 'Type'.
  return arg
}
```

相比于能兼容任何类型，我们更愿意约束这个函数，让它只能使用带有 `.length` 属性的类型。只要类型有这个成员，我们就允许使用它，但必须至少要有这个成员。为此，我们需要列出对 `Type` 约束中的必要条件。

为此，我们需要创建一个接口，用来描述约束。这里，我们创建了一个只有 `.length` 属性的接口，然后我们使用这个接口和 `extends` 关键词实现了约束：

```typescript
interface Lengthwise {
  length: number
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length) // Now we know it has a .length property, so no more error
  return arg
}
```

现在这个泛型函数被约束了，它不再适用于所有类型：

```typescript
loggingIdentity(3)
// Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.
```

我们需要传入符合约束条件的值：

```typescript
loggingIdentity({ length: 10, value: 3 })
```

#### 在泛型约束中使用类型参数（Using Type Parameters in Generic Constraints）

你可以声明一个类型参数，这个类型参数被其他类型参数约束。

举个例子，我们希望获取一个对象给定属性名的值，为此，我们需要确保我们不会获取 `obj` 上不存在的属性。所以我们在两个类型之间建立一个约束：

```typescript
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key]
}

const x = { a: 1, b: 2, c: 3, d: 4 }

getProperty(x, 'a')
getProperty(x, 'm')

// Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

#### 在泛型中使用类类型（Using Class Types in Generics）

在 `ts`中，当使用工厂模式创建实例的时候，有必要通过他们的构造函数推断出类的类型，举个例子：

```typescript
function create<Type>(c: { new (): Type }): Type {
  return new c()
}
```

下面是一个更复杂的例子，使用原型属性推断和约束，构造函数和类实例的关系。

```typescript
class BeeKeeper {
  hasMask: boolean = true
}

class ZooKeeper {
  nametag: string = 'Mikle'
}

class Animal {
  numLegs: number = 4
}

class Bee extends Animal {
  keeper: BeeKeeper = new BeeKeeper()
}

class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper()
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c()
}

createInstance(Lion).keeper.nametag
createInstance(Bee).keeper.hasMask
```

### keyof操作符

对一个对象类型使用`keyof`操作符，会返回该对象属性名组成的一个字符串或者数字字面量的联合

```typescript
interface Point { x: number, y: number }
type P = keyof Point
```

如果类型有`string`或者`number`类型的索引签名，`keyof`直接返回这些类型

```typescript
interface Arrayish { [n: number]: unknown }
type A = keyof Arrayish
// type A = number

interface Mapish { [k: string]: boolean }
type M = keyof Mapish
// type M = string | number
```

需要注意的是，`M`是`string | number`，这是因为`js`对象的属性名会被强制转为字符串，所以`obj[0]`和`obj["0"]`是一样的

#### 数字字面量联合类型

```typescript
const NumericObject = {
  1: '冴羽一号',
  2: '冴羽二号',
  3: '冴羽三号'
}

type result = keyof typeof NumericObject

// typeof NumbericObject 的结果为：
// {
//   1: string;
//   2: string;
//   3: string;
// }
// 所以最终的结果为：
// type result = 1 | 2 | 3
```

#### Symbol

```typescript
const sym1 = Symbol()
const sym2 = Symbol()
const sym3 = Symbol()

const symbolToNumberMap = {
  [sym1]: 1,
  [sym2]: 2,
  [sym3]: 3,
}

type KS = keyof typeof symbolToNumberMap // typeof sym1 | typeof sym2 | typeof sym3
```

这也就是为什么当我们在泛型中像下面的例子中使用，会如此报错：

```typescript
function useKey<T, K extends keyof T>(o: T, k: K) {
  const name: string = k
  // Type 'string | number | symbol' is not assignable to type 'string'.
}
```

如果你确定只使用字符串类型的属性名，你可以这样写：

```typescript
function useKey<T, K extends Extract<keyof T, string>>(o: T, k: K) {
  const name: string = k // OK
}
```

而如果你要处理所有的属性名，你可以这样写：

```typescript
function useKey<T, K extends keyof T>(o: T, k: K) {
  const name: string | number | symbol = k
}
```

#### 类&接口

对类使用 `keyof`：

```typescript
// 例子一
class Person {
  name: '冴羽'
}

type result = keyof Person
// type result = "name"
// 例子二
class Person {
  1: string = '冴羽'
}

type result = keyof Person
// type result = 1
```

对接口使用 `keyof`：

```typescript
interface Person {
  name: 'string'
}

type result = keyof Person
// type result = "name"
```

### typeof

`ts`中的`typeof`用于获取一个变量或者属性的类型

#### 对象使用typeof

我们可以对一个对象使用`typeof`:

```typescript
const person = { name: 'kevin', age: '18' }
type Kevin = typeof person
// type kevin = {
// name: string;
// age: string;
// }
```

#### 对函数使用typeof

```typescript
function identity<Type>(arg: Type): Type {
  return arg
}
type result = typeof identity
// type result = <Type>(arg: Type) => Type
```

#### 对enum使用typeof

在`ts`中，`enum`是一种新的数据类型，但在具体运行的时候，它会被编译成对象。

```typescript
enum UserResponse {
  No = 0,
  Yes = 1,
}
```

对应编译的 JavaScript 代码为：

```typescript
let UserResponse;
(function (UserResponse) {
  UserResponse[UserResponse.No = 0] = 'No'
  UserResponse[UserResponse.Yes = 1] = 'Yes'
})(UserResponse || (UserResponse = {}))
```

如果我们打印一下 `UserResponse`：

```typescript
console.log(UserResponse)

// [LOG]: {
//   "0": "No",
//   "1": "Yes",
//   "No": 0,
//   "Yes": 1
// }
```

而如果我们对 `UserResponse` 使用 `typeof`：

```typescript
type result = typeof UserResponse;

// ok
const a: result = {
      "No": 2,
      "Yes": 3
}

result 类型类似于：

// {
//	"No": number,
//  "YES": number
// }
```

不过对一个 enum 类型只使用 `typeof` 一般没什么用，通常还会搭配 `keyof` 操作符用于获取属性名的联合字符串：

```typescript
type result = keyof typeof UserResponse
// type result = "No" | "Yes"
```

### 索引访问类型

我们可以使用 **索引访问类型（indexed access type）** 查找另外一个类型上的特定属性：

```typescript
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];
// type Age = number
```

因为索引名本身就是一个类型，所以我们也可以使用联合、`keyof` 或者其他类型：

```typescript
type I1 = Person["age" | "name"];  
// type I1 = string | number
 
type I2 = Person[keyof Person];
// type I2 = string | number | boolean
 
type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];  
// type I3 = string | boolean
```

如果你尝试查找一个不存在的属性，TypeScript 会报错：

```typescript
type I1 = Person["alve"];
// Property 'alve' does not exist on type 'Person'.
```

接下来是另外一个示例，我们使用 `number` 来获取数组元素的类型。结合 `typeof` 可以方便的捕获数组字面量的元素类型：

```typescript
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];
 
type Person = typeof MyArray[number];
       
// type Person = {
//    name: string;
//    age: number;
// }

type Age = typeof MyArray[number]["age"];  
// type Age = number

// Or
type Age2 = Person["age"];   
// type Age2 = number
```

作为索引的只能是类型，这意味着你不能使用 `const` 创建一个变量引用：

```typescript
const key = "age";
type Age = Person[key];

// Type 'key' cannot be used as an index type.
// 'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?
```

然而你可以使用类型别名实现类似的重构：

```typescript
type key = "age";
type Age = Person[key];
```

假设有这样一个业务场景，一个页面要用在不同的 APP 里，比如淘宝、天猫、支付宝，根据所在 APP 的不同，调用的底层 API 会不同，我们可能会这样写：

```typescript
const APP = ['TaoBao', 'Tmall', 'Alipay'];

function getPhoto(app: string) {
  // ...
}
  
getPhoto('TaoBao'); // ok
getPhoto('whatever'); // ok
```

如果我们仅仅是对 app 约束为 `string` 类型，即使传入其他的字符串，也不会导致报错，我们可以使用字面量联合类型约束一下：

```typescript
const APP = ['TaoBao', 'Tmall', 'Alipay'];
type app = 'TaoBao' | 'Tmall' | 'Alipay';

function getPhoto(app: app) {
  // ...
}
  
getPhoto('TaoBao'); // ok
getPhoto('whatever'); // not ok
```

但写两遍又有些冗余，我们怎么根据一个数组获取它的所有值的字符串联合类型呢？我们就可以结合上一篇的 `typeof` 和本节的内容实现：

```typescript
const APP = ['TaoBao', 'Tmall', 'Alipay'] as const;
type app = typeof APP[number];
// type app = "TaoBao" | "Tmall" | "Alipay"

function getPhoto(app: app) {
  // ...
}
  
getPhoto('TaoBao'); // ok
getPhoto('whatever'); // not ok
```

我们来一步步解析：

首先是使用 `as const` 将数组变为 `readonly` 的元组类型：

```typescript
const APP = ['TaoBao', 'Tmall', 'Alipay'] as const;
// const APP: readonly ["TaoBao", "Tmall", "Alipay"]
```

但此时 `APP` 还是一个值，我们通过 `typeof` 获取 `APP` 的类型：

```typescript
type typeOfAPP = typeof APP;
// type typeOfAPP = readonly ["TaoBao", "Tmall", "Alipay"]
```

最后在通过索引访问类型，获取字符串联合类型：

```typescript
type app = typeof APP[number];
// type app = "TaoBao" | "Tmall" | "Alipay"
```

### 条件类型

很多时候，我们需要基于输入的值来决定输出的值，同样我们也需要基于输入的值的类型来决定输出的值的类型。**条件类型（Conditional types**）就是用来帮助我们描述输入类型和输出类型之间的关系。

```typescript
interface Animal {
  live(): void;
}

interface Dog extends Animal {
  woof(): void;
}
 
type Example1 = Dog extends Animal ? number : string;     
// type Example1 = number
 
type Example2 = RegExp extends Animal ? number : string;     
// type Example2 = string
```

条件类型的写法有点类似于 JavaScript 中的条件表达式（`condition ? trueExpression : falseExpression` ）：

```typescript
SomeType extends OtherType ? TrueType : FalseType;
```

单从这个例子，可能看不出条件类型有什么用，但当搭配泛型使用的时候就很有用了，让我们拿下面的 `createLabel` 函数为例：

```typescript
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
 
function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```

这里使用了函数重载，描述了 `createLabel` 是如何基于输入值的类型不同而做出不同的决策，返回不同的类型。注意这样一些事情：

1. 如果一个库不得不在一遍又一遍的遍历 API 后做出相同的选择，它会变得非常笨重。
2. 我们不得不创建三个重载，一个是为了处理明确知道的类型，我们为每一种类型都写了一个重载（这里一个是 `string`，一个是 `number`），一个则是为了通用情况 （接收一个 `string | number`）。而如果增加一种新的类型，重载的数量将呈指数增加。

其实我们完全可以用把逻辑写在条件类型中：

```typescript
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```

使用这个条件类型，我们可以简化掉函数重载：

```typescript
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}
 
let a = createLabel("typescript");
// let a: NameLabel
 
let b = createLabel(2.8);
// let b: IdLabel
 
let c = createLabel(Math.random() ? "hello" : 42);
// let c: NameLabel | IdLabel
```

#### 条件类型约束

通常，使用条件类型会为我们提供一些新的信息。正如使用 **类型保护（type guards）** 可以 **收窄类型（narrowing）** 为我们提供一个更加具体的类型，条件类型的 `true` 分支也会进一步约束泛型，举个例子：

```typescript
type MessageOf<T> = T["message"];
// Type '"message"' cannot be used to index type 'T'.
```

TypeScript 报错是因为 `T` 不知道有一个名为 `message` 的属性。我们可以约束 `T`，这样 TypeScript 就不会再报错：

```typescript
type MessageOf<T extends { message: unknown }> = T["message"];
 
interface Email {
  message: string;
}
 
type EmailMessageContents = MessageOf<Email>;
// type EmailMessageContents = string
```

但是，如果我们想要 `MessgeOf` 可以传入任何类型，但是当传入的值没有 `message` 属性的时候，则返回默认类型比如 `never` 呢？

我们可以把约束移出来，然后使用一个条件类型：

```typescript
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
 
interface Email {
  message: string;
}
 
interface Dog {
  bark(): void;
}
 
type EmailMessageContents = MessageOf<Email>;           
// type EmailMessageContents = string
 
type DogMessageContents = MessageOf<Dog>;          
// type DogMessageContents = never
```

在 `true` 分支里，TypeScript 会知道 `T` 有一个 `message`属性。

再举一个例子，我们写一个 `Flatten` 类型，用于获取数组元素的类型，当传入的不是数组，则直接返回传入的类型：

```typescript
type Flatten<T> = T extends any[] ? T[number] : T;
 
// Extracts out the element type.
type Str = Flatten<string[]>;  
// type Str = string
 
// Leaves the type alone.
type Num = Flatten<number>;  
// type Num = number
```

注意这里使用了[索引访问类型 (opens new window)](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)里的 `number` 索引，用于获取数组元素的类型。

#### 在条件类型里推断（Inferring Within Conditional Types）

条件类型提供了 `infer` 关键词，可以从正在比较的类型中推断类型，然后在 `true` 分支里引用该推断结果。借助 `infer`，我们修改下 `Flatten` 的实现，不再借助索引访问类型“手动”的获取出来：

```typescript
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

这里我们使用了 `infer` 关键字声明了一个新的类型变量 `Item` ，而不是像之前在 `true` 分支里明确的写出如何获取 `T` 的元素类型，这可以解放我们，让我们不用再苦心思考如何从我们感兴趣的类型结构中挖出需要的类型结构。

我们也可以使用 `infer` 关键字写一些有用的 **类型帮助别名（helper type aliases）**。举个例子，我们可以获取一个函数返回的类型：

```typescript
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;
 
type Num = GetReturnType<() => number>;
// type Num = number
 
type Str = GetReturnType<(x: string) => string>;
// type Str = string
 
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;   
// type Bools = boolean[]
```

当从多重调用签名（就比如重载函数）中推断类型的时候，会按照最后的签名进行推断，因为一般这个签名是用来处理所有情况的签名。

```typescript
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;
 
type T1 = ReturnType<typeof stringOrNum>;                     
// type T1 = string | number
```

#### 分发条件类型（Distributive Conditional Types）

当在泛型中使用条件类型的时候，如果传入一个联合类型，就会变成 **分发的（distributive）**，举个例子：

```typescript
type ToArray<Type> = Type extends any ? Type[] : never;
```

如果我们在 `ToArray` 传入一个联合类型，这个条件类型会被应用到联合类型的每个成员：

```typescript
type ToArray<Type> = Type extends any ? Type[] : never;
 
type StrArrOrNumArr = ToArray<string | number>;        
// type StrArrOrNumArr = string[] | number[]
```

让我们分析下 `StrArrOrNumArr` 里发生了什么，这是我们传入的类型：

```typescript
string | number;
```

接下来遍历联合类型里的成员，相当于：

```typescript
ToArray<string> | ToArray<number>;
```

所以最后的结果是：

```typescript
string[] | number[];
```

通常这是我们期望的行为，如果你要避免这种行为，你可以用方括号包裹 `extends` 关键字的每一部分。

```typescript
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
 
// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr = ToArrayNonDist<string | number>;
// type StrArrOrNumArr = (string | number)[]
```
