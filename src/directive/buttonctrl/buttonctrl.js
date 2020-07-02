export default {
  inserted(el, binding, vnode) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        el.classList.add('is-disabled')
        setTimeout(() => {
          el.disabled = false
          el.classList.remove('is-disabled')
        }, binding.value || 500)
      }
    })
  }
}
