<template>
  <div style="display: inline-block;margin: 0 5px">
    <div class="select-box">
      <el-select ref="selectaaa" v-model="value" value="" size="mini" @change="select" @visible-change="visibleChange($event, value)">
        <el-option
          v-for="item in list"
          v-show="item.id!==list[0].id"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <div class="select-label" :class="value !== list[0].id?'active':''" @click="openSelect">
        <span>{{ title }}</span>
        <span class="order-down"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // name: 'Select',
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
      myId: ''
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
      this.value = n
    }
  },
  methods: {
    openSelect() {
      this.$refs.selectaaa.$el.click()
    },
    visibleChange(fn, id) {
      if (this.currObj.name === '自定义') {
        this.$emit('visibleChange', { flag: fn, type: '自定义' })
      } else {
        this.$emit('visibleChange', { flag: fn, type: '' })
      }
    },
    select() {
      this.$emit('onSelect', {
        title: this.title,
        value: this.currObj
      })
    }
  }
}
</script>

<style scoped>
.select-box{
  /*display: flex;*/
  font-size: 14px;
  color: #212121;
  width: 100px;
  position: relative;
}
.select-label{
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
.select-label .order-down{
  width: 0;
  height: 0;
  border-width: 5px;
  border-style: solid;
  border-color:#212121 transparent transparent transparent;
  display: inline-block;
  margin-top: 5px;
  margin-left: 3px;
}
.select-label.active{
  color: #0056B2
}
.select-label.active .order-down{
  border-color:#0056B2 transparent transparent transparent;
}
</style>
