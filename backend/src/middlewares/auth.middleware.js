import 'dotenv/config'

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET



export const authenticateToken = (req, res, next) => {

    const authHeader = req.headers.authorization


    if (!authHeader || !authHeader.startsWith('Bearer ')) {

        return res.status(401).json({

            mensaje: 'No se proporcionó un token válido'

        })

    }

    const token = authHeader.split(' ')[1]

    try {

        const decoded = jwt.verify(token, JWT_SECRET)

        req.user = decoded;

        next()

    } catch (error) {

        return res.status(401).json({

            mensaje: 'Token inválido o expirado'

        })

    }

}



export const authorizeRoles = (...roles) => {

    return (req, res, next) => {

   
        if (!req.user) {

            return res.status(401).json({

                mensaje: 'Debes iniciar sesión'

            })

        }

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({

                mensaje: 'No tienes permisos para acceder'

            })

        }

        next()

    }

}