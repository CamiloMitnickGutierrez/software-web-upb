
export type UserRole = 'admin' | 'operario'

export interface User {
    
    id:string,
    correo:string,
    nombre:string,
    apellido:string,
    role:UserRole

}

export interface AuthSession {

    access_token:string,
    refresh_token?:string

}

export interface LoginValues {
    
    correo:string,
    clave:string
    
}




export interface RegisterValues {

    nombre:string,
    apellido:string,
    correo:string,
    clave:string,
    repetirClave:string

}