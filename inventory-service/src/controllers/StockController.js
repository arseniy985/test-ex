const StockService = require('../services/StockService')

class StockController {
    static async createStock(req, res) {
        try {
            const { productId, shopId, plu, shelfQuantity, orderQuantity } = req.body
            if (!(productId && shopId)) return res.status(400).json({
                error: 'productId и shopId обязательны.'
            })
            const stock = await StockService.createStock(productId, shopId, plu, shelfQuantity, orderQuantity)

            return rs.status(201).json(stock)
        } catch (err) {
            console.error('Ошибка создания остатка')
            return res.status(500).json({ error: 'Не удалось создать остаток: ' + err.error() })
        }
    }

    static async getStockByFilters(req, res) {
        try {
            const { shopId, plu, shelfQuantity, orderQuantity } = req.query
            const stocks = await StockService.getStockByFilter({
                shopId, plu, shelfQuantity, orderQuantity
            })
            return res.status(201).json(stocks)
        } catch (err) {
            console.error('Ошибка получения остатков')
            return res.status(500).json({ error: 'Не удалось получить остатки: ' + err.error() })
        }
    }
}

module.exports = StockController