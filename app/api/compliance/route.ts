import { NextResponse } from 'next/server';

// Mock function to simulate an AI-powered compliance check.
// In a real implementation, this would use a language model to analyze the text.
const performComplianceCheck = (documentType, draft) => {
  let report = `Compliance Report for ${documentType}:\n\n`;
  let passed = true;

  // Rule 1: Check for a standard Florida court caption.
  const hasCaption = draft.includes("Case Name:") && draft.includes("Case Number:");
  if (hasCaption) {
    report += "✓ Rule 1: Standard court caption found.\n";
  } else {
    report += "✗ Rule 1: Missing a standard court caption.\n";
    passed = false;
  }

  // Rule 2: Check for a signature line.
  const hasSignature = draft.includes("Signature:") || draft.includes("Dated:") || draft.includes("By:");
  if (hasSignature) {
    report += "✓ Rule 2: Signature line detected.\n";
  } else {
    report += "✗ Rule 2: No signature line found.\n";
    passed = false;
  }

  // Rule 3: Check for a Certificate of Service.
  const hasService = draft.includes("Certificate of Service") || draft.includes("CERTIFICATE OF SERVICE");
  if (hasService) {
    report += "✓ Rule 3: Certificate of Service section found.\n";
  } else {
    report += "✗ Rule 3: Missing Certificate of Service section.\n";
    passed = false;
  }
  
  if (passed) {
    report += "\n**Summary: The document appears to be fully compliant with basic Florida formatting rules.**";
  } else {
    report += "\n**Summary: The document has some compliance issues that need your attention.**";
  }

  return report;
};

export async function POST(request) {
  const { documentType, draft } = await request.json();

  if (!documentType || !draft) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const complianceReport = performComplianceCheck(documentType, draft);
    return NextResponse.json({ report: complianceReport });
  } catch (error) {
    console.error("Compliance API Error:", error);
    return NextResponse.json({ error: 'Failed to perform compliance check.' }, { status: 500 });
  }
}