const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const shopController = require('../controllers/shopController')

// All routes are protected
router.use(auth)

router.get('/', shopController.getShops)
router.get('/with-products', shopController.getShopsWithProducts)
router.get('/:id', shopController.getShopById)
router.post('/', shopController.createShop)
router.put('/:id', shopController.updateShop)
router.delete('/:id', shopController.deleteShop)

module.exports = router