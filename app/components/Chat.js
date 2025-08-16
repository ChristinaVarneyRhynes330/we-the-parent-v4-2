import React from 'react';
import { Mic } from 'lucide-react';

const Chat = ({ chatMessages, chatInput, setChatInput, handleSendMessage, handleQuickAction, isRecording, setIsRecording, chatEndRef }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-700">AI Legal Assistant</h1>
        <p className="text-slate-600">Get instant legal guidance for your Florida juvenile dependency case</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-96 max-h-96">
        {chatMessages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl p-4 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
              <p className="whitespace-pre-line">{message.content}</p>
              {message.suggestions && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.suggestions.map((suggestion, i) => (
                    <button key={i} onClick={() => handleQuickAction(suggestion)} className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-colors">{suggestion}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="p-6 border-t border-slate-200">
        <div className="flex space-x-2">
          <input 
            type="text" 
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
            placeholder="Ask me about legal documents, case strategy, or procedures..." 
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg" 
          />
          <button 
            onClick={() => setIsRecording(!isRecording)} 
            className={`px-4 py-3 rounded-lg transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
          >
            <Mic className="h-5 w-5" />
          </button>
          <button 
            onClick={handleSendMessage} 
            disabled={!chatInput.trim()} 
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;