---
outline: deep
---

<script setup>
 import Search from '../../components/Search.vue'
 import InsertSearch from '../../components/InsertSearch.vue'
 import Sqrtx from '../../components/Sqrtx.vue'
 import RotateSearch from '../../components/RotateSearch.vue'
 import FirstAndLastSearch from '../../components/FirstAndLastSearch.vue'

</script>

### leetcode 相关题目

<br></br>

:::tip 关于`leetcode`刷算法题会不定时更新

:::

### 前言

> 二分搜索个人习惯使用双闭区间`[left,right]`形式，因为二分搜索的精髓是边界情况的处理，总结如下
>
> **数组中不存在重复元素：**
>
> 如 nums = [1,2,3,5,6]， target = 7
>
> 如target: 7 二分结束 left指向首个大于target 的元素（index: 6，value: undefined），right指向首个小于 target 的元素(index: 5)
>
>
>
> **数组中存在重复元素：**
>
> 如 nums = [1,2,5,5,5,5,6]， target = 5
>
>  二分结束 left指向最左边的target（index: 2, value: 5）, right指向首个小于target的元素（index: 1, value: 2）

### 简单题

<br></br>

#### 二分搜索

:::info 给定一个 `n` 个元素有序的（升序）整型数组 `nums` 和一个目标值 `target` ，写一个函数搜索 `nums` 中的 `target`，如果目标值存在返回下标，否则返回 `-1`。

**示例 1:**

```
输入: nums = [-1,0,3,5,9,12], target = 9
输出: 4
解释: 9 出现在 nums 中并且下标为 4
```

**示例 2:**

```
输入: nums = [-1,0,3,5,9,12], target = 2
输出: -1
解释: 2 不存在 nums 中因此返回 -1
```

**提示：**

1. 你可以假设 `nums` 中的所有元素是不重复的。
2. `n` 将在 `[1, 10000]`之间。
3. `nums` 的每个元素都将在 `[-9999, 9999]`之间。

:::

**代码**

```typescript
// 题中意思就是从数组中查找特定值，直接套用模版即可
function search(nums: number[], target: number): number {
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2)
    if (target === nums[mid]) {
      return mid
    }
    else if (target < nums[mid]) {
      right = mid - 1
    }
    else {
      left = mid + 1
    }
  }
  return -1
};
```
**测试如下**
<Search></Search>

<br></br>

#### 搜索插入位置

:::info 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 `O(log n)` 的算法。

**示例 1:**

```
输入: nums = [1,3,5,6], target = 5
输出: 2
```

**示例 2:**

```
输入: nums = [1,3,5,6], target = 2
输出: 1
```

**示例 3:**

```
输入: nums = [1,3,5,6], target = 7
输出: 4
```

:::

**代码**

```typescript
function searchInsert(nums: number[], target: number): number {
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    const mid: number = Math.floor((right - left) / 2) + left
    // 数组中可能存在多个跟target相等的下标，所以包含相等，统一让右指针左移
    if (nums[mid] >= target) {
      right = mid - 1
    }
    else if (nums[mid] < target) {
      left = mid + 1
    }
  }
  // right 最终指向第一个小于target的数
  // left 指向大于等于target的数
  return left
}
```
**测试如下**
<InsertSearch></InsertSearch>

<br></br>

#### x的平方根

:::info 给你一个非负整数 `x` ，计算并返回 `x` 的 **算术平方根** 。

由于返回类型是整数，结果只保留 **整数部分** ，小数部分将被 **舍去 。**

**注意：**不允许使用任何内置指数函数和算符，例如 `pow(x, 0.5)` 或者 `x ** 0.5` 。

**示例 1：**

```
输入：x = 4
输出：2
```

**示例 2：**

```
输入：x = 8
输出：2
解释：8 的算术平方根是 2.82842..., 由于返回类型是整数，小数部分将被舍去。
```
:::

**代码**

```typescript
function mySqrt(x: number): number {
  let left = 0
  let right = x
  let res = 0
  while (left <= right) {
    const mid = Math.floor((right - left) / 2) + left
    if (mid * mid > x) {
      right = mid - 1
    }
    else if (mid * mid <= x) {
      // mid 此时是个备选的结果
      res = mid
      // 左指针右移
      left = mid + 1
    }
  }
  // 考虑到x为0这个场景，所以定义res这个变量，如果返回left-1,x为0,结果是不对的
  return res
};
```

**测试如下**
<Sqrtx></Sqrtx>

<br></br>

#### 第一个错误版本

:::info 你是产品经理，目前正在带领一个团队开发新的产品。不幸的是，你的产品的最新版本没有通过质量检测。由于每个版本都是基于之前的版本开发的，所以错误的版本之后的所有版本都是错的。

假设你有 `n` 个版本 `[1, 2, ..., n]`，你想找出导致之后所有版本出错的第一个错误的版本。

你可以通过调用 `bool isBadVersion(version)` 接口来判断版本号 `version` 是否在单元测试中出错。实现一个函数来查找第一个错误的版本。你应该尽量减少对调用 API 的次数。

**示例 1：**

```
输入：n = 5, bad = 4
输出：4
解释：
调用 isBadVersion(3) -> false
调用 isBadVersion(5) -> true
调用 isBadVersion(4) -> true
所以，4 是第一个错误的版本。
```

**示例 2：**

```
输入：n = 1, bad = 1
输出：1
```

:::

**代码**

```typescript
/**
 * The knows API is defined in the parent class Relation.
 * isBadVersion(version: number): boolean {
 *     ...
 * };
 */
/**
 * 如果当前的指针对应的版本是正确的，那么指针右移
 * 如果当前的指针对应的版本是错误的，那么指针左移
 * 循环之后
 * 左指针指向第一个错误的版本
 * 右指针指向第一个正确的版本
 */
const solution = function (isBadVersion: any) {
  return function (n: number): number {
    let left = 1
    let right = n
    while (left <= right) {
      const mid = Math.floor((right - left) / 2) + left
      if (isBadVersion(mid)) {
        right = mid - 1
      }
      else {
        left = mid + 1
      }
    }
    return left
  }
}
```

****

### 中等题

<br></br>

#### 搜索旋转排序数组

:::info 整数数组 `nums` 按升序排列，数组中的值 **互不相同** 。

在传递给函数之前，`nums` 在预先未知的某个下标 `k`（`0 <= k < nums.length`）上进行了 **旋转**，使数组变为 `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]`（下标 **从 0 开始** 计数）。例如， `[0,1,2,4,5,6,7]` 在下标 `3` 处经旋转后可能变为 `[4,5,6,7,0,1,2]` 。

给你 **旋转后** 的数组 `nums` 和一个整数 `target` ，如果 `nums` 中存在这个目标值 `target` ，则返回它的下标，否则返回 `-1` 。

你必须设计一个时间复杂度为 `O(log n)` 的算法解决此问题。

**示例 1：**

```
输入：nums = [4,5,6,7,0,1,2], target = 0
输出：4
```

**示例 2：**

```
输入：nums = [4,5,6,7,0,1,2], target = 3
输出：-1
```

**示例 3：**

```
输入：nums = [1], target = 0
输出：-1
```

:::

**解题思路**

![search.svgs](/search.svg)

如上图所示，其实就是一个有序数组分为两个区间，区间N1和区间N2

1. 首先，不管mid如何变动，[left, mid] || [mid, right] 一定有个是有序区间
2. 如果在[left, mid]区间，如果target >= left && target < mid, 往左查找（right = mid - 1），否则的话， 往右查找（left = mid + 1)
3. 那么右区间同理，如果target > mid&& target < right , 往右查找（left = mid + 1），否则的话， 往右查找（right= mid - 1)

**代码**

```typescript
function search(nums: number[], target: number): number {
  if (nums.length === 0)
    return -1
  let l = 0
  let r = nums.length - 1
  while (l <= r) {
    const mid = l + ((r - l) >>> 1)
    if (target === nums[mid])
      return mid
    // [left,mid]
    if (nums[l] <= nums[mid]) {
      if (target >= nums[l] && target < nums[mid]) {
        r = mid - 1
      }
      else {
        l = mid + 1
      }
    }
    else { // [mid,right]区间
      if (target > nums[mid] && target <= nums[r]) {
        l = mid + 1
      }
      else {
        r = mid - 1
      }
    }
  }
  return -1
};
```
<RotateSearch></RotateSearch>
<br></br>

#### 在排序数组中查找元素的第一个和最后一个的位置

:::info 给你一个按照非递减顺序排列的整数数组 `nums`，和一个目标值 `target`。请你找出给定目标值在数组中的开始位置和结束位置。

如果数组中不存在目标值 `target`，返回 `[-1, -1]`。

你必须设计并实现时间复杂度为 `O(log n)` 的算法解决此问题。

**示例 1：**

```
输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
```

**示例 2：**

```
输入：nums = [5,7,7,8,8,10], target = 6
输出：[-1,-1]
```

**示例 3：**

```
输入：nums = [], target = 0
输出：[-1,-1]
```

**提示：**

- `0 <= nums.length <= 105`
- `-109 <= nums[i] <= 109`
- `nums` 是一个非递减数组
- `-109 <= target <= 109`

:::

**代码**

使用了两次二分搜索分别查找最左侧的target和最右侧的target

```typescript
function searchRange(nums: number[], target: number): number[] {
  let left = 0
  let right = nums.length - 1
  let first = -1
  let last = -1
  while (left <= right) {
    const mid = left + ((right - left) >>> 1)
    if (nums[mid] === target) {
      first = mid
      // 寻找靠近左侧的target
      right = mid - 1
    }
    else if (nums[mid] > target) {
      right = mid - 1
    }
    else {
      left = mid + 1
    }
  }

  // 最后一个等于target的位置
  left = 0
  right = nums.length - 1
  while (left <= right) {
    const mid = left + ((right - left) >>> 1)
    if (nums[mid] === target) {
      last = mid
      // 寻找靠近右侧的target
      left = mid + 1
    }
    else if (nums[mid] > target) {
      right = mid - 1
    }
    else {
      left = mid + 1
    }
  }

  return [first, last]
};
```
<FirstAndLastSearch></FirstAndLastSearch>
<br></br>
### 困难题

<br></br>

待刷
