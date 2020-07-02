<template>
  <div class="zs-personal">
    <common-tile :nav-item="personnal" :active-class="activeClass" style="margin-left:40px" @changeNav="changeComponent"></common-tile>
    <div class="zs-personal-component">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>
<script>
import commonTile from '@/components/CommonTitle'
import { focusCompany, changePwd, userDetail } from './index.js'
export default {
  name: 'Personal',
  components: {
    focusCompany,
    userDetail,
    commonTile
  },
  data() {
    return {
      personnal: ['关注企业', '修改密码', '个人信息'],
      activeClass: this.$route.query.item ? this.$route.query.item : '关注企业'
    }
  },
  computed: {
    currentComponent() {
      const components = {
        '关注企业': focusCompany,
        '修改密码': changePwd,
        '个人信息': userDetail
      }
      return components[this.activeClass]
    }
  },
  watch: {
    $route(to, from) {
      this.activeClass = to.query.item
    }
  },
  methods: {
    changeComponent(item) {
      this.activeClass = item
    }
  }
}
</script>
<style lang="scss" scoped src="./index.scss"></style>

