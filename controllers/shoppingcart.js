const userController = require('./user')

const shoppingcart = {
    async getinfo(ctx) {
        let { session, service } = ctx

        if (!session.userLogged) {
            return ctx.error('You have not logged in yet', 403)
        }

        const userId = session.userId

        let cart = await service.db.collection('cart').find({
            user_id: userId
        })

        if(!cart) {
            return ctx.success([])
        }

        return ctx.success(cart)
    },
// cart struct in db
    // userid
    // list of items with items id
    // list of item's capacity
    // list of item's price in single item
    async addItem(user) {

    }
}


module.exports = shoppingcart