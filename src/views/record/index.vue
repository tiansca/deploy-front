<template>
  <div class="dashboard-container">
    <div style="position: relative">
      <h3 style="text-align: center">部署记录</h3>
      <el-button class="back-button" size="small" type="text" icon="el-icon-back" @click="goBank">返回</el-button>
    </div>
    <div class="selectWrap" style="margin: 30px auto 10px;height: 30px;width: 1200px">
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
      :data="list"
      style="width: 1200px;margin: 20px auto;"
      border
    >
      <el-table-column
        prop="name"
        label="项目名称"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="branch"
        label="项目分支"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="ip"
        label="服务器地址"
        width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.ip || '本机' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="path"
        label="部署路径"
      >
      </el-table-column>
      <el-table-column
        prop="createAt"
        label="部署时间"
        width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.shijian | timeFilter }}
        </template>
      </el-table-column>
      <el-table-column
        prop="triggerBy"
        label="部署人"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.triggerBy === 'git' ? 'git触发' : scope.row.triggerBy }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.success ? '成功' : '失败' }}
        </template>
      </el-table-column>
      <el-table-column
        label="日志"
        width="120"
      >
        <template slot-scope="scope">
          <el-link type="primary" @click="showLog(scope.row._id)">点击查看</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!--    <div style="margin: 20px; display: flex;align-items: center;justify-content: center">-->
    <!--      <el-pagination-->
    <!--        background-->
    <!--        layout="total, prev, pager, next"-->
    <!--        :total="count"-->
    <!--        :current-page.sync="pageIndex"-->
    <!--        @current-change="pageIndexChange"-->
    <!--      >-->
    <!--      </el-pagination>-->
    <!--    </div>-->
    <el-dialog
      title="日志"
      :visible.sync="dialogVisible"
      class="my-dialog"
      :close-on-click-modal="false"
    >
      <div class="log-box">
        <p v-for="(item, index) in logArr" :key="index" style="margin: 8px 0">{{ item }}</p>
      </div>
      <div v-if="!logArr || logArr.length === 0">暂无数据</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { recordList, getList, getRecordDetail } from '@/api/deploy.js'
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
      log: '',
      pageSize: 10,
      pageIndex: 1,
      count: 0
    }
  },
  computed: {
    // filterList() {
    //   if (this.currProject) {
    //     return this.list.filter(item => {
    //       return item.project_id === this.currProject
    //     })
    //   }
    //   return this.list
    // },
    logArr() {
      return this.log.split('<br>')
    }
  },
  watch: {
    currProject(n) {
      this.pageIndex = 1
      this.getList()
    }
  },
  mounted() {
    this.id = this.$route.query.id
    // this.getList()
    this.getProjectList()
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
      recordList({
        project_id: this.currProject === null ? this.id : this.currProject,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }).then(res => {
        this.list = res.data
        this.count = res.count
      })
    },
    goBank() {
      this.$router.back()
    },
    getProjectList() {
      getList({}).then(res => {
        this.projectList = [{
          name: '全部',
          _id: ''
        }, ...res.data]
      })
      setTimeout(() => {
        this.currProject = this.id
      })
    },
    async showLog(id) {
      // 查询详情
      const { data: log } = await getRecordDetail({
        id: id
      })
      if (log) {
        this.dialogVisible = true
        this.log = log.replace(/\n/g, '<br>')
      }
    },
    pageIndexChange(e) {
      console.log(e)
      this.getList()
    }
  }
}
</script>

<style scoped>
  .dashboard-container{
    padding: 20px;
  }
  .back-button{
    position: absolute;
    left: 20px;
    top: 0;
    padding: 4px 8px;
  }
  .selectWrap ::v-deep  .el-select{
    float: right;
  }
  .my-dialog ::v-deep  .el-dialog{
    min-width: 500px;
    width: 60%;
    margin-top: 50px!important;
  }
  .log-box{
    max-height: calc(100vh - 300px);
    overflow: auto;
  }
  @media all and (max-width: 800px) {
    .my-dialog ::v-deep  .el-dialog{
      width: 90%;
      min-width: auto;
    }
    .log-box{
      max-height: calc(100vh - 400px);
    }
  }
</style>
