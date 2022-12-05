const path = require('path')
const mime = require('mime-types')
const fs = require('fs')
const htmlEscape = require('../utils/escape')
const dayjs = require('dayjs')

module.exports = {
    async newAuction(ctx) {
        const { service, request } = ctx

        if (
            !request.body.hasOwnProperty('name') ||
            !request.body.hasOwnProperty('description') ||
            !request.body.hasOwnProperty('price') ||
            !request.files.hasOwnProperty('image') ||
            !request.body.hasOwnProperty('end_time')
        ) {
            return ctx.error('Missing Parameters', 400)
        }

        let user = await service.getLoggedInUser()
        if (!user) return

        const {filepath, name, mimetype, newFilename} = request.files.image
        let newPath = path.resolve('static/uploads', `${newFilename}.${mime.extension(mimetype)}`)
        let storePath = `uploads/${newFilename}.${mime.extension(mimetype)}`
        fs.copyFileSync(filepath, newPath)

        const endTime = dayjs(request.body.end_time)
        if (!endTime.isValid() || endTime.isBefore(dayjs().add(1, 'hour'))) {
            return ctx.error('Auction End time needs to be at least 1 hours after auction starts', 400)
        }

        const result = await service.db.collection('listings').insertOne({
            user_id: user.id,
            name: htmlEscape(request.body.name),
            description: htmlEscape(request.body.description),
            price: Number(request.body.price),
            amount: parseInt(request.body.amount),
            image: storePath,
            removable: true
        })

        if (result.acknowledged) {
            return ctx.success('Successfully Added')
        } else {
            return ctx.error('Internal Error', 500)
        }
    }
}