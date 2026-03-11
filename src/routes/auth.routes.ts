import { Router } from "express"
import { registerUser, loginUser, getMe, logoutUser } from "../controllers/auth.controller"
import { verifyToken } from "../middleware/auth.middleware"

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/me", verifyToken, getMe)
router.post("/logout", logoutUser)

export default router