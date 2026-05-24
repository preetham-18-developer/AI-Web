import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ancsnhzdyvuyfzulkjsn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Kmky13lRd60O_a9ghiN5jw_ixSdO9Kj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
