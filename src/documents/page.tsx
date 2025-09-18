// components/UploadForm.tsx
'use client';

import React from 'react';

type UploadFormProps = {
  onUpload: (files: FileList) => void;
};

export default function UploadForm({ onUpload }: UploadFormProps) {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Select files
      </label>
      <input
        id="file-upload"
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onUpload(e.target.files);
        }}
      />
    </div>
  );
}