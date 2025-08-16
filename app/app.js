'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  FileText, 
  Upload, 
  Calendar, 
  Scale, 
  Shield, 
  Search, 
  Mic, 
  Download, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  Users, 
  Settings,
  ChevronRight,
  Plus,
  Eye,
  Edit3,
  Home,
  RefreshCw,
  CheckCircle,
  Zap,
  Brain,
  Gavel,
  FileCheck,
  Headphones,
  Send,
  ExternalLink,
  Phone,
  HelpCircle,
  UserCheck,
  Lightbulb,
  FileUp,
  Calculator,
  List,
  User,
  Heart,
  Menu,
  X,
  Copy,
} from 'lucide-react';

const WeTheParentApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmergencyMode, setShowEmergencyMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [transcriptionFiles, setTranscriptionFiles] = useState([]);
  const [researchQuery, setResearchQuery] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
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

  // User name
  const [userName, setUserName] = useState('Christina');

  // Mock data for the app
  const currentCase = {
    number: '2024-DP-000587-XXDP-BC',
    nextHearing: 'March 15, 2025',
    circuit: '5th Judicial Circuit',
    progress: 65,
    daysRemaining: 3,
    status: 'Active'
  };

  const caseProgress = [
    { task: 'Parenting Classes', status: 'Complete', progress: 100 },
    { task: 'Housing Stability', status: 'In Progress', progress: 75 },
    { task: 'Substance Abuse Program', status: 'In Progress', progress: 60 },
    { task: 'Mental Health Evaluation', status: 'Scheduled', progress: 0 }
  ];

  const upcomingEvents = [
    { title: 'Adjudicatory Hearing', date: 'March 15, 2025 at 2:00 PM', daysRemaining: 3, type: 'critical' },
    { title: 'Supervised Visitation', date: 'March 20, 2025 at 10:00 AM', daysRemaining: 8, type: 'routine' },
    { title: 'Case Plan Review', date: 'March 25, 2025 at 1:30 PM', daysRemaining: 13, type: 'important' },
    { title: 'Judicial Review Hearing', date: 'April 10, 2025 at 9:00 AM', daysRemaining: 29, type: 'important' }
  ];

  const recentDocuments = [
    { 
      title: 'Motion for Increased Visitation', 
      type: 'Motion', 
      status: 'DRAFT', 
      modified: '2 hours ago',
      actions: ['Continue', 'Preview', 'Share'],
      icon: Edit3,
      color: 'text-orange-600'
    },
    { 
      title: 'Parental Progress Affidavit', 
      type: 'Affidavit', 
      status: 'FILED', 
      filed: 'March 10, 2025',
      actions: ['View', 'Download', 'Copy'],
      icon: FileCheck,
      color: 'text-blue-600'
    },
    { 
      title: 'Supporting Evidence Compilation', 
      type: 'Exhibit List', 
      status: 'REVIEW', 
      created: 'March 8, 2025',
      actions: ['Edit', 'Preview', 'Share'],
      icon: List,
      color: 'text-green-600'
    }
  ];

  const recentResearch = [
    'Troxel v. Granville - Parental Rights',
    'Florida Statute § 39.507 - Shelter Hearings',
    'Santosky v. Kramer - Evidence Standard'
  ];

  const constitutionalCategories = [
    { title: 'Due Process', icon: Scale, description: 'Constitutional protections' },
    { title: 'Emergency Removal', icon: AlertTriangle, description: 'Urgent procedures' },
    { title: 'Custody Rights', icon: Users, description: 'Parental authority' },
    { title: 'GAL Authority', icon: Shield, description: 'Guardian ad litem' }
  ];

  const supportResources = [
    { title: 'Self-Help Guide', icon: HelpCircle, color: 'text-blue-600' },
    { title: 'Courtroom Etiquette', icon: Gavel, color: 'text-purple-600' },
    { title: 'Emergency Contacts', icon: Phone, color: 'text-red-600' },
    { title: 'Parent Support Groups', icon: UserCheck, color: 'text-green-600' }
  ];

  const quickTools = [
    { title: 'Upload Evidence', icon: FileUp, color: 'text-blue-500' },
    { title: 'Transcription', icon: Headphones, color: 'text-purple-500' },
    { title: 'File Converter', icon: RefreshCw, color: 'text-green-500' },
    { title: 'Deadline Calc', icon: Calculator, color: 'text-orange-500' }
  ];

  const documentTypes = [
    { id: 'motion', title: 'Motion', subtitle: 'File requests', icon: Edit3, color: 'text-orange-600' },
    { id: 'affidavit', title: 'Affidavit', subtitle: 'Sworn statement', icon: FileCheck, color: 'text-blue-600' },
    { id: 'objection', title: 'Objection', subtitle: 'Challenge evidence', icon: AlertTriangle, color: 'text-red-600' },
    { id: 'exhibits', title: 'Exhibits', subtitle: 'Evidence list', icon: List, color: 'text-green-600' }
  ];

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

  const handleAudioUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      duration: 'Processing...',
      transcribed: false,
      transcript: '',
      uploadDate: new Date().toISOString()
    }));
    setTranscriptionFiles(prev => [...prev, ...newFiles]);
    showSuccessNotification('Audio transcription started!');
    setTimeout(() => {
      setTranscriptionFiles(prev => prev.map(f => ({
        ...f, transcribed: true, duration: '15:32', transcript: 'AI transcription complete.'
      })));
    }, 3000);
  };

  const handleDraftingSubmit = async (e) => {
    e.preventDefault();
    setDraftLoading(true);
    setDraftError(null);

    // Simulate API call with mock response
    try {
      setTimeout(() => {
        const mockDraft = `
IN THE CIRCUIT COURT OF THE ${currentCase.circuit.toUpperCase()}
IN AND FOR FLORIDA
JUVENILE DIVISION

Case Name: ${motionFormData.caseName}
Case Number: ${motionFormData.caseNumber}

MOTION FOR INCREASED VISITATION

TO THE HONORABLE JUDGE OF THIS COURT:

COMES NOW, the Petitioner, appearing pro se, and respectfully moves this Court for an Order increasing visitation with the minor child(ren) and states:

1. INTRODUCTION
Petitioner is the natural parent of the minor child(ren) subject to this dependency proceeding and respectfully requests this Court grant increased visitation based on substantial compliance with the case plan and demonstrated progress in addressing the issues that led to the dependency.

2. STATEMENT OF FACTS
${motionFormData.reason}

3. LEGAL BASIS
Florida Statute § 39.402 provides that parents have a fundamental liberty interest in the care, custody, and control of their children. The Court should consider the best interests of the child while preserving the parent-child relationship to the maximum extent possible.

4. PRAYER FOR RELIEF
WHEREFORE, Petitioner respectfully requests this Honorable Court:
${motionFormData.outcome}

Respectfully submitted,

_________________________
[Your Name]
[Your Address]
[Your Phone Number]
Pro Se Petitioner

CERTIFICATE OF SERVICE

I HEREBY CERTIFY that a true and correct copy of the foregoing has been furnished to all parties of record by [method of service] on this _____ day of _______, 2025.

_________________________
[Your Name]`;
        
        setAiDraft(mockDraft);
        setDraftLoading(false);
      }, 2000);
    } catch (err) {
      setDraftError('Failed to generate draft. Please try again.');
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

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-700 mb-2">Welcome back, {userName}</h1>
            <p className="text-slate-600 text-lg">Your family's legal journey continues with strength and determination.</p>
          </div>
          <Scale className="h-20 w-20 text-slate-400 opacity-50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-100 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Case: {currentCase.number}</div>
          </div>
          <div className="bg-slate-100 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Next Hearing: {currentCase.nextHearing}</div>
          </div>
          <div className="bg-slate-100 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">{currentCase.circuit}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <div className="bg-slate-700 rounded-full p-3 mr-4">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-700">AI Legal Assistant</h2>
            <p className="text-slate-600">Powered by Advanced Legal Intelligence</p>
          </div>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg mb-4">
          <p className="text-slate-700">"Good morning! I've reviewed your case file. Based on the upcoming hearing date, I recommend we prepare a Motion for Increased Visitation. Shall I help you draft this document?"</p>
          <div className="flex flex-wrap gap-3 mt-3">
            <button onClick={() => handleQuickAction("Yes, Draft Motion")} className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors">Yes, Draft Motion</button>
            <button onClick={() => handleQuickAction("Show Options")} className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-lg text-sm hover:bg-orange-50 transition-colors">Show Options</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-700">Case Overview</h2>
          <span className="text-sm text-slate-600">Current status and progress</span>
        </div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Case Progress</span>
            <span className="text-sm font-medium text-slate-700">{currentCase.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-orange-600 h-2 rounded-full transition-all duration-300" style={{ width: `${currentCase.progress}%` }}></div>
          </div>
        </div>
        <div className="space-y-3">
          {caseProgress.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                {item.status === 'Complete' ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                ) : item.status === 'In Progress' ? (
                  <Clock className="h-5 w-5 text-orange-500 mr-3" />
                ) : (
                  <Calendar className="h-5 w-5 text-slate-400 mr-3" />
                )}
                <span className="font-medium text-slate-700">{item.task}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Complete' ? 'bg-green-100 text-green-800' : item.status === 'In Progress' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-orange-600 mr-3" />
            <h2 className="text-xl font-bold text-slate-700">Upcoming Events</h2>
          </div>
          <span className="text-sm text-slate-600">Critical dates and deadlines</span>
        </div>
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${event.type === 'critical' ? 'border-red-400 bg-red-50' : event.type === 'important' ? 'border-orange-400 bg-orange-50' : 'border-green-400 bg-green-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{event.title}</h3>
                  <p className="text-sm text-slate-600">{event.date}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${event.type === 'critical' ? 'bg-red-200 text-red-800' : event.type === 'important' ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'}`}>
                    {event.daysRemaining} days remaining
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <Zap className="h-6 w-6 text-slate-600 mr-3" />
          <h2 className="text-xl font-bold text-slate-700">Quick Tools</h2>
          <span className="ml-auto text-sm text-slate-600">Essential utilities</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickTools.map((tool, index) => (
            <button 
              key={index} 
              className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex flex-col items-center space-y-2" 
              onClick={() => {
                if (tool.title === 'Upload Evidence') fileInputRef.current?.click();
                if (tool.title === 'Transcription') setActiveTab('transcription');
                if (tool.title === 'File Converter') showSuccessNotification('This feature is not yet implemented.');
                if (tool.title === 'Deadline Calc') setActiveTab('timeline');
              }}
            >
              <tool.icon className={`h-6 w-6 ${tool.color}`} />
              <span className="text-sm font-medium text-slate-700">{tool.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <Heart className="h-6 w-6 text-green-600 mr-3" />
          <h2 className="text-xl font-bold text-slate-700">Support</h2>
          <span className="ml-auto text-sm text-slate-600">Help and resources</span>
        </div>
        <div className="space-y-3">
          {supportResources.map((resource, index) => (
            <button key={index} className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center">
              <resource.icon className={`h-5 w-5 mr-3 ${resource.color}`} />
              <span className="font-medium text-slate-700">{resource.title}</span>
              <ChevronRight className="h-4 w-4 ml-auto text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-700">Document Center</h1>
          <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Upload className="h-4 w-4 mr-2" />Upload Files
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Lightbulb className="h-6 w-6 text-orange-500 mr-3" />
          <h2 className="text-lg font-semibold text-slate-700">Smart Suggestion</h2>
        </div>
        <p className="text-slate-600 mb-4">Based on your case timeline, I recommend filing a Motion for Increased Visitation before your next hearing.</p>
        <button onClick={() => { setActiveTab('motion_drafting'); handleQuickAction("Start Drafting"); }} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">Start Drafting Now</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 text-orange-600 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-slate-700">Legal Document Drafting</h2>
            <p className="text-slate-600">AI-powered document creation with Florida Rules compliance</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {documentTypes.map((type) => (
            <button 
              key={type.id} 
              onClick={() => { 
                setActiveTab('motion_drafting'); 
                setMotionFormData({ 
                  ...motionFormData, 
                  caseName: currentCase.number, 
                  caseNumber: currentCase.number, 
                  reason: '', 
                  outcome: `Motion for a ${type.title} based on the facts of my case.` 
                }); 
              }} 
              className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-center"
            >
              <type.icon className={`h-8 w-8 mx-auto mb-2 ${type.color}`} />
              <h3 className="font-semibold text-slate-700">{type.title}</h3>
              <p className="text-xs text-slate-500">{type.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-slate-700 mr-3" />
            <h2 className="text-xl font-bold text-slate-700">Recent Documents</h2>
          </div>
          <span className="text-sm text-slate-600">Your latest legal filings and drafts</span>
        </div>
        <div className="space-y-4">
          {recentDocuments.map((doc, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <doc.icon className={`h-5 w-5 mr-3 ${doc.color}`} />
                  <div>
                    <h3 className="font-semibold text-slate-800">{doc.title}</h3>
                    <p className="text-sm text-slate-600">{doc.type} • {doc.modified || doc.filed || doc.created}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${doc.status === 'FILED' ? 'bg-green-100 text-green-800' : doc.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                    {doc.status}
                  </span>
                  <div className="flex space-x-2">
                    {doc.actions.map((action, actionIndex) => (
                      <button key={actionIndex} onClick={() => showSuccessNotification(`${action} action initiated`)} className={`px-3 py-1 rounded text-xs ${action === 'Continue' || action === 'Edit' ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'} transition-colors`}>
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Recently Uploaded</h2>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="p-3