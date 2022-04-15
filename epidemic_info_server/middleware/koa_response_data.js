// 處理業務邏輯的中間件，讀取某個json文件的數據
const path = require('path')
const fileUtils = require('../utils/file_utils')
module.exports = async (ctx, next) => {
  const url = ctx.request.url
  const i = url.lastIndexOf('/')
  const keyword = url.split('').splice(i).join('')
  const filePath = path.join(__dirname, '../data' + keyword + '.json')
  try {
    const data = await fileUtils.getFileJsonData(filePath)
    ctx.response.body = data
  } catch {
      const errorMsg = {
          message: '讀取文件內容失敗，文件資源不存在',
          status: 404
      }
      ctx.response.body = JSON.stringify(errorMsg)
  }
  await next()
}