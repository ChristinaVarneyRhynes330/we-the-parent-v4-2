import React from 'react';
import { Copy } from 'lucide-react';

const MotionDrafting = ({ motionFormData, setMotionFormData, handleDraftingSubmit, draftLoading, draftError, aiDraft, handleCopy }) => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Draft a Motion</h1>
      <p className="text-gray-600 mb-8">Fill out the form below and the AI will generate a draft for your Motion for Increased Visitation. **Remember to review it carefully before filing.**</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleDraftingSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
              <label htmlFor="caseName" className="block text-sm font-medium text-gray-700">Case Name</label>
              <input 
                type="text" 
                name="caseName" 
                id="caseName" 
                value={motionFormData.caseName} 
                onChange={(e) => setMotionFormData({...motionFormData, caseName: e.target.value})} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" 
                required 
              />
            </div>
            <div>
              <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700">Case Number</label>
              <input 
                type="text" 
                name="caseNumber" 
                id="caseNumber" 
                value={motionFormData.caseNumber} 
                onChange={(e) => setMotionFormData({...motionFormData, caseNumber: e.target.value})} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" 
                required 
              />
            </div>
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Motion (be specific)</label>
              <textarea 
                name="reason" 
                id="reason" 
                rows="5" 
                value={motionFormData.reason} 
                onChange={(e) => setMotionFormData({...motionFormData, reason: e.target.value})} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" 
                required 
              ></textarea>
            </div>
            <div>
              <label htmlFor="outcome" className="block text-sm font-medium text-gray-700">Desired Outcome</label>
              <input 
                type="text" 
                name="outcome" 
                id="outcome" 
                value={motionFormData.outcome} 
                onChange={(e) => setMotionFormData({...motionFormData, outcome: e.target.value})} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400" 
              disabled={draftLoading}
            >
              {draftLoading ? 'Generating...' : 'Generate Draft'}
            </button>
          </form>
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md min-h-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">AI-Generated Draft</h2>
              {aiDraft && (
                <button 
                  onClick={handleCopy} 
                  className="p-2 rounded-md hover:bg-gray-100 text-gray-600" 
                  aria-label="Copy draft to clipboard"
                >
                  <Copy size={20} />
                </button>
              )}
            </div>
            {draftError && <p className="text-red-500">{draftError}</p>}
            {draftLoading && <p className="text-gray-500">Generating your draft...</p>}
            {aiDraft && (
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200">{aiDraft}</pre>
            )}
            {!aiDraft && !draftLoading && !draftError && (
              <p className="text-gray-400 italic">Your draft will appear here after you submit the form.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotionDrafting;