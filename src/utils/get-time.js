export default function getTime(pageTitle) {
  var d = new Date()
  var vYear = d.getFullYear()
  var vMon = d.getMonth() + 1
  var vDay = d.getDate()
  var h = d.getHours()
  var m = d.getMinutes()
  var sdate = vYear + '-' + (vMon < 10 ? '0' + vMon : vMon) + '-' + (vDay < 10 ? '0' + vDay : vDay) + ' ' + (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m)
  return sdate
}
