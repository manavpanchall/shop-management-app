const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const productController = require('../controllers/productController')

// All routes are protected
router.use(auth)

router.get('/', productController.getProducts)
router.get('/shop/:shopId', productController.getProductsByShop)
router.get('/:id', productController.getProductById)
router.post('/', productController.createProduct)
router.put('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)

module.exports = router