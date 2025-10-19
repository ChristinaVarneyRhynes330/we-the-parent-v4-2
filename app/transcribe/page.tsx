// File: app/transcribe/page.tsx (Full Content Replacement)
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Zap, AlertTriangle, Volume2 } from 'lucide-react'; 

// Define the structure for the immediate real-time response (matching API)
interface ObjectionFlag {
    flagged: boolean;
    type?: 'Hearsay' | 'Lack of Foundation' | 'Irrelevant' | 'Leading';
    triggerPhrase?: string;
    scriptSuggestion?: string;
    // FIX: Added 'analysis' property to satisfy the error fallback (Error 4)
    analysis?: string; 
}

export default function RealTimeCourtroomPage() {
    const [transcript, setTranscript] = useState<string[]>([]);
    const [inputChunk, setInputChunk] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [currentFlag, setCurrentFlag] = useState<ObjectionFlag | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const transcriptEndRef = useRef<HTMLDivElement>(null);
    
    // Auto-scroll to the bottom of the transcript window
    const scrollToBottom = () => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [transcript, currentFlag]);
    
    // --- CORE AI COMMUNICATION LOGIC ---
    const analyzeChunk = useCallback(async (chunk: string) => {
        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/objection-stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript_chunk: chunk }),
            });

            const data = await response.json();
            
            if (response.ok && data.success && data.data) {
                const flag = data.data as ObjectionFlag;
                if (flag.flagged) {
                    setCurrentFlag(flag);
                } else {
                    // Clear flag if the new chunk contains no objection
                    setCurrentFlag(null);
                }
            } else {
                console.error("Analysis failed:", data.error || 'Unknown API error');
            }
        } catch (error) {
            console.error('Network error during analysis:', error);
            setCurrentFlag({ flagged: false, analysis: "System Error" }); 
        } finally {
            setIsAnalyzing(false);
        }
    }, []);

    // --- SIMULATED LIVE INPUT ---
    const handleSendChunk = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputChunk.trim()) return;

        // 1. Add chunk to the transcript display
        setTranscript(prev => [...prev, inputChunk]);
        
        // 2. Trigger real-time analysis
        analyzeChunk(inputChunk);

        // 3. Clear input for the next chunk
        setInputChunk('');
    };
    
    // --- RENDER FUNCTIONS ---
    const renderObjectionAlert = () => {
        if (!currentFlag) return null;

        const { type, scriptSuggestion, triggerPhrase } = currentFlag;
        const colorClass = 'bg-red-700 border-red-900';
        
        return (
            <div className={`fixed bottom-4 right-4 p-5 rounded-xl shadow-2xl text-white z-50 transition-all duration-300 transform ${colorClass} w-80`}>
                <div className="flex items-center space-x-3 mb-3">
                    <Zap className="w-6 h-6 animate-pulse" />
                    <h3 className="text-xl font-bold">OBJECTION ALERT!</h3>
                </div>
                
                <p className="font-semibold text-lg">{type}: {triggerPhrase}</p>
                <div className="mt-3 p-3 bg-red-800 rounded-lg">
                    <p className="text-sm font-mono">
                        {scriptSuggestion}
                    </p>
                </div>
                <div className="mt-4 text-center">
                    <button 
                        onClick={() => setCurrentFlag(null)} 
                        className="text-xs font-semibold underline opacity-70 hover:opacity-100"
                    >
                        Dismiss Alert
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Objection Alert */}
            {renderObjectionAlert()}

            <header className="p-4 bg-gray-800 border-b border-gray-700 text-white">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Volume2 className="w-7 h-7 text-red-500" /> Courtroom Execution Center
                </h1>
                <p className="text-gray-400 mt-1">Real-Time Transcription & Objection Scripting</p>
            </header>

            <div className="flex-grow flex">
                {/* Live Transcript Panel */}
                <div className="w-2/3 bg-gray-800 p-6 overflow-y-auto border-r border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Live Transcript</h2>
                    <div className="h-[calc(100vh-250px)] overflow-y-auto space-y-3 p-2 bg-gray-900 rounded-lg">
                        {transcript.length === 0 && (
                            // FIX: Escaping apostrophes (Error 5)
                            <p className="text-gray-500 text-center py-10">Start &apos;listening&apos; by sending a transcript chunk below.</p>
                        )}
                        {transcript.map((line, index) => (
                            <p key={index} className="text-gray-300 bg-gray-700 p-2 rounded text-sm whitespace-pre-wrap">
                                **Witness/Counsel:** {line}
                            </p>
                        ))}
                        <div ref={transcriptEndRef} />
                    </div>
                </div>

                {/* Status and Input Panel */}
                <div className="w-1/3 p-6 bg-gray-900 flex flex-col">
                    <div className="flex-grow space-y-6">
                        {/* Status Widget */}
                        <div className="p-4 bg-gray-800 rounded-lg shadow-xl">
                            <div className="flex items-center space-x-2">
                                <Mic className={`w-6 h-6 ${isListening ? 'text-red-500' : 'text-gray-400'}`} />
                                <h3 className="text-lg font-semibold text-white">Live Monitoring Status</h3>
                            </div>
                            <p className={`mt-2 text-sm ${isListening ? 'text-green-400' : 'text-yellow-400'}`}>
                                {isListening ? 'ACTIVE: Analyzing Audio Stream' : 'INACTIVE: Click below to start'}
                            </p>
                            <button 
                                onClick={() => setIsListening(prev => !prev)}
                                className={`mt-4 w-full py-2 rounded-lg text-white font-medium transition-colors ${
                                    isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {isListening ? 'STOP Session' : 'START Court Session'}
                            </button>
                        </div>
                        
                        {/* AI Status Widget */}
                         <div className="p-4 bg-gray-800 rounded-lg shadow-xl">
                            <div className="flex items-center space-x-2">
                                <AlertTriangle className={`w-6 h-6 ${isAnalyzing ? 'text-yellow-500 animate-spin' : (currentFlag ? 'text-red-500' : 'text-gray-400')}`} />
                                <h3 className="text-lg font-semibold text-white">AI Objection Analysis</h3>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">
                                {isAnalyzing && 'Processing last chunk for violations...'}
                                {!isAnalyzing && currentFlag && <span className="text-red-400 font-bold">IMMEDIATE ACTION REQUIRED! ({currentFlag.type})</span>}
                                {!isAnalyzing && !currentFlag && 'System is clear. Listening for the next event.'}
                            </p>
                        </div>
                    </div>

                    {/* Input Simulation Area */}
                    <form onSubmit={handleSendChunk} className="mt-6 pt-4 border-t border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Simulate Live Transcript</h3>
                        <textarea
                            value={inputChunk}
                            onChange={(e) => setInputChunk(e.target.value)}
                            // FIX: Escaping apostrophes (Error 5)
                            placeholder="Paste a witness statement here to test the objection system (e.g., 'The case worker said the mother has no interest in attending services...')"
                            rows={3}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg resize-none focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={!isListening}
                        />
                        <button
                            type="submit"
                            disabled={!isListening || isAnalyzing || !inputChunk.trim()}
                            className="mt-2 w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-700 disabled:text-gray-500"
                        >
                            Send Chunk & Analyze
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}