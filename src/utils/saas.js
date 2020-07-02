// 字段清洗，去除首尾的空白和￥字符
export function fclean(v) {
  return v.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace('￥', '').replace('$', '')
}

// 字段清洗，如果有数值，乘以10000
export function fwan(v) {
  if (v !== '') {
    return (v * 10000).toString()
  } else {
    return v
  }
}
