// File: __tests__/page.test.tsx

import React from 'react'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

// --- CRITICAL ADDITION: MOCK THE SUPABASE CLIENT ---
// This tells Jest/Vitest to use the mock file you created:
// '__mocks__/@/lib/supabase/client.ts'
jest.mock('@/lib/supabase/client')
// ----------------------------------------------------

describe('Page', () => {
  // NOTE: If Page component depends on authentication (which it likely does), 
  // the mock ensures a successful user object is returned, allowing this test to pass.
  it('renders a heading', () => {
    render(<Page />)

    const heading = screen.getByRole('heading', {
      name: /Dashboard/i,
    })

    expect(heading).toBeInTheDocument()
  })
})