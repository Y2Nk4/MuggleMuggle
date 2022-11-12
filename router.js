const Router = require('@koa/router');
const home = require('./controllers/home')
const auth = require('./controllers/auth')
const user = require('./controllers/user')
const shoppingcart = require('./controllers/shoppingcart')

const router = new Router();
router.get('/', home.home)

router.post('/api/auth/login', auth.login)
router.post('/api/auth/signup', auth.signup)
router.post('/api/auth/logout', auth.logout)
router.get('/api/auth/loginStatus', auth.loginStatus)

router.get('/api/user/userInfo', user.userInfo)
router.post('/api/user/userUpdateInfo', user.userUpdateInfo)
router.post('/api/user/changePassword', user.changePassword)

router.get('/api/shoppingcart/getinfo', shoppingcart.getinfo)
router.post('/api/shoppingcart/addItem', shoppingcart.addItem())

module.exports = router