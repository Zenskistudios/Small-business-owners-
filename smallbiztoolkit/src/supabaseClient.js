import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://enmazyeurtvkrdgcfeih.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubWF6eWV1cnR2a3JkZ2NmZWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODM5ODYsImV4cCI6MjA5NDM1OTk4Nn0.W-3menPUBWPf7uI24eBEcphRwRAk2sHtlGX_ln_wJuk'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
