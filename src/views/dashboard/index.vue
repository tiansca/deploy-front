<template>
  <div class="dashboard-container">
    <div style="position: relative">
      <h3 style="text-align: center">项目列表</h3>
      <el-button class="goServer" size="small" @click="goServer">服务器列表</el-button>
      <el-button class="addButton" size="small" @click="openAdd('add')">添加项目</el-button>
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
      >
        <template slot-scope="scope">
          <span class="projectName" @click="goRecord(scope.row._id)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="branch"
        label="项目分支"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="ip"
        label="部署服务器"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="path"
        label="部署目录"
        width="360"
      >
      </el-table-column>
      <el-table-column
        prop="url"
        label="git地址"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="是否自动部署"
        width="120"
      >
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.status ? 'success' : 'warning'" style="cursor: pointer" @click="changeStatus(scope.row)">
            {{ scope.row.status ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="240"
      >
        <template slot-scope="scope">
          <!--          <el-button size="mini">clone</el-button>-->
          <el-button size="mini" type="success" @click="deploy(scope.row)">部署</el-button>
          <el-button size="mini" type="primary" @click="openAdd('edit', scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="removeProject(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  添加项目  -->
    <el-dialog
      :title="addType==='add'?'添加项目':'编辑项目'"
      :visible.sync="showAdd"
      custom-class="addDialog"
      :before-close="handleClose"
    >
      <el-form ref="form" style="width: 800px; margin: auto" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="form.name" placeholder="若想自动部署，则必须将项目名称与git项目名保持一致"></el-input>
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
          <el-select v-model="form.server" placeholder="请选择服务器">
            <el-option v-for="item in serverList" v-show="item.status" :key="item._id" :value="item._id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="本地目录" class="inline" prop="localPath" title="本地项目文件夹名称，为空则用项目名称">
          <el-input v-model="form.localPath" placeholder="本地项目文件夹名称，为空则用项目名称"></el-input>
        </el-form-item>
        <el-form-item label="产出物路径" class="inline" prop="outputDir" title="构建文件的相对路径">
          <el-input v-model="form.outputDir" placeholder="构建文件的相对路径"></el-input>
        </el-form-item>
        <el-form-item label="部署路径" class="inline" prop="path" title="远程绝对路径">
          <el-input v-model="form.path" placeholder="远程服务器部署目录"></el-input>
        </el-form-item>
        <el-form-item label="构建模式" prop="buildMode" class="inline">
          <el-radio-group v-model="form.buildMode">
            <el-radio label="npm">npm</el-radio>
            <el-radio label="shell">shell</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="form.buildMode === 'npm'">
          <el-form-item label="打包命令" prop="build" class="inline">
            <el-input v-model="form.build" placeholder="请输入打包命令"></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="部署脚本" prop="buildShell">
            <div>
              <el-button v-if="buildShellContent && !buildEdit" type="primary" size="mini" @click="buildEdit=true;editType='update'">编辑</el-button>
              <el-button v-if="buildEdit" size="mini" @click="buildEdit=false">取消</el-button>
              <el-button v-if="buildEdit" size="mini" type="primary" @click="submitShell">保存</el-button>
              <el-button v-if="!buildShellContent && !buildEdit" size="mini" type="primary" @click="addBuildShell">添加脚本</el-button>
            </div>
            <el-input v-if="buildEdit" v-model="buildShellContent" type="textarea" rows="10"></el-input>
            <div v-else-if="buildShellContent"><pre style="white-space: break-spaces" v-html="buildShellContent"></pre></div>
          </el-form-item>
          <el-form-item label="启动脚本" prop="startShell">
            <div>
              <el-button v-if="startShellContent && !startEdit" type="primary" size="mini" @click="startEdit=true;startEditType='update'">编辑</el-button>
              <el-button v-if="startEdit" size="mini" @click="startEdit=false">取消</el-button>
              <el-button v-if="startEdit" size="mini" type="primary" @click="submitStartShell">保存</el-button>
              <el-button v-if="!startShellContent && !startEdit" size="mini" type="primary" @click="addStartShell">添加脚本</el-button>
            </div>
            <el-input v-if="startEdit" v-model="startShellContent" type="textarea" rows="10"></el-input>
            <div v-else-if="startShellContent"><pre style="white-space: break-spaces" v-html="startShellContent"></pre></div>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="addDisable" @click="submitForm('form')">提交</el-button>
        <el-button @click="closeAdd">取消</el-button>
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
  addShellApi, updateShellApi, getShellApi
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
        server: '',
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
      startEditType: 'update' // 编辑类型update/add
    }
  },
  computed: {
    rules() {
      return {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入项目地址', trigger: 'blur' }],
        eventType: [{ required: true, message: '请选择响应事件', trigger: 'change' }],
        branch: [{ required: this.form.eventType === 'push', message: '请输入项目分支', trigger: 'blur' }],
        path: [{ required: this.form.buildMode === 'npm', message: '请输入部署路径', trigger: 'blur' }],
        // buildShell: [{ required: this.form.buildMode === 'shell', message: '请添加构建脚本', trigger: 'blur' }],
        server: [{ required: true, message: '请选择服务器', trigger: 'blur' }]
      }
    }
  },
  async mounted() {
    await this.getServerList()
    this.getList()
  },
  methods: {
    getServerIp(id) {
      return this.serverList.find(item => item._id === id).ip
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
    deploy(project) {
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
        server: '',
        build: 'npm run build',
        outputDir: 'dist',
        tagPrefixes: '',
        buildMode: 'npm',
        eventType: 'push',
        buildShell: '' // 构建脚本
      }
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
        type: 'warning'
      }).then(() => {
        removeProject({
          id: id
        }).then(res => {
          this.$message.success(res.msg)
          this.getList()
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
            this.serverList = res.data
            resolve()
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
      this.editType = 'add'
    },
    addStartShell() {
      this.startEdit = true
      this.startEditType = 'add'
    },
    submitStartShell() {
      if (!this.buildShellContent) {
        this.$message.error('请输入构建脚本！')
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
          name: this.form.buildShell,
          content: this.startShellContent
        }).then(res => {
          this.$message.success(res.msg)
          this.startEdit = false
        }).catch(err => {
          this.$message.error(err.msg)
        })
      }
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
  .goServer{
    position: absolute;
    right: 120px;
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
  }
  ::v-deep .dialog-footer{
    width: 800px;
    margin: auto;
  }
</style>
