---
outline: deep
---

### SplitChunk的使用

#### 1. webpack chunk分包原理

- 同一个entry入口模块与它的同步依赖组织成一个chunk,还包括runtime（webpackBootstrap 自执行函数的形式）
- 每一个**异步模块**与它的同步依赖单独组成一个 chunk。其中只会包含**入口 chunk 中不存在的同步依赖**；若存在同步第三方包，也会被单独打包成一个 chunk。

那么，`SplitChunksPlugin` 就是在这个基础上再做优化了，也就是对这些 chunk 进行进一步的组合/分割。

#### 2.why & how? 为何要代码分割以及如何分割

[Code Splitting](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.docschina.org%2Fguides%2Fcode-splitting%2F) 拆包优化的最终目标是什么？无非是：

1. 把更新频率低的代码和内容频繁变动的代码分离，把共用率较高的资源也拆出来，最大限度利用浏览器缓存。
2. 减少 http 请求次数的同时避免单个文件太大以免拖垮响应速度，也就是拆包时尽量实现`文件个数更少`、`单个文件体积更小`。

第二点的两个目标是互相矛盾的，因此要达到两者之间的平衡是个**博弈**的过程，没有太绝对的拆包策略，都是力求提高性能水准罢了。

具体来说，比如一些第三方插件，更新频率其实很低，单个体积通常又较小，就很适合打包在一个文件里。而 `UI 组件库`更新少的同时体积却比较大，就可以单独打成一个包(也有直接用 `CDN `外链的)。还有开发者写的公共组件，一般写完后修改也不多，适合拎出来放一个文件。

`webpack` 配置`output.filename`或`output.chunkFilename`值中的**[contenthash]**使得重新打包时若` chunk `内容没有变化，就跳过直接使用缓存，当然对应的输出文件名称中的 `hash `值也不会改变。这样既能提高二次构建速度，又能不影响用户的浏览器缓存。
为何配置文件名时在[取值占位符](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.docschina.org%2Fconfiguration%2Foutput%2F%23template-strings)里使用**[contenthash]**而不是**[chunkhash]**呢？
`chunkhash`是 `chunk` 级别的 `hash` 值。但在项目中我们通常的做法是把` css` 都抽离出来，作为模块import到对应的 `js` 文件中。如果使用**[chunkhash]**，两个关联的 `js` 和 `css` 文件名的 `hash` 值是一样的。一旦其中一个改动了，与其关联的另一个文件即使毫无变化，文件名也会改变，缓存也就失效了。
而**[contenthash]**，只关注文件本身，自身内容不变，hash 值也不会变。

其余剩下的基本就是我们的业务代码，改动频率就很大了，是每次发布版本都会变的。

#### 3.常用的代码分离与方法

- **入口起点**：通过 [entry](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.docschina.org%2Fconfiguration%2Fentry-context%2F%23entry) 配置手动地分离代码。
- **防止重复**：使用 [Entry dependencies](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.docschina.org%2Fconfiguration%2Fentry-context%2F%23dependencies) 或者 内置插件 [SplitChunksPlugin](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.docschina.org%2Fplugins%2Fsplit-chunks-plugin) 去重和分离 chunk。
- **动态导入**：通过异步引入模块(如import('./m.js'))来分离代码。

#### 4.webpackChunkName

异步加载的 chunk 无法通过 webpack 配置自定义打包后的名称，默认都是以0、1、2...这样的数字命名。
魔法注释可以帮助我们自定义异步 chunk 名。

```javascript
component: () => import(/* webpackChunkName: "route-login" */ '@/views/login')
// 如果想把某个路由下的所有组件都打包在同一个异步块 (chunk) 中。那么在webpackChunkName注释提供相同的 chunk name 即可。

// Webpack 会将任何一个异步模块与相同的块名称组合到相同的异步块中。
```

如果想把某个路由下的所有组件都打包在同一个异步块 (chunk) 中。那么在webpackChunkName注释提供相同的 chunk name 即可。

```javascript
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

`Webpack` 会将任何一个异步模块与相同的块名称组合到相同的异步块中。

#### 5.`SplitChunksPlugin`配置详解

先看下**`SplitChunksPlugin`**插件的默认配置，再结合实例来搞懂每个配置项真正的用处。
`webpack` 上的文档地址：[【SplitChunksPlugin API】](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.docschina.org%2Fplugins%2Fsplit-chunks-plugin%2F)

```javascript
module.exports = {
  // 加上入口和输出的配置，以便结合实际说明
  entry: {
    index: './src/a',
    admin: './src/b'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:6].js',
    chunkFilename: '[name].[contenthash:8].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'async', // 2. 处理的 chunk 类型
      minSize: 20000, // 4. 允许新拆出 chunk 的最小体积
      minRemainingSize: 0,
      minChunks: 1, // 5. 拆分前被 chunk 公用的最小次数
      maxAsyncRequests: 30, // 7. 每个异步加载模块最多能被拆分的数量
      maxInitialRequests: 30, // 6. 每个入口和它的同步依赖最多能被拆分的数量
      enforceSizeThreshold: 50000, // 8. 强制执行拆分的体积阈值并忽略其他限制
      cacheGroups: { // 1. 缓存组
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/, // 1.1 模块路径/文件名匹配正则
          priority: -10, // 1.2 缓存组权重
          reuseExistingChunk: true, // 1.3 复用已被拆出的依赖模块，而不是继续包含在该组一起生成
        },
        default: {
          minChunks: 2, // 5. default 组的模块必须至少被 2 个 chunk 共用 (本次分割前)
          priority: -20,
          reuseExistingChunk: true,
        }
      }
    },
  },
}
```

### 拆包

#### 文件以内容摘要 hash 值命名以实现持久缓存

通过对output.filename和output.chunkFilename的配置，利用[contenthash]占位符，为js文件名加上根据其内容生成的唯一 hash 值，**轻松实现资源的长效缓存**。也就是说，无论是第几次打包，内容没有变化的资源 (如js、css) 文件名永远不会变，而那些有修改的文件就会生成新的文件名 (hash 值) 。

```javascript
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:6].js',
    chunkFilename: '[name].[contenthash:8].js',
  },
}
```

**如果是 webpack 4，还需要分别固定****moduleId**和**chunkId**，以保持名称的稳定性**。
因为 webpack 内部维护了一个自增的数字 id，每个 module 都有一个 id。当增加或删除 module 的时候，id 就会变化，导致其它 module 虽然内容没有变化，但由于 id 被强占，只能自增或者自减，导致整个项目的 module id 的顺序都错乱了。
也就是说，如果引入了一个新模块或删掉一个模块，都可能**导致其它文件的 moduleId 发生改变，相应地文件内容也就改变，缓存便失效了**。
同样地，chunk 的新增/减少也会导致 chunk id 顺序发生错乱，那么原本的缓存就不作数了。

**解决办法：**

- **moduleId**：
  [HashedModuleIdsPlugin](https://links.jianshu.com/go?to=https%3A%2F%2Fv4.webpack.docschina.org%2Fplugins%2Fhashed-module-ids-plugin%2F)插件 (webpack 4) → [optimization.moduleIds: 'deterministic'](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.docschina.org%2Fconfiguration%2Foptimization%2F%23optimizationmoduleids) (webpack 5)
  在` webpack 5 `无需额外配置，使用默认值就好。
- **chunkId**：
  [NamedChunksPlugin]()插件 (webpack 4) → [optimization.chunkIds](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.docschina.org%2Fconfiguration%2Foptimization%2F%23optimizationchunkids) (webpack 5)
  但这个方法只对命名 chunk 有效，我们的懒加载页面生成的 chunk 还需要额外设置，如vue-cli 4的处理：

```javascript
// node_modules/@vue/cli-service/lib/config/app.js
chainWebpack: (config) => {
  config
    .plugin('named-chunks')
    .use(require('webpack/lib/NamedChunksPlugin'), [(chunk) => {
      if (chunk.name) {
        return chunk.name
      }
      const hash = require('hash-sum')
      const joinedHash = hash(
        Array.from(chunk.modulesIterable, m => m.id).join('_')
      )
      return `chunk-${joinedHash}`
    }])
}
```

在 webpack 5 optimization.chunkIds默认开发环境'named'，生产环境'deterministic'，因此我们**无需设置该配置项。而且 webpack 5 更改了 id 生成算法，异步 chunk 也能轻松拥有固定的 id 了**。

##### 至于图片和 CSS 文件

- CSS 是通过 [mini-css-extract-plugin](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.docschina.org%2Fplugins%2Fmini-css-extract-plugin%2F) 插件的filename和chunkFilename定义文件名，值用 hash 占位符如[contenthash:8]实现缓存配置的。
- 而图片文件，是在 [file-loader](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Ffile-loader) 的 name 配置项用[contenthash]处理的。
  注 ⚠️：webpack 5 废弃了 file-loader，改用 [output.assetModuleFilename](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.docschina.org%2Fguides%2Fasset-modules%2F%23custom-output-filename) 定义图片字体等资源文件的名称，如assetModuleFilename: 'images/[contenthash][ext][query]'。

#### SplitChunksPlugin 拆包实战

##### vue-cli 4 默认处理

结合`vue-cli 4` 搭的项目，来看下 `vue-cli` 通过 [chainWebpack](https://links.jianshu.com/go?to=https%3A%2F%2Fcli.vuejs.org%2Fzh%2Fguide%2Fwebpack.html%23%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7) 覆盖掉 `SplitChunksPlugin cacheGroups`项默认值的配置(整理后)：
(vue-cli chainWebpack配置处大致是node_modules/@vue/cli-service/lib/config/app.js:38)

```javascript
module.exports = {
  entry: {
    app: './src/main',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'async', // 只处理异步 chunk，这里两个缓存组都另配了 chunks，那么就被无视了
      minSize: 30000, // 允许新拆出 chunk 的最小体积
      maxSize: 0, // 旨在与 HTTP/2 和长期缓存一起使用。它增加了请求数量以实现更好的缓存。它还可以用于减小文件大小，以加快二次构建速度。
      minChunks: 1, // 拆分前被 chunk 公用的最小次数
      maxAsyncRequests: 5, // 每个异步加载模块最多能被拆分的数量
      maxInitialRequests: 3, // 每个入口和它的同步依赖最多能被拆分的数量
      automaticNameDelimiter: '~',
      cacheGroups: { // 缓存组
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 缓存组权重，数字越大优先级越高
          chunks: 'initial' // 只处理初始 chunk
        },
        common: {
          name: `chunk-common`,
          minChunks: 2, // common 组的模块必须至少被 2 个 chunk 共用 (本次分割前)
          priority: -20,
          chunks: 'initial', // 只针对同步 chunk
          reuseExistingChunk: true // 复用已被拆出的依赖模块，而不是继续包含在该组一起生成
        }
      },
    },
  },
}
```

运行打包后，发现入口文件依赖的第三方包被全数拆出放进了`chunk-vendors.js`，剩下的同步依赖都被打包进了`app.js`，而其他都是懒加载组件生成的异步 chunk。并没有打包出所谓的公共模块合集`chunk-common.js`。(module 被两个以上chunk所应用，那么拆分module 生成打包文件)

解读下此配置的拆分实现：

1. 入口来自 node_modules 文件夹的同步依赖放入chunk-vendors；
2. 被至少 2 个 同步 chunk 共享的模块放入chunk-common；
3. 符合每个缓存组其他条件的情况下，能拆出的模块整合后的体积必须大于30kb(*在进行 min+gz 之前的体积*)。**小了不生成新 chunk**。
4. 每个异步引入模块并行请求的数量 (即它本身和它的同步依赖被拆分成的 js 个数)不能多于5个；每个入口文件和它的同步依赖最多能被拆成3个 js。
5. 即使不匹配任何一个缓存组，splitChunks.* 级别的最小 chunk 属性minSize也会影响所有**异步 chunk**，效果是**体积大于minSize值的公共模块（大于等于2个异步chunk引用的模块）会被拆出**。(除非 splitChunks.* chunks: 'initial')
   公共模块即 >= 2个异步 chunk 共享的模块，同minChunks: 2。

### 拆包优化

- **基础类库 chunk-libs**
  构成项目必不可少的一些基础类库，如`vue`+`vue-router`+`vuex`+`axios` 这种标准的全家桶，它们的升级频率都不高，但每个页面都需要它们。(一些全局被共用的，体积不大的第三方库也可以放在其中：比如`nprogress`、`js-cookie`等)

- **UI 组件库**
  理论上 UI 组件库也可以放入 libs 中，但它实在是过大，不管是Element-UI还是Ant Designgzip 压缩完都要 200kb 左右，可能比 libs 里所有的包加起来还要大不少，而且 UI 组件库的更新频率也相对比 libs 要更高一点。我们会及时更新它来解决一些现有的 bugs 或使用一些新功能。**所以建议将 UI 组件库单独拆成一个包**。

- **自定义组件/函数 chunk-commons**
  这里的 commons 分为 必要和非必要。
  **必要组件是指那些项目里必须加载它们才能正常运行的组件或者函数。**比如你的路由表、全局 state、全局侧边栏/Header/Footer 等组件、自定义 Svg 图标等等。这些其实就是你在入口文件中依赖的东西，它们都会默认打包到app.js中。
  非必要组件是指被大部分懒加载页面使用，但在入口文件 entry 中未被引入的模块。比如：一个管理后台，你封装了很多select或者table组件，由于它们的体积不会很大，它们都会被默认打包到到每一个懒加载页面的 chunk 中，这样会造成不少的浪费。你有十个页面引用了它，就会包重复打包十次。所以应该将那些被大量共用的组件单独打包成chunk-commons。
  不过还是要结合具体情况来看。一般情况下，你也可以将那些*非必要组件/函数*也在入口文件 entry 中引入，和*必要组件/函数*一同打包到app.js之中也是没什么问题的。

- **低频组件**
  低频组件和上面的自定义公共组件 chunk-commons 最大的区别是，它们只会在一些特定业务场景下使用，比如富文本编辑器、js-xlsx前端 excel 处理库等。一般这些库都是第三方的且大于30kb (缓存组外的默认minSize值)，也不会在初始页加载，所以 webpack 4 会默认打包成一个独立的 js。一般无需特别处理。小于minSize的情况会被打包到具体使用它的页面 js (异步 chunk) 中。

- **业务代码**
  就是我们平时经常写的业务代码。一般都是按照页面的划分来打包，比如在 vue 中，使用[路由懒加载](https://links.jianshu.com/go?to=https%3A%2F%2Frouter.vuejs.org%2Fzh%2Fguide%2Fadvanced%2Flazy-loading.html)的方式加载页面 component: () => import('./Guide.vue') webpack 默认会将它打包成一个独立的异步加载的 js。

再回观我们之前的`app.js`和`chunk-vendors.js`。它们都是初始加载的` js`，由于体积太大需要在合理范围内拆分成更小一些的 `js`，以利用浏览器的并发请求，优化首页加载体验。

- 为了缩减初始代码体积，通常只抽入口依赖的第三方、另行处理懒加载页面的库依赖更为合理。而我的项目中除了重复的一个，异步模块无其他第三方引入。就简单交由commons缓存组去处理。vue 我通过 webpack 的 [externals](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.docschina.org%2Fconfiguration%2Fexternals%2F%23externals) 配了 CDN，故没有打包进来。
- chunk-vendors.js的Element-UI组件库应单独分出为chunk-elementUI.js，由于它包含在第三方包的缓存组内，要给它设置比libs更高的优先级。
- app.js中图标占了大头可以单独抽出来，把自定义 svg 都放到 chunk-svgIcon.js 中；
- 备一个优先级最低的chunk-commons.js，用于处理其他公共组件

```javascript
splitChunks: {
  chunks: "all",
  minSize: 20000, // 允许新拆出 chunk 的最小体积，也是异步 chunk 公共模块的强制拆分体积
  maxAsyncRequests: 6, // 每个异步加载模块最多能被拆分的数量
  maxInitialRequests: 6, // 每个入口和它的同步依赖最多能被拆分的数量
  enforceSizeThreshold: 50000, // 强制执行拆分的体积阈值并忽略其他限制
  cacheGroups: {
    libs: { // 第三方库
      name: "chunk-libs",
      test: /[\\/]node_modules[\\/]/,
      priority: 10,
      chunks: "initial" // 只打包初始时依赖的第三方
    },
    elementUI: { // elementUI 单独拆包
      name: "chunk-elementUI",
      test: /[\\/]node_modules[\\/]element-ui[\\/]/,
      priority: 20 // 权重要大于 libs
    },
    svgIcon: { // svg 图标
      name: 'chunk-svgIcon',
      test(module) {
        // `module.resource` 是文件的绝对路径
        // 用`path.sep` 代替 / or \，以便跨平台兼容
        // const path = require('path') // path 一般会在配置文件引入，此处只是说明 path 的来源，实际并不用加上
        return (
          module.resource &&
          module.resource.endsWith('.svg') &&
          module.resource.includes(`${path.sep}icons${path.sep}`)
        )
      },
      priority: 30
    },
    commons: { // 公共模块包
      name: `chunk-commons`,
      minChunks: 2,
      priority: 0,
      reuseExistingChunk: true
    }
  },
};
```

好了，这大概就是`splitChunk`的内容，我们修改下`webpack.prod.ts`

```typescript
optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000, // 允许新拆出 chunk 的最小体积，也是异步 chunk 公共模块的强制拆分体积
      maxAsyncRequests: 6, // 每个异步加载模块最多能被拆分的数量
      maxInitialRequests: 6, // 每个入口和它的同步依赖最多能被拆分的数量
      enforceSizeThreshold: 50000, // 强制执行拆分的体积阈值并忽略其他限制
      // 分隔代码
      cacheGroups: {
        libs: {
          // 提取node_modules代码
          test: /node_modules/, // 只匹配node_modules里面的模块
          name: 'chunk-libs', // 提取文件命名为vendors,js后缀和chunkhash会自动加
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          priority: 10 // 提取优先级为1
        },
        // 公共模块包，同步模块 chunks 包含同步和异步
        commons: {
          name: 'chunk-commons', // 提取文件命名为commons
          minChunks: 2, // 只要使用两次就提取出来
          minSize: 0, // 提取代码体积大于0就提取出来
          reuseExistingChunk: true // 复用已被拆出的依赖模块，而不是继续包含在该组一起生成
        }
      }
    },
    // 作用是将包含chunks映射关系的list单独从app.js里提取出来，因为每一个chunk的id基本都是基于内容hash出来的，每次改动都会影响hash值，如果不将其提取，造成每次app.js都会改变。缓存失效
    runtimeChunk: {
      name: 'runtime'
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ['console.log', 'debugger'] // 删除console.log
          }
        }
      })
    ]
  },
```
