---
outline: deep
---

### 1. 版本说明

> nodejs: v16.18.0
>
> pnpm: 7.18.2
>
> webpack:  5.80.0
>
> webpack-cli: 5.0.2
>
> vue: 3.2.47
>
> typescript: 5.0.4

### 2. 代码规范相关配置

#### eslint

1. 安装相关依赖

   ```powershell
   pnpm install eslint @antfu/eslint-config -D
   ```

2. **esling.config.mjs**配置

   ```typescript
   import antfu from '@antfu/eslint-config'
   export default antfu({
     typescript: {
       overrides: {
         'ts/ban-ts-comment': 'off',
         'ts/prefer-ts-expect-error': 'off',
       },
     },
   })
   ```

#### husky&lint-staged&commitizen

1. 安装依赖

   ```powershell
   pnpm dlx husky-init && pnpm install
   ```

2. 添加脚本

   ```powershell
   pnpm pkg set scripts.prepare="husky install"
   pnpm run prepare
   ```

3. 修改`.husky/pre-commit`

   ```sh
   #!/usr/bin/env sh
   . "$(dirname -- "$0")/_/husky.sh"

   pnpm run lint:lint-staged
   ```

4. `lint-staged`

   1. 安装依赖

      ```powershell
      pnpm install lint-staged -D
      ```

   2. 修改`package.json`文件

      ```json
      {
        "lint-staged": {
          "src/**/*.{js,jsx,ts,tsx,vue}": [
            "prettier --write",
            "eslint --fix",
            "git add"
          ]
        }
      }
      ```

5. `commitizen `参考这篇文件配置

   [参考链接](https://segmentfault.com/a/1190000039813329)

### 3. Typescript支持

安装依赖

```powershell
pnpm install typescript webpack webpack-cli -D
pnpm install babel-loader ts-node @babel/core @babel/preset-typescript @babel/preset-env core-js -D
pnpm install @types/node
```

创建`tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["@types/node"],
    "target": "esnext",
    "module": "CommonJS",
    "moduleResolution": "node",
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "strictFunctionTypes": false,
    "jsx": "preserve",
    "baseUrl": "./",
    "allowJs": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "experimentalDecorators": true,
    "lib": [
      "dom",
      "esnext"
    ],
    "incremental": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": [
        "src/*"
      ]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "types/**/*.d.ts",
    "types/**/*.ts",
    "build/**/*.ts",
    "build/**/*.d.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.js"
  ],
  "ts-node": {
    "logError": true,
    "transpileOnly": true
  }
}
```

### 4. webpack.base.ts配置

1. 安装依赖

   ```powershell
   pnpm install webpack webpack-cli html-webpack-plugin vue-loader -D
   ```

2. 通用配置`webpack.base.ts`

   ```typescript
   import HtmlWebpackPlugin from 'html-webpack-plugin'

   import { VueLoaderPlugin } from 'vue-loader'

   import { Configuration } from 'webpack'

   const webpackBaseConfig: Configuration = {
     entry: path.join(__dirname, '../src/main.ts'),
     output: {
       filename: '[name]_[contentHash:8].js',
       path: path.join(__dirname, '../dist'),
       clean: true, // 构建清除
       publicPath: '/' // 构建根路径
     },
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
         }
       ]
     },
     resolve: {
       extensions: ['.vue', '.ts', '.tsx', '.js']
     },
     plugins: [
       new VueLoaderPlugin(),
       new HtmlWebpackPlugin({
         title: 'koona Webpack',
         template: path.join(__dirname, '../public/index.html'),
         filename: 'index.html',
         // 压缩html资源
         minify: {
           collapseWhitespace: true, // 去空格
           removeComments: true // 去注释
         }
       })
     ]
   }

   export default webpackBaseConfig
   ```

3. `.babelrc`的配置

   ```json
   {
     "presets": [
       [
         "@babel/preset-env",
         {
           // 设置兼容目标浏览器版本,也可以在根目录配置.browserslistrc文件,babel-loader会自动寻找上面配置好的文件.browserslistrc
           "targets": { "browsers": ["> 1%", "last 2 versions", "not ie <= 8"] },
           "useBuiltIns": "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
           "corejs": 3, // 配置使用core-js使用的版本
           "loose": true
         }
       ],
       [
         "@babel/preset-typescript",
         {
           "allExtensions": true // 支持所有类型
         }
       ]
     ],
     "plugins": ["@babel/plugin-transform-runtime"]
   }
   ```

4. `package.json`脚本配置

   ```json
   {
     "scripts": {
       "dev": "webpack serve --mode development --config  build/webpack.base.ts",
       "build": "webpack --mode production --config build/webpack.base.ts"
     }
   }
   ```

5. ` src/main.ts /src/App.vue`

   **main.ts**

   ```typescript
   import { createApp } from 'vue'
   
   import App from './App.vue'
   
   const app = createApp(App)
   
   app.mount('#app')
```

   **App.vue**

   ```vue
   <script lang="ts" setup>
   const text = ref('Webpack Build Vue3.x')
   </script>

   <template>
     <div>{{ text }}</div>
   </template>
```

6. `public index.html`

   ```html
   <!DOCTYPE html>
   <html lang="">

   <head>
     <meta charset="utf-8">
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     <meta name="viewport" content="width=device-width,initial-scale=1.0">
     <title>
       <%= htmlWebpackPlugin.options.title %>
     </title>
   </head>

   <body>
     <noscript>
       <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled.
           Please enable it to continue.</strong>
     </noscript>
     <div id="app">
     </div>
   </body>

   </html>
   ```

7. 测试

   ```powershell
   pnpm run dev # dev
   pnpm run build # pro
   ```

   :::tip

   1. 原本解析`.vue`需要`vue-loader & @vue/compiler-sfc`依赖进行模板解析的，但是`vue 3.2.13+`已经内置了`@vue/compile-sfc`
   2. `.vue`的解析除了需要配置`vue-loader`,还必须通过`VueLoaderPlugin`插件进行解析
   3. `webpack5`的`output`中配置了`clean: true`代表清除打包目录，所以无需安装`clean-webpack-plugin`

   :::

### 5. webpack.dev.ts配置

1. 配置相关

   ```typescript
   import path from 'node:path'
   
   import { Configuration as WebpackConfiguration } from 'webpack'
   
   import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
   
   import { merge } from 'webpack-merge'
   
   import webpackBaseConfig from './webpack.base'
   
   interface WebpackDevConfiguraion extends WebpackConfiguration {
     devServer: WebpackDevServerConfiguration
   }
   
   const webpackDevConfig: WebpackDevConfiguraion = merge(webpackBaseConfig, {
     mode: 'development',
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
   }) as WebpacDevConfiguraion
   
   export default webpackDevConfig
```

2. 脚本修改

   ```json
   {
   "scripts": {
      "dev": "webpack serve --config  build/webpack.dev.ts","
    }
   }
```

3. 重新启动下

   ```powershell
   pnpm run dev
   ```


### 6. webpack.prod.ts配置

1. 配置如下

   ```typescript
   import { Configuration } from 'webpack'

   import merge from 'webpack-merge'

   import webpackBaseConfig from './webpack.base'

   const webpackProdConfig: Configuration = merge(webpackBaseConfig, {
     mode: 'production'
   })

   export default webpackProdConfig
   ```

2. 脚本修改

   ```json
   {
     "scripts": {
       "build": "webpack --config build/webpack.prod.ts"
     }
   }
   ```

3. 打包

   ```bash
   pnpm run build
   ```

4. 预览

   1. 使用`serve`预览打包后的文件

      ```powershell
      pnpm install serve -D
      ```

   2. 查看`serve`有哪些配置

      ```bash
      ./node_modules/.bin/serve --help
      ```

   3. 配置脚本

      ```json
      {
        "scripts": {
          "preview": "serve -s dist -C"
        }
      }
      ```

   4. 运行脚本

      ```powershell
      pnpm run preview
      ```
### 7. 拷贝静态资源

1. `favicon.ico`放入`public`文件目录下

2. 安装依赖`copyWebpackPlugin`

   ```powershell
   pnpm install copyWebpackPlugin -D
   ```

3.    修改下`webpack.prod.ts`的配置

   ```typescript
   import path from 'node:path'

   import CopyPlugin from 'copy-webpack-plugin'

   import { Configuration } from 'webpack'

   import merge from 'webpack-merge'

   import webpackBaseConfig from './webpack.base'

   const webpackProdConfig: Configuration = merge(webpackBaseConfig, {
     mode: 'production',
     plugins: [
       new CopyPlugin({
         patterns: [
           {
             from: path.resolve(__dirname, '../public'),
             to: path.resolve(__dirname, '../dist'),
             filter: source => !source.includes('index.html')
           }
         ]
       })
     ]
   })

   export default webpackProdConfig
   ```

4. `pnpm run dev`本地运行结果

5. `pnpm run build`后`pnpm run preview`查看运行结果

### 8. 环境变量配置

1. 安装依赖

   ```shell
   pnpm install cross-env dotenv-webpack -D
   pnpm install @types/dotenv-webpack
   ```

2. 修改`scripts`

   ```json
   {
     "scripts": {
       "dev": "cross-env BASE_ENV=dev webpack serve --config  build/webpack.dev.ts",
       "build": "cross-env BASE_ENV=pro webpack --config build/webpack.prod.ts"
     }
   }
   ```

   其中的`BASE_ENV`是为了区分环境使用，使用`cross-env`是为了兼容平台

3. 修改`webpack.base.ts`的配置

   ```typescript
   import { Configuration, DefinePlugin } from 'webpack'

   import path from 'path'

   import HtmlWebpackPlugin from 'html-webpack-plugin'

   import { VueLoaderPlugin } from 'vue-loader'

   import Dotenv from 'dotenv-webpack'

   const webpackBaseConfig: Configuration = {
     entry: path.join(__dirname, '../src/main.ts'),
       new Dotenv({
         path: path.join(__dirname, '../.env.' + process.env.BASE_ENV)
       }),
       // 配置的全局变量
       new DefinePlugin({
         __VUE_OPTIONS_API__: false,
         __VUE_PROD_DEVTOOLS__: false,
         GLOBAL_INFO: JSON.stringify({
           BASE_ENV: process.env.BASE_ENV,
           NODE_ENV: process.env.NODE_ENV
         })
       })
     ]
   }
   ```

4. 新建环境配置文件（目前设置了两个）

   `.env.dev`

   ```
   APP_API_URL=https://development.com
   ```

   `.env.pro`

   ```
   APP_API_URL=https://production.com
   ```

   :::warning 文件名的后缀需要和`BASE_ENV`的值保持一致

   :::

5. 将`definePlugin`配置的环境变量进行声明

   `global.d.ts`

   ```typescript
   declare global {
     const __VUE_OPTIONS_API__: boolean
     const __VUE_PROD_DEVTOOLS__: boolean
     const GLOBAL_INFO: {
       NODE_ENV: string
       BASE_ENV: string
     }
     // ***
   }
   ```

6. `APP.vue`文件中进行使用

   ```vue
   <script lang="ts" setup>
   const { BASE_ENV } = GLOBAL_INFO
   const { NODE_ENV } = process.env
   </script>
   
   <template>
     <div>Webpack Build Vue3.x</div>
     <div>{{ BASE_ENV }}</div>
     <div>{{ NODE_ENV }}</div>
   </template>
   ```

   💡:此时的`GLOBAL_INFO`的`eslint`会报错，我是通过在`eslint`中添加`globals`解决的，如果有更好的方案，可以提`issue`

### 9.文件别名

1. 修改下`webpack.base.ts`的配置

   ```typescript
   export default {
     resolve: {
       extensions: ['.vue', '.ts', '.tsx', '.js'],
       alias: {
         '@': path.join(__dirname, '../src')
       },
       modules: [path.resolve(__dirname, '../node_modules')], // 只在本项目的node_modules中查找
     }
   }
   ```

2. 修改下`tsconfig.json`的配置

   ```json
   {
     "paths": {
       "@/*": ["src/*"]
     }
   }
   ```

### 10. 样式文件处理

1. 安装相关依赖

   ```shell
   pnpm install css css-loader style-loader less less-loader sass-loader sass stylus stylus-loader -D
   ```

2. 生成`loader`配置

   ```typescript
   enum STYLE_ENUM {
     CSS = 'css',
     SASS = 'sass',
     LESS = 'less',
     STYLUS = 'stylus',
     SCSS = 'scss'
   }
   const loaderRegexs = {
     [STYLE_ENUM.CSS]: /\.css$/,
     [STYLE_ENUM.SASS]: /\.(scss|sass)$/,
     [STYLE_ENUM.LESS]: /\.less$/,
     [STYLE_ENUM.STYLUS]: /\.styl$/
   }

   const styleLoadersArray = ['style-loader', 'css-loader']

   const loaderOptions = [
     {
       key: STYLE_ENUM.LESS,
       options: {
         lessOptions: {
           javascriptEnabled: true
         }
       }
     },
     {
       key: STYLE_ENUM.SASS
     },
     {
       key: STYLE_ENUM.LESS
     },
     {
       key: STYLE_ENUM.STYLUS
     }
   ]

   export function generateCssLoader() {
     const ret = []
     for (const { key, options } of loaderOptions) {
       if (key === STYLE_ENUM.SASS) {
         ret.push({
           test: loaderRegexs.sass,
           use: [...styleLoadersArray, 'sass-loader']
         })
       }
       else if (key === STYLE_ENUM.CSS) {
         ret.push({
           test: loaderRegexs[key],
           use: [...styleLoadersArray]
         })
       }
       else {
         options
           ? ret.push({
               test: loaderRegexs[key],
               use: [
                 ...styleLoadersArray,
                 {
                   loader: `${key}-loader`,
                   options: { ...options }
                 }
               ]
             })
           : ret.push({
               test: loaderRegexs[key],
               use: [...styleLoadersArray, `${key}-loader`]
             })
       }
     }
     return ret
   }
   ```

3. 修改`webpack.base.ts`文件

   ```typescript
   import path from 'node:path'

   import Dotenv from 'dotenv-webpack'

   import HtmlWebpackPlugin from 'html-webpack-plugin'

   import { VueLoaderPlugin } from 'vue-loader'

   import { Configuration, DefinePlugin } from 'webpack'

   import { generateCssLoader } from './utils'

   const webpackBaseConfig: Configuration = {
     entry: path.join(__dirname, '../src/main.ts'),
     output: {
       filename: '[name]_[contenthash:8].js',
       path: path.join(__dirname, '../dist'),
       clean: true,
       publicPath: '/'
     },
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
         // 这里便是样式loader的规则配置
         ...generateCssLoader()
       ]
     },
     resolve: {
       extensions: ['.vue', '.ts', '.tsx', '.js', '.less', '.scss', '.sass', '.styl'],
       alias: {
         '@': path.join(__dirname, '../src')
       }
     },
     plugins: [
       new VueLoaderPlugin(),
       new HtmlWebpackPlugin({
         title: 'Koona Webpack',
         template: path.join(__dirname, '../public/index.html'),
         filename: 'index.html',
         // 压缩html资源
         minify: {
           collapseWhitespace: true, // 去空格
           removeComments: true // 去注释
         }
       }),
       new Dotenv({
         path: path.join(__dirname, `../.env.${process.env.BASE_ENV}`)
       }),
       new DefinePlugin({
         __VUE_OPTIONS_API__: false,
         __VUE_PROD_DEVTOOLS__: false,
         GLOBAL_INFO: JSON.stringify({
           BASE_ENV: process.env.BASE_ENV,
           NODE_ENV: process.env.NODE_ENV
         })
       })
     ]
   }

   export default webpackBaseConfig
   ```

4. 样式文件进行测试（只测试了sass）

   `variable.module.scss`

   ```scss
   $color: #e5e5e5;
   $globalBgColor: #F8F8F8;
   $globalHeaderBg: #fff;

   $themeColor: #3E68FF;
   $defaultColor: #333;
   $secondaryColor: #666;
   $thirdColor: #999;
   $titleColor: #13284B;
   $tipColor: #FF6160;

   $basicWidth: 1200px;
   $globalHeaderHeight: 60px;
   $globalFooterHeight: 40px;
   ```

5. 引入样式文件

   ```vue
   <script lang="ts" setup>
   const { BASE_ENV } = GLOBAL_INFO
   const { NODE_ENV } = process.env
   </script>

   <template>
     <div>Webpack Build Vue3.x</div>
     <p>{{ BASE_ENV }}</p>
     <p class="theme-color">
       {{ NODE_ENV }}
     </p>
   </template>

   <style lang="scss">
   @use '@/styles/variable.module.scss' as variableModule;
   .theme-color {
     color: variableModule.$themeColor;
   }
   </style>
   ```

6. 兼容`css3`

   1. 依赖安装

      ```shell
      pnpm install postcss postcss-loader autoprefixer -D
      ```

   2. 新建`postcss.config.js`

      ```javascript
      module.exports = {
        plugins: {
          autoprefixer: {},
        },
      }
      ```

   3. `.browserslistrc`兼容浏览器清单

      ```
      > 1%
      last 2 versions
      ```

   4. 修改生成样式loader规则

      ```typescript
      // 将postcss-loader加入默认loader解析列表中
      const styleLoadersArray = ['style-loader', 'css-loader', 'postcss-loader']
      ```

### 11. 图片字体媒体json文件等资源处理

1. 图片字体媒体

`webpack5`之前，通常使用`raw-loader`、`url-loader`、`file-loader`处理图片字体文件，`webpack`使用`assets module`进行静态资源处理

修改下`webpack.base.ts`配置

```
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
    parser: {
      dataUrlCondition: {
        maxSize: 30 * 1024
      }
    },
    generator: {
      filename: 'media/[hash][ext][query]' // 文件输出目录和命名
    }
}
```

2. json文件

修改下`webpack.base.ts`

```typescript
{
    // 匹配json文件
    test: /\.json$/,
    type: "asset/resource", // 将json文件视为文件类型
    generator: {
      // 这里专门针对json文件的处理
      filename: "json/[name].[hash][ext][query]",
    },
}
```

### 12. 热更新

在`webpack4`中，还需要在插件中添加了`HotModuleReplacementPlugin`，在`webpack5`中，只要`devServer.hot`为`true`了，该插件就已经内置了。

### 完结

只此，我们完成基础的框架搭建以及常见资源的`loader`配置，下一篇主要是针对的是打包性能优化

### 2023.5.24

本次更新主要是让`vue3`支持`jsx/tsx`

1. 安装依赖

   ```shell
   pnpm add @vue/babel-plugin-jsx -D
   ```

2. 修改`.babelrc`的配置

   ```js
   {
     "presets": [
       [
         "@babel/preset-env",
         {
           // 设置兼容目标浏览器版本,也可以在根目录配置.browserslistrc文件,babel-loader会自动寻找上面配置好的文件.browserslistrc
           "useBuiltIns": "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
           "corejs": 3, // 配置使用core-js使用的版本
           "loose": true
         }
       ],
       [
         "@babel/preset-typescript",
         {
           "isTSX": true, // 必须设置，否者编译tsx时会报错
           "allowNamespaces": true,
           "allExtensions": true // 必须设置，否者编译.vue 文件中ts 代码会报错
         }
       ]
     ],
     "plugins": ["@vue/babel-plugin-jsx", ["@babel/plugin-transform-runtime"]]
   }
   ```

3. 新建`tsx`

   ```tsx
   import { defineComponent } from 'vue'

   export default defineComponent({
     setup() {
       return () => <div>This is Vue JSX Component!</div>
     }
   })
   ```

4. 重新编译后，发现热更新存在问题，个人的解决方案是开发环境配置`runtime chunk`

   ```typescript
   const webpackBaseConfig: Configuration = {
     // ...
     optimization: {
       runtimeChunk: {
         name: 'runtimeChunk'
       }
     }
   }
   ```
