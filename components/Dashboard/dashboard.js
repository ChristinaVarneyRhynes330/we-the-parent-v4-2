// app/components/dashboard/Dashboard.js
'use client';

import React from 'react';
import {
  Scale, Brain, CheckCircle, Clock, Calendar, Plus, Zap, FileUp,
  RefreshCw, Headphones, Calculator, Heart, ChevronRight, Gavel,
  HelpCircle, Phone, UserCheck,
} from 'lucide-react';

// All the mock data that was in app.js can live here for now.
// We will replace this with real data in Phase 3.
const caseProgress = [
    { task: 'Parenting Classes', status: 'Complete', progress: 100 },
    { task: 'Housing Stability', status: 'In Progress', progress: 75 },
    { task: 'Substance Abuse Program', status: 'In Progress', progress: 60 },
    { task: 'Mental Health Evaluation', status: 'Scheduled', progress: 0 }
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

const Dashboard = ({ userName, caseData, handleQuickAction, setActiveTab, fileInputRef, showSuccessNotification }) => {
  return (
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
};

export default Dashboard;
