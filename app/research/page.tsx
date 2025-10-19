// File: app/research/page.tsx (Full Content Replacement)
'use client';
// FIX: Removed unused 'React' and 'AlertTriangle' imports
import { useState } from 'react';
import { BookOpen, Search, FileText } from 'lucide-react'; 

// Define the structure for the report received from the API (aligned with the backend mock)
interface ResearchSource {
  id: string;
  document_id: string;
  document_title: string;
  page_number: number;
  content: string;
}
interface ResearchResult {
    summary: string;
    citation: string; // Added to display the formatted citation
    sources: ResearchSource[];
}
export default function LegalResearchPage() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<ResearchResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) {
            alert('Please enter a legal query.');
            return;
        }
        setIsSearching(true);
        setResult(null);
        setError(null);

        try {
            const response = await fetch('/api/research', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();

            if (response.ok && data.success && data.data) {
                setResult(data.data as ResearchResult);
            } else {
                setError(data.error || 'Search failed: Could not retrieve legal data.');
            }
        } catch (err) {
            setError('Network error during research. Check console.');
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-indigo-600" /> Legal Research & Citations
                    </h1>
                    <p className="text-gray-600 mt-2">Find relevant Florida law and generate correct Bluebook citations.</p>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Input Panel */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Legal Query</h2>

                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Example: 'What is the standard for terminating parental rights in Florida?'"
                            rows={5}
                            className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={isSearching}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isSearching || !query.trim()}
                            className="mt-4 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                        >
                            {isSearching ? (
                                'Searching Databases...'
                            ) : (
                                <>
                                    <Search className="w-5 h-5" /> Find Law & Citations
                                </>
                            )}
                        </button>
                    </div>
                    {/* Results Panel */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">AI Research Summary</h2>

                        {isSearching && (
                            <div className="text-center py-20 text-indigo-600">
                                <p className="text-xl font-medium">Consulting legal precedents and formatting citations...</p>
                            </div>
                        )}
                        {error && (
                            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                **Research Error:** {error}
                            </div>
                        )}
                        {result ? (
                            <div className="space-y-6">
                                {/* Summary */}
                                <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
                                    <p className="font-semibold text-blue-800 mb-2">Summary:</p>
                                    <p className="text-gray-700 whitespace-pre-wrap">{result.summary}</p>
                                </div>
                                {/* Citation */}
                                <div>
                                    <p className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-gray-600" />Formatted Citation: (Bluebook Style)
                                    </p>
                                    <div className="bg-gray-100 p-3 border rounded-lg font-mono text-sm text-gray-800">
                                        {result.citation}
                                    </div>
                                </div>

                                {/* Sources (Simulated for RAG integration) */}
                                <div>
                                    <p className="font-semibold text-gray-800 mb-2">Simulated Sources (Evidence Binder Link):</p>
                                    {result.sources.length > 0 ? (
                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                            {result.sources.map((src, index) => (
                                                <li key={index}>
                                                    {src.document_title} - Content Excerpt: &quot;
                                                    {src.content.substring(0, 50)}
                                                    &quot;...</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500">No specific sources linked from the mock database.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            !isSearching && !error && (
                                <div className="text-center py-20 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                    <Search className="w-12 h-12 mx-auto mb-4" />
                                    <p>Enter a question about Florida juvenile law to receive a summary and citation.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}