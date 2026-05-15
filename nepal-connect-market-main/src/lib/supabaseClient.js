import { createClient } from '@supabase/supabase-js'

console.log(import.meta.env)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log(import.meta.env)
console.log(import.meta.env.VITE_SUPABASE_URL)

export const supabase = createClient(supabaseUrl, supabaseKey)