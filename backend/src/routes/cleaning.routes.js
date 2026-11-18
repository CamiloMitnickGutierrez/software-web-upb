import { Router } from 'express'
import { createCleaningReport } from '../controllers/cleaning.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'
import {uploadPhotoMiddleware} from "../middlewares/upload.middleware.js"

const router = Router();

router.post('/', authenticateToken, uploadPhotoMiddleware ,createCleaningReport);

export default router;