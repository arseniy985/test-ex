const Product = require('../models/Product')
const Queue = require('../RabbitMQService')

class ProductService {
     static async createProduct(plu, name) {
        try {
            const product = Product.create({
                plu: plu,
                name: name
            })

            await Queue.sendMessage('product_actions', {
                action: 'CREATE_PRODUCT',
                productId: product.id,
                data: product,
                timestamp: new Date().toISOString()
            })

            return product
        } catch (err) {
            throw new Error(err.message())
        }
    }
    static async getProductsByFilter(filter) {
         try {
             return await Product.findAll({ where: filter })
         } catch (err) {
             throw new Error(err.message())
         }
    }
}

module.exports = ProductService