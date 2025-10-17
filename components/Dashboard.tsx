'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, FileText, Users, Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface CaseProgress {
  task: string;
  status: string;
  progress: number;
}

interface UpcomingEvent {
  title: string;
  date: string;
  daysRemaining: number;
  type: 'critical' | 'important' | 'routine';
}

interface CurrentCase {
  number: string;
  nextHearing: string;
  circuit: string;
  progress: number;
  daysRemaining: number;
  status: string;
}

interface DashboardData {
  currentCase: CurrentCase;
  caseProgress: CaseProgress[];
  upcomingEvents: UpcomingEvent[];
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await fetch('/api/dashboard');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  const data = await response.json();
  return data.dashboardData;
};

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'text-olive-emerald bg-olive-emerald/10';
      case 'in progress':
        return 'text-dusty-mauve bg-dusty-mauve/10';
      case 'scheduled':
        return 'text-terracotta bg-terracotta/10';
      default:
        return 'text-slate-gray bg-slate-gray/10';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-garnet bg-garnet/5 text-garnet';
      case 'important':
        return 'border-l-dusty-mauve bg-dusty-mauve/5 text-dusty-mauve';
      case 'routine':
        return 'border-l-olive-emerald bg-olive-emerald/5 text-olive-emerald';
      default:
        return 'border-l-slate-gray bg-slate-gray/5 text-slate-gray';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-ivory p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>;
  }

  if (!data) {
    return <div className="p-6">No data available.</div>;
  }

  const { currentCase, caseProgress, upcomingEvents } = data;

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-header text-charcoal-navy">Dashboard</h1>
          <p className="text-slate-gray mt-2">Welcome back to your case management system</p>
        </div>

        {/* Case Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentCase && (
            <>
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-8 h-8 text-dusty-mauve" />
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    currentCase.status === 'Active' ? 'bg-olive-emerald/10 text-olive-emerald' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {currentCase.status}
                  </span>
                </div>
                <h3 className="font-semibold text-charcoal-navy mb-2">Current Case</h3>
                <p className="text-sm text-slate-gray mb-1">{currentCase.number}</p>
                <p className="text-sm text-slate-gray">{currentCase.circuit}</p>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-terracotta" />
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    currentCase.daysRemaining <= 7 ? 'bg-garnet/10 text-garnet' : 'bg-dusty-mauve/10 text-dusty-mauve'
                  }`}>
                    {currentCase.daysRemaining} days
                  </span>
                </div>
                <h3 className="font-semibold text-charcoal-navy mb-2">Next Hearing</h3>
                <p className="text-sm text-slate-gray">{currentCase.nextHearing}</p>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-olive-emerald" />
                  <span className="text-2xl font-header text-olive-emerald">{currentCase.progress}%</span>
                </div>
                <h3 className="font-semibold text-charcoal-navy mb-2">Case Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-olive-emerald h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentCase.progress}%` }}
                  ></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Case Progress */}
          <div className="card">
            <h2 className="section-subheader">Case Plan Progress</h2>
            <div className="space-y-4">
              {caseProgress.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {item.status === 'Complete' ? (
                        <CheckCircle className="w-5 h-5 text-olive-emerald" />
                      ) : item.status === 'In Progress' ? (
                        <Clock className="w-5 h-5 text-dusty-mauve" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-terracotta" />
                      )}
                      <h3 className="font-medium text-charcoal-navy">{item.task}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <span className="text-sm font-medium text-slate-gray">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-dusty-mauve h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <h2 className="section-subheader">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className={`p-4 border-l-4 rounded-r-lg ${getEventTypeColor(event.type)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-charcoal-navy">{event.title}</h3>
                    <span className="text-xs font-medium">{event.daysRemaining} days</span>
                  </div>
                  <p className="text-sm text-slate-gray">{event.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="section-subheader mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/draft" className="card hover:shadow-brand transition-shadow cursor-pointer">
              <FileText className="w-8 h-8 text-dusty-mauve mb-3" />
              <h3 className="font-semibold text-charcoal-navy mb-1">Draft Document</h3>
              <p className="text-sm text-slate-gray">Create legal documents</p>
            </a>
            
            <a href="/documents" className="card hover:shadow-brand transition-shadow cursor-pointer">
              <Users className="w-8 h-8 text-olive-emerald mb-3" />
              <h3 className="font-semibold text-charcoal-navy mb-1">View Documents</h3>
              <p className="text-sm text-slate-gray">Manage case files</p>
            </a>
            
            <a href="/calendar" className="card hover:shadow-brand transition-shadow cursor-pointer">
              <Calendar className="w-8 h-8 text-terracotta mb-3" />
              <h3 className="font-semibold text-charcoal-navy mb-1">Calendar</h3>
              <p className="text-sm text-slate-gray">Upcoming events</p>
            </a>
            
            <a href="/chat" className="card hover:shadow-brand transition-shadow cursor-pointer">
              <AlertTriangle className="w-8 h-8 text-garnet mb-3" />
              <h3 className="font-semibold text-charcoal-navy mb-1">AI Assistant</h3>
              <p className="text-sm text-slate-gray">Get legal help</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}