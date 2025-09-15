'use client';

import React, { useState, useEffect } from 'react';
import { Scale, Brain, Calendar, Plus, FileUp, Bell } from 'lucide-react';

const Dashboard = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await fetch('/api/children');
      const data = await response.json();
      setChildren(data.children || []);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-[#F5F5F5]">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-[#0D223F] rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#F7CAC9] mb-2">
              Welcome Back
            </h1>
            <p className="text-[#F5F5F5] text-lg">
              Managing {children.length} case{children.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Scale className="h-20 w-20 text-[#B76E79] opacity-50" />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Cases"
          value={children.length}
          icon={Scale}
          color="bg-[#1F3A93]"
        />
        <StatCard
          title="Upcoming Visits"
          value={children.reduce((acc, child) => acc + (child.visits?.filter(v => !v.completed).length || 0), 0)}
          icon={Calendar}
          color="bg-[#B76E79]"
        />
        <StatCard
          title="Pending Alerts"
          value={children.reduce((acc, child) => acc + (child.alerts?.filter(a => !a.resolved).length || 0), 0)}
          icon={Bell}
          color="bg-[#F7CAC9] text-[#0B1A2A]"
        />
        <StatCard
          title="Documents"
          value="12"
          icon={FileUp}
          color="bg-[#1F3A93]"
        />
      </div>

      {/* Children Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#F7CAC9]">Your Children</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
          <AddChildCard />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`${color} rounded-lg p-4 text-center`}>
    <Icon className="h-8 w-8 mx-auto mb-2" />
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm opacity-90">{title}</div>
  </div>
);

const ChildCard = ({ child }) => (
  <div className="bg-[#0D223F] rounded-lg p-4 hover:bg-[#B76E79] transition-colors cursor-pointer">
    <h3 className="font-bold text-lg text-[#F7CAC9] mb-2">{child.name}</h3>
    <p className="text-sm text-[#F5F5F5] mb-2">Case: {child.case_number}</p>
    <p className="text-sm text-[#F5F5F5] mb-2">
      Current: {child.current_placement || 'No placement'}
    </p>
    <div className="flex justify-between text-xs text-[#F5F5F5]">
      <span>{child.placements?.length || 0} placements</span>
      <span>{child.visits?.length || 0} visits</span>
    </div>
  </div>
);

const AddChildCard = () => (
  <div className="bg-[#0D223F] border-2 border-dashed border-[#B76E79] rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#B76E79] transition-colors">
    <Plus className="h-8 w-8 text-[#B76E79] mb-2" />
    <span className="text-[#F5F5F5]">Add Child</span>
  </div>
);

export default Dashboard;