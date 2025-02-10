
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lovable.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvdmFibGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwNzUwODgwMCwiZXhwIjoxNzA3NTA4ODAwfQ.mocked';

export const supabase = createClient(supabaseUrl, supabaseKey);
