const Router = require('@koa/router');
const home = require('./controllers/home')
const auth = require('./controllers/auth')

const router = new Router();
router.get('/', home.home)

router.get('/api/auth/login', auth.login)
router.get('/api/auth/loginStatus', auth.loginStatus)

module.exports = router