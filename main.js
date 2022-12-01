const koa = require('koa')
const router = require('./router')
const mongoInit = require('./db')
const config = require('./config')
const koaBody = require('koa-body')
const session = require('koa-session')
const responseHelper = require('./response')
const getLoggedInUserMiddleware = require('./utils/getLoggedInUser')
const staticFiles = require('./utils/staticFiles')


;(async () => {
    const db = await mongoInit(config.db)
    console.log(config.db)
    console.log(process.env.DB)

    const app = new koa()
    app.keys = config.keys

    app.use(koaBody({ multipart: true }))
        .use(session(config.session, app))
        .use(async function (ctx, next) {
            ctx.success = responseHelper.success.bind(ctx)
            ctx.error = responseHelper.error.bind(ctx)
            await next()
        })
        .use(async (ctx, next) => {
            ctx.service = { db }
            ctx.service.getLoggedInUser = getLoggedInUserMiddleware(ctx)
            await next()
        })
        .use(router.routes())
        .use(staticFiles(__dirname + '/static'))
        .listen(config.port, () => {
            console.log('Listening to', config.port)
        })


})()