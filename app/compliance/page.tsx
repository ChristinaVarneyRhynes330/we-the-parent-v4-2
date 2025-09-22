'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, FileText } from 'lucide-react';

export default function CompliancePage() {
  const [documentType, setDocumentType] = useState('Motion');
  const [documentText, setDocumentText] = useState('');
  const [complianceReport, setComplianceReport] = useState('');
  const [checking, setChecking] = useState(false);

  const checkCompliance = async () => {
    if (!documentText.trim()) {
      alert('Please enter document text to check');
      return;
    }

    setChecking(true);
    try {
      const response = await fetch('/api/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType, draft: documentText })
      });

      const data = await response.json();
      if (response.ok) {
        setComplianceReport(data.report);
      } else {
        alert('Compliance check failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error checking compliance:', error);
      alert('Compliance check failed');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-header text-charcoal-navy">Compliance Check</h1>
          <p className="text-slate-gray mt-2">Verify your documents meet Florida court requirements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="section-subheader">Document to Check</h2>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Document Type</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="form-input w-full"
                >
                  <option value="Motion">Motion</option>
                  <option value="Affidavit">Affidavit</option>
                  <option value="Objection">Objection</option>
                </select>
              </div>

              <div>
                <label className="form-label">Document Text</label>
                <textarea
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste your document text here for compliance checking..."
                  rows={12}
                  className="form-input w-full"
                />
              </div>

              <button
                onClick={checkCompliance}
                disabled={checking}
                className="w-full button-primary flex items-center justify-center gap-2"
              >
                {checking ? (
                  'Checking Compliance...'
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Check Compliance
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="section-subheader">Compliance Report</h2>
            {complianceReport ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">{complianceReport}</pre>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Compliance report will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}