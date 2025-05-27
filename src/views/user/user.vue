<template>
  <div class="dashboard-container">
    <div style="position: relative">
      <h3 style="text-align: center">用户管理</h3>
      <el-button class="back-Button" size="small" type="text" icon="el-icon-back" @click="goBank">返回</el-button>
      <el-button class="addButton" size="small" type="primary" @click="openAdd('add')">添加用户</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 1200px;margin: 20px auto;"
    >
      <el-table-column
        prop="username"
        label="用户名"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime | timeFilter }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime | timeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="openAdd('edit',scope.row)"
          >编辑</el-button>
          <el-button
            :disabled="scope.row.username === 'admin'"
            size="mini"
            type="danger"
            @click="removeProject(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="addType==='add'?'添加用户':'编辑用户'"
      :visible.sync="showAdd"
      custom-class="addDialog"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="addType === 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择">
            <el-option
              v-for="item in [{label:'管理员',value:'admin'},{label:'普通用户',value:'user'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { addUser, getUserList, removeUser, updateUser } from '@/api/user'

export default {
  name: 'User',
  data() {
    return {
      tableData: [],
      form: {
        id: '',
        username: '',
        password: '',
        role: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      addType: 'add',
      addDisable: false,
      showAdd: false
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    goBank() {
      this.$router.back()
    },
    async getUserList() {
      const res = await getUserList()
      this.tableData = res.data.map(item => {
        item.id = item._id
        return item
      })
    },
    openAdd(type, project) {
      if (type === 'add') {
        this.addType = 'add'
        this.form = {
          id: '',
          username: '',
          password: '',
          role: ''
        }
        this.showAdd = true
      } else {
        this.addType = 'edit'
        this.form = {
          id: project.id,
          username: project.username,
          password: project.password,
          role: project.role
        }
        this.showAdd = true
      }
    },
    handleClose(done) {
      this.showAdd = false
      this.emptyForm()
    },
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.addDisable = true
          if (this.addType === 'edit') {
            await updateUser(this.form).then(res => {
              console.log(res.code)
              if (res.code >= 0) {
                this.$message.success(res.msg)
                this.closeAdd()
                this.getUserList()
              } else {
                this.addDisable = false
                this.$message.error(res.msg || '添加失败！')
              }
            })
          } else {
            await addUser(this.form).then(res => {
              console.log(res.code)
              if (res.code >= 0) {
                this.$message.success(res.msg)
                this.closeAdd()
                this.getUserList()
              } else {
                this.addDisable = false
                this.$message.error(res.msg || '添加失败！')
              }
            })
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    closeAdd() {
      this.showAdd = false
      this.emptyForm()
    },
    emptyForm() {
      this.form = {
        id: '',
        username: '',
        password: '',
        role: ''
      }
    },
    removeProject(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await removeUser({ id })
        if (res.code >= 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUserList()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-container{
  padding: 20px;
}
.back-Button{
  position: absolute;
  left: 20px;
  top: 0;
  padding: 4px 8px;
}
.addButton{
  position: absolute;
  right: 20px;
  top: 0
}
</style>
