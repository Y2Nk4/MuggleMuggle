const path = require('path')

module.exports = {
    normalizePath(str) {
        return path.normalize(str).replace(/^(\.\.(\/|\\|$))+/, '')
    }
}