import React from 'react';
import { CheckCircle, Clock, Calendar, Brain, Scale } from 'lucide-react';

const Dashboard = ({ userName, currentCase, caseProgress, upcomingEvents, handleQuickAction }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-700 mb-2">Welcome back, {userName}</h1>
            <p className="text-slate-600 text-lg">Your family&apos;s legal journey continues with strength and determination.</p>
          </div>
          <Scale className="h-20 w-20 text-slate-400 opacity-50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-100 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Case: {currentCase.number}</div>
          </div>
          <div className="bg-slate-100 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Next Hearing: {currentCase.nextHearing}</div>
          </div>
          <div className="bg-slate-100 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">{currentCase.circuit}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <div className="bg-slate-700 rounded-full p-3 mr-4">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-700">AI Legal Assistant</h2>
            <p className="text-slate-600">Powered by Advanced Legal Intelligence</p>
          </div>
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
            <span className="text-sm font-medium text-slate-700">{currentCase.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-orange-600 h-2 rounded-full transition-all duration-300" style={{ width: `${currentCase.progress}%` }}></div>
          </div>
        </div>
        <div className="space-y-3">
          {caseProgress.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                {item.status === 'Complete' ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                ) : item.status === 'In Progress' ? (
                  <Clock className="h-5 w-5 text-orange-500 mr-3" />
                ) : (
                  <Calendar className="h-5 w-5 text-slate-400 mr-3" />
                )}
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
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-orange-600 mr-3" />
            <h2 className="text-xl font-bold text-slate-700">Upcoming Events</h2>
          </div>
          <span className="text-sm text-slate-600">Critical dates and deadlines</span>
        </div>
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${event.type === 'critical' ? 'border-red-400 bg-red-50' : event.type === 'important' ? 'border-orange-400 bg-orange-50' : 'border-green-400 bg-green-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{event.title}</h3>
                  <p className="text-sm text-slate-600">{event.date}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${event.type === 'critical' ? 'bg-red-200 text-red-800' : event.type === 'important' ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'}`}>
                    {event.daysRemaining} days remaining
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;