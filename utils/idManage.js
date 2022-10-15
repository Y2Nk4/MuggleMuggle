module.exports = {
    async assignID(db, table) {
        let idCounter = await db.document('id_manage').findAndModify({
            query: { table },
            update: { $inc:{ id :1} },
            new:true
        })

        return idCounter.id
    }
}