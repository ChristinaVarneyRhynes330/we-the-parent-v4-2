'use client';

import { useRef, useEffect } from 'react';
import { Bot, User, Send, Loader2, FileText } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat } from 'ai/react';

export default function WeTheParentChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getMessagesWithSource = () => {
    if (!data) return messages;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
        const sourceData = data.find((d: any) => d.source) as { source: string } | undefined;
        if (sourceData) {
            lastMessage.source = sourceData.source;
        }
    }
    return messages;
  };

  const displayMessages = getMessagesWithSource();

  return (
    <div className="flex flex-col h-full bg-warm-ivory">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {displayMessages.length === 0 && !isLoading ? (
          <div className="text-center text-slate-gray">
            <Bot className="w-12 h-12 mx-auto mb-4" />
            <h3 className="font-header text-xl text-charcoal-navy">AI Assistant</h3>
            <p>Ask me anything about your case documents.</p>
          </div>
        ) : (
          displayMessages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-dusty-mauve/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-dusty-mauve" />
                </div>
              )}
              <div className={`max-w-xl p-4 rounded-lg ${msg.role === 'user' ? 'bg-dusty-mauve text-white' : 'bg-white'}`}>
                <div className="prose prose-sm max-w-none">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </Markdown>
                </div>
                {msg.role === 'assistant' && (msg as any).source && (
                  <div className="mt-2 text-xs text-slate-gray flex items-center gap-1 group relative">
                    <FileText className="w-4 h-4" />
                    <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Source: {(msg as any).source}
                    </div>
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-gray/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-slate-gray" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && messages[messages.length -1]?.role === 'user' && (
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
            onChange={handleInputChange}
            placeholder="Ask about your documents..."
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