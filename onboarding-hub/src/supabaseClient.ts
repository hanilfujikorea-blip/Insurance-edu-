import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://eudwyeytefbshjekebnd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZHd5ZXl0ZWZic2hqZWtlYm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNTk5NTQsImV4cCI6MjA5NTkzNTk1NH0.p81XClBcgpbCUcbqEYY3g81YpyqMp3O8RXg1PqZOS8U";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
