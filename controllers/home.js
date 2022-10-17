let fs = require('fs')

module.exports = {
    async home(ctx) {
        console.log(ctx.service)
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./FrontEnd/HomePage.html');
    }
}