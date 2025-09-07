import React, { useState, useRef, useEffect } from 'react';
import { Send, FileUp, BookOpen, Scale, Heart, Upload, MessageSquare, Clock, AlertCircle, User, CheckCircle } from 'lucide-react';

const WeTheParentChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [serverStatus, setServerStatus] = useState('disconnected');
  const [caseContext, setCaseContext] = useState({
    caseName: '',
    caseNumber: '',
    casePhase: ''
  });
  const messagesEndRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        setServerStatus('connected');
      } else {
        setServerStatus('disconnected');
      }
    } catch (error) {
      setServerStatus('disconnected');
    }
  };

  const handleSendMessage = async (prompt = inputValue) => {
    if (!prompt.trim()) return;

    const newMessage = { id: Date.now(), from: 'user', text: prompt };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, caseContext, documents: uploadedDocs }),
      });

      if (!response.ok) {
        throw new Error('AI service is not available');
      }

      const data = await response.json();
      const aiMessage = { id: Date.now() + 1, from: 'ai', text: data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = { id: Date.now() + 1, from: 'ai', text: 'Error: Could not connect to AI service. Please check your local server.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('documents', files[i]);
    }

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      setUploadedDocs((prev) => [...prev, ...data.files]);
      const uploadMessage = {
        id: Date.now(),
        from: 'system',
        text: `Successfully uploaded ${data.count} documents.`
      };
      setMessages((prev) => [...prev, uploadMessage]);
    } catch (error) {
      console.error('Upload Error:', error);
      const errorMessage = { id: Date.now() + 1, from: 'system', text: 'Error: Document upload failed.' };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const quickActions = [
    { label: 'Motion', icon: <Scale size={16} />, prompt: 'Help me with a motion' },
    { label: 'Timeline', icon: <Clock size={16} />, prompt: 'Explain the Florida dependency timeline' },
    { label: 'Evidence', icon: <BookOpen size={16} />, prompt: 'What evidence do I need?' },
    { label: 'Hearing Prep', icon: <User size={16} />, prompt: 'How do I prepare for a hearing?' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-warm-gray">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-heading text-primary-blue">We The Parent</h1>
        <span className={`text-sm font-body font-semibold ${serverStatus === 'connected' ? 'text-green-500' : 'text-red-500'}`}>
          Server: {serverStatus}
        </span>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm font-body text-sm ${
                msg.from === 'user'
                  ? 'bg-primary-600 text-white'
                  : msg.from === 'ai'
                  ? 'bg-white text-text-dark'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 p-3 rounded-lg shadow-sm font-body text-sm text-gray-700">
              <div className="dot-flashing"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white p-4 shadow-inner">
        <div className="flex flex-wrap gap-2 mb-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(action.prompt)}
              className="flex items-center space-x-1 px-3 py-2 text-xs font-body font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-body"
            placeholder="Ask a question about your case..."
          />
          <button
            onClick={() => handleSendMessage()}
            className="btn-primary flex items-center justify-center p-3 rounded-lg"
          >
            <Send size={24} />
          </button>
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="btn-secondary flex items-center justify-center p-3 rounded-lg">
              <FileUp size={24} />
            </div>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default WeTheParentChat;