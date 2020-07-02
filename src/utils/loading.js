import Vue from 'vue'
import loadingComponent from '@/components/Loading'

const LoadingConstructor = Vue.extend(loadingComponent)

const instance = new LoadingConstructor({
  el: document.createElement('div')
})

instance.isLoading = false // 默认隐藏
const loading = {
  show() { // 显示方法
    instance.isLoading = true
    document.body.appendChild(instance.$el)
  },
  hide() { // 隐藏方法
    instance.isLoading = false
  }
}

export default {
  install() {
    if (!Vue.$loading) {
      Vue.$loading = loading
    }
    Vue.mixin({
      created() {
        this.$loading = Vue.$loading
      }
    })
  }
}
