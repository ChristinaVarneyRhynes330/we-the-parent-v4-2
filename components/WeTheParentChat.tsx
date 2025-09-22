'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

// Define types for type safety
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function WeTheParentChat() {
  // State management
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your WeTheParent AI assistant. I can help you with legal questions, document analysis, and case management. How can I assist you today?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual API call)
      const response = await simulateAIResponse(inputMessage);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate AI response (replace with actual API call later)
  const simulateAIResponse = async (userInput: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Simple response logic (replace with actual AI integration)
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('document') || lowerInput.includes('file')) {
      return 'I can help you with document management. You can upload documents through the Documents page, and I can analyze them for key information, dates, and legal requirements. What type of document do you need help with?';
    } else if (lowerInput.includes('court') || lowerInput.includes('hearing')) {
      return 'Regarding court proceedings, I can help you understand what to expect, prepare questions, and organize your documentation. Remember, I provide information to help you understand the process, but you should always consult with your attorney for legal advice.';
    } else if (lowerInput.includes('deadline') || lowerInput.includes('due date')) {
      return 'I can help you track important deadlines and dates. Make sure to keep all court documents organized and note any response deadlines. Would you like help setting up reminders for upcoming dates?';
    } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return 'Hello! I\'m here to help with your family law case. I can assist with document organization, deadline tracking, and general legal information. What would you like to work on today?';
    } else {
      return 'I understand you\'re asking about your case. I can help with document analysis, timeline organization, deadline tracking, and general legal information. Could you provide more specific details about what you need assistance with?';
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-warm-ivory">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-dusty-mauve rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-charcoal-navy">
                WeTheParent AI Assistant
              </h1>
              <p className="text-sm text-slate-gray">
                Here to help with your family law case
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-dusty-mauve text-white'
                    : 'bg-white text-charcoal-navy shadow-sm border'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'assistant' && (
                    <Bot className="w-5 h-5 text-dusty-mauve mt-0.5 flex-shrink-0" />
                  )}
                  {message.sender === 'user' && (
                    <User className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-slate-gray'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-charcoal-navy shadow-sm border max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-dusty-mauve" />
                  <div className="flex items-center space-x-1">
                    <Loader2 className="w-4 h-4 animate-spin text-dusty-mauve" />
                    <span className="text-sm text-slate-gray">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dusty-mauve focus:border-transparent resize-none"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-dusty-mauve text-white rounded-lg hover:bg-dusty-mauve/90 focus:ring-2 focus:ring-dusty-mauve focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Usage tips */}
          <div className="mt-3 text-xs text-slate-gray">
            <p>💡 Try asking: "Help me organize my documents" or "What should I expect at my court hearing?"</p>
          </div>
        </div>
      </div>
    </div>
  );
}