'use client';

import React, { useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';
import { useEmergencyMotion } from '@/hooks/useEmergencyMotion';

export default function EmergencyPage() {
  const { generateEmergencyMotion, isGenerating, draft, error } = useEmergencyMotion();
  const [formData, setFormData] = useState({
    caseName: 'Your Name v. Department of Children and Families',
    caseNumber: '2024-DP-000587-XXDP-BC',
    reason: '',
    outcome: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateEmergencyMotion = () => {
    if (!formData.reason || !formData.outcome) {
      alert('Please fill in all required fields');
      return;
    }

    generateEmergencyMotion(formData);
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
                <label htmlFor="caseName" className="form-label">Case Name</label>
                <input
                  id="caseName"
                  type="text"
                  value={formData.caseName}
                  onChange={(e) => handleInputChange('caseName', e.target.value)}
                  className="form-input w-full"
                />
              </div>

              <div>
                <label htmlFor="caseNumber" className="form-label">Case Number</label>
                <input
                  id="caseNumber"
                  type="text"
                  value={formData.caseNumber}
                  onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                  className="form-input w-full"
                />
              </div>

              <div>
                <label htmlFor="reason" className="form-label">Emergency Situation</label>
                <textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Describe the emergency situation requiring immediate court intervention..."
                  rows={6}
                  className="form-input w-full"
                />
              </div>

              <div>
                <label htmlFor="outcome" className="form-label">Requested Relief</label>
                <textarea
                  id="outcome"
                  value={formData.outcome}
                  onChange={(e) => handleInputChange('outcome', e.target.value)}
                  placeholder="What specific emergency action do you need from the court?"
                  rows={4}
                  className="form-input w-full"
                />
              </div>

              <button
                onClick={handleGenerateEmergencyMotion}
                disabled={isGenerating}
                className="w-full button-primary flex items-center justify-center gap-2"
              >
                {isGenerating ? (
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
                placeholder="Emergency motion will appear here..."
                className="w-full h-96 p-4 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-charcoal-navy focus:ring-brand focus:border-brand"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}