<template>
  <e-charts ref="chart" :option="option" @chartClick="clickHandler"></e-charts>
</template>

<script>
import eCharts from '@/components/Echarts/index'
import 'echarts/map/js/china' // 引入中国地图数据
export default {
  components: {
    eCharts
  },
  props: {
    mapValue: {
      type: Array, // 各地区数据
      required: true
    },
    color: {
      type: Array, // 图例颜色
      default: () => ['#49C5F9', '#3796FF', '#0558FF', '#7E74FF', '#3E30FF']
    },
    title: {
      type: String, // 标题
      default: ''
    },
    zoom: {
      type: Number,
      default: 1
    },
    saveImg: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pieces: [],
      myMapData: [],
      nameMap: {
        '北京': '北京市',
        '天津': '天津市',
        '河北': '河北省',
        '山西': '山西省',
        '内蒙古': '内蒙古自治区',
        '辽宁': '辽宁省',
        '吉林': '吉林省',
        '黑龙江': '黑龙江省',
        '上海': '上海市',
        '江苏': '江苏省',
        '浙江': '浙江省',
        '安徽': '安徽省',
        '福建': '福建省',
        '江西': '江西省',
        '山东': '山东省',
        '河南': '河南省',
        '湖北': '湖北省',
        '湖南': '湖南省',
        '广东': '广东省',
        '广西': '广西壮族自治区',
        '海南': '海南省',
        '重庆': '重庆市',
        '四川': '四川省',
        '贵州': '贵州省',
        '云南': '云南省',
        '西藏': '西藏自治区',
        '陕西': '陕西省',
        '甘肃': '甘肃省',
        '青海': '青海省',
        '宁夏': '宁夏回族自治区',
        '新疆': '新疆维吾尔自治区',
        '台湾': '台湾省'
      }
    }
  },
  computed: {
    option() {
      return {
        toolbox: {
          itemSize: '15',
          right: 20,
          feature: {
            saveAsImage: {
              show: this.saveImg,
              title: '点击保存',
              type: 'png',
              lang: ['点击保存'],
              iconStyle: {
                borderColor: '#4d7cdb'
              }
            }
          }
        },
        title: {
          text: this.title,
          textStyle: {
            color: '#333',
            fontSize: 16,
            fontWeight: 500
          },
          x: 'center',
          y: 20
        },
        // backgroundColor: '#49dff9',
        tooltip: { // 鼠标移到图里面的浮动提示框
          // formatter详细配置： https://echarts.baidu.com/option.html#tooltip.formatter
          formatter(params, ticket, callback) {
            // params.data 就是series配置项中的data数据遍历
            let localValue
            if (params.data) {
              localValue = params.data.value
            } else { // 为了防止没有定义数据的时候报错写的
              localValue = 0
            }
            const htmlStr = `<div style='font-size:14px;'> ${params.name}：${localValue}</div>`
            return htmlStr
          }
          // backgroundColor:"#ff7f50",//提示标签背景颜色
          // textStyle:{color:"#fff"} //提示标签字体颜色
        },
        // visualMap的详细配置解析：https://echarts.baidu.com/option.html#visualMap
        visualMap: { // 左下角的颜色区域
          type: 'piecewise', // 定义为分段型 visualMap
          min: 0,
          max: 1000,
          itemWidth: 20,
          bottom: 60,
          left: 20,
          pieces: this.pieces,
          inRange: {
            color: this.color
          }
        },
        // geo配置详解： https://echarts.baidu.com/option.html#geo
        geo: { // 地理坐标系组件用于地图的绘制
          map: 'china', // 表示中国地图
          // roam: true, // 是否开启鼠标缩放和平移漫游
          zoom: this.zoom, // 当前视角的缩放比例（地图的放大比例）
          nameMap: this.nameMap,
          label: {
            show: false,
            color: '#fff'
          },
          emphasis: {
            label: {
              show: true,
              color: '#fff',
              textShadowColor: '#000',
              textShadowBlur: 2
            }
          },
          itemStyle: { // 地图区域的多边形 图形样式。
            normal: {
              label: {
                show: false // 默认是否显示省份名称
              },
              areaColor: '#49c5f9', // 默认的地图板块颜色
              borderWidth: 1,
              borderColor: '#e1e1e1'
            },
            emphasis: {
              label: {
                show: true // 选中状态是否显示省份名称
              },
              areaColor: '#00AEFF'
            }
          }
        },
        series: [
          {
            name: '', // 浮动框的标题（上面的formatter自定义了提示框数据，所以这里可不写）
            type: 'map',
            geoIndex: 0,
            label: {
              show: true
            },
            zoom: this.zoom,
            // 这是需要配置地图上的某个地区的数据，根据后台的返回的数据进行拼接（下面是我定义的假数据）
            data: this.mapValue
          }
        ]
      }
    }
  },
  watch: {
    mapValue: {
      handler(n) {
        if (this.mapValue && this.mapValue.length > 0) {
          this.calcMapColor(this.mapValue)
          // console.log(this.pieces)
        }
      },
      deep: true
    },
    zoom() {
      let buildTimer
      if (this.zoom) {
        clearTimeout(buildTimer)
        buildTimer = setTimeout(() => {
          this.$refs.chart.$emit('rebuild') // 触发子组件方法
        }, 1000)
      }
    }
    // title() {
    //   this.option.title.text = this.title
    // },
    // option: {
    //   handler(newVal, oldVal) {
    //     console.log('变化', this.option)
    //   },
    //   deep: true
    // }
  },
  mounted() {
    if (this.mapValue && this.mapValue.length > 0) {
      this.calcMapColor(this.mapValue)
    }
  },
  methods: {
    descend(x, y) {
      return y.value - x.value
    },
    calcMapColor(arr) {
      arr = arr.concat([])
      var arrData = arr.sort(this.descend)
      this.pieces = []
      // 地图颜色分阶
      if (arrData.length <= 5) {
        for (let k = 0; k + 1 < arrData.length; k++) {
          this.pieces.push({
            gt: arrData[k + 1].value,
            lte: arrData[k].value,
            label: '(' + arrData[k + 1].value + ',' + arrData[k].value + ']'
          })
        }
        this.pieces.push({
          gte: 0,
          lte: arrData[arrData.length - 1].value,
          label: '(0,' + arrData[arrData.length - 1].value + ']'
        })
      } else if (arrData.length > 5) {
        var m = Math.ceil(arrData.length / 5)
        for (var k = 0; k + m < arrData.length;) {
          this.pieces.push({
            gt: arrData[k + m].value,
            lte: arrData[k].value,
            label: '(' + arrData[k + m].value + ',' + arrData[k].value + ']'
          })
          k = k + m
        }
        this.pieces.push({
          gte: 0,
          lte: arrData[k].value,
          label: '[0,' + arrData[k].value + ']'
        })
      }
    },
    clickHandler(a) {
      this.$emit('chartClick', a)
    }
  }
}
</script>

<style scoped>

</style>
