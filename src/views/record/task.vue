<script>
import { cancelTaskApi, stopCurrTaskApi } from '@/api/deploy'
import { getToken } from '@/utils/auth'

export default {
  name: 'Task',
  data() {
    return {
      currTask: null,
      waitTask: [],
      logContent: [],
      eventSource: null
    }
  },
  mounted() {
    this.getTaskInfo()
  },
  beforeDestroy() {
    // 终止sse message响应
    if (this.eventSource) {
      this.eventSource.close()
    }
  },
  methods: {
    goBank() {
      this.$router.back()
    },
    getTaskInfo() {
      const eventSource = new EventSource(process.env['VUE_APP_AUTH_BACKEND_URL'] + '/proxy/deploy/task?token=' + getToken())
      this.eventSource = eventSource
      eventSource.onmessage = (event) => {
        // console.log('New message:', event.data)
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'taskList') {
            this.waitTask = data.tasks
            this.currTask = data.activeTask
            this.$set(this, 'currTask', data.activeTask)
          } else if (data.type === 'log') {
            this.$nextTick(() => {
              this.logContent.push(data.log)
              // 如果logContent长度超过1000，则只保留后面1000条
              if (this.logContent.length > 1000) {
                this.logContent = this.logContent.slice(-1000)
              }
              this.logToBottom()
            })
          } else if (data.type === 'clearLog') {
            this.logContent = [data.log]
            this.logToBottom()
          }
        } catch (e) {
          console.error('Error parsing JSON:', e)
        }
      }
      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error)
        // 处理错误情况
      }
    },
    async stopCurr() {
      console.log('停止')
      await stopCurrTaskApi()
      this.$message.success('任务已停止')
    },
    async removeTask(id) {
      console.log('移除', id)
      await cancelTaskApi({
        id: id
      })
      this.$message.success('任务已移除')
    },
    logToBottom() {
      this.$nextTick(() => {
        // 判断是否距离底部小于30px，则滚动到底部
        const isBottom = this.$refs.logContent.scrollHeight - this.$refs.logContent.scrollTop <= this.$refs.logContent.clientHeight + 100
        if (isBottom) {
          this.$refs.logContent.scrollTop = this.$refs.logContent.scrollHeight
        }
      })
    }
  }
}
</script>

<template>
  <div class="dashboard-container">
    <div style="position: relative">
      <h3 style="text-align: center">任务队列</h3>
      <el-button class="back-Button" size="small" type="text" icon="el-icon-back" @click="goBank">返回</el-button>
    </div>
    <div v-if="currTask || logContent.length" class="task-content">
      <div class="curr-task">
        <div class="curr-task-info-head">
          <span class="curr-task-info-title">当前任务</span>
          <span v-if="currTask" class="curr-stop" title="停止当前任务" @click="stopCurr">
            <svg style="width: 1em; height: 1em">
              <use xlink:href="#deploy-stop" />
            </svg>
          </span>
          <span v-else class="curr-stop" style="font-size: 12px">已结束</span>
        </div>
        <div class="curr-task-info-wrap">
          <span class="info-label">名称:</span>
          <span class="info-value" :title="currTask ? currTask.name || '-' : '-'">{{ currTask ? currTask.name || '-' : '-' }}</span>
          <span class="info-label">branch/tag:</span>
          <span class="info-value" :title="currTask ? currTask.branch || currTask.tagName : '-'">{{ currTask ? currTask.branch || currTask.tagName : '-' }}</span>
          <span class="info-label">服务器:</span>
          <span class="info-value" :title="currTask ? currTask.ip || '本机部署' || '-' : '-'">{{ currTask ? currTask.ip || '本机部署' || '-' : '-' }}</span>
          <span class="info-label">部署路径:</span>
          <span class="info-value" style="flex-grow: 3;" :title="currTask ? currTask.path || '-' : '-'">{{ currTask ? currTask.path || '-' : '-' }}</span>
        </div>
      </div>
      <div class="curr-log">
        <div class="curr-log-title">
          <span class="curr-log-title-text">日志</span>
        </div>
        <div ref="logContent" class="curr-log-content">
          <div v-for="(item, index) in logContent" :key="index" v-html="item" style="content-visibility: auto"></div>
        </div>
      </div>
      <div class="wait-task">
        <div class="wait-task-title">
          <span class="wait-task-title-text">等待队列</span>
        </div>
        <el-table :data="waitTask" style="width: 100%;margin-top: 20px;" border width="100%">
          <el-table-column prop="name" label="名称" width="180"></el-table-column>
          <el-table-column prop="branch" label="branch/tag" width="100"></el-table-column>
          <el-table-column prop="ip" label="服务器" width="130"></el-table-column>
          <el-table-column prop="path" label="部署路径"></el-table-column>
          <el-table-column prop="operate" label="操作" width="80">
            <template #default="scope">
              <el-button size="mini" type="warning" @click="removeTask(scope.row._id)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else>
      <div style="text-align: center;font-size: 14px; margin-top: 50px;color: #666">
        暂无任务
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container{
  padding: 20px;
}
.back-Button{
  position: absolute;
  left: 20px;
  top: 0
}
.task-content{
  max-width: 960px;
  margin: 20px auto;
  .curr-task-info-head{
    display: flex;
    margin: 8px 0;
    align-items: center;
    .curr-task-info-title{
      font-size: 16px;
      font-weight: bold;
    }
    .curr-stop{
      font-size: 20px;
      color: #999;
      cursor: pointer;
      margin-left: 12px;
    }
    .curr-stop:hover{
      color: #E95C73;
    }
  }
  .curr-task-info-wrap{
    font-size: 14px;
    line-height: 1.5;
    display: flex;
    align-items: center;
    .info-label{
      margin-right: 3px;
      white-space: nowrap;
    }
    .info-value{
      margin-right: 34px;
      display: inline-block;
      //max-width: 150px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex-grow: 1;
      min-width: 80px;
    }
  }
  .curr-log{
    margin-top: 20px;
    .curr-log-title{
      font-size: 16px;
      font-weight: bold;
      margin: 8px 0;
    }
    .curr-log-content{
      max-height: 500px;
      overflow: auto;
      padding: 8px;
      background: #efefef;
      min-height: 50px;
      white-space: pre-wrap;
      font-size: 14px;
      line-height: 1.5;
      color: #333
    }
  }
  .wait-task{
    margin-top: 20px;
    .wait-task-title{
      font-size: 16px;
      font-weight: bold;
      margin: 8px 0;
    }
  }
}
</style>
