'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, FileUp } from 'lucide-react';

const WeTheParentChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'; // Use relative path for Vercel

  useEffect(() => {
    // Add a welcome message when the component loads
    setMessages([
      {
        id: 'initial-welcome',
        from: 'ai',
        text: "Welcome to We The Parent. I am your AI legal assistant. How can I help you with your Florida juvenile dependency case today? Remember, I cannot provide legal advice.",
      },
    ]);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (prompt = inputValue) => {
    if (!prompt.trim()) return;

    const newMessage = { id: Date.now(), from: 'user', text: prompt };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, documents: uploadedDocs }),
      });

      if (!response.ok) {
        throw new Error('AI service is not available');
      }

      const data = await response.json();
      const aiMessage = { id: Date.now() + 1, from: 'ai', text: data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        from: 'ai',
        text: 'Error: Could not connect to the AI service. Please ensure the backend is running and properly configured.',
      };
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
    
    // Display a system message that files are being uploaded
    const uploadSystemMessage = {
      id: Date.now(),
      from: 'system',
      text: `Uploading ${files.length} document(s)...`
    };
    setMessages((prev) => [...prev, uploadSystemMessage]);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      setUploadedDocs((prev) => [...prev, ...data.files]);
      const uploadMessage = {
        id: Date.now() + 1,
        from: 'system',
        text: `Successfully uploaded and processed ${data.count} document(s). You can now ask questions about them.`
      };
      setMessages((prev) => [...prev, uploadMessage]);
    } catch (error) {
      console.error('Upload Error:', error);
      const errorMessage = { id: Date.now() + 1, from: 'system', text: 'Error: Document upload failed.' };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.from === 'user'
                ? 'justify-end'
                : msg.from === 'system'
                ? 'justify-center'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm font-body text-sm ${
                msg.from === 'user'
                  ? 'bg-blue-600 text-white'
                  : msg.from === 'ai'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-gray-100 text-gray-600 text-xs text-center italic'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 p-3 rounded-lg shadow-sm">
              <div className="dot-flashing"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-body"
            placeholder="Ask a question about your case..."
          />
          <button
            onClick={() => handleSendMessage()}
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center p-3 rounded-lg transition-colors"
          >
            <Send size={24} />
          </button>
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center p-3 rounded-lg transition-colors">
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