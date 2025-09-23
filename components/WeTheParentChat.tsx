'use client';

import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function WeTheParentChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get response from AI.');
      }

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      const errorMessage: Message = { role: 'assistant', content: `Sorry, I encountered an error: ${error.message}` };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-warm-ivory">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center text-slate-gray">
            <Bot className="w-12 h-12 mx-auto mb-4" />
            <h3 className="font-header text-xl text-charcoal-navy">AI Assistant</h3>
            <p>Ask me anything about your case documents.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-dusty-mauve/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-dusty-mauve" />
                </div>
              )}
              <div className={`max-w-xl p-4 rounded-lg ${msg.role === 'user' ? 'bg-dusty-mauve text-white' : 'bg-white'}`}>
                {/* FIX: Moved className to a wrapping div */}
                <div className="prose prose-sm max-w-none">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </Markdown>
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-gray/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-slate-gray" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-dusty-mauve/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-dusty-mauve" />
            </div>
            <div className="max-w-xl p-4 rounded-lg bg-white">
              <div className="flex items-center gap-2 text-slate-gray">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-slate-gray/20 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <label htmlFor="chat-input" className="sr-only">Your message</label>
          <input
            id="chat-input"
            className="form-input flex-1"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Ask about your documents..."
            disabled={isLoading}
          />
          <button type="submit" className="button-primary p-2" disabled={isLoading} aria-label="Send message">
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-slate-gray mt-2">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}