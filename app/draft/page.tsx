// File: app/draft/page.tsx (Full Content Replacement)

'use client';

// FIX: Removed unused 'React' import
import { useState } from 'react'; 
import { FileText, Zap, Save, Download, Mail, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input'; 
import { DraftRequest, DraftResponse } from '@/types'; 

// Define the structure for the Certificate of Service (matching backend)
interface CertificateOfService {
    date: string;
    method: string;
    servedParties: Array<{ role: string; email: string }>;
    cosBlock: string;
}

// --- MOCK TEMPLATE OPTIONS ---
const TEMPLATE_OPTIONS = [
    { id: 'motion-increased-visitation', name: 'Motion for Increased Visitation', description: 'Used to request a change from supervised to unsupervised visits.' },
    { id: 'request-case-plan-modification', name: 'Request for Case Plan Modification', description: 'Used when services are complete or services are no longer appropriate.' },
    { id: 'emergency-motion-placement', name: 'Emergency Motion for Change of Placement (Simulated)', description: 'Rapid response tool for immediate safety concerns.' },
];
const MOCK_CASE_ID = 'case-001';


export default function DraftingEnginePage() {
    const [templateId, setTemplateId] = useState(TEMPLATE_OPTIONS[0].id);
    const [userInstructions, setUserInstructions] = useState('');
    const [caseName, setCaseName] = useState('Jane Doe v. DCF');
    const [caseNumber, setCaseNumber] = useState('2025-DP-0000X');
    
    const [generatedDraft, setGeneratedDraft] = useState<DraftResponse | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cosBlock, setCosBlock] = useState<string | null>(null); 
    const [isCosGenerating, setIsCosGenerating] = useState(false); 

    // FIX: Prefixed isEmergency with an underscore to clear unused variable warning
    const handleGenerate = async (_isEmergency: boolean = false) => { 
        if (!templateId) {
            alert("Please select a document template.");
            return;
        }

        setIsGenerating(true);
        setGeneratedDraft(null);
        setError(null);
        setCosBlock(null); 

        const documentType = TEMPLATE_OPTIONS.find(t => t.id === templateId)?.name || 'Motion';

        const requestBody: DraftRequest = {
            templateId: templateId,
            caseId: MOCK_CASE_ID, 
            documentType: documentType,
            caseName: caseName,
            caseNumber: caseNumber,
            userInstructions: userInstructions,
        };

        try {
            const response = await fetch('/api/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok && data.success && data.data) {
                setGeneratedDraft(data.data as DraftResponse);
            } else {
                setError(data.error || 'Failed to generate draft.');
            }
        } catch (err) {
            setError('Network error during drafting. Check console.');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };
    
    // --- NEW FUNCTION: Generate Certificate of Service ---
    const handleGenerateCos = async () => {
        if (!generatedDraft) {
            alert("Please generate a draft document first.");
            return;
        }
        
        setIsCosGenerating(true);
        try {
            const response = await fetch('/api/certificate-of-service', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    caseId: MOCK_CASE_ID, 
                    serviceMethod: 'Electronic Mail (Email)'
                }),
            });
            
            const data = await response.json();

            if (response.ok && data.success && data.data) {
                const cosData = data.data as CertificateOfService;
                
                let newDraft = generatedDraft.draft;
                
                // Simple logic to replace/append the placeholder block
                if (newDraft.includes('### CERTIFICATE OF SERVICE')) {
                    newDraft = newDraft.replace(/### CERTIFICATE OF SERVICE[\s\S]*$/, cosData.cosBlock);
                } else {
                    newDraft += cosData.cosBlock;
                }

                setGeneratedDraft(prev => prev ? { ...prev, draft: newDraft } : null);
                setCosBlock(cosData.cosBlock);
                alert("Certificate of Service successfully added to the draft!");
            } else {
                alert(data.error || 'Failed to generate Certificate of Service.');
            }

        } catch (err) {
            alert('Error generating Certificate of Service.');
            console.error(err);
        } finally {
            setIsCosGenerating(false);
        }
    };
    // -----------------------------------------------------

    // Simplistic mock function for saving/exporting
    const handleSave = () => alert("Draft saved and ready for export! (Simulated)");
    const handleExport = () => alert("Downloading final DOCX file... (Simulated)");


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-indigo-600" /> Drafting Engine
                    </h1>
                    <p className="text-gray-600 mt-2">Generate professional legal documents pre-filled with facts from your case.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Input/Controls Panel */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">1. Select Template & Details</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="document-template" className="block text-sm font-medium text-gray-700 mb-1">Document Template</label>
                                <select
                                    id="document-template"
                                    value={templateId}
                                    onChange={(e) => setTemplateId(e.target.value)}
                                    // FIX: Added aria-label for accessibility
                                    aria-label="Select document template"
                                    className="w-full border border-gray-300 p-2 rounded-lg"
                                >
                                    {TEMPLATE_OPTIONS.map(opt => (
                                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">{TEMPLATE_OPTIONS.find(t => t.id === templateId)?.description}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Case Name / Caption</label>
                                <Input type="text" value={caseName} onChange={(e) => setCaseName(e.target.value)} />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Case Number</label>
                                <Input type="text" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specific Instructions</label>
                                <textarea
                                    value={userInstructions}
                                    onChange={(e) => setUserInstructions(e.target.value)}
                                    placeholder="e.g., The argument should focus specifically on my completion of therapy services."
                                    rows={3}
                                    className="w-full border border-gray-300 p-2 rounded-lg resize-none"
                                />
                            </div>

                            <button
                                onClick={() => handleGenerate(false)}
                                disabled={isGenerating || !templateId}
                                className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                            >
                                {isGenerating ? 'Drafting Document...' : 'Generate Draft'}
                            </button>
                            
                            {/* Emergency Motion Drafter (Feature 8 specialization) */}
                            {templateId === 'emergency-motion-placement' && (
                                <button
                                    onClick={() => handleGenerate(true)}
                                    disabled={isGenerating}
                                    className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mt-2 disabled:bg-gray-400"
                                >
                                    <Zap className="w-5 h-5" /> EMERGENCY DRAFT
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Output/Draft Viewer Panel */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">2. Generated Legal Draft (Markdown)</h2>
                        
                        {isGenerating && (
                            <div className="text-center py-20 text-indigo-600">
                                <p className="text-xl font-medium">Analyzing evidence and writing the legal brief...</p>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                **Drafting Error:** {error}
                            </div>
                        )}
                        
                        {generatedDraft ? (
                            <>
                                <div className="mb-4 space-y-2">
                                    <div className="p-4 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                                        Document Type: {generatedDraft.documentType} | Generated: {new Date(generatedDraft.generatedAt || '').toLocaleTimeString()}
                                    </div>
                                    
                                    {/* CoS Button */}
                                    <button
                                        onClick={handleGenerateCos}
                                        disabled={isCosGenerating}
                                        className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${cosBlock ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                                    >
                                        {isCosGenerating ? 'Generating CoS...' : (cosBlock ? <><CheckCircle className="w-5 h-5"/> CoS ADDED (Ready to Export)</> : <><Mail className="w-5 h-5"/> Generate Certificate of Service</>)}
                                    </button>
                                </div>
                                
                                {/* Display the generated Markdown draft in a preview format */}
                                <div className="border border-gray-300 rounded-lg p-4 bg-white min-h-[400px]">
                                    <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                                        {generatedDraft.draft}
                                    </pre>
                                </div>

                                <div className="mt-4 flex justify-end space-x-3">
                                    <button onClick={handleSave} className="button-primary flex items-center gap-2 bg-gray-600 hover:bg-gray-700" disabled={isGenerating}>
                                        <Save className="w-5 h-5" /> Save Version
                                    </button>
                                    <button 
                                        onClick={handleExport} 
                                        className="button-primary flex items-center gap-2" disabled={isGenerating || !cosBlock}
                                    >
                                        <Download className="w-5 h-5" /> Export Final DOCX
                                    </button>
                                </div>
                            </>
                        ) : (
                            !isGenerating && !error && (
                                <div className="text-center py-20 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                    <FileText className="w-12 h-12 mx-auto mb-4" />
                                    <p>Select a template and click &apos;Generate Draft&apos; to begin.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}