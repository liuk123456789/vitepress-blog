---
outline: deep
---

## 项目搭建
```powershell
pnpm add rollup -D

pnpm dlx rollup --config
```

脚本配置

```json
{
  "scripts": {
    "build": "rollup --config"
  }
}
```

## 配置选项

### 核心功能

#### external

**类型：**`(string | RegExp)[] | RegExp | string | (id:string, partentId:string, isResolved: boolean) => boolean`

解释：抽离第三方包，减少`bundle`文件体积。同时需要配置`globals`，否则打包会出现警告

:::warning 如果需要过滤掉`/node_modules/`过滤包引入，需要通过`@rollup/plugin-node-resolve`的插件

:::

#### input

**类型**：`string | string [] | { [entryName: string]: string }`

解释：指定打包的入口文件

如果`input`是数组或者对象形式，那么会被单独打包到单独的输出`chunks`。生成`chunk`名称遵循`output.entryFileNames`的选项设置

#### jsx

**类型：**`false | JsxPreset | JsxOptions`

解释：是否允许`Rollup`处理`jsx`语法

#### output

**dir**

**类型：**`string`

解释：指定生成的`chunk`放在哪个目录。如果`chunk`大于1，这个选项必须设置，否则可以使用`file`替代

**file**

**类型：**`string`

解释：该选项用于指定要写入的文件

**format**

**类型：**`string`

解释：指定生成`bundle`的格式

- `amd` – 异步模块加载，适用于`RequireJS` 等模块加载器
- `cjs` – `CommonJS`，适用于 `Node` 环境和其他打包工具（别名：`commonjs`）
- `es` – 将 `bundle` 保留为 `ES` 模块文件，适用于其他打包工具，以及支持 `<script type=module>` 标签的浏览器。（别名：`esm`，`module`）
- `iife` – 自执行函数，适用于 `<script>` 标签（如果你想为你的应用程序创建 bundle，那么你可能会使用它）。`iife` 表示“自执行 [函数表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function)”
- `umd` – 通用模块定义规范，同时支持 `amd`，`cjs` 和 `iife`
- `system` – `SystemJS` 模块加载器的原生格式（别名：`systemjs`）

**globals**

**类型：**`{ [id: string]: string } | ((id: string) => string)`

解释：该选项用于在 `umd` / `iife` bundle 中，使用 `id: variableName` 键值对指定外部依赖。

**name**

**类型：**`string`

解释：对于输出格式为 `iife` / `umd` 的 `bundle` 来说，若想要使用全局变量名来表示你的` bundle` 时，该选项是必要的

**plugins**

**类型：**`aybeArray<MaybePromise<OutputPlugin | void>>`

解释：用于指定输出插件

#### plugins

**类型：**`MaybeArray<MaybePromise<Plugin | void>>`

解释：`rollup`打包时对应的插件配置

### 进阶功能

#### cache

**类型：**`RollupCache | boolean`

解释：该选项用于指定之前`bundle`的`cache`属性。使用该设置，`Rollup` 将只会对改变的模块重新分析，从而加速观察模式中后续的构建。将此选项明确设置为 `false` 将阻止` bundle` 生成 `cache` 属性，也将导致插件的缓存失效。

### output.assetFileNames

**类型：**`string | ((assetInfo: PreRenderedAsset) => string)`



