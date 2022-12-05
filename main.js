const koa = require('koa')
const { router, wsRouter } = require('./router')
const mongoInit = require('./db')
const config = require('./config')
const koaBody = require('koa-body')
const session = require('koa-session')
const responseHelper = require('./response')
const getLoggedInUserMiddleware = require('./utils/getLoggedInUser')
const staticFiles = require('./utils/staticFiles')
const koaWebsocket = require('koa-websocket')


;(async () => {
    const db = await mongoInit(config.db)
    console.log(config.db)
    console.log(process.env.DB)

    const app = koaWebsocket(new koa())
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

    app.ws
        .use(async (ctx, next) => {
            console.log('in')
            ctx.service = { db }
            ctx.service.getLoggedInUser = getLoggedInUserMiddleware(ctx)
            await next()
            console.log('out')
        })
        .use(wsRouter.routes())

    app.listen(config.port, () => {
        console.log('Listening to', config.port)
    })
})()