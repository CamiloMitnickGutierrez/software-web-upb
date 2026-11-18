import { randomUUID } from "node:crypto"
import { supabase } from "../config/supabase.js"
import { insertTimeCleaning } from "../models/cleaning.model.js"

const storageBucket =
    process.env.SUPABASE_STORAGE_BUCKET || "cleaning-photos"

export const registerCleaningService = async (userId, bodyData, file) => {
    const safeFileName = file.originalname.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
    )

    const filePath = `${userId}/${randomUUID()}-${safeFileName}`

    const { error: uploadError } = await supabase.storage
        .from(storageBucket)
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        })

    if (uploadError) {
        throw uploadError
    }

    const { data: publicUrlData } = supabase.storage
        .from(storageBucket)
        .getPublicUrl(filePath)

    const reportPayload = {
        user_id: userId,
        zone_id: bodyData.zone_id,
        duracion: bodyData.duracion,
        novedad: bodyData.novedad,
        foto_url: publicUrlData.publicUrl
    }

    return await insertTimeCleaning(reportPayload)
}