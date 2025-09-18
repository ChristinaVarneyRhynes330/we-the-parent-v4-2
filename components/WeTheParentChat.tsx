'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, FileUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Message = {
  id: string | number;
  from: 'user' | 'ai' | 'system';
  text: string;
};

type UploadedDoc = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
};

const CASE_ID = 'bf45b3cd-652c-43db-b535-38ab89877ff9';

const WeTheParentChat: React.FC = () => {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

  useEffect(() => {
    setMessages([
      {
        id: 'initial-welcome',
        from: 'ai',
        text: "Welcome to We The Parent. I am your AI legal assistant. How can I help you with your Florida juvenile dependency case today? Remember, I cannot provide legal advice.",
      },
    ]);
    fetchExistingDocs();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchExistingDocs = async () => {
    const { data, error } = await supabase
      .from<UploadedDoc>('documents')
      .select('*')
      .eq('case_id', CASE_ID)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUploadedDocs(data);
    }
  };

  const handleSendMessage = async (prompt = inputValue) => {
    if (!prompt.trim()) return;

    const newMessage: Message = { id: Date.now(), from: 'user', text: prompt };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setSuggestions([]);
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, documents: uploadedDocs }),
      });

      if (!response.ok) throw new Error('AI service is not available');

      const data = await response.json();
      const aiMessage: Message = { id: Date.now() + 1, from: 'ai', text: data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        from: 'ai',
        text: 'Error: Could not connect to the AI service. Please ensure the backend is running and properly configured.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const uploadSystemMessage: Message = {
      id: Date.now(),
      from: 'system',
      text: `Uploading ${files.length} document(s)...`,
    };
    setMessages((prev) => [...prev, uploadSystemMessage]);

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        if (data.document) {
          setUploadedDocs((prev) => [data.document, ...prev]);
        }
      }

      const uploadMessage: Message = {
        id: Date.now() + 1,
        from: 'system',
        text: `Successfully uploaded ${files.length} document(s).`,
      };
      setMessages((prev) => [...prev, uploadMessage]);
    } catch (error) {
      console.error('Upload Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        from: 'system',
        text: 'Error: Document upload failed.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (value.length > 1) {
      const matches = uploadedDocs
        .map((doc) => doc.file_name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5); // limit to 5 suggestions
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue((prev) => prev.trim() + ' "' + suggestion + '" ');
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-md relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
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

      {uploadedDocs.length > 0 && (
        <div className="bg-gray-50 p-2 border-t border-gray-200 text-sm">
          <strong>Uploaded Documents:</strong>
          <ul className="list-disc pl-5">
            {uploadedDocs.map((doc) => (
              <li key={doc.id}>{doc.file_name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gray-50 p-4 border-t border-gray-200 relative">
        <div className="flex items-center space-x-2 relative">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-body"
              placeholder="Ask a question about your case..."
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-md mt-1 z-10">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => handleSendMessage()}
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center p-3 rounded-lg transition-colors"
          >
            <Send size={24} />
          </button>
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="bg-gray-200 text-gray-700 hover:bg-gray-300 flex items