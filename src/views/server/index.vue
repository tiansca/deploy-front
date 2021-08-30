<template>
  <div class="dashboard-container">
    <div style="position: relative">
      <h3 style="text-align: center">服务器列表</h3>
      <el-button class="goProject" size="small" @click="goProject">返回</el-button>
      <el-button class="addButton" size="small" @click="openAdd('add')">添加服务器</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 1200px;margin: 20px auto;"
    >
      <el-table-column
        prop="name"
        label="服务器名称"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="ip"
        label="ip"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
      >
      </el-table-column>
      <el-table-column
        prop="connectionType"
        label="连接方式"
      >
        <template slot-scope="scope">
          {{ scope.row.connectionType ? '密钥' : '密码' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="rootPath"
        label="部署根目录"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="是否可用"
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
          <el-button size="mini" type="primary" @click="openAdd('edit', scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="removeProject(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  添加服务器  -->
    <el-dialog
      :title="addType==='add'?'添加服务器':'编辑服务器'"
      :visible.sync="showAdd"
      width="650px"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="服务器名称" class="inline" prop="name">
          <el-input v-model="form.name" :readonly="addType==='edit'"></el-input>
        </el-form-item>
        <el-form-item label="ip" class="inline" prop="ip">
          <el-input v-model="form.ip"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username" class="inline">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="连接方式" prop="connectionType" class="inline">
          <el-radio v-model="form.connectionType" :label="0">密码</el-radio>
          <el-radio v-model="form.connectionType" :label="1">密钥</el-radio>
        </el-form-item>
        <el-form-item v-show="!form.connectionType" label="密码" :rules="!form.connectionType ? rules.password : null" class="inline">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item v-show="form.connectionType" class="inline" label="私钥路径" :rules="form.connectionType ? rules.privateKey : null">
          <el-input v-model="form.privateKey"></el-input>
        </el-form-item>
        <el-form-item label="部署目录" prop="rootPath">
          <el-input v-model="form.rootPath" placeholder="web服务器下存放网页的目录"></el-input>
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
import { getServerList, addServer, updateServer, removeServer, changeServerStatus } from '@/api/deploy.js'
export default {
  name: 'Server',
  data() {
    return {
      list: [],
      showAdd: false,
      form: {
        name: '',
        ip: '',
        username: '',
        password: '',
        rootPath: '',
        connectionType: 0,
        privateKey: ''
      },
      rules: {
        name: [{ required: true, message: '请输入服务器名称', trigger: 'blur' }],
        rootPath: [{ required: true, message: '请输入部署根路径', trigger: 'blur' }],
        ip: [{ required: true, message: '请输入服务器ip', trigger: 'blur' }],
        username: [{ required: true, message: '请输入服务器用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入服务器密码', trigger: 'blur' }],
        privateKey: [{ required: true, message: '请输入密钥路径', trigger: 'blur' }]
      },
      addType: 'add',
      addDisable: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getServerList().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.list = res.data
        }
      })
    },
    changeStatus(project) {
      changeServerStatus({
        id: project._id
      }).then(res => {
        this.$message.success('切换成功！')
        this.getList()
      }).catch(() => {
        this.$message.error('切换失败！')
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
          addServer(this.form).then(res => {
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
        ip: '',
        username: '',
        password: '',
        rootPath: '',
        connectionType: 0,
        privateKey: ''
      }
    },
    updateProject() {
      console.log(this.form)
      updateServer(this.form).then(res => {
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
      this.$confirm('确定要删除该服务器信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeServer({
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
    goProject() {
      this.$router.push({
        path: '/'
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
  .goProject{
    position: absolute;
    right: 120px;
    top: 0
  }
  .projectName:hover{
    color: #2C8CF2;
    cursor: pointer;
  }
</style>
