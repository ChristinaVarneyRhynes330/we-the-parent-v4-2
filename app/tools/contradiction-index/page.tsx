// File: app/tools/contradiction-index/page.tsx

'use client';

import { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle, Swords } from 'lucide-react'; 

// Define the structure for the report received from the API
interface ContradictionReport {
    flagged: boolean;
    analysis: string;
    details: Array<{ statementA: string; statementB: string; contradiction: string }>;
}

export default function ContradictionIndexPage() {
    const [statementA, setStatementA] = useState('');
    const [statementB, setStatementB] = useState('');
    const [report, setReport] = useState<ContradictionReport | null>(null);
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckContradiction = async () => {
        if (!statementA.trim() || !statementB.trim()) {
            alert('Please enter text into both fields for comparison.');
            return;
        }

        // FIX: Corrected typo from setIsChecking to setChecking (Error 5)
        setChecking(true); 
        setReport(null);
        setError(null);
        
        try {
            const response = await fetch('/api/contradiction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    statement1: statementA,
                    statement2: statementB,
                }),
            });

            const data = await response.json();
            
            if (response.ok && data.success && data.data) {
                setReport(data.data as ContradictionReport);
            } else {
                setError(data.error || 'Analysis failed: Could not retrieve contradiction report.');
            }
        } catch (err) {
            setError('Network error during contradiction analysis. Check console.');
            console.error(err);
        } finally {
            setChecking(false);
        }
    };

    const renderReport = () => {
        if (!report) return null;

        const isFlagged = report.flagged;
        const icon = isFlagged ? <AlertTriangle className="w-8 h-8 text-red-600" /> : <CheckCircle className="w-8 h-8 text-green-600" />;
        const title = isFlagged ? 'CRITICAL CONTRADICTION FOUND' : 'No Major Contradictions Detected';
        const titleClass = isFlagged ? 'text-red-700' : 'text-green-700';
        const bgClass = isFlagged ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300';

        return (
            <div className={`p-6 rounded-xl shadow-lg border-2 ${bgClass} space-y-4`}>
                <div className="flex items-center space-x-3">
                    {icon}
                    <h3 className={`text-2xl font-bold ${titleClass}`}>{title}</h3>
                </div>

                <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-2">AI Summary:</p>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm">{report.analysis}</p>
                </div>

                {report.flagged && (
                    <div className="space-y-4 pt-2">
                        <p className="font-semibold text-lg text-red-800">Conflicting Details ({report.details.length} Instances):</p>
                        {report.details.map((detail, index) => (
                            <div key={index} className="border border-red-200 p-3 rounded-lg bg-white">
                                <p className="font-medium text-red-600 mb-2">Contradiction {index + 1}: {detail.contradiction}</p>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <p className="font-mono text-gray-600 border-b pb-1">Statement A (Source 1):</p>
                                        <p className="mt-1 italic">{detail.statementA}</p>
                                    </div>
                                    <div>
                                        <p className="font-mono text-gray-600 border-b pb-1">Statement B (Source 2):</p>
                                        <p className="mt-1 italic">{detail.statementB}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <Swords className="w-8 h-8 text-indigo-600" /> Contradiction Index Engine
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Cross-reference statements, affidavits, and testimony for factual inconsistencies.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Input Panel */}
                    <div className="space-y-4">
                        <div className="card p-6 shadow-md bg-white">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Statement 1 (e.g., DCF Report)</h2>
                            <textarea
                                value={statementA}
                                onChange={(e) => setStatementA(e.target.value)}
                                placeholder="Paste the text of the first document or statement here."
                                rows={6}
                                className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={checking}
                            />
                        </div>

                        <div className="card p-6 shadow-md bg-white">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Statement 2 (e.g., Witness Testimony / Your Record)</h2>
                            <textarea
                                value={statementB}
                                onChange={(e) => setStatementB(e.target.value)}
                                placeholder="Paste the text of the second document or statement here."
                                rows={6}
                                className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={checking}
                            />
                        </div>
                        
                        <button
                            onClick={handleCheckContradiction}
                            disabled={checking || !statementA.trim() || !statementB.trim()}
                            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                        >
                            {checking ? (
                                'Analyzing for Conflicts...'
                            ) : (
                                <>
                                    <Swords className="w-5 h-5" /> Check for Contradiction
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results Panel */}
                    <div className="lg:col-span-1">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Contradiction Report</h2>
                        
                        {checking && (
                            <div className="text-center py-20 bg-white rounded-lg shadow text-indigo-600">
                                <p className="text-xl font-medium">Comparing statements using AI analysis...</p>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                **System Error:** {error}
                            </div>
                        )}

                        {report ? renderReport() : (
                            !checking && !error && (
                                <div className="text-center py-20 bg-white rounded-lg shadow text-gray-500 border-2 border-dashed border-gray-300">
                                    <Zap className="w-12 h-12 mx-auto mb-4" />
                                    <p>The AI will highlight conflicting facts to build your impeachment strategy.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}