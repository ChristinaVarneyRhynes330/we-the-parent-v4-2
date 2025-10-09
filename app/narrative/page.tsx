'use client';

import React, { useState } from 'react';
import { useCase } from '@/contexts/CaseContext';
import { useNarrative, NarrativeEntry } from '@/hooks/useNarrative';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';

export default function NarrativePage() {
  const { activeCase } = useCase();
  const { 
    entries, 
    isLoading, 
    error, 
    createEntry, 
    updateEntry, 
    deleteEntry 
  } = useNarrative(activeCase?.id);

  const [newEntryContent, setNewEntryContent] = useState('');
  const [editingEntry, setEditingEntry] = useState<NarrativeEntry | null>(null);

  const handleAddEntry = () => {
    if (!newEntryContent.trim() || !activeCase) return;
    createEntry({ case_id: activeCase.id, content: newEntryContent });
    setNewEntryContent('');
  };

  const handleUpdateEntry = () => {
    if (!editingEntry || !editingEntry.content.trim()) return;
    updateEntry({ id: editingEntry.id, content: editingEntry.content });
    setEditingEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id);
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-header text-charcoal-navy">Case Narrative</h1>
          <p className="text-slate-gray mt-2">Build and manage the chronological story of your case.</p>
        </div>

        <div className="card mb-6">
          <h2 className="section-subheader mb-4">Add New Narrative Entry</h2>
          <textarea
            value={newEntryContent}
            onChange={(e) => setNewEntryContent(e.target.value)}
            placeholder="Enter a new narrative point..."
            className="form-input w-full mb-4"
            rows={3}
          />
          <button onClick={handleAddEntry} className="button-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Entry
          </button>
        </div>

        {isLoading && <p>Loading entries...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}

        <div className="space-y-4">
          {entries.length > 0 ? (
            entries.map(entry => (
              <div key={entry.id} className="card">
                {editingEntry?.id === entry.id ? (
                  <div>
                    <textarea
                      value={editingEntry.content}
                      onChange={(e) => setEditingEntry({ ...editingEntry, content: e.target.value })}
                      className="form-input w-full mb-4"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <button onClick={handleUpdateEntry} className="button-primary">Save</button>
                      <button onClick={() => setEditingEntry(null)} className="button-secondary">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <p className="text-slate-gray whitespace-pre-wrap">{entry.content}</p>
                    <div className="flex gap-2 flex-shrink-0 ml-4">
                      <button onClick={() => setEditingEntry(entry)} className="p-2 text-dusty-mauve hover:bg-dusty-mauve/10 rounded-lg" aria-label="Edit entry" data-testid="edit-entry-button">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteEntry(entry.id)} className="p-2 text-garnet hover:bg-garnet/10 rounded-lg" aria-label="Delete entry" data-testid="delete-entry-button">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="card text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No narrative entries yet.</p>
              <p className="text-sm text-gray-400 mt-1">Add your first entry to begin building your case narrative.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}