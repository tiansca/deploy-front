// 记录是否是 领导驾驶舱跳转企业报告
const state = {
  source: ''
}

const mutations = {
  SET_REPORT: (state, value) => {
    state.source = value
  }
}

export default {
  state,
  mutations
}
