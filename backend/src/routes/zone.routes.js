import { Router } from "express"
import { getZoneByQr } from "../controllers/zone.controller.js"
import { authenticateToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.get('/:qrcode',authenticateToken,getZoneByQr)

export default router