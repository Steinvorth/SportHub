import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://uxiytxuyozhaolqjauzv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4aXl0eHV5b3poYW9scWphdXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyNjc3ODIsImV4cCI6MjA0NDg0Mzc4Mn0.m025n9_jnoGn6TJep4US1ejCTEY8i3PIhbnH65p976g')

export default supabase;

export const supabaseAdmin = createClient('https://uxiytxuyozhaolqjauzv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4aXl0eHV5b3poYW9scWphdXp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTI2Nzc4MiwiZXhwIjoyMDQ0ODQzNzgyfQ.knu0-pk8YqnY3C9TaHuQkkcYt1-907DuQ_QdsoqqRcs')
