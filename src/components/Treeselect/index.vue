<template>
  <el-select :value="valueTitle" :clearable="clearable" :size="size" :popper-class="randomId" @clear="clearHandle">
    <el-input
      v-if="search"
      v-model="filterText"
      style="width: calc(100% - 12px);margin-left:6px"
      size="small"
      placeholder="输入关键字进行过滤"
    />
    <el-option :value="valueTitle" :label="valueTitle" class="options">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="props"
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        :filter-node-method="filterNode"
        :lazy="lazy"
        :load="loadNode"
        @node-click="handleNodeClick"
      />
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ElTreeSelect',
  props: {

    // 配置项
    props: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        value: 'id', // ID字段名
        label: 'title', // 显示名称
        children: 'children' // 子级字段名
      }
    },

    // 选项列表数据(树形结构的对象数组)
    // eslint-disable-next-line vue/require-valid-default-prop
    options: { type: Array, default: [] },

    // 初始值
    value: { type: String, default: null },

    // 可清空选项
    clearable: { type: Boolean, default: true },

    // 自动收起
    accordion: { type: Boolean, default: false },

    // 是否可搜索
    search: { type: Boolean, default: false },

    // 大小
    size: { type: String, default: 'mini' },
    // 是否懒加载
    lazy: { type: Boolean, default: false },
    // 是否全部懒加载, 默认第一层不懒加载
    allLazy: { type: Boolean, default: false }
  },
  data() {
    return {
      valueId: null,
      valueTitle: '',
      defaultExpandedKey: [],
      filterText: '',
      randomId: 'tree_select_' + Math.floor(Math.random() * 100000)
    }
  },

  watch: {
    value(n) {
      this.valueId = n
      this.initHandle()
    },
    filterText(val) {
      this.$refs.selectTree.filter(val)
    },
    options: {
      handler(n) {
        if (n.length > 0) {
          this.$nextTick(() => {
            this.initHandle()
          })
        }
      },
      deep: true
    }
  },
  mounted() {
    this.valueId = this.value // 初始值
    this.initHandle()
    this.initScroll()
  },
  methods: {
    // 初始化值
    initHandle() {
      if (this.valueId && this.$refs.selectTree.getNode(this.valueId)) {
        this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[this.props.label] // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.valueId) // 设置默认选中
        this.defaultExpandedKey = [this.valueId] // 设置默认展开
      } else {
        this.clearHandle()
      }
    },

    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        const scrollWrap = document.querySelectorAll('.' + this.randomId + ' .el-scrollbar .el-select-dropdown__wrap')[0]
        const scrollBar = document.querySelectorAll('.' + this.randomId + ' .el-scrollbar .el-scrollbar__bar')
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        // eslint-disable-next-line no-return-assign
        scrollBar.forEach(ele => ele.style.width = 0)
      })
    },

    // 切换选项
    handleNodeClick(node) {
      const cloneData = JSON.parse(JSON.stringify(node))
      this.valueTitle = cloneData[this.props.label]
      this.valueId = cloneData[this.props.value]
      this.$emit('getValue', this.valueId)
      this.defaultExpandedKey = []
    },

    // 清除选中
    clearHandle() {
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('getValue', null)
    },

    // 清空选中样式
    clearSelected() {
      const allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach((element) => element.classList.remove('is-current'))
    },
    // 搜索
    filterNode(value, data) {
      const cloneData = JSON.parse(JSON.stringify(data))
      // console.log(value, cloneData)
      if (!value) return true
      return cloneData[this.props.label].indexOf(value) !== -1
    },
    // 懒加载
    loadNode(node, resolve) {
      new Promise((childresolve) => {
        // resolve 拿到接口数据后在页面组件执行resolve(data), data为子结构数据
        // childresolve用来显示默认选项，如果未指定默认选项则可以不用
        if (node.level >= 1 || this.allLazy) {
          this.$emit('treeLoad', node, resolve, childresolve)
        }
      }).then(() => {
        this.$nextTick(this.initHandle)
      }).catch((a) => {
        console.log(a)
      })
    }
  }
}
</script>

<style scoped>
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-select-dropdown__item.selected{
    font-weight: normal;
  }
  ul li >>>.el-tree .el-tree-node__content{
    height:auto;
    padding: 0 20px;
  }
  .el-tree-node__label{
    font-weight: normal;
  }
  .el-tree >>>.is-current .el-tree-node__label{
    color: #409EFF;
    font-weight: 700;
  }
  .el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
    color:#606266;
    font-weight: normal;
  }
</style>
