import {supabase} from "../config/supabase.js"

export const insertTimeCleaning = async (cleaningData) => {

    const {user_id,zone_id,duracion,novedad,foto_url} = cleaningData

    const {data,error} = await supabase
    .from('cleanings')
    .insert([{
        user_id,
        zone_id,
        duracion,
        novedad:novedad || 'sin novedades',
        foto_url:foto_url || null
    }])
    .select()
    .single()

    if (error) throw error

    const {error:updateError} = await supabase
    .from('zones')
    .update({estado:'completed'})
    .eq('id',zone_id)

    if (updateError) throw updateError

    return data

}