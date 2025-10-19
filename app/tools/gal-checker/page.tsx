// File: app/tools/gal-checker/page.tsx
'use client';
// FIX: Removed unused 'React' import
import { useState } from 'react';
import { Shield, Flag, CheckCircle, Search } from 'lucide-react';
// Define the structure for the report received from the API
interface GalReport {
    flagged: boolean;
    citation: string;
    analysis: string;
}
export default function GalCheckerPage() {
    const [statement, setStatement] = useState('');
    const [report, setReport] = useState<GalReport | null>(null);
    const [checking, setChecking] = useState(false);
    const handleCheckGal = async () => {
        if (!statement.trim()) {
            alert('Please enter a statement or action from the GAL to check.');
            return;
        }
        setChecking(true);
        setReport(null);

        try {
            const response = await fetch('/api/gal-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ statement }),
            });
            const data = await response.json();

            if (response.ok && data.success && data.data) {
                setReport(data.data as GalReport);
            } else {
                alert('Analysis failed: ' + (data.error || 'Unknown error.'));
            }
        } catch (error) {
            console.error('Error during GAL check:', error);
            alert('An unexpected network error occurred.');
        } finally {
            setChecking(false);
        }
    };
    const renderReport = () => {
        if (!report) return null;
        const isFlagged = report.flagged;
        const icon = isFlagged ? <Flag className="w-8 h-8 text-red-600" /> : <CheckCircle className="w-8 h-8 text-green-600" />;
        const title = isFlagged ? 'Potential Accountability Issue Flagged' : 'Statement Appears Compliant';
        const titleClass = isFlagged ? 'text-red-700' : 'text-green-700';
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-4 border-b pb-4 mb-4">
                    {icon}
                    <h3 className={`text-2xl font-bold ${titleClass}`}>{title}</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="font-semibold text-lg text-gray-800 mb-1">AI Analysis:</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{report.analysis}</p>
                    </div>
                    {isFlagged && (
                        <div>
                            <p className="font-semibold text-lg text-red-800 mb-1">Legal Citation for Objection:</p>
                            <div className="bg-red-50 border border-red-300 p-3 rounded-md font-mono text-sm">
                                {report.citation}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Use this citation when making a formal objection or preparing a motion.
                            </p>
                        </div>
                    )}
                    {!isFlagged && (
                        <div>
                            <p className="font-semibold text-lg text-gray-800 mb-1">Reference:</p>
                            <p className="text-gray-500">No specific legal rule violation was detected based on the statement provided.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-indigo-600" /> GAL Accountability Checker
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Ensure the Guardian ad Litem adheres to their legal and ethical duties.
                    </p>
                </header>
                {/* Input Panel */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Enter GAL Statement or Action</h2>
                    <textarea
                        value={statement}
                        onChange={(e) => setStatement(e.target.value)}
                        // FIX: Escaping apostrophes (Error 7)
                        placeholder="Example: 'The GAL only interviewed the case worker and failed to investigate the school records.'"
                        rows={6}
                        className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={checking}
                    />

                    <button
                        onClick={handleCheckGal}
                        disabled={checking || !statement.trim()}
                        className="mt-4 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                    >
                        {checking ? (
                            'Analyzing Legal Duties...'
                        ) : (
                            <>
                                <Search className="w-5 h-5" /> Check for Violations
                            </>
                        )}
                    </button>
                </div>
                {/* Report Panel */}
                {checking && (
                    <div className="text-center py-10 text-indigo-600">
                        <p className="text-xl font-medium">Running cross-reference against Florida statutes...</p>
                    </div>
                )}

                {report && renderReport()}

                {!checking && !report && (
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
                        <Shield className="w-12 h-12 mx-auto mb-4" />
                        <p>Results will show if the GAL&apos;s action potentially violates a legal standard.</p>
                    </div>
                )}
            </div>
        </div>
    );
}