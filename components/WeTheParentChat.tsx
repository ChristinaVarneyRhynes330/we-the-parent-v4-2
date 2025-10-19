// File: components/WeTheParentChat.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatThread } from '@/types'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Dummy data/hook for case context (You would replace this with actual context hook later)
const MOCK_CASE_ID = 'case-001';

// Initial chat history for context
const initialMessages: ChatMessage[] = [
  { 
    id: 'msg-0', 
    thread_id: 'thread-001', 
    role: 'assistant', 
    content: "Hello! I am We The Parent's AI Assistant, connected to your Evidence Binder. How can I help you prepare for court today?",
    created_at: new Date().toISOString(),
    source: 'system'
  },
];

export default function WeTheParentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  // --- FIX: Corrected syntax error: setIsLoading used twice and extra comma/bracket removed ---
  const [isLoading, setIsLoading] = useState(false); 
  // --------------------------------------------------------------------------------------------
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat window
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      thread_id: 'thread-001', 
      role: 'user',
      content: input,
      created_at: new Date().toISOString(),
    };

    // Add user message to state
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Placeholder for the AI's streaming response, updated in real-time
    const streamingMessage: ChatMessage = {
      id: `msg-ai-${Date.now()}`,
      thread_id: 'thread-001',
      role: 'assistant',
      content: '', // Start with empty content
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, streamingMessage]);

    try {
      // 1. Send request to the new streaming RAG API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: MOCK_CASE_ID,
          history: messages, // Send the full history for context
          newMessage: userMessage.content,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`API returned ${response.status}: ${await response.text()}`);
      }

      // 2. Process the Streaming Body
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value);

        // Update the last message (the streaming one) with the new chunk of text
        setMessages((prevMessages) => {
          const lastIndex = prevMessages.length - 1;
          const updatedMessages = [...prevMessages];
          updatedMessages[lastIndex].content += chunk;
          return updatedMessages;
        });

        // Ensure smooth scrolling happens for the new content
        scrollToBottom(); 
      }

    } catch (error) {
      console.error("Error during AI chat streaming:", error);
      // Append an error message if the stream fails
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), // Remove the unfinished streaming message
        {
          id: `msg-err-${Date.now()}`,
          thread_id: 'thread-001',
          role: 'assistant',
          content: `ERROR: Failed to connect to AI service. Please check your API key and network. (${error instanceof Error ? error.message : 'Unknown error'})`,
          created_at: new Date().toISOString(),
        } as ChatMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    return (
      <div 
        key={message.id} 
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div 
          className={`max-w-3/4 p-3 rounded-lg shadow-md ${
            isUser 
              ? 'bg-blue-600 text-white rounded-br-none' 
              : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
          }`}
        >
          {isUser ? (
            <p className="font-semibold">You:</p>
          ) : (
            <p className="font-semibold text-blue-700">AI Assistant:</p>
          )}
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="p-4 border-b bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">AI Chat Vault (Case: {MOCK_CASE_ID})</h1>
        <p className="text-sm text-gray-500">Intelligent assistance grounded in your Evidence Binder.</p>
      </header>
      
      {/* Chat Messages Area */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <footer className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "AI is typing..." : "Ask a question about your case..."}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </footer>
    </div>
  );
}