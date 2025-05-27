<template>
  <div class="dashboard-container">
    <div style="position: relative">
      <h3 style="text-align: center">项目列表</h3>
      <el-button class="set-robot" size="small" @click="openSetRobot">通知机器人</el-button>
      <el-button class="goUser" size="small" @click="goUser">用户管理</el-button>
      <el-button class="goTask" size="small" @click="goTask">任务队列</el-button>
      <el-button class="goServer" size="small" @click="goServer">服务器列表</el-button>
      <el-button class="addButton" size="small" type="primary" @click="openAdd('add')">添加项目</el-button>
      <el-button type="text" class="logout-button" @click="logout">
        <el-tooltip class="item" effect="dark" content="退出登录">
          <svg style="width: 1em; height: 1em; font-size: 20px">
            <use xlink:href="#deploy-logout" />
          </svg>
        </el-tooltip>
      </el-button>
    </div>
    <el-table
      border
      :data="list"
      style="width: 100%;margin: 20px auto;"
    >
      <el-table-column
        prop="name"
        label="项目名称"
        width="220"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span class="projectName" @click="goRecord(scope.row._id)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="branch"
        label="项目分支"
        width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="ip"
        label="部署服务器"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="path"
        label="部署目录"
        width="360"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="url"
        label="git地址"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="自动部署"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.status ? 'success' : 'warning'" style="cursor: pointer" @click="changeStatus(scope.row)">
            {{ scope.row.status ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="360"
      >
        <template slot-scope="scope">
          <!--          <el-button size="mini">clone</el-button>-->
          <el-button size="mini" title="复制项目部署任务" @click="copyProject(scope.row)">复制</el-button>
          <el-button size="mini" type="success" title="启动部署流程" @click="deploy(scope.row)">部署</el-button>
          <el-button size="mini" type="primary" title="编辑项目" @click="openAdd('edit', scope.row)">编辑</el-button>
          <el-button :loading="scope.row.cloneLoading" size="mini" type="warning" title="重新从git克隆项目，更改项目地址或者本地目录后需要手动触发项目重新克隆" @click="cloneProject(scope.row)">克隆</el-button>
          <el-button size="mini" type="danger" title="删除项目部署信息" @click="removeProject(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  添加项目  -->
    <el-dialog
      :title="addType==='add'?'添加项目':'编辑项目'"
      :visible.sync="showAdd"
      custom-class="addDialog"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form ref="form" style="width: 800px; margin: auto" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="form.name" placeholder="若要开启自动部署，则必须将项目名称与git项目名保持一致"></el-input>
        </el-form-item>
        <el-form-item label="项目地址" prop="url">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="响应事件" class="inline" prop="eventType">
          <el-radio-group v-model="form.eventType">
            <el-radio label="push">代码推送</el-radio>
            <el-radio label="tag">创建tag</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.eventType === 'push'" label="项目分支" class="inline" prop="branch">
          <el-input v-model="form.branch"></el-input>
        </el-form-item>
        <el-form-item v-if="form.eventType === 'tag'" label="tag前缀" class="inline" prop="tagPrefixes">
          <el-input v-model="form.tagPrefixes" placeholder="若为空则响应所有tag"></el-input>
        </el-form-item>
        <el-form-item label="部署服务器" prop="server" class="inline">
          <template #label>
            <span>部署服务器</span>
            <el-tooltip class="item" effect="dark" placement="top">
              <i class="el-icon-info"></i>
              <div slot="content">
                <p>本机指的是当前构建系统所在的环境，并非用户终端设备。若构建系统为docker部署，则本机指的是docker容器，并非宿主机</p>
              </div>
            </el-tooltip>
          </template>
          <el-select v-model="form.server" placeholder="请选择服务器">
            <el-option v-for="item in serverList" v-show="item.status" :key="item._id" :value="item._id" :label="item.name + '(' + item.ip + ')'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="本地目录" class="inline" prop="localPath" title="本地项目文件夹名称，为空则用项目名称">
          <el-input v-model="form.localPath" placeholder="本地项目文件夹名称，为空则用项目名称"></el-input>
        </el-form-item>
        <el-form-item label="产出物路径" class="inline" prop="outputDir" title="构建文件的相对路径">
          <el-input v-model="form.outputDir" placeholder="构建文件的相对路径"></el-input>
        </el-form-item>
        <el-form-item label="部署路径" class="inline" prop="path" title="绝对路径">
          <el-input v-model="form.path" placeholder="服务器部署目录"></el-input>
        </el-form-item>
        <el-form-item label="构建模式" prop="buildMode" class="inline">
          <el-radio-group v-model="form.buildMode">
            <el-radio label="npm">npm</el-radio>
            <el-radio label="shell">shell</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="form.buildMode === 'npm'">
          <el-form-item label="打包命令" prop="build" class="inline">
            <template #label>
              <span>打包命令</span>
              <el-tooltip class="item" effect="dark" placement="top" content="支持npm、yarn、pnpm命令">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.build" placeholder="请输入打包命令"></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="部署脚本" prop="buildShell">
            <template #label>
              <span>部署脚本</span>
              <el-tooltip class="item" effect="dark" placement="top">
                <i class="el-icon-info"></i>
                <div slot="content">
                  <p>部署脚本为打包构建脚本，若设置了产出物路径，部署脚本执行完毕后，会自动将产出物路径下的文件复制到部署路径下</p>
                </div>
              </el-tooltip>
            </template>
            <div>
              <el-button v-if="buildShellContent && !buildEdit" type="primary" size="mini" @click="buildEdit=true;startEdit=false;editType='update'">编辑</el-button>
              <el-button v-if="buildEdit" size="mini" @click="buildEdit=false">取消</el-button>
              <el-button v-if="buildEdit" size="mini" type="primary" @click="submitShell">保存</el-button>
              <el-button v-if="!buildShellContent && !buildEdit" size="mini" type="primary" @click="addBuildShell">添加脚本</el-button>
            </div>
            <el-input v-if="buildEdit" v-model="buildShellContent" type="textarea" rows="10"></el-input>
            <div v-else-if="buildShellContent"><pre style="white-space: break-spaces; line-height: 1.5;background-color: #efefef;padding: 8px" v-html="buildShellContent"></pre></div>
          </el-form-item>
          <el-form-item v-if="form.server !== '0'" label="启动脚本" prop="startShell">
            <template #label>
              <span>启动脚本</span>
              <el-tooltip class="item" effect="dark" placement="top">
                <i class="el-icon-info"></i>
                <div slot="content">
                  <p>部署脚本执行完成后，会自动在远程服务器的部署路径下执行启动脚本</p>
                </div>
              </el-tooltip>
            </template>
            <div>
              <el-button v-if="startShellContent && !startEdit" type="primary" size="mini" @click="startEdit=true;buildEdit=false;startEditType='update'">编辑</el-button>
              <el-button v-if="startEdit" size="mini" @click="startEdit=false">取消</el-button>
              <el-button v-if="startEdit" size="mini" type="primary" @click="submitStartShell">保存</el-button>
              <el-button v-if="!startShellContent && !startEdit" size="mini" type="primary" @click="addStartShell">添加脚本</el-button>
            </div>
            <el-input v-if="startEdit" v-model="startShellContent" type="textarea" rows="10"></el-input>
            <div v-else-if="startShellContent"><pre style="white-space: break-spaces; line-height: 1.5;background-color: #efefef; padding: 8px" v-html="startShellContent"></pre></div>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="addDisable" @click="submitForm('form')">提交</el-button>
        <el-button @click="closeAdd">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置机器人" :visible.sync="setRobotDialogVisible" width="500px" :close-on-click-modal="false">
      <div style="display: flex;align-items: center">
        <span style="font-size: 12px;flex-shrink: 0">webhook地址：</span>
        <el-input v-model="webhook" type="textarea" :autosize="true"></el-input>
      </div>
      <div style="display: flex; justify-content: center;margin-top: 20px;">
        <el-button @click="setRobotDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setRobot">设置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  changeStatus,
  deploy,
  addProject,
  updateProject,
  removeProject,
  getServerList,
  addShellApi, updateShellApi, getShellApi, getServerIpApi, cloneProjectApi, setWebHookApi, getWebHookApi
} from '@/api/deploy.js'
export default {
  name: 'Dashboard',
  data() {
    return {
      list: [],
      showAdd: false,
      form: {
        name: '',
        url: '',
        branch: '',
        path: '',
        localPath: '',
        server: '0',
        build: 'npm run build',
        outputDir: 'dist',
        tagPrefixes: '',
        buildMode: 'npm',
        eventType: 'push',
        buildShell: '', // 构建脚本
        startShell: ''
      },
      // rules: {
      //   name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      //   url: [{ required: true, message: '请输入项目地址', trigger: 'blur' }],
      //   branch: [{ required: true, message: '请输入项目分支', trigger: 'blur' }],
      //   path: [{ required: true, message: '请输入部署目录', trigger: 'blur' }],
      //   server: [{ required: true, message: '请选择服务器', trigger: 'blur' }],
      //   build: [{ required: true, message: '请输入打包命令', trigger: 'blur' }]
      // },
      addType: 'add',
      addDisable: false,
      serverList: [],
      buildShellContent: '',
      buildEdit: false,
      editType: 'update', // 编辑类型update/add
      startShellContent: '',
      startEdit: false,
      startEditType: 'update', // 编辑类型update/add
      serverLocalIp: '',
      webhook: '',
      setRobotDialogVisible: false
    }
  },
  computed: {
    rules() {
      return {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入项目地址', trigger: 'blur' }],
        eventType: [{ required: true, message: '请选择响应事件', trigger: 'change' }],
        branch: [{ required: this.form.eventType === 'push', message: '请输入项目分支', trigger: 'blur' }],
        path: [{ required: true, message: '请输入部署路径', trigger: 'blur' }],
        // buildShell: [{ required: this.form.buildMode === 'shell', message: '请添加构建脚本', trigger: 'blur' }],
        server: [{ required: true, message: '请选择服务器', trigger: 'blur' }]
      }
    },
    currServer() {
      return this.form.server
    }
  },
  watch: {
    currServer(n) {
      if (n === '0') {
        this.form.startShell = ''
      }
    }
  },
  async mounted() {
    const [res, res2] = await Promise.all([
      getServerList(),
      getServerIpApi()
    ])
    this.serverList = [{
      _id: '0',
      name: '本机',
      ip: res2.data.ip,
      status: true
    }].concat(res.data)
    console.log(res, res2)
    this.getList()
  },
  methods: {
    getServerIp(id) {
      const serverInfo = this.serverList.find(item => item._id === id)
      if (!serverInfo) {
        return ''
      }
      return `${serverInfo.name}(${serverInfo.ip})`
    },
    getList() {
      getList().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.list = res.data.map ? res.data.map(item => {
            item.ip = this.getServerIp(item.server)
            return item
          }) : []
        }
      })
    },
    changeStatus(project) {
      changeStatus({
        id: project._id
      }).then(res => {
        this.$message.success('切换成功！')
        this.getList()
      }).catch(() => {
        this.$message.error('切换失败！')
      })
    },
    async deploy(project) {
      await this.$confirm('确定要部署吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      })
      deploy({
        id: project._id
      }).then(res => {
        this.$message.success('正在部署！')
        this.getList()
      }).catch(() => {
        this.$message.error('响应失败！')
      })
    },
    async openAdd(type, project) {
      this.addType = type || 'add'
      this.showAdd = true
      if (this.addType === 'edit') {
        console.log(project)
        this.form = { ...project }
        if (project.buildShell) {
          // 获取构建脚本
          const { data } = await getShellApi({ name: project.buildShell })
          console.log(data)
          this.buildShellContent = data.content
        }
        if (project.startShell) {
          // 获取启动脚本
          const { data } = await getShellApi({ name: project.startShell })
          console.log(data)
          this.startShellContent = data.content
        }
      }
      this.resetForm('form')
    },
    handleClose(done) {
      console.log('关闭')
      this.resetForm('form')
      done()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addDisable = true
          if (this.addType === 'edit') {
            this.updateProject()
            return
          }
          if (this.form.buildMode === 'shell') {
            this.form.build = ''
          }
          addProject(this.form).then(res => {
            console.log(res.code)
            this.$message.success(res.msg)
            this.closeAdd()
            this.getList()
          }).catch(err => {
            console.log(err)
            if (err.code >= 0) {
              this.$message.warning(err.msg)
              this.closeAdd()
              this.getList()
            } else {
              this.addDisable = false
              this.$message.error(err.msg || '添加失败！')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      if (this.addType === 'add') {
        this.emptyForm()
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    },
    closeAdd() {
      this.addDisable = false
      this.showAdd = false
      this.resetForm('form')
    },
    emptyForm() {
      this.form = {
        name: '',
        url: '',
        branch: '',
        path: '',
        localPath: '',
        server: '0',
        build: 'npm run build',
        outputDir: 'dist',
        tagPrefixes: '',
        buildMode: 'npm',
        eventType: 'push',
        buildShell: '', // 构建脚本
        startShell: ''
      }
      this.buildShellContent = ''
      this.startShellContent = ''
    },
    updateProject() {
      console.log(this.form)
      if (this.form.buildMode === 'shell') {
        this.form.build = ''
      }
      updateProject(this.form).then(res => {
        this.getList()
        this.closeAdd()
        this.$message.success(res.msg)
      }).catch((err) => {
        console.log(err)
        this.addDisable = false
        this.$message.error(err.msg)
      })
    },
    removeProject(id) {
      this.$confirm('确定要删除该项目信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        removeProject({
          id: id
        }).then(res => {
          this.$message.success(res.msg)
          setTimeout(() => {
            this.getList()
          }, 500)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    goRecord(id) {
      console.log(id)
      this.$router.push({
        path: '/record',
        query: {
          id: id
        }
      })
    },
    goServer() {
      this.$router.push({
        path: '/server'
      })
    },
    getServerList() {
      return new Promise((resolve, reject) => {
        getServerList().then(res => {
          if (res.code === 0) {
            resolve(res.data)
          }
          reject()
        }).catch(e => {
          reject(e)
        })
      })
    },
    submitShell() {
      if (!this.buildShellContent) {
        this.$message.error('请输入构建脚本！')
        return
      }
      if (this.editType === 'add' && !this.form.buildShell) {
        addShellApi({
          content: this.buildShellContent
        }).then(res => {
          this.$message.success(res.msg)
          this.buildEdit = false
          this.form.buildShell = res.data.name
        }).catch(err => {
          this.$message.error(err.msg)
        })
      } else {
        updateShellApi({
          name: this.form.buildShell,
          content: this.buildShellContent
        }).then(res => {
          this.$message.success(res.msg)
          this.buildEdit = false
        }).catch(err => {
          this.$message.error(err.msg)
        })
      }
    },
    addBuildShell() {
      this.buildEdit = true
      this.startEdit = false
      this.editType = 'add'
    },
    addStartShell() {
      this.startEdit = true
      this.buildEdit = false
      this.startEditType = 'add'
    },
    submitStartShell() {
      if (!this.startShellContent) {
        this.$message.error('请输入启动脚本内容！')
        return
      }
      if (this.startEditType === 'add' && !this.form.startShell) {
        addShellApi({
          content: this.startShellContent
        }).then(res => {
          this.$message.success(res.msg)
          this.startEdit = false
          this.form.startShell = res.data.name
        }).catch(err => {
          this.$message.error(err.msg)
        })
      } else {
        updateShellApi({
          name: this.form.startShell,
          content: this.startShellContent
        }).then(res => {
          this.$message.success(res.msg)
          this.startEdit = false
        }).catch(err => {
          this.$message.error(err.msg)
        })
      }
    },
    async getServerLocalIp() {
      const res = await getServerIpApi()
      console.log(res)
      if (res.code === 0) {
        this.serverLocalIp = res.data.ip
        return res.data.ip
      }
      return ''
    },
    async cloneProject(row) {
      // 确认
      await this.$confirm('确定要重新克隆该项目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      let resMessage = ''
      let resType = ''
      this.$set(row, 'cloneLoading', true)
      try {
        const { data } = await cloneProjectApi({ id: row._id })
        if (data.name) {
          resMessage = `项目“${data.name}”克隆成功，本地目录：“${data.localPath || data.name}”`
          resType = 'success'
        }
      } catch (e) {
        resMessage = e.error || e.message || e || '克隆失败'
        resType = 'error'
      }
      this.$message({
        message: resMessage,
        type: resType
      })
      this.$set(row, 'cloneLoading', false)
    },
    copyProject(row) {
      const keys = Object.keys(this.form)
      /* buildShell: '', // 构建脚本
        startShell: ''*/
      const skipKeys = ['buildShell', 'startShell'] // 不复制脚本
      for (let i = 0; i < keys.length; i++) {
        if (row[keys[i]] && !skipKeys.includes(keys[i])) {
          this.form[keys[i]] = row[keys[i]]
        }
      }
      this.buildShellContent = ''
      this.startShellContent = ''
      this.addType = 'add'
      this.showAdd = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    goTask() {
      this.$router.push({
        path: '/task'
      })
    },
    async logout() {
      await this.$msgbox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    goUser() {
      this.$router.push({
        path: '/user'
      })
    },
    async openSetRobot() {
      // 打开对话框
      const res = await getWebHookApi()
      this.setRobotDialogVisible = true
      this.webhook = res.data.webhook || ''
    },
    async setRobot() {
      const url = this.webhook || ''
      // 调接口
      setWebHookApi({
        webhook: url
      }).then(res => {
        this.$message.success(res.msg)
        this.setRobotDialogVisible = false
      }).catch(err => {
        console.log(err)
        // this.$message.error(err.msg)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    /*margin: 30px;*/
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
<style scoped>
  .dashboard-container{
    padding: 20px;
  }
  .el-form-item.inline{
    width: 50%;
    display: inline-block;
  }
  .addButton{
    position: absolute;
    right: 20px;
    top: 0
  }
  .logout-button{
    position: absolute;
    left: 0;
    top: 0;
    padding: 0;
  }
  .goServer{
    position: absolute;
    right: 110px;
    top: 0
  }
  .set-robot{
    position: absolute;
    right: 390px;
    top:0
  }
  .goUser{
    position: absolute;
    right: 300px;
    top: 0
  }
  .goTask{
    position: absolute;
    right: 210px;
    top: 0
  }
  .projectName:hover{
    color: #2C8CF2;
    cursor: pointer;
  }
  ::v-deep .addDialog{
    width: 100%;
    height: 100vh;
    margin: 0!important;
    & > .el-dialog__body{
      max-height: calc(100vh - 136px);
      overflow: auto;
    }
  }
  ::v-deep .dialog-footer{
    width: 800px;
    margin: auto;
  }
</style>
