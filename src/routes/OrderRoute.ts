import express from 'express'
import { createCheckoutSession, getMyOrders, handleStripeWebook } from '../controllers/OrderController'
import { jwtCheck } from '../middleware/auth'
import { jwtParse } from '../middleware/jwtParse'
const router = express.Router()

router.get('/', jwtCheck, jwtParse, getMyOrders)
router.post('/checkout/create-checkout-session', jwtCheck, jwtParse, createCheckoutSession)
router.post('/checkout/webhook', handleStripeWebook)

export default router