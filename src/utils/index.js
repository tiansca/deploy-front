/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

// 获取当前时间
export function gettime() {
  var d = new Date()
  var vYear = d.getFullYear()
  var vMon = d.getMonth() + 1
  var vDay = d.getDate()
  var h = d.getHours()
  var m = d.getMinutes()
  var sdate = vYear + (vMon < 10 ? '0' + vMon : vMon) + (vDay < 10 ? '0' + vDay : vDay) + (h < 10 ? '0' + h : h) + (m < 10 ? '0' + m : m)
  return sdate
}

// 设置token
export function setCookie(
  name,
  value,
  exp = Date.now() + 7 * 24 * 60 * 60 * 1000, // 默认7天后过期
  path = '/',
  domain = '',
  secure = false,
  sameSite = 'Lax'
) {
  if (!name) {
    return
  }
  const encodedValue = encodeURIComponent(value)
  let cookieStr = `${name}=${encodedValue}`

  // 处理过期时间
  if (exp) {
    const date = new Date()
    date.setTime(exp)
    cookieStr += `; expires=${date.toUTCString()}`
  }

  // 附加其他属性
  cookieStr += `; path=${path}`
  if (domain) cookieStr += `; domain=${domain}`
  if (secure) cookieStr += '; Secure'
  cookieStr += `; SameSite=${sameSite}`
  document.cookie = cookieStr
}

// 获取cookie
export function getCookie(name) {
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=')
    if (key === name) return decodeURIComponent(value)
  }
  return null
}
