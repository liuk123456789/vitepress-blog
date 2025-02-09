---
outline: deep
---

### 说明
日常开发中，后端需要调用第三方`api`获取某个状态，后端获取后，前端因为接口调用完成，无法获知状态变更
所以就考虑使用接口轮询，用于更新页面状态

### 思路

1. 需要设置轮询时间，建议轮询时间间隔稍微大点，减少服务器压力
2. 防止连接异常，需要支持重试
3. 支持超时机制
4. 完成轮询的条件判断
5. 捕获错误以及状态处理

### 代码

```typescript
interface PollingOptions {
  callback: () => Promise<any> // 轮询时执行的异步函数
  pollTime?: number // 轮询间隔时间，默认 3000 毫秒
  maxAttempts?: number // 最大尝试次数，默认无限
  timeout?: number // 超时时间，默认无限
  condition?: (response: any) => boolean // 轮询条件，默认无
  onSuccess?: (response: any) => void // 成功回调
  onError?: (error: Error) => void // 错误回调
  onTimeout?: () => void // 超时回调
  onMaxAttempts?: () => void // 达到最大尝试次数回调
}

class PollingRequest {
  private timer: NodeJS.Timeout | null = null
  private isStop = false
  private attempts = 0
  private startTime = 0

  constructor(private options: PollingOptions) {
    this.options = {
      pollTime: 3000,
      maxAttempts: Infinity,
      timeout: Infinity,
      ...options,
    }
  }

  public start = async (): Promise<void> => {
    if (this.timer !== null) {
      console.warn('Polling is already running.')
      return
    }

    this.isStop = false
    this.attempts = 0
    this.startTime = Date.now()
    await this.loop()
  }

  public stop = (): void => {
    this.isStop = true
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  private checkTimeout = (): boolean => {
    if (Date.now() - this.startTime >= (this.options.timeout || Infinity)) {
      this.options.onTimeout?.()
      this.stop()
      return true
    }
    return false
  }

  private checkMaxAttempts = (): boolean => {
    if (this.attempts >= (this.options.maxAttempts || Infinity)) {
      this.options.onMaxAttempts?.()
      this.stop()
      return true
    }
    return false
  }

  private loop = async (): Promise<void> => {
    if (this.isStop)
      return

    // 检查超时
    if (this.checkTimeout())
      return

    // 检查最大尝试次数
    if (this.checkMaxAttempts())
      return

    try {
      const response = await this.options.callback()
      this.attempts++

      // 检查条件
      if (this.options.condition?.(response) ?? true) {
        this.options.onSuccess?.(response)
        this.stop()
        return
      }
    }
    catch (error) {
      this.options.onError?.(error as Error)
    }

    // 继续轮询
    if (!this.isStop) {
      this.timer = setTimeout(this.loop, this.options.pollTime)
    }
  }
}

// 示例使用
async function exampleCallback() {
  console.log('Polling...')
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 1000))
  // 模拟返回数据
  return Math.random()
}

const polling = new PollingRequest({
  callback: exampleCallback,
  pollTime: 2000, // 每 2 秒轮询一次
  maxAttempts: 5, // 最多尝试 5 次
  timeout: 10000, // 10 秒超时
  condition: response => response > 0.8, // 条件：随机数大于 0.8
  onSuccess: (response) => {
    console.log('Polling succeeded with response:', response)
  },
  onError: (error) => {
    console.error('Polling error:', error.message)
  },
  onTimeout: () => {
    console.warn('Polling timed out.')
  },
  onMaxAttempts: () => {
    console.warn('Polling reached max attempts.')
  },
})

// 启动轮询
polling.start()

// 15 秒后停止轮询
setTimeout(() => {
  polling.stop()
  console.log('Polling stopped manually.')
}, 15000)
```

