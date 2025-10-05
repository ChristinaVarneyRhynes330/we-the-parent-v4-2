'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, MapPin, FileText, AlertTriangle, Scale, Users } from 'lucide-react';
import { NewTimelineEvent } from '@/hooks/useTimeline';

interface EventFormProps {
  event: NewTimelineEvent | null;
  onSubmit: (eventData: NewTimelineEvent) => void;
  onClose: () => void;
}

const EVENT_TYPES = [
  { value: 'Hearing', label: 'Court Hearing', icon: Scale, color: 'garnet' },
  { value: 'Deadline', label: 'Important Deadline', icon: AlertTriangle, color: 'terracotta' },
  { value: 'Appointment', label: 'Appointment', icon: Users, color: 'dusty-mauve' },
  { value: 'Filing', label: 'Document Filing', icon: FileText, color: 'olive-emerald' },
  { value: 'Other', label: 'Other Event', icon: Calendar, color: 'slate-gray' },
];

const COMMON_EVENTS = [
    {
    title: 'Adjudicatory Hearing',
    type: 'Hearing',
    description: 'Court hearing to determine if the allegations in the petition are true',
    location: '5th Judicial Circuit Court'
  },
  {
    title: 'Disposition Hearing',
    type: 'Hearing',
    description: 'Court hearing to decide what happens with the child',
    location: '5th Judicial Circuit Court'
  },
  {
    title: 'Judicial Review Hearing',
    type: 'Hearing',
    description: 'Regular review of case progress and compliance',
    location: '5th Judicial Circuit Court'
  },
  {
    title: 'Supervised Visitation',
    type: 'Appointment',
    description: 'Scheduled visit with children under supervision',
    location: 'Family Visitation Center'
  },
  {
    title: 'Case Plan Review',
    type: 'Appointment',
    description: 'Meeting to review progress on case plan requirements',
    location: 'DCF Office'
  },
  {
    title: 'Parenting Class',
    type: 'Appointment',
    description: 'Required parenting education session',
    location: 'Community Center'
  },
];

export default function EventForm({ event: editingEvent, onSubmit, onClose }: EventFormProps) {
  const [formData, setFormData] = useState<NewTimelineEvent>({
    title: editingEvent?.title || '',
    event_type: editingEvent?.event_type || 'Appointment',
    date: editingEvent?.date || '',
    description: editingEvent?.description || '',
    location: editingEvent?.location || '',
    notes: editingEvent?.notes || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuickAdd = (template: any) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      event_type: template.type,
      description: template.description,
      location: template.location,
    }));
    setShowQuickAdd(false);
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim() && !formData.date) return 'Event Title and Date are required';
    if (!formData.title.trim()) return 'Event Title is a required field';
    if (!formData.date) return 'Event Date is a required field';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsSubmitting(true);
    onSubmit(formData);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      event_type: 'Appointment',
      date: '',
      description: '',
      location: '',
      notes: '',
    });
    setError(null);
    setShowQuickAdd(false);
  };

  const selectedEventType = EVENT_TYPES.find(type => type.value === formData.event_type);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      ref={modalRef}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 id="dialog-title" className="text-xl font-header text-charcoal-navy">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-slate-gray hover:text-charcoal-navy transition-colors"
              aria-label="Close dialog"
            >
              <X aria-hidden="true" className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="form-label">Event Title</label>
                <input id="title" name="title" value={formData.title} onChange={handleInputChange} className="form-input" placeholder="Enter event title..." />
              </div>
              
              <div>
                <label htmlFor="event_type" className="form-label">Event Type</label>
                <select id="event_type" name="event_type" value={formData.event_type} onChange={handleInputChange} className="form-input">
                  {EVENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="date" className="form-label">Event Date</label>
              <div className="relative">
                <Calendar aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="date" type="datetime-local" name="date" value={formData.date} onChange={handleInputChange} className="form-input pl-10" />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="form-label">Location</label>
              <div className="relative">
                <MapPin aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="location" name="location" value={formData.location} onChange={handleInputChange} className="form-input pl-10" placeholder="e.g., 5th Judicial Circuit Court, Room 201" />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="form-label">Event Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} className="form-input" placeholder="Brief description of the event..." />
            </div>

            <div>
              <label htmlFor="notes" className="form-label">Additional Notes</label>
              <textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleInputChange} rows={2} className="form-input" placeholder="Any additional information or reminders..." />
            </div>

            {error && (
              <div role="alert" className="bg-garnet/10 border border-garnet/20 rounded-lg p-3">
                <p className="text-garnet text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button type="button" onClick={onClose} className="button-secondary" disabled={isSubmitting}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="button-primary flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {editingEvent ? 'Saving Changes...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Calendar aria-hidden="true" className="w-4 h-4" />
                    {editingEvent ? 'Save Changes' : 'Save Event'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
