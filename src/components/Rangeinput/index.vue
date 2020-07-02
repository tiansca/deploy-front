<template>
  <div class="range-input">
    <el-input
      v-model="smallValue"
      type="text"
      :size="size"
      :placeholder="placeholder"
      oninput="value=value.replace(/[^\d.]/g,'')"
      clearable
      @blur="check('small')"
    ></el-input>
    <span class="line">—</span>
    <el-input
      v-model="bigValue"
      type="text"
      :size="size"
      :placeholder="placeholder"
      oninput="value=value.replace(/[^\d.]/g,'')"
      clearable
      @blur="check('big')"
    ></el-input>
  </div>
</template>

<script>
export default {
  props: {
    big: { default: '', required: true },
    small: { default: '', required: true },
    maxValue: { type: Number },
    minValue: { type: Number },
    size: { type: String, default: 'mini' }, // 输入框大小
    placeholder: { type: String, default: '' }
  },
  data() {
    return {}
  },
  computed: {
    bigValue: {
      get() {
        // console.log('计算属性', this.big)
        return this.big
      },
      set(newVal) {
        if (newVal) {
          this.$emit('update:big', newVal)
        } else {
          this.$emit('update:big', null)
        }
      }
    },
    smallValue: {
      get() {
        // console.log('计算属性', this.small)
        return this.small
      },
      set(newVal) {
        if (newVal) {
          this.$emit('update:small', newVal)
        } else {
          this.$emit('update:small', null)
        }
      }
    }
  },
  watch: {
    // bigValue(n, o) {
    //   console.log(n)
    //   if (n) {
    //     this.$emit('update:big', parseFloat(n))
    //   } else {
    //     this.$emit('update:big', null)
    //   }
    // },
    // smallValue(n, o) {
    //   if (n) {
    //     this.$emit('update:small', parseFloat(n))
    //   } else {
    //     this.$emit('update:small', null)
    //   }
    // }
  },
  methods: {
    check(type) {
      if (type === 'small' && this.smallValue) {
        this.$emit('update:small', parseFloat(this.smallValue))
        if ((this.minValue && (this.small < this.minValue)) || this.big && (this.small > this.big)) {
          this.smallValue = null
        }
      } else if (type === 'big' && this.bigValue) {
        this.$emit('update:big', parseFloat(this.bigValue))
        if ((this.maxValue && (this.big < this.maxValue)) || this.small && (this.big < this.small)) {
          this.bigValue = null
        }
      }
    }
  }
}
</script>

<style scoped>
  .range-input{
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
  }
  .range-input>.el-input{
    flex-grow: 1;
  }
  .range-input>.line{
    margin: 0 3px;
    color: #666
  }
</style>
