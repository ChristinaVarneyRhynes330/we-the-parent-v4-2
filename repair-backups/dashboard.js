'use client';

import React, { useState } from 'react';
import { Calendar, Users, Bell } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    visitsScheduled: 4,
    notesAdded: 2,
    messagesSent: 3,
  });
  const [upcomingEvent, setUpcomingEvent] = useState({
    title: 'Upcoming Visit',
    date: '9/17/25',
  });

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-brand-text-dark">We the Parent</h1>
        <div className="flex items-center space-x-4">
          <input
            type="search"
            placeholder="Search"
            className="bg-brand-surface rounded-full py-2 px-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
          <button><Bell className="h-6 w-6 text-brand-text-dark" /></button>
          <button><Users className="h-6 w-6 text-brand-text-dark" /></button>
        </div>
      </header>

      <main className="bg-brand-surface rounded-3xl shadow-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <InfoCard title="Recent Activity">
              <ActivityItem label="Visits Scheduled" value={stats.visitsScheduled} />
              <ActivityItem label="Notes Added" value={stats.notesAdded} />
              <ActivityItem label="Messages Sent" value={stats.messagesSent} />
            </InfoCard>
            <InfoCard title="Upcoming Events">
              <div className="flex items-center space-x-4">
                <Calendar className="h-16 w-16 text-brand-accent opacity-70" />
                <div>
                  <p className="font-semibold text-brand-text-dark">{upcomingEvent?.title}</p>
                  <p className="text-2xl font-bold text-brand-text-dark">{upcomingEvent?.date}</p>
                </div>
              </div>
            </InfoCard>
          </div>
          <div className="lg:col-span-2">
            <InfoCard title="Stats">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatChart title="Visits Completed" />
                <StatChart title="Notes Added" />
              </div>
            </InfoCard>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components
const InfoCard = ({ title, children }) => (
  <div className="bg-brand-background rounded-2xl p-6 h-full">
    <h2 className="text-xl font-serif font-bold text-brand-accent mb-4">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const ActivityItem = ({ label, value }) => (
  <div className="flex justify-between items-center text-lg">
    <p className="text-brand-text-dark">{label}</p>
    <p className="font-bold text-brand-text-dark">{value}</p>
  </div>
);

const StatChart = ({ title }) => (
  <div>
    <h3 className="font-semibold mb-2 text-center text-brand-text-dark">{title}</h3>
    <div className="h-40 flex items-end justify-between space-x-2 p-2">
      <div className="w-full h-[25%] bg-brand-primary rounded-t-md"></div>
      <div className="w-full h-[40%] bg-brand-secondary rounded-t-md"></div>
      <div className="w-full h-[60%] bg-brand-primary rounded-t-md"></div>
      <div className="w-full h-[30%] bg-brand-secondary rounded-t-md"></div>
      <div className="w-full h-[80%] bg-brand-primary rounded-t-md"></div>
      <div className="w-full h-[50%] bg-brand-secondary rounded-t-md"></div>
      <div className="w-full h-[75%] bg-brand-primary rounded-t-md"></div>
    </div>
  </div>
);

export default Dashboard;