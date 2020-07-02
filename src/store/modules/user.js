import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: require('../../assets/imgs/login/person.png'),
    roles: [],
    id: '',
    groupId: '',
    partialArea: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER_ID: (state, id) => {
    state.id = id
  },
  SET_GID: (state, id) => {
    state.groupId = id
  },
  PAGE_AREA: (state, partialArea) => {
    state.partialArea = partialArea
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { key, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ key: key.trim(), password: password }).then(response => {
        // const { data } = response
        commit('SET_TOKEN', 'dataToken')
        setToken('dataToken')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  async getInfo({ commit }, cache) {
    try {
      if (cache) {
        const data = JSON.parse(sessionStorage.getItem('userInfo'))
        commit('SET_NAME', data.name)
        if (data.groupId) {
          commit('SET_GID', data.groupId)
        }
        if (data.id) {
          commit('SET_USER_ID', data.id)
        }
        if (data.roles && data.roles.length > 0) {
          commit('SET_ROLES', data.roles.map(item => {
            return item.name
          }))
        }
        const pageActions = new Set()
        data.actions.forEach(item => {
          if (item.type === 'page') {
            pageActions.add(item.key)
          }
        })
        data.roleActions.forEach(item => {
          if (item.type === 'page') {
            pageActions.add(item.key)
          }
        })
        const partialArea = []
        data.roleActions.forEach(item => {
          if (item.type === 'partialArea') {
            partialArea.push(item.key)
          }
        })
        commit('PAGE_AREA', partialArea)
        data.pageActions = Array.from(pageActions)
        return Promise.resolve(data)
      }
      const userInfo = await getInfo()
      const { data } = userInfo
      if (data.id) {
        commit('SET_USER_ID', data.id)
      }
      const pageActions = new Set()
      data.actions.forEach(item => {
        if (item.type === 'page') {
          pageActions.add(item.key)
        }
      })
      data.roleActions.forEach(item => {
        if (item.type === 'page') {
          pageActions.add(item.key)
        }
      })
      // commit('SET_PAGE_ACTIONS', Array.from(pageActions))
      data.pageActions = Array.from(pageActions)
      // data.authority = pageActions.has('merchantSystem')
      // 判断有无驾驶舱权限
      // console.log('写入', data.authority)
      // commit('SET_AUTHORITY', data.authority)
      sessionStorage.setItem('userInfo', JSON.stringify(data))
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     // getInfo(state.token).then(response => {
  //     //   const { data } = response
  //     //
  //     //   if (!data) {
  //     //     reject('Verification failed, please Login again.')
  //     //   }
  //     //
  //     //   const { roles, name, avatar } = data
  //     //
  //     //   commit('SET_NAME', name)
  //     //   commit('SET_ROLES', roles)
  //     //   commit('SET_AVATAR', avatar)
  //     //   resolve(data)
  //     // }).catch(error => {
  //     commit('SET_NAME', 'Super Admin')
  //     commit('SET_ROLES', ['admin'])
  //     commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
  //     resolve({
  //       roles: ['admin'],
  //       introduction: 'I am a super administrator',
  //       avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  //       name: 'Super Admin'
  //     })
  //     //   })
  //   })
  // },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

