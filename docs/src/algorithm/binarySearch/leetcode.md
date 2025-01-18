---
outline: deep
---

<script setup>
 import Search from '../../components/Search.vue'
 import InsertSearch from '../../components/InsertSearch.vue'

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

#### 简单题

**二分搜索**

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

**解题**

```typescript
// 题中意思就是从数组中查找特定值，直接套用常规模版即可
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

**搜索插入位置**

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

**解题**

```typescript
function searchInsert(nums: number[], target: number): number {
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    const mid: number = Math.floor((right - left) / 2) + left
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

#### 中等题

#### 困难题
