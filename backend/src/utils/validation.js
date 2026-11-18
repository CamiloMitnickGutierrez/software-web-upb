import { z } from 'zod';


export const registerSchema = z.object({

    nombre: z.string()
        .trim()
        .min(2, 'El nombre debe tener mínimo 2 caracteres'),

    apellido: z.string()
        .trim()
        .min(2, 'El apellido debe tener mínimo 2 caracteres'),

    correo: z.string()
        .trim()
        .email('El correo electrónico no es válido'),

    clave: z.string()
        .min(8, 'La contraseña debe tener mínimo 8 caracteres'),

    repetirClave: z.string()

}).refine((data) => data.clave === data.repetirClave, {

    message: 'Las contraseñas no coinciden',
    path: ['repetirClave']

});


export const loginSchema = z.object({

    correo: z.string()
        .trim()
        .email('El correo electrónico no es válido'),

    clave: z.string()
        .min(1, 'La contraseña es obligatoria')

});



export const validate = (schema) => {

    return (req, res, next) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {

            return res.status(400).json({

                mensaje: 'Error de validación',

                errores: result.error.issues.map((issue) => ({

                    campo: issue.path.join('.'),

                    mensaje: issue.message

                }))

            });
        }

        req.body = result.data;

        next();
    };
};