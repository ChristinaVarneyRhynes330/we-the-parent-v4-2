import { FolderKanban } from 'lucide-react';

export default function Cases() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <FolderKanban size={48} className="text-gray-400 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800">My Cases</h1>
      <p className="text-gray-500 mt-2">
        This page is under construction. Future updates will allow you to manage and view all of your cases.
      </p>
    </div>
  );
}