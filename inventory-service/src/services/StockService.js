const Stock = require('../models/Stock')
const Queue = require('../RabbitMQService')
const sequelize = require("../config/database.config");
const Product = require("../models/Product");

class StockService {
    static async createStock(productId, shopId, plu, shelfQuantity = 0, orderQuantity = 0) {
        const t = await sequelize.transaction()
        try {
            const checkPlu = await Product.findOne({ where: {plu} , transaction: t})
            if (checkPlu) {
                throw new Error('Продукт с таким plu уже существует')
            }

            const stock = await Stock.create({
                productId,
                shopId,
                plu,
                shelfQuantity,
                orderQuantity,
                transaction: t
            })

            await Queue.sendMessage('stock_actions', {
                action: 'CREATE_STOCK',
                stockId: stock.id,
                data: stock,
                timestamp: new Date().toISOString()
            })

            await t.commit()

            return stock
        } catch (err) {
            await t.rollback()
            throw new Error(err)
        }
    }

    static async updateStockQuantity(stockId, isIncrease) {
        try {
            const stock = await Stock.findByPk(stockId)
            if (!stock) throw new Error('Остаток не найден в базе данных')

            if (isIncrease) {
                stock.shelfQuantity += 1
            } else {
                stock.shelfQuantity -= 1
            }
            if (stock.shelfQuantity < 0) throw new Error('Количество товаров не может быть отрицательным')
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
            throw new Error(err)
        }
    }

    static async setStockQuantity(stockId, quantity) {
        try {
            const [updatedRowsCount, [stock]] = await Stock.update(
                { shelfQuantity: quantity },
                {
                    where: { id: stockId },
                    returning: true
                }
            )

            if (updatedRowsCount === 0) {
                throw new Error('Запись не найдена')
            }

            return stock
        } catch (err) {
            throw new Error(err)
        }
    }

    static async getStockByFilter(filter) {
        try {
            return await Stock.findAll({ where: filter })
        } catch (err) {
            throw new Error(err.message)
        }
    }
}

module.exports = StockService