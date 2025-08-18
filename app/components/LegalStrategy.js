import React, { useState } from 'react';
import { Gavel, Lightbulb, CheckCircle } from 'lucide-react';

const LegalStrategy = ({ currentCase, showSuccessNotification }) => {
  const [strategyFormData, setStrategyFormData] = useState({
    caseType: '',
    keyFacts: '',
    desiredOutcome: '',
    opposingStance: '',
    availableEvidence: '',
    relevantDates: '',
  });
  const [aiStrategy, setAiStrategy] = useState(null);
  const [strategyLoading, setStrategyLoading] = useState(false);
  const [strategyError, setStrategyError] = useState(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setStrategyFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateStrategy = async (e) => {
    e.preventDefault();
    setStrategyLoading(true);
    setStrategyError(null);
    setAiStrategy(null);

    try {
      const response = await fetch('/api/strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...strategyFormData, caseNumber: currentCase.number }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate legal strategy');
      }

      const data = await response.json();
      setAiStrategy(data.strategy);
      showSuccessNotification('Legal strategy generated successfully!');
    } catch (error) {
      setStrategyError(error.message);
    } finally {
      setStrategyLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Legal Strategy Generator</h1>
      <p className="text-gray-600 mb-8">Leverage AI to develop comprehensive legal strategies for your case. Fill out the details below to get started.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleGenerateStrategy} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
              <label htmlFor="caseType" className="block text-sm font-medium text-gray-700">Case Type</label>
              <input type="text" name="caseType" id="caseType" value={strategyFormData.caseType} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label htmlFor="keyFacts" className="block text-sm font-medium text-gray-700">Key Facts (be detailed)</label>
              <textarea name="keyFacts" id="keyFacts" rows="6" value={strategyFormData.keyFacts} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required></textarea>
            </div>
            <div>
              <label htmlFor="desiredOutcome" className="block text-sm font-medium text-gray-700">Desired Outcome</label>
              <input type="text" name="desiredOutcome" id="desiredOutcome" value={strategyFormData.desiredOutcome} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label htmlFor="opposingStance" className="block text-sm font-medium text-gray-700">Opposing Party&apos;s Stance/Arguments</label>
              <textarea name="opposingStance" id="opposingStance" rows="3" value={strategyFormData.opposingStance} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
            </div>
            <div>
              <label htmlFor="availableEvidence" className="block text-sm font-medium text-gray-700">Available Evidence</label>
              <textarea name="availableEvidence" id="availableEvidence" rows="3" value={strategyFormData.availableEvidence} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
            </div>
            <div>
              <label htmlFor="relevantDates" className="block text-sm font-medium text-gray-700">Relevant Dates/Timeline</label>
              <input type="text" name="relevantDates" id="relevantDates" value={strategyFormData.relevantDates} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Next hearing: March 15, 2025" />
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400" 
              disabled={strategyLoading}
            >
              {strategyLoading ? 'Generating Strategy...' : 'Generate Legal Strategy'}
            </button>
          </form>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md min-h-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">AI-Generated Legal Strategy</h2>
            </div>
            {strategyError && <p className="text-red-500">Error: {strategyError}</p>}
            {strategyLoading && <p className="text-gray-500">Generating your legal strategy...</p>}
            {aiStrategy && (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200">{aiStrategy}</pre>
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
                  <h3 className="font-semibold text-lg">Important Disclaimer:</h3>
                  <p className="text-sm">This AI-generated legal strategy is for informational purposes only and does not constitute legal advice. Laws vary by jurisdiction and specific facts. Always consult with a qualified legal professional for advice tailored to your individual situation. Relying solely on AI-generated content for legal matters can have serious consequences.</p>
                </div>
              </div>
            )}
            {!aiStrategy && !strategyLoading && !strategyError && (
              <p className="text-gray-400 italic">Your comprehensive legal strategy will appear here after you submit the form.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalStrategy;