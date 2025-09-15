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
import Dashboard from './components/dashboard/Dashboard';

const WeTheParentApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmergencyMode, setShowEmergencyMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [transcriptionFiles, setTranscriptionFiles] = useState([]);
  const [researchQuery, setResearchQuery] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('Motion');
  const [showNotification, setShowNotification] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [motionFormData, setMotionFormData] = useState({ caseName: '', caseNumber: '', reason: '', outcome: '' });
  const [aiDraft, setAiDraft] = useState('');
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gemini-pro');
  const [selectedDatabase, setSelectedDatabase] = useState('google_scholar');
  const [researchResults, setResearchResults] = useState(null);
  const [researchLoading, setResearchLoading] = useState(false);
  const [complianceReport, setComplianceReport] = useState(null);
  const [caseData, setCaseData] = useState({ caseSummary: {}, documentSummary: {}, upcomingDeadlines: [] });
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
      content: "Good morning! I&apos;ve reviewed your case file. Based on the upcoming hearing date, I recommend we prepare a Motion for Increased Visitation. Shall I help you draft this document?",
      timestamp: new Date().toISOString(),
      suggestions: ["Yes, Draft Motion", "Show Options"]
    }]);
  }, []);

  // Fetch case data, constitutional data, and timeline events on mount
  useEffect(() => {
    fetchCaseData();
    fetchConstitutionalData();
    fetchTimelineEvents();
    fetchProSeGuideData();
  }, []);

  const fetchCaseData = async () => {
    try {
      const response = await fetch('/api/case-data');
      if (!response.ok) {
        throw new Error('Failed to fetch case data.');
      }
      const data = await response.json();
      setCaseData(data);
    } catch (error) {
      console.error('Failed to fetch case data:', error);
    }
  };
  
  const fetchConstitutionalData = async () => {
    try {
      const response = await fetch('/api/constitutional-law');
      if (!response.ok) {
        throw new Error('Failed to fetch constitutional law data.');
      }
      const data = await response.json();
      setConstitutionalData(data.precedents);
    } catch (error) {
      console.error("Failed to fetch constitutional law data:", error);
    }
  };

  const fetchTimelineEvents = async () => {
    try {
      const response = await fetch('/api/timeline');
      if (!response.ok) {
        throw new Error('Failed to fetch timeline events.');
      }
      const data = await response.json();
      setTimelineEvents(data);
    } catch (error) {
      console.error('Failed to fetch timeline events:', error);
    }
  };

  const fetchProSeGuideData = async () => {
    try {
      const response = await fetch('/api/pro-se-guide');
      if (!response.ok) {
        throw new Error('Failed to fetch pro se guide data.');
      }
      const data = await response.json();
      setProSeGuideData(data.topics);
    } catch (error) {
      console.error('Failed to fetch pro se guide data:', error);
    }
  };

  const handleNewEventSubmit = async (e) => {
    e.preventDefault();
    setIsAddingEvent(true);
    const newEvent = {
      title: newEventTitle,
      date: newEventDate,
      type: newEventDescription, // 'description' is used as 'type' in the backend mock
    };

    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error('Failed to add new event.');
      }

      showSuccessNotification('New event added successfully!');
      fetchTimelineEvents(); // Refresh the event list
      setNewEventTitle('');
      setNewEventDate('');
      setNewEventDescription('');
    } catch (error) {
      console.error('Add event error:', error);
      showSuccessNotification('Failed to add event.');
    } finally {
      setIsAddingEvent(false);
    }
  };

  const handleGenerateStrategy = async () => {
    showSuccessNotification('Generating legal strategy...');
    try {
      const response = await fetch('/api/legal-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseSummary: 'Case facts from documents and chat history...' }), // Placeholder summary
      });
      if (!response.ok) {
        throw new Error('Failed to generate legal strategy.');
      }
      const data = await response.json();
      setLegalStrategyReport(data.report);
      showSuccessNotification('Legal strategy generated successfully!');
    } catch (error) {
      console.error('Legal strategy error:', error);
      setLegalStrategyReport(`Error generating strategy: ${error.message}`);
      showSuccessNotification('Failed to generate legal strategy.');
    }
  };

  const handleWeaknessDetection = async () => {
    if (!aiDraft) {
      showSuccessNotification('Please generate a draft first.');
      return;
    }

    showSuccessNotification('Detecting weaknesses in draft...');
    try {
      const response = await fetch('/api/case-weakness-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentContent: aiDraft }),
      });
      if (!response.ok) {
        throw new Error('Failed to detect weaknesses.');
      }
      const data = await response.json();
      setWeaknessReport(data.report);
      showSuccessNotification('Weakness report generated!');
    } catch (error) {
      console.error('Weakness detection error:', error);
      setWeaknessReport(`Error detecting weaknesses: ${error.message}`);
      showSuccessNotification('Failed to detect weaknesses.');
    }
  };
  
  const handlePrint = () => {
    if (aiDraft) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Printable Document</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        @page { size: letter; margin: 1in; }
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; margin: 1in; }
        .document-title { text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 24pt; }
        .caption { font-size: 10pt; margin-bottom: 12pt; }
        .caption-label { font-weight: bold; }
        .signature-line { margin-top: 48pt; border-top: 1px solid black; padding-top: 6pt; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
      `);
      printWindow.document.write('</style></head><body>');
      printWindow.document.write(`<div class="printable-content">${aiDraft}</div>`);
      printWindow.document.close();
      printWindow.print();
    } else {
      showSuccessNotification('No document to print.');
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
  
  const handleResearchSearch = async () => {
    setResearchLoading(true);
    setResearchResults(null); // Clear previous results
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: researchQuery, database: selectedDatabase }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch legal research.');
      }
      
      const data = await response.json();
      setResearchResults(data);
    } catch (error) {
      console.error('Research Error:', error);
      showSuccessNotification('Failed to fetch research. Please try again.');
    } finally {
      setResearchLoading(false);
    }
  };

  const handleExportData = () => {
    // This is a placeholder function to simulate data export.
    setShowExportModal(true);
    setTimeout(() => {
      const data = {
        caseDetails: caseData,
        uploadedFiles: uploadedFiles,
        chatHistory: chatMessages,
        aiDrafts: [{ type: selectedDocumentType, content: aiDraft, report: complianceReport }],
      };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = `we-the-parent-backup-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      setShowExportModal(false);
      showSuccessNotification('Data export complete!');
    }, 2000);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-3xl font-bold text-slate-700 mb-2">Welcome back, {userName}</h1>
          <p className="text-slate-600 text-lg">Your family&apos;s legal journey continues with strength and determination.</p></div>
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
          <div><h2 className="text-xl font-bold text-slate-700">AI Legal Assistant</h2><p className="text-slate-600">Powered by Advanced Legal Intelligence</p></div>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg mb-4">
          <p className="text-slate-700">&quot;Good morning! I&apos;ve reviewed your case file. Based on the upcoming hearing date, I recommend we prepare a Motion for Increased Visitation. Shall I help you draft this document?&quot;</p>
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
            <span className="text-sm font-medium text-slate-700">{caseData.caseSummary.progress || 0}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-orange-600 h-2 rounded-full transition-all duration-300" style={{ width: `${caseData.caseSummary.progress || 0}%` }}></div>
          </div>
        </div>
        <div className="space-y-3">
          {caseProgress.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                {item.status === 'Complete' ? (<CheckCircle className="h-5 w-5 text-green-500 mr-3" />) : item.status === 'In Progress' ? (<Clock className="h-5 w-5 text-orange-500 mr-3" />) : (<Calendar className="h-5 w-5 text-slate-400 mr-3" />)}
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
          <div className="flex items-center"><Calendar className="h-6 w-6 text-orange-600 mr-3" /><h2 className="text-xl font-bold text-slate-700">Upcoming Events</h2></div>
          <span className="text-sm text-slate-600">Critical dates and deadlines</span>
        </div>
        <div className="space-y-4">
          {caseData.upcomingDeadlines.map((event, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${event.type === 'critical' ? 'border-red-400 bg-red-50' : event.type === 'important' ? 'border-orange-400 bg-orange-50' : 'border-green-400 bg-green-50'}`}>
              <div className="flex items-center justify-between">
                <div><h3 className="font-semibold text-slate-800">{event.title}</h3><p className="text-sm text-slate-600">{event.date}</p></div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${event.type === 'critical' ? 'bg-red-200 text-red-800' : event.type === 'important' ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'}`}>
                    {event.daysRemaining} days remaining
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
            <Plus className="h-4 w-4 mr-2" />Add Event
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <Zap className="h-6 w-6 text-slate-600 mr-3" /><h2 className="text-xl font-bold text-slate-700">Quick Tools</h2><span className="ml-auto text-sm text-slate-600">Essential utilities</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickTools.map((tool, index) => (
            <button key={index} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex flex-col items-center space-y-2" onClick={() => {
              if (tool.title === 'Upload Evidence') fileInputRef.current?.click();
              if (tool.title === 'Transcription') setActiveTab('transcription');
              if (tool.title === 'File Converter') showSuccessNotification('This feature is not yet implemented.');
              if (tool.title === 'Deadline Calc') setActiveTab('timeline');
            }}>
              <tool.icon className={`h-6 w-6 ${tool.color}`} /><span className="text-sm font-medium text-slate-700">{tool.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <Heart className="h-6 w-6 text-green-600 mr-3" /><h2 className="text-xl font-bold text-slate-700">Support</h2><span className="ml-auto text-sm text-slate-600">Help and resources</span>
        </div>
        <div className="space-y-3">
          {supportResources.map((resource, index) => (
            <button key={index} className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center">
              <resource.icon className={`h-5 w-5 mr-3 ${resource.color}`} /><span className="font-medium text-slate-700">{resource.title}</span><ChevronRight className="h-4 w-4 ml-auto text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
    <Dashboard
      userName={userName}
      caseData={caseData}
      handleQuickAction={handleQuickAction}
      setActiveTab={setActiveTab}
      fileInputRef={fileInputRef}
      showSuccessNotification={showSuccessNotification}
    />
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-700">Document Center</h1>
          <div className="flex space-x-4">
            <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Upload className="h-4 w-4 mr-2" />Upload Files
            </button>
            <button onClick={handleExportData} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
              <Download className="h-4 w-4 mr-2" />Export Data
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-4"><Lightbulb className="h-6 w-6 text-orange-500 mr-3" /><h2 className="text-lg font-semibold text-slate-700">Smart Suggestion</h2></div>
        <p className="text-slate-600 mb-4">Based on your case timeline, I recommend filing a Motion for Increased Visitation before your next hearing.</p>
        <button onClick={() => { setActiveTab('motion_drafting'); handleQuickAction("Start Drafting"); }} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">Start Drafting Now</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6"><FileText className="h-6 w-6 text-orange-600 mr-3" />
          <div><h2 className="text-xl font-bold text-slate-700">Legal Document Drafting</h2><p className="text-slate-600">AI-powered document creation with Florida Rules compliance</p></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {documentTypes.map((type) => (
            <button key={type.id} onClick={() => { setActiveTab('motion_drafting'); setMotionFormData({ ...motionFormData, caseName: caseData.caseSummary.caseNumber, caseNumber: caseData.caseSummary.caseNumber, reason: '', outcome: `Motion for a ${type.title} based on the facts of my case.` }); }} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-center">
              <type.icon className={`h-8 w-8 mx-auto mb-2 ${type.color}`} /><h3 className="font-semibold text-slate-700">{type.title}</h3><p className="text-xs text-slate-500">{type.subtitle}</p>
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
                <div className="flex items-center"><doc.icon className={`h-5 w-5 mr-3 ${doc.color}`} />
                  <div><h3 className="font-semibold text-slate-800">{doc.title}</h3><p className="text-sm text-slate-600">{doc.type} • {doc.modified || doc.filed || doc.created}</p></div>
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
              <div key={file.id} className="p-3 bg-green-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Upload className="h-4 w-4 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-slate-800">{file.name}</p>
                    <p className="text-sm text-slate-600">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.category}</p>
                    {file.analysis && <p className="text-sm text-green-800 mt-1">Summary: {file.analysis.summary}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.processing ? (
                    <span className="text-xs text-blue-600 flex items-center"><RefreshCw className="h-4 w-4 mr-1" />Processing...</span>
                  ) : (<span className="text-xs text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1" />Analysis Complete</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.jpg,.png" onChange={handleFileUpload} className="hidden" />
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
          <button onClick={handleResearchSearch} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" disabled={researchLoading}>{researchLoading ? 'Searching...' : <Search className="h-5 w-5" />}</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center"><Search className="h-6 w-6 text-green-600 mr-3" />
            <div><h2 className="text-xl font-bold text-slate-700">Constitutional Law Repository</h2><p className="text-slate-600">Searchable precedents and legal authorities</p></div>
          </div>
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
              {researchResults.results.map((result, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                  <h4 className="font-semibold text-blue-600"><a href={result.url} target="_blank" rel="noopener noreferrer">{result.title}</a></h4>
                  <p className="text-sm text-slate-600">{result.snippet}</p>
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">{result.url}</a>
                </div>
              ))}
            </div>
            {researchResults.citations && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-slate-700 mb-4">AI-Generated Citations</h3>
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200">{researchResults.citations}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-700 mb-6">Timeline & Deadlines</h1>
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${event.type === 'critical' ? 'border-red-400 bg-red-50' : event.type === 'important' ? 'border-orange-400 bg-orange-50' : 'border-green-400 bg-green-50'}`}>
              <div className="flex items-center justify-between">
                <div><h3 className="font-semibold text-slate-800">{event.title}</h3><p className="text-sm text-slate-600">{event.date}</p></div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${event.type === 'critical' ? 'bg-red-200 text-red-800' : event.type === 'important' ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'}`}>
                    {event.daysRemaining} days remaining
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
            <Plus className="h-4 w-4 mr-2" />Add Event
          </button>
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
              <Headphones className="h-8 w-8 text-blue-500 mb-4" /><h3 className="text-lg font-semibold text-blue-800 mb-2">Audio Transcription</h3>
              <p className="text-blue-700 mb-4">Upload audio/video recordings of hearings, depositions, or meetings for AI transcription.</p>
              <button onClick={() => audioInputRef.current?.click()} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Upload className="h-4 w-4" /><span>Upload Audio</span>
              </button>
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
                        <span className="font-medium text-slate-700">{file.name}</span><span className="text-sm text-slate-500">{file.duration}</span>
                      </div>
                      {file.transcribed ? (
                        <div>
                          <span className="text-xs text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1" />Transcription Complete</span>
                          <p className="text-sm text-slate-600">{file.transcript}</p>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <RefreshCw className="h-4 w-4 text-blue-500 animate-spin mr-2" />
                          <span className="text-sm text-blue-600">Processing...</span>
                        </div>
                      )}
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
      <div className="p-6 border-b border-slate-200"><h1 className="text-2xl font-bold text-slate-700">AI Legal Assistant</h1><p className="text-slate-600">Get instant legal guidance for your Florida juvenile dependency case</p></div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-96 max-h-96">
        {chatMessages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl p-4 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
              <p className="whitespace-pre-line">{message.content}</p>
              {message.suggestions && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.suggestions.map((suggestion, i) => (
                    <button key={i} onClick={() => handleQuickAction(suggestion)} className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-colors">{suggestion}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="p-6 border-t border-slate-200">
        <ObjectionPanel objectionText={objectionText} setObjectionText={setObjectionText} handleGenerateObjectionResponse={handleGenerateObjectionResponse} />
      </div>
      <div className="p-6 border-t border-slate-200">
        <div className="flex space-x-2">
          <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask me about legal documents, case strategy, or procedures..." className="flex-1 px-4 py-3 border border-slate-300 rounded-lg" />
          <button onClick={() => setIsRecording(!isRecording)} className={`px-4 py-3 rounded-lg transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
            <Mic className="h-5 w-5" />
          </button>
          <button onClick={handleSendMessage} disabled={!chatInput.trim()} className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white px-6 py-3 rounded-lg transition-colors">Send</button>
        </div>
      </div>
    </div>
  );

  const renderDocumentDrafting = () => {
    const renderFormFields = () => {
      switch (selectedDocumentType) {
        case 'Motion':
          return (
            <>
              <div>
                <Gavel className="h-5 w-5 mr-2 inline-block text-gray-500" />
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Motion (be specific)</label>
                <textarea name="reason" id="reason" rows="5" value={motionFormData.reason} onChange={(e) => setMotionFormData({...motionFormData, reason: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required ></textarea>
              </div>
              <div>
                <Gavel className="h-5 w-5 mr-2 inline-block text-gray-500" />
                <label htmlFor="outcome" className="block text-sm font-medium text-gray-700">Desired Outcome</label>
                <input type="text" name="outcome" id="outcome" value={motionFormData.outcome} onChange={(e) => setMotionFormData({...motionFormData, outcome: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
            </>
          );
        case 'Affidavit':
          return (
            <>
              <div>
                <Gavel className="h-5 w-5 mr-2 inline-block text-gray-500" />
                <label htmlFor="statement" className="block text-sm font-medium text-gray-700">Statement of Facts (chronological order)</label>
                <textarea name="statement" id="statement" rows="10" value={motionFormData.reason} onChange={(e) => setMotionFormData({...motionFormData, reason: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required></textarea>
              </div>
              <div>
                <Gavel className="h-5 w-5 mr-2 inline-block text-gray-500" />
                <label htmlFor="witnessName" className="block text-sm font-medium text-gray-700">Witness Name</label>
                <input type="text" name="witnessName" id="witnessName" value={motionFormData.outcome} onChange={(e) => setMotionFormData({...motionFormData, outcome: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
            </>
          );
        case 'Objection':
          return (
            <>
              <div>
                <Gavel className="h-5 w-5 mr-2 inline-block text-gray-500" />
                <label htmlFor="objectionReason" className="block text-sm font-medium text-gray-700">Reason for Objection</label>
                <textarea name="objectionReason" id="objectionReason" rows="5" value={motionFormData.reason} onChange={(e) => setMotionFormData({...motionFormData, reason: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required></textarea>
              </div>
              <div>
                <Gavel className="h-5 w-5 mr-2 inline-block text-gray-500" />
                <label htmlFor="basis" className="block text-sm font-medium text-gray-700">Legal Basis for Objection (e.g., Hearsay, Relevance)</label>
                <input type="text" name="basis" id="basis" value={motionFormData.outcome} onChange={(e) => setMotionFormData({...motionFormData, outcome: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Draft a Legal Document</h1>
        <p className="text-gray-600 mb-8">Select a document type and fill out the form. The AI will generate a draft for you. **Remember to review it carefully before filing.**</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleDraftingSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <div>
                <Gavel className="h-5 w-5 mr-2 inline-block text-gray-500" />
                <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Document Type</label>
                <select id="documentType" value={selectedDocumentType} onChange={(e) => setSelectedDocumentType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="Motion">Motion</option>
                  <option value="Affidavit">Affidavit</option>
                  <option value="Objection">Objection</option>
                </select>
              </div>
              <div>
                <Gavel className="h-5 w-5 mr-2 inline-block text-gray-500" />
                <label htmlFor="ai-model" className="block text-sm font-medium text-gray-700">AI Model</label>
                <select id="ai-model" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="gemini-pro">Google Gemini Pro</option>
                  <option value="gpt-4o">OpenAI GPT-4o</option>
                </select>
              </div>
              <div>
                <Gavel className="h-5 w-5 mr-2 inline-block text-gray-500" />
                <label htmlFor="caseName" className="block text-sm font-medium text-gray-700">Case Name</label>
                <input type="text" name="caseName" id="caseName" value={motionFormData.caseName} onChange={(e) => setMotionFormData({...motionFormData, caseName: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
              <div>
                <Gavel className="h-5 w-5 mr-2 inline-block text-gray-500" />
                <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700">Case Number</label>
                <input type="text" name="caseNumber" id="caseNumber" value={motionFormData.caseNumber} onChange={(e) => setMotionFormData({...motionFormData, caseNumber: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
              {renderFormFields()}
              <div className="flex space-x-2">
                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400" disabled={draftLoading}>{draftLoading ? 'Generating...' : 'Generate Draft'}</button>
                {aiDraft && (
                  <button type="button" onClick={handleWeaknessDetection} className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400" disabled={draftLoading}>
                    Detect Weaknesses
                  </button>
                )}
              </div>
            </form>
          </div>
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md min-h-[300px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">AI-Generated Draft</h2>
                {aiDraft && (
                  <div className="flex space-x-2">
                    <button onClick={handleCopy} className="p-2 rounded-md hover:bg-gray-100 text-gray-600" aria-label="Copy draft to clipboard">
                      <Copy size={20} />
                    </button>
                    <button onClick={handlePrint} className="p-2 rounded-md hover:bg-gray-100 text-gray-600" aria-label="Print draft">
                      <Printer size={20} />
                    </button>
                  </div>
                )}
              </div>
              {draftError && <p className="text-red-500">{draftError}</p>}
              {draftLoading && <p className="text-gray-500">Generating your draft...</p>}
              {aiDraft && (
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200">{aiDraft}</pre>
              )}
              {!aiDraft && !draftLoading && !draftError && (<p className="text-gray-400 italic">Your draft will appear here after you submit the form.</p>)}
            </div>
            {complianceReport && (
              <div className="mt-6 p-6 bg-yellow-50 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
                  <h3 className="text-xl font-bold text-yellow-800">Compliance Check</h3>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{complianceReport}</pre>
              </div>
            )}
            {legalStrategyReport && (
              <div className="mt-6 p-6 bg-blue-50 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Gavel className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-bold text-blue-800">Legal Strategy Report</h3>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{legalStrategyReport}</pre>
              </div>
            )}
            {weaknessReport && (
              <div className="mt-6 p-6 bg-red-50 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                  <h3 className="text-xl font-bold text-red-800">Weakness Detection Report</h3>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{weaknessReport}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'documents': return renderDocuments();
      case 'research': return renderResearch();
      case 'timeline': return renderTimeline();
      case 'transcription': return renderTranscription();
      case 'chat': return renderChat();
      case 'motion_drafting': return renderDocumentDrafting();
      case 'legal_strategy': return renderLegalStrategy();
      case 'pro_se_guide': return renderProSeGuide();
      default: return renderDashboard();
    }
  };
  
  const renderLegalStrategy = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-700 mb-4">Legal Strategy Generator</h1>
        <p className="text-slate-600 mb-6">Use AI to analyze your case documents and generate a strategic report.</p>
        <button onClick={handleGenerateStrategy} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Generate New Strategy
        </button>
        {legalStrategyReport && (
          <div className="mt-6 p-6 bg-blue-50 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-blue-800 mb-4">AI-Generated Strategy Report</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{legalStrategyReport}</pre>
          </div>
        )}
      </div>
    </div>
  );

  const renderProSeGuide = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-700 mb-4">Pro Se Self-Help Guide</h1>
        <p className="text-slate-600 mb-6">Step-by-step procedural assistance for self-represented litigants.</p>
        <div className="space-y-4">
          {proSeGuideData.map((topic, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">{topic.title}</h3>
              <p className="text-sm text-slate-700 mb-2">{topic.content}</p>
              {topic.relatedLinks && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700">Related Links:</h4>
                  <ul className="list-disc list-inside text-sm text-slate-600">
                    {topic.relatedLinks.map((link, linkIndex) => (
                      <li key={linkIndex}><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{link.title}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EmergencyPanel = ({ setShowEmergencyMode, setChatMessages, setActiveTab, showSuccessNotification, handleGenerateEmergencyMotion }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-red-600 flex items-center"><AlertTriangle className="h-6 w-6 mr-2" />Emergency Mode</h2>
          <button onClick={() => setShowEmergencyMode(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        <p className="text-gray-700 mb-6">I&apos;m here to help immediately. What type of emergency document do you need?</p>
        <div className="space-y-3">
          {['Emergency Motion for Temporary Relief', 'Emergency Stay Request', 'Emergency Hearing Request', 'Expedited Filing Documents'].map((option, index) => (
            <button key={index} onClick={() => handleGenerateEmergencyMotion(option)} className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors">
              <div className="font-semibold text-red-800">{option}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const ObjectionPanel = ({ objectionText, setObjectionText, handleGenerateObjectionResponse }) => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-700">Objection Response Generator</h2>
      <p className="text-slate-600">Instantly generate a response to an objection made in court.</p>
      <div className="flex space-x-2">
        <input 
          type="text" 
          value={objectionText} 
          onChange={(e) => setObjectionText(e.target.value)} 
          placeholder="Enter the objection here..." 
          className="flex-1 p-3 border border-slate-300 rounded-lg"
        />
        <button onClick={() => handleGenerateObjectionResponse(objectionText)} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
          Respond
        </button>
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

  const ExportModal = ({ isOpen, onClose }) => {
    return isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl text-center">
          <div className="flex items-center justify-center mb-4">
            <Download className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-xl font-bold text-slate-800">Exporting Data</h2>
          </div>
          <p className="text-gray-700 mb-6">Your data is being compiled and downloaded. This may take a moment.</p>
          <div className="flex justify-center">
            <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <SuccessNotification message={showNotification} />
      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center"><Scale className="h-8 w-8 text-slate-700 mr-3" />
              <div><h1 className="text-xl font-bold text-slate-800">We The Parent™</h1><p className="text-xs text-slate-600">Protecting Families Through Law</p></div>
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
                  <nav.icon className="h-4 w-4" /><span>{nav.label}</span>
                </button>
              ))}
            </div>
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-slate-400 hover:text-slate-500">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => setActiveTab('chat')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <MessageCircle className="h-4 w-4" /><span>AI Chat</span>
              </button>
              <button onClick={() => setShowEmergencyMode(true)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <AlertTriangle className="h-4 w-4" /><span>Emergency</span>
              </button>
              <div className="flex items-center">
                <div className="bg-slate-700 rounded-full p-2 mr-2"><User className="h-5 w-5 text-white" /></div>
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
                { id: 'research', label: 'Research', icon: Search },
                { id: 'timeline', label: 'Timeline', icon: Calendar },
                { id: 'legal_strategy', label: 'Legal Strategy', icon: Gavel },
                { id: 'pro_se_guide', label: 'Pro Se Guide', icon: HelpCircle },
              ].map((nav) => (
                <button key={nav.id} onClick={() => { setActiveTab(nav.id); setMobileMenuOpen(false); }} className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 ${activeTab === nav.id ? 'bg-orange-100 text-orange-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                  <nav.icon className="h-5 w-5" /><span>{nav.label}</span>
                </button>
              ))}
              <button onClick={() => { setShowEmergencyMode(true); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 text-red-700 hover:bg-red-50">
                <AlertTriangle className="h-5 w-5" /><span>Emergency</span>
              </button>
            </div>
          </div>
        )}
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      {showEmergencyMode && <EmergencyPanel setShowEmergencyMode={setShowEmergencyMode} setChatMessages={setChatMessages} setActiveTab={setActiveTab} showSuccessNotification={showSuccessNotification} handleGenerateEmergencyMotion={handleGenerateEmergencyMotion} />}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div><h3 className="font-bold text-slate-800">We The Parent™</h3><p className="text-sm text-slate-600">Empowering families through legal knowledge</p></div>
            <div className="text-sm text-slate-500">Legal assistance platform for self-represented parents</div>
            <div className="text-sm text-slate-500">© 2025 We The Parent. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WeTheParentApp;