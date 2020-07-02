<template>
  <div class="login-container" :style="{backgroundImage:'url('+require('@/assets/imgs/login/bg.png')+')'}">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="login-left ">
        <!-- <img src="@/assets/imgs/login/login.png"> -->
      </div>
      <div class="login-right">
        <div class="login-flex">
          <div class="title-container">
            <h3 class="title">测试项目部署</h3>
          </div>

          <el-form-item prop="key">
            <!-- <span class="svg-container">
              <svg-icon icon-class="user" />
            </span> -->
            <el-input
              ref="key"
              v-model="loginForm.key"
              placeholder="请输入用户名"
              name="key"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <!-- <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span> -->
          </el-form-item>

          <el-button :loading="loading" type="primary" style="width:100%;margin:15% auto 20%;" @click.native.prevent="handleLogin">登录</el-button>

        </div>

      </div>

    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import { MessageBox } from 'element-ui'
import { encryptPassword } from '@/utils/encrypt'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!validUsername(value)) {
      //   callback(new Error('请输入正确的用户名'))
      // } else {
      callback()
      // }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请确保密码不少于六位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        key: '',
        password: ''
      },
      loginRules: {
        key: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      // const _this = this
      console.log('1', this)
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', {
            key: this.loginForm.key,
            password: encryptPassword(this.loginForm.password)
          }).then(async() => {
            // 获取用户信息
            await this.$store.dispatch('user/getInfo')
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch((err) => {
            console.log(err)
            if (err.code === 3) {
              MessageBox.alert('账号错误！', '提示', {
                type: 'warning'
              })
            } else if (err.code === 2) {
              MessageBox.alert('密码错误！', '提示', {
                type: 'warning'
              })
            }
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#fff;
$light_gray:#fff;
$cursor: #0056B2;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 100%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $cursor;
      height: 40px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #0056B2;
    background: #fff;
    border-radius: 3px;
    color: #0056B2;
    margin: 30px auto;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#0056B2;

.login-container {
    height: 100%;
    width: 100%;
    min-height: 700px;
    background-repeat: no-repeat;
    background-position: 100% 100%;
    background-size: 100% 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  .login-form {
    position: relative;
    width: 85%;
    height: 90%;
    max-width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-left {
      width: 40%;
      display: inline-block;
    }
    .login-left img {
      display: block;
      width: 100%;
      height: auto;
    }
    .login-right{
      width: 440px;
      height: 530px;
      margin-top: 20px;
      background: #fff;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      box-shadow: 0px 7px 13px 0px rgba(0, 0, 0, 0.23);
      border-radius: 10px;
    }
    .login-flex {
      width: 75%;
    }
    .el-button.el-button--primary {
      background: linear-gradient(90deg,rgba(0,86,178,1) 0%,rgba(16,108,207,1) 100%);
      border: none;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
    font-size: 1.875em;
    color: #0056B2;
    margin: 20% auto 30% auto;
    text-align: center;
    font-weight: bold;
    letter-spacing: 7px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
<style scoped>
@media screen and (max-width: 1366px) and (min-width:1280px){
.login-container .login-form{
  width: 60%;
  margin-top: 2%;
}
}
@media screen and (max-width: 1280px){
.login-left {
  display: none;
}
.login-form{
  max-width: 1288px;
}
.login-right{
  width: 60%;
}
}
</style>
