import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = "https://nkpfjbpkcqcbfgvcbtgh.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rcGZqYnBrY3FjYmZndmNidGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTI1ODMsImV4cCI6MjA2NTk4ODU4M30.lneP7rlhOMDT2D3rtHUMC9sUqOigMNEPHAx7lDWkYZI"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase
