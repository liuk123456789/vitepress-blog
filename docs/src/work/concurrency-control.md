---
outline: deep
---

### 说明
项目开发中，存在需要控制接口请求的并发数量。优化请求，减少服务器压力

### 思路

1. 通过参数`limit`限制最大并发数量
2. 如果请求池中的任务执行完成，将请求从请求池中删除，否则添加进请求池
3. 判断请求池的数量是否超过最大并发数量，超过的话，等待请求池的请求完成

### 代码

```typescript
async function asyncPool<T>(
  poolLimit: number,
  tasks: (() => Promise<T>)[],
): Promise<T[]> {
  const results: T[] = []
  const executing = new Set<Promise<void>>()

  for (const task of tasks) {
    // 等待直到并发池有空位
    while (executing.size >= poolLimit) {
      await Promise.race(executing)
    }

    // 创建任务Promise并加入执行队列
    const taskPromise = Promise.resolve().then(task)
    const cleanUp = () => executing.delete(taskPromise)
    const trackedPromise = taskPromise.then(
      (result) => {
        results.push(result)
        cleanUp()
      },
      (error) => {
        cleanUp()
        throw error
      },
    )

    executing.add(trackedPromise)
  }

  // 等待所有剩余任务完成
  await Promise.all(executing)
  return results
}
```

### 测试

```typescript
// 模拟异步任务
function createTask(id: number, delay: number) {
  return () =>
    new Promise<string>(resolve =>
      setTimeout(() => resolve(`Task ${id} completed`), delay),
    )
}

// 生成任务列表
const tasks = [
  createTask(1, 2000),
  createTask(2, 1000),
  createTask(3, 1500),
  createTask(4, 500),
]

// 执行并发控制
asyncPool(2, tasks)
  .then(results => console.log('All results:', results))
  .catch(error => console.error('Error:', error))
```
