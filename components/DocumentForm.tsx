'use client';

import React, { useState } from 'react';
import { FileText, Send, Download, Copy, Check } from 'lucide-react';

interface FormData {
  documentType: 'Motion' | 'Affidavit' | 'Objection';
  modelName: 'gemini-pro' | 'gpt-4o';
  caseName: string;
  caseNumber: string;
  reason: string;
  outcome: string;
}

interface GeneratedDocument {
  draft: string;
  caseInfo: {
    caseNumber: string;
    caseName: string;
    circuit: string;
    county: string;
  };
  documentType: string;
  generatedAt: string;
}

export default function DocumentForm() {
  const [formData, setFormData] = useState<FormData>({
    documentType: 'Motion',
    modelName: 'gpt-4o',
    caseName: 'Your Name v. Department of Children and Families',
    caseNumber: '2024-DP-000587-XXDP-BC',
    reason: '',
    outcome: ''
  });
  
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reason.trim() || !formData.outcome.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setGeneratedDoc(data);
      } else {
        alert('Failed to generate document: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedDoc) return;
    
    try {
      await navigator.clipboard.writeText(generatedDoc.draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    if (!generatedDoc) return;
    
    const blob = new Blob([generatedDoc.draft], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.documentType}_${formData.caseNumber.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-header text-charcoal-navy">Document Drafting</h1>
          <p className="text-slate-gray mt-2">Generate professional legal documents with AI assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="card">
            <h2 className="section-subheader">Document Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Document Type</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => handleInputChange('documentType', e.target.value as FormData['documentType'])}
                    className="form-input w-full"
                  >
                    <option value="Motion">Motion</option>
                    <option value="Affidavit">Affidavit</option>
                    <option value="Objection">Objection</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">AI Model</label>
                  <select
                    value={formData.modelName}
                    onChange={(e) => handleInputChange('modelName', e.target.value as FormData['modelName'])}
                    className="form-input w-full"
                  >
                    <option value="gpt-4o">GPT-4o (Recommended)</option>
                    <option value="gemini-pro">Gemini Pro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Case Name</label>
                <input
                  type="text"
                  value={formData.caseName}
                  onChange={(e) => handleInputChange('caseName', e.target.value)}
                  className="form-input w-full"
                  placeholder="Your Name v. Department of Children and Families"
                />
              </div>

              <div>
                <label className="form-label">Case Number</label>
                <input
                  type="text"
                  value={formData.caseNumber}
                  onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                  className="form-input w-full"
                  placeholder="2024-DP-000587-XXDP-BC"
                />
              </div>

              <div>
                <label className="form-label">Facts/Reason *</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  rows={6}
                  className="form-input w-full"
                  placeholder="Describe the facts, circumstances, or reasons supporting your document..."
                  required
                />
              </div>

              <div>
                <label className="form-label">Requested Outcome/Relief *</label>
                <textarea
                  value={formData.outcome}
                  onChange={(e) => handleInputChange('outcome', e.target.value)}
                  rows={4}
                  className="form-input w-full"
                  placeholder="What specific action or relief do you want from the court?"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !formData.reason.trim() || !formData.outcome.trim()}
                className="w-full button-primary flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Generate Document
                  </>
                )}
              </button>
            </form>

            {/* Template Suggestions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-charcoal-navy mb-4">Common Templates</h3>
              <div className="grid gap-2">
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      documentType: 'Motion',
                      reason: 'Successfully completed parenting classes, secured stable housing, completed substance abuse treatment, maintained consistent employment, and demonstrated positive interaction during supervised visits',
                      outcome: 'Grant increased visitation time with the minor children'
                    }));
                  }}
                  className="text-left p-3 bg-dusty-mauve/10 hover:bg-dusty-mauve/20 rounded-lg transition-colors"
                >
                  <span className="font-medium text-dusty-mauve">Motion for Increased Visitation</span>
                  <p className="text-sm text-slate-gray mt-1">Standard template for requesting more visitation time</p>
                </button>
                
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      documentType: 'Motion',
                      reason: 'Substantial compliance with case plan requirements, completion of all required services, demonstrated ability to provide safe environment, and strong parent-child relationship maintained',
                      outcome: 'Grant reunification of the minor children with the parent'
                    }));
                  }}
                  className="text-left p-3 bg-olive-emerald/10 hover:bg-olive-emerald/20 rounded-lg transition-colors"
                >
                  <span className="font-medium text-olive-emerald">Motion for Reunification</span>
                  <p className="text-sm text-slate-gray mt-1">Template for requesting return of children</p>
                </button>
              </div>
            </div>
          </div>

          {/* Generated Document */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-subheader">Generated Document</h2>
              {generatedDoc && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-2 text-dusty-mauve hover:bg-dusty-mauve/10 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 py-2 text-olive-emerald hover:bg-olive-emerald/10 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              )}
            </div>

            {generatedDoc ? (
              <div className="space-y-4">
                {/* Document Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-slate-gray">Type:</span> {generatedDoc.documentType}
                    </div>
                    <div>
                      <span className="font-medium text-slate-gray">Generated:</span> {new Date(generatedDoc.generatedAt).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium text-slate-gray">Case:</span> {generatedDoc.caseInfo.caseNumber}
                    </div>
                    <div>
                      <span className="font-medium text-slate-gray">Circuit:</span> {generatedDoc.caseInfo.circuit}
                    </div>
                  </div>
                </div>

                {/* Document Content */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                    {generatedDoc.draft}
                  </pre>
                </div>

                {/* Disclaimer */}
                <div className="bg-terracotta/10 border border-terracotta/20 rounded-lg p-4">
                  <p className="text-sm text-charcoal-navy">
                    <strong>Important:</strong> This is a draft document generated by AI. Please review carefully, 
                    make necessary corrections, and consider consulting with a legal professional before filing 
                    with the court.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Generated document will appear here</p>
                <p className="text-sm text-gray-400">Fill out the form and click &quot;Generate Document&quot; to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}