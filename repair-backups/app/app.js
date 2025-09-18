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
  Printer,
} from 'lucide-react';

// If you have a Dashboard component, import it. If not, this file renders the dashboard inline.
// import Dashboard from './components/dashboard/Dashboard';

export default function WeTheParentApp() {
  // --- State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmergencyMode, setShowEmergencyMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [transcriptionFiles, setTranscriptionFiles] = useState([]);
  const [researchQuery, setResearchQuery] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('Motion');
  const [showNotification, setShowNotification] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [motionFormData, setMotionFormData] = useState({
    caseName: '',
    caseNumber: '',
    reason: '',
    outcome: '',
  });
  const [aiDraft, setAiDraft] = useState('');
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gemini-pro');
  const [selectedDatabase, setSelectedDatabase] = useState('google_scholar');
  const [researchResults, setResearchResults] = useState(null);
  const [researchLoading, setResearchLoading] = useState(false);
  const [complianceReport, setComplianceReport] = useState(null);
  const [caseData, setCaseData] = useState({
    caseSummary: { caseNumber: '2024-DP-000587-XXDP-BC', nextHearing: 'March 15, 2025', status: 'Active', progress: 65 },
    documentSummary: {},
    upcomingDeadlines: [],
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [constitutionalData, setConstitutionalData] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [legalStrategyReport, setLegalStrategyReport] = useState(null);
  const [objectionText, setObjectionText] = useState('');
  const [weaknessReport, setWeaknessReport] = useState(null);
  const [proSeGuideData, setProSeGuideData] = useState([]);
  const [userName, setUserName] = useState('Christina');

  // --- Mock data (kept from your original)
  const currentCase = {
    number: '2024-DP-000587-XXDP-BC',
    nextHearing: 'March 15, 2025',
    circuit: '5th Judicial Circuit',
    progress: 65,
    daysRemaining: 3,
    status: 'Active',
  };

  const caseProgress = [
    { task: 'Parenting Classes', status: 'Complete', progress: 100 },
    { task: 'Housing Stability', status: 'In Progress', progress: 75 },
    { task: 'Substance Abuse Program', status: 'In Progress', progress: 60 },
    { task: 'Mental Health Evaluation', status: 'Scheduled', progress: 0 },
  ];

  const recentDocuments = [
    {
      title: 'Motion for Increased Visitation',
      type: 'Motion',
      status: 'DRAFT',
      modified: '2 hours ago',
      actions: ['Continue', 'Preview', 'Share'],
      icon: Edit3,
      color: 'text-orange-600',
    },
    {
      title: 'Parental Progress Affidavit',
      type: 'Affidavit',
      status: 'FILED',
      filed: 'March 10, 2025',
      actions: ['View', 'Download', 'Copy'],
      icon: FileCheck,
      color: 'text-blue-600',
    },
    {
      title: 'Supporting Evidence Compilation',
      type: 'Exhibit List',
      status: 'REVIEW',
      created: 'March 8, 2025',
      actions: ['Edit', 'Preview', 'Share'],
      icon: List,
      color: 'text-green-600',
    },
  ];

  const recentResearch = ['Troxel v. Granville - Parental Rights', 'Florida Statute § 39.507 - Shelter Hearings', 'Santosky v. Kramer - Evidence Standard'];

  const constitutionalCategories = [
    { title: 'Due Process', icon: Scale, description: 'Constitutional protections' },
    { title: 'Emergency Removal', icon: AlertTriangle, description: 'Urgent procedures' },
    { title: 'Custody Rights', icon: Users, description: 'Parental authority' },
    { title: 'GAL Authority', icon: Shield, description: 'Guardian ad litem' },
  ];

  const supportResources = [
    { title: 'Self-Help Guide', icon: HelpCircle, color: 'text-blue-600' },
    { title: 'Courtroom Etiquette', icon: Gavel, color: 'text-purple-600' },
    { title: 'Emergency Contacts', icon: Phone, color: 'text-red-600' },
    { title: 'Parent Support Groups', icon: UserCheck, color: 'text-green-600' },
  ];

  const quickTools = [
    { title: 'Upload Evidence', icon: FileUp, color: 'text-blue-500' },
    { title: 'Transcription', icon: Headphones, color: 'text-purple-500' },
    { title: 'File Converter', icon: RefreshCw, color: 'text-green-500' },
    { title: 'Deadline Calc', icon: Calculator, color: 'text-orange-500' },
  ];

  const documentTypes = [
    { id: 'motion', title: 'Motion', subtitle: 'File requests', icon: Edit3, color: 'text-orange-600' },
    { id: 'affidavit', title: 'Affidavit', subtitle: 'Sworn statement', icon: FileCheck, color: 'text-blue-600' },
    { id: 'objection', title: 'Objection', subtitle: 'Challenge evidence', icon: AlertTriangle, color: 'text-red-600' },
    { id: 'exhibits', title: 'Exhibits', subtitle: 'Evidence list', icon: List, color: 'text-green-600' },
  ];

  // --- Effects (initialize small data)
  useEffect(() => {
    // initial AI greeting message
    setChatMessages([
      {
        type: 'ai',
        content: "Good morning! I've reviewed your case file. Based on the upcoming hearing date, I recommend we prepare a Motion for Increased Visitation. Shall I help you draft this document?",
        timestamp: new Date().toISOString(),
        suggestions: ['Yes, Draft Motion', 'Show Options'],
      },
    ]);

    // attempt to fetch case-like data from your API endpoints, but fail gracefully
    fetchCaseData();
    fetchConstitutionalData();
    fetchTimelineEvents();
    fetchProSeGuideData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Fetch helpers (safe wrapper: they try to call your API, but won't crash if missing)
  const fetchCaseData = async () => {
    try {
      const res = await fetch('/api/case-data');
      if (!res.ok) throw new Error('no case-data');
      const json = await res.json();
      setCaseData(json);
    } catch (err) {
      // keep existing mock caseData, log for debugging
      console.warn('fetchCaseData failed (ok if not implemented):', err.message);
    }
  };

  const fetchConstitutionalData = async () => {
    try {
      const res = await fetch('/api/constitutional-law');
      if (!res.ok) throw new Error('no constitutional-law');
      const json = await res.json();
      setConstitutionalData(json.precedents || []);
    } catch (err) {
      console.warn('fetchConstitutionalData failed:', err.message);
    }
  };

  const fetchTimelineEvents = async () => {
    try {
      const res = await fetch('/api/timeline');
      if (!res.ok) throw new Error('no timeline');
      const json = await res.json();
      setTimelineEvents(json || []);
    } catch (err) {
      console.warn('fetchTimelineEvents failed:', err.message);
      // keep empty list
    }
  };

  const fetchProSeGuideData = async () => {
    try {
      const res = await fetch('/api/pro-se-guide');
      if (!res.ok) throw new Error('no pro-se guide');
      const json = await res.json();
      setProSeGuideData(json.topics || []);
    } catch (err) {
      console.warn('fetchProSeGuideData failed:', err.message);
    }
  };

  // --- Notification helper
  const showSuccessNotification = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(''), 4500);
  };

  // --- Handlers (lightweight, safe defaults). Replace with real logic later.
  const handleQuickAction = (action) => {
    // example shortcut mapping
    if (action === 'Yes, Draft Motion' || action === 'Start Drafting') {
      setActiveTab('motion_drafting');
      showSuccessNotification('Opening drafting tools...');
      return;
    }
    showSuccessNotification(`${action} clicked`);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    // quick mock: create file metadata and pretend to upload
    const added = files.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      category: 'Uploaded',
      processing: true,
    }));
    setUploadedFiles((s) => [...added, ...s]);
    // simulate processing delay
    setTimeout(() => {
      setUploadedFiles((s) => s.map((file) => ({ ...file, processing: false, analysis: { summary: 'Auto-summarized content (mock)' } })));
      setUploading(false);
      showSuccessNotification('Files uploaded and processed (mock)');
    }, 1500);
  };

  const handleAudioUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const added = files.map((f, i) => ({
      id: `${Date.now()}-audio-${i}`,
      name: f.name,
      duration: 'Unknown',
      transcribed: false,
    }));
    setTranscriptionFiles((s) => [...added, ...s]);
    // fake processing
    setTimeout(() => {
      setTranscriptionFiles((s) => s.map((file) => ({ ...file, transcribed: true, transcript: 'Transcription text (mock)' })));
      showSuccessNotification('Audio transcribed (mock)');
    }, 1800);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { type: 'user', content: chatInput.trim(), timestamp: new Date().toISOString() };
    setChatMessages((s) => [...s, userMsg]);
    setChatInput('');
    // Simulate AI response
    setTimeout(() => {
      const aiReply = { type: 'ai', content: `Mock reply to: "${userMsg.content}"`, timestamp: new Date().toISOString() };
      setChatMessages((s) => [...s, aiReply]);
      // scroll to bottom
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 800);
  };

  const handleGenerateObjectionResponse = async (text) => {
    if (!text) {
      showSuccessNotification('Enter an objection to respond to.');
      return;
    }
    showSuccessNotification('Generating objection response (mock)...');
    // placeholder
    setTimeout(() => {
      setChatMessages((s) => [...s, { type: 'ai', content: `Generated objection response to: "${text}"`, timestamp: new Date().toISOString() }]);
      showSuccessNotification('Objection response ready (mock).');
    }, 1000);
  };

  const handleGenerateEmergencyMotion = async (option) => {
    showSuccessNotification(`Generating ${option} (mock).`);
    // switch to drafting screen with a prefilled draft
    setActiveTab('motion_drafting');
    setMotionFormData((m) => ({ ...m, reason: `${option} - facts to support`, outcome: 'Emergency relief requested' }));
    setAiDraft(`${option} - Draft (auto-generated, mock)`);
  };

  const handleDraftingSubmit = async (e) => {
    e?.preventDefault?.();
    setDraftLoading(true);
    setDraftError(null);
    // Minimal mock: concatenate inputs and produce a draft
    try {
      // Insert your real AI call here and set aiDraft to the returned content
      const generated = `AI DRAFT (mock)
Document Type: ${selectedDocumentType}
Case: ${motionFormData.caseNumber || motionFormData.caseName}
Reason: ${motionFormData.reason}
Desired Outcome: ${motionFormData.outcome}`;
      // simulate delay
      await new Promise((r) => setTimeout(r, 900));
      setAiDraft(generated);
      showSuccessNotification('Draft generated (mock). Review carefully before filing.');
    } catch (err) {
      setDraftError('Failed to generate draft (mock).');
    } finally {
      setDraftLoading(false);
    }
  };

  const handleWeaknessDetection = async () => {
    if (!aiDraft) {
      showSuccessNotification('Please generate a draft first.');
      return;
    }
    showSuccessNotification('Detecting weaknesses (mock)...');
    setTimeout(() => {
      setWeaknessReport('Weaknesses found (mock): missing citation to Florida statute § 39.x');
      showSuccessNotification('Weakness report generated (mock).');
    }, 900);
  };

  const handleGenerateStrategy = async () => {
    showSuccessNotification('Generating legal strategy (mock)...');
    setTimeout(() => {
      setLegalStrategyReport('AI Legal Strategy (mock): Focus on evidentiary timeline and parenting classes results.');
      showSuccessNotification('Strategy generated (mock).');
    }, 1000);
  };

  const handleCopy = () => {
    if (!aiDraft) return showSuccessNotification('No draft to copy.');
    navigator.clipboard.writeText(aiDraft).then(() => showSuccessNotification('Draft copied to clipboard!'));
  };

  const handlePrint = () => {
    if (!aiDraft) return showSuccessNotification('No document to print.');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<pre>${aiDraft}</pre>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleNewEventSubmit = async (e) => {
    e?.preventDefault?.();
    if (!newEventTitle || !newEventDate) {
      return showSuccessNotification('Please provide a title and date.');
    }
    setIsAddingEvent(true);
    // Append locally; replace with API call later
    const ev = { title: newEventTitle, date: newEventDate, type: newEventDescription || 'other', daysRemaining: 10 };
    setTimelineEvents((s) => [ev, ...s]);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventDescription('');
    setIsAddingEvent(false);
    showSuccessNotification('Event added (local mock).');
  };

  const handleResearchSearch = async () => {
    if (!researchQuery.trim()) return showSuccessNotification('Enter a search query.');
    setResearchLoading(true);
    setResearchResults(null);
    // mock a result
    setTimeout(() => {
      setResearchResults({
        results: [{ title: `Mock result for "${researchQuery}"`, snippet: 'This is a mock search snippet', url: 'https://example.com' }],
        citations: 'Mock citations (Bluebook-style)',
      });
      setResearchLoading(false);
    }, 1000);
  };

  const handleExportData = () => {
    setShowExportModal(true);
    setTimeout(() => {
      const data = { caseDetails: caseData, uploadedFiles, chatHistory: chatMessages, aiDrafts: [{ type: selectedDocumentType, content: aiDraft }] };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `we-the-parent-backup-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowExportModal(false);
      showSuccessNotification('Data exported (mock).');
    }, 800);
  };

  // --- Render helpers: small subcomponents kept inline for simplicity

  const SuccessNotification = ({ message }) =>
    message ? (
      <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
        {message}
      </div>
    ) : null;

  const EmergencyPanel = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-red-600"><AlertTriangle className="inline-block mr-2" />Emergency Mode</h3>
          <button onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <p className="mb-4">Choose an emergency document type (mock generator).</p>
        <div className="space-y-2">
          {['Emergency Motion for Temporary Relief', 'Emergency Stay Request', 'Emergency Hearing Request', 'Expedited Filing Documents'].map((opt) => (
            <button key={opt} onClick={() => { handleGenerateEmergencyMotion(opt); onClose(); }} className="w-full p-3 rounded border text-left">
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // --- Main render sections (trimmed/organized versions of the originals)
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-700 mb-2">Welcome back, {userName}</h1>
            <p className="text-slate-600 text-lg">Your family’s legal journey continues with strength and determination.</p>
          </div>
          <Scale className="h-20 w-20 text-slate-400 opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-100 rounded-lg p-4"><div className="text-sm text-slate-600 mb-1">Case: {caseData.caseSummary.caseNumber}</div></div>
          <div className="bg-slate-100 rounded-lg p-4"><div className="text-sm text-slate-600 mb-1">Next Hearing: {caseData.caseSummary.nextHearing}</div></div>
          <div className="bg-slate-100 rounded-lg p-4"><div className="text-sm text-slate-600 mb-1">Status: {caseData.caseSummary.status}</div></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <div className="bg-slate-700 rounded-full p-3 mr-4"><Brain className="h-6 w-6 text-white" /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-700">AI Legal Assistant</h2>
            <p className="text-slate-600">Powered by Advanced Legal Intelligence</p>
          </div>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg mb-4">
          <p className="text-slate-700">"Good morning! I've reviewed your case file. Based on the upcoming hearing date, I recommend we prepare a Motion for Increased Visitation. Shall I help you draft this document?"</p>
          <div className="flex flex-wrap gap-3 mt-3">
            <button onClick={() => handleQuickAction('Yes, Draft Motion')} className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700">Yes, Draft Motion</button>
            <button onClick={() => handleQuickAction('Show Options')} className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-lg text-sm hover:bg-orange-50">Show Options</button>
          </div>
        </div>
      </div>

      {/* Case overview & progress */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-700">Case Overview</h2>
          <span className="text-sm text-slate-600">Current status and progress</span>
        </div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Case Progress</span>
            <span className="text-sm font-medium text-slate-700">{caseData.caseSummary.progress || 0}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-orange-600 h-2 rounded-full transition-all duration-300" style={{ width: `${caseData.caseSummary.progress || 0}%` }} />
          </div>
        </div>

        <div className="space-y-3">
          {caseProgress.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                {item.status === 'Complete' ? (<CheckCircle className="h-5 w-5 text-green-500 mr-3" />) : item.status === 'In Progress' ? (<Clock className="h-5 w-5 text-orange-500 mr-3" />) : (<Calendar className="h-5 w-5 text-slate-400 mr-3" />)}
                <span className="font-medium text-slate-700">{item.task}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Complete' ? 'bg-green-100 text-green-800' : item.status === 'In Progress' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'}`}>{item.status}</span>
            </div>
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
          <div className="flex space-x-4">
            <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Upload className="h-4 w-4 mr-2" />Upload Files
            </button>
            <button onClick={handleExportData} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
              <Download className="h-4 w-4 mr-2" />Export Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {documentTypes.map((type) => (
            <button key={type.id} onClick={() => { setActiveTab('motion_drafting'); setSelectedDocumentType(type.title); }} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-center">
              <type.icon className={`h-8 w-8 mx-auto mb-2 ${type.color}`} />
              <h3 className="font-semibold text-slate-700">{type.title}</h3>
              <p className="text-xs text-slate-500">{type.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center"><FileText className="h-6 w-6 text-slate-700 mr-3" /><h2 className="text-xl font-bold text-slate-700">Recent Documents</h2></div>
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
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${doc.status === 'FILED' ? 'bg-green-100 text-green-800' : doc.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{doc.status}</span>
                  <div className="flex space-x-2">
                    {doc.actions.map((action, actionIndex) => (
                      <button key={actionIndex} onClick={() => showSuccessNotification(`${action} action initiated`)} className={`px-3 py-1 rounded text-xs ${action === 'Continue' || action === 'Edit' ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'} transition-colors`}>{action}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.jpg,.png" onChange={handleFileUpload} className="hidden" />
      </div>
    </div>
  );

  const renderResearch = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-700 mb-4">Legal Research Center</h1>
        <div className="flex space-x-2">
          <input type="text" placeholder="Search constitutional law, cases, statutes..." className="flex-1 p-3 border border-slate-300 rounded-lg" value={researchQuery} onChange={(e) => setResearchQuery(e.target.value)} />
          <select value={selectedDatabase} onChange={(e) => setSelectedDatabase(e.target.value)} className="p-3 border border-slate-300 rounded-lg">
            <option value="google_scholar">Google Scholar</option>
            <option value="justia">Justia</option>
          </select>
          <button onClick={handleResearchSearch} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">{researchLoading ? 'Searching...' : <Search className="h-5 w-5" />}</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center"><Search className="h-6 w-6 text-green-600 mr-3" /><div><h2 className="text-xl font-bold text-slate-700">Constitutional Law Repository</h2><p className="text-slate-600">Searchable precedents and legal authorities</p></div></div>
          <ExternalLink className="h-5 w-5 text-slate-400" />
        </div>

        <div className="space-y-4">
          {constitutionalData.map((precedent, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">{precedent.title}</h3>
              <p className="text-sm text-slate-700 mb-2">{precedent.content}</p>
              <span className="text-xs font-medium text-slate-500">Relevance: {precedent.relevance}</span>
            </div>
          ))}
        </div>

        {researchResults && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-slate-700 mb-4">Search Results</h3>
            <div className="bg-slate-50 p-4 rounded-lg space-y-4">
              {researchResults.results.map((result, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-lg">
                  <h4 className="font-semibold text-blue-600"><a href={result.url} target="_blank" rel="noreferrer">{result.title}</a></h4>
                  <p className="text-sm text-slate-600">{result.snippet}</p>
                  <a href={result.url} target="_blank" rel="noreferrer" className="text-xs text-green-600 hover:underline">{result.url}</a>
                </div>
              ))}
            </div>
            {researchResults.citations && <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200 mt-4">{researchResults.citations}</pre>}
          </div>
        )}
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-700 mb-6">Timeline & Deadlines</h1>
        <form onSubmit={handleNewEventSubmit} className="mb-4 flex gap-2">
          <input value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} placeholder="Event title" className="px-3 py-2 border rounded w-1/3" />
          <input type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} className="px-3 py-2 border rounded" />
          <input value={newEventDescription} onChange={(e) => setNewEventDescription(e.target.value)} placeholder="Description/type" className="px-3 py-2 border rounded flex-1" />
          <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded">{isAddingEvent ? 'Adding...' : 'Add Event'}</button>
        </form>

        <div className="space-y-4">
          {timelineEvents.map((event, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-l-4 ${event.type === 'critical' ? 'border-red-400 bg-red-50' : event.type === 'important' ? 'border-orange-400 bg-orange-50' : 'border-green-400 bg-green-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{event.title}</h3>
                  <p className="text-sm text-slate-600">{event.date}</p>
                </div>
                <div className="text-right"><span className="px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800">{event.daysRemaining ?? '—'} days</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTranscription = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-700 mb-6">AI Transcription Center</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-blue-50 p-6 rounded-lg">
              <Headphones className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Audio Transcription</h3>
              <p className="text-blue-700 mb-4">Upload audio/video for automatic transcription (mock).</p>
              <button onClick={() => audioInputRef.current?.click()} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Upload Audio</button>
            </div>
          </div>

          <div className="space-y-4">
            {transcriptionFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3">Transcription Queue</h3>
                <div className="space-y-3">
                  {transcriptionFiles.map((file) => (
                    <div key={file.id} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-700">{file.name}</span>
                        <span className="text-sm text-slate-500">{file.duration}</span>
                      </div>
                      {file.transcribed ? <div><span className="text-xs text-green-600">Transcription Complete</span><p className="text-sm text-slate-600 mt-2">{file.transcript}</p></div> : <div className="flex items-center"><RefreshCw className="h-4 w-4 text-blue-500 animate-spin mr-2" /><span className="text-sm text-blue-600">Processing...</span></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <input ref={audioInputRef} type="file" multiple accept="audio/*,video/*" onChange={handleAudioUpload} className="hidden" />
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-700">AI Legal Assistant</h1>
        <p className="text-slate-600">Get instant legal guidance for your Florida juvenile dependency case</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-96 max-h-96">
        {chatMessages.map((message, i) => (
          <div key={i} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl p-4 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
              <p className="whitespace-pre-line">{message.content}</p>
              {message.suggestions && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.suggestions.map((s, idx) => <button key={idx} onClick={() => handleQuickAction(s)} className="bg-white px-3 py-1 rounded text-sm">{s}</button>)}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-6 border-t border-slate-200">
        <div className="flex space-x-2">
          <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask me about legal documents, case strategy, or procedures..." className="flex-1 px-4 py-3 border border-slate-300 rounded-lg" />
          <button onClick={() => setIsRecording(!isRecording)} className={`px-4 py-3 rounded-lg ${isRecording ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-700'}`}><Mic className="h-5 w-5" /></button>
          <button onClick={handleSendMessage} disabled={!chatInput.trim()} className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white px-6 py-3 rounded-lg">Send</button>
        </div>
      </div>
    </div>
  );

  const renderDocumentDrafting = () => (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Draft a Legal Document</h1>
      <p className="text-gray-600 mb-8">Select a document type and fill out the form. The AI will generate a draft for you. <strong>Remember to review it carefully before filing.</strong></p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleDraftingSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Document Type</label>
              <select value={selectedDocumentType} onChange={(e) => setSelectedDocumentType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>Motion</option>
                <option>Affidavit</option>
                <option>Objection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">AI Model</label>
              <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="gemini-pro">Google Gemini Pro</option>
                <option value="gpt-4o">OpenAI GPT-4o</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Case Name</label>
              <input value={motionFormData.caseName} onChange={(e) => setMotionFormData({ ...motionFormData, caseName: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Case Number</label>
              <input value={motionFormData.caseNumber} onChange={(e) => setMotionFormData({ ...motionFormData, caseNumber: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>

            {/* variable form fields */}
            {selectedDocumentType === 'Motion' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason for Motion</label>
                  <textarea value={motionFormData.reason} onChange={(e) => setMotionFormData({ ...motionFormData, reason: e.target.value })} rows={5} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Desired Outcome</label>
                  <input value={motionFormData.outcome} onChange={(e) => setMotionFormData({ ...motionFormData, outcome: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
              </>
            )}

            <div className="flex space-x-2">
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700" disabled={draftLoading}>{draftLoading ? 'Generating...' : 'Generate Draft'}</button>
              {aiDraft && <button type="button" onClick={handleWeaknessDetection} className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">Detect Weaknesses</button>}
            </div>
          </form>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md min-h-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">AI-Generated Draft</h2>
              {aiDraft && (
                <div className="flex space-x-2">
                  <button onClick={handleCopy} className="p-2 rounded-md hover:bg-gray-100"><Copy /></button>
                  <button onClick={handlePrint} className="p-2 rounded-md hover:bg-gray-100"><Printer /></button>
                </div>
              )}
            </div>

            {draftError && <p className="text-red-500">{draftError}</p>}
            {draftLoading && <p className="text-gray-500">Generating your draft...</p>}
            {aiDraft ? <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200">{aiDraft}</pre> : <p className="text-gray-400 italic">Your draft will appear here after you submit the form.</p>}
          </div>

          {complianceReport && <div className="mt-6 p-6 bg-yellow-50 rounded-lg shadow-md"><h3 className="text-lg font-bold text-yellow-800 mb-2">Compliance Check</h3><pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{complianceReport}</pre></div>}
          {legalStrategyReport && <div className="mt-6 p-6 bg-blue-50 rounded-lg shadow-md"><h3 className="text-lg font-bold text-blue-800 mb-2">Legal Strategy Report</h3><pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{legalStrategyReport}</pre></div>}
          {weaknessReport && <div className="mt-6 p-6 bg-red-50 rounded-lg shadow-md"><h3 className="text-lg font-bold text-red-800 mb-2">Weakness Detection</h3><pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{weaknessReport}</pre></div>}
        </div>
      </div>
    </div>
  );

  // --- Top-level content switch
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'documents':
        return renderDocuments();
      case 'research':
        return renderResearch();
      case 'timeline':
        return renderTimeline();
      case 'transcription':
        return renderTranscription();
      case 'chat':
        return renderChat();
      case 'motion_drafting':
        return renderDocumentDrafting();
      default:
        return renderDashboard();
    }
  };

  // --- Layout returned
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <SuccessNotification message={showNotification} />
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <Download className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-xl font-bold text-slate-800">Exporting Data</h2>
            </div>
            <p className="text-gray-700 mb-6">Your data is being compiled... (mock)</p>
            <div className="flex justify-center"><RefreshCw className="h-6 w-6 text-blue-500 animate-spin" /></div>
          </div>
        </div>
      )}

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
                { id: 'research', label: 'Research', icon: Search },
                { id: 'timeline', label: 'Timeline', icon: Calendar },
                { id: 'legal_strategy', label: 'Legal Strategy', icon: Gavel },
                { id: 'pro_se_guide', label: 'Pro Se Guide', icon: HelpCircle },
              ].map((nav) => (
                <button key={nav.id} onClick={() => setActiveTab(nav.id)} className={`px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === nav.id ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-700 hover:text-orange-600'}`}>
                  <nav.icon className="h-4 w-4" />
                  <span>{nav.label}</span>
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => setActiveTab('chat')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" /><span>AI Chat</span>
              </button>

              <button onClick={() => setShowEmergencyMode(true)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" /><span>Emergency</span>
              </button>

              <div className="flex items-center">
                <div className="bg-slate-700 rounded-full p-2 mr-2"><User className="h-5 w-5 text-white" /></div>
                <span className="text-sm font-medium text-slate-700">{userName}</span>
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-slate-400 hover:text-slate-500">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 sm:px-3 bg-slate-50">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'research', label: 'Research', icon: Search },
              { id: 'timeline', label: 'Timeline', icon: Calendar },
              { id: 'legal_strategy', label: 'Legal Strategy', icon: Gavel },
              { id: 'pro_se_guide', label: 'Pro Se Guide', icon: HelpCircle },
            ].map((nav) => (
              <button key={nav.id} onClick={() => { setActiveTab(nav.id); setMobileMenuOpen(false); }} className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 ${activeTab === nav.id ? 'bg-orange-100 text-orange-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                <nav.icon className="h-5 w-5" />
                <span>{nav.label}</span>
              </button>
            ))}
            <button onClick={() => { setShowEmergencyMode(true); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-red-50">
              <AlertTriangle className="h-5 w-5" /><span>Emergency</span>
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {showEmergencyMode && <EmergencyPanel onClose={() => setShowEmergencyMode(false)} />}

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800">We The Parent™</h3>
              <p className="text-sm text-slate-600">Protecting Families Through Law</p>
            </div>
            <div className="text-sm text-slate-500 mt-4 md:mt-0">© {new Date().getFullYear()} We The Parent</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
