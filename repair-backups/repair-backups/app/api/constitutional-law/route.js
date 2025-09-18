import { NextResponse } from 'next/server';

export async function GET() {
  const mockConstitutionalData = {
    precedents: [
      {
        title: "Troxel v. Granville, 530 U.S. 57 (2000)",
        summary: "This case addresses the fundamental right of parents to make decisions concerning the care, custody, and control of their children. The Supreme Court affirmed the 'preeminent' role of parents in child-rearing and struck down a state law that gave third parties visitation rights over parental objections.",
        relevance: "High",
      },
      {
        title: "Santosky v. Kramer, 455 U.S. 745 (1982)",
        summary: "The Supreme Court held that the Due Process Clause of the Fourteenth Amendment requires states to support their allegations of parental unfitness with 'clear and convincing evidence' before parental rights can be terminated.",
        relevance: "High",
      },
      {
        title: "Lassiter v. Department of Social Services, 452 U.S. 18 (1981)",
        summary: "This case held that the Due Process Clause does not require the appointment of counsel for indigent parents in every parental rights termination proceeding, but courts must decide on a case-by-case basis.",
        relevance: "Medium",
      },
      {
        title: "Washington v. Glucksberg, 521 U.S. 702 (1997)",
        summary: "The court's method for determining if a right is 'fundamental' under the Due Process Clause requires a 'careful description' of the asserted right and an examination of whether it is 'deeply rooted in this Nation's history and tradition.' This is a foundational case for analyzing new parental rights claims.",
        relevance: "High",
      },
    ],
  };

  return NextResponse.json(mockConstitutionalData);
}