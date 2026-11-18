import { registerCleaningService } from "../services/cleaning.service.js"

export const createCleaningReport = async (req, res) => {
    try {
        const userId = req.user.id
        const file = req.file

        // Validación estricta: Si no viene la foto, se rechaza de inmediato
        if (!file) {
            return res.status(400).json({ 
                success: false, 
                message: 'La fotografía de evidencia es obligatoria.' 
            })
        }

        const novedadFormal = String(req.body.novedad || "").trim() || "Sin novedades"

        const report = await registerCleaningService(
            userId,
            { ...req.body, novedad: novedadFormal },
            file
        )

        return res.status(200).json({
            message: "Reporte de aseo registrado con éxito",
            report
        })
    } catch (error) {
        console.error('Error al registrar aseo:', error)
        return res.status(500).json({ message: error.message || 'Error interno al guardar el reporte' })
    }
}