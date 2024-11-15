const app = require('express')
const router = app.Router()
const HistoryController = require('../controllers/HistoryController')

router.get('/history', HistoryController.getHistoryByFilters)

module.exports = router