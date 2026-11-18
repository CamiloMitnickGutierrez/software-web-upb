import "dotenv/config"
import { createClient } from "@supabase/supabase-js"


const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_KEY } = process.env
const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_KEY

if (!SUPABASE_URL || !supabaseKey) {

    throw new Error('SUPABASE_URL y SUPABASE_KEY son obligatorias')
}

export const supabase = createClient (

    SUPABASE_URL,
    supabaseKey
)