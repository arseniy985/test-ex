const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController')
const StockController = require('../controllers/StockController')

router.post("/products", ProductController.createProduct)
router.get("/products", ProductController.getProductsByFilter)

router.post("/stock", StockController.createStock)
router.get("/stock", StockController.getStockByFilters)
router.post("/stock/update", StockController.updateStockQuantity)

module.exports = router