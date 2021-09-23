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
      <el-table-column
        label="状态"
      >
        <template slot-scope="scope">
          {{ scope.row.success ? '成功' : '失败' }}
        </template>
      </el-table-column>
      <el-table-column
        label="日志"
      >
        <template slot-scope="scope">
          <span @click="showLog(scope.row.log)">点击查看</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="日志"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <p v-for="(item, index) in logArr" :key="index" style="margin: 8px 0">{{ item }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
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
      timer: null,
      dialogVisible: false,
      log: ''
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
    },
    logArr() {
      return this.log.split('<br>')
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
    },
    showLog(log) {
      this.dialogVisible = true
      if (!log) {
        return
      }
      this.log = log
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
