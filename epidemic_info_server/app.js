// 服務器的入口文件
// 創建koa實例對象
const Koa = require('koa')
const socketIo = require('socket.io')
const app = new Koa()
const server = require('http').createServer(app.callback())

const io = socketIo(server, {
    cors: true
})
// 在線人數
let onlineCount = 0
// 離天室功能
io.on('connection', socket => {
    onlineCount++
    // 把id傳給客戶端
    socket.emit('connection', socket.id)
    // 把線上人數傳給客戶端
    io.emit('getOnlineCount', onlineCount)
    // 處理傳送訊息
    socket.on('sendMsg', msgObj => {
        io.emit('getMsg', msgObj)
    })
    // 處理離線
    socket.on('disconnect', () => {
        onlineCount--
        io.emit('getOnlineCount', onlineCount)
        console.log(`${socket.id} 已斷線`)
    })
})

// 綁定中間件
// 綁定第一層中間件
const respDurationMiddleware = require('./middleware/koa_response_duration')
app.use(respDurationMiddleware)
// 綁定第二層中間件
const respHeaderMiddleware = require('./middleware/koa_response_header')
app.use(respHeaderMiddleware)
// 綁定第三層中間件
const respDataMiddleware = require('./middleware/koa_response_data')
app.use(respDataMiddleware)
// 綁定端口號

server.listen(7777, ()=> {
    console.log('成功連結至端口號7777')
})