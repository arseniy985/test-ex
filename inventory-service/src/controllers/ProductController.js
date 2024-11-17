const ProductService = require('../services/ProductService');

class ProductController {
    static async createProduct(req, res) {
        try {
            const {plu, name} = req.body
            if (!(plu && name)) return res.status(400).json({error: "Укажите данные продукта"})

            const product = await ProductService.createProduct(plu, name)
            return res.status(201).json(product)
        } catch (err) {
            console.error('Ошибка создания продукта')
            return res.status(500).json({ error: 'Не удалось создать товар: ' + err.message })
        }
    }
    static async getProductsByFilter(req, res) {
        try {
            const { plu, name } = req.query

            let filter = {}
            if (plu !== undefined && plu !== '') filter.plu = plu
            if (name !== undefined && name !== '') filter.name = name

            const products = await ProductService.getProductsByFilter(filter)
            return res.status(200).json(products)
        } catch (err) {
            console.error('Ошибка получения продуктов')
            return res.status(500).json({ error: 'Не удалось получить товары: ' + err.message })
        }
    }
}

module.exports = ProductController