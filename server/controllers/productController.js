const { body } = require('express-validator')
const Product = require('../models/Product')
const Shop = require('../models/Shop')
const { handleValidationErrors } = require('../middleware/validation')

// Validation rules - NO IMAGE VALIDATION
const productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name cannot be more than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot be more than 50 characters'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  // NO VALIDATION FOR IMAGE - ACCEPTS ANY STRING
  body('image')
    .optional()
    .trim()
    // No validation - accepts any string as image URL
]

// Get all products for the authenticated user
const getProducts = async (req, res) => {
  try {
    // First get all shops owned by the user
    const userShops = await Shop.find({ owner: req.user._id }).select('_id')
    const shopIds = userShops.map(shop => shop._id)

    const products = await Product.find({ shop: { $in: shopIds } })
      .populate('shop', 'name')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    })
  }
}

// Get products by shop ID
const getProductsByShop = async (req, res) => {
  try {
    // Verify that the shop belongs to the authenticated user
    const shop = await Shop.findOne({
      _id: req.params.shopId,
      owner: req.user._id
    })

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      })
    }

    const products = await Product.find({ shop: req.params.shopId })
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Get products by shop error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    })
  }
}

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('shop')

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Verify that the product's shop belongs to the authenticated user
    const shop = await Shop.findOne({
      _id: product.shop._id,
      owner: req.user._id
    })

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Get product by ID error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    })
  }
}

// Create new product - ACCEPTS ANY IMAGE URL
const createProduct = [
  ...productValidation,
  handleValidationErrors,
  
  async (req, res) => {
    try {
      // Verify that the shop belongs to the authenticated user
      const shop = await Shop.findOne({
        _id: req.body.shop,
        owner: req.user._id
      })

      if (!shop) {
        return res.status(404).json({
          success: false,
          message: 'Shop not found'
        })
      }

      // Accept ANY image URL without validation
      const productData = {
        name: req.body.name,
        description: req.body.description || '',
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        image: req.body.image || '', // Accept any string as image URL
        shop: req.body.shop
      }

      const product = new Product(productData)
      await product.save()

      // Populate shop info in response
      await product.populate('shop', 'name')

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      })
    } catch (error) {
      console.error('Create product error:', error)
      
      // Generic error - no specific validation for images
      res.status(500).json({
        success: false,
        message: 'Server error while creating product'
      })
    }
  }
]

// Update product - ACCEPTS ANY IMAGE URL
const updateProduct = [
  ...productValidation,
  handleValidationErrors,
  
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      // Verify that the product's shop belongs to the authenticated user
      const shop = await Shop.findOne({
        _id: product.shop,
        owner: req.user._id
      })

      if (!shop) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      // Accept ANY image URL without validation
      const updateData = {
        name: req.body.name,
        description: req.body.description || product.description,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        image: req.body.image || product.image // Accept any string as image URL
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('shop', 'name')

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      })
    } catch (error) {
      console.error('Update product error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error while updating product'
      })
    }
  }
]

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Verify that the product's shop belongs to the authenticated user
    const shop = await Shop.findOne({
      _id: product.shop,
      owner: req.user._id
    })

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    await Product.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    })
  }
}

module.exports = {
  getProducts,
  getProductsByShop,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}