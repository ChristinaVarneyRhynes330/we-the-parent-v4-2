// File: app/tools/communication/page.tsx (Full Content Replacement)
'use client';
// FIX: Removed unused 'React' import
import { useState } from 'react';
import { Mail, Briefcase, FileText, Send, Clipboard } from 'lucide-react';
// Define specialized AI modes for the chat vault
type CommunicationMode = 'Letter Draft' | 'Email Draft' | 'Negotiation Script';
export default function CommunicationToolsPage() {
    const [mode, setMode] = useState<CommunicationMode>('Letter Draft');
    const [recipient, setRecipient] = useState('Guardian ad Litem');
    const [prompt, setPrompt] = useState('');
    const [draftOutput, setDraftOutput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleGenerate = async () => {
        if (!prompt.trim()) {
            alert('Please describe what you need the correspondence to say.');
            return;
        }
        setIsGenerating(true);
        setDraftOutput('');
        setError(null);

        // 1. Construct a Specialized System Prompt (Key to this feature)
        let systemInstruction = `You are an AI specializing in drafting formal legal correspondence for a pro se parent. `;
        let userMessage = prompt;
        if (mode === 'Letter Draft') {
            systemInstruction += `Draft a formal letter addressed to the recipient: ${recipient}. Include a date, subject line, and signature block.
The tone must be professional and objective.`;
            userMessage = `Subject: ${recipient} Correspondence Request.\n\nContent: ${prompt}`;
        } else if (mode === 'Email Draft') {
            systemInstruction += `Draft a concise, professional email to the recipient: ${recipient}.
The output should be the body and a subject line. Do not include salutations/signature unless explicitly requested.`;
            userMessage = `Recipient: ${recipient}. Email content request: ${prompt}`;
        } else if (mode === 'Negotiation Script') {
            systemInstruction += `Draft a verbal negotiation script. The script should be assertive yet collaborative, focusing on the parent's compliance and the child's best interests.
Use bullet points for talking points.`;
            userMessage = `Negotiation goal: ${prompt}`;
        }

        // NOTE: We simulate RAG by embedding the specialized instruction into the history.
        // In a real app, this would be the System Prompt for the RAG chat API.
        const mockHistory = [{ role: 'system', content: systemInstruction }];
        try {
            // 2. Call the existing, RAG-enabled chat API route
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    caseId: 'MOCK_CASE_ID', // Requires a case context
                    history: mockHistory, // Pass the specialized instruction
                    newMessage: userMessage,
                }),
            });
            if (!response.ok || !response.body) {
                throw new Error('API communication failed.');
            }

            // 3. Handle Streaming Response (Simplified display for this component)
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let finalDraft = '';
            let done = false;
            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                const chunk = decoder.decode(value);
                finalDraft += chunk;
                // Optional: You could update the state here for a live-typing effect
            }
            setDraftOutput(finalDraft);
        } catch (err) {
            setError('Error generating communication. Please check your AI API key.');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    // --- UTILITY ---
    const handleCopy = () => {
        if (draftOutput) {
            navigator.clipboard.writeText(draftOutput);
            alert('Draft copied to clipboard!');
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <Mail className="w-8 h-8 text-indigo-600" /> AI Communication Tools
                    </h1>
                    <p className="text-gray-600 mt-2">Generate professional letters, emails, and negotiation scripts, grounded in your case facts.</p>
                </header>
                <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">1. Select Mode & Recipient</h2>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <button
                            onClick={() => setMode('Letter Draft')}
                            className={`p-4 rounded-lg flex flex-col items-center transition-colors ${mode === 'Letter Draft' ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                            <FileText className="w-6 h-6" /> Letter Draft
                        </button>
                        <button
                            onClick={() => setMode('Email Draft')}
                            className={`p-4 rounded-lg flex flex-col items-center transition-colors ${mode === 'Email Draft' ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Send className="w-6 h-6" /> Email Draft
                        </button>
                        <button
                            onClick={() => setMode('Negotiation Script')}
                            className={`p-4 rounded-lg flex flex-col items-center transition-colors ${mode === 'Negotiation Script' ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Briefcase className="w-6 h-6" /> Negotiation Script
                        </button>
                    </div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Recipient/Context</label>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="e.g., Guardian ad Litem, Judge Smith, Case Worker"
                        className="w-full border border-gray-300 p-2 rounded-lg"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Goal/Content Description</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the content. Example: 'Write a formal letter stating I will be 15 minutes late to visitation due to traffic, and apologize.'"
                        rows={4}
                        className="w-full border border-gray-300 p-2 rounded-lg resize-none focus:ring-indigo-500 focus:border-indigo-500"
                    />

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className="mt-4 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                    >
                        {isGenerating ? 'Generating Correspondence...' : 'Generate Communication'}
                    </button>
                </div>
                {/* Output Panel */}
                <div className="bg-white p-6 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">2. Generated Draft</h2>

                    {isGenerating && (
                        <div className="text-center py-10 text-indigo-600">
                            <p className="text-xl font-medium">Drafting professional communication...</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            **Error:** {error}
                        </div>
                    )}

                    {draftOutput ? (
                        <>
                            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[200px]">
                                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                                    {draftOutput}
                                </pre>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                            >
                                <Clipboard className="w-5 h-5" /> Copy to Clipboard
                            </button>
                        </>
                    ) : (
                        !isGenerating && !error && (
                            <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                <FileText className="w-12 h-12 mx-auto mb-4" />
                                <p>Your AI-drafted letter, email, or script will appear here.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}