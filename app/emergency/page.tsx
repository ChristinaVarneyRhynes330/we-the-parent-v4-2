'use client';

import React, { useState } from 'react';
import { AlertTriangle, FileText, Send } from 'lucide-react';

export default function EmergencyPage() {
  const [formData, setFormData] = useState({
    caseName: 'Your Name v. Department of Children and Families',
    caseNumber: '2024-DP-000587-XXDP-BC',
    reason: '',
    outcome: ''
  });
  const [generatedMotion, setGeneratedMotion] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateEmergencyMotion = async () => {
    if (!formData.reason || !formData.outcome) {
      alert('Please fill in all required fields');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/emergency-motion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedMotion(data.draft);
      } else {
        alert('Failed to generate motion: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating motion:', error);
      alert('Failed to generate motion');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-8 h-8 text-garnet" />
            <h1 className="text-4xl font-header text-charcoal-navy">Emergency Motion</h1>
          </div>
          <p className="text-slate-gray">Generate urgent motions for time-sensitive situations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="section-subheader">Emergency Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Case Name</label>
                <input
                  type="text"
                  value={formData.caseName}
                  onChange={(e) => handleInputChange('caseName', e.target.value)}
                  className="form-input w-full"
                />
              </div>

              <div>
                <label className="form-label">Case Number</label>
                <input
                  type="text"
                  value={formData.caseNumber}
                  onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                  className="form-input w-full"
                />
              </div>

              <div>
                <label className="form-label">Emergency Situation</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Describe the emergency situation requiring immediate court intervention..."
                  rows={6}
                  className="form-input w-full"
                />
              </div>

              <div>
                <label className="form-label">Requested Relief</label>
                <textarea
                  value={formData.outcome}
                  onChange={(e) => handleInputChange('outcome', e.target.value)}
                  placeholder="What specific emergency action do you need from the court?"
                  rows={4}
                  className="form-input w-full"
                />
              </div>

              <button
                onClick={generateEmergencyMotion}
                disabled={generating}
                className="w-full button-primary flex items-center justify-center gap-2"
              >
                {generating ? (
                  'Generating...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Generate Emergency Motion
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="section-subheader">Generated Motion</h2>
            {generatedMotion ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">{generatedMotion}</pre>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Emergency motion will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}