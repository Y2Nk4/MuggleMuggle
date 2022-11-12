const Router = require('@koa/router');
// Add to Loading.js (Function to load html and css)
const Loading = require('./controllers/Loading.js')
//
const auth = require('./controllers/auth')
const user = require('./controllers/user')
const shoppingcart = require('./controllers/shoppingcart')

const router = new Router();
// Change starting page of the website is the LandingPage
router.get('/', Loading.Landing)
router.get('/LandingPage.css', Loading.LandingCSS)
// Get LoginPage html and css
router.get('/Login', Loading.Login)
router.get('/LoginPage.css', Loading.LoginCSS)
router.get('/Login.js', Loading.LoginJS)
// Get RegisterPage html and css
router.get('/Register', Loading.Register)
router.get('/RegisterPage.css', Loading.RegisterCSS)
router.get('/Register.js', Loading.RegisterJS)
// Get HomePage html and css
router.get('/Home', Loading.Home)
router.get('/HomePage.css', Loading.HomeCSS)
router.get('/Home.js', Loading.HomeJS)
//
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