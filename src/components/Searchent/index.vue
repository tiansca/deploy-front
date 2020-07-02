<template>
  <ul>
    <li v-for="item in list" :key="item.ENTNAME" @click="addCompany(item.ENTNAME)">
      <span>{{ item.ENTNAME.slice(0,item.ENTNAME.toLowerCase().indexOf(value.toLowerCase())) }}</span>
      <span style="color:red">{{ item.ENTNAME.slice(item.ENTNAME.toLowerCase().indexOf(value.toLowerCase()),item.ENTNAME.toLowerCase().indexOf(value.toLowerCase())+value.length) }}</span>
      <span>{{ item.ENTNAME.substr(item.ENTNAME.toLowerCase().indexOf(value.toLowerCase())+value.length) }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    flag: {
      type: Boolean
    },
    // eslint-disable-next-line vue/require-default-prop
    list: {
      type: Array
    },
    value: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(n) {
      this.value = n
    },
    list(n) {
      this.list = n
    }
  },
  methods: {
    addCompany(value) {
      this.$emit('addCompany', { flag: false, value: value })
    }
  }
}
</script>

<style scoped>
ul {
  padding: 0;
  margin: 0;
  position: absolute;
  top: 40px;
  z-index: 15;
  width: 50%;
  max-height: 200px;
  background: #fefefe;
  box-shadow: 0 0 10px #ddd;
  overflow: auto;
}
ul li {
  font-size: 13px;
  padding: 5px 10px;
  white-space: nowrap;
}
ul li:hover {
  background: #efefef;
}
</style>
