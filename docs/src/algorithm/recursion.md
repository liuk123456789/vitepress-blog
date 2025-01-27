---
outline: deep
---
### 概念说明
递归是循环，自己调用自身的循环,寻找的是重复调用自身的子问题。每次调用自己时可以看做是压栈过程，当递归条件满足结束时，递归一级一级的返回时可以看做是出栈的过程。

### 简单

#### 斐波那契数列

:::info **斐波那契数** （通常用 `F(n)` 表示）形成的序列称为 **斐波那契数列** 。该数列由 `0` 和 `1` 开始，后面的每一项数字都是前面两项数字的和。也就是：

```
F(0) = 0，F(1) = 1
F(n) = F(n - 1) + F(n - 2)，其中 n > 1
```

给定 `n` ，请计算 `F(n)` 。

**示例 1：**

```
输入：n = 2
输出：1
解释：F(2) = F(1) + F(0) = 1 + 0 = 1
```

**示例 2：**

```
输入：n = 3
输出：2
解释：F(3) = F(2) + F(1) = 1 + 1 = 2
```

**示例 3：**

```
输入：n = 4
输出：3
解释：F(4) = F(3) + F(2) = 2 + 1 = 3
```

**提示：**

- `0 <= n <= 30`

:::

**代码**

```typescript
function fib(n: number): number {
  if (n < 2)
    return n
  return fib(n - 1) + fib(n - 2)
};
```

**补充说明**

上面递归中，其实存在重复计算的问题，所以动态规划是更优解 代码如下

```typescript
function fib(n: number): number {
  let a = 0
  let b = 1
  let sum
  for (let i = 0; i < n; i++) {
    sum = a + b
    a = b
    b = sum
  }
  return a
};
```

#### 2的幂

:::info 给你一个整数 `n`，请你判断该整数是否是 2 的幂次方。如果是，返回 `true` ；否则，返回 `false` 。

如果存在一个整数 `x` 使得 `n == 2x` ，则认为 `n` 是 2 的幂次方。

**示例 1：**

```
输入：n = 1
输出：true
解释：20 = 1
```

**示例 2：**

```
输入：n = 16
输出：true
解释：24 = 16
```

**示例 3：**

```
输入：n = 3
输出：false
```

**提示：**

- `-231 <= n <= 231 - 1`

:::

**代码**

```typescript
function isPowerOfTwo(n: number): boolean {
  return n === 1 || (n !== 0 && n % 2 === 0 && isPowerOfTwo(n / 2))
};
```

**备注说明**

因为此题需要使用非递归解题，所以参考了答案，用到了位运算

```typescript
function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0
};
```

### 中等

#### 扁平化嵌套数组

:::info 请你编写一个函数，它接收一个 **多维数组** `arr` 和它的深度 `n` ，并返回该数组的 **扁平化** 后的结果。

**多维数组** 是一种包含整数或其他 **多维数组** 的递归数据结构。

数组 **扁平化** 是对数组的一种操作，定义是将原数组部分或全部子数组删除，并替换为该子数组中的实际元素。只有当嵌套的数组深度大于 `n` 时，才应该执行扁平化操作。第一层数组中元素的深度被认为是 0。

请在没有使用内置方法 `Array.flat` 的前提下解决这个问题。

**示例 1：**

```
输入
arr = [1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]]
n = 0
输出
[1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]]

解释
传递深度 n=0 的多维数组将始终得到原始数组。这是因为 子数组(0) 的最小可能的深度不小于 n=0 。因此，任何子数组都不应该被平面化。
```

**示例 2：**

```
输入
arr = [1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]]
n = 1
输出
[1, 2, 3, 4, 5, 6, 7, 8, [9, 10, 11], 12, 13, 14, 15]

解释
以 4 、7 和 13 开头的子数组都被扁平化了，这是因为它们的深度为 0 ， 而 0 小于 1 。然而 [9,10,11] 其深度为 1 ，所以未被扁平化。
```

**示例 3：**

```
输入
arr = [[1, 2, 3], [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]]
n = 2
输出
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

解释
所有子数组的最大深度都为 1 。因此，它们都被扁平化了。
```

**提示：**

- `0 <= arr 的元素个数 <= 105`
- `0 <= arr 的子数组个数 <= 105`
- `maxDepth <= 1000`
- `-1000 <= each number <= 1000`
- `0 <= n <= 1000`

:::

**代码**

```typescript
type MultiDimensionalArray = (number | MultiDimensionalArray)[]

const flat = function (arr: MultiDimensionalArray, n: number): MultiDimensionalArray {
  if (n <= 0)
    return arr
  const result: MultiDimensionalArray = []
  for (const item of arr) {
    result.push(...(Array.isArray(item) ? flat(item, n - 1) : [item]))
  }
  return result
}
```

**递归乘法**

:::info 递归乘法。 写一个递归函数，不使用 * 运算符， 实现两个正整数的相乘。可以使用加号、减号、位移，但要吝啬一些。

**示例1:**

```
 输入：A = 1, B = 10
 输出：10
```

**示例2:**

```
 输入：A = 3, B = 4
 输出：12
```

**提示:**

1. 保证乘法范围不会溢出

:::

**代码**

```typescript
function multiply(A: number, B: number): number {
  if (!A || !B)
    return 0
  // 需要考虑的就是A和B 谁大，使用小的进行递归 减少递归次数
  if (A < B)
    return B + multiply(A - 1, B)
  return A + multiply(A, B - 1)
};
```

#### 嵌套数组生成器

:::info 现给定一个整数的 **多维数组** ，请你返回一个生成器对象，按照 **中序遍历** 的顺序逐个生成整数。

**多维数组** 是一个递归数据结构，包含整数和其他 **多维数组**。

**中序遍历** 是从左到右遍历每个数组，在遇到任何整数时生成它，遇到任何数组时递归应用 **中序遍历** 。

**示例 1：**

```
输入：arr = [[[6]],[1,3],[]]
输出：[6,1,3]
解释：
const generator = inorderTraversal(arr);
generator.next().value; // 6
generator.next().value; // 1
generator.next().value; // 3
generator.next().done; // true
```

**示例 2：**

```
输入：arr = []
输出：[]
解释：输入的多维数组没有任何参数，所以生成器不需要生成任何值。
```

**提示：**

- `0 <= arr.flat().length <= 105`
- `0 <= arr.flat()[i] <= 105`
- `maxNestingDepth <= 105`

:::

```typescript
type MultidimensionalArray = (MultidimensionalArray | number)[]

function* inorderTraversal(arr: MultidimensionalArray): Generator<number, void, unknown> {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield * inorderTraversal(item)
    }
    else {
      yield item
    }
  }
};

/**
 * const gen = inorderTraversal([1, [2, 3]]);
 * gen.next().value; // 1
 * gen.next().value; // 2
 * gen.next().value; // 3
 */
```

### 困难
