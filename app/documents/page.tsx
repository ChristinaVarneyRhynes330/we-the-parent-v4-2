// FILE: app/documents/page.tsx
// COMPLETE REPLACEMENT - Mobile optimized, works reliably

'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Upload, Trash2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useCase } from '@/contexts/CaseContext';

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
  const { activeCase } = useCase();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (activeCase) {
      fetchDocuments();
    }
  }, [activeCase]);

  const fetchDocuments = async () => {
    if (!activeCase) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/documents?case_id=${activeCase.id}`);
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      showMessage('error', 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !activeCase) return;

    e.target.value = '';

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        showMessage('error', `${file.name} is too large (max 10MB)`);
        continue;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caseId', activeCase.id);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        
        if (response.ok) {
          showMessage('success', `${file.name} uploaded successfully`);
          await fetchDocuments();
        } else {
          showMessage('error', data.error || 'Upload failed');
        }
      } catch (error) {
        showMessage('error', `Failed to upload ${file.name}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDelete = async (id: string, fileName: string) => {
    if (!confirm(`Delete ${fileName}?`)) return;

    try {
      const response = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      
      if (response.ok) {
        showMessage('success', 'Document deleted');
        await fetchDocuments();
      } else {
        showMessage('error', 'Delete failed');
      }
    } catch (error) {
      showMessage('error', 'Delete failed');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Motion': 'bg-dusty-mauve/10 text-dusty-mauve',
      'Evidence': 'bg-terracotta/10 text-terracotta',
      'Court Order': 'bg-garnet/10 text-garnet',
      'Affidavit': 'bg-olive-emerald/10 text-olive-emerald',
    };
    return colors[type] || 'bg-slate-gray/10 text-slate-gray';
  };

  return (
    <div className="min-h-screen bg-warm-ivory p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-header text-charcoal-navy">Documents</h1>
          <p className="text-slate-gray mt-2 text-sm md:text-base">
            Manage your case documents
          </p>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'error' 
              ? 'bg-garnet/10 text-garnet' 
              : 'bg-olive-emerald/10 text-olive-emerald'
          }`}>
            {message.type === 'error' ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Upload Button */}
        <div className="mb-6">
          <label className={`button-primary cursor-pointer flex items-center justify-center gap-2 w-full md:w-auto ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Document
              </>
            )}
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading || !activeCase}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              multiple
            />
          </label>
        </div>

        {/* Documents List */}
        {loading ? (
          <div className="card">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : documents.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No documents uploaded yet</p>
            <p className="text-sm text-gray-400 mt-2">Upload your first document to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="card hover:shadow-brand transition-shadow">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-dusty-mauve flex-shrink-0 mt-1" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-charcoal-navy truncate text-sm md:text-base">
                        {doc.file_name}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getTypeColor(doc.document_type)}`}>
                        {doc.document_type}
                      </span>
                    </div>
                    
                    {doc.summary && (
                      <p className="text-sm text-slate-gray mb-2 line-clamp-2">
                        {doc.summary}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                      <span>{formatSize(doc.file_size)}</span>
                      <span>•</span>
                      <span>{formatDate(doc.created_at)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(doc.id, doc.file_name)}
                    className="p-2 text-garnet hover:bg-garnet/10 rounded-lg transition-colors flex-shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {documents.length > 0 && (
          <div className="mt-6 card">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xl md:text-2xl font-header text-charcoal-navy">
                  {documents.length}
                </p>
                <p className="text-xs md:text-sm text-slate-gray">Total</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-header text-charcoal-navy">
                  {(documents.reduce((sum, doc) => sum + doc.file_size, 0) / 1048576).toFixed(1)}MB
                </p>
                <p className="text-xs md:text-sm text-slate-gray">Storage</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-header text-charcoal-navy">
                  {documents.filter(d => d.document_type === 'Motion').length}
                </p>
                <p className="text-xs md:text-sm text-slate-gray">Motions</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-header text-charcoal-navy">
                  {documents.filter(d => d.document_type === 'Evidence').length}
                </p>
                <p className="text-xs md:text-sm text-slate-gray">Evidence</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}