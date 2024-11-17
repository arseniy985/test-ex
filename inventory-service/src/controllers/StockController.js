const StockService = require('../services/StockService')

class StockController {
    static async createStock(req, res) {
        try {
            const { shopId, plu, shelfQuantity, orderQuantity } = req.body
            if (!(shopId && plu)) return res.status(400).json({
                error: 'shopId и plu обязательны.'
            })
            const stock = await StockService.createStock(shopId, plu, shelfQuantity, orderQuantity)

            return res.status(201).json(stock)
        } catch (err) {
            console.error(err.message)
            return res.status(400).json({ error: err.message })
        }
    }

    static async getStockByFilters(req, res) {
        try {
            const { shopId, plu, shelfQuantity, orderQuantity } = req.query

            let filter = {}
            if (shopId !== undefined && shopId.trim() !== '') {
                filter.shopId = shopId;
            }
            if (plu !== undefined && plu.trim() !== '') {
                filter.plu = plu;
            }
            if (shelfQuantity !== undefined && shelfQuantity.trim() !== '') {
                filter.shelfQuantity = parseInt(shelfQuantity);
            }
            if (orderQuantity !== undefined && orderQuantity.trim() !== '') {
                filter.orderQuantity = parseInt(orderQuantity);
            }

            const stocks = await StockService.getStockByFilter(filter)
            return res.status(200).json(stocks)
        } catch (err) {
            console.error(err.message)
            return res.status(400).json({ error: err.message })
        }
    }

    static async updateShelfStockQuantity(req, res) {
        try {
            const { plu, isIncrease } = req.body
            if (!(plu && isIncrease !== undefined)) {
                return res.status(400).json({error: "В запросе обязательно должен быть plu и isIncrease"})
            }
            const stock = await StockService.updateShelfStockQuantity(plu, isIncrease)
            return res.status(204).json(stock)
        } catch (err) {
            console.error(err.message)
            return res.status(400).json({ error: err.message })
        }
    }

    static async setShelfStockQuantity(req, res) {
        try {
            const { plu, quantity } = req.body
            if (!(plu && quantity)) {
                return res.status(400).json({error: "В запросе обязательно должен быть plu и quantity"})
            }
            const stock = await StockService.setShelfStockQuantity(plu, quantity)

            return res.status(204).json(stock)
        } catch (err) {
            console.error(err.message)
            return res.status(400).json({ error: err.message })
        }
    }

    static async updateOrderStockQuantity(req, res) {
        try {
            const { plu, isIncrease } = req.body
            if (!(plu && isIncrease !== undefined)) {
                return res.status(400).json({error: "В запросе обязательно должен быть stockId и isIncrease"})
            }
            const stock = await StockService.updateOrderStockQuantity(plu, isIncrease)
            return res.status(204).json(stock)
        } catch (err) {
            console.error(err.message)
            return res.status(400).json({ error: err.message })
        }
    }

    static async setOrderStockQuantity(req, res) {
        try {
            const { plu, quantity } = req.body
            if (!(plu && quantity)) {
                return res.status(400).json({error: "В запросе обязательно должен быть plu и quantity"})
            }
            const stock = await StockService.setOrderStockQuantity(plu, quantity)

            return res.status(204).json(stock)
        } catch (err) {
            console.error(err.message)
            return res.status(400).json({ error: err.message })
        }
    }
}

module.exports = StockController