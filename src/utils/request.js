import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import { getInfo } from '@/api/user.js'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
})

let oldTime = (new Date()).valueOf()

// request interceptor
service.interceptors.request.use(
  config => {
    const url = config.url
    if (config.method === 'get') {
      url.indexOf('?') === -1 ? config.url = url + '?timestamp=' + (new Date().getTime()) : config.url = url + '&timestamp=' + (new Date().getTime())
    }
    if (store.getters.report_scoure) {
      config.headers['authorization'] = store.getters.report_scoure
    }
    // do something before request is sent
    // console.log(config)
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }

    // 按钮禁用
    if (config.params && config.params.button_target) {
      config.headers['button-target'] = config.params.button_target
      document.querySelector(config.params.button_target).disabled = true
      document.querySelector(config.params.button_target).classList.add('is-disabled')
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // 取消按钮禁用
    if (response.config.headers['button-target']) {
      document.querySelector(response.config.headers['button-target']).disabled = false
      document.querySelector(response.config.headers['button-target']).classList.remove('is-disabled')
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      // Message({
      //   message: res.error || '加载失败',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      const time = (new Date()).valueOf()
      if (time - oldTime > 1000) {
        oldTime = time
        if (res.code === 4) {
          // store.dispatch('user/resetToken').then(() => {
          // debugger
          location.reload()
          // })
        } else if (res.code === 5) {
          MessageBox.alert('您当前没有该权限，请联系管理员', '提示', {
            type: 'warning'
          })
        }
      }
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error.response) // for debug
    // axios.get(process.env.VUE_APP_BASE_API + 'user/myself')
    //   .then((response) => {
    //     console.log(response)
    //     if (response.data && response.data.code === 4) {
    //       location.reload()
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
    return Promise.reject(error)
  }
)

export default service
