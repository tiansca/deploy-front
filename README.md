# lingxi_front

##目录结构

├── build　　                      # 构建相关  
├── mock　　                       # 项目mock 模拟数据  
├── plop-templates　　             # 基本模板  
├── public                     　　# 静态资源  
│　　│── favicon.ico            　　# favicon图标  
│　　└── index.html             　　# html模板  
├── src                        　　# 源代码  
│　　├── api                    　　# 所有请求  
│　　├── assets                 　　# 主题 字体等静态资源  
│　　├── components             　　# 全局公用组件  
│　　├── directive              　　# 全局指令  
│　　├── filters                　　# 全局 filter  
│　　├── icons                  　　# 项目所有 svg icons  
│　　├── lang                   　　# 国际化 language  
│　　├── layout                 　　# 全局 layout  
│　　├── router                 　　# 路由  
│　　├── store                  　　# 全局 store管理  
│　　├── styles                 　　# 全局样式  
│　　├── utils                  　　# 全局公用方法  
│　　├── vendor                 　　# 公用vendor  
│　　├── views                  　　# views 所有页面  
│　　├── App.vue                　　# 入口页面  
│　　├── main.js                　　# 入口文件 加载组件 初始化等  
│　　└── permission.js          　　# 权限管理  
├── tests                      　　# 测试  
├── .env.xxx                   　　# 环境变量配置  
├── .eslintrc.js               　　# eslint 配置项  
├── .babelrc                   　　# babel-loader 配置  
├── .travis.yml                　　# 自动化CI配置  
├── vue.config.js              　　# vue-cli 配置  
├── postcss.config.js          　　# postcss 配置  
└── package.json               　　# package.json  

1、建议根据业务模块来划分 views，并且 将views 和 api 两个模块一一对应，从而方便维护。
2、components 放置的都是全局公用的一些组件，如上传组件，富文本等等。一些页面级的组件建议还是放在各自views文件下，方便管理。如图：

## 安装与构建

```bash
# 克隆项目
git clone http://gitlab.lingxidata.net/vue/lingxi-cyjc.git

# 进入项目目录
cd lingxi-cyjc

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
## mock data
本项目所有的数据都是用 mockjs 模拟生成。它的原理是: 拦截了所有的请求并代理到本地，然后进行数据模拟，所以你会发现 network 中没有发出任何的请求。
当我们本地使用 Mock.js 模拟本地数据，线上使用真实环境 api 方法。我们主要是判断：是线上环境的时候，不引入 mock 数据就可以了，只有在本地引入 Mock.js。  
`// main.js`  
 `// 通过环境变量来判断是否需要加载启用 `   
 `if (process.env.NODE_ENV === 'development') {  `    
 　`require('./mock') // simulation data  `  
 `}`

##和服务端进行交互
在 vue-element-admin 中，一个完整的前端 UI 交互到服务端处理流程是这样的：

1、UI 组件交互操作；  
2、调用统一管理的 api service 请求函数；  
3、使用封装的 request.js 发送请求；  
4、获取服务端返回；  
5、更新 data；  
从上面的流程可以看出，为了方便管理维护，统一的请求处理都放在 @/src/api 文件夹中，并且一般按照 model 纬度进行拆分文件，如：

api/  
　　login.js  
　　article.js  
　　remoteSearch.js  
　　...

##### request.js
其中，@/src/utils/request.js 是基于 axios 的封装，便于统一处理 POST，GET 等请求参数，请求头，以及错误提示信息等。  
具体可以参看 request.js。 它封装了全局 request拦截器、response拦截器、统一的错误处理、统一做了超时处理、baseURL设置等。

## 路由和权限
这里的路由分为两种，constantRoutes 和 asyncRoutes。

constantRoutes： 代表那些不需要动态判断权限的路由，如登录页、404、等通用页面。

asyncRoutes： 代表那些需求动态判断权限并通过 addRoutes 动态添加的页面。
##### 权限
该项目中权限的实现方式是：通过获取当前用户的权限去比对路由表，生成当前用户具的权限可访问的路由表，通过 router.addRoutes 动态挂载到 router 上。  
但其实很多公司的业务逻辑可能不是这样的，举一个例子来说，很多公司的需求是每个页面的权限是动态配置的，不像本项目中是写死预设的。但其实原理是相同的。  
如：你可以在后台通过一个 tree 控件或者其它展现形式给每一个页面动态配置权限，之后将这份路由表存储到后端。当用户登录后得到 roles，前端根据roles 去向后端请求可访问的路由表，从而动态生成可访问页面，之后就是 router.addRoutes 动态挂载到 router 上，你会发现原来是相同的，万变不离其宗。

只是多了一步将后端返回路由表和本地的组件映射到一起。相关issue

##ESLint
不管是多人合作还是个人项目，代码规范都是很重要的。这样做不仅可以很大程度地避免基本语法错误，也保证了代码的可读性。  

## 相关项目
- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

- [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)

- [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template)

- [awesome-project](https://github.com/PanJiaChen/vue-element-admin/issues/2312)

写了一个系列的教程配套文章，如何从零构建后一个完整的后台项目:

- [手摸手，带你用 vue 撸后台 系列一(基础篇)](https://juejin.im/post/59097cd7a22b9d0065fb61d2)
- [手摸手，带你用 vue 撸后台 系列二(登录权限篇)](https://juejin.im/post/591aa14f570c35006961acac)
- [手摸手，带你用 vue 撸后台 系列三 (实战篇)](https://juejin.im/post/593121aa0ce4630057f70d35)
- [手摸手，带你用 vue 撸后台 系列四(vueAdmin 一个极简的后台基础模板,专门针对本项目的文章,算作是一篇文档)](https://juejin.im/post/595b4d776fb9a06bbe7dba56)
- [手摸手，带你封装一个 vue component](https://segmentfault.com/a/1190000009090836)

更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)



