import { NextRequest, NextResponse } from 'next/server';
import { createSSRClient } from '@/lib/supabase/server';
import { OpenAI } from 'openai';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const supabase = await createSSRClient();

  const { templateId, caseId, userInstructions } = await req.json();

  if (!templateId || !caseId) {
    return NextResponse.json({ error: 'templateId and caseId are required.' }, { status: 400 });
  }

  // Sanitize templateId to prevent path traversal
  const sanitizedTemplateId = path.basename(templateId);

  try {
    // 1. Fetch the template content
    const templatePath = path.join(process.cwd(), 'lib', 'templates', 'florida', `${sanitizedTemplateId}.md`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    // 2. Fetch relevant case data
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('name, case_number')
      .eq('id', caseId)
      .single();

    if (caseError) throw caseError;

    // (Optional) Fetch other relevant data like parties, timeline events, etc.

    // 3. Construct the prompt
    const prompt = `You are a legal document drafting assistant. Your task is to generate a complete legal document based on the provided template and case data.

Template:
---
${templateContent}
---

Case Data:
- Case Name: ${caseData.name}
- Case Number: ${caseData.case_number}

User Instructions:
${userInstructions || 'Fill out the document based on the provided template and case data.'}

Generate the full document now.
`;

    // 4. Call the AI model
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const draft = response.choices[0].message.content;

    return NextResponse.json({ draft });

  } catch (error: any) {
    console.error('Drafting API Error:', error);
    if (error.code === 'ENOENT') {
      return NextResponse.json({ error: 'Template not found.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to generate draft.' }, { status: 500 });
  }
}