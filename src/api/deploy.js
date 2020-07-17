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

export function getServerList(params) {
  return request({
    url: 'server_list',
    method: 'get',
    params
  })
}
export function addServer(data) {
  return request({
    url: 'add_server',
    method: 'post',
    data
  })
}
export function updateServer(data) {
  return request({
    url: 'update_server',
    method: 'post',
    data
  })
}
export function removeServer(params) {
  return request({
    url: 'remove_server',
    method: 'get',
    params
  })
}
export function changeServerStatus(params) {
  return request({
    url: 'change_server_status',
    method: 'get',
    params
  })
}

