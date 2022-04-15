// 讀取文件的工具方法
const fs = require('fs')
module.exports.getFileJsonData = (filePath) => {
    // 根據文件路徑去讀請文件內容
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (error, data) => {
            if (error) {
                // 讀取文件失敗
                reject(error)
            } else {
                // 讀取文件成功
                resolve(data)
            }
        })
    })
}