import { NextResponse } from 'next/server';

export async function GET() {
  const mockGuideData = {
    topics: [
      {
        id: 1,
        title: "Understanding Parental Rights",
        content: `### Understanding Your Parental Rights in Florida
- **Constitutional Basis:** Your rights as a parent are protected by the U.S. Constitution (14th Amendment Due Process Clause) and Florida state law.
- **Key Principles:** These rights include the right to raise your child without undue state interference, make decisions about their education and healthcare, and have a meaningful relationship with them.
- **In a Dependency Case:** While a dependency case is active, some of your rights may be temporarily restricted by court order. The goal is reunification, and fulfilling your case plan is the primary path to restoring your full rights.`,
        relatedLinks: [
          { title: "Florida Statute § 39", url: "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0039/0039.html" },
          { title: "Florida Supreme Court on Parental Rights", url: "https://www.floridabar.org/" }
        ]
      },
      {
        id: 2,
        title: "Filing a Motion",
        content: `### Step-by-Step Guide to Filing a Motion
1.  **Drafting:** Use the Motion Drafting tool to create your document. Ensure it includes the proper case name, number, and court caption.
2.  **Formatting:** Check the document for compliance with Florida Rules of Juvenile Procedure (e.g., margins, font size).
3.  **Signing:** Print and sign the document.
4.  **Filing:** File the original document with the clerk of the court.
5.  **Service:** Deliver a copy to all parties involved in the case (e.g., opposing counsel, Guardian Ad Litem, DCF). You must fill out and file a Certificate of Service.`,
        relatedLinks: [
          { title: "Florida Courts E-Filing Portal", url: "https://www.myflcourtaccess.com/" }
        ]
      },
      {
        id: 3,
        title: "Preparing for a Court Hearing",
        content: `### A Checklist for Your Court Hearing
- **Appearance:** Arrive on time, dress professionally, and be respectful to everyone in the courtroom.
- **Documents:** Bring all relevant documents, including your motions, affidavits, and evidence.
- **What to Say:** Be prepared to state your name, case number, and the purpose of your appearance. Speak clearly and address the judge as "Your Honor."`,
        relatedLinks: [
          { title: "Courtroom Etiquette Guide", url: "https://www.floridabar.org/" }
        ]
      }
    ],
  };

  return NextResponse.json(mockGuideData);
}