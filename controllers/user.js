module.exports = {
    async userInfo(ctx) {
        let { session, service } = ctx

        if (!session.userLogged)
            return ctx.error('You have not logged in yet', 403)

        let user = await service.db.collection('users').findOne({
            id: session.userId
        })

        return ctx.success(Object.assign(user, {_id: undefined, password: undefined}))
    }
}