// File: app/predicate/[caseId]/page.tsx (Full Content Replacement)

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { usePredicates, Predicate } from '@/hooks/usePredicates';
// FIX: Corrected imports from useDocuments hook (Error 18)
import { useDocuments, UploadedDoc } from '@/hooks/useDocuments'; 
import { FL_FOUNDATION_SCRIPTS, FoundationScript } from '@/lib/legal/predicates-fl';
// -----------------------------------------------------------

type PredicateDisplay = FoundationScript; // Temporary alias for static data

export default function PredicateEvidenceLinkerPage() {
  const params = useParams();
  const caseId = params.caseId as string;

  // --- TEMPORARILY REPLACE HOOK WITH STATIC DATA ---
  // const { predicates, loading: loadingPredicates, error: errorPredicates, linkEvidence } = usePredicates(caseId);
  const predicates: PredicateDisplay[] = FL_FOUNDATION_SCRIPTS;
  const loadingPredicates = false; // Static data loads instantly
  const errorPredicates = null;
  // -------------------------------------------------
  
  // FIX: Destructure as isLoading to match the hook's export (Error 26)
  const { documents: evidence, isLoading: loadingEvidence, error: errorEvidence } = useDocuments(caseId);

  const [selectedPredicate, setSelectedPredicate] = useState<PredicateDisplay | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<UploadedDoc | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  const handleLink = async () => {
    if (selectedPredicate && selectedEvidence) {
      setIsLinking(true);
      
      // --- SIMULATED LINKING LOGIC ---
      console.log(`Simulating linking of: ${selectedPredicate.evidenceType} to ${selectedEvidence.file_name}`);
      await new Promise(resolve => setTimeout(resolve, 500)); 
      alert(`SIMULATED: Ready to use the script for: ${selectedPredicate.evidenceType}`);
      // --------------------------------

      setIsLinking(false);
      setSelectedEvidence(null); 
    } else {
      alert('Please select a predicate and a piece of evidence.');
    }
  };

  const loading = loadingPredicates || loadingEvidence;
  // FIX: Ensure error is checked against actual Error object
  const error = errorPredicates || errorEvidence;

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Predicate Builder & Evidence Foundation</h1>
        <p className="text-gray-600">Select an evidence type to view the exact courtroom script (Foundation Questions).</p>
      </header>
      
      {loading && <div className="text-center"><p>Loading case data...</p></div>}
      {/* FIX: Properly render the Error message property (Error 28) */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error.message}</span>
      </div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Predicates List */}
          <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Evidence Types (Foundation Scripts)</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {predicates.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPredicate(p)}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-150 ${
                    selectedPredicate?.id === p.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-blue-100'
                  }`}
                >
                  <h3 className="font-bold">{p.evidenceType}</h3>
                  <p className="text-sm opacity-80 mt-1">First Question: {p.questions[0]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence List */}
          <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Available Evidence</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {evidence.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setSelectedEvidence(e)}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-150 ${
                    selectedEvidence?.id === e.id ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 hover:bg-green-100'
                  }`}
                >
                  <p className="font-semibold">{e.file_name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Foundation Script & Linking Action Panel */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Courtroom Script</h2>

            {selectedPredicate ? (
              <>
                <div className="mb-4 p-3 border-l-4 border-blue-500 bg-blue-50">
                  <h3 className="text-lg font-semibold text-blue-800">Foundation: {selectedPredicate.evidenceType}</h3>
                  {selectedPredicate.flStatute && <p className="text-sm text-blue-600">Rule/Statute: {selectedPredicate.flStatute}</p>}
                </div>
                
                <ol className="list-decimal list-inside space-y-2 text-gray-700 flex-grow">
                  {selectedPredicate.questions.map((q, index) => (
                    <li key={index} className="pl-2">
                      <span className="font-medium">{q}</span>
                    </li>
                  ))}
                </ol>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Selected Evidence for Link</h3>
                  <p className="text-green-600 font-bold mb-4">{selectedEvidence?.file_name || 'No Evidence Selected'}</p>

                  <button
                    onClick={handleLink}
                    disabled={!selectedPredicate || !selectedEvidence || isLinking}
                    className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                  >
                    {isLinking ? 'Simulate Link...' : 'Simulate Link and View Script'}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 flex-grow flex items-center justify-center">Select an evidence type to view the admissibility script.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}