import React from 'react';
import { Upload, FileText, Lightbulb, CheckCircle, RefreshCw, Edit3, List, AlertTriangle } from 'lucide-react';

const Documents = ({ fileInputRef, handleFileUpload, uploadedFiles, setActiveTab, handleQuickAction, documentTypes, motionFormData, setMotionFormData, currentCase }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-700">Document Center</h1>
          <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Upload className="h-4 w-4 mr-2" />Upload Files
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Lightbulb className="h-6 w-6 text-orange-500 mr-3" />
          <h2 className="text-lg font-semibold text-slate-700">Smart Suggestion</h2>
        </div>
        <p className="text-slate-600 mb-4">Based on your case timeline, I recommend filing a Motion for Increased Visitation before your next hearing.</p>
        <button onClick={() => { setActiveTab('motion_drafting'); handleQuickAction("Start Drafting"); }} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">Start Drafting Now</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 text-orange-600 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-slate-700">Legal Document Drafting</h2>
            <p className="text-slate-600">AI-powered document creation with Florida Rules compliance</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {documentTypes.map((type) => {
            let IconComponent;
            switch (type.icon) {
              case 'Edit3':
                IconComponent = Edit3;
                break;
              case 'FileCheck':
                IconComponent = FileCheck;
                break;
              case 'AlertTriangle':
                IconComponent = AlertTriangle;
                break;
              case 'List':
                IconComponent = List;
                break;
              default:
                IconComponent = FileText; // Default icon
            }
            return (
              <button 
                key={type.id} 
                onClick={() => { 
                  setActiveTab('motion_drafting'); 
                  setMotionFormData({ 
                    ...motionFormData, 
                    caseName: currentCase.number, 
                    caseNumber: currentCase.number, 
                    reason: '', 
                    outcome: `Motion for a ${type.title} based on the facts of my case.` 
                  }); 
                }} 
                className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-center"
              >
                <IconComponent className={`h-8 w-8 mx-auto mb-2 ${type.color}`} />
                <h3 className="font-semibold text-slate-700">{type.title}</h3>
                <p className="text-xs text-slate-500">{type.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Recently Uploaded</h2>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="p-3 bg-green-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Upload className="h-4 w-4 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-slate-800">{file.name}</p>
                    <p className="text-sm text-slate-600">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.extracted ? (
                    <span className="text-xs text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />Evidence Extracted
                    </span>
                  ) : file.processed ? (
                    <span className="text-xs text-blue-600 flex items-center">
                      <RefreshCw className="h-4 w-4 mr-1" />Processing...
                    </span>
                  ) : (
                    <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.jpg,.png" onChange={handleFileUpload} className="hidden" />
    </div>
  );
};

export default Documents;