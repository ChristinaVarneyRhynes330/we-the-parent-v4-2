// constants/case.ts

// Your Personal Case Information
export const YOUR_CASE_INFO = {
  // Case Details
  caseNumber: "2024-DP-000587-XXDP-BC",
  caseName: "Your Name v. Department of Children and Families", // Replace "Your Name" with your actual name
  
  // Court Information
  circuit: "5th Judicial Circuit",
  county: "Lake County", // Update with your actual county
  division: "Dependency Division",
  
  // Case Status
  status: "Active",
  nextHearing: "March 15, 2025", // Update with your actual hearing date
  nextHearingTime: "2:00 PM",
  judge: "Judge Name", // Update with your judge's name if known
  
  // Progress Tracking
  overallProgress: 65, // Percentage of case plan completion
  daysToNextHearing: 3, // Will be calculated dynamically in real app
};

// Supabase Case ID (if using database)
export const CASE_ID = 'bf45b3cd-652c-43db-b535-38ab89877ff9'; // Replace with your actual UUID if using Supabase

// Document Types
export const DOCUMENT_TYPES = {
  MOTION: "Motion",
  EVIDENCE: "Evidence", 
  COURT_ORDER: "Court Order",
  AFFIDAVIT: "Affidavit",
  OTHER: "Other"
};

// Export all as default for easy importing
export default {
  YOUR_CASE_INFO,
  CASE_ID,
  DOCUMENT_TYPES
};