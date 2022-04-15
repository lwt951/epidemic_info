// 計算服務器消耗時長的中間件
module.exports = async (ctx, next) => {
    // 紀錄開始時間
    const start = Date.now()
    // 讓兩層中間件得到執行
    await next()
    // 紀錄結束時間
    const end = Date.now()
    // 設置響應頭 X-Reponse-Time
    const duration = end - start
    ctx.set('X-Response-Time', duration + 'ms')
}