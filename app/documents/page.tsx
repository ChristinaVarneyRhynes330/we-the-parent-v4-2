'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { FileText, Upload, Search, Filter, Download, Eye, Trash2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import DocumentPreview from '@/components/DocumentPreview';
import { useDocuments, Document } from '@/hooks/useDocuments';
import { useCase } from '@/contexts/CaseContext';

const DOCUMENT_TYPES = {
  MOTION: 'Motion',
  EVIDENCE: 'Evidence',
  COURT_ORDER: 'Court Order',
  AFFIDAVIT: 'Affidavit',
  LETTER: 'Letter',
  OTHER: 'Other'
};

interface UploadStatus {
  uploading: boolean;
  progress: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function DocumentsPage() {
  const { activeCase } = useCase();
  const { 
    documents, 
    isLoading, 
    error: documentsError, 
    deleteDocument,
    isDeleting 
  } = useDocuments(activeCase?.id || '');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    uploading: false,
    progress: 0,
    message: '',
    type: 'info'
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (documentsError) {
      setError(documentsError.message);
    }
  }, [documentsError]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Reset the input value so the same file can be uploaded again
    event.target.value = '';

    // Validate file types and sizes
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'];
    
    // Convert FileList to an array to fix the TypeScript error.
    const fileArray = Array.from(files);

    for (let file of fileArray) {
      if (file.size > maxFileSize) {
        setUploadStatus({
          uploading: false,
          progress: 0,
          message: `File "${file.name}" is too large. Maximum size is 10MB.`,
          type: 'error'
        });
        return;
      }
      
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setUploadStatus({
          uploading: false,
          progress: 0,
          message: `File type not supported. Allowed types: ${allowedTypes.join(', ')}`,
          type: 'error'
        });
        return;
      }
    }

    // Process each file
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      setUploadStatus({
        uploading: true,
        progress: Math.round((i / fileArray.length) * 50), // First 50% for processing
        message: `Processing ${file.name}...`,
        type: 'info'
      });

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        setUploadStatus({
          uploading: true,
          progress: Math.round(((i + 0.5) / fileArray.length) * 100),
          message: `Analyzing ${file.name}...`,
          type: 'info'
        });

        const data = await response.json();
        
        if (response.ok) {
          setUploadStatus({
            uploading: false,
            progress: Math.round(((i + 1) / fileArray.length) * 100),
            message: `Successfully uploaded ${file.name}`,
            type: 'success'
          });
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (error: any) {
        console.error('Upload error:', error);
        setUploadStatus({
          uploading: false,
          progress: 0,
          message: `Failed to upload ${file.name}: ${error.message}`,
          type: 'error'
        });
        return; // Stop processing remaining files on error
      }
    }

    // Refresh the document list
    if (uploadStatus.type !== 'error') {
      // The useDocuments hook will automatically refetch
      // Clear success message after a delay
      setTimeout(() => {
        setUploadStatus({
          uploading: false,
          progress: 0,
          message: '',
          type: 'info'
        });
      }, 3000);
    }
  };

  const handleDocumentView = (doc: Document) => {
    setSelectedDocument(doc);
    setPreviewOpen(true);
  };

  const handleDocumentDelete = async (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (!doc) return;

    if (!confirm(`Are you sure you want to delete "${doc.file_name}"? This action cannot be undone.`)) {
      return;
    }

    deleteDocument(documentId, {
      onSuccess: () => {
        setUploadStatus({
          uploading: false,
          progress: 0,
          message: `Successfully deleted "${doc.file_name}"`,
          type: 'success'
        });
        setTimeout(() => {
          setUploadStatus({ uploading: false, progress: 0, message: '', type: 'info' });
        }, 3000);
      },
      onError: (error) => {
        setUploadStatus({
          uploading: false,
          progress: 0,
          message: `Failed to delete document: ${error.message}`,
          type: 'error'
        });
      }
    });
  };

  const handleDocumentDownload = async (doc: Document) => {
    try {
      // In a real implementation, you'd download from Supabase Storage
      // For now, we'll create a simple text file with document info
      const content = `Document: ${doc.file_name}\nType: ${doc.document_type}\nSummary: ${doc.summary}\nCreated: ${doc.created_at}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
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
  
  const getDocTypeColor = (docType: string) => {
    switch (docType) {
      case DOCUMENT_TYPES.MOTION: return 'bg-dusty-mauve/10 text-dusty-mauve border-dusty-mauve/20';
      case DOCUMENT_TYPES.EVIDENCE: return 'bg-terracotta/10 text-terracotta border-terracotta/20';
      case DOCUMENT_TYPES.COURT_ORDER: return 'bg-garnet/10 text-garnet border-garnet/20';
      case DOCUMENT_TYPES.AFFIDAVIT: return 'bg-olive-emerald/10 text-olive-emerald border-olive-emerald/20';
      default: return 'bg-slate-gray/10 text-slate-gray border-slate-gray/20';
    }
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
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-20 bg-gray-200 rounded mb-6"></div>
            <div className="grid gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DocumentPreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        document={selectedDocument}
      />

      <div className="min-h-screen bg-warm-ivory p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-header text-charcoal-navy">Documents</h1>
              <p className="text-slate-gray mt-2">Manage your case documents and evidence</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={fetchDocuments}
                disabled={loading}
                className="button-secondary flex items-center gap-2"
                title="Refresh documents"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <label className={`button-primary cursor-pointer flex items-center gap-2 ${uploadStatus.uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Upload className="w-5 h-5" />
                {uploadStatus.uploading ? 'Uploading...' : 'Upload Document'}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploadStatus.uploading}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  multiple
                />
              </label>
            </div>
          </div>

          {/* Upload Status */}
          {(uploadStatus.message || error) && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              uploadStatus.type === 'error' || error 
                ? 'bg-garnet/10 text-garnet border border-garnet/20' 
                : uploadStatus.type === 'success' 
                ? 'bg-olive-emerald/10 text-olive-emerald border border-olive-emerald/20'
                : 'bg-dusty-mauve/10 text-dusty-mauve border border-dusty-mauve/20'
            }`}>
              {uploadStatus.type === 'error' || error ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              ) : uploadStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current flex-shrink-0"></div>
              )}
              
              <div className="flex-1">
                <p>{error || uploadStatus.message}</p>
                {uploadStatus.uploading && uploadStatus.progress > 0 && (
                  <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                    <div 
                      className="bg-current h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadStatus.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              {(error || uploadStatus.type === 'error') && (
                <button
                  onClick={() => {
                    setError(null);
                    setUploadStatus({ uploading: false, progress: 0, message: '', type: 'info' });
                  }}
                  className="text-current hover:opacity-70"
                  title="Dismiss"
                >
                  &times;
                </button>
              )}
            </div>
          )}

          {/* Search and Filter */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <label htmlFor="document-search" className="sr-only">Search documents</label>
                <input
                  type="search"
                  id="document-search"
                  placeholder="Search documents by name or summary..."
                  className="form-input pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <label htmlFor="document-filter" className="sr-only">Filter documents by type</label>
                <select
                  id="document-filter"
                  className="form-input pl-10 pr-8"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types ({documents.length})</option>
                  {Object.values(DOCUMENT_TYPES).map((type) => {
                    const count = documents.filter(doc => doc.document_type === type).length;
                    return (
                      <option key={type} value={type}>{type} ({count})</option>
                    );
                  })}
                </select>
              </div>
            </div>
            
            {searchTerm && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-slate-gray">
                  Showing {filteredDocuments.length} of {documents.length} documents
                  {filteredDocuments.length !== documents.length && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 text-dusty-mauve hover:text-garnet"
                    >
                      Clear search to see all documents
                    </button>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Documents Grid */}
          <div className="grid gap-4">
            {filteredDocuments.length === 0 ? (
              <div className="card text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                {searchTerm ? (
                  <div>
                    <p className="text-gray-500">No documents found matching "{searchTerm}"</p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-dusty-mauve hover:text-garnet mt-2"
                    >
                      Clear search to see all documents
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-500">No documents found</p>
                    <p className="text-sm text-gray-400 mt-1">Upload your first document to get started.</p>
                  </div>
                )}
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div key={doc.id} className="card hover:shadow-brand transition-all duration-200 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-dusty-mauve flex-shrink-0" />
                        <h3 className="font-semibold text-charcoal-navy truncate flex-1" title={doc.file_name}>
                          {doc.file_name}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${getDocTypeColor(doc.document_type)}`}>
                          {doc.document_type || 'Uncategorized'}
                        </span>
                      </div>
                      
                      {doc.summary && (
                        <p className="text-sm text-slate-gray mb-3 pl-8 line-clamp-2">{doc.summary}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 pl-8">
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>•</span>
                        <span>{formatDate(doc.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDocumentView(doc)}
                        className="p-2 text-dusty-mauve hover:bg-dusty-mauve/10 rounded-lg transition-colors" 
                        title="Preview document"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      <button 
                        onClick={() => handleDocumentDownload(doc)}
                        className="p-2 text-olive-emerald hover:bg-olive-emerald/10 rounded-lg transition-colors" 
                        title="Download document"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      
                      <button 
                        onClick={() => handleDocumentDelete(doc.id)}
                        className="p-2 text-garnet hover:bg-garnet/10 rounded-lg transition-colors" 
                        title="Delete document"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Statistics */}
          {documents.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-header text-charcoal-navy">{documents.length}</p>
                  <p className="text-sm text-slate-gray">Total Documents</p>
                </div>
                <div>
                  <p className="text-2xl font-header text-charcoal-navy">
                    {Math.round(documents.reduce((sum, doc) => sum + doc.file_size, 0) / 1048576 * 10) / 10}MB
                  </p>
                  <p className="text-sm text-slate-gray">Storage Used</p>
                </div>
                <div>
                  <p className="text-2xl font-header text-charcoal-navy">
                    {documents.filter(doc => doc.document_type === 'Motion').length}
                  </p>
                  <p className="text-sm text-slate-gray">Motions</p>
                </div>
                <div>
                  <p className="text-2xl font-header text-charcoal-navy">
                    {documents.filter(doc => doc.document_type === 'Evidence').length}
                  </p>
                  <p className="text-sm text-slate-gray">Evidence Files</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}