// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

// For client components (browser)
export const createBrowserClient = () => {
  return createClientComponentClient();
};

// Alternative direct client creation (if needed)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Default export for backward compatibility
export { createBrowserClient as createClient };