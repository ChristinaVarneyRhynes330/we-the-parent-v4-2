// File: __tests__/page.test.tsx (Full Content Replacement)

import React from 'react'
import { render, screen } from '@testing-library/react'
// FIX: Import the component using the named style to ensure it resolves correctly
import * as PageModule from '../app/page'
import { TestProviders } from './TestProviders'; 

// Check if the component is a default export, otherwise use the module itself.
// This solves the 'Element type is invalid' error in Next.js test environments.
const Page = PageModule.default || PageModule; 

// CRITICAL FIX: MOCK THE CONTEXT TO BYPASS SUPABASE INIT 
jest.mock('@/contexts/CaseContext'); 
jest.mock('@/lib/supabase/client');


describe('Page', () => {
  it('renders a heading', () => {
    render(
      <TestProviders>
        {/* FIX: Ensure the component is rendered with the necessary providers */}
        <Page />
      </TestProviders>
    );

    const heading = screen.getByRole('heading', {
      name: /Dashboard/i,
    });

    expect(heading).toBeInTheDocument();
  });
});