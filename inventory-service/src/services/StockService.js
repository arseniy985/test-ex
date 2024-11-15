const Stock = require('../models/Stock')
const Queue = require('../RabbitMQService')
const sequelize = require("../config/database.config");
const {where} = require("sequelize");

class StockService {
    static async createStock(shopId, plu, shelfQuantity = 0, orderQuantity = 0) {
        const t = await sequelize.transaction()
        try {
            const checkPlu = await Stock.findOne({ where: {plu} , transaction: t})
            if (checkPlu) {
                throw new Error('Остаток с таким plu уже существует')
            }

            const stock = await Stock.create({
                shopId,
                plu,
                shelfQuantity,
                orderQuantity,
                transaction: t
            })

            await Queue.sendMessage('product_actions', {
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

    static async updateOrderStockQuantity(plu, isIncrease) {
        try {
            const stock = await Stock.findOne({ where: {plu} })
            if (!stock) throw new Error('Остаток не найден в базе данных')

            if (isIncrease) {
                stock.orderQuantity += 1
            } else {
                stock.orderQuantity -= 1
            }
            if (stock.orderQuantity < 0) throw new Error('Количество товаров не может быть отрицательным')
            await stock.save()

            await Queue.sendMessage('product_actions', {
                action: isIncrease ?
                    'INCREASE_ORDER_STOCK' : 'DECREASE_ORDER_STOCK',
                stockId: stock.id,
                data: stock,
                timestamp: new Date().toISOString()
            })

            return stock
        } catch (err) {
            throw new Error(err)
        }
    }

    static async setOrderStockQuantity(plu, quantity) {
        try {
            const [updatedRowsCount, stock] = await Stock.update(
                { orderQuantity: quantity },
                {
                    where: { plu: plu },
                    returning: true
                }
            )

            if (updatedRowsCount === 0) {
                throw new Error('Запись не найдена')
            }

            await Queue.sendMessage('product_actions', {
                action: 'SET_ORDER_STOCK',
                stockId: stock.id,
                data: stock[0],
                timestamp: new Date().toISOString()
            })

            return stock[0]
        } catch (err) {
            throw new Error(err)
        }
    }
    static async updateShelfStockQuantity(plu, isIncrease) {
        try {
            const stock = await Stock.findOne({where: plu})
            if (!stock) throw new Error('Остаток не найден в базе данных')

            if (isIncrease) {
                stock.shelfQuantity += 1
            } else {
                stock.shelfQuantity -= 1
            }
            if (stock.shelfQuantity < 0) throw new Error('Количество товаров не может быть отрицательным')
            await stock.save()

            await Queue.sendMessage('product_actions', {
                action: isIncrease ?
                    'INCREASE_SHELF_STOCK' : 'DECREASE_SHELF_STOCK',
                stockId: stock.id,
                data: stock,
                timestamp: new Date().toISOString()
            })

            return stock
        } catch (err) {
            throw new Error(err)
        }
    }

    static async setShelfStockQuantity(plu, quantity) {
        try {
            const [updatedRowsCount, stock] = await Stock.update(
                { shelfQuantity: quantity },
                {
                    where: { plu },
                    returning: true
                }
            )

            if (updatedRowsCount === 0) {
                throw new Error('Запись не найдена')
            }

            await Queue.sendMessage('product_actions', {
                action: 'SET_SHELF_STOCK',
                stockId: stock.id,
                data: stock[0],
                timestamp: new Date().toISOString()
            })

            return stock[0]
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