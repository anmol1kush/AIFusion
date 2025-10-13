import express from "express"
import { protect } from "../middlewares/auth.js"
import { addCredits, getPlans, purchasePlan, verifyPayment } from "../controllers/creditController.js"

const creditRouter= express.Router()

creditRouter.post('/purchase-plan',protect,purchasePlan)
creditRouter.post('/verify-payment',protect,verifyPayment)
creditRouter.get('/plan',protect,getPlans);
creditRouter.post('/add-credits',protect,addCredits)

export default creditRouter