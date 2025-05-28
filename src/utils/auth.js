import Cookies from 'js-cookie'
import store from '@/store'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // localStorage.setItem(TokenKey, token)
  store.commit('user/SET_TOKEN', token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
