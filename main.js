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
const dayjs = require('dayjs')


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

    app.auctionInterval = setInterval(async () => {
        let auctions = await db.collection('auction').find({
            ended: false
        }).toArray()
        let current = dayjs()
        let endedAuctions = []
        for(let auction of auctions) {
            const endTime = dayjs(auction.end_time)
            if (!endTime.isValid() || endTime.isBefore(current)) {
                endedAuctions.push(auction._id)
            }
        }
        if (endedAuctions.length > 0) {
            const result = await db.collection('auction').update({
                _id: {
                    $in: endedAuctions
                }
            }, {
                '$set': {
                    ended: true
                }
            })
            console.log('Auction Control, updated', endedAuctions)
            console.log(auctions.length - endedAuctions.length, 'auction ongoing')
        }
    }, 1000)

    app.listen(config.port, () => {
        console.log('Listening to', config.port)
    })
})()