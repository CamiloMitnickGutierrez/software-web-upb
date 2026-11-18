import axios from 'axios'

export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return 'No se pudo conectar con el servidor. Inténtalo nuevamente.';
        }

        if (error.response.status === 401 || error.response.status === 403) {
            return 'Los datos ingresados no son correctos.';
        }

        if (error.response.status === 409) {
            return 'Ya existe una cuenta con esos datos.';
        }

        if (error.response.status >= 500) {
            return 'Ocurrió un problema en el servidor. Inténtalo más tarde.';
        }

        return 'Revisa los datos e inténtalo nuevamente.';
    }
    if (error instanceof Error) {
        return error.message === 'La respuesta del servidor no contiene los datos de sesión esperados.'
            ? 'No se pudo iniciar sesión. Revisa tus datos e inténtalo nuevamente.'
            : 'Ocurrió un error inesperado. Inténtalo nuevamente.';
    }
    return 'Ocurrió un error inesperado'
};