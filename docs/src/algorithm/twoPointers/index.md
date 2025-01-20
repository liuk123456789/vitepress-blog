---
outline: deep
---

<script setup>
 import RemoveDuplicate from '../../components/RemoveDuplicate.vue'
 import CloseZero from '../../components/CloseZero.vue'
</script>

### 简单题

#### 删除有序数组中的重复项

:::info 给你一个 **非严格递增排列** 的数组 `nums` ，请你**[ 原地](http://baike.baidu.com/item/原地算法)** 删除重复出现的元素，使每个元素 **只出现一次** ，返回删除后数组的新长度。元素的 **相对顺序** 应该保持 **一致** 。然后返回 `nums` 中唯一元素的个数。

考虑 `nums` 的唯一元素的数量为 `k` ，你需要做以下事情确保你的题解可以被通过：

- 更改数组 `nums` ，使 `nums` 的前 `k` 个元素包含唯一元素，并按照它们最初在 `nums` 中出现的顺序排列。`nums` 的其余元素与 `nums` 的大小不重要。
- 返回 `k` 。

**判题标准:**

系统会用下面的代码来测试你的题解:

```
int[] nums = [...]; // 输入数组
int[] expectedNums = [...]; // 长度正确的期望答案

int k = removeDuplicates(nums); // 调用

assert k == expectedNums.length;
for (int i = 0; i < k; i++) {
    assert nums[i] == expectedNums[i];
}
```

如果所有断言都通过，那么您的题解将被 **通过**。

**示例 1：**

```
输入：nums = [1,1,2]
输出：2, nums = [1,2,_]
解释：函数应该返回新的长度 2 ，并且原数组 nums 的前两个元素被修改为 1, 2 。不需要考虑数组中超出新长度后面的元素。
```

**示例 2：**

```
输入：nums = [0,0,1,1,1,2,2,3,3,4]
输出：5, nums = [0,1,2,3,4]
解释：函数应该返回新的长度 5 ， 并且原数组 nums 的前五个元素被修改为 0, 1, 2, 3, 4 。不需要考虑数组中超出新长度后面的元素。
```

**提示：**

- `1 <= nums.length <= 3 * 104`
- `-104 <= nums[i] <= 104`
- `nums` 已按 **非严格递增** 排列

:::

**解题**

```typescript
function removeDuplicates(nums: number[]): number {
  const len = nums.length
  if (len === 0)
    return 0
  let slow = 1
  let fast = 1
  while (fast < len) {
    // 如果值相同，只需移动快指针即可
    if (nums[fast] !== nums[fast - 1]) {
      // 更新slow的值为fast指针指向的值
      nums[slow] = nums[fast]
      // 移动满指针
      slow++
    }
    fast++
  }
  return slow
};
```
**测试**
<RemoveDuplicate></RemoveDuplicate>
<br></br>

#### 找到最接近0的数字

:::info 给你一个长度为 `n` 的整数数组 `nums` ，请你返回 `nums` 中最 **接近** `0` 的数字。如果有多个答案，请你返回它们中的 **最大值** 。

**示例 1：**

```
输入：nums = [-4,-2,1,4,8]
输出：1
解释：
-4 到 0 的距离为 |-4| = 4 。
-2 到 0 的距离为 |-2| = 2 。
1 到 0 的距离为 |1| = 1 。
4 到 0 的距离为 |4| = 4 。
8 到 0 的距离为 |8| = 8 。
所以，数组中距离 0 最近的数字为 1 。
```

**示例 2：**

```
输入：nums = [2,-1,1]
输出：1
解释：1 和 -1 都是距离 0 最近的数字，所以返回较大值 1 。
```

**提示：**

- `1 <= n <= 1000`
- `-105 <= nums[i] <= 105`

:::

**解题**

```typescript
function findClosestNumber(nums: number[]): number {
  if (nums.length === 0)
    return 0
  let slow = 0
  let fast = 0
  while (fast < nums.length) {
    if (Math.abs(nums[slow]) > Math.abs(nums[fast])) {
      slow = fast
    }
    if (Math.abs(nums[slow]) === Math.abs(nums[fast])) {
      if (nums[slow] < nums[fast]) {
        slow = fast
      }
    }
    fast++
  }
  return nums[slow]
};

//  不适用双指针，更加简单的解法
function findClosestNumber(nums: number[]): number {
  let ans: number = nums[0]
  for (const i of nums) {
    if ((Math.abs(i) < Math.abs(ans) || Math.abs(i) === Math.abs(ans)) && i > 0) {
      ans = i
    }
  }
  return ans
};
```

**测试**
<CloseZero></CloseZero>
<br></br>

### 中等题

### 困难题
