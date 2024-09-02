import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'list',
    method: 'get'
    // params: { token }
  })
}

export function changeStatus(params) {
  return request({
    url: 'changeStatus',
    method: 'get',
    params
  })
}

export function deploy(params) {
  return request({
    url: 'deploy',
    method: 'get',
    params
  })
}

export function addProject(data) {
  return request({
    url: 'add_project',
    method: 'post',
    data
  })
}

export function updateProject(data) {
  return request({
    url: 'update',
    method: 'post',
    data
  })
}

export function removeProject(params) {
  return request({
    url: 'remove',
    method: 'get',
    params
  })
}

export function recordList(params) {
  return request({
    url: 'record_list',
    method: 'get',
    params
  })
}
// 新建shell
export function addShellApi(data) {
  return request({
    url: 'add_shell',
    method: 'post',
    data
  })
}
// 编辑shell
export function updateShellApi(data) {
  return request({
    url: 'update_shell',
    method: 'post',
    data
  })
}
// 获取shell详情
export function getShellApi(params) {
  return request({
    url: 'get_shell_content',
    method: 'get',
    params
  })
}
