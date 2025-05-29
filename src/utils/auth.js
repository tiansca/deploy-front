import Cookies from 'js-cookie'
import store from '@/store'
import { getCookie, setCookie } from '@/utils/index'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey) || getCookie('islogin')
}

export function setToken(token) {
  localStorage.setItem(TokenKey, token)
  store.commit('user/SET_TOKEN', token)
}

export function removeToken() {
  setCookie('islogin', '')
  return Cookies.remove(TokenKey)
}
