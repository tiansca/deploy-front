<template>
  <div id="app">
    <router-view />
    <div class="info">
      <el-tooltip>
        <template #content>
          <div>自动部署依赖git仓库的webhook推送</div>
          <div>webhook地址：{{ webhook }}</div>
        </template>
        <el-icon class="el-icon-info" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      webhook: ''
    }
  },
  created() {
    window.addEventListener('resize', () => {
      this.$store.commit('app/SET_BODYWIDTH', document.body.clientWidth)
    }, false)
    // 获取url域名
    this.webhook = `${location.origin}/api/deploy`
  }
}
</script>
<style>
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
body{
  min-width: 1200px;
}

/*级联单选样式*/
.el-radio__inner{
  border: 1px solid #63656e;
}
/*版权信息*/
.copyright{
  font-size: 14px;
  color: #61677a;
  text-align: center;
  position: absolute;
  bottom: 40px;
  width: 100%;
}
/*弹出框确定按钮(自定义类名)*/
.my-alart-button {
  background-color: #0056B2!important;
  border: 0;
}
.my-alart-button:hover {
  background-color: #0b66c8!important;
  border: 0;
}
.my-alart-button:active {
  background-color: #0056B2!important;
  border: 0;
}
</style>
<style lang="scss" scoped>
.info{
  position: fixed;
  top: 26px;
  right: 12px;
}
.el-icon-info{
  cursor: pointer;
}
</style>
