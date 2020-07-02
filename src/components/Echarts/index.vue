<template>
  <div ref="el" class="echart_123"></div>
</template>

<script>
var echarts = require('echarts')
// 不要再公共组件里引入地图数据，使用时在相应的页面组件引入地图
// import china from 'echarts/map/json/china.json'
// echarts.registerMap('china', china)
export default {
  name: 'Index',
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    option: {
      handler(newVal, oldVal) {
        this.setOptions()
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
    })
    this.$on('rebuild', () => {
      this.rebuild()
    }) // 设置接收父组件的方法
  },
  beforeDestroy() {
    this.$off('rebuild')
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initCharts() {
      this.chart = echarts.init(this.$el)
      this.setOptions()
    },
    click(param) {
      this.$emit('chartClick', param)
    },
    setOptions() {
      if (this.chart) {
        this.chart.clear()
        this.chart.setOption(this.option, true)
        this.chart.on('click', this.click)
      }
    },
    rebuild() {
      this.chart.dispose()
      this.initCharts()
    }
  }
}
</script>

<style scoped>
  .echart_123 {
    width: 100%;
    height: 100%;
  }
</style>
