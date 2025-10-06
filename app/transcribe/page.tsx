'use client';

import React, { useState, useRef } from 'react';
import { Scissors, Clock } from 'lucide-react';

// Mock data representing a transcript with word-level timestamps
const mockTranscript = {
  words: [
    { start: 0.5, end: 0.9, text: 'Okay,' },
    { start: 1.0, end: 1.4, text: 'so' },
    { start: 1.4, end: 1.7, text: 'the' },
    { start: 1.7, end: 2.2, text: 'first' },
    { start: 2.2, end: 2.6, text: 'thing' },
    { start: 2.6, end: 2.9, text: 'we' },
    { start: 2.9, end: 3.2, text: 'need' },
    { start: 3.2, end: 3.5, text: 'to' },
    { start: 3.5, end: 4.0, text: 'establish' },
    { start: 4.5, end: 4.8, text: 'is' },
    { start: 4.8, end: 5.2, text: 'the' },
    { start: 5.2, end: 5.8, text: 'timeline' },
    { start: 5.8, end: 6.2, text: 'of' },
    { start: 6.2, end: 6.8, text: 'events' },
    { start: 7.2, end: 7.5, text: 'on' },
    { start: 7.5, end: 7.9, text: 'the' },
    { start: 7.9, end: 8.3, text: 'night' },
    { start: 8.3, end: 8.6, text: 'in' },
    { start: 8.6, end: 9.2, text: 'question.' },
    { start: 10.1, end: 10.5, text: 'The' },
    { start: 10.5, end: 11.0, text: 'respondent' },
    { start: 11.0, end: 11.4, text: 'claims' },
    { start: 11.4, end: 11.7, text: 'they' },
    { start: 11.7, end: 12.1, text: 'were' },
    { start: 12.1, end: 12.5, text: 'at' },
    { start: 12.5, end: 12.9, text: 'home,' },
    { start: 13.2, end: 13.5, text: 'but' },
    { start: 13.5, end: 13.8, text: 'we' },
    { start: 13.8, end: 14.2, text: 'have' },
    { start: 14.2, end: 14.8, text: 'evidence' },
    { start: 14.8, end: 15.1, text: 'to' },
    { start: 15.1, end: 15.4, text: 'the' },
    { start: 15.4, end: 16.0, text: 'contrary.' },
  ],
};

interface SelectionDetails {
  text: string;
  startTime: number | null;
  endTime: number | null;
}

interface SavedExcerpt extends SelectionDetails {
  id: string;
}

export default function TranscriptionEditorPage() {
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const [selectionDetails, setSelectionDetails] = useState<SelectionDetails>({ text: '', startTime: null, endTime: null });
  const [savedExcerpts, setSavedExcerpts] = useState<SavedExcerpt[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(2);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.padStart(5, '0')}`;
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setSelectionDetails({ text: '', startTime: null, endTime: null });
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    const startEl = range.startContainer.parentElement?.closest('span[data-start]');
    const endEl = range.endContainer.parentElement?.closest('span[data-end]');

    if (startEl && endEl) {
      const startTime = parseFloat(startEl.getAttribute('data-start') || '0');
      const endTime = parseFloat(endEl.getAttribute('data-end') || '0');
      setSelectionDetails({ text: selectedText, startTime, endTime });
    } else {
      setSelectionDetails({ text: '', startTime: null, endTime: null });
    }
  };

  const handleSaveExcerpt = async () => {
    if (!selectionDetails.text || selectionDetails.startTime === null || selectionDetails.endTime === null) return;

    setIsSaving(true);
    console.log('Saving excerpt:', selectionDetails);

    // Simulate API call to save the excerpt as evidence
    // In a real app: await fetch('/api/evidence', { method: 'POST', body: JSON.stringify(...) });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newExcerpt: SavedExcerpt = {
      ...selectionDetails,
      id: `excerpt-${Date.now()}`,
    };

    setSavedExcerpts(prev => [newExcerpt, ...prev]);
    setIsSaving(false);
    
    // Clear selection
    window.getSelection()?.removeAllRanges();
    setSelectionDetails({ text: '', startTime: null, endTime: null });
  };

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-header text-charcoal-navy">Transcription Editor</h1>
          <p className="text-slate-gray mt-2">Highlight text to create and save evidence excerpts from your audio.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transcript Display */}
          <div className="lg:col-span-2 card">
            <h2 className="section-subheader mb-4">Transcript</h2>
            <div
              ref={transcriptContainerRef}
              onMouseUp={handleSelection}
              className="bg-white border border-gray-200 rounded-lg p-6 max-h-[60vh] overflow-y-auto select-text"
            >
              <div className="prose prose-gray max-w-none">
                {
                  mockTranscript.words.map((word, index) => (
                    <span key={index} data-start={word.start} data-end={word.end} className="hover:bg-dusty-mauve/20 transition-colors cursor-pointer">
                      {index === 0 || new Date(word.start * 1000).getSeconds() !== new Date(mockTranscript.words[index-1].start * 1000).getSeconds() ? (
                        <span className="font-mono text-xs text-dusty-mauve/80 block select-none">[{formatTime(word.start)}]</span>
                      ) : ''}
                      {word.text + ' '}
                    </span>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Excerpt Creation and List */}
          <div className="card self-start">
            <h2 className="section-subheader mb-4">Create Excerpt</h2>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[100px]">
              {selectionDetails.text ? (
                <div>
                  <p className="text-sm text-slate-gray italic">&quot;...{selectionDetails.text}...&quot;</p>
                  <p className="text-xs font-mono text-charcoal-navy mt-2">
                    Time: {formatTime(selectionDetails.startTime!)} - {formatTime(selectionDetails.endTime!)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-gray text-center self-center">Highlight text in the transcript to create an excerpt.</p>
              )}
            </div>
            <button
              onClick={handleSaveExcerpt}
              disabled={!selectionDetails.text || isSaving}
              className="button-primary w-full mt-4 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Scissors className="w-5 h-5" />
              )}
              {isSaving ? 'Saving...' : 'Save Excerpt as Evidence'}
            </button>

            <div className="mt-8">
              <h3 className="section-subheader mb-4">Saved Excerpts</h3>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {savedExcerpts.length > 0 ? savedExcerpts.map(excerpt => (
                  <div key={excerpt.id} className="bg-white border rounded-lg p-3">
                    <p className="text-sm text-charcoal-navy italic">&quot;...{excerpt.text}...&quot;</p>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-gray mt-2">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(excerpt.startTime!)} - {formatTime(excerpt.endTime!)}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-slate-gray">No excerpts saved yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
