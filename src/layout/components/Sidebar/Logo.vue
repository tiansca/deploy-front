<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <!--        <img v-if="logo" :src="logo" class="sidebar-logo">-->
        <!--        <h1 v-else class="sidebar-title">{{ title }} </h1>-->
      </router-link>
      <router-link v-if="!collapse" key="expand" class="sidebar-logo-link" to="/">
        <!--        <img v-if="logo" :src="logo" class="sidebar-logo">-->
        <div class="sidebar-title">
          <div class="bigTitle"><span class="placeholder" style="visibility: hidden">1</span>{{ title }}</div>
          <!-- <div class="subTitle">Investment Recommendation System</div>-->
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '测试项目部署',
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 70px;
  line-height: 70px;
  /*background: #2b2f3a;*/
  text-align: center;
  overflow: hidden;
  background-image: url('../../../assets/imgs/app/logo_bg.png');
  background-size: 100% 100%;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      .bigTitle{
        font-size: 24px;
        line-height: 24px;
        letter-spacing: 8px;
        .placeholder{
           visibility: hidden;
          font-size: 12px;
          letter-spacing: 3px;
          vertical-align: bottom;
        }
      }
      .subTitle{
        font-size: 12px;
        line-height: 12px;
        margin-top: 3px;
        font-weight: 400;
      }
    }
  }

  &.collapse {
    display: none;
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
