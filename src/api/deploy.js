import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/proxy/deploy/list',
    method: 'get'
    // params: { token }
  })
}

export function changeStatus(params) {
  return request({
    url: '/proxy/deploy/changeStatus',
    method: 'get',
    params
  })
}

export function deploy(params) {
  return request({
    url: '/proxy/deploy/deploy',
    method: 'get',
    params
  })
}

export function addProject(data) {
  return request({
    url: '/proxy/deploy/add_project',
    method: 'post',
    data
  })
}

export function updateProject(data) {
  return request({
    url: '/proxy/deploy/update',
    method: 'post',
    data
  })
}

export function removeProject(params) {
  return request({
    url: '/proxy/deploy/remove',
    method: 'get',
    params
  })
}

export function recordList(params) {
  return request({
    url: '/proxy/deploy/record_list',
    method: 'get',
    params
  })
}
export function getRecordDetail(params) {
  return request({
    url: '/proxy/deploy/record_detail',
    method: 'get',
    params
  })
}

export function getServerList(params) {
  return request({
    url: '/proxy/deploy/server_list',
    method: 'get',
    params
  })
}
export function addServer(data) {
  return request({
    url: '/proxy/deploy/add_server',
    method: 'post',
    data
  })
}
export function updateServer(data) {
  return request({
    url: '/proxy/deploy/update_server',
    method: 'post',
    data
  })
}
export function removeServer(params) {
  return request({
    url: '/proxy/deploy/remove_server',
    method: 'get',
    params
  })
}
export function changeServerStatus(params) {
  return request({
    url: '/proxy/deploy/change_server_status',
    method: 'get',
    params
  })
}

// 新建shell
export function addShellApi(data) {
  return request({
    url: '/proxy/deploy/add_shell',
    method: 'post',
    data
  })
}
// 编辑shell
export function updateShellApi(data) {
  return request({
    url: '/proxy/deploy/update_shell',
    method: 'post',
    data
  })
}
// 获取shell详情
export function getShellApi(params) {
  return request({
    url: '/proxy/deploy/get_shell_content',
    method: 'get',
    params
  })
}

// 获取服务端ip
export function getServerIpApi(params) {
  return request({
    url: '/proxy/deploy/get_server_ip',
    method: 'get',
    params
  })
}

// 克隆项目
export function cloneProjectApi(params) {
  return request({
    url: '/proxy/deploy/clone_project',
    method: 'get',
    params
  })
}

// 停止当前项目
export function stopCurrTaskApi(params) {
  return request({
    url: '/proxy/deploy/stop_curr',
    method: 'get',
    params
  })
}
// 取消指定任务
export function cancelTaskApi(params) {
  return request({
    url: '/proxy/deploy/cancel_task',
    method: 'get',
    params
  })
}

// 设置webhook地址
export function setWebHookApi(data) {
  return request({
    url: '/proxy/deploy/set_webhook',
    method: 'post',
    data
  })
}

// 获取webhook地址
export function getWebHookApi(params) {
  return request({
    url: '/proxy/deploy/get_webhook',
    method: 'get',
    params
  })
}
