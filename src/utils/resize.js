var echarts = require('echarts')
var autoResize = {}
autoResize.open = function resizeEcharts(path) {
  var __SCROLLTIMER__ = null
  // 重新设置 echarts 的宽高
  var resizeEcharts = () => {
    var echartEls = document.querySelectorAll('[_echarts_instance_]')
    if (!echartEls || echartEls.length === 0) {
      return
    }
    for (var a = 0; a < echartEls.length; a++) {
      echarts.getInstanceByDom(echartEls[a]).resize()
    }
  }

  // 绑定事件
  window.onresize = function() {
    clearTimeout(__SCROLLTIMER__)
    __SCROLLTIMER__ = setTimeout(resizeEcharts, 150)
  }
}
autoResize.close = function() {
  window.onresize = null
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
// export function validUsername(str) {
//   const valid_map = ['admin', 'editor']
//   return valid_map.indexOf(str.trim()) >= 0
// }
export default autoResize
