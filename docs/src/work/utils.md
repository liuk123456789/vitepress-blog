---
outline: deep
---

### 前言
日常开发中我们总是需要通用函数帮助我们快速处理业务需求，这些方法可能会用于很多项目，这样我们每次都需要拷贝，或者手写。过于麻烦，所以便将其发布到npm。

### 前期准备

#### node
推荐`node`版本大于16.18.0

#### npm login
使用`npm login`登录个人`npm`账号

#### npm 命名空间生成项目
```bash
npm --scope=@konalau/utils
```

### rollup配置
因为需要同时支持`ES Modules`和`Common Js`，所以打包产物配置两份
```javascript
output: [
  {
    file: input.replace('src/', 'dist/').replace('.ts', '.mjs'),
    format: 'esm',
  },
  {
    file: input.replace('src/', 'dist/').replace('.ts', '.cjs'),
    format: 'cjs',
  },
]
```
因为使用`ts`，所以声明文件也需要打包两份，配置如下
```javascript
output: [
  {
    file: input.replace('src/', 'dist/').replace('.ts', '.d.mts'),
    format: 'esm',
  },
  {
    file: input.replace('src/', 'dist/').replace('.ts', '.d.ts'),
    format: 'esm',
  },
  {
    file: input.replace('src/', 'dist/').replace('.ts', '.d.cts'),
    format: 'cjs',
  },
]
```

### 脚本发布
这里借助了`antfu`大佬的工具`bumpp`
```json
{
  "release": "bumpp --commit --push --tag && npm publish --access public"
}
```
执行
```bash
pnpm run release
```

### 结尾
1. github ci 暂时未配置
2. 发布后的tag暂时未配置
3. vitest单元测试暂时未配置
