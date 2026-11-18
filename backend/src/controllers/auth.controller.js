import { registerUser, loginService } from "../services/auth.service.js"


export const register = async (req, res) => {

    try {

        const user = await registerUser(req.body)

        return res.status(201).json({

            mensaje: "usuario registrado con exito",
            data: user
        })

    } catch (error) {

        console.error("error en crear user", error)

        return res.status(error.statusCode || 500).json({
            mensaje: error.message || "No se pudo registrar el usuario"
        })

    }

}


export const loginUser = async (req, res) => {

    try {


        const loginResult = await loginService(req.body)

        return res.status(200).json({

            mensaje: "Inicio de sesion exitoso",
            data: loginResult

        })

    } catch (error) {

        console.error("error en iniciar sesion", error)

        return res.status(error.statusCode || 500).json({
            mensaje: error.message || "No se pudo iniciar sesion"
        })

    }

}

export const getAuthenticatedUser = (req, res) => {

    return res.status(200).json({

        mensaje: 'Usuario autenticado correctamente',

        data: req.user

    });

};