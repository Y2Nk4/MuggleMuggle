let fs = require('fs')

module.exports = {
    async Landing(ctx) {
        console.log(ctx.service)
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./FrontEnd/LandingPage.html');
    },
    async LandingCSS(ctx) {
        console.log(ctx.service)
        ctx.type = 'css';
        ctx.body = fs.createReadStream('./FrontEnd/LandingPage.css');
    },
    async Login(ctx) {
        console.log(ctx.service)
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./FrontEnd/LoginPage.html');
    },
    async LoginCSS(ctx) {
        console.log(ctx.service)
        ctx.type = 'css';
        ctx.body = fs.createReadStream('./FrontEnd/LoginPage.css');
    },
    async LoginJS(ctx) {
        console.log(ctx.service)
        ctx.type = 'javascript';
        ctx.body = fs.createReadStream('./FrontEndScript/Login.js');
    },
    async Register(ctx) {
        console.log(ctx.service)
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./FrontEnd/RegisterPage.html');
    },
    async RegisterCSS(ctx) {
        console.log(ctx.service)
        ctx.type = 'css';
        ctx.body = fs.createReadStream('./FrontEnd/RegisterPage.css');
    },
    async RegisterJS(ctx){
        console.log(ctx.service)
        ctx.type = 'javascript';
        ctx.body = fs.createReadStream('./FrontEndScript/Register.js');
    },
    async Home(ctx) {
        console.log(ctx.service)
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./FrontEnd/HomePage.html');
    },
    async HomeCSS(ctx) {
        console.log(ctx.service)
        ctx.type = 'css';
        ctx.body = fs.createReadStream('./FrontEnd/HomePage.css');
    },
    async HomeJS(ctx) {
        console.log(ctx.service)
        ctx.type = 'javascript';
        ctx.body = fs.createReadStream('./FrontEndScript/Home.ks');
    }
}