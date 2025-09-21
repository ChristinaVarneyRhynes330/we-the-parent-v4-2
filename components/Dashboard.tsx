'use client';
import { Bell, Search, User } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-header text-charcoal-navy">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              className="bg-white rounded-full py-2 pl-10 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-dusty-mauve"
            />
          </div>
          <button className="relative p-2 text-gray-600 hover:text-charcoal-navy">
            <Bell className="w-6 h-6" />
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-charcoal-navy">
            <User className="w-6 h-6" />
          </button>
        </div>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-header text-2xl text-dusty-mauve mb-4">Case Overview</h2>
          <p>Your case summary and key metrics will appear here.</p>
        </div>
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-header text-2xl text-dusty-mauve mb-4">Upcoming Deadlines</h2>
          <p>A list of important dates will appear here.</p>
        </div>
      </main>
    </div>
  );
}