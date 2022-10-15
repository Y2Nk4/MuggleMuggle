module.exports = {
    success(data = null, statusCode = 200) {
        this.status = statusCode
        this.body = {
            success: true,
            data: (data !== null) ? data : undefined,
        }
    },
    error(message, statusCode = 200, returnCode = 0) {
        this.status = statusCode
        this.body = {
            success: false,
            error: message,
            code: returnCode || statusCode,
        }
    }
}