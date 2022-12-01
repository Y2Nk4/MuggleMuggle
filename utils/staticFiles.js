let pathTools = require('./pathTools')
const path = require("path")
const fs = require('fs')
const mimeTypes = require('mime-types')

module.exports = (root) => {
    return async (ctx, next) => {
        await next()
        if (ctx.method === 'GET' && !ctx.body && ctx.status === 404) {
            ctx.url = ctx.url.split(/[?#]/)[0]
            if(ctx.url === '/') ctx.url = '/home.html'

            let filePath = path.join(root, pathTools.normalizePath(ctx.url))

            if(fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()) {
                ctx.type = mimeTypes.contentType(path.extname(filePath))
                ctx.body = fs.createReadStream(filePath)
            }
        }
    }
}