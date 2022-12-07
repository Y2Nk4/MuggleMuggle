const Router = require('@koa/router')
//
const auth = require('./controllers/auth')
const user = require('./controllers/user')
const auction = require('./controllers/auction')
const shoppingcart = require('./controllers/shoppingcart')
const listing = require('./controllers/listing')
const router = new Router();
const wsRouter = new Router();
//

router.post('/api/auth/login', auth.login)
router.post('/api/auth/signup', auth.signup)
router.post('/api/auth/logout', auth.logout)
router.get('/api/auth/loginStatus', auth.loginStatus)

router.get('/api/user/userInfo', user.userInfo)
router.get('/api/user/purchaseRecord', user.getPurchaseHistory)
router.get('/api/user/sellingRecord', user.getSellingRecord)

router.post('/api/user/userUpdateInfo', user.userUpdateInfo)
router.post('/api/user/changePassword', user.changePassword)

router.get('/api/shoppingCart', shoppingcart.getCart)
router.post('/api/shoppingCart/addItem', shoppingcart.addItem)
router.post('/api/shoppingCart/remove', shoppingcart.removeFromCart)
router.post('/api/shoppingCart/edit', shoppingcart.editCart)
router.post('/api/shoppingCart/checkout', shoppingcart.checkout)

router.get('/api/listings/', listing.getListings)
router.get('/api/listings/detail', listing.getListingDetail)
router.post('/api/listings/add', listing.addListing)
router.post('/api/listings/edit', listing.editListing)

router.get('/api/auctions/', auction.getAuctions)
router.get('/api/auctions/detail', auction.getAuctionDetail)
router.post('/api/auction/newAuction', auction.newAuction)

wsRouter.get('/api/ws/auction', auction.wsJoinAuction)

module.exports = { router, wsRouter }