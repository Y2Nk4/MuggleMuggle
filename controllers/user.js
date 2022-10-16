let matchRules = require('../utils/match')

const userController = {
    async userInfo(ctx) {
        let user = await userController._getLoggedInUser(ctx)
        if (!user) return

        return ctx.success(userController._formatUserJSON(user))
    },

    async userUpdateInfo(ctx) {
        let { request, service } = ctx

        let user = await userController._getLoggedInUser(ctx)
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

        user = await userController._getLoggedInUser(ctx)

        return ctx.success(userController._formatUserJSON(user))
    },

    async _getLoggedInUser(ctx) {
        let { session, service } = ctx

        if (!session.userLogged) {
            ctx.error('You have not logged in yet', 403)
            return null
        }

        let user = await service.db.collection('users').findOne({
            id: session.userId
        })

        return user
    },

    _formatUserJSON(user) {
        return Object.assign(user, {_id: undefined, password: undefined})
    }
}

module.exports = userController