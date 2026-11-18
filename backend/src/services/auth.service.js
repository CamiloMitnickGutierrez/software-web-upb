import "dotenv/config"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { findUser, findUserLogin, createUser } from "../models/user.model.js"

const JWT_SECRET = process.env.JWT_SECRET

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h'

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no esta configurado')
}


export const registerUser = async ({

    nombre,
    apellido,
    correo,
    clave

}) => {


    const formateEmail = correo.trim().toLowerCase()

    const userExisting = await findUser(formateEmail)

    if (userExisting) {

        const error = new Error('El correo ya esta registrado')

        error.statusCode = 409; throw error
    }

    const password_hash = await bcrypt.hash(clave, 12)

    try {
        const user = await createUser({
            nombre,
            apellido,
            correo: formateEmail,
            password_hash,
            role: 'operario'
        })

        return user

    } catch (error) {

        if (error.code === '23505') {

            const duplicateError = new Error('El correo ya esta registrado ')

            duplicateError.statusCode = 409

            throw duplicateError

        }

        throw error
    }
}

export const loginService = async ({

    correo,
    clave

}) => {

    const correoFormat = correo.trim().toLowerCase()

    const user = await findUserLogin(correoFormat)

    if (!user) {
        throw Error('Correo o contraseña incorrectos')
    }

    const passwordValid = await bcrypt.compare(clave, user.password_hash)

    if (!passwordValid) {
        const error = new Error('Correo o contraseña incorrectos')

        error.statusCode = 401

        throw error
    }

    const token = jwt.sign({
        id: user.id,
        correo: user.correo,
        role: user.role
    }, JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN
        })
    
    return {

        access_token:token,
        toke_type:'Bearer',

        user: {
            id:user.id,
            nombre:user.nombre,
            apellido:user.apellido,
            correo:user.correo,
            role:user.role


        }

    }



}