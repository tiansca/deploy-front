
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)" @click="testClick(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    linkProps(url) {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'div',
        to: url
      }
    },
    testClick(url) {
      // 通过重定向空白路由页面实现当前菜单刷新
      console.log(this.$route.path, url)
      if (this.$route.path === url) {
        // 点击的是当前路由 手动重定向页面到 '/redirect' 页面
        const fullPath = encodeURI(url)
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      } else {
        // 正常跳转
        this.$router.push({
          path: url
        })
      }
    }
  }
}
</script>
