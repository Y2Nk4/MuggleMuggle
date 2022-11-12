const userController = require('./user')

const shoppingcart = {
    async getinfo(ctx) {
        let { session, service } = ctx

        if (!session.userLogged) {
            ctx.error('You have not logged in yet', 403)
            return null
        }

        const userId = session.userId

        let cart = await service.db.collection('cart').find({
            user_id: userId
        })

        if(!cart) {
            return []
        }

        return cart
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