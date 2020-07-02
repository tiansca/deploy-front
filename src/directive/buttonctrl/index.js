import buttonCtrl from './buttonctrl'

const install = function(Vue) {
  Vue.directive('button-ctrl', buttonCtrl)
}

if (window.Vue) {
  window['button-ctrl'] = buttonCtrl
  Vue.use(install) // eslint-disable-line
}

buttonCtrl.install = install
export default buttonCtrl
