import { createClient } from '@supabase/supabase-js'

if (process.env.SUPABASE_URL === undefined) throw new Error('SUPABASE_URL is required')
if (process.env.SUPABASE_API_KEY === undefined) throw new Error('SUPABASE_API_KEY is required')

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY)

export default supabase
