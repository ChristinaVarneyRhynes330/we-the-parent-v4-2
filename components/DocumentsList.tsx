'use client';

import React, { useState } from 'react';
import { useDocuments, Document } from '@/hooks/useDocuments';
import { FileText, Download, Eye, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentPreview from './DocumentPreview'; // Import the preview component

interface DocumentsListProps {
  caseId: string;
}

const DocumentsList: React.FC<DocumentsListProps> = ({ caseId }) => {
  const { 
    documents, 
    isLoading, 
    error, 
    uploadDocument, 
    isUploading, 
    deleteDocument 
  } = useDocuments(caseId);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string>('');
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>('');
  const [previewingDoc, setPreviewingDoc] = useState<Document | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadSuccessMessage('');
      setUploadErrorMessage('');
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadErrorMessage('Please select a file first.');
      return;
    }

    uploadDocument({ file: selectedFile, caseId }, {
      onSuccess: () => {
        setUploadSuccessMessage(`Successfully uploaded ${selectedFile.name}`);
        setSelectedFile(null);
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if(fileInput) fileInput.value = "";
      },
      onError: (err) => {
        setUploadErrorMessage(err.message || 'Upload failed. Please try again.');
      }
    });
  };

  const handleDocumentDelete = (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(documentId);
    }
  };

  const handleDownload = async (doc: Document) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const downloadUrl = `${supabaseUrl}/storage/v1/object/public/case_documents/${doc.file_path}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row items-center gap-4">
            <label htmlFor="file-input" data-testid="upload-document-label" className="flex-grow p-2 border rounded-md w-full cursor-pointer text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors">
              {selectedFile ? selectedFile.name : 'Click to select a file...'}
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button type="submit" disabled={isUploading || !selectedFile}>
              {isUploading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </form>
          {uploadSuccessMessage && <p data-testid="upload-success-message" className="text-green-600 mt-2">{uploadSuccessMessage}</p>}
          {uploadErrorMessage && <p className="text-red-600 mt-2">{uploadErrorMessage}</p>}
        </div>

        <h2 className="text-xl font-semibold mb-4">Case Documents</h2>
        {isLoading && <p>Loading documents...</p>}
        {error && <p className="text-red-600">Error: {error.message}</p>}
        
        <div className="space-y-4">
          {!isLoading && !error && documents.length === 0 ? (
            <div className="text-center py-8 card">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents found for this case.</p>
            </div>
          ) : (
            documents.map((doc: Document) => (
              <div key={doc.id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                    <FileText className="w-5 h-5 text-dusty-mauve flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-charcoal-navy">{doc.file_name}</h3>
                      <p className="text-sm text-slate-gray">
                        {doc.document_type || 'File'} • Uploaded on {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <Button variant="outline" size="sm" title="View document" onClick={() => setPreviewingDoc(doc)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" title="Download document" onClick={() => handleDownload(doc)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructiveOutline" 
                      size="sm"
                      onClick={() => handleDocumentDelete(doc.id)}
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {previewingDoc && (
        <DocumentPreview 
          isOpen={!!previewingDoc} 
          onClose={() => setPreviewingDoc(null)} 
          document={previewingDoc} 
        />
      )}
    </>
  );
};

export default DocumentsList;