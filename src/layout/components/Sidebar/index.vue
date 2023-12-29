<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      pageType: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_routes'
    ]),
    routes() {
      console.log(this.$router.options.routes)
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      if (this.$route.path.replace('/', '') === 'record' && this.pageType === 1 && this.page === 2) {
        return '/tel'
      } else if (this.$route.path.replace('/', '') === 'record' && this.pageType === 2 && this.page === 2) {
        return '/order'
      } else if (this.$route.path.replace('/', '') === 'record' && this.page === 1) {
        return '/work'
      } else {
        return path
      }
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    $route() {
      this.pageType = Number(this.$route.query.type)
      this.page = this.$route.query.page
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.pageType = Number(this.$route.query.type)
      this.page = this.$route.query.page
    }
  }

}
</script>
<style scoped>
  ::v-deep .el-menu-item, ::v-deep .el-submenu__title{
    font-size: 16px;
  }
</style>
