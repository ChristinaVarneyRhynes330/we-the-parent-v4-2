'use client';

import { useState } from 'react';
import { FileText, Download, Copy, Eye, Loader2 } from 'lucide-react';

// Your personal case information - pre-filled for convenience
const YOUR_CASE_INFO = {
  caseNumber: "2024-DP-000587-XXDP-BC",
  caseName: "Your Name v. Department of Children and Families",
  circuit: "5th Judicial Circuit",
  county: "Lake County",
  division: "Dependency Division"
};

// Common templates for quick selection
const QUICK_TEMPLATES = {
  visitation: {
    title: "Motion for Increased Visitation",
    reason: "I have successfully completed all required parenting classes, secured stable housing, maintained consistent employment, and demonstrated positive interaction during all supervised visits. My case worker has noted significant progress in my case plan compliance.",
    outcome: "Request the Court to increase my visitation schedule from supervised visits twice per week to unsupervised visits three times per week, with the goal of progressing toward overnight visits."
  },
  modification: {
    title: "Motion to Modify Case Plan",
    reason: "Due to my completion of substance abuse treatment ahead of schedule and securing stable employment, I request modification of my case plan to reflect my changed circumstances and accelerated progress.",
    outcome: "Request the Court to modify my case plan to reduce the frequency of drug testing from twice weekly to once weekly, and to allow me to begin transitioning to unsupervised visits."
  },
  reunification: {
    title: "Motion for Reunification",
    reason: "I have substantially complied with all aspects of my case plan including: completion of parenting classes, securing stable housing and employment, completing substance abuse treatment, and maintaining positive visitation with my child.",
    outcome: "Request the Court to order reunification of my child with me and dismiss the dependency petition as I have demonstrated my ability to provide a safe and stable home environment."
  }
};

interface DocumentFormProps {
  onDocumentGenerated?: (document: string, info: any) => void;
}

const DocumentForm = ({ onDocumentGenerated }: DocumentFormProps) => {
  const [formData, setFormData] = useState({
    caseName: YOUR_CASE_INFO.caseName,
    caseNumber: YOUR_CASE_INFO.caseNumber,
    documentType: 'Motion' as 'Motion' | 'Affidavit' | 'Objection',
    reason: '',
    outcome: '',
    modelName: 'gpt-4o' as 'gpt-4o' | 'gemini-pro'
  });

  const [generatedDocument, setGeneratedDocument] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleTemplateSelect = (templateKey: keyof typeof QUICK_TEMPLATES) => {
    const template = QUICK_TEMPLATES[templateKey];
    setFormData(prev => ({
      ...prev,
      reason: template.reason,
      outcome: template.outcome
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear error when user types
  };

  const generateDocument = async () => {
    if (!formData.reason.trim() || !formData.outcome.trim()) {
      setError('Please fill in both the reason and outcome fields.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate document');
      }

      setGeneratedDocument(data.draft);
      setShowPreview(true);
      
      if (onDocumentGenerated) {
        onDocumentGenerated(data.draft, data.caseInfo);
      }

    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDocument);
    // You could add a toast notification here
  };

  const downloadDocument = () => {
    const blob = new Blob([generatedDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.documentType}_${formData.caseNumber}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-warm-ivory">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-header text-3xl text-charcoal-navy mb-2">Document Drafting</h1>
          <p className="text-slate-gray">Generate professional legal documents for your case</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="card">
            <h2 className="section-subheader">Document Information</h2>

            {/* Case Information (Pre-filled) */}
            <div className="bg-dusty-mauve/5 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-charcoal-navy mb-3">Your Case Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Case:</span> {YOUR_CASE_INFO.caseName}</p>
                <p><span className="font-medium">Number:</span> {YOUR_CASE_INFO.caseNumber}</p>
                <p><span className="font-medium">Court:</span> {YOUR_CASE_INFO.circuit}, {YOUR_CASE_INFO.county}</p>
              </div>
            </div>

            {/* Document Type Selection */}
            <div className="mb-6">
              <label className="form-label">Document Type</label>
              <select
                value={formData.documentType}
                onChange={(e) => handleInputChange('documentType', e.target.value)}
                className="form-input w-full"
              >
                <option value="Motion">Motion</option>
                <option value="Affidavit">Affidavit</option>
                <option value="Objection">Objection</option>
              </select>
            </div>

            {/* Quick Templates */}
            {formData.documentType === 'Motion' && (
              <div className="mb-6">
                <label className="form-label">Quick Templates (Optional)</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(QUICK_TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => handleTemplateSelect(key as keyof typeof QUICK_TEMPLATES)}
                      className="text-left p-3 border border-gray-200 rounded-lg hover:border-dusty-mauve hover:bg-dusty-mauve/5 transition-colors"
                    >
                      <div className="font-medium text-charcoal-navy">{template.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reason Field */}
            <div className="mb-6">
              <label className="form-label">
                {formData.documentType === 'Motion' ? 'Statement of Facts' :
                 formData.documentType === 'Affidavit' ? 'Facts to be Sworn' :
                 'Reason for Objection'}
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder={
                  formData.documentType === 'Motion' 
                    ? "Describe your progress, completed services, changed circumstances, etc."
                    : formData.documentType === 'Affidavit'
                    ? "State the facts you are swearing to under oath"
                    : "Explain the basis for your objection"
                }
                rows={6}
                className="form-input w-full"
              />
            </div>

            {/* Outcome Field */}
            <div className="mb-6">
              <label className="form-label">
                {formData.documentType === 'Motion' ? 'Relief Requested' :
                 formData.documentType === 'Affidavit' ? 'Purpose of Affidavit' :
                 'Legal Authority'}
              </label>
              <textarea
                value={formData.outcome}
                onChange={(e) => handleInputChange('outcome', e.target.value)}
                placeholder={
                  formData.documentType === 'Motion'
                    ? "What specific action do you want the court to take?"
                    : formData.documentType === 'Affidavit'
                    ? "What is this affidavit being used to support or prove?"
                    : "What legal rule, statute, or case law supports your objection?"
                }
                rows={4}
                className="form-input w-full"
              />
            </div>

            {/* AI Model Selection */}
            <div className="mb-6">
              <label className="form-label">AI Model</label>
              <select
                value={formData.modelName}
                onChange={(e) => handleInputChange('modelName', e.target.value)}
                className="form-input w-full"
              >
                <option value="gpt-4o">GPT-4o (Recommended)</option>
                <option value="gemini-pro">Gemini Pro</option>
              </select>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-garnet/10 border border-garnet/20 rounded-lg">
                <p className="text-garnet text-sm">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateDocument}
              disabled={isGenerating || !formData.reason.trim() || !formData.outcome.trim()}
              className="w-full button-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Document...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Generate {formData.documentType}
                </>
              )}
            </button>
          </div>

          {/* Preview Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-subheader mb-0">Document Preview</h2>
              {generatedDocument && (
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="button-tertiary flex items-center"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={downloadDocument}
                    className="button-tertiary flex items-center"
                    title="Download document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {generatedDocument ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-96 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono text-charcoal-navy leading-relaxed">
                  {generatedDocument}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center min-h-96 flex flex-col items-center justify-center">
                <Eye className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">Document preview will appear here</p>
                <p className="text-sm text-gray-400">Fill out the form and click "Generate" to create your document</p>
              </div>
            )}

            {/* Document Tips */}
            {generatedDocument && (
              <div className="mt-6 p-4 bg-olive-emerald/10 border border-olive-emerald/20 rounded-lg">
                <h4 className="font-semibold text-olive-emerald mb-2">Next Steps:</h4>
                <ul className="text-sm text-charcoal-navy space-y-1">
                  <li>• Review the document carefully for accuracy</li>
                  <li>• Print and sign the document</li>
                  <li>• File the original with the court clerk</li>
                  <li>• Serve copies on all parties (DCF, GAL, etc.)</li>
                  <li>• Complete and file Certificate of Service</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-8 p-6 bg-slate-gray/10 border border-slate-gray/20 rounded-lg">
          <h3 className="font-semibold text-charcoal-navy mb-2">⚖️ Legal Disclaimer</h3>
          <p className="text-sm text-slate-gray">
            This tool provides general information and document templates only. It does not constitute legal advice and cannot replace the guidance of a qualified attorney. The generated documents should be reviewed carefully before filing. Laws and procedures may vary, and you should verify all information with current statutes and local court rules. We The Parent™ is not responsible for the accuracy or effectiveness of generated documents.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentForm;