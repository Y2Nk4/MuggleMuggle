const path = require('path')
const mime = require('mime-types')
const fs = require('fs')
const htmlEscape = require('../utils/escape')
const dayjs = require('dayjs')
const hash = require('../utils/sha256')
const {ObjectId} = require("mongodb");

const auctionConnections = {}
const auctionPrice = {}

module.exports = {
    async getAuctions(ctx) {
        const { service } = ctx

        let auctions = await service.db.collection('auction').find({
            ended: false
        }).sort({added_at: -1}).toArray()
        console.log(auctions)

        return ctx.success(auctions)
    },

    async getAuctionDetail(ctx) {
        const { service, request } = ctx

        if (!request.query || !request.query.id) {
            return ctx.error('Missing Parameters', 400)
        }

        let auction = await service.db.collection('auction').findOne({
            id: request.query.id
        })

        if (!auction) {
            return ctx.error('Auction Cannot be Found', 404)
        }

        let auctionHistory = await service.db.collection('auction_history').find({
            auction_id: request.query.id
        }).toArray()

        let result = Object.assign(auction, {
            auction_history: auctionHistory
        })
        return ctx.success(result)
    },

    async newAuction(ctx) {
        const { service, request } = ctx

        if (
            !request.body.hasOwnProperty('name') ||
            !request.body.hasOwnProperty('description') ||
            !request.body.hasOwnProperty('start_price') ||
            !request.files.hasOwnProperty('image') ||
            !request.body.hasOwnProperty('end_time')
        ) {
            return ctx.error('Missing Parameters', 400)
        }

        let user = await service.getLoggedInUser()
        if (!user) return

        const {filepath, name, mimetype, newFilename} = request.files.image
        let newPath = path.resolve('static/uploads', `${newFilename}.${mime.extension(mimetype)}`)
        let storePath = `uploads/${newFilename}.${mime.extension(mimetype)}`
        fs.copyFileSync(filepath, newPath)

        const endTime = dayjs(request.body.end_time)
        if (!endTime.isValid() || endTime.isBefore(dayjs().add(1, 'hour'))) {
            return ctx.error('Auction End time needs to be at least 1 hours after auction starts', 400)
        }

        const auctionId = hash.sha256(hash.randomString(20) + request.body.name + Date.now())

        const result = await service.db.collection('auction').insertOne({
            id: auctionId,
            user_id: user.id,
            name: htmlEscape(request.body.name),
            description: htmlEscape(request.body.description),
            start_price: Number(request.body.start_price),
            end_time: endTime.toISOString(),
            price: Number(request.body.start_price),
            amount: parseInt(request.body.amount),
            image: storePath,
            removable: true,
            ended: false,
            added_at: Date.now()
        })

        if (result.acknowledged) {
            auctionConnections[auctionId] = []
            auctionPrice[auctionId] = Number(request.body.start_price)

            return ctx.success({
                auctionId,
                message: 'Auction successfully started'
            })
        } else {
            return ctx.error('Internal Error', 500)
        }
    },

    async wsJoinAuction(ctx) {
        const { request, service } = ctx

        let auctionId = request.query.id
        if (!auctionId) {
            ctx.websocket.send(JSON.stringify({
                type: 'error',
                message: 'Auction not Found'
            }))
            ctx.websocket.close()
            return
        }

        let user = await service.getLoggedInUser(false)

        if (!user) {
            ctx.websocket.send(JSON.stringify({
                type: 'error',
                message: 'Failed to Authenticate You'
            }))
            ctx.websocket.close()
            return
        }

        let auction = await service.db.collection('auction').findOne({
            id: auctionId
        })
        if (!auction) {
            ctx.websocket.send(JSON.stringify({
                type: 'error',
                message: 'Auction not Found'
            }))
            ctx.websocket.close()
            return
        }

        const sessionId = hash.sha256(hash.randomString(20) + user.id + Date.now())
        if(!auctionConnections[auction.id] || !Array.isArray(auctionConnections[auction.id])) {
            auctionConnections[auction.id] = []
        }
        auctionConnections[auction.id].push({
            sessionId,
            websocket: ctx.websocket
        })

        ctx.websocket.send(JSON.stringify({
            type: 'ready',
            sessionId: sessionId,
            message: 'Auction Ready'
        }))

        ctx.websocket.on('close', () => {
            auctionConnections[auction.id] = auctionConnections[auction.id].filter((conn) => conn.sessionId !== sessionId)
        })

        ctx.websocket.on('message', async (data) => {
            // do something with the message from client
            let message = null
            let error = null
            try {
                message = JSON.parse(data)
            } catch (e) {
                error = 'Failed to parse data'
            }
            if (message) {
                if (!message.hasOwnProperty('type') || !message.type) {
                    error = 'Failed to parse data'
                }
            }
            if (error) {
                ctx.websocket.send(JSON.stringify({
                    type: 'error',
                    message: error
                }))
                return
            }

            if (message) {
                switch (message.type){
                    case 'bid':
                        if (auction.ended) {
                            ctx.websocket.send(JSON.stringify({
                                type: 'error',
                                message: 'The Auction ended'
                            }))
                            return
                        }
                        let bidPrice = Math.ceil(Number(message.price) * 100) / 100
                        if (isNaN(bidPrice) || auctionPrice[auctionId] >= bidPrice) {
                            ctx.websocket.send(JSON.stringify({
                                type: 'error',
                                message: 'bid price is illegal'
                            }))
                            return
                        }

                        let result = await service.db.collection('auction').updateOne({
                            price: {
                                '$lt': bidPrice
                            },
                            id: auctionId
                        }, {
                            '$set': {
                                price: bidPrice,
                                last_bidder: user.id,
                                removable: false
                            }
                        })
                        console.log(result)

                        auctionPrice[auctionId] = bidPrice
                        let bidUser = `${user.firstname} ${user.lastname}`
                        if (result.acknowledged && result.modifiedCount >= 1) {
                            await service.db.collection('auction_history').insertOne({
                                bid_price: bidPrice,
                                username: bidUser,
                                auction_id: auctionId,
                                bid_at: Date.now()
                            })
                            ctx.websocket.send(JSON.stringify({
                                type: 'bid-success',
                                data: {
                                    bid_price: bidPrice,
                                },
                                message: 'Successfully placed the bid'
                            }))
                            for(let connection of auctionConnections[auctionId]) {
                                connection.websocket.send(JSON.stringify({
                                    type: 'update',
                                    data: {
                                        bid_price: bidPrice,
                                        new_winner: {
                                            name: bidUser,
                                            user_id: user.id
                                        },
                                        history_record: {
                                            bid_price: bidPrice,
                                            username: bidUser
                                        }
                                    }
                                }))
                            }
                        } else {
                            ctx.websocket.send(JSON.stringify({
                                type: 'error',
                                message: 'Failed to place the bid, please retry'
                            }))
                        }

                        break;
                }
            }


        });
    }
}