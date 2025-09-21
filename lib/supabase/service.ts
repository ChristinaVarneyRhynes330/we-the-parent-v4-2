// lib/supabase/service.ts
import { createClient } from '@supabase/supabase-js';

// Service client for admin operations (bypasses RLS)
export const supabaseService = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Export as default for backward compatibility
export default supabaseService;