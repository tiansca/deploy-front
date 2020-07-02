import request from '@/utils/request'

// 企业关注列表
export function getFocusCompanyApi(params) {
  return request({
    url: process.env.VUE_APP_BACKEND_API + '/merchants/user/company/',
    methods: 'get',
    params
  })
}

// 添加关注企业
export function postFouceApi(data) {
  return request({
    url: process.env.VUE_APP_BACKEND_API + '/merchants/user/company/',
    method: 'post',
    data
  })
}

// 取消关注企业
export function deleteFouceApi(params) {
  return request({
    url: process.env.VUE_APP_BACKEND_API + '/merchants/user/company/',
    method: 'delete',
    params
  })
}

// 模糊搜索企业名称
export function fuzzyCompanyName(params) {
  return request({
    url: process.env.VUE_APP_BACKEND_API + '/merchants/entmohu/',
    method: 'get',
    params
  })
}

// 获取企业详情
export function getCompanyDatail(params) {
  return request({
    url: process.env.VUE_APP_BACKEND_API + '/merchants/related/hover/',
    method: 'get',
    params
  })
}

// 用户更换自己得密码
export function changePassword(data) {
  return request({
    url: '/user/changePassword/',
    method: 'post',
    data
  })
}

// 获取个人信息
export function getUserDetail(params) {
  return request({
    url: '/user/myself',
    method: 'get',
    params
  })
}

// 修改手机号和邮箱
export function changeUserDetail(data) {
  return request({
    url: '/user/myself',
    method: 'put',
    data
  })
}

// 手机号和邮箱得验证
export function changeParams(params) {
  return request({
    url: '/user/check',
    method: 'get',
    params
  })
}
