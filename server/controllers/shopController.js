const { body } = require('express-validator')
const Shop = require('../models/Shop')
const Product = require('../models/Product')
const { handleValidationErrors } = require('../middleware/validation')

// Validation rules
const shopValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Shop name is required')
    .isLength({ max: 100 })
    .withMessage('Shop name cannot be more than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address cannot be more than 200 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
]

// Get all shops for the authenticated user
const getShops = async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.user._id })
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: shops
    })
  } catch (error) {
    console.error('Get shops error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching shops'
    })
  }
}

// Get shop by ID
const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findOne({
      _id: req.params.id,
      owner: req.user._id
    })

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      })
    }

    res.json({
      success: true,
      data: shop
    })
  } catch (error) {
    console.error('Get shop by ID error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching shop'
    })
  }
}

// Get all shops with their products
const getShopsWithProducts = async (req, res) => {
  try {
    const shops = await Shop.aggregate([
      { $match: { owner: req.user._id } },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'shop',
          as: 'products'
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          address: 1,
          phone: 1,
          email: 1,
          createdAt: 1,
          updatedAt: 1,
          products: {
            $map: {
              input: '$products',
              as: 'product',
              in: {
                _id: '$$product._id',
                name: '$$product.name',
                description: '$$product.description',
                price: '$$product.price',
                category: '$$product.category',
                stock: '$$product.stock',
                sku: '$$product.sku',
                createdAt: '$$product.createdAt',
                updatedAt: '$$product.updatedAt'
              }
            }
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ])

    res.json({
      success: true,
      data: shops
    })
  } catch (error) {
    console.error('Get shops with products error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching shops with products'
    })
  }
}

// Create new shop
const createShop = [
  ...shopValidation,
  handleValidationErrors,
  
  async (req, res) => {
    try {
      const shopData = {
        ...req.body,
        owner: req.user._id
      }

      const shop = new Shop(shopData)
      await shop.save()

      res.status(201).json({
        success: true,
        message: 'Shop created successfully',
        data: shop
      })
    } catch (error) {
      console.error('Create shop error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error while creating shop'
      })
    }
  }
]

// Update shop
const updateShop = [
  ...shopValidation,
  handleValidationErrors,
  
  async (req, res) => {
    try {
      const shop = await Shop.findOneAndUpdate(
        {
          _id: req.params.id,
          owner: req.user._id
        },
        req.body,
        { new: true, runValidators: true }
      )

      if (!shop) {
        return res.status(404).json({
          success: false,
          message: 'Shop not found'
        })
      }

      res.json({
        success: true,
        message: 'Shop updated successfully',
        data: shop
      })
    } catch (error) {
      console.error('Update shop error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error while updating shop'
      })
    }
  }
]

// Delete shop
const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    })

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      })
    }

    // Also delete all products associated with this shop
    await Product.deleteMany({ shop: req.params.id })

    res.json({
      success: true,
      message: 'Shop and associated products deleted successfully'
    })
  } catch (error) {
    console.error('Delete shop error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting shop'
    })
  }
}

module.exports = {
  getShops,
  getShopById,
  getShopsWithProducts,
  createShop,
  updateShop,
  deleteShop
}