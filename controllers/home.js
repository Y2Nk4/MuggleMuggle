module.exports = {
    async home(ctx) {
        console.log(ctx.service)
        return ctx.body = 'Hello, World'
    }
}