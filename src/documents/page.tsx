// src/app/documents/page.tsx

'use client';

import UploadForm from '@/components/UploadForm';
import DocumentCard from '@/components/DocumentCard';

type DocumentStatus = 'filed' | 'review' | 'draft';

type Document = {
  title: string;
  status: DocumentStatus;
  lastEdited: string;
};

export default function DocumentCenterPage() {
  const documents: Document[] = [
    { title: 'Motion to Dismiss', status: 'filed', lastEdited: 'Today' },
    { title: 'Affidavit of Support', status: 'review', lastEdited: '2 days ago' },
    { title: 'Objection Draft', status: 'draft', lastEdited: '3 days ago' },
  ];

  return (
    <main className="bg-warm-ivory text-charcoal-navy font-body min-h-screen px-6 py-10 space-y-10">
      <header className="text-center">
        <h1 className="text-4xl font-header text-dusty-mauve mb-2">Your Legal Documents</h1>
        <p className="text-slate-gray text-lg max-w-2xl mx-auto">
          Upload, organize, and review your case files. Each document is tagged with its current status and last edited date.
        </p>
      </header>

      <section>
        <UploadForm />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc, index) => (
          <DocumentCard
            key={index}
            title={doc.title}
            status={doc.status}
            lastEdited={doc.lastEdited}
          />
        ))}
      </section>

      <footer className="text-center text-sm text-slate-gray mt-12">
        Documents are stored securely and emotionally tagged for clarity. You’re not just filing paperwork—you’re building your case with intention.
      </footer>
    </main>
  );
}