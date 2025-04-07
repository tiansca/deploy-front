import request from '@/utils/request'

export function login(data) {
  return request({
    url: `users/login`,
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: `users/myself`,
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: `users/logout`,
    method: 'get'
  })
}
// 获取用户列表
export function getUserList(params) {
  return request({
    url: `users/list`,
    method: 'get',
    params
  })
}

// 删除用户
export function removeUser(params) {
  return request({
    url: `users/remove`,
    method: 'get',
    params
  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: `users/add`,
    method: 'post',
    data
  })
}
export function updateUser(data) {
  return request({
    url: `users/update`,
    method: 'post',
    data
  })
}
