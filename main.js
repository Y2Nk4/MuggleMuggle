const koa = require('koa')
const app = new koa()
const router = require('./router')
const mongoInit = require('./db')
const config = require('./config')


;(async () => {
    const db = mongoInit(config.db)

    app.use(async (ctx, next) => {
        ctx.service = { db }
        await next()
    })
        .use(router.routes())
        .listen(config.port)

    console.log('Listening to', config.port)
})()