import { login, logout, getInfo, refreshTokenApi } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { setCookie } from '@/utils'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: require('../../assets/imgs/login/person.png'),
    roles: [],
    id: '',
    permissions: []
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
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
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
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
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
  async getInfo({ commit, dispatch }, cache) {
    try {
      if (cache) {
        const data = JSON.parse(sessionStorage.getItem('userInfo'))
        commit('SET_NAME', data.username)
        if (data.userid) {
          commit('SET_USER_ID', data.userid)
        }
        if (data.roleList && data.roleList.length > 0) {
          commit('SET_ROLES', data.roleList.map(item => {
            return item.name
          }))
        }
        return Promise.resolve(data)
      }
      const userInfo = await getInfo()
      console.log('userInfo', userInfo)
      const { data } = userInfo
      if (data.userid) {
        commit('SET_USER_ID', data.userid)
        commit('SET_NAME', data.username)
        if (data.roleList && data.roleList.length > 0) {
          commit('SET_ROLES', data.roleList.map(item => {
            return item.name
          }))
        }
        if (data.permissionList && data.permissionList.length > 0) {
          commit('SET_PERMISSIONS', data.permissionList.map(item => {
            return item.key
          }))
        }
      }
      if (data.exp - Date.now() < 1000 * 60 * 60 * 24 * 2.8) {
        dispatch('refreshToken')
      }
      sessionStorage.setItem('userInfo', JSON.stringify(data))
      setCookie('islogin', 'true', data.exp)
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
        location.reload()
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
  },
  refreshToken({ commit }) {
    return new Promise(async resolve => {
      const res = await refreshTokenApi()
      commit('SET_TOKEN', res.token)
      setCookie('islogin', 'true', res.exp)
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

