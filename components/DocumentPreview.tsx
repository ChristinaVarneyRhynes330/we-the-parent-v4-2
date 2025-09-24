'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    document_type: string;
    summary: string;
    created_at: string;
    file_path?: string;
  } | null;
}

export default function DocumentPreview({ isOpen, onClose, document }: DocumentPreviewProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    if (isOpen && document) {
      fetchDocumentContent();
    }
  }, [isOpen, document]);

  const fetchDocumentContent = async () => {
    if (!document) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you'd fetch from Supabase Storage
      // For now, we'll simulate based on document type
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      
      if (document.file_type.includes('text') || document.file_type.includes('json')) {
        setContent(`Sample content for ${document.file_name}\n\nThis is a preview of the document content. In a real implementation, this would fetch the actual file content from storage.\n\nDocument Details:\n- Type: ${document.document_type}\n- Size: ${formatFileSize(document.file_size)}\n- Created: ${new Date(document.created_at).toLocaleString()}\n\nSummary: ${document.summary}`);
      } else if (document.file_type.includes('pdf')) {
        setContent(`PDF Preview for ${document.file_name}\n\n[PDF content would be extracted and displayed here]\n\nThis document contains ${Math.floor(document.file_size / 1000)} estimated characters.`);
      } else {
        setContent(`File: ${document.file_name}\nType: ${document.file_type}\n\nPreview not available for this file type. Use download to access the full file.`);
      }
    } catch (err: any) {
      setError(`Failed to load document: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleDownload = async () => {
    if (!document) return;
    
    try {
      // In a real implementation, you'd download from Supabase Storage
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document');
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${isFullscreen ? 'p-0' : ''}`}>
      <div className={`bg-white rounded-lg overflow-hidden ${isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl max-h-[90vh]'} flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-dusty-mauve" />
            <div>
              <h2 className="font-semibold text-charcoal-navy truncate max-w-md" title={document.file_name}>
                {document.file_name}
              </h2>
              <p className="text-sm text-slate-gray">
                {document.document_type} • {formatFileSize(document.file_size)} • {new Date(document.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRaw(!showRaw)}
              className="p-2 text-slate-gray hover:bg-gray-200 rounded-lg transition-colors"
              title={showRaw ? 'Show formatted' : 'Show raw text'}
            >
              {showRaw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-gray hover:bg-gray-200 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 text-olive-emerald hover:bg-olive-emerald/10 rounded-lg transition-colors"
              title="Download document"
            >
              <Download className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-slate-gray hover:bg-gray-200 rounded-lg transition-colors"
              title="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Summary */}
        {document.summary && (
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h3 className="font-medium text-charcoal-navy mb-1">AI Summary</h3>
            <p className="text-sm text-slate-gray">{document.summary}