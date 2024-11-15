const StockService = require('../services/StockService')

class StockController {
    static async createStock(req, res) {
        try {
            const { productId, shopId, plu, shelfQuantity, orderQuantity } = req.body
            if (!(productId && shopId && plu)) return res.status(400).json({
                error: 'productId, shopId и plu обязательны.'
            })
            const stock = await StockService.createStock(productId, shopId, plu, shelfQuantity, orderQuantity)

            return res.status(201).json(stock)
        } catch (err) {
            console.error(err.message)
            return res.status(400).json({ error: err.message })
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
            console.error(err.message)
            return res.status(400).json({ error: err.message })
        }
    }
    static async updateStockQuantity(req, res) {
        try {
            const { stockId, isIncrease } = req.body
            if (!(stockId && isIncrease !== undefined)) {
                return res.status(400).json({error: "В запросе обязательно должен быть stockId и isIncrease"})
            }
            const stock = await StockService.updateStockQuantity(stockId, isIncrease)
            return res.status(201).json(stock)
        } catch (err) {
            console.error(err.message)
            return res.status(400).json({ error: err.message })
        }
    }

    static async setStockQuantity(req, res) {
        try {
            const { stockId, quantity } = req.body
            if (!(stockId && quantity)) {
                return res.status(400).json({error: "В запросе обязательно должен быть stockId и quantity"})
            }
            const stock = await StockService.setStockQuantity(stockId, quantity)

            return res.status(201).json(stock)
        } catch (err) {
            console.error(err.message)
            return res.status(400).json({ error: err.message })
        }
    }
}

module.exports = StockController