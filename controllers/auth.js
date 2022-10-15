let sha256 = require('../utils/sha256')
let idManage = require('../utils/idManage')

module.exports = {
    async login(ctx) {
        const { service, request } = ctx

        if (ctx.session.userLogged) return ctx.error('User has been logged in', 400)

        if (!request.body.hasOwnProperty('email') || !request.body.hasOwnProperty('password')) {
            return ctx.error('Please enter your email and password', 400)
        }

        let user = await service.db.collection('users').findOne({
            email: request.body.email
        })

        if (!user) return ctx.error('Email and password does not match', 400)

        // check password
        let saltAndPass = user.password.split(':')

        if (!sha256.sha256(saltAndPass[0] + request.body.password) === saltAndPass[1]) {
            return ctx.error('Email and password does not match', 400)
        }

        ctx.session.userLogged = true
        ctx.session.loggedInTime = Date.now()
        ctx.session.userId = user.id

        return ctx.success('Login Successfully')
    },

    async loginStatus(ctx) {
        if (ctx.session.userLogged) {
            ctx.success()
        } else {
            ctx.error('User is not logged in', 200)
        }
    },

    async signup(ctx) {
        const { service, request } = ctx

        if (ctx.session.userLogged) return ctx.error('User has been logged in', 400)

        if (!request.body.hasOwnProperty('email') ||
            !request.body.hasOwnProperty('password') ||
            !request.body.hasOwnProperty('firstname') ||
            !request.body.hasOwnProperty('lastname') ||
            !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(request.body.email)
        ) {
            return ctx.error('Please enter your email, password, firstname and lastname', 400)
        }

        let user = await service.db.collection('users').findOne({
            email: request.body.email
        })

        if (user) return ctx.error('Email has been used', 400)
        user = null // release user

        // check password
        let salt = sha256.randomString(8)
        let saltedPass = sha256.sha256(salt + request.body.password)
        let storedPass = salt + ':' + saltedPass

        let userId = await idManage.assignID(service.db ,'users')
        console.log(userId)
        let result = await service.db.insertOne({

        })

        ctx.session.userLogged = true
        ctx.session.loggedInTime = Date.now()
        ctx.session.userId = user.id

        return ctx.success('Sign up Successfully')
    },
}