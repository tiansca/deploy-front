export default {
  inserted(el, binding, vnode) {
    const clickHandler = (e) => {
      // 当前点击元素如果是本身，返回
      if (el.contains(e.target)) {
        return false
      }
      // 指令是否绑定函数，绑定则调用
      if (binding.expression) {
        binding.value(e) // 自己定义的函数
      }
    }
    el.__vueClickOutSide__ = clickHandler
    document.addEventListener('click', clickHandler)
  },
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.__vueClickOutside__)
    delete el.__vueClickOutside__
  }
}
