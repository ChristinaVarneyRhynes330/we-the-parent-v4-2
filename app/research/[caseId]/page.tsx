'use client';

import { useState } from 'react';
import { useResearch, ResearchSource } from '@/hooks/useResearch';
import { formatBluebookCitation } from '@/lib/research/bluebook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, BookOpen } from 'lucide-react';

// Main component for the Research page
const ResearchPage = ({ params }: { params: { caseId: string } }) => {
  const [query, setQuery] = useState('');
  const { performResearch, researchResult, isLoading, error } = useResearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    performResearch({ query, caseId: params.caseId });
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Legal Research Assistant</h1>
        <p className="text-gray-600">Enter a query to perform a semantic search across your case documents.</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-8">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='e.g., "Instances of failure to provide financial disclosure"'
          className="flex-grow"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          <Search className="mr-2 h-4 w-4" />
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {/* Results Display */}
      <div>
        {error && <ErrorDisplay message={error.message} />}
        {isLoading && <LoadingSpinner />}
        {researchResult && <ResultsDisplay result={researchResult} />}
        {!isLoading && !researchResult && <InitialStateDisplay />}
      </div>
    </div>
  );
};

// --- Sub-components for rendering different states ---

const ResultsDisplay = ({ result }: { result: { summary: string; sources: ResearchSource[] } }) => (
  <div className="space-y-6">
    {/* AI Generated Summary */}
    <div>
      <h2 className="text-2xl font-semibold flex items-center mb-3">
        <BookOpen className="mr-3 text-blue-600" />
        Synthesized Findings
      </h2>
      <div className="prose max-w-none p-4 bg-gray-50 rounded-md">
        <p>{result.summary}</p>
      </div>
    </div>

    {/* Source Documents */}
    <div>
      <h2 className="text-2xl font-semibold flex items-center mb-3">
        <FileText className="mr-3 text-blue-600" />
        Sources
      </h2>
      <div className="space-y-4">
        {result.sources.map((source) => (
          <div key={source.id} className="p-4 border rounded-lg bg-white shadow-sm">
            <p className="text-gray-700 mb-2">{source.content}</p>
            <p className="text-sm text-gray-500 font-mono">
              - {formatBluebookCitation(source)}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="text-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    <p className="mt-4 text-gray-600">Analyzing documents...</p>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="text-center py-10 px-4 bg-red-50 text-red-700 rounded-lg">
    <h3 className="font-bold">An Error Occurred</h3>
    <p>{message}</p>
  </div>
);

const InitialStateDisplay = () => (
    <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <p className="text-gray-500">Your research results will appear here.</p>
    </div>
);

export default ResearchPage;
