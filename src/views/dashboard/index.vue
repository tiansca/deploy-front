<template>
  <div class="dashboard-container">
    <div style="position: relative">
      <h3 style="text-align: center">项目列表</h3>
      <el-button class="goServer" size="small" @click="goServer">服务器列表</el-button>
      <el-button class="addButton" size="small" @click="openAdd('add')">添加项目</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 1200px;margin: 20px auto;"
    >
      <el-table-column
        prop="name"
        label="项目名称"
        width="140"
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
        prop="path"
        label="部署目录"
        width="120"
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
      width="650px"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="form.name" :readonly="addType==='edit'" placeholder="若想自动部署，则必须将项目名称与git项目名保持一致"></el-input>
        </el-form-item>
        <el-form-item label="项目地址" prop="url">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="本地目录" class="inline" prop="localPath" title="本地项目文件夹名称，为空则用项目名称">
          <el-input v-model="form.localPath" placeholder="本地项目文件夹名称，为空则用项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目分支" class="inline" prop="branch">
          <el-input v-model="form.branch"></el-input>
        </el-form-item>
        <el-form-item label="打包命令" prop="build" class="inline">
          <el-input v-model="form.build" placeholder="请输入打包命令"></el-input>
        </el-form-item>
        <el-form-item label="打包路径" class="inline" prop="outputDir">
          <el-input v-model="form.outputDir" placeholder="打包构建文件的相对路径"></el-input>
        </el-form-item>
        <el-form-item label="部署服务器" prop="server" class="inline">
          <el-select v-model="form.server" placeholder="请选择服务器">
            <el-option v-for="item in serverList" v-show="item.status" :key="item._id" :value="item._id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部署目录" class="inline" prop="path" title="web根目录下的文件夹名称，非完整路径">
          <el-input v-model="form.path" placeholder="web根目录下的文件夹名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="addDisable" @click="submitForm('form')">提交</el-button>
          <el-button @click="closeAdd">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getList, changeStatus, deploy, addProject, updateProject, removeProject, getServerList } from '@/api/deploy.js'
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
        build: 'npm run build:stage',
        outputDir: 'dist'
      },
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入项目地址', trigger: 'blur' }],
        branch: [{ required: true, message: '请输入项目分支', trigger: 'blur' }],
        path: [{ required: true, message: '请输入部署目录', trigger: 'blur' }],
        server: [{ required: true, message: '请选择服务器', trigger: 'blur' }],
        build: [{ required: true, message: '请输入打包命令', trigger: 'blur' }]
      },
      addType: 'add',
      addDisable: false,
      serverList: []
    }
  },
  mounted() {
    this.getList()
    this.getServerList()
  },
  methods: {
    getList() {
      getList().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.list = res.data
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
    openAdd(type, project) {
      this.addType = type || 'add'
      this.showAdd = true
      if (this.addType === 'edit') {
        this.form = { ...project }
      }
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
      this.$refs[formName].resetFields()
      this.emptyForm()
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
        server: '',
        build: 'npm run build:stage',
        outputDir: 'dist'
      }
    },
    updateProject() {
      console.log(this.form)
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
      getServerList().then(res => {
        if (res.code === 0) {
          this.serverList = res.data
        }
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
  .goServer{
    position: absolute;
    right: 120px;
    top: 0
  }
  .projectName:hover{
    color: #2C8CF2;
    cursor: pointer;
  }
</style>
