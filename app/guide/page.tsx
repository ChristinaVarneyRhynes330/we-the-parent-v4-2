// FILE: app/guide/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, ExternalLink } from 'lucide-react';
import Markdown from 'react-markdown';

interface Topic {
  id: number;
  title: string;
  content: string;
  relatedLinks?: Array<{ title: string; url: string }>;
}

export default function GuidePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuideTopics();
  }, []);

  const fetchGuideTopics = async () => {
    try {
      const response = await fetch('/api/pro-se-guide');
      const data = await response.json();
      setTopics(data.topics || []);
      if (data.topics && data.topics.length > 0) {
        setSelectedTopic(data.topics[0]);
      }
    } catch (error) {
      console.error('Error fetching guide topics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-ivory p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-header text-charcoal-navy">Pro Se Legal Guide</h1>
          <p className="text-slate-gray mt-2">Essential information for representing yourself in Florida dependency court</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topics List */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h2 className="section-subheader mb-4">Topics</h2>
              <div className="space-y-2">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                      selectedTopic?.id === topic.id
                        ? 'bg-dusty-mauve text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{topic.title}</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            {selectedTopic ? (
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-8 h-8 text-dusty-mauve" />
                  <h2 className="text-2xl font-header text-charcoal-navy">{selectedTopic.title}</h2>
                </div>

                <div className="prose prose-sm max-w-none">
                  <Markdown>{selectedTopic.content}</Markdown>
                </div>

                {selectedTopic.relatedLinks && selectedTopic.relatedLinks.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-charcoal-navy mb-4">Related Resources</h3>
                    <div className="space-y-2">
                      {selectedTopic.relatedLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-dusty-mauve hover:text-garnet transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a topic to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}