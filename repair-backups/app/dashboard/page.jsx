import { BarChart, FolderKanban, Bell, FileText, CheckSquare, Clock } from 'lucide-react';

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Active Cases" value="1" icon={<FolderKanban size={24} className="text-white"/>} color="bg-blue-500" />
        <DashboardCard title="Upcoming Deadlines" value="3" icon={<Bell size={24} className="text-white"/>} color="bg-yellow-500" />
        <DashboardCard title="Documents Filed" value="12" icon={<FileText size={24} className="text-white"/>} color="bg-green-500" />
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Case Progress</h2>
            {/* This is a placeholder for a real progress tracker */}
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckSquare size={20} className="text-green-500 mr-3" />
                <p>Initial Petition Filed</p>
              </div>
              <div className="flex items-center">
                <Clock size={20} className="text-yellow-500 mr-3" />
                <p>Discovery Phase</p>
              </div>
               <div className="flex items-center text-gray-400">
                <Clock size={20} className="mr-3" />
                <p>Pre-trial Hearing</p>
              </div>
            </div>
        </div>
         <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
            {/* This is a placeholder for a real activity feed */}
            <ul className="space-y-3">
              <li>- AI analysis of "Motion to Compel" completed.</li>
              <li>- New deadline added: "Respond to Interrogatories".</li>
            </ul>
        </div>
      </div>
    </div>
  );
}