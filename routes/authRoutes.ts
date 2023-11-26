import express, { Router } from 'express'
import * as authController from '../controllers/authController'

// Initialize router
const router: Router = express.Router()

// Register
router.post('/register', authController.register)

// Login
router.post('/login', authController.login)

export default router
