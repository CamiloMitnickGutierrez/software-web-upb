import { supabase } from "../config/supabase.js"


//buscar usuario 

export const findUser = async (correo) => {

    const {data , error } = await supabase
    .from('users')
    .select('id,correo,role')
    .ilike('correo',correo)
    .maybeSingle()

    if (error) {
        throw error
    }

    return data
    
}

// buscar usuario para logearse

export const findUserLogin = async (correo) => {

    const {data , error } = await supabase
    .from('users')
    .select('id, nombre , apellido , correo , password_hash, role')
    .ilike('correo',correo)
    .maybeSingle()

    if (error) {
        throw error
    }

    return data
 
}

//registrar usuario

export const  createUser = async (dataUser) => {
    
    const {data , error } = await supabase
    .from('users')
    .insert(dataUser)
    .select('id, nombre, apellido, correo, role, created_at')
    .single()

    if (error) {
        throw error
    }

    return data
}