import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import permission from '@/directive/permission/index.js'

// 全局过滤器
import * as filters from '@/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'development') {
// mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

import loading from './utils/loading.js'
import { setToken } from '@/utils/auth' // 引入loading
Vue.use(loading) // 全局使用loading
Vue.use(permission)

// import BaiduMap from 'vue-baidu-map'
// Vue.use(BaiduMap, {
//   /* 需要注册百度地图开发者来获取你的ak */
//   ak: 'pc7ehmqoYaaEgzisn2gChqujAmELFoCq'
// })

// 解析url query中的参数
const getQuery = () => {
  const url = new URL(location.href)
  const params = new URLSearchParams(url.search)
  return Object.fromEntries(params.entries())
}

// 解析url hash中的参数
const getHash = () => {
  let hash = location.hash.slice(1)
  // 删除url中的token参数
  if (hash.indexOf('?') && hash.split('?')[1]) {
    const paramsArray = hash.split('?')[1].split('&')
    return paramsArray.reduce((acc, cur) => {
      const [key, value] = cur.split('=')
      acc[key] = value
      if (key === 'token') {
        hash = hash.replace(cur, '')
        location.hash = hash
      }
      return acc
    }, {})
  }
  return {}
}

// 调接口，判断是否为登录状态
async function init() {
  // try {
  //   await store.dispatch('user/getInfo')
  // } catch (e) {
  //   console.log(e)
  // }
  const hash = getHash()
  if (hash && hash.token) {
    setToken(hash.token)
  }
  const query = getQuery()
  if (query && query.token) {
    setToken(query.token)
    // 删除token参数
    const url = new URL(location.href)
    const params = new URLSearchParams(url.search)
    params.delete('token')
    url.search = params.toString()
    history.replaceState({}, '', url.toString())
  }
  var app = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
}

init()

