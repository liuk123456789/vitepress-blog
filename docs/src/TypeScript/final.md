---
outline: deep
---
### tsconfig.json的配置字段说明

#### 顶层字段

**files**

- 类型：字符串数组
- 说明：指定需要被编译的 TypeScript 文件列表。这里的路径不能是目录，只能是文件，且可以省略 `.ts` 后缀。适合需要编译的文件比较少的情况。通常使用`include`而不使用`files`
- 例子：['src/utils/index']

**extends**

- 类型：字符串
- 说明：用于继承其他的`tsconfig.json`配置文件的设置，如果存在相同属性，取当前配置字段
- 例子：'**/base'

**include**

- 类型：字符串数组
- 说明：指定需要编译的文件列表或匹配模式。`include` 可以通过通配符指定目录，如 `"src/**/*"` 表示 `src` 下的所有文件。如果没有指定 `files` 配置，默认值为 `"**/*"`，即项目下所有文件；如果配置了 `files`，默认值为空数组 `[]`
- 例子：`[src/**/*.ts]`

**exclude**

- 类型：字符串数组
- 说明：在 `include` 圈定的范围内，排除掉一些不需要编译的文件。通常用来排除编译输出目录、测试文件目录等。
- 例子：`["node_modules","test","dist"]`

**references**

- 类型：对象数组
- 说明：项目引用，是 TypeScript 3.0 中的一项新功能，它允许将 TypeScript 程序组织成更小的部分。引用其他 TypeScript 项目或配置，以便在构建时能够正确地解析和编译依赖关系。
- 例子：[{ path: './config.json'}]

### compilerOptions字段

[参考链接](https://juejin.cn/post/6844904093568221191?searchId=202502082152127D63D5A6AF6A6A978D85)

