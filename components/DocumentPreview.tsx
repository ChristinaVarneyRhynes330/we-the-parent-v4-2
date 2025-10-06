'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, FileText, Eye, EyeOff, Maximize2, Minimize2, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const fetchDocumentContent = useCallback(async () => {
    if (!document) return;
    
    setLoading(true);
    setError(null);
    
    try {
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
  }, [document]);

  useEffect(() => {
    if (isOpen && document) {
      fetchDocumentContent();
    }
  }, [isOpen, document, fetchDocumentContent]);

  const handleDownload = async () => {
    if (!document) return;
    
    try {
      // Use window.document to access the global Document object
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document');
    }
  };

  if (!isOpen || !document) return null;

  return createPortal(
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${isFullscreen ? 'p-0' : ''}`}>
      <div className={`bg-white rounded-lg overflow-hidden ${isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl max-h-[90vh]'} flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-dusty-mauve" />
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-gray-800 truncate">{document.file_name}</span>
              <p className="text-sm text-slate-gray">{document.summary}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRaw(!showRaw)}
              className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label={showRaw ? 'Hide Raw Content' : 'Show Raw Content'}
            >
              {showRaw ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dusty-mauve"></div>
              <span className="ml-3 text-slate-gray">Loading document...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-garnet mx-auto mb-4" />
                <p className="text-garnet">{error}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {showRaw ? (
                <pre className="whitespace-pre-wrap text-sm font-mono">{content}</pre>
              ) : (
                <div className="prose prose-sm max-w-none">
                  {content.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleDownload}
              className="button-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>,
    window.document.body
  );
}
