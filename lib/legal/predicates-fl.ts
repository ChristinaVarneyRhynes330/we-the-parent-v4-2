// File: lib/legal/predicates-fl.ts

/**
 * Defines the structure for a foundation script, providing the legal 
 * checklist (questions) for admitting evidence in a Florida court.
 */
export interface FoundationScript {
  id: string;
  evidenceType: string;
  flStatute?: string; // Optional reference to the relevant Florida Statute or Rule of Evidence
  questions: string[]; // The required questions/script to lay the foundation
}

// Exported array of static scripts (initial zero-cost data for the feature)
export const FL_FOUNDATION_SCRIPTS: FoundationScript[] = [
  {
    id: 'photo-1',
    evidenceType: 'Photograph',
    flStatute: '§ 90.901 (Authentication)',
    questions: [
      '1. Do you recognize this exhibit (Exhibit A)?',
      '2. How are you familiar with what is depicted in this photo (I took it / I was present)?',
      '3. Does this photo fairly and accurately represent the scene/object as it existed on [Date]?',
      '4. Was this photograph altered in any way?',
      '5. I offer Exhibit A into evidence, Your Honor.',
    ],
  },
  {
    id: 'text-message-1',
    evidenceType: 'Text Message / Screenshot',
    flStatute: '§ 90.901 (Authentication)',
    questions: [
      '1. Do you recognize this exhibit (Exhibit B)?',
      '2. How are you familiar with this exhibit (It is a screenshot of a text exchange)?',
      '3. Do you recognize the sender’s number/name as [Name of Other Party]?',
      '4. Does this exhibit fairly and accurately reflect the communication as it was sent or received on [Date]?',
      '5. I offer Exhibit B into evidence, Your Honor.',
    ],
  },
  {
    id: 'document-business-record',
    evidenceType: 'Business Record (e.g., Hospital, Doctor, Agency Note)',
    flStatute: '§ 90.803(6) (Business Record Exception to Hearsay)',
    questions: [
      '1. Are you the custodian of records for [Name of Business]?',
      '2. Was this record made at or near the time by—or from information transmitted by—a person with knowledge?',
      '3. Was the record kept in the course of a regularly conducted business activity?',
      '4. Was it the regular practice of that business activity to make the record?',
      '5. I offer Exhibit C into evidence, Your Honor.',
    ],
  },
];