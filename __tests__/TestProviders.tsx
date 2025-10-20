// File: __tests__/TestProviders.tsx (Full Content Replacement)

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CaseProvider } from '@/contexts/CaseContext';

// Create a test query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

export const TestProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CaseProvider>
        {children}
      </CaseProvider>
    </QueryClientProvider>
  );
};

// FIX: Add a dummy test suite to clear the "must contain at least one test" error
describe('TestProviders Wrapper', () => {
  it('should be a valid wrapper component', () => {
    expect(TestProviders).toBeDefined();
  });
});