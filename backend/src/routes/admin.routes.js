import { Router } from "express"
import { getAdminOverview } from "../controllers/admin.controller.js"
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/overview", authenticateToken, authorizeRoles("admin"), getAdminOverview)

export default router
