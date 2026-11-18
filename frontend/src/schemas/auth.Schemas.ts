import * as Yup from 'yup'

export const loginSchema = Yup.object({
    correo: Yup.string()
        .email('Ingresa un correo electrónico válido')
        .required('El correo es obligatorio'),
    clave: Yup.string()
        .required('La contraseña es obligatoria'),
    acceptedPrivacy: Yup.boolean()
        .oneOf([true], 'Debes aceptar las políticas de privacidad'),
});

export const registerSchema = Yup.object({
    nombre: Yup.string()
        .required('El nombre es obligatorio'),
    apellido: Yup.string()
        .required('El apellido es obligatorio'),
    correo: Yup.string()
        .email('Ingresa un correo electrónico válido')
        .required('El correo es obligatorio'),
    clave: Yup.string()
        .min(6, 'Debe tener al menos 6 caracteres')
        .required('La contraseña es obligatoria'),
    repetirClave: Yup.string()
        .oneOf([Yup.ref('clave')], 'Las contraseñas no coinciden')
        .required('Debes confirmar la contraseña'),
    acceptedPrivacy: Yup.boolean()
        .oneOf([true], 'Debes aceptar las políticas de privacidad'),
    captchaValid: Yup.boolean()
        .oneOf([true], 'Completa correctamente la validación'),
});