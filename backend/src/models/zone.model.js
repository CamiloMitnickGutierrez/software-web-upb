import { supabase } from "../config/supabase.js"

export const findByQrZone = async (qrcode) => {

    const {data , error} = await supabase
    .from('zones')
    .select('*')
    .eq('codigo_qr',qrcode)
    .single()

    if (error) return null

    return data
}

export const updateZoneStatus = async (zoneId, status) => {
    const { error } = await supabase
        .from('zones')
        .update({ estado: status })
        .eq('id', zoneId)

    if (error) throw error

    return true;
}