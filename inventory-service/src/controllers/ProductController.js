const ProductService = require('../services/ProductService');

class ProductController {
    static async createProduct(req, res) {
        const {plu, name} = req.body

        if (!(plu && name)) return res.status(400).json({ error: "Укажите данные продукта" })

        const product = await ProductService.createProduct(plu, name)

        return res.status(201).json(product)
    }
    static async getProductsByFilter(req, res) {
        try {
            const { plu, name } = req.query
            const products = await ProductService.getProductsByFilter({ plu, name })
            return res.status(201).json(products)
        } catch (err) {
            console.error('Ошибка получения продуктов')
            return res.status(500).json({ error: 'Не удалось получить товары: ' + err.error() })
        }
    }
}

module.exports = ProductController