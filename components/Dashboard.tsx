'use client';
import { Bell, Search, User, Calendar, FileText, Clock, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CaseData {
  number: string;
  nextHearing: string;
  circuit: string;
  progress: number;
  daysRemaining: number;
  status: string;
}

interface TaskProgress {
  task: string;
  status: string;
  progress: number;
}

interface UpcomingEvent {
  title: string;
  date: string;
  daysRemaining: number;
  type: string;
}

export default function Dashboard() {
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [caseProgress, setCaseProgress] = useState<TaskProgress[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    // Load mock data - replace with actual API calls
    setCaseData({
      number: "2024-DP-000587-XXDP-BC",
      nextHearing: "March 15, 2025",
      circuit: "5th Judicial Circuit",
      progress: 65,
      daysRemaining: 3,
      status: "Active"
    });

    setCaseProgress([
      { task: "Parenting Classes", status: "Complete", progress: 100 },
      { task: "Housing Stability", status: "In Progress", progress: 75 },
      { task: "Substance Abuse Program", status: "In Progress", progress: 60 },
      { task: "Mental Health Evaluation", status: "Scheduled", progress: 0 }
    ]);

    setUpcomingEvents([
      { title: "Adjudicatory Hearing", date: "March 15, 2025 at 2:00 PM", daysRemaining: 3, type: "critical" },
      { title: "Supervised Visitation", date: "March 20, 2025 at 10:00 AM", daysRemaining: 8, type: "routine" },
      { title: "Case Plan Review", date: "March 25, 2025 at 1:30 PM", daysRemaining: 13, type: "important" },
      { title: "Judicial Review Hearing", date: "April 10, 2025 at 9:00 AM", daysRemaining: 29, type: "important" }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'text-olive-emerald';
      case 'In Progress': return 'text-terracotta';
      case 'Scheduled': return 'text-slate-gray';
      default: return 'text-slate-gray';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-l-garnet bg-garnet/5';
      case 'important': return 'border-l-terracotta bg-terracotta/5';
      case 'routine': return 'border-l-dusty-mauve bg-dusty-mauve/5';
      default: return 'border-l-slate-gray bg-slate-gray/5';
    }
  };

  if (!caseData) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-ivory">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-4xl font-header text-charcoal-navy">Dashboard</h1>
            <p className="text-slate-gray mt-1">Case {caseData.number}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                className="form-input pl-10 pr-4 py-2 w-64"
              />
            </div>
            <button className="relative p-2 text-slate-gray hover:text-charcoal-navy transition-colors">
              <Bell className="w-6 h-6" />
              {caseData.daysRemaining <= 7 && (
                <span className="absolute -top-1 -right-1 bg-garnet text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  !
                </span>
              )}
            </button>
            <button className="flex items-center gap-2 text-slate-gray hover:text-charcoal-navy transition-colors">
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-container py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-gray text-sm">Case Progress</p>
                <p className="text-2xl font-header text-charcoal-navy">{caseData.progress}%</p>
              </div>
              <div className="w-12 h-12 bg-dusty-mauve/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-dusty-mauve" />
              </div>
            </div>
            <div className="progress-bar mt-3">
              <div 
                className="progress-fill in-progress" 
                style={{ width: `${caseData.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-gray text-sm">Next Hearing</p>
                <p className="text-lg font-semibold text-charcoal-navy">{caseData.daysRemaining} days</p>
              </div>
              <div className="w-12 h-12 bg-terracotta/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-terracotta" />
              </div>
            </div>
            <p className="text-sm text-slate-gray mt-1">{caseData.nextHearing}</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-gray text-sm">Circuit</p>
                <p className="text-lg font-semibold text-charcoal-navy">{caseData.circuit}</p>
              </div>
              <div className="w-12 h-12 bg-olive-emerald/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-olive-emerald" />
              </div>
            </div>
            <p className="text-sm text-olive-emerald mt-1">Status: {caseData.status}</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-gray text-sm">Urgent Items</p>
                <p className="text-2xl font-header text-garnet">
                  {upcomingEvents.filter(e => e.type === 'critical').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-garnet/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-garnet" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Case Progress */}
          <div className="lg:col-span-2 card">
            <h2 className="section-subheader">Case Plan Progress</h2>
            <div className="space-y-4">
              {caseProgress.map((task, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-charcoal-navy">{task.task}</h3>
                    <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${
                        task.progress === 100 ? 'complete' : 
                        task.progress > 0 ? 'in-progress' : 'pending'
                      }`} 
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-gray mt-1">{task.progress}% Complete</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button className="button-primary w-full">Update Progress</button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <h2 className="section-subheader">Upcoming Events</h2>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${getEventTypeColor(event.type)}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-charcoal-navy text-sm">{event.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.daysRemaining <= 3 ? 'bg-garnet text-white' :
                      event.daysRemaining <= 7 ? 'bg-terracotta text-white' :
                      'bg-slate-gray/20 text-slate-gray'
                    }`}>
                      {event.daysRemaining}d
                    </span>
                  </div>
                  <p className="text-xs text-slate-gray">{event.date}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button className="button-secondary w-full">View Calendar</button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card hover:shadow-brand transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-dusty-mauve/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-dusty-mauve" />
              </div>
              <h3 className="font-header text-lg text-charcoal-navy mb-1">Draft Documents</h3>
              <p className="text-sm text-slate-gray">Create motions, affidavits, and more</p>
            </div>
          </div>

          <div className="card hover:shadow-brand transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-terracotta/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="font-header text-lg text-charcoal-navy mb-1">Schedule Events</h3>
              <p className="text-sm text-slate-gray">Track hearings and deadlines</p>
            </div>
          </div>

          <div className="card hover:shadow-brand transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-olive-emerald/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-olive-emerald" />
              </div>
              <h3 className="font-header text-lg text-charcoal-navy mb-1">Legal Research</h3>
              <p className="text-sm text-slate-gray">Find relevant case law and statutes</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}