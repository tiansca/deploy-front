import { JSEncrypt } from 'jsencrypt'

export function encryptPassword(password) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(process.env.VUE_APP_PASSWORD_PUB_KEY)
  return encrypt.encrypt(`${password}`)
}
