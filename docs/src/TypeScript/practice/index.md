---
outline: deep
---

:::info antfu开源的类型挑战，也是加深`ts`的最佳实践
:::

### 简单题

#### Pick

:::info 实现Pick
```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
}
```
:::

**解答**

```typescript
// keyof T 获取数字字面量的联合类型
// K extends keyof T 收窄K的类型
// [p in K]: T[p] 类型映射,意思是遍历K,获取对应的属性
type MyPick<T, K extends keyof T> = {
  [p in K]: T[p]
}
```

#### Readonly

:::info 实现Readonly

```typescript
interface Todo {
  title: string
  description: string
}

const todo: MyReadonly<Todo> = {
  title: 'Hey',
  description: 'foobar'
}

todo.title = 'Hello' // Error: cannot reassign a readonly property
todo.description = 'barFoo' // Error: cannot reassign a readonly property
```
:::

**解答**

```typescript
type MyReadonly<T> = {
  readonly [p in keyof T]: T[p]
}
```

#### Tuple to Object

:::info 元组转对象

```typescript
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type result = TupleToObject<typeof tuple> // expected { 'tesla': 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

:::

**解答**

```typescript
// const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const;

// type a = typeof tuple // readonly ['tesla', 'model 3', 'model X', 'model Y']

// 获取数组字面量的联合类型
// type b = tuple[number] // 'tesla' | 'model 3' | 'model X' | 'model Y'

type TupleToObject<T extends readonly (string | number)[]> = {
  [p in T[number]]: p
}
```

#### First of Array

:::info 获取数组的第一个元素

```typescript
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
```

:::

**解答**

```typescript
// 通过infer进行类型推断
type First<T extends any[]> = T extends [infer A, ...infer B] ? A : never
```

#### Length of Tuple

:::info 元组的长度

```typescript
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla> // expected 4
type spaceXLength = Length<spaceX> // expected 5
```

:::

**解答**

```typescript
// 数组存在length属性，对应数组的长度
type Length<T extends readonly unknown[]> = T['length']
```

#### Exclude

:::info 排除掉某些类型

```typescript
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```

:::

**解答**

```typescript
// 原因：泛型中使用条件类型的时候，如果传入一个联合类型，就会变成分发的（distributive）
// 可以这样理解 ’a' extends 'a' ? never : 'a' | 'b' extends 'a' ? never : 'b' | 'c' extends 'a' ? never : 'c'
type MyExclude<T, U> = T extends U ? never : T
```

#### Awaited

:::info 实现await

```typescript
type ExampleType = Promise<string>

type Result = MyAwaited<ExampleType> // string
```

:::

**解答**

```typescript
// PromiseLike 类Promise对象
// 通过infer A 推断 A 是不是PromiseLike,如果是，递归下，否则返回A
type MyAwaited<T extends PromiseLike<any>> = T extends PromiseLike<infer A> ? (A extends PromiseLike<any> ? MyAwaited<A> : A) : never
```

#### If

:::info 实现if类型

```typescript
type A = If<true, 'a', 'b'> // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'
```

:::

**解答**

```typescript
type If<C extends boolean, T, F> = C extends true ? T : F
```

#### Contact

:::info 实现数组Contact

```typescript
type Result = Concat<[1], [2]> // expected to be [1, 2]
```

:::

**解答**

```typescript
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U]
```

#### Includes

:::info 实现数组Includes

```typescript
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```

:::

**解答**

```typescript
// 利用类型推导infer 获取数组的第一个元素，进行比对，如果不等，递归下
type Includes<T extends readonly any[], U> = T extends [infer F, ...infer R] ? (Equal<F, U> extends true ? true : Includes<R, U>) : false
```

#### Push

:::info 实现数组Push方法

```typescript
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

:::

**解答**

```typescript
// 利用解构
type Push<T extends unknown[], U> = [...T, U]
```

#### Unshift

:::info 实现数组Unshift方法

```typescript
type Result = Unshift<[1, 2], 0> // [0, 1, 2,]
```

:::

**解答**

```typescript
// 同push
type Unshift<T extends unknown[], U> = [U, ...T]
```

#### Parameters

:::info 获取参数

```typescript
function foo(arg1: string, arg2: number): void {}

type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]
```

:::

**解答**

```typescript
// 借用infer类型推断
type MyParameters<T extends (...args: any[]) => any> = T extends(...args: infer A) => any ? A : never
```

### 中等题

#### Get Return Type

:::info 获取返回类型

```typescript
function fn(v: boolean) {
  if (v)
    return 1
  else return 2
}
```

:::

**解答**

```typescript
// 使用类型推断
type MyReturnType<T> = T extends (...args: any[]) => infer A ? A : never
```

#### Omit

:::info 实现内置类型Omit

```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}
```

:::

**解答**

```typescript
// as 用于实现键名重新映射
type MyOmit<T, K extends keyof T> = {
  [p in keyof T as p extends K ? never : p]: T[p]
}
```

#### Readonly2

:::info 实现Readonly升级

```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}

const todo: MyReadonly2<Todo, 'title' | 'description'> = {
  title: 'Hey',
  description: 'foobar',
  completed: false,
}

todo.title = 'Hello' // Error: cannot reassign a readonly property
todo.description = 'barFoo' // Error: cannot reassign a readonly property
todo.completed = true // OK
```

:::

**解答**

```typescript
// k extends keyof T = keyof T 为了兼容K为null
// p in keyof T as p extends K  as 是为了实现键名的重新映射
// 所以p in keyof T as p extends K ? never : p 意思是p是T的属性，
// 然后进行类型约束（p extends K) 如果是 筛掉，否则就是p,然后通过as 重新映射
type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [key in K]: T[key]
} & {
  [p in keyof T as p extends K ? never : p]: T[p]
}
```

#### Deep Readonly

:::info 深度Readonly

```typescript
interface X {
  x: {
    a: 1
    b: 'hi'
  }
  y: 'hey'
}

interface Expected {
  readonly x: {
    readonly a: 1
    readonly b: 'hi'
  }
  readonly y: 'hey'
}

type Todo = DeepReadonly<X> // should be same as `Expected`
```

:::

**解答**

```typescript
// keyof T[key] extends never 用于判定T[key]是否存在子属性
type DeepReadonly<T> = {
  readonly [key in keyof T]: keyof T[key] extends never ? T[key] : DeepReadonly<T[key]>
}
```

#### Tuple to Union

:::info 元组转联合类型

```typescript
type Arr = ['1', '2', '3']

type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
```

:::

**解答**

```typescript
// T[number]可以获取数组的联合类型
type TupleToUnion<T extends unknown[]> = T[number]
```

#### Chainable Options

:::info 实现Options链操作

```typescript
declare const config: Chainable

const result = config
  .option('foo', 123)
  .option('name', 'type-challenges')
  .option('bar', { value: 'Hello World' })
  .get()

// expect the type of result to be:
interface Result {
  foo: number
  name: string
  bar: {
    value: string
  }
}
```

:::

**未能完成解答**

#### Last of Array

:::info 数组最后一个元素

```typescript
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type tail1 = Last<arr1> // expected to be 'c'
type tail2 = Last<arr2> // expected to be 1
```

:::

**解答**

```typescript
// 参考First of Array
type Last<T extends unknown[]> = T extends [...infer R, infer L] ? L : never
```

#### Pop

:::info 实现数组Pop方法

```typescript
type arr1 = ['a', 'b', 'c', 'd']
type arr2 = [3, 2, 1]

type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2> // expected to be [3, 2]
```

:::

**解答**

```typescript
type Pop<T extends unknown[]> = T['length'] extends 0 ? T : T extends [...infer L, infer R] ? L : never
```

#### Promise.all

:::info 实现Promise.all

```typescript
const promise1 = Promise.resolve(3)
const promise2 = 42
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo')
})

// expected to be `Promise<[number, 42, string]>`
const p = PromiseAll([promise1, promise2, promise3] as const)
```

:::

**解答**

```typescript
type MyAwaited<T> = T extends PromiseLike<infer U> ? U : T

// {
//    [key in keyof T]: MyAwaited<T<key>>
// }
// 返回的数组类型
declare function PromiseAll<T extends unknown[]>(value: readonly[...T]): Promise<{
  [key in keyof T]: MyAwaited<T<key>>
}>
```

#### Type Lookup

:::info 实现Lookup

```typescript
interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type MyDogType = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`
```

:::

**解答**

```typescript
type LookUp<U, T> = U extends { type: T } ? U : never
```

#### Trim Left

:::info 移除左侧空白字符

```typescript
type trimed = TrimLeft<'  Hello World  '> // expected to be 'Hello World  '
```

:::

**解答**

```typescript
// `${WhiteSpace}${infer R}` 模板字面量类型
type WhiteSpace = '\n' | '\t' | ' '
type TrimLeft<S extends string> = S extends `${WhiteSpace}${infer R}` ? TrimRight<R> : S
```

#### Trim

:::info 去除空白字符

```typescript
type trimmed = Trim<'  Hello World  '> // expected to be 'Hello World'
```

:::

**解答**

```typescript
type WhiteSpace = '\n' | '\t' | ' '
type TrimLeft<S extends string> = S extends `${WhiteSpace}${infer R}` | `${infer R}${WhiteSpace}` ? TrimLeft<R> : S
```

#### Capitalize

:::info 首字符大写

```typescript
type capitalized = Capitalize<'hello world'> // expected to be 'Hello world'
```

:::

**解答**

```typescript
type MyCapitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S
```

#### Replace

:::info 字符替换

```typescript
type replaced = Replace<'types are fun!', 'fun', 'awesome'> // expected to be 'types are awesome!'
```

:::

**解答**

```typescript
type Replace<S extends string, From extends string, To extends string> = From extends '' ? S : S extends `${infer F}${From}${infer R}` ? `${F}${To}${R}` : S
```

#### ReplaceAll

:::info 全局替换

```typescript
type replaced = ReplaceAll<'t y p e s', ' ', ''> // expected to be 'types'
```

:::

**解答**

```typescript
// 借助类型推导
type ReplaceAll<
  S extends string,
  From extends string,
  To extends string
> = From extends ''
  ? S
  : S extends `${infer S}${From}${infer E}`
    ? `${S}${To}${ReplaceAll<E, From, To>}`
    : S
```

#### Append Argument

:::info 添加参数

```typescript
type Fn = (a: number, b: string) => number

type Result = AppendArgument<Fn, boolean>
```

:::

**解答**

```typescript
type AppendArgument<Fn, A> = Fn extends (...args: [...infer P]) => infer R ? (...args: [...P, A]) => R : never
```

#### Permutation

:::info 全排列

```typescript
type perm = Permutation<'A' | 'B' | 'C'> // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
```

:::

**解答**

```typescript
// 知识点1： 判断泛型T是never  [T] extends [never] ? true : fasle
// 知识点2：分布式条件类型
// Test<T> = T extends number ? [T] : T
// 假设T是1 | 2| 3
// 导致最终的结果是[1] | [2] | [3]
// 知识点3：遍历联合类型
// type MyMap<T> = T extends T ? [T] : never
// type B = MyMap<1 | 2| 3>
// [1] | [2] | [3]
// 对应C extends infer U
// 知识点4： 解构元组的分发效果
// type A = [1, 2] | [3, 4]
// type B = ['a', 'b'] | ['c', 'd']

// type C = [true, ...A, ...B]
// [true, 1, 2, "a", "b"] | [true, 1, 2, "c", "d"] | [true, 3, 4, "a", "b"] | [true, 3, 4, "c", "d"]

type Permutation<T, C = T> = [T] extends [never] ? [] : C extends infer U ? [U, ...Permutation<Exclude<T, U>>] : never
```

#### Lenth of String

:::info 获取字符串长度

:::

**解答**

```typescript
// 因为数组可以通过length 获取长度，所以思路就是将字符切割成数组
// 利用类型推导 & 递归 将字符串字符挨个放入数组中
// 最后取length 即可
// 知识点：`${infer F}${infer R}`
// F 推断为字符串第一个字符
// R 推断为字符串的剩余字符
type LengthOfString<S extends string, L extends unknown[] = []> = S extends `${infer F}${infer R}` ? LengthOfString<R, [F, ...L]> : L['length']
```

#### Flatten

:::info 扁平化数组

```typescript
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
```

:::

**解答**

```typescript
// 递归判定是数组的元素是否时数组
type Flatten<T extends unknown[]> = T extends [infer F, ...infer R]
  ? F extends any[]
    ? Flatten<[...F, ...R]>
    : [F, ...Flatten<R>]
  : T
```

#### Append to object

:::info 给对象添加元素

```typescript
interface Test { id: '1' }
type Result = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }
```

:::

**解答**

```typescript
// U extends Property 限制U的类型为number | string | symbol

type AppendToObject<T extends object, U extends PropertyKey, V> = T & Record<U, V> extends infer R ? {
  [K in keyof R]: R[K]
} : never
```

#### Absolute

:::info 获取绝对值

```typescript
type Test = -100
type Result = Absolute<Test> // expected to be "100"
```

:::

**解答**

```typescript
type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer U}` ? U : `${T}`
```

#### String to Union

:::info 字符串转联合类型

```typescript
type Test = '123'
type Result = StringToUnion<Test> // expected to be "1" | "2" | "3"
```

:::

**解答**

```typescript
// 知识点：infer关键字进行类型推断
type StringToUnion<T extends string> = T extends `${infer F}${infer R}` ? F | StringToUnion<R> : never
```

#### Merge

:::info 合并对象

```typescript
interface foo {
  name: string
  age: string
}
interface coo {
  age: number
  sex: string
}

type Result = Merge<foo, coo> // expected to be {name: string, age: number, sex: string}
```

:::

**解答**

```typescript
// 相同属性，S 优先级高， 所以先判定是否在S中
// 在判断是否在F中

// keyof 获取联合类型
// [key in keyof ...] 循环遍历键名
type Merge<F extends object, S extends object> = {
  [key in keyof F | keyof S]: key extends keyof S ? S[key] : key extends keyof F ? F[key] : never
}
```

#### kebabCase

:::info  短横线命名

```typescript
type FooBarBaz = KebabCase<'FooBarBaz'>
const foobarbaz: FooBarBaz = 'foo-bar-baz'

type DoNothing = KebabCase<'do-nothing'>
const doNothing: DoNothing = 'do-nothing'
```

:::

**解答**

```typescript
// R extends Uncapitalize<R> 判定是否是小写字母
// '-' extends Uncapitalize<'-'> ? true :false ==> true
type KebabCase<Str extends string> =
  Str extends `${infer F}${infer R}`
    ? R extends Uncapitalize<R>
      ? `${Lowercase<F>}${KebabCase<R>}`
      : `${Lowercase<F>}-${KebabCase<R>}`
    : Str
```

#### Diff

:::info 获取对象差值

:::

**解答**

```typescript
type Diff<O, O1> = {
  [K in keyof O | keyof O1 as K extends keyof O
    ? K extends keyof O1
      ? never
      : K
    : K]: K extends keyof O ? O[K] : K extends keyof O1 ? O1[K] : never;
}
```

#### Anyof

:::info 其中之一

```typescript
type Sample1 = AnyOf<[1, '', false, [], {}]> // expected to be true.
type Sample2 = AnyOf<[0, '', false, [], {}]> // expected to be false.
```

:::

**解答**

```typescript
// 判断真假时注意  可以直接extends[] 判断数组真假，但是对象不可以，对象必须判断有无键值
type IsTrue<T> = T extends '' | [] | false | 0 ? false : T extends object ? keyof T extends never ? false : true : false
type AnyOf<T extends readonly any[]> = T extends [infer F, ...infer Rest] ? IsTrue<F> extends true ? true : AnyOf<Rest> : IsTrue<T[0]>
```
