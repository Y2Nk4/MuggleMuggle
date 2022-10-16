module.exports = {
    async assignID(db, table) {
        let idCounter = await db.collection('id_manage').findOneAndUpdate({
            table
        }, {
            $inc: { id: 1 }
        }, { upsert: true })

        return idCounter.value.id + 1
    }
}