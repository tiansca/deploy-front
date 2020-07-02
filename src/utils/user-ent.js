import { userEntApi } from '@/api/online.js'

// 获取处理人信息
export default function userEnt(theList, userArr) {
  userEntApi({
    user: userArr
  }).then(res => {
    theList.map((item) => {
      res.data.user.map((item1) => {
        if (item.user_id === item1.user_id) {
          item.hander_name = item1.name
        }
      })
    })
  })
  return theList
}
