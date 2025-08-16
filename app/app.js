'use client';

import React, { useState, useRef, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Documents from './components/Documents';
import Chat from './components/Chat';
import MotionDrafting from './components/MotionDrafting';
import { Home, FileText, MessageCircle, X, Menu, AlertTriangle, User, Scale, CheckCircle } from 'lucide-react';

import currentCaseData from './data/currentCase.json';
import caseProgressData from './data/caseProgress.json';
import upcomingEventsData from './data/upcomingEvents.json';
import documentTypesData from './data/documentTypes.json';

const WeTheParentApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmergencyMode, setShowEmergencyMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [motionFormData, setMotionFormData] = useState({
    caseName: '', 
    caseNumber: '', 
    reason: '', 
    outcome: '' 
  });
  const [aiDraft, setAiDraft] = useState('');
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState(null);

  const [userName, setUserName] = useState('Christina');

  // Use imported data
  const currentCase = currentCaseData;
  const caseProgress = caseProgressData;
  const upcomingEvents = upcomingEventsData;
  const documentTypes = documentTypesData;

  // Initialize with AI welcome message
  useEffect(() => {
    setChatMessages([{
      type: 'ai',
      content: "Good morning! I've reviewed your case file. Based on the upcoming hearing date, I recommend we prepare a Motion for Increased Visitation. Shall I help you draft this document?",
      timestamp: new Date().toISOString(),
      suggestions: ["Yes, Draft Motion", "Show Options"]
    }]);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const showSuccessNotification = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMessage = { type: 'user', content: chatInput, timestamp: new Date().toISOString() };
    setChatMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      let aiResponse = '';
      const input = chatInput.toLowerCase();
      if (input.includes('motion') || input.includes('increased visitation')) {
        aiResponse = "Perfect! I'll help you create a compelling motion. I'll need some information:\n\n• Current visitation schedule\n• Reasons for requesting increase\n• Documentation of progress made\n• Proposed new schedule\n\nBased on your case timeline, I recommend filing this motion before your next hearing on March 15th. This gives the court time to review and potentially rule during the adjudicatory hearing.\n\n📄 Would you like me to start drafting now?";
      } else if (input.includes('draft') || input.includes('document')) {
        aiResponse = "I can draft any legal document you need with proper Florida formatting:\n\n✓ Motion for Increased Visitation\n✓ Response to DCF Motion\n✓ Objection to Evidence\n✓ Emergency Motions\n✓ Witness Affidavits\n✓ Case Plan Updates\n\nEach document will include case-specific facts from your uploaded files, proper legal citations, and compliance with Florida Rules of Juvenile Procedure. What would you like me to draft?";
      } else {
        aiResponse = `I understand you're asking about "${chatInput}". What specific assistance do you need for your case today?`;
      }
      const response = {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        suggestions: input.includes('motion') ? ["Start Drafting", "Upload Evidence", "View Templates"] : ["Get Started", "Upload Files", "View Options"]
      };
      setChatMessages(prev => [...prev, response]);
    }, 1500);
    setChatInput('');
  };

  const handleQuickAction = (action) => {
    let response = '';
    if (action === "Yes, Draft Motion" || action === "Start Drafting") {
      response = "I'll begin drafting your Motion for Increased Visitation. This will include:\n\n📋 MOTION SECTIONS:\n1. Caption with case details\n2. Introduction and background\n3. Legal basis and authority\n4. Statement of facts\n5. Argument and analysis\n6. Prayer for relief\n7. Certificate of service\n\n🔍 EVIDENCE INTEGRATION:\n• Your parenting class completion\n• Housing stability documentation\n• Progress in required services\n• Positive supervision reports\n\nEstimated completion: 10-15 minutes\nWould you like to begin with the current visitation schedule details?";
      setActiveTab('motion_drafting');
    } else if (action === "Upload Files") {
      response = "Great! Uploading files helps me provide more accurate assistance. I can process:\n\n📄 SUPPORTED FORMATS:\n• Court documents (PDF, DOC)\n• Evidence photos (JPG, PNG)\n• Audio/video recordings\n• Text documents\n• Email correspondence\n\nClick the upload button or drag files directly into the chat.";
      if (fileInputRef.current) fileInputRef.current.click();
      setActiveTab('documents');
    } else {
      response = "Okay, let's get started. What do you need help with?";
    }
    setChatMessages(prev => [...prev, { type: 'ai', content: response, timestamp: new Date().toISOString() }]);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      category: file.name.includes('court') ? 'Court Filings' : 'Case Documents',
      uploadDate: new Date().toISOString(),
      processed: false,
      extracted: false
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    showSuccessNotification(`${files.length} file(s) uploaded successfully!`);
    setTimeout(() => setUploadedFiles(prev => prev.map(f => ({...f, processed: true, extracted: true}))), 3000);
  };

  const handleDraftingSubmit = async (e) => {
    e.preventDefault();
    setDraftLoading(true);
    setDraftError(null);

    try {
      const response = await fetch('/api/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(motionFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate draft');
      }

      const data = await response.json();
      setAiDraft(data.draft);
    } catch (error) {
      setDraftError(error.message);
    } finally {
      setDraftLoading(false);
    }
  };

  const handleCopy = () => {
    if (aiDraft) {
      navigator.clipboard.writeText(aiDraft).then(() => {
        showSuccessNotification('Draft copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard userName={userName} currentCase={currentCase} caseProgress={caseProgress} upcomingEvents={upcomingEvents} handleQuickAction={handleQuickAction} />;
      case 'documents': return <Documents fileInputRef={fileInputRef} handleFileUpload={handleFileUpload} uploadedFiles={uploadedFiles} setActiveTab={setActiveTab} handleQuickAction={handleQuickAction} documentTypes={documentTypes} motionFormData={motionFormData} setMotionFormData={setMotionFormData} currentCase={currentCase} />;
      case 'chat': return <Chat chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput} handleSendMessage={handleSendMessage} handleQuickAction={handleQuickAction} isRecording={isRecording} setIsRecording={setIsRecording} chatEndRef={chatEndRef} />;
      case 'motion_drafting': return <MotionDrafting motionFormData={motionFormData} setMotionFormData={setMotionFormData} handleDraftingSubmit={handleDraftingSubmit} draftLoading={draftLoading} draftError={draftError} aiDraft={aiDraft} handleCopy={handleCopy} />;
      default: return <Dashboard userName={userName} currentCase={currentCase} caseProgress={caseProgress} upcomingEvents={upcomingEvents} handleQuickAction={handleQuickAction} />;
    }
  };

  const EmergencyPanel = ({ setShowEmergencyMode, setChatMessages, setActiveTab, showSuccessNotification }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-red-600 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />Emergency Mode
          </h2>
          <button onClick={() => setShowEmergencyMode(false)} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-700 mb-6">I&apos;m here to help immediately. What type of emergency document do you need?</p>
        <div className="space-y-3">
          {['Emergency Motion for Temporary Relief', 'Emergency Stay Request', 'Emergency Hearing Request', 'Expedited Filing Documents'].map((option, index) => (
            <button 
              key={index} 
              onClick={() => {
                setChatMessages(prev => [...prev, { 
                  type: 'ai', 
                  content: `🚨 GENERATING ${option.toUpperCase()} 🚨\n\nI'm immediately creating this emergency document with:\n\n• Urgent legal predicates\n• Proper emergency procedural formatting\n• Case-specific emergency facts\n• Expedited filing instructions\n\nDocument will be ready in moments...`,
                  timestamp: new Date().toISOString() 
                }]);
                setShowEmergencyMode(false);
                setActiveTab('chat');
                showSuccessNotification('Emergency document generation started!');
              }} 
              className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
            >
              <div className="font-semibold text-red-800">{option}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const SuccessNotification = ({ message }) => (
    message && (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
        <CheckCircle className="h-5 w-5 mr-2" />
        {message}
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <SuccessNotification message={showNotification} />
      
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-slate-700 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-slate-800">We The Parent™</h1>
                <p className="text-xs text-slate-600">Protecting Families Through Law</p>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-8">
              {[ 
                { id: 'dashboard', label: 'Dashboard', icon: Home },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'chat', label: 'AI Chat', icon: MessageCircle }
              ].map((nav) => (
                <button 
                  key={nav.id} 
                  onClick={() => setActiveTab(nav.id)} 
                  className={`px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === nav.id ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-700 hover:text-orange-600'}`}
                >
                  <nav.icon className="h-4 w-4" />
                  <span>{nav.label}</span>
                </button>
              ))}
            </div>
            
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2 rounded-md text-slate-400 hover:text-slate-500"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setShowEmergencyMode(true)} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Emergency</span>
              </button>
              <div className="flex items-center">
                <div className="bg-slate-700 rounded-full p-2 mr-2">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700">{userName}</span>
              </div>
            </div>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-50">
              {[ 
                { id: 'dashboard', label: 'Dashboard', icon: Home },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'chat', label: 'AI Chat', icon: MessageCircle }
              ].map((nav) => (
                <button 
                  key={nav.id} 
                  onClick={() => { setActiveTab(nav.id); setMobileMenuOpen(false); }} 
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 ${activeTab === nav.id ? 'bg-orange-100 text-orange-700' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  <nav.icon className="h-5 w-5" />
                  <span>{nav.label}</span>
                </button>
              ))}
              <button 
                onClick={() => { setShowEmergencyMode(true); setMobileMenuOpen(false); }} 
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 text-red-700 hover:bg-red-50"
              >
                <AlertTriangle className="h-5 w-5" />
                <span>Emergency</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {showEmergencyMode && (
        <EmergencyPanel 
          setShowEmergencyMode={setShowEmergencyMode} 
          setChatMessages={setChatMessages} 
          setActiveTab={setActiveTab} 
          showSuccessNotification={showSuccessNotification} 
        />
      )}

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h3 className="font-bold text-slate-800">We The Parent™</h3>
              <p className="text-sm text-slate-600">Empowering families through legal knowledge</p>
            </div>
            <div className="text-sm text-slate-500">Legal assistance platform for self-represented parents</div>
            <div className="text-sm text-slate-500">© 2025 We The Parent. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WeTheParentApp;
