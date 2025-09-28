'use client';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// POST - Create a new predicate
export async function POST(request: Request) {
  const { case_id, statement } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  if (!case_id || !statement) {
    return NextResponse.json({ error: 'Missing required fields: case_id and statement' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('predicates')
      .insert({ case_id, statement })
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating predicate:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ predicate: data }, { status: 201 });
  } catch (e) {
    console.error('Unexpected error creating predicate:', e);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

// PUT - Link/Unlink evidence from a predicate
export async function PUT(request: Request) {
  const { predicate_id, evidence_ids } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  if (!predicate_id || !Array.isArray(evidence_ids)) {
    return NextResponse.json({ error: 'Missing required fields: predicate_id and evidence_ids array' }, { status: 400 });
  }

  try {
    // For production, it's best to wrap these operations in a single transaction
    // via a Supabase RPC function to ensure data consistency.

    // 1. Delete all existing links for this predicate
    const { error: deleteError } = await supabase
      .from('predicate_evidence')
      .delete()
      .eq('predicate_id', predicate_id);

    if (deleteError) {
      console.error('Supabase error deleting old links:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // 2. Insert the new links, if there are any
    if (evidence_ids.length > 0) {
      const linksToInsert = evidence_ids.map(evidence_id => ({
        predicate_id,
        evidence_id,
      }));

      const { error: insertError } = await supabase
        .from('predicate_evidence')
        .insert(linksToInsert);

      if (insertError) {
        console.error('Supabase error inserting new links:', insertError);
        // If this fails, the predicate is left with no evidence links.
        // A transaction would automatically roll back the delete operation.
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Predicate evidence links updated successfully.' }, { status: 200 });

  } catch (e) {
    console.error('Unexpected error updating predicate links:', e);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
