<template>
  <div class="zs-user-detial">
    <h1 class="zs-focus-search-title">修改密码</h1>
    <el-form ref="passwordParams" :model="passwordParams" :label-position="'left'" :rules="resetPwdRules" label-width="74px">
      <el-form-item label="账户名:">
        <span class="labelColor">{{ name }}</span>
      </el-form-item>
      <el-form-item label="旧密码:" prop="oldPassword">
        <el-input v-model="passwordParams.oldPassword" type="password" style="width:400px" autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="新密码:" prop="password">
        <el-input v-model="passwordParams.password" type="password" style="width:400px" autocomplete="new-password"></el-input>
      </el-form-item>
      <el-button type="danger" class="zs-detail-btn" @click="submitDetalForm('passwordParams')">确认修改</el-button>
    </el-form>
  </div>
</template>
<script>
import { changePassword } from '@/api/personalCenter'
import { mapGetters } from 'vuex'
import { encryptPassword } from '@/utils/encrypt'
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入旧密码'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.toString().length < 6 || value.toString().length > 18) {
        callback(new Error('密码长度为6 - 18个字符'))
      } else if (value === this.passwordParams.oldPassword) {
        callback(new Error('新密码不能和旧密码一致'))
      } else {
        callback()
      }
    }
    return {
      passwordParams: {
        oldPassword: '',
        password: ''
      },
      resetPwdRules: {
        oldPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    async submitDetalForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changePassword({
            oldPassword: encryptPassword(this.passwordParams.oldPassword),
            password: encryptPassword(this.passwordParams.password)
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('修改密码成功，请重新登录')
              this.logout()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped src="./index.scss"></style>
<style lang="scss" scoped>
.el-input /deep/ .el-input__inner:focus {
  border-color:#0464CB!important;
}
.el-form {
  .is-required {
    margin-left:-10px
  }
}
.zs-detail-btn {
  margin-top: 50px!important;
}
</style>

