import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://targmmjjkvszbgrbflpy.supabase.co';
const supabaseAnonKey = 'sb_publishable_0lfQSxr_pidkmIRjfigpdA_5MkN_w_Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
