const Router = require('@koa/router');
const home = require('./controllers/home')
const auth = require('./controllers/auth')
const user = require('./controllers/user')
const listing = require('./controllers/listing')

const router = new Router();
router.get('/', home.home)

router.post('/api/auth/login', auth.login)
router.post('/api/auth/signup', auth.signup)
router.post('/api/auth/logout', auth.logout)
router.get('/api/auth/loginStatus', auth.loginStatus)

router.get('/api/user/userInfo', user.userInfo)
router.post('/api/user/userUpdateInfo', user.userUpdateInfo)
router.post('/api/user/changePassword', user.changePassword)

router.get('/api/listings/', listing.getListings)

module.exports = router