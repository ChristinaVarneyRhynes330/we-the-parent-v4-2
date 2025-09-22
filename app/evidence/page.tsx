'use client';

import React, { useState } from 'react';
import { Upload, FileText, Image, Video, Download, Eye, Trash2 } from 'lucide-react';

interface EvidenceItem {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'audio';
  category: string;
  uploadDate: string;
  size: string;
}

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);

      try {
        const response = await fetch('/api/evidence', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setEvidence(prev => [...prev, {
            id: data.id,
            name: data.name,
            type: getFileType(data.type),
            category: data.category,
            uploadDate: data.uploadDate,
            size: formatFileSize(data.size)
          }]);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    
    setUploading(false);
  };

  const getFileType = (mimeType: string): EvidenceItem['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    else return Math.round(bytes / 1048576) + ' MB';
  };

  const getFileIcon = (type: EvidenceItem['type']) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5 text-terracotta" />;
      case 'video':
        return <Video className="w-5 h-5 text-dusty-mauve" />;
      case 'document':
        return <FileText className="w-5 h-5 text-olive-emerald" />;
      default:
        return <FileText className="w-5 h-5 text-slate-gray" />;
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-header text-charcoal-navy">Evidence Manager</h1>
            <p className="text-slate-gray mt-2">Upload and organize evidence for your case</p>
          </div>
          <label className={`button-primary cursor-pointer flex items-center gap-2 ${uploading ? 'opacity-50' : ''}`}>
            <Upload className="w-5 h-5" />
            {uploading ? 'Uploading...' : 'Upload Evidence'}
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mp3"
            />
          </label>
        </div>

        {/* Evidence List */}
        <div className="grid gap-4">
          {evidence.length === 0 ? (
            <div className="card text-center py-12">
              <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No evidence uploaded yet</p>
              <p className="text-sm text-gray-400 mt-1">Upload documents, photos, or other evidence files</p>
            </div>
          ) : (
            evidence.map((item) => (
              <div key={item.id} className="card hover:shadow-brand transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(item.type)}
                    <div>
                      <h3 className="font-semibold text-charcoal-navy">{item.name}</h3>
                      <p className="text-sm text-slate-gray">
                        {item.category} • {item.uploadDate} • {item.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-dusty-mauve hover:bg-dusty-mauve/10 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-olive-emerald hover:bg-olive-emerald/10 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-garnet hover:bg-garnet/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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