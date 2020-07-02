<template>
  <div style="display: inline-block;margin: 0 5px">
    <div class="mySelect">
      <el-cascader
        ref="cascader"
        v-model="value"
        :props="props"
        clearable
        @change="change"
        @visible-change="visibleChange($event)"
      ></el-cascader>
      <div class="label" :class="id!==''?'active':''" @click="openSelect">
        <span>{{ title }}</span>
        <span class="order-down"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { getRegionApi } from '@/api/common.js'
export default {
  name: 'MyCascader',
  props: {
    title: {
      type: String,
      required: true
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value: this.id,
      props: {
      },
      currNode: {}
    }
  },
  computed: {
    currObj() {
      let targetObj = {}
      for (let a = 0; a < this.list.length; a++) {
        if (this.list[a].id === this.value) {
          targetObj = this.list[a]
        }
      }
      return targetObj
    }
  },
  watch: {
    id(n, o) {
      // if (n !== o) {
      this.value = n
      // }
    }
  },
  created() {
    const that = this
    this.props = {
      label: 'name',
      value: 'code',
      checkStrictly: true,
      expandTrigger: 'hover',
      emitPath: false,
      lazy: true,
      lazyLoad(node, resolve) {
        // console.log(node)
        const { level } = node
        if (level === 0) {
          that.getRegion(null, resolve)
        } else if (level === 1) {
          that.getRegion(node.value, resolve, level)
        } else {
          resolve([])
        }
        // console.log(node)
      }
    }
  },
  mounted() {
    this.myId = 'select_' + Math.floor(Math.random() * 10000)
  },
  methods: {
    visibleChange(fn) {
      this.$emit('visibleChange', { flag: fn, type: '' })
    },
    openSelect() {
      this.$refs.cascader.$el.click()
    },
    getRegion(id, resolve, level) {
      getRegionApi({
        pid: id
      }).then(res => {
        if (res.code === 0) {
          if (level === 1) {
            res.data.map(item => {
              return {
                ...item,
                leaf: true
              }
            })
            resolve(res.data.map(item => {
              return {
                ...item,
                leaf: true
              }
            }))
          } else {
            resolve(res.data)
          }
        } else resolve([])
      })
    },
    change(item) {
      this.currNode = this.$refs['cascader'].getCheckedNodes()[0]
      this.$emit('select', {
        title: this.title,
        value: {
          name: this.currNode.data.name,
          id: this.currNode.data.code,
          level: this.currNode.data.level
        }
      })
      // if (this.currNode.level === 1 && this.currNode.children.length === 0) {
      //   // 加载二级数据
      //   getRegionApi({
      //     pid: this.currNode.data.code
      //   }).then(res => {
      //     if (res.code === 0) {
      //       this.currNode.children = res.data
      //       // console.log(res.data)
      //     }
      //   })
      // }
    }
  }
}
</script>

<style scoped>
  .mySelect{
    /*display: flex;*/
    font-size: 14px;
    color: #212121;
    width: 100px;
    position: relative;
    margin-top: -6px;
  }
  .label{
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    /* padding-top: 7px; */
    align-items: center;
    background-color: #fff;
    cursor: pointer;
    letter-spacing: 2px;
  }
  .label .order-down{
    width: 0;
    height: 0;
    border-width: 5px;
    border-style: solid;
    border-color:#212121 transparent transparent transparent;
    display: inline-block;
    margin-top: 5px;
    margin-left: 3px;
  }
  .label.active{
    color: #0056B2
  }
  .label.active .order-down{
    border-color:#0056B2 transparent transparent transparent;
  }
</style>
