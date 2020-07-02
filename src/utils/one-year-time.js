// 获取现在时间，并接受过去时间的值
const getNowFormatDate = function(formatDate) {
  const date = new Date()
  const seperator1 = '-'
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  const nowData = year + seperator1 + month + seperator1 + strDate
  // this.rangeDate = [formatDate, nowData] // 默认赋值一年时间
  // this.beginTime = formatDate
  // this.endTime = nowData
  return nowData
}
// 获取过去时间，并传值给现在时间
export default function getPassYearFormatDate() {
  const nowDate = new Date()
  const date = new Date(nowDate)
  date.setDate(date.getDate() - 365)
  const seperator1 = '-'
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  const formatDate = year + seperator1 + month + seperator1 + strDate
  const beginTime = getNowFormatDate(formatDate)
  const rangeDate = [formatDate, beginTime]
  return rangeDate
}
