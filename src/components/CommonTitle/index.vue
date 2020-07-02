<template>
  <div>
    <ul class="zs-common-nav">
      <li v-for="(item,i) in navItem" :key="i" :class="activeClass == item? 'activeClass' :'' " @click="changeNav(item)">{{ item }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    // 数组格式 所有标题名称
    navItem: {
      type: Array,
      require: true,
      default: () => {}
    },
    // 当前nav名字
    activeClass: {
      type: String,
      require: true,
      default: () => {}
    }
  },
  methods: {
    changeNav(item) {
      this.$emit('changeNav', item)
    }
  }
}
</script>
<style lang="scss" scoped>
$titleColor:#0056B2;
.zs-common-nav {
display: flex;
 li {
   border-radius:4px 4px 0px 0px;
    padding: 0 40px 0 16px;
    height:38px;
    background:#fff;
    border:1px solid rgba(215,221,228,1);
    line-height:36px;
    color:#333333;
    border-bottom:none;
    font-weight: bold;
    cursor: pointer;
    margin-left:10px;
    &.activeClass {
      color:#fff;
      border:1px solid $titleColor;
      background: $titleColor;
      &:before {
         background:#fff;
      }
    }
    &:before {
      content: '';
      display: inline-block;
      margin-right: 10px;;
      width:10px;
      height:10px;
      background:#A8AFB9;
      border-radius:50%;
    }
    &:nth-of-type(1){
      margin-left: 0;
    }
 }
}
</style>

