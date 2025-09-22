'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, ExternalLink } from 'lucide-react';

interface GuideTopic {
  id: number;
  title: string;
  content: string;
  relatedLinks: Array<{
    title: string;
    url: string;
  }>;
}

export default function GuidePage() {
  const [topics, setTopics] = useState<GuideTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<GuideTopic | null>(null);
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
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-header text-charcoal-navy">Pro Se Guide</h1>
          <p className="text-slate-gray mt-2">Essential information for representing yourself</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topics List */}
          <div className="card">
            <h2 className="section-subheader">Topics</h2>
            <div className="space-y-2">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                    selectedTopic?.id === topic.id
                      ? 'bg-dusty-mauve/10 text-dusty-mauve'
                      : 'hover:bg-gray-50 text-charcoal-navy'
                  }`}
                >
                  <span className="font-medium">{topic.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            {selectedTopic ? (
              <div className="card">
                <h2 className="section-subheader">{selectedTopic.title}</h2>
                <div className="prose prose-gray max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedTopic.content.replace(/\n/g, '<br>') }} />
                </div>
                
                {selectedTopic.relatedLinks && selectedTopic.relatedLinks.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-charcoal-navy mb-3">Related Resources</h3>
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
                <p className="text-gray-500">Select a topic to view the guide</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}