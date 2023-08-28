import express from "express"
import registerController from "../controllers/auth/registerController.js"
import logincontroller from "../controllers/auth/logincontroller.js"
import userController from "../controllers/auth/userController.js"
import auth from "../middlewares/Auth.js"
import refreshController from "../controllers/auth/refreshController.js"
import productController from "../controllers/Product/productController.js"

const router = express.Router()

router.post("/register", registerController.register)
router.post("/login", logincontroller.login)
router.get('/me', auth,  userController.me)
router.post('/refresh',refreshController.refresh)
router.post('/logout', auth, logincontroller.logout)

// Products

router.post('/products', productController.store)

export default router