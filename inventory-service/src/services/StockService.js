const Stock = require('../models/Stock')
const Queue = require('../RabbitMQService')

class StockService {
    static async createStock(productId, shopId, plu, shelfQuantity = 0, orderQuantity = 0) {
        try {
            const stock = await Stock.create({
                productId,
                shopId,
                plu,
                shelfQuantity,
                orderQuantity
            })

            await Queue.sendMessage('stock_actions', {
                action: 'CREATE_STOCK',
                stockId: stock.id,
                data: stock,
                timestamp: new Date().toISOString()
            })
        } catch (err) {
            throw new Error(err.message())
        }
    }

    static async updateStockQuantity(stockId, isIncrease, quantity = null) {
        try {
            const stock = await Stock.findByPk(stockId)
            if (!stock) throw new Error('Остаток не найден в базе данных')

            if (quantity !== null) {
                stock.shelfQuantity = quantity
            } else {
                const oldQuantity = stock.shelfQuantity

                if (isIncrease) {
                    stock.shelfQuantity += 1
                } else {
                    stock.shelfQuantity -= 1
                }

                if (stock.shelfQuantity < 0) throw new Error('Количество товаров не может быть отрицательным')
            }
            await stock.save()

            await Queue.sendMessage('stock_actions', {
                action: isIncrease ?
                    'INCREASE_STOCK' : 'DECREASE_STOCK',
                stockId: stock.id,
                quantity: stock.shelfQuantity,
                timestamp: new Date().toISOString()
            })

            return stock
        } catch (err) {
            throw new Error(err.message())
        }
    }

    static async getStockByFilter(filter) {
        try {
            return await Stock.findAll({ where: filter })
        } catch (err) {
            throw new Error(err.message())
        }
    }
}

module.exports = StockService