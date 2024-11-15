const History = require("../models/History");

class HistoryService {
    static async createHistoryEntry(message) {
        return await History.create({
            shop_id: message.data.shopId,
            plu: message.data.plu,
            action: message.action
        })
    }

    static async getHystoryByFilters(filter, limit, offset) {
        return await History.findAll({
            where: filter,
            limit, offset
        })
    }
}

module.exports = HistoryService