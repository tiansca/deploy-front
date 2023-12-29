<template>
  <div class="zs-user-detial">
    <h1 class="zs-focus-search-title">修改个人信息</h1>
    <el-form ref="userDetail" :model="userDetail" :label-position="'left'" label-width="100px" :rules="resetInforules">
      <el-form-item label="账户名:" class="space"><span class="labelColor">{{ fromData.name }}</span></el-form-item>
      <el-form-item label="所属公司:"><span class="labelColor">{{ fromData.group.name }}</span></el-form-item>
      <el-form-item label="账户余额:"><span class="labelColor">{{ fromData.balance }}</span></el-form-item>
      <el-form-item label="会员到期时间:">
        <span v-if="fromData.expirationAt" class="labelColor">{{ fromData.expirationAt === null? '永久': fromData.expirationAt.substring(0,10) }}</span>
      </el-form-item>
      <el-form-item label="联系电话:" prop="phone">
        <el-input v-model="userDetail.phone" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱:" prop="email">
        <el-input v-model="userDetail.email" style="width:400px"></el-input>
      </el-form-item>
      <el-button type="danger" class="zs-detail-btn" @click="submitDetalForm('userDetail')">确认修改</el-button>
    </el-form>
  </div>
</template>
<script>
import { getUserDetail, changeUserDetail, changeParams } from '@/api/personalCenter'
export default {
  data() {
    return {
      userDetail: {
        phone: '',
        email: ''
      },
      fromData: {
        group: {}
      },
      resetInforules: {
        phone: [
          { required: true,
            validator: (rule, value, callback) => {
              this.validatorParam(rule, value, callback, 'phone')
            },
            trigger: 'blur'
          }
        ],
        email: [
          { required: true,
            validator: (rule, value, callback) => {
              this.validatorParam(rule, value, callback, 'email')
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getUserDetail()
  },
  methods: {
    getUserDetail() {
      getUserDetail().then(res => {
        if (res.code === 0) {
          this.fromData = res.data
          this.userDetail.phone = res.data.phone
          this.userDetail.email = res.data.email
        }
      })
    },
    validatorParam(rule, value, callback, params) {
      const msg = params === 'phone' ? '联系电话' : '邮箱地址'
      const reg = params === 'phone' ? /^1[3|4|5|7|8][0-9]\d{8}$/ : /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (!value) {
        return callback(new Error(`请输入${msg}`))
      } else {
        if (!reg.test(value)) {
          return callback(new Error(`请输入正确的${msg}`))
        } else {
          this.checkParam(params, callback)
        }
      }
    },
    checkParam(param, callback) {
      if (this.fromData[param] !== this.userDetail[param]) {
        changeParams({ type: param, key: this.userDetail[param], id: this.fromData.id }).then(res => {
          if (res.data.have === 0) {
            this.disabled = false
            callback()
          } else {
            const msg = param === 'phone' ? '该手机号已经被注册过了' : '该邮箱已经被注册过了'
            return callback(new Error(msg))
          }
        })
      } else {
        callback()
      }
    },
    submitDetalForm(formName) {
      if (this.fromData.phone !== this.userDetail.phone || this.fromData.email !== this.userDetail.email) {
        this.$refs.userDetail.validate((valid) => {
          if (valid) {
            changeUserDetail(this.userDetail).then(res => {
              if (res.code === 0) {
                this.$message.success('个人信息修改成功')
                this.getUserDetail()
              }
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped src="./index.scss"></style>
<style lang="scss" scoped>
.el-input ::v-deep .el-input__inner:focus {
  border-color:#0464CB!important;
}
.zs-detail-btn {
  margin-top: 50px!important;
}
.el-form {
  .is-required {
    margin-left:-10px
  }
}
.space ::v-deep  {
  .el-form-item__label {
    letter-spacing: 5px;
  }
}
</style>

