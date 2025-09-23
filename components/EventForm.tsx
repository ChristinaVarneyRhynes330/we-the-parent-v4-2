'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

// This should match the 'case_id' for your sample case in Supabase.
const CASE_ID = 'bf45b3cd-652c-43db-b535-38ab89877ff9';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: () => void;
}

export default function EventForm({ isOpen, onClose, onEventAdded }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'Appointment',
    event_date: '',
    description: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, case_id: CASE_ID }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create event.');
      }

      onEventAdded(); // Refresh the timeline
      onClose(); // Close the modal
      setFormData({ // Reset form
        title: '',
        event_type: 'Appointment',
        event_date: '',
        description: '',
        location: '',
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div className="card w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-gray hover:text-charcoal-navy">
          <X className="w-6 h-6" />
        </button>
        <h2 className="section-subheader">Add New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Title *</label>
            <input name="title" value={formData.title} onChange={handleInputChange} className="form-input" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Event Type *</label>
              <select name="event_type" value={formData.event_type} onChange={handleInputChange} className="form-input">
                <option>Appointment</option>
                <option>Deadline</option>
                <option>Filing</option>
                <option>Hearing</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="form-label">Date *</label>
              <input type="datetime-local" name="event_date" value={formData.event_date} onChange={handleInputChange} className="form-input" required />
            </div>
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="form-input" />
          </div>
          <div>
            <label className="form-label">Location</label>
            <input name="location" value={formData.location} onChange={handleInputChange} className="form-input" />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="button-primary">
              {isSubmitting ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}