---
outline: deep
---

<script setup>
 import RemoveDuplicate from '../components/RemoveDuplicate.vue'
 import CloseZero from '../components/CloseZero.vue'
 import MaxArea from '../components/MaxArea.vue'
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

**代码**

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

**代码**

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

#### **盛最多水的容器**

:::info 给定一个长度为 `n` 的整数数组 `height` 。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])` 。

找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

**说明：**你不能倾斜容器。

**示例 1：**

![img](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/07/25/question_11.jpg)

```
输入：[1,8,6,2,5,4,8,3,7]
输出：49
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

**示例 2：**

```
输入：height = [1,1]
输出：1
```

**提示：**

- `n == height.length`
- `2 <= n <= 105`
- `0 <= height[i] <= 104`

:::

**解题**

> 1. 定义两个指针l、r，初始值分别指向数组的头尾，定义res初始值为0，获取最大容纳水量的值
> 2. 那么可得 容纳水的量 = `Math.min(height[l],height[r]) * (r -l)`
> 3. 如果`height[l] < height[r]`，那么 `res = Math.max(res, (r - l) *height[i])`，注意此时还需移动左指针，为什么移动`nums[l]`和`nums[r]`中较小的那个。我们通过公式`Math.min(height[l],height[r]) * (r -l)`，移动指针`r-l`会减1，如果移动`r`,如果`height[r-1]`小于`height[r]`，那么此时的值还是比移动之前的小。如果`height[r-1]`大于`height[r]`，那么此时的值也还是会比之前的小（因为`r-l`小了）。所以移动左指针
> 4. 反之 同理

**代码**

```typescript
function maxArea(height: number[]): number {
  if (height.length === 0)
    return 0
  let l = 0
  let r = height.length - 1
  let res = 0
  while (l < r) {
    // 最多可容纳水的量取决于height[l]和height[r]小的值
    // 将值和res进行比较，取大的
    // 同时移动height[l]和height[r]小点的值
    res = height[l] < height[r] ? Math.max(res, (r - l) * height[l++]) : Math.max(res, (r - l) * height[r--])
  }
  return res
};
```
<MaxArea></MaxArea>
<br></br>

#### 颜色分类

:::info 给定一个包含红色、白色和蓝色、共 `n` 个元素的数组 `nums` ，**[原地](https://baike.baidu.com/item/原地算法)** 对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

我们使用整数 `0`、 `1` 和 `2` 分别表示红色、白色和蓝色。

必须在不使用库内置的 sort 函数的情况下解决这个问题。

**示例 1：**

```
输入：nums = [2,0,2,1,1,0]
输出：[0,0,1,1,2,2]
```

**示例 2：**

```
输入：nums = [2,0,1]
输出：[0,1,2]
```

**提示：**

- `n == nums.length`
- `1 <= n <= 300`
- `nums[i]` 为 `0`、`1` 或 `2`

 :::

**解题思路**

> 1. 定义两个指针slow、fast,初始指向下标0；定义指针len，指向数组最后一个下标
> 2. 如果nums[fast] === 0，那么交换nums[slow]和nums[fast]的值，向右移动slow&fast指针
> 3. 如果nums[fast] === 2，那么交换nums[len]和nums[fast]的值，向左移动len指针
> 4. 如果nums[fast] === 1,  那么移动fast指针即可

![color.svg](/color.svg)

**代码**

```typescript
/**
 Do not return anything, modify nums in-place instead.
 */
function sortColors(nums: number[]): void {
  let slow = 0
  let fast = 0
  let len = nums.length - 1
  while (fast <= len) {
    if (nums[fast] === 0) {
      const temp = nums[fast]
      nums[fast] = nums[slow]
      nums[slow++] = temp
      fast++
    }
    else if (nums[fast] === 2) {
      const temp = nums[fast]
      nums[fast] = nums[len]
      nums[len--] = temp
    }
    else {
      fast++
    }
  }
};
```

#### 轮转数组

:::info 给定一个整数数组 `nums`，将数组中的元素向右轮转 `k` 个位置，其中 `k` 是非负数。

**示例 1:**

```
输入: nums = [1,2,3,4,5,6,7], k = 3
输出: [5,6,7,1,2,3,4]
解释:
向右轮转 1 步: [7,1,2,3,4,5,6]
向右轮转 2 步: [6,7,1,2,3,4,5]
向右轮转 3 步: [5,6,7,1,2,3,4]
```

**示例 2:**

```
输入：nums = [-1,-100,3,99], k = 2
输出：[3,99,-1,-100]
解释: 
向右轮转 1 步: [99,-1,-100,3]
向右轮转 2 步: [3,99,-1,-100]
```

 

**提示：**

- `1 <= nums.length <= 105`
- `-231 <= nums[i] <= 231 - 1`
- `0 <= k <= 105`

 

**进阶：**

- 尽可能想出更多的解决方案，至少有 **三种** 不同的方法可以解决这个问题。
- 你可以使用空间复杂度为 `O(1)` 的 **原地** 算法解决这个问题吗？

:::

**代码**

```typescript
/**
 Do not return anything, modify nums in-place instead.
 */
function rotate(nums: number[], k: number): void {
    k%= nums.length
    reverse(nums, 0, nums.length - 1)
    reverse(nums, 0, k - 1)
    reverse(nums, k ,nums.length - 1)
};

const reverse = (nums,start,end) => {
    while(start < end) {
        const temp = nums[start]
        nums[start] = nums[end]
        nums[end] = temp
        start += 1
        end -= 1
    }
}
```



### 困难题
