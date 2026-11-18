import { Router } from "express"
import { register, loginUser , getAuthenticatedUser } from "../controllers/auth.controller.js"
import { validate, registerSchema ,loginSchema} from "../utils/validation.js"
import { authenticateToken } from "../middlewares/auth.middleware.js"


const router = Router()

//ruta de registro 
router.post('/registro',
    validate(registerSchema),
    register
)


router.post('/login',
    validate(loginSchema),
    loginUser)


router.get('/me',
    authenticateToken,
    getAuthenticatedUser)



export default router 