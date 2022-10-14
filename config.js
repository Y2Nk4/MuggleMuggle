module.exports = {
    host: '0.0.0.0',
    port: 8080,

    db: {
        url: process.env.DB ? `mongodb://${process.env.DB}` : 'mongodb://localhost',
        db: 'cse312-project'
    }
}