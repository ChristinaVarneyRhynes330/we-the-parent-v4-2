/**
 * @file lib/compliance/rules-fl.ts
 * @description Compliance engine for Florida-specific legal document rules.
 */

/**
 * Defines the structure for a compliance issue object.
 */
export interface ComplianceIssue {
  /** The severity of the issue. */
  severity: 'error' | 'warning';
  /** A user-friendly message describing the issue. */
  message: string;
  /** A unique identifier for the rule that was triggered. */
  ruleId: string;
}

/**
 * A type definition for a single compliance rule function.
 * It takes the document text and returns either an issue or null.
 */
type ComplianceRule = (text: string) => ComplianceIssue | null;

// --- Rule Definitions ---

/**
 * RULE: Checks if the document contains a "Certificate of Service" section.
 * This is a critical component of most Florida court filings.
 */
const hasCertificateOfService: ComplianceRule = (text) => {
  const regex = /certificate of service/i; // Case-insensitive search
  if (!regex.test(text)) {
    return {
      severity: 'error',
      message: 'Document is missing a "Certificate of Service" section, which is required for most filings.',
      ruleId: 'missing-certificate-of-service',
    };
  }
  return null;
};

/**
 * RULE: Checks for any remaining placeholder text (e.g., [CASE_NUMBER], [DATE]).
 * These indicate that the template was not fully populated.
 */
const noRemainingPlaceholders: ComplianceRule = (text) => {
  const regex = /\[([A-Z_]{3,})\]/g; // Finds text like [PLACEHOLDER] with 3+ chars
  const matches = text.match(regex);

  if (matches && matches.length > 0) {
    // Create a unique list of found placeholders to avoid duplicate warnings
    const uniquePlaceholders = [...new Set(matches)];
    return {
      severity: 'warning',
      message: `Document may contain unpopulated placeholder text: ${uniquePlaceholders.join(', ')}.`,
      ruleId: 'unpopulated-placeholders',
    };
  }
  return null;
};


// --- Rule Runner ---

// An array of all compliance rules to be executed.
// You can easily add new rule functions to this array.
const allRules: ComplianceRule[] = [
  hasCertificateOfService,
  noRemainingPlaceholders,
];

/**
 * Runs a series of compliance checks against a string of generated legal text.
 *
 * @param legalText The generated document content to check.
 * @returns An array of warning or error objects. If no issues are found, an empty array is returned.
 */
export function runComplianceCheck(legalText: string): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];

  for (const rule of allRules) {
    const result = rule(legalText);
    if (result) {
      issues.push(result);
    }
  }

  return issues;
}