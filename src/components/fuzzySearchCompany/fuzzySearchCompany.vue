<template>
  <div>
    <el-select
      v-model="companyValue.value"
      v-loadingMore="loadMore"
      placeholder="请输入企业名称"
      filterable
      remote
      clearable
      :remote-method="remoteAddCompany"
      @change="selectGet"
    >
      <el-option
        v-for="item in companyoptions"
        :key="item.ent_id"
        :label="item.ENTNAME"
        :value="item.ent_id"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { fuzzyCompanyName } from '@/api/personalCenter'
import loadingMore from '@/directive/loadMore'
export default {
  directives: {
    loadingMore
  },
  data() {
    return {
      companyoptions: [],
      companyValue: {
        value: '',
        name: ''
      },
      page_start: 1
    }
  },
  methods: {
    async loadMore() {
      this.page_start++
      const res = await fuzzyCompanyName({ key: this.companyValue.value, page_start: this.page_start })
      if (res.code === 0) {
        this.companyoptions = [...this.companyoptions, ...res.data]
      }
    },
    async remoteAddCompany(query) {
      this.companyValue.value = query
      this.page_start = 1
      if (query !== '') {
        const res = await fuzzyCompanyName({ key: query, page_start: this.page_start })
        if (res.code === 0) {
          this.companyoptions = res.data
        }
      }
    },
    selectGet(vid) {
      if (vid) {
        const obj = this.companyoptions.find(item => {
          return item.ent_id === vid
        })
        this.companyValue.name = obj.ENTNAME
      } else {
        this.companyValue.nam = ''
      }
      this.$emit('changeItem', this.companyValue)
    }
  }
}
</script>
<style lang="scss" scoped>
$mainColor:#0464CB;
  .el-select /deep/ .el-input.is-focus .el-input__inner {
    border-color: $mainColor!important;
  }
</style>
