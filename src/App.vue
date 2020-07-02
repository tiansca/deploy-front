<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    window.addEventListener('resize', () => {
      this.$store.commit('app/SET_BODYWIDTH', document.body.clientWidth)
    }, false)
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
/*.el-switch__core {*/
/*  width: 45px;*/
/*  height: 22px;*/
/*  border: 2px solid #DCDFE6;*/
/*  border-radius: 13px;*/
/*}*/
/*  开关样式 */
.el-switch__core{
  background-color: rgba(51,79,93,1)!important;
  border:1px solid rgba(51,79,93,1)!important;
  height: 24px;
  border-radius: 12px
}
.el-switch .el-switch__core::after{
  width: 18px;
  height: 18px;
  background-image: url("./assets/imgs/company_list/switch_off.png");
  background-color: #E55C73;
  left: 6px;
  top: 2px;
  background-size: 100% 100%;
}
.el-switch.is-checked .el-switch__core::after{
  background-image: url("./assets/imgs/company_list/switch_on.png");
  background-color: #26C196;
  left: calc(100% - 6px);
  margin-left: -18px;
}
.el-switch{
  height: 24px;
  line-height: 24px;
}
.el-switch__label {
  position: absolute;
  display: none;
  height: 24px;
  font-size: 11px !important;
  color: #fff!important;
}
.el-switch__label *{
  font-size: 11px !important;
}
/*打开时文字位置设置*/
.el-switch__label--right {
  z-index: 1;
  right: 35px; /*这里是重点*/
  /*top: 1.5px;*/
}
/*关闭时文字位置设置*/
.el-switch__label--left {
  z-index: 1;
  left: 35px; /*这里是重点*/
  /*top: 1.5px;*/
}
/*显示文字*/
.el-switch__label.is-active {
  display: block;
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
