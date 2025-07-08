import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getToken } from '@/utils/auth'
import { getCookie } from '@/utils'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  let isLogin = getCookie('islogin')
  if (!isLogin) {
    try {
      isLogin = await store.dispatch('user/getIsLogin')
    } catch (error) {
      console.log(error)
    }
  }
  // const userId = 'self'
  if (isLogin) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      console.log('hasGetUserInfo', hasGetUserInfo)
      if (hasGetUserInfo) {
        if ((store.getters.permissions && store.getters.permissions.find(permission => permission === 'deploy')) || to.path === '/403') {
          next()
        } else {
          console.log('403')
          next({ path: '/403' })
        }
      } else {
        try {
          // 在这里挂载路由
          // store.commit('user/SET_NAME', 'cong')
          await store.dispatch('user/getInfo', false)
          const accessRoutes = await store.dispatch('permission/generateRoutes', [])
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          debugger
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          if (error.code === 4) {
            Message.error('请重新登录！')
          }
          // next(`/login?redirect=${to.fullPath}`)
          // 获取VUE_CLI_AUTH_FRONTEND_URL环境变量
          const VUE_CLI_AUTH_FRONTEND_URL = process.env.VUE_APP_AUTH_FRONTEND_URL
          if (error.response && error.response.status) {
            window.location.replace(VUE_CLI_AUTH_FRONTEND_URL + '/#/login?redirect=' + location.href)
            console.log('111', VUE_CLI_AUTH_FRONTEND_URL + '?redirect=' + location.href)
          }
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (to.query.hasOwnProperty('source')) {
      whiteList.push('/report')
      store.commit('SET_REPORT', to.query.source)
    }
    console.log(whiteList, store.getters.report_scoure)

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else if (location.href.indexOf('debug') === -1) {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.fullPath}`)
      const VUE_CLI_AUTH_FRONTEND_URL = process.env.VUE_APP_AUTH_FRONTEND_URL
      window.location.replace(VUE_CLI_AUTH_FRONTEND_URL + '/#/login?redirect=' + encodeURIComponent(location.href))
      console.log('222', VUE_CLI_AUTH_FRONTEND_URL + '/#/login?redirect=' + encodeURIComponent(location.href))
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
