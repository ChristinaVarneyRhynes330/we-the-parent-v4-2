'use client';

import React, { useState, useEffect, ChangeEvent } from 'react'; // FIX: Removed the stray 'a'
import { FileText, Upload, Search, Filter, Download, Eye, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// This should match the 'case_id' for your sample case in Supabase.
const CASE_ID = 'bf45b3cd-652c-43db-b535-38ab89877ff9'; 

const DOCUMENT_TYPES = {
  MOTION: 'Motion',
  EVIDENCE: 'Evidence',
  COURT_ORDER: 'Court Order',
  AFFIDAVIT: 'Affidavit',
  LETTER: 'Letter',
  OTHER: 'Other'
};

interface Document {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  document_type: string;
  summary: string;
  created_at: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', CASE_ID)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      setError('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        await fetchDocuments(); // Refresh the list with the new document
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };
  
  const getDocTypeColor = (docType: string) => {
    switch (docType) {
        case DOCUMENT_TYPES.MOTION: return 'bg-dusty-mauve/10 text-dusty-mauve';
        case DOCUMENT_TYPES.EVIDENCE: return 'bg-terracotta/10 text-terracotta';
        case DOCUMENT_TYPES.COURT_ORDER: return 'bg-garnet/10 text-garnet';
        default: return 'bg-slate-gray/10 text-slate-gray';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.summary && doc.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || doc.document_type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-header text-charcoal-navy">Documents</h1>
            <p className="text-slate-gray mt-2">Manage your case documents and evidence</p>
          </div>
          <label className={`button-primary cursor-pointer flex items-center gap-2 ${uploading ? 'opacity-50' : ''}`}>
            <Upload className="w-5 h-5" />
            {uploading ? 'Uploading...' : 'Upload Document'}
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
          </label>
        </div>

        {error && <div className="bg-garnet/10 text-garnet p-3 rounded-lg mb-4">{error}</div>}

        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search documents by name or summary..."
                className="form-input pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                className="form-input pl-10 pr-8"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {Object.values(DOCUMENT_TYPES).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredDocuments.length === 0 ? (
            <div className="card text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
              <p className="text-sm text-gray-400 mt-1">Upload your first document to get started.</p>
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div key={doc.id} className="card hover:shadow-brand transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-dusty-mauve flex-shrink-0" />
                      <h3 className="font-semibold text-charcoal-navy truncate" title={doc.file_name}>{doc.file_name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getDocTypeColor(doc.document_type)}`}>
                        {doc.document_type || 'Uncategorized'}
                      </span>
                    </div>
                    {doc.summary && (
                      <p className="text-sm text-slate-gray mb-3 pl-8">{doc.summary}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 pl-8">
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span>•</span>
                      <span>{formatDate(doc.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-dusty-mauve hover:bg-dusty-mauve/10 rounded-lg transition-colors" title="View"><Eye className="w-5 h-5" /></button>
                    <button className="p-2 text-olive-emerald hover:bg-olive-emerald/10 rounded-lg transition-colors" title="Download"><Download className="w-5 h-5" /></button>
                    <button className="p-2 text-garnet hover:bg-garnet/10 rounded-lg transition-colors" title="Delete"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}