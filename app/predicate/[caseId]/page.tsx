'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { usePredicates, Predicate } from '@/hooks/usePredicates';
import { useDocuments, UploadedDoc } from '@/hooks/useDocuments';

export default function PredicateEvidenceLinkerPage() {
  const params = useParams();
  const caseId = params.caseId as string;

  const { predicates, loading: loadingPredicates, error: errorPredicates, linkEvidence } = usePredicates(caseId);
  const { documents: evidence, loading: loadingEvidence, error: errorEvidence } = useDocuments(caseId);

  const [selectedPredicate, setSelectedPredicate] = useState<Predicate | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<UploadedDoc | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  const handleLink = async () => {
    if (selectedPredicate && selectedEvidence) {
      setIsLinking(true);
      const result = await linkEvidence(selectedPredicate.id, selectedEvidence.id);
      if (result.success) {
        alert('Evidence linked successfully!');
      } else {
        alert(`Failed to link evidence: ${result.message}`);
      }
      setIsLinking(false);
      setSelectedEvidence(null); // Reset evidence selection
    } else {
      alert('Please select a predicate and a piece of evidence.');
    }
  };

  const loading = loadingPredicates || loadingEvidence;
  const error = errorPredicates || errorEvidence;

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Link Evidence to Predicates</h1>
        <p className="text-gray-600">Select a predicate and a piece of evidence to create a link.</p>
      </header>
      
      {loading && <div className="text-center"><p>Loading data...</p></div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Predicates List */}
          <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Predicates</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {predicates.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPredicate(p)}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-150 ${
                    selectedPredicate?.id === p.id ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 hover:bg-blue-100'
                  }`}
                >
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-sm opacity-80">{p.description}</p>
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
                    selectedEvidence?.id === e.id ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 hover:bg-green-100'
                  }`}
                >
                  <p className="font-semibold">{e.file_name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Linking Action Panel */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Selected Predicate</h3>
              <p className="text-blue-600 font-bold">{selectedPredicate?.title || 'None'}</p>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Selected Evidence</h3>
              <p className="text-green-600 font-bold">{selectedEvidence?.file_name || 'None'}</p>
            </div>
            <button
              onClick={handleLink}
              disabled={!selectedPredicate || !selectedEvidence || isLinking}
              className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
            >
              {isLinking ? 'Linking...' : 'Link Selected Items'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
