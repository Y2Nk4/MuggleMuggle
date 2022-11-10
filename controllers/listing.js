module.exports = {
    async getListings(ctx) {
        const { service } = ctx

        let listings = await service.db.collection('listings').find({})

        return ctx.success(listings)
    },

    async addListings(ctx) {
        const { service } = ctx

        if (
            !ctx.request.body.hasOwnProperty('title') ||
            !ctx.request.body.hasOwnProperty('description') ||
            !ctx.request.body.hasOwnProperty('price') ||
            !ctx.request.body.hasOwnProperty('price')
        ) {

        }

        let user = await service.getLoggedInUser()
        if (!user) return
    }
}