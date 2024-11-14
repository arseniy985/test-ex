const Product = require('../models/Product')
const Queue = require('../RabbitMQService')
const sequelize = require("../config/database.config");

class ProductService {
     static async createProduct(plu, name) {
        const t = await sequelize.transaction()
        try {
            const checkPlu = await Product.findOne({ where: {plu} , transaction: t})
            if (checkPlu) {
                throw new Error('Продукт с таким plu уже существует')
            }

            const product = await Product.create({
                plu: plu,
                name: name,
                transaction: t
            })

            await Queue.sendMessage('product_actions', {
                action: 'CREATE_PRODUCT',
                productId: product.id,
                data: product,
                timestamp: new Date().toISOString()
            })
            await t.commit();

            return product
        } catch (err) {
            await t.rollback();
            throw new Error(err)
        }
    }

    static async getProductsByFilter(filter) {
         try {
             return await Product.findAll({ where: filter })
         } catch (err) {
             throw new Error(err.message)
         }
    }
}

module.exports = ProductService