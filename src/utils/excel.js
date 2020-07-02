const FileSaver = require('file-saver')
const XLSX = require('xlsx')

const excel = (el, name) => {
  const wb = XLSX.utils.table_to_book(document.querySelector(el), { raw: true })
  /* get binary string as output */
  const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
  try {
    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), name + '.xlsx')
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout)
  }
  return wbout
}
export default excel
