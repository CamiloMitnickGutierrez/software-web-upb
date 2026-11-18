import { supabase } from "../config/supabase.js"

const getFloor = (zone) => {
    if (zone.piso !== undefined && zone.piso !== null) return String(zone.piso)
    const match = String(zone.nombre || "").match(/piso\s*([a-z0-9-]+)/i)
    return match ? match[1] : "No especificado"
}

export const getAdminOverview = async (req, res) => {
    try {
        const [zonesResult, usersResult, cleaningsResult] = await Promise.all([
            supabase.from("zones").select("*").order("id"),
            supabase.from("users").select("id, nombre, apellido, correo, role").eq("role", "operario").order("nombre"),
            supabase
                .from("cleanings")
                .select("id, duracion, novedad, foto_url, created_at, users(nombre, apellido, correo), zones(nombre)")
                .order("created_at", { ascending: false }),
        ])

        const firstError = zonesResult.error || usersResult.error || cleaningsResult.error
        if (firstError) throw firstError

        return res.json({
            zones: (zonesResult.data || []).map((zone) => ({
                ...zone,
                piso: getFloor(zone),
            })),
            operarias: usersResult.data || [],
            history: (cleaningsResult.data || []).map((cleaning) => ({
                id: cleaning.id,
                duracion: cleaning.duracion,
                novedad: cleaning.novedad || "Sin novedades",
                created_at: cleaning.created_at,
                operaria: cleaning.users || null,
                zona: cleaning.zones?.nombre || "Zona no disponible",
                foto_url: cleaning.foto_url,
                foto_estado: cleaning.foto_url ? "Validada" : "Rechazada",
            })),
        })
    } catch (error) {
        console.error("Error al cargar el resumen administrativo:", error)
        return res.status(500).json({ message: "No se pudo cargar el panel administrativo." })
    }
}
