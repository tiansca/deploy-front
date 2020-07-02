<template>
  <div style="display: inline-block">
    <div class="mySelect">
      <el-cascader
        ref="cascaderNic"
        v-model="value"
        :props="props"
        :options="list"
        clearable
        @change="change"
        @visible-change="visibleChange($event)"
      ></el-cascader>
      <div class="label" :class="value?'active':''" @click="openSelect">
        <span>{{ title }}</span>
        <span class="order-down"></span>
      </div>
    </div>
  </div>
</template>

<script>
// import { getIndustryApi } from '@/api/common.js'
export default {
  name: 'MyCascaderNic',
  props: {
    title: {
      type: String,
      required: true
    },
    list: {
      type: Array,
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
      if (n !== o) {
        this.value = n
      }
    }
  },
  created() {
    this.props = {
      label: 'name',
      value: 'code',
      checkStrictly: true,
      expandTrigger: 'hover',
      emitPath: false,
      lazy: false
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
      this.$refs.cascaderNic.$el.click()
    },
    reset() {
      this.value = ''
    },
    change(item) {
      this.currNode = this.$refs['cascaderNic'].getCheckedNodes()[0]
      this.$emit('select', {
        title: this.title,
        value: {
          name: this.currNode.data.name,
          id: this.currNode.data.code,
          level: this.currNode.data.level
        }
      })
    }
  }
}
</script>

<style scoped>
  .mySelect{
    /*display: flex;*/
    font-size: 14px;
    color: #212121;
    width: 93px;
    position: relative;
    margin-top: -6px;
    margin-left: 7px;
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
