module.exports = function (ctx) {
    return async function () {
        let { session, service } = ctx

        if (!session.userLogged) {
            ctx.error('You have not logged in yet', 403)
            return null
        }

        return service.db.collection('users').findOne({
            id: session.userId
        })
    }
}