import express from "express"
import registerController from "../controllers/auth/registerController.js"
import logincontroller from "../controllers/auth/logincontroller.js"
const router = express.Router()

router.post("/register", registerController.register)
router.post("/login", logincontroller.login)

export default router