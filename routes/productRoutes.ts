import express, { Router } from 'express'
import * as productController from '../controllers/productController'
import authenticateToken from '../middleware/authMiddleware'

// Initialize router
const router: Router = express.Router()

// Get all products
router.get('/', authenticateToken, productController.getAllProducts)

// Get product by id
router.get('/:productId', authenticateToken, productController.getProductById)

// Create product
router.post('/', authenticateToken, productController.createProduct)

// Update product
router.put('/:productId', authenticateToken, productController.updateProduct)

// Delete product
router.delete('/:productId', authenticateToken, productController.deleteProduct)

export default router