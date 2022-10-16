const crypto = require('crypto')

module.exports = {
    sha256(str) {
        return crypto.createHash('sha256').update(str).digest('hex')
    },
    randomString(bytes = 20) {
        return crypto.randomBytes(bytes).toString('hex')
    }
}