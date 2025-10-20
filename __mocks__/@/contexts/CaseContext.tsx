// File: __mocks__/@/contexts/CaseContext.tsx

import React, { createContext, useContext } from 'react';
import { Case } from '@/types'; // Assuming Case is imported from global types

// Mock data structure based on the Dashboard's needs
const mockCase: Case = {
    id: 'mock-case-id-123',
    user_id: 'mock-user-id-001',
    name: 'Mock Case for Testing',
    case_number: '2025-DP-00001',
    created_at: '2025-01-01T00:00:00Z',
};

const mockContextValue = {
    cases: [mockCase],
    loading: false,
    error: null,
    refreshCases: jest.fn(),
};

const CaseContext = createContext(mockContextValue);

// Export the mock CaseProvider and useCases
export function CaseProvider({ children }: { children: React.ReactNode }) {
    // In a test environment, we just provide the mock value.
    return (
        <CaseContext.Provider value={mockContextValue}>
            {children}
        </CaseContext.Provider>
    );
}

export function useCases() {
    // This hook is used by components and will return mock data
    return mockContextValue;
}