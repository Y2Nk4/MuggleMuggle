let htmlEscape = require('../utils/escape')
const { ObjectId } = require('mongodb')

module.exports = {
    async getListings(ctx) {
        const { service } = ctx

        let listings = await service.db.collection('listings').find({}).toArray()
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
            itemId = ObjectId(ctx.request.query.id)
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
        const { service } = ctx

        if (
            !ctx.request.body.hasOwnProperty('name') ||
            !ctx.request.body.hasOwnProperty('description') ||
            !ctx.request.body.hasOwnProperty('price') ||
            !ctx.request.body.hasOwnProperty('amount')
        ) {
            return ctx.error('Missing Parameters', 400)
        }

        let user = await service.getLoggedInUser()
        if (!user) return

        const result = await service.db.collection('listings').insertOne({
            user_id: user.id,
            name: htmlEscape(ctx.request.body.name),
            description: htmlEscape(ctx.request.body.description),
            price: Number(ctx.request.body.price),
            amount: parseInt(ctx.request.body.amount),
        })

        console.log(result)

        return ctx.success('Successfully Added')
    },

    async editListing(ctx) {
        const { service } = ctx

        if (
            !ctx.request.body.hasOwnProperty('listingId')
        ) {
            return ctx.error('Missing Parameters', 400)
        }

        let user = await service.getLoggedInUser()
        if (!user) return

        const listing = await service.db.collection('listings').findOne({
            user_id: user.id,
            _id: ctx.request.body.listingId
        })

        if (!listing) {
            return ctx.error('Listing does not exist')
        }

        let result = await service.db.collection('users').updateOne({
            _id: listing._id,
            user_id: user.id
        }, {
            $set: {
                title: ctx.request.body.hasOwnProperty('title') ? ctx.request.body.title : undefined,
                description: ctx.request.body.hasOwnProperty('description') ? ctx.request.body.description : undefined,
                price: ctx.request.body.hasOwnProperty('price') ? ctx.request.body.price : undefined,
                amount: ctx.request.body.hasOwnProperty('amount') ? ctx.request.body.amount : undefined,
            }
        })

        console.log(result)

        return ctx.success()
    },

    async deleteListing(ctx) {
        const { service } = ctx

        if (
            !ctx.request.body.hasOwnProperty('listingId')
        ) {
            return ctx.error('Missing Parameters', 400)
        }

        let user = await service.getLoggedInUser()
        if (!user) return

        const listing = await service.db.collection('listings').findOne({
            user_id: user.id,
            _id: ctx.request.body.listingId
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