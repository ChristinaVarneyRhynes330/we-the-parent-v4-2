'use client';

import { useState, useEffect } from 'react';
import { FileText, Upload, Search, Filter, Download, Eye, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { CASE_ID, DOCUMENT_TYPES } from '@/constants/case';

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
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        await fetchDocuments();
        alert('Document uploaded successfully!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    else return Math.round(bytes / 1048576) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.summary && doc.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || doc.document_type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-ivory p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
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

        {/* Search and Filter Bar */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search documents..."
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
                {Object.values(DOCUMENT_TYPES).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="grid gap-4">
          {filteredDocuments.length === 0 ? (
            <div className="card text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
              <p className="text-sm text-gray-400 mt-1">Upload your first document to get started</p>
            </div>
          ) : (
            filteredDocuments.map(doc => (
              <div key={doc.id} className="card hover:shadow-brand transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-dusty-mauve" />
                      <h3 className="font-semibold text-charcoal-navy">{doc.file_name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        doc.document_type === 'Motion' ? 'bg-dusty-mauve/10 text-dusty-mauve' :
                        doc.document_type === 'Evidence' ? 'bg-terracotta/10 text-terracotta' :
                        doc.document_type === 'Court Order' ? 'bg-garnet/10 text-garnet' :
                        'bg-slate-gray/10 text-slate-gray'
                      }`}>
                        {doc.document_type || 'Uncategorized'}
                      </span>
                    </div>
                    {doc.summary && (
                      <p className="text-sm text-slate-gray mb-2">{doc.summary}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span>•</span>
                      <span>{formatDate(doc.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 text-dusty-mauve hover:bg-dusty-mauve/10 rounded-lg transition-colors" title="View">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-olive-emerald hover:bg-olive-emerald/10 rounded-lg transition-colors" title="Download">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-garnet hover:bg-garnet/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="card text-center">
            <p className="text-3xl font-header text-charcoal-navy">{documents.length}</p>
            <p className="text-sm text-slate-gray">Total Documents</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-header text-dusty-mauve">
              {documents.filter(d => d.document_type === 'Motion').length}
            </p>
            <p className="text-sm text-slate-gray">Motions</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-header text-terracotta">
              {documents.filter(d => d.document_type === 'Evidence').length}
            </p>
            <p className="text-sm text-slate-gray">Evidence Items</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-header text-olive-emerald">
              {documents.filter(d => d.document_type === 'Court Order').length}
            </p>
            <p className="text-sm text-slate-gray">Court Orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}