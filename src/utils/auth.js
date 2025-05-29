import Cookies from 'js-cookie'
import store from '@/store'
import { setCookie } from '@/utils/index'

const TokenKey = 'token'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  localStorage.setItem(TokenKey, token)
  setCookie('islogin', token)
  store.commit('user/SET_TOKEN', token)
}

export function removeToken() {
  setCookie('islogin', '')
  localStorage.removeItem(TokenKey)
  return Cookies.remove(TokenKey)
}
