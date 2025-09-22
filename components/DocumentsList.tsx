'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Trash2 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  lastModified: string;
  size: string;
}

interface DocumentsListProps {
  documents?: Document[];
  onDocumentClick?: (document: Document) => void;
  onDocumentDelete?: (documentId: string) => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents = [],
  onDocumentClick,
  onDocumentDelete
}) => {
  const [loading, setLoading] = useState(false);

  const handleDocumentClick = (doc: Document) => {
    if (onDocumentClick) {
      onDocumentClick(doc);
    }
  };

  const handleDocumentDelete = (docId: string) => {
    if (onDocumentDelete) {
      onDocumentDelete(docId);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No documents found</p>
        </div>
      ) : (
        documents.map((doc: Document) => (
          <div key={doc.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-dusty-mauve" />
                <div>
                  <h3 className="font-medium text-charcoal-navy">{doc.name}</h3>
                  <p className="text-sm text-slate-gray">{doc.type} • {doc.lastModified}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDocumentClick(doc)}
                  className="p-2 text-dusty-mauve hover:bg-dusty-mauve/10 rounded-lg transition-colors"
                  title="View document"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-olive-emerald hover:bg-olive-emerald/10 rounded-lg transition-colors"
                  title="Download document"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDocumentDelete(doc.id)}
                  className="p-2 text-garnet hover:bg-garnet/10 rounded-lg transition-colors"
                  title="Delete document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DocumentsList;