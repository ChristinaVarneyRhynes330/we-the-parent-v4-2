'use client';

import React, { useState } from 'react';
import { Download, Clipboard, Book, ChevronDown } from 'lucide-react';
import { useCase } from '@/contexts/CaseContext'; // Import the useCase hook
import { useDraft } from '@/hooks/useDraft'; // Import the useDraft hook

// Mock data for document templates
const documentTemplates = [
  { id: 'motion-to-compel-discovery', name: 'Motion to Compel Discovery' },
  { id: 'financial-affidavit', name: 'Financial Affidavit' },
  { id: 'parenting-plan', name: 'Parenting Plan' },
  { id: 'notice-of-hearing', name: 'Notice of Hearing' },
];

export default function DraftPage() {
  const { activeCase } = useCase(); // Get the active case
  const { generateDraft, isGenerating, draft, error } = useDraft();
  const [selectedTemplate, setSelectedTemplate] = useState(documentTemplates[0].id);
  const [userInstructions, setUserInstructions] = useState(''); // Add state for user instructions

  const handleGenerateDraft = () => {
    if (!activeCase) {
      alert('Please select a case first.');
      return;
    }

    generateDraft({ 
      templateId: selectedTemplate, 
      caseId: activeCase.id, 
      userInstructions 
    });
  };

  const handleCopyToClipboard = () => {
    if (draft) {
      navigator.clipboard.writeText(draft);
      alert('Draft copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (draft) {
      const blob = new Blob([draft], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-header text-charcoal-navy">Draft Generator</h1>
            <p className="text-slate-gray mt-2">Select a template and provide instructions to generate a new legal document.</p>
          </div>
        </div>

        <div className="card mb-8 space-y-4">
          <div>
            <label htmlFor="template-select" className="block text-sm font-medium text-slate-gray mb-2">
              Document Template
            </label>
            <div className="relative">
              <select
                id="template-select"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="input-field w-full appearance-none"
                disabled={isGenerating}
              >
                {documentTemplates.map(template => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-gray pointer-events-none" />
            </div>
          </div>
          <div>
            <label htmlFor="user-instructions" className="block text-sm font-medium text-slate-gray mb-2">
              Specific Instructions (Optional)
            </label>
            <textarea
              id="user-instructions"
              rows={3}
              value={userInstructions}
              onChange={(e) => setUserInstructions(e.target.value)}
              className="input-field w-full"
              placeholder="e.g., 'Cite the attached affidavit from John Doe...'"
              disabled={isGenerating}
            />
          </div>
          <div className="text-right">
            <button
              onClick={handleGenerateDraft}
              disabled={isGenerating || !activeCase}
              className="button-primary flex items-center justify-center gap-2 sm:self-end"
            >
              <Book className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Generate Draft'}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-subheader">Generated Draft</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyToClipboard}
                disabled={!draft || isGenerating}
                className="button-secondary p-2"
                title="Copy to Clipboard"
              >
                <Clipboard className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                disabled={!draft || isGenerating}
                className="button-secondary p-2"
                title="Download as .txt"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isGenerating ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            </div>
          ) : (
            <textarea
              readOnly
              value={draft || error?.message || ''}
              placeholder="Your generated document will appear here..."
              className="w-full h-96 p-4 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-charcoal-navy focus:ring-brand focus:border-brand"
            />
          )}
        </div>
      </div>
    </div>
  );
}