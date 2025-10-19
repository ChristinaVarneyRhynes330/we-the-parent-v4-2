// File: __mocks__/@/lib/supabase/client.ts

import { SupabaseClient } from '@supabase/supabase-js';

// Mock data for a single, authenticated user (meeting the single-user constraint)
const MOCK_USER = {
  id: 'mock-user-id-001',
  email: 'prose-parent-mock@wethedocument.com',
  role: 'authenticated',
};

const MOCK_SESSION = {
  user: MOCK_USER,
  expires_at: 9999999999, // Long expiration time
  access_token: 'mock-auth-token',
};

// --- Mocked Supabase Client Object ---
// This mocks all the critical functions needed by Next.js components and hooks.
const mockSupabaseClient = {
  // Mock the entire auth object (CRITICAL for login checks)
  auth: {
    // Simulate a successful login check
    getSession: jest.fn().mockResolvedValue({
      data: { session: MOCK_SESSION },
      error: null,
    }),
    getUser: jest.fn().mockResolvedValue({
      data: { user: MOCK_USER },
      error: null,
    }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    signInWithPassword: jest.fn().mockResolvedValue({ data: { session: MOCK_SESSION, user: MOCK_USER }, error: null }),
  },

  // Mock the core data query methods (from, select, etc.)
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({ data: [{ id: 'mock-insert-id' }], error: null }),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockResolvedValue({ data: [], error: null }),
    // Simulate common successful data query outcomes
    single: jest.fn().mockResolvedValue({ data: { id: 'mock-case-1', name: 'Mock Case' }, error: null }),
    // Default success for listing data (used when .then() is called)
    then: jest.fn(function(resolve) {
      return resolve({ 
        data: [{ id: 'mock-item-1', title: 'Test Data' }], 
        error: null 
      });
    }),
  })),
  // Mock the Remote Procedure Call (RPC) for custom functions like pgvector search
  rpc: jest.fn().mockResolvedValue({ data: [], error: null }),

} as unknown as SupabaseClient;

// Export the function that the rest of your app imports
export function createClient() {
  return mockSupabaseClient;
}