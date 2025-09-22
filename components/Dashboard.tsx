'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Clock, TrendingUp, MessageSquare, CheckCircle, AlertCircle, Users } from 'lucide-react';

// Define interfaces for type safety
interface CaseData {
  totalDocuments: number;
  upcomingDeadlines: number;
  recentActivity: number;
  caseStatus: string;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  date: string;
}

interface UpcomingDeadline {
  id: string;
  title: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export default function Dashboard() {
  // State management
  const [caseData, setCaseData] = useState<CaseData>({
    totalDocuments: 0,
    upcomingDeadlines: 0,
    recentActivity: 0,
    caseStatus: 'Active'
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate data loading (replace with real API calls later)
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock data
        setCaseData({
          totalDocuments: 24,
          upcomingDeadlines: 3,
          recentActivity: 8,
          caseStatus: 'Active'
        });

        setRecentActivities([
          {
            id: '1',
            type: 'document',
            description: 'New motion filed',
            date: '2024-01-15'
          },
          {
            id: '2',
            type: 'message',
            description: 'Message from attorney',
            date: '2024-01-14'
          },
          {
            id: '3',
            type: 'deadline',
            description: 'Response due reminder',
            date: '2024-01-13'
          }
        ]);

        setUpcomingDeadlines([
          {
            id: '1',
            title: 'Motion Response Due',
            date: '2024-01-20',
            priority: 'high'
          },
          {
            id: '2',
            title: 'Discovery Deadline',
            date: '2024-01-25',
            priority: 'medium'
          },
          {
            id: '3',
            title: 'Court Hearing',
            date: '2024-02-01',
            priority: 'high'
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-warm-ivory p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-header text-charcoal-navy mb-2">
            Dashboard
          </h1>
          <p className="text-slate-gray">
            Welcome back! Here's your case overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-header text-charcoal-navy">
                  {caseData.totalDocuments}
                </p>
                <p className="text-sm text-slate-gray">Total Documents</p>
              </div>
              <FileText className="w-8 h-8 text-dusty-mauve" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-header text-terracotta">
                  {caseData.upcomingDeadlines}
                </p>
                <p className="text-sm text-slate-gray">Upcoming Deadlines</p>
              </div>
              <Calendar className="w-8 h-8 text-terracotta" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-header text-olive-emerald">
                  {caseData.recentActivity}
                </p>
                <p className="text-sm text-slate-gray">Recent Activities</p>
              </div>
              <TrendingUp className="w-8 h-8 text-olive-emerald" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-header text-garnet">
                  {caseData.caseStatus}
                </p>
                <p className="text-sm text-slate-gray">Case Status</p>
              </div>
              <CheckCircle className="w-8 h-8 text-garnet" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-charcoal-navy">
                Recent Activity
              </h3>
              <MessageSquare className="w-6 h-6 text-dusty-mauve" />
            </div>
            
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No recent activity
                </p>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0">
                      {activity.type === 'document' && (
                        <FileText className="w-5 h-5 text-dusty-mauve" />
                      )}
                      {activity.type === 'message' && (
                        <MessageSquare className="w-5 h-5 text-olive-emerald" />
                      )}
                      {activity.type === 'deadline' && (
                        <Clock className="w-5 h-5 text-terracotta" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal-navy">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-gray">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-charcoal-navy">
                Upcoming Deadlines
              </h3>
              <Calendar className="w-6 h-6 text-terracotta" />
            </div>
            
            <div className="space-y-4">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No upcoming deadlines
                </p>
              ) : (
                upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-charcoal-navy">
                        {deadline.title}
                      </p>
                      <p className="text-sm text-slate-gray">
                        {formatDate(deadline.date)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(deadline.priority)}`}>
                      {deadline.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card">
          <h3 className="text-xl font-semibold text-charcoal-navy mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <FileText className="w-6 h-6 text-dusty-mauve mb-2" />
              <p className="font-medium text-charcoal-navy">Upload Document</p>
              <p className="text-sm text-slate-gray">Add new case documents</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <MessageSquare className="w-6 h-6 text-olive-emerald mb-2" />
              <p className="font-medium text-charcoal-navy">Start Chat</p>
              <p className="text-sm text-slate-gray">Get AI assistance</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Calendar className="w-6 h-6 text-terracotta mb-2" />
              <p className="font-medium text-charcoal-navy">Set Reminder</p>
              <p className="text-sm text-slate-gray">Add important dates</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}