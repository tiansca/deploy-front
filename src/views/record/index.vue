<template>
  <div class="dashboard-container">
    <div style="position: relative">
      <h3 style="text-align: center">部署记录</h3>
      <el-button class="addButton" size="small" @click="goBank">返回</el-button>
    </div>
    <div class="selectWrap" style="margin: 30px auto 10px;height: 30px;width: 900px">
      <el-select
        v-model="currProject"
        value="currProject"
        size="mini"
        placeholder="选择项目"
      >
        <el-option
          v-for="item in projectList"
          :key="item._id"
          :label="item.name + (item.branch ? ' / ' + item.branch : '')"
          :value="item._id"
        >
        </el-option>
      </el-select>
    </div>
    <el-table
      :data="filterList"
      style="width: 900px;margin: 20px auto;"
    >
      <el-table-column
        prop="name"
        label="项目名称"
      >
      </el-table-column>
      <el-table-column
        prop="branch"
        label="项目分支"
      >
      </el-table-column>
      <el-table-column
        prop="createAt"
        label="部署时间"
      >
        <template slot-scope="scope">
          {{ scope.row.shijian | timeFilter }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { recordList, getList } from '@/api/deploy.js'
export default {
  name: 'Record',
  data() {
    return {
      list: [],
      id: '',
      projectList: [],
      currProject: '',
      timer: null
    }
  },
  computed: {
    filterList() {
      if (this.currProject) {
        return this.list.filter(item => {
          return item.project_id === this.currProject
        })
      }
      return this.list
    }
  },
  mounted() {
    this.getList()
    this.getProjectList()
    this.id = this.$route.query.id
    this.timer = setInterval(() => {
      this.getList()
    }, 10000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    getList() {
      recordList().then(res => {
        console.log(res)
        this.list = res.data
      })
    },
    goBank() {
      this.$router.back()
    },
    getProjectList() {
      getList().then(res => {
        this.projectList = [{
          name: '全部',
          _id: ''
        }, ...res.data]
      })
      setTimeout(() => {
        this.currProject = this.id
      })
    }
  }
}
</script>

<style scoped>
  .dashboard-container{
    padding: 20px;
  }
  .addButton{
    position: absolute;
    right: 20px;
    top: 0
  }
  .selectWrap /deep/ .el-select{
    float: right;
  }
</style>
