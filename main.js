const koa = require('koa')
const app = new koa()
const router = require('./router')
const mongoInit = require('./db')
const config = require('./config')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const responseHelper = require('./response')


;(async () => {
    const db = mongoInit(config.db)
    console.log(process.env.DB)

    app.use(bodyParser())
        .use(session(config.session, app))
        .use(async function (ctx, next) {
            ctx.success = responseHelper.success.bind(ctx)
            ctx.error = responseHelper.error.bind(ctx)
            await next()
        })
        .use(async (ctx, next) => {
            ctx.service = { db }
            await next()
        })
        .use(router.routes())
        .listen(config.port)

    console.log('Listening to', config.port)
})()