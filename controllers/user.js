let matchRules = require('../utils/match')
let sha256 = require('../utils/sha256')

const userController = {
    async userInfo(ctx) {
        let user = await ctx.service.getLoggedInUser()
        if (!user) return

        return ctx.success(userController._formatUserJSON(user))
    },

    async userUpdateInfo(ctx) {
        let { request, service } = ctx

        let user = await ctx.service.getLoggedInUser()
        if (!user) return

        if (
            !request.body.hasOwnProperty('email') &&
            !request.body.hasOwnProperty('firstname') &&
            !request.body.hasOwnProperty('lastname') &&
            (request.body.hasOwnProperty('email') && !matchRules.matchEmail(request.body.email))
        ) {
            return ctx.error('Please enter your email, password, firstname and lastname', 400)
        }

        let updateForm = {};

        ['email', 'firstname', 'lastname'].forEach((key) => {
            if (request.body.hasOwnProperty(key)) updateForm[key] = request.body[key]
        })

        if (updateForm.email) {
            let checkEmailUsed = await service.db.collection('users').countDocuments({
                email: updateForm.email,
                _id: { "$ne": user._id }
            })
            if (checkEmailUsed > 0)
                return ctx.error('Email has been used', 400)
        }

        let result = await service.db.collection('users').updateOne({
            _id: user._id,
        }, {
            $set: updateForm
        })

        user = await ctx.service.getLoggedInUser()

        return ctx.success(userController._formatUserJSON(user))
    },

    async changePassword(ctx) {
        let user = await ctx.service.getLoggedInUser()
        if (!user) return

        const { service, request } = ctx

        if (!request.body.hasOwnProperty('password') ||
            !request.body.hasOwnProperty('confirmPassword')) {
            return ctx.error('Please enter a password')
        }

        if (request.body.password !== request.body.confirmPassword) {
            return ctx.error('Password does not match', 400)
        }

        // generate salted password
        let salt = sha256.randomString(8)
        let saltedPass = sha256.sha256(salt + request.body.password)
        let storedPass = salt + ':' + saltedPass

        let result = await service.db.collection('users').updateOne({
            _id: user._id,
        }, {
            $set: {
                password: storedPass
            }
        })

        if (result.modifiedCount > 0) {
            return ctx.success('Your Password has been successfully updated')
        } else {
            return ctx.error('Failed to update your password', 500)
        }
    },

    _formatUserJSON(user) {
        return Object.assign(user, {_id: undefined, password: undefined})
    },

    async getPurchaseHistory(ctx) {
        const { service } = ctx

        let user = await service.getLoggedInUser()
        if (!user) return

        let records = await service.db.collection('sell_record').find({
            buyer_id: user.id
        }).sort({purchase_time: -1}).toArray()

        return ctx.success(records)
    },

    async getSellingRecord(ctx) {
        const { service } = ctx

        let user = await service.getLoggedInUser()
        if (!user) return

        let records = await service.db.collection('sell_record').find({
            seller_id: user.id
        }).sort({purchase_time: -1}).toArray()

        return ctx.success(records)
    }
}

module.exports = userController