import request from '@/utils/request'

// 地区
export function getRegionApi(params) {
  return request({
    url: process.env.VUE_APP_BACKEND_API + '/common/tree/region/',
    method: 'get',
    params
  })
}
// 行业
export function getIndustryApi(params) {
  return request({
    url: process.env.VUE_APP_BACKEND_API + '/common/tree/nic/',
    method: 'get',
    params
  })
}
// 企业模糊搜索
export function searchCompanyApi(params) {
  return request({
    url: process.env.VUE_APP_BACKEND_API + '/entmohu/',
    method: 'get',
    params
  })
}
// 时间
export function getTimeApi(params) {
  return request({
    url: process.env.VUE_APP_BACKEND_API + '/common/list/time/',
    method: 'get',
    params
  })
}

// 获取用户签名
export function getSign(params) {
  return request({
    url: process.env.VUE_APP_BACKEND_API + '/api/common/sign/',
    method: 'get',
    params
  })
}

// 地址模糊搜索
export function getEntDom(params) {
  return request({
    url: process.env.VUE_APP_BACKEND_API + '/api/common/recommend_ent_dom/',
    method: 'get',
    params
  })
}

// 企业id加密
export function secretEntId(params) {
  return request({
    url: process.env.VUE_APP_BACKEND_API + '/api/common/secret_entid/',
    method: 'get',
    params
  })
}

// 判断该用户是否关注了某一企业
export function isAttentionApi(params) {
  return request({
    url: process.env.VUE_APP_BACKEND_API + '/merchants/user/about/company/',
    method: 'get',
    params
  })
}

