'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, Upload, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'document' | 'analysis';
}

interface AnalysisResult {
  documentType: string;
  summary: string;
}

export default function WeTheParentChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI legal assistant. I can help you with:\n\n• Analyzing legal documents\n• Answering questions about your case\n• Explaining legal procedures\n• Drafting documents\n• Research assistance\n\nHow can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simple response logic - in a real app, this would call your AI API
      const response = await generateResponse(inputMessage);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try again later or contact support if the issue persists.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = async (message: string): Promise<string> => {
    // Simple keyword-based responses - replace with actual AI integration
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('motion') || lowerMessage.includes('document')) {
      return "I can help you with document drafting! You can use our Document Drafting tool from the sidebar to create motions, affidavits, or objections. Would you like me to guide you through the process?";
    }
    
    if (lowerMessage.includes('hearing') || lowerMessage.includes('court')) {
      return "For court hearings, make sure to:\n\n• Arrive 15 minutes early\n• Dress professionally\n• Bring all relevant documents\n• Address the judge as 'Your Honor'\n• Speak clearly and respectfully\n\nDo you have a specific question about your upcoming hearing?";
    }
    
    if (lowerMessage.includes('case plan') || lowerMessage.includes('dcf')) {
      return "Case plan compliance is crucial for reunification. Focus on:\n\n• Complete all required services\n• Attend all appointments\n• Document your progress\n• Maintain stable housing and employment\n• Follow all court orders\n\nWhat specific aspect of your case plan would you like help with?";
    }
    
    if (lowerMessage.includes('rights') || lowerMessage.includes('parental')) {
      return "Your parental rights are protected by the Constitution. Key rights include:\n\n• Due process in all proceedings\n• Right to legal representation\n• Right to be present at hearings\n• Right to appeal court decisions\n• Right to reunification services\n\nWould you like more information about any specific right?";
    }
    
    return "I understand you're asking about: \"" + message + "\"\n\nI'm here to help with your legal questions. Could you provide more details about what specific information you need? I can assist with document drafting, case procedures, legal research, or general guidance about juvenile dependency cases in Florida.";
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    try {
      // Read file content for analysis
      const fileContent = await readFileContent(file);
      
      // Add user message showing file upload
      const userMessage: Message = {
        id: Date.now().toString(),
        content: `Uploaded document: ${file.name}`,
        role: 'user',
        timestamp: new Date(),
        type: 'document'
      };

      setMessages(prev => [...prev, userMessage]);

      // Call document analysis API
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fileContent })
      });

      if (response.ok) {
        const data = await response.json();
        const analysis: AnalysisResult = data.analysis;
        
        const analysisMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `**Document Analysis Results:**\n\n**Type:** ${analysis.documentType}\n\n**Summary:** ${analysis.summary}\n\nWould you like me to help you with anything specific about this document?`,
          role: 'assistant',
          timestamp: new Date(),
          type: 'analysis'
        };

        setMessages(prev => [...prev, analysisMessage]);
      } else {
        throw new Error('Document analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing document:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I had trouble analyzing that document. Please make sure it's a text-based file (PDF, DOC, TXT) and try again.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-brand overflow-hidden">
      {/* Chat Header */}
      <div className="bg-charcoal-navy text-white p-4">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-dusty-mauve" />
          <div>
            <h2 className="font-semibold">AI Legal Assistant</h2>
            <p className="text-sm text-warm-ivory/70">Florida Juvenile Dependency Specialist</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-dusty-mauve rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
            
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
              message.role === 'user' 
                ? 'bg-dusty-mauve text-white rounded-l-lg rounded-br-lg'
                : 'bg-gray-100 text-charcoal-navy rounded-r-lg rounded-bl-lg'
            } p-3`}>
              {message.type === 'document' && (
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-medium">Document Uploaded</span>
                </div>
              )}
              
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: formatMessage(message.content) 
                }}
                className="text-sm whitespace-pre-wrap"
              />
              
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-olive-emerald rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-dusty-mauve rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-r-lg rounded-bl-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-slate-gray">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex-shrink-0 p-2 text-dusty-mauve hover:bg-dusty-mauve/10 rounded-lg transition-colors disabled:opacity-50"
            title="Upload document for analysis"
          >
            <Upload className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your case, legal procedures, or upload a document..."
            disabled={isLoading}
            className="flex-1 form-input"
          />
          
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="flex-shrink-0 button-primary p-2 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-xs text-slate-gray mt-2 text-center">
          This AI assistant provides general information and should not replace professional legal advice.
        </p>
      </div>
    </div>
  );
}