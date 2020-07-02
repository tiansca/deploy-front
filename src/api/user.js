import request from '@/utils/request'

export function login(data) {
  data.platform = 'lingxi_zs'
  return request({
    url: `user/login`,
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: `user/myself`,
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: `user/logout`,
    method: 'get'
  })
}
