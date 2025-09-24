'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, FileText, AlertTriangle, Scale, Users } from 'lucide-react';

const CASE_ID = 'bf45b3cd-652c-43db-b535-38ab89877ff9';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: () => void;
  editingEvent?: Event | null;
}

interface Event {
  id?: string;
  title: string;
  event_type: string;
  event_date: string;
  description: string;
  location: string;
  notes?: string;
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

export default function EventForm({ isOpen, onClose, onEventAdded, editingEvent }: EventFormProps) {
  const [formData, setFormData] = useState<Event>({
    title: editingEvent?.title || '',
    event_type: editingEvent?.event_type || 'Appointment',
    event_date: editingEvent?.event_date || '',
    description: editingEvent?.description || '',
    location: editingEvent?.location || '',
    notes: editingEvent?.notes || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuickAdd = (template: typeof COMMON_EVENTS[0]) => {
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
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.event_date) return 'Date and time are required';
    if (!formData.event_type) return 'Event type is required';
    
    // Check if the date is in the past (with some tolerance for ongoing events)
    const eventDate = new Date(formData.event_date);
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    if (eventDate < oneDayAgo) {
      return 'Event date cannot be more than 24 hours in the past';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, case_id: CASE_ID }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to ${editingEvent ? 'update' : 'create'} event.`);
      }

      onEventAdded(); // Refresh the timeline
      onClose(); // Close the modal
      
      // Reset form
      setFormData({
        title: '',
        event_type: 'Appointment',
        event_date: '',
        description: '',
        location: '',
        notes: '',
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      event_type: 'Appointment',
      event_date: '',
      description: '',
      location: '',
      notes: '',
    });
    setError(null);
    setShowQuickAdd(false);
  };

  if (!isOpen) return null;

  // Get the next business day as default date
  const getDefaultDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM default
    return tomorrow.toISOString().slice(0, 16); // Format for datetime-local
  };

  const selectedEventType = EVENT_TYPES.find(type => type.value === formData.event_type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-header text-charcoal-navy">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-slate-gray hover:text-charcoal-navy transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {!editingEvent && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className="text-sm text-dusty-mauve hover:text-garnet transition-colors"
              >
                {showQuickAdd ? 'Hide' : 'Show'} Quick Add Templates
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Quick Add Templates */}
          {!editingEvent && showQuickAdd && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-charcoal-navy mb-3">Quick Add Common Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {COMMON_EVENTS.map((template, index) => {
                  const eventType = EVENT_TYPES.find(type => type.value === template.type);
                  const Icon = eventType?.icon || Calendar;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickAdd(template)}
                      className="text-left p-3 bg-white hover:bg-dusty-mauve/5 border border-gray-200 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 text-${eventType?.color}`} />
                        <span className="font-medium text-sm">{template.title}</span>
                      </div>
                      <p className="text-xs text-slate-gray">{template.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="form-label">
                  Event Title *
                </label>
                <input 
                  id="title"
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  placeholder="Enter event title..."
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="event_type" className="form-label">
                  Event Type *
                </label>
                <select 
                  id="event_type"
                  name="event_type" 
                  value={formData.event_type} 
                  onChange={handleInputChange} 
                  className="form-input"
                >
                  {EVENT_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Event Type Preview */}
            {selectedEventType && (
              <div className={`p-3 rounded-lg bg-${selectedEventType.color}/10 border border-${selectedEventType.color}/20`}>
                <div className="flex items-center gap-2">
                  <selectedEventType.icon className={`w-5 h-5 text-${selectedEventType.color}`} />
                  <span className={`text-${selectedEventType.color} font-medium`}>
                    {selectedEventType.label}
                  </span>
                </div>
              </div>
            )}

            {/* Date and Time */}
            <div>
              <label htmlFor="event_date" className="form-label">
                Date and Time *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  id="event_date"
                  type="datetime-local" 
                  name="event_date" 
                  value={formData.event_date || getDefaultDate()} 
                  onChange={handleInputChange} 
                  className="form-input pl-10" 
                  required 
                />
              </div>
              <p className="text-xs text-slate-gray mt-1">
                Select the date and time for this event
              </p>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  id="location"
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  className="form-input pl-10" 
                  placeholder="e.g., 5th Judicial Circuit Court, Room 201"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea 
                id="description"
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={3} 
                className="form-input" 
                placeholder="Brief description of the event..."
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className="form-label">
                Additional Notes
              </label>
              <textarea 
                id="notes"
                name="notes" 
                value={formData.notes || ''} 
                onChange={handleInputChange} 
                rows={2} 
                className="form-input" 
                placeholder="Any additional information or reminders..."
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-garnet/10 border border-garnet/20 rounded-lg p-3">
                <p className="text-garnet text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => {
                  resetForm();
                  onClose();
                }} 
                className="button-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              {!editingEvent && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="button-outline"
                  disabled={isSubmitting}
                >
                  Clear Form
                </button>
              )}
              
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="button-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {editingEvent ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    {editingEvent ? 'Update Event' : 'Save Event'}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Helpful Tips */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-charcoal-navy mb-3">💡 Helpful Tips</h3>
            <ul className="text-sm text-slate-gray space-y-1">
              <li>• Add all important dates as soon as you receive them</li>
              <li>• Include location details to avoid confusion on event day</li>
              <li>• Use the description field to note what you need to prepare</li>
              <li>• Set deadlines a few days before the actual due date as reminders</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}