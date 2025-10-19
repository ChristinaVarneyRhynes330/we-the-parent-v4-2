// File: app/compliance/page.tsx (Full Content Replacement)

'use client';

import React, { useState, useEffect } from 'react';
import { useCases } from '@/contexts/CaseContext'; // <-- FIX: Changed useCase to useCases (Error 1)
import { ComplianceIssue, ApiResponse } from '@/types';
import { CheckCircle, Clock, Plus, Upload, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns'; 
// NOTE: For 'date-fns' error (Error 2), run: npm install date-fns

// --- MOCK API CALLS (Interacts with the API route from Step 10) ---
const API_URL = '/api/compliance';

// Fetch function
async function fetchComplianceData(): Promise<ComplianceIssue[]> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch compliance data.");
    const json: ApiResponse<ComplianceIssue[]> = await response.json();
    if (!json.success) throw new Error(json.error || "Unknown API error.");
    
    // For local development, if the mock returns empty, return a default set
    if (json.data && json.data.length > 0) return json.data;

    // Zero-Cost Mock Data Fallback (ALIGNED WITH UPDATED ComplianceIssue TYPE)
    return [
        { id: 'c1', severity: 'error', message: 'Complete 12-week Parenting Class', ruleId: 'Court Order 1.1', created_at: '2025-05-01T00:00:00Z', isCompleted: false, dueDate: '2025-11-30' },
        { id: 'c2', severity: 'warning', message: 'Submit proof of stable housing', ruleId: 'Case Plan 2.A', created_at: '2025-05-15T00:00:00Z', isCompleted: false, dueDate: '2025-10-01' },
        { id: 'c3', severity: 'error', message: 'Attend weekly supervised visits', ruleId: 'Court Order 3.2', created_at: '2025-04-01T00:00:00Z', isCompleted: true, dueDate: '2025-12-31' },
    ] as ComplianceIssue[]; 
}

// Post function (Simplified for the initial component focus)
async function postComplianceTask(task: { message: string, dueDate: string }): Promise<ComplianceIssue> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, severity: 'warning' }),
    });
    if (!response.ok) throw new Error("Failed to create compliance task.");
    const json: ApiResponse<ComplianceIssue> = await response.json();
    if (!json.success) throw new Error(json.error || "Unknown API error.");
    
    // MOCK: Return a mock ComplianceIssue object that satisfies the updated interface
    return {
        id: Date.now().toString(),
        severity: 'warning',
        message: task.message,
        ruleId: 'Manual Entry',
        isCompleted: false,
        dueDate: task.dueDate,
        created_at: new Date().toISOString(),
    } as ComplianceIssue;
}
// -----------------------------------------------------------------------


export default function CompliancePage() {
    const { cases } = useCases(); // <-- FIX: Correctly destructuring 'cases' from useCases
    const activeCase = cases.find(c => c.id === 'case-001'); // Mocking active case selection

    const [tasks, setTasks] = useState<ComplianceIssue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newTaskMessage, setNewTaskMessage] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    useEffect(() => {
        const loadTasks = async () => {
            if (!activeCase?.id) return;
            try {
                const data = await fetchComplianceData();
                setTasks(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };
        loadTasks();
    }, [activeCase?.id]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskMessage.trim() || !activeCase) return;

        try {
            const newTask = await postComplianceTask({ 
                message: newTaskMessage, 
                dueDate: newTaskDueDate 
            });
            setTasks(prev => [newTask, ...prev]); 
            
            setNewTaskMessage('');
            setNewTaskDueDate(format(new Date(), 'yyyy-MM-dd'));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add task.");
        }
    };

    const toggleCompletion = (id: string) => {
        // This would normally be a PUT/PATCH API call
        setTasks(prev => 
            prev.map(task => 
                task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
            )
        );
    };

    const ComplianceCard: React.FC<{ task: ComplianceIssue }> = ({ task }) => {
        const isOverdue = !task.isCompleted && task.dueDate && new Date(task.dueDate) < new Date();
        const statusIcon = task.isCompleted ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-yellow-500" />;
        const bgColor = isOverdue ? 'bg-red-50' : (task.isCompleted ? 'bg-green-50' : 'bg-white');
        
        return (
            <div className={`p-4 border rounded-lg shadow-sm flex justify-between items-center ${bgColor}`}>
                <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-1">
                        {statusIcon}
                        <p className={`font-semibold ${isOverdue ? 'text-red-700' : 'text-gray-800'}`}>
                            {task.message} 
                            {isOverdue && <span className="ml-2 text-xs font-bold text-red-500">(OVERDUE)</span>}
                        </p>
                    </div>
                    <p className="text-sm text-gray-600 ml-7">
                        <span className="font-medium">Rule ID:</span> {task.ruleId} | 
                        <span className="font-medium ml-2">Due:</span> {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'N/A'}
                    </p>
                </div>
                
                <div className="flex space-x-3 items-center flex-shrink-0">
                    <button 
                        onClick={() => toggleCompletion(task.id)}
                        className={`p-2 rounded-full transition-colors ${task.isCompleted ? 'bg-gray-200 hover:bg-gray-300' : 'bg-green-100 hover:bg-green-200'}`}
                        title={task.isCompleted ? "Mark as Pending" : "Mark as Completed"}
                    >
                        {task.isCompleted ? <Edit className="w-5 h-5 text-gray-600" /> : <CheckCircle className="w-5 h-5 text-green-600" />}
                    </button>
                    <button 
                        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
                        title="Upload Proof of Completion"
                    >
                        <Upload className="w-5 h-5" />
                    </button>
                    <button 
                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                        title="Delete Task"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Compliance Tracking</h1>
                    <p className="text-gray-600 mt-2">Manage court-ordered tasks and prepare verifiable proof of completion.</p>
                </header>

                {/* Add New Task Form */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                        <Plus className="w-6 h-6"/> Add New Compliance Requirement
                    </h2>
                    <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="e.g., Complete 12 sessions of trauma therapy"
                            value={newTaskMessage}
                            onChange={(e) => setNewTaskMessage(e.target.value)}
                            className="flex-grow border border-gray-300 p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                         <input
                            type="date"
                            value={newTaskDueDate}
                            onChange={(e) => setNewTaskDueDate(e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg"
                            title="Due Date"
                            required
                        />
                        <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0">
                            Add Task
                        </button>
                    </form>
                </div>

                {/* Compliance List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Case Plan Tasks</h2>
                    {isLoading && <p>Loading compliance tasks...</p>}
                    {error && <p className="text-red-500 p-4 bg-red-100 border border-red-400 rounded-lg">Error loading tasks: {error}</p>}

                    {!isLoading && tasks.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No compliance tasks found for this case.</p>
                        </div>
                    )}
                    
                    {!isLoading && tasks.length > 0 && (
                        tasks.map(task => (
                            <ComplianceCard key={task.id} task={task} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}