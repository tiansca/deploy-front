const state = {
  fileName: '',
  searchObj: {}
}

const mutations = {
  SAVE_INFO_FILE: (state, { name, obj }) => {
    console.log(name)
    state.fileName = name
    state.searchObj = obj
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
