// Your Personal Case Information
// Update these with your actual case details

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
  
  // Your Information (for document signatures)
  yourName: "Your Full Legal Name", // Replace with your actual name
  yourAddress: "123 Your Street, Your City, FL 12345", // Replace with your address
  yourPhone: "(555) 123-4567", // Replace with your phone number
  yourEmail: "your.email@example.com", // Replace with your email
  
  // Case Participants
  dcfAttorney: "DCF Attorney Name",
  galName: "Guardian Ad Litem Name",
  caseWorker: "Case Worker Name",
  
  // Important Dates
  caseOpened: "2024-01-15", // Update with actual date case opened
  lastCourtDate: "2025-02-15", // Update with last court appearance
  nextReviewDate: "2025-04-10", // Update with next review hearing
};

// Supabase Case ID (if using database)
export const CASE_ID = 'bf45b3cd-652c-43db-b535-38ab89877ff9'; // Replace with your actual UUID if using Supabase

// Common Document Templates for Your Case
export const DOCUMENT_TEMPLATES = {
  motionVisitation: {
    title: "Motion for Increased Visitation",
    commonFacts: [
      "Successfully completed all required parenting classes",
      "Secured stable housing appropriate for child",
      "Maintained consistent employment for [X] months",
      "Completed substance abuse treatment program",
      "Demonstrated positive interaction during supervised visits",
      "Case worker has documented significant progress",
      "Mental health treatment compliance maintained"
    ],
    commonRequests: [
      "Increase visitation from [current schedule] to [requested schedule]",
      "Progress from supervised to unsupervised visits",
      "Allow overnight visits on weekends",
      "Extend visit duration from [X] hours to [Y] hours"
    ]
  },
  
  motionModification: {
    title: "Motion to Modify Case Plan",
    commonFacts: [
      "Completed required services ahead of schedule",
      "Changed circumstances warrant plan modification",
      "Current plan requirements no longer necessary",
      "Additional services would be beneficial",
      "Employment or housing situation has improved"
    ],
    commonRequests: [
      "Modify case plan to reflect completed services",
      "Reduce frequency of required drug testing",
      "Add new services to case plan",
      "Extend case plan timeline for additional services"
    ]
  },
  
  motionReunification: {
    title: "Motion for Reunification",
    commonFacts: [
      "Substantial compliance with all case plan requirements",
      "Completed all court-ordered services",
      "Maintained stable housing suitable for child",
      "Demonstrated ability to provide safe environment",
      "Strong parent-child bond maintained through visits",
      "Support system in place for ongoing stability"
    ],
    commonRequests: [
      "Order reunification of child with parent",
      "Dismiss dependency petition",
      "Continue case management services voluntarily",
      "Establish transition plan for reunification"
    ]
  }
};

// Florida Statute References (Common in Dependency Cases)
export const FLORIDA_STATUTES = {
  chapter39: {
    title: "Proceedings Related to Children",
    sections: {
      "39.001": "Purposes and intent; liberal construction",
      "39.01": "Definitions",
      "39.401": "Taking a child into custody; law enforcement officers and authorized agents",
      "39.402": "Placement in a shelter",
      "39.501": "Petition for dependency; contents",
      "39.506": "Arraignment of parent or legal custodian",
      "39.521": "Disposition hearings; powers of disposition",
      "39.621": "Permanency hearings",
      "39.806": "Grounds for termination of parental rights"
    }
  }
};

// Court Filing Information
export const COURT_INFO = {
  filingFee: "$0", // Dependency cases typically have no filing fee for parents
  serviceRequired: [
    "Department of Children and Families",
    "Guardian Ad Litem",
    "Child's Attorney (if appointed)",
    "Other parties as ordered by court"
  ],
  filingDeadlines: {
    responseToMotion: "20 days",
    appealDeadline: "30 days from final order",
    permanencyHearing: "Within 12 months of child's removal"
  }
};

// Contact Information (Update with your local court info)
export const LOCAL_RESOURCES = {
  courtClerk: {
    name: "Clerk of Court, " + YOUR_CASE_INFO.county,
    address: "Court Address, " + YOUR_CASE_INFO.county + ", FL",
    phone: "(555) 123-4567", // Replace with actual clerk phone
    website: "https://www.yourclerk.com" // Replace with actual website
  },
  
  legalAid: {
    name: "Legal Aid of Central Florida", // Update for your area
    phone: "1-800-405-1417",
    website: "https://www.legalaidcfl.org"
  },
  
  parentAttorneyProgram: {
    name: "Parent Attorney Program - " + YOUR_CASE_INFO.circuit,
    phone: "(555) 123-4567" // Replace with actual number
  }
};

// Export everything as default for easy importing
export default {
  YOUR_CASE_INFO,
  CASE_ID,
  DOCUMENT_TEMPLATES,
  FLORIDA_STATUTES,
  COURT_INFO,
  LOCAL_RESOURCES
};