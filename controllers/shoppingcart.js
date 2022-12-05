const userController = require('./user')
const {ObjectId} = require("mongodb");

const shoppingCart = {
    async getCart(ctx) {
        let { session, service } = ctx

        if (!session.userLogged) {
            return ctx.error('You have not logged in yet', 403)
        }

        const userId = session.userId

        let cartItems = await service.db.collection('cart').find({
            user_id: userId
        }).toArray()

        let itemIds = [...new Set(cartItems.map((item) => item.item_id))].map((id) => {
            try {
                return ObjectId(id)
            }catch (e) {
                return null
            }
        }).filter(id => !!id)


        let items = await service.db.collection('listings').find({
            _id: {
                '$in': itemIds
            }
        }).toArray()
        let itemMap = {}
        for(let item of items) {
            itemMap[item._id] = item
        }
        console.log(itemMap)

        cartItems = cartItems.map((cartItem) => {
            return Object.assign(cartItem, {
                item: itemMap[cartItem.item_id]
            })
        })

        return ctx.success(cartItems)
    },
// cart struct in db
    // userid
    // list of items with items id
    // list of item's capacity
    // list of item's price in single item
    async addItem(ctx) {
        let { session, service, request } = ctx

        if (
            !request.body.hasOwnProperty('item_id') ||
            !request.body.hasOwnProperty('amount') ||
            isNaN(Number(request.body.amount))
        ) {
            return ctx.error('Missing Parameters', 403)
        }
        // check user session
        if (!session.userLogged) {
            return ctx.error('You have not logged in yet', 403)
        }
        const userId = session.userId

        // check item
        let itemId;
        try {
            itemId = ObjectId(ctx.request.body.item_id)
        } catch (e) {
            return ctx.error('Missing Parameters', 400)
        }
        let item = await service.db.collection('listings').findOne({
            _id: itemId
        })
        if (!item) {
            return ctx.error('Item not exists.', 403)
        }

        let cartItem = await service.db.collection('cart').findOne({
            item_id: itemId,
            user_id: userId
        })
        let amount = 0
        if (cartItem) {
            amount = Math.min(Number(request.body.amount) + cartItem.amount, item.amount)
            let cartItemPrice = Math.ceil(item.price * amount * 100) / 100
            await service.db.collection('cart').updateOne({
                _id: cartItem._id
            }, {
                $set: {
                    amount,
                    total_price: cartItemPrice
                }
            })
        } else {
            amount = Math.min(Number(request.body.amount), item.amount)
            let cartItemPrice = Math.ceil(item.price * amount * 100) / 100
            await service.db.collection('cart').insertOne({
                item_id: item._id,
                user_id: userId,
                total_price: cartItemPrice,
                amount
            })
        }

        return ctx.success(`Successfully Added ${request.body.amount} of ${item.name} to Your Cart`)
    },

    async removeFromCart(ctx) {
        let { session, service, request } = ctx

        if (
            !request.body.hasOwnProperty('cart_id')
        ) {
            return ctx.error('Missing Parameters', 403)
        }
        // check user session
        if (!session.userLogged) {
            return ctx.error('You have not logged in yet', 403)
        }
        const userId = session.userId

        // check item
        let cartId;
        try {
            cartId = ObjectId(ctx.request.body.cart_id)
        } catch (e) {
            return ctx.error('Missing Parameters', 400)
        }

        let result = await service.db.collection('cart').deleteOne({
            _id: cartId,
            user_id: userId
        })

        return ctx.success('Successfully Removed')
    },

    async editCart(ctx) {
        let { session, service, request } = ctx

        if (
            !request.body.hasOwnProperty('cart_id') ||
            !request.body.hasOwnProperty('amount') ||
            isNaN(Number(request.body.amount))
        ) {
            return ctx.error('Missing Parameters', 403)
        }
        // check user session
        if (!session.userLogged) {
            return ctx.error('You have not logged in yet', 403)
        }
        const userId = session.userId

        // check item
        let cartId;
        try {
            cartId = ObjectId(request.body.cart_id)
        } catch (e) {
            return ctx.error('Missing Parameters', 400)
        }

        let cartItem = await service.db.collection('cart').findOne({
            _id: cartId
        })

        let listingItem = await service.db.collection('listings').findOne({
            _id: cartItem.item_id
        })

        let amount = Math.min(listingItem.amount, Number(request.body.amount))
        let totalPrice = Math.ceil(amount * listingItem.price * 100) / 100
        let result = await service.db.collection('cart').updateOne({
            _id: cartId,
            user_id: userId
        }, {
            '$set': {
                amount,
                total_price: totalPrice
            }
        })

        return ctx.success('Successfully Edit')
    }
}


module.exports = shoppingCart