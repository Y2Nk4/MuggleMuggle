let sha256 = require('../utils/sha256')
let idManage = require('../utils/idManage')
const matchRules = require('../utils/match')

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
        //salt:hash
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

        console.log(ctx.request.body)
        if (!request.body.hasOwnProperty('email') ||
            !request.body.hasOwnProperty('password') ||
            !request.body.hasOwnProperty('confirmPassword') ||
            !request.body.hasOwnProperty('firstname') ||
            !request.body.hasOwnProperty('lastname') ||
            !matchRules.matchEmail(request.body.email)
        ) {
            return ctx.error('Please enter your email, password, firstname and lastname', 400)
        }

        if (request.body.confirmPassword !== request.body.password){
            return ctx.error('Password does not match', 400)
        }

        let user = await service.db.collection('users').findOne({
            email: request.body.email
        })

        if (user) return ctx.error('Email has been used', 400)
        user = null // release user

        // generate salted password
        let salt = sha256.randomString(8)
        let saltedPass = sha256.sha256(salt + request.body.password)
        let storedPass = salt + ':' + saltedPass

        let userId = await idManage.assignID(service.db ,'users')
        console.log(userId)
        let result = await service.db.collection('users').insertOne({
            id: userId,
            email: request.body.email,
            password: storedPass,
            firstname: request.body.firstname,
            lastname: request.body.lastname,
        })

        console.log(result)

        ctx.session.userLogged = true
        ctx.session.loggedInTime = Date.now()
        ctx.session.userId = userId

        return ctx.success('Sign up Successfully')
    },

    async logout(ctx) {
        ctx.session.userLogged = false
        ctx.session.loggedInTime = null
        ctx.session.userId = null

        return ctx.success('Logout Successfully')
    }
}