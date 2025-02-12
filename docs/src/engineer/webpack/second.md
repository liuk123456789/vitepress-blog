---
outline: deep
---

### 前言
本章主要通过插件&配置完成打包的优化

### 1.构建进度美化

通过使用`webpackbar`来配置构建进度条美化

1. 安装依赖

   ```bash
   pnpm install webpackbar -D
   ```

2. 修改`webpack.base.ts`配置

   ```typescript
   import WebpackBar from 'webpackbar'
   
   const webpackBaseConfig: Configuration = {
     // stats:精准获取bundle信息的显示
     stats: process.env.NODE_ENV === 'development' ? 'errors-only' : 'normal',
     plugins: [
       new WebpackBar({
         color: '#3E68FF', // 构建进度条颜色
         profile: false // 是否收集构建性能数据
       })
     ]
   }
   ```
    :::tip 本打算使用`friendly-errors-webpack-plugin`,，但是写这篇文章时，其暂时不支持，所以改用了`stats`
    `stats`[预设项](https://www.webpackjs.com/configuration/stats/#root)
    :::

### 2.持久化缓存

`webpack5`之前通常使用`cache-loader`进行缓存配置，还有模块缓存插件`hard-source-webpack-plugin`，配置好缓存后第二次打包，通过对文件做哈希对比来验证文件前后是否一致，如果一致则采用上一次的缓存，可以极大地节省时间。

`webpack5` 较于 `webpack4`，新增了持久化缓存、改进缓存算法等优化，通过配置，来缓存生成的 `webpack` 模块和 `chunk`，改善下一次打包的构建速度,可提速 `90%` 左右,配置也简单，修改`webpack.base.ts`：

```typescript
const webpackBaseConfig: Configuration = {
  cache: {
    type: 'filesystem'
  }
}
```

### 3.include&exclude 缩小构建目标

```typescript
const webpackBaseConfig: Configuration = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // babel
      {
        test: /\.js$/,
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file),
        use: ['babel-loader']
      },
      // ts
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      ...generateCssLoader(),
      {
        test: /\.(png|jpe?g|gif|svg|bmp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024 // 小于30kb 转 base64
          }
        },
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: 'asset', // type选择asset
        exclude: /node_modules/,
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'fonts/[hash][ext][query]' // 文件输出目录和命名
        }
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: 'asset', // type选择asset
        exclude: /node_modules/,
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024
          }
        },
        generator: {
          filename: 'media/[hash][ext][query]' // 文件输出目录和命名
        }
      },
      {
        // 匹配json文件
        test: /\.json$/,
        exclude: /node_modules/,
        type: 'asset/resource', // 将json文件视为文件类型
        generator: {
          // 这里专门针对json文件的处理
          filename: 'json/[name].[hash][ext][query]'
        }
      }
    ]
  }
}
```

### 4.`Devtools`配置

开发过程中或者打包后的代码都是`webpack`处理后的代码，如果进行调试肯定希望看到源代码，而不是编译后的代码，`source map`就是用来做源码映射的，不同的映射模式会明显影响到构建和重新构建的速度，`devtool`选项就是`webpack`提供的选择源码映射方式的配置。

`devtool`命名规则

```tex
^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$
```

| 关键字      | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| `inline`    | 代码内通过 `dataUrl` 形式引入 `SourceMap`                    |
| `hidden`    | 生成 `SourceMap` 文件,但不使用                               |
| `eval`      | `eval(...)` 形式执行代码,通过 `dataUrl` 形式引入 `SourceMap` |
| `nosources` | 不生成 `SourceMap`                                           |
| `cheap`     | 只需要定位到行信息,不需要列信息                              |
| `module`    | 展示源代码中的错误位置                                       |

开发环境推荐：`eval-cheap-module-source-map`

- 本地开发首次打包慢点没关系，因为 `eval` 缓存的原因，热更新会很快
- 开发中，我们每行代码不会写的太长，只需要定位到行就行，所以加上 `cheap`
- 我们希望能够找到源代码的错误，而不是打包后的，所以需要加上 `module`

修改`webpack.dev.ts`

```typescript
const webpackDevConfig: WebpackDevConfiguraion = merge(webpackBaseConfig, {
  mode: 'development',
  // devtool配置
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 9527,
    open: true,
    compress: false,
    hot: true,
    historyApiFallback: true, // history 404
    setupExitSignals: true, // 允许SIGINT和SIGTERM信号关闭开发服务器和退出进程
    static: {
      directory: path.join(__dirname, '../public')
    },
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
}) as WebpackDevConfiguraion

export default webpackDevConfig
```

### 5.打包体积分析

**依赖安装**

```shell
   pnpm install webpack-bundle-analyzer -D
   pnpm install @types/webpack-bundle-analyzer -D
```

**新建`webpack.analy.ts`**

```typescript
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import { merge } from 'webpack-merge'

import webpackProConfig from './webpack.prod'

const webpackAnalyConfig = merge(webpackProConfig, {
  plugins: [
    new BundleAnalyzerPlugin() // 配置分析打包结果插件
  ]
})

export default webpackAnalyConfig
```

**package.json添加脚本**

```json
{
  "scripts": {
    "build:analy": "cross-env NODE_ENV=production BASE_ENV=pro webpack -c build/webpack.analy.ts"
  }
}
```

**执行`pnpm run build:analy`**

### 6.css抽离&压缩

**依赖安装**

```shell
pnpm add mini-css-extract-plugin css-minimizer-webpack-plugin -D
```

**生产和开发环境单独配置**

修改`build/utils`

```typescript
const isDev = process.env.NODE_ENV = 'development'

const styleLoadersArray = [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  'css-loader',
  'postcss-loader'
]
```

**修改webpack.prod.ts进行样式抽离**

```typescript
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const webpackProdConfig: Configuration = merge(webpackBaseConfig, {
  // ...
  mode: 'production',
  plugins: [
    // ...
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css' // 抽离css的输出目录和名称
    })
  ]
})
```

**修改webpack.prod.ts进行样式压缩**

```typescript
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'

const webpackProdConfig: Configuration = merge(webpackBaseConfig, {
  // ...
  mode: 'production',
  // ...
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
    ],
  },
  plugins: [
    // ...
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css' // 抽离css的输出目录和名称
    })
  ]
})
```

### 7.js压缩

设置`mode`为`production`时,`webpack`会使用内置插件`terser-webpack-plugin`压缩`js`文件,该插件默认支持多线程压缩,但是上面配置`optimization.minimizer`压缩`css`后,`js`压缩就失效了,需要手动再添加一下,`webpack`内部安装了该插件,由于`pnpm`解决了幽灵依赖问题,如果用的`pnpm`的话,需要手动再安装一下依赖。

**安装依赖**

```shell
pnpm install terser-webpack-plugin compression-webpack-plugin -D
```

**修改webpack.prod.ts配置**

```typescript
import path from 'node:path'

import CompressionPlugin from 'compression-webpack-plugin'

import TerserPlugin from 'terser-webpack-plugin'

import { Configuration } from 'webpack'
import merge from 'webpack-merge'

import webpackBaseConfig from './webpack.base'

const webpackProdConfig: Configuration = merge(webpackBaseConfig, {
  mode: 'production',
  runtimeChunk: {
    name: 'mainifels'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ['console.log', 'debugger'] // 删除console.log
          }
        }
      })
    ],
  },
  plugins: [
    // 打包时生成gzip文件
    new CompressionPlugin({
      test: /\.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8 // 压缩率,默认值是 0.8
    })
  ]
})

export default webpackProdConfig
```

### 9.文件指纹

**说明**

项目维护的时候，一般只会修改一部分代码，可以合理配置文件缓存，来提升前端加载页面速度和减少服务器压力，而 `hash` 就是浏览器缓存策略很重要的一部分。`webpack` 打包的 `hash` 分三种：

- `hash`：跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的 `hash` 值都会更改，并且全部文件都共用相同的 `hash` 值

- `chunkhash`：不同的入口文件进行依赖文件解析、构建对应的`chunk`，生成对应的哈希值，文件本身修改或者依赖文件修改，`chunkhash` 值会变化

- `contenthash`：每个文件自己单独的 `hash` 值，文件的改动只会影响自身的 `hash` 值

`hash` 是在输出文件时配置的，格式是 `filename: "[name].[chunkhash:8][ext]"`，`[xx]` 格式是 `webpack` 提供的占位符，`:8` 是生成 `hash` 的长度。

**修改webpack.base.ts更改静态资源hash**

```typescript
const webpackBaseConfig: Configuration = {
  entry: path.join(__dirname, '../src/main.ts'),
  stats: process.env.NODE_ENV === 'development' ? 'errors-only' : 'normal',
  output: {
    filename: '[name]_[chunkhash:8].js'
    // ...
  },
  module: {
    rules: [
      // ...
      {
        test: /\.(png|jpe?g|gif|svg|bmp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024 // 小于30kb 转 base64
          }
        },
        generator: {
          filename: 'images/[name].[contenthash:8].[ext]'
        }
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: 'asset', // type选择asset
        exclude: /node_modules/,
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'fonts/[name].[contenthash:8][ext]' // 文件输出目录和命名
        }
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: 'asset', // type选择asset
        exclude: /node_modules/,
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024
          }
        },
        generator: {
          filename: 'media/[name].[contenthash:8][ext]' // 文件输出目录和命名
        }
      },
      {
        // 匹配json文件
        test: /\.json$/,
        exclude: /node_modules/,
        type: 'asset/resource', // 将json文件视为文件类型
        generator: {
          // 这里专门针对json文件的处理
          filename: 'json/[name].[contenthash:8][ext]'
        }
      }
    ]
  },
}
```

**修改webpack.prod.ts更改css的hash**

```typescript
const webpackProdConfig: Configuration = merge(webpackBaseConfig, {
  mode: 'production',
  // ...
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css' // 抽离css的输出目录和名称
    }),
  ]
})
```
