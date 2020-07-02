<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  mounted() {
    console.log(this.iconArr)
  },
  render(h, context) {
    const { icon, title } = context.props
    // const { iconArr } = context.computed
    const vnodes = []

    if (icon && icon.length > 0) {
      for (let a = 0; a < icon.length; a++) {
        if (a === 0) {
          vnodes.push(<svg-icon icon-class={icon[a]} class='active'/>)
        } else {
          vnodes.push(<svg-icon icon-class={icon[a]} class='normal'/>)
        }
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
