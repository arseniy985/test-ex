const History = require('../models/History')
const HistoryService = require('../services/HistoryService')

class HistoryController {
    static async createHistoryEntry(message) {
        try {
            await HistoryService.createHistoryEntry(message)
        } catch (err) {
            console.error(err.message)
        }
    }

    static async getHistoryByFilters(req, res) {
        try {
            const {shopId, plu, date, action, page = 1, limit = 20} = req.query
            const offset = (page - 1) * limit

            let filter = {}
            if (shopId !== undefined && shopId !== '') filter.shopId = shopId
            if (plu !== undefined && plu !== '') filter.plu = plu
            if (date !== undefined && date !== '') filter.date = date
            if (action !== undefined && action !== '') filter.action = action

            const histories = await HistoryService.getHystoryByFilters(filter, limit, offset)

            res.status(201).json(histories)
        } catch (err) {
            console.error(err.message)
            res.status(400).json({ error: err.message })
        }
    }
}


module.exports = HistoryController