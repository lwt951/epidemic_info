// 設置響應頭的中間件
module.exports = async (ctx, next) => {
    const contentType = 'application/json; charset=UTF-8'
    ctx.set('Content-Type', contentType)
    // 允許跨域設置
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
    await next()
}