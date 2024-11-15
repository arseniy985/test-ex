const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController')
const StockController = require('../controllers/StockController')

router.post("/products", ProductController.createProduct)
router.get("/products", ProductController.getProductsByFilter)

router.post("/stock", StockController.createStock)
router.get("/stock", StockController.getStockByFilters)
router.put("/stock/orderquantity/update", StockController.updateOrderStockQuantity)
router.put("/stock/orderquantity/set", StockController.setOrderStockQuantity)
router.put("/stock/shelfquantity/update", StockController.updateShelfStockQuantity)
router.put("/stock/shelfquantity/set", StockController.setShelfStockQuantity)

module.exports = router