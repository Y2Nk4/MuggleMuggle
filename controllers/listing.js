let htmlEscape = require('../utils/escape')
let mime = require('mime-types')
let path = require('path')
let fs = require('fs')
const { ObjectId } = require('mongodb')

module.exports = {
    async getListings(ctx) {
        const { service } = ctx

        let listings = await service.db.collection('listings').find({
            amount: { '$gt': 0 }
        }).sort({added_at: -1}).toArray()
        console.log(listings)

        return ctx.success(listings)
    },
    async getListingDetail(ctx) {
        const { service, request } = ctx

        if (!request.query || !request.query.id) {
            return ctx.error('Missing Parameters', 400)
        }
        let itemId;
        try {
            itemId = ObjectId(request.query.id)
        } catch (e) {
            return ctx.error('Missing Parameters', 400)
        }

        let listing = await service.db.collection('listings').findOne({
            _id: itemId
        })

        if (!listing) {
            return ctx.error('Item Cannot Find', 404)
        }


        return ctx.success(listing)
    },

    async addListing(ctx) {
        const { service, request } = ctx

        if (
            !request.body.hasOwnProperty('name') ||
            !request.body.hasOwnProperty('description') ||
            !request.body.hasOwnProperty('price') ||
            !request.files.hasOwnProperty('image') ||
            !request.body.hasOwnProperty('amount') ||
            isNaN(Number(request.body.amount)) ||
            isNaN(Number(request.body.price))
        ) {
            return ctx.error('Missing Parameters', 400)
        }
        let amount = Math.floor(Number(request.body.amount))
        if (amount <= 0) {
            return ctx.error('Amount cannot less than 1', 400)
        }
        const price = Math.ceil(Number(request.body.price) * 100) / 100
        if (price <= 0) {
            return ctx.error('Price cannot less than or equal to 0', 400)
        }

        let user = await service.getLoggedInUser()
        if (!user) return

        const {filepath, name, mimetype, newFilename} = request.files.image
        let newPath = path.resolve('static/uploads', `${newFilename}.${mime.extension(mimetype)}`)
        let storePath = `uploads/${newFilename}.${mime.extension(mimetype)}`
        fs.copyFileSync(filepath, newPath)

        const result = await service.db.collection('listings').insertOne({
            user_id: user.id,
            name: htmlEscape(request.body.name),
            description: htmlEscape(request.body.description),
            price,
            amount: amount,
            image: storePath,
            added_at: Date.now()
        })

        if (result.acknowledged) {
            return ctx.success({
                listingId: result.insertedId,
                message: 'Item has beenSuccessfully Added'
            })
        } else {
            return ctx.error('Internal Error', 500)
        }
    },

    async editListing(ctx) {
        const { service } = ctx

        if (
            !request.body.hasOwnProperty('listingId')
        ) {
            return ctx.error('Missing Parameters', 400)
        }

        let user = await service.getLoggedInUser()
        if (!user) return

        const listing = await service.db.collection('listings').findOne({
            user_id: user.id,
            _id: request.body.listingId
        })

        if (!listing) {
            return ctx.error('Listing does not exist')
        }

        let result = await service.db.collection('users').updateOne({
            _id: listing._id,
            user_id: user.id
        }, {
            $set: {
                title: request.body.hasOwnProperty('title') ? request.body.title : undefined,
                description: request.body.hasOwnProperty('description') ? request.body.description : undefined,
                price: request.body.hasOwnProperty('price') ? request.body.price : undefined,
                amount: request.body.hasOwnProperty('amount') ? request.body.amount : undefined,
            }
        })

        console.log(result)

        return ctx.success()
    },

    async deleteListing(ctx) {
        const { service } = ctx

        if (
            !request.body.hasOwnProperty('listingId')
        ) {
            return ctx.error('Missing Parameters', 400)
        }

        let user = await service.getLoggedInUser()
        if (!user) return

        const listing = await service.db.collection('listings').findOne({
            user_id: user.id,
            _id: request.body.listingId
        })

        if (!listing) {
            return ctx.error('Listing does not exist')
        }

        let result = await service.db.collection('users').deleteOne({
            _id: listing._id,
            user_id: user.id
        })

        console.log(result)

        return ctx.success()
    }
}