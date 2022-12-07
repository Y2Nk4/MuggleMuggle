module.exports = function (ctx) {
    return async function (sendError = true) {
        let { session, service } = ctx

        console.log(session)
        if (sendError && !session.userLogged) {
            ctx.error('You have not logged in yet', 403)
            return null
        }

        return service.db.collection('users').findOne({
            id: session.userId
        })
    }
}