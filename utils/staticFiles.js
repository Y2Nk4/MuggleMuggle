let pathTools = require('./pathTools')
const path = require("path");

module.exports = (root) => {
    return async (ctx, next) => {
        await next()

        console.log('here', ctx.body, ctx.statusCode)
        console.log(ctx)
        if (ctx.method === 'GET' && !ctx.body && ctx.status === 404) {
            console.log(ctx.url)
            let path = path.join(root, utils.normalizePath(request.rawUrl))
        }
    }
}