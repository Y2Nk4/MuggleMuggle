const express = require('express')
const app = express()
const port = 3000
const router = require('./router')
const mongoInit = require('./db')
const config = require('./config')

// 使用 async
;(async () => {
    let db = mongoInit(config)
    router(app)

    app.use(function (req, res, next) {
        res.db = db
        next()
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
})()