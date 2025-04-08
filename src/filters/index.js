/** 企业报告占位'-' */
const Seat = msg => {
  // console.log(typeof (msg), 'msg')
  if (msg === null || msg === undefined || msg === '' || msg === 'none' || msg === 'None') {
    return '-'
  } else {
    return msg
  }
}
/** 企业报告时间处理 */
const SliceDate = msg => {
  if (msg !== undefined && msg !== null) {
    return msg.slice(0, 10)
  }
}

/** 保留两位小数 */
const SaveTwo = msg => {
  if (msg !== undefined && msg !== null) {
    if (typeof (Number(msg)) === 'number') {
      return Number(msg).toFixed(2)
    } else if (msg) {
      return msg
    } else {
      return '-'
    }
  }
  return '-'
}
/** 千分位 默认保留两位小数**/
const NumDivide = (msg, digits = 2) => {
  console.log(msg, digits)
  if (typeof (Number(msg)) === 'number') {
    if (digits > 0) {
      return (Number(msg)).toFixed(digits).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    } else if (digits === 0) {
      return (parseInt(msg)).toLocaleString()
    } else {
      return msg
    }
  } else if (msg || msg === 0) {
    return msg
  } else {
    return '-'
  }
}

const timeFilter = (msg, digits = 2) => {
  // console.log(msg, digits)
  // eslint-disable-next-line eqeqeq
  if (!isNaN(parseInt(msg)) && msg != 0) {
    const timeObj = new Date(msg)
    const year = timeObj.getFullYear()
    let month = timeObj.getMonth() + 1
    let date = timeObj.getDate()
    let hour = timeObj.getHours()
    let minute = timeObj.getMinutes()
    let second = timeObj.getSeconds()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (date >= 1 && date <= 9) {
      date = '0' + date
    }
    if (hour >= 0 && hour <= 9) {
      hour = '0' + hour
    }
    if (minute >= 0 && minute <= 9) {
      minute = '0' + minute
    }
    if (second >= 0 && second <= 9) {
      second = '0' + second
    }
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
  } else if (msg || msg === 0) {
    return msg
  } else {
    return '-'
  }
}

export { Seat, SliceDate, SaveTwo, NumDivide, timeFilter }
