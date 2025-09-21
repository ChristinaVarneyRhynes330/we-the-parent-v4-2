'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  FileText, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  Users,
  TrendingUp,
  Scale,
  BookOpen,
  MessageCircle
} from 'lucide-react';

// Your personal case information - Pre-filled for convenience
const YOUR_CASE_INFO = {
  caseNumber: "2024-DP-000587-XXDP-BC",
  caseName: "Your Name v. Department of Children and Families",
  circuit: "5th Judicial Circuit",
  nextHearing: "March 15, 2025",
  status: "Active",
  progress: 65,
  daysRemaining: 3
};

const Dashboard = () => {
  const [caseProgress, setCaseProgress] = useState([
    { task: "Parenting Classes", status: "Complete", progress: 100 },
    { task: "Housing Stability", status: "In Progress", progress: 75 },
    { task: "Substance Abuse Program", status: "In Progress", progress: 60 },
    { task: "Mental Health Evaluation", status: "Scheduled", progress: 0 }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    { title: "Adjudicatory Hearing", date: "March 15, 2025 at 2:00 PM", daysRemaining: 3, type: "critical" },
    { title: "Supervised Visitation", date: "March 20, 2025 at 10:00 AM", daysRemaining: 8, type: "routine" },
    { title: "Case Plan Review", date: "March 25, 2025 at 1:30 PM", daysRemaining: 13, type: "important" },
    { title: "Judicial Review Hearing", date: "April 10, 2025 at 9:00 AM", daysRemaining: 29, type: "important" }
  ]);

  const [recentDocuments] = useState([
    { name: "Motion for Increased Visitation", type: "Motion", date: "2025-03-10", status: "Filed" },
    { name: "Progress Report Affidavit", type: "Affidavit", date: "2025-03-08", status: "Draft" },
    { name: "Housing Documentation", type: "Evidence", date: "2025-03-05", status: "Uploaded" }
  ]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'bg-olive-emerald/10 text-olive-emerald';
      case 'in progress':
        return 'bg-terracotta/10 text-terracotta';
      case 'scheduled':
        return 'bg-slate-gray/10 text-slate-gray';
      default:
        return 'bg-dusty-mauve/10 text-dusty-mauve';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-garnet bg-garnet/5';
      case 'important':
        return 'border-l-terracotta bg-terracotta/5';
      case 'routine':
        return 'border-l-olive-emerald bg-olive-emerald/5';
      default:
        return 'border-l-dusty-mauve bg-dusty-mauve/5';
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-header text-3xl text-charcoal-navy">Dashboard</h1>
              <p className="text-slate-gray mt-1">Case: {YOUR_CASE_INFO.caseNumber}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-3 h-3 bg-olive-emerald rounded-full"></div>
                <span className="text-sm font-medium text-charcoal-navy">{YOUR_CASE_INFO.status}</span>
              </div>
              <p className="text-sm text-slate-gray">{YOUR_CASE_INFO.circuit}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-dusty-mauve/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-dusty-mauve" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-charcoal-navy">{YOUR_CASE_INFO.progress}%</p>
                <p className="text-sm text-slate-gray">Case Progress</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-terracotta/10 rounded-lg">
                <Calendar className="w-6 h-6 text-terracotta" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-charcoal-navy">{YOUR_CASE_INFO.daysRemaining}</p>
                <p className="text-sm text-slate-gray">Days to Hearing</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-olive-emerald/10 rounded-lg">
                <FileText className="w-6 h-6 text-olive-emerald" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-charcoal-navy">{recentDocuments.length}</p>
                <p className="text-sm text-slate-gray">Documents</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-garnet/10 rounded-lg">
                <Scale className="w-6 h-6 text-garnet" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-charcoal-navy">Active</p>
                <p className="text-sm text-slate-gray">Case Status</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Events */}
            <div className="card">
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-dusty-mauve mr-3" />
                <h2 className="section-subheader mb-0">Upcoming Events</h2>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`p-4 border-l-4 rounded-r-lg ${getEventTypeColor(event.type)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-charcoal-navy">{event.title}</h3>
                        <p className="text-sm text-slate-gray mt-1">{event.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.daysRemaining <= 3 ? 'bg-garnet text-white' : 
                          event.daysRemaining <= 7 ? 'bg-terracotta text-white' : 
                          'bg-slate-gray/20 text-slate-gray'
                        }`}>
                          {event.daysRemaining} days
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Case Progress */}
            <div className="card">
              <div className="flex items-center mb-6">
                <CheckCircle className="w-6 h-6 text-olive-emerald mr-3" />
                <h2 className="section-subheader mb-0">Case Plan Progress</h2>
              </div>
              <div className="space-y-4">
                {caseProgress.map((item, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-charcoal-navy">{item.task}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.progress === 100 ? 'bg-olive-emerald' : 'bg-dusty-mauve'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-gray mt-1">{item.progress}% Complete</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="card">
              <h2 className="section-subheader">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full button-primary text-left flex items-center">
                  <FileText className="w-5 h-5 mr-3" />
                  Draft New Motion
                </button>
                <button className="w-full button-secondary text-left flex items-center">
                  <BookOpen className="w-5 h-5 mr-3" />
                  Legal Research
                </button>
                <button className="w-full button-secondary text-left flex items-center">
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Ask Legal Assistant
                </button>
                <button className="w-full button-secondary text-left flex items-center">
                  <Scale className="w-5 h-5 mr-3" />
                  Constitutional Research
                </button>
              </div>
            </div>

            {/* Recent Documents */}
            <div className="card">
              <h2 className="section-subheader">Recent Documents</h2>
              <div className="space-y-3">
                {recentDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-warm-ivory rounded-lg">
                    <div>
                      <h3 className="font-medium text-charcoal-navy text-sm">{doc.name}</h3>
                      <p className="text-xs text-slate-gray">{doc.type} • {doc.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      doc.status === 'Filed' ? 'bg-olive-emerald/10 text-olive-emerald' :
                      doc.status === 'Draft' ? 'bg-terracotta/10 text-terracotta' :
                      'bg-dusty-mauve/10 text-dusty-mauve'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Hearing Alert */}
            <div className="card bg-garnet/5 border-garnet/20">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-garnet mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-garnet mb-2">Upcoming Hearing</h3>
                  <p className="text-sm text-charcoal-navy mb-1">
                    <strong>{YOUR_CASE_INFO.nextHearing}</strong>
                  </p>
                  <p className="text-sm text-slate-gray">
                    Your adjudicatory hearing is in {YOUR_CASE_INFO.daysRemaining} days. Make sure you have all required documents prepared.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;