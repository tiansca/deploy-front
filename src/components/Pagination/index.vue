<template>
  <!-- pagination -->
  <div class="pagination">
    <el-button v-if="options.isShowStart" type="primary" size="mini" plain @click="goStart">首页</el-button>
    <el-pagination
      ref="pagination"
      background
      :layout="layoutVal"
      :total="options.total"
      :current-page.sync="options.pageNum"

      :page-size="options.pageSize"
      :page-sizes="hasPageSizes"
      @current-change="options.changePageNum"
      @size-change="options.changePageSize"
    >
    </el-pagination>

    <el-button v-if="options.isShowEnd" type="primary" size="mini" plain @click="goEnd">尾页</el-button>

  </div>
</template>

<script>

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['options'],

  data() {
    return {}
  },
  computed: {
    hasPageSizes() {
      return this.options.pageSizes ? this.options.pageSizes : [20, 50, 100, 200]
    },
    layoutVal() {
      return this.options.isShowPages ? 'sizes, prev, pager, next' : 'prev, pager, next'
    }
  },
  watch: {

  },
  methods: {

    goStart() {
      this.$emit('goStart', 1)
    },
    goEnd() {
      this.$emit('goEnd', this.$refs.pagination.internalPageCount)
    }
  }
}
</script>

<style>

</style>
