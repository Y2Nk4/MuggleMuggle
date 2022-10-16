const Router = require('@koa/router');
const home = require('./controllers/home')
const auth = require('./controllers/auth')

const router = new Router();
router.get('/', home.home)

router.post('/api/auth/login', auth.login)
router.post('/api/auth/signup', auth.signup)
router.get('/api/auth/loginStatus', auth.loginStatus)

module.exports = router