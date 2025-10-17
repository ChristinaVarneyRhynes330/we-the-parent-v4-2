'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { UserPlus, X, Cake, User, MapPin } from 'lucide-react';
import { useCase } from '@/contexts/CaseContext';
import { useChildren } from '@/hooks/useChildren';

interface ChildFormData {
  name: string;
  date_of_birth: string;
  placement_type: string;
  placement_address: string;
}

export default function ChildrenPage() {
  const { activeCase } = useCase();
  const { children, isLoading, error, createChild, isCreating } = useChildren(activeCase?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ChildFormData>({
    name: '',
    date_of_birth: '',
    placement_type: 'Relative Caregiver',
    placement_address: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!activeCase) return;

    createChild({ ...formData, case_id: activeCase.id }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ name: '', date_of_birth: '', placement_type: 'Relative Caregiver', placement_address: '' });
      },
      onError: (err: any) => {
        setFormError(err.message);
      }
    });
  };
  
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  return (
    <>
      {/* Add Child Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="card w-full max-w-lg relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-gray hover:text-charcoal-navy"
              aria-label="Close modal" // ACCESSIBILITY FIX
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="section-subheader">Add Child Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label htmlFor="name" className="form-label">Full Name *</label> 
                <input id="name" name="name" value={formData.name} onChange={handleInputChange} className="form-input" required />
              </div>
              <div>
                <label htmlFor="date_of_birth" className="form-label">Date of Birth *</label>
                <input id="date_of_birth" type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} className="form-input" required />
              </div>
              <div>
                <label htmlFor="placement_type" className="form-label">Current Placement Type</label>
                <select id="placement_type" name="placement_type" value={formData.placement_type} onChange={handleInputChange} className="form-input">
                  <option>Relative Caregiver</option>
                  <option>Non-Relative Caregiver</option>
                  <option>Foster Home</option>
                  <option>Group Home</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="placement_address" className="form-label">Placement Address</label>
                <input id="placement_address" name="placement_address" value={formData.placement_address} onChange={handleInputChange} className="form-input" placeholder="e.g., 123 Main St, Anytown, FL" />
              </div>
              {formError && <p className="form-error">{formError}</p>}
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="button-secondary" disabled={isCreating}>Cancel</button>
                <button type="submit" className="button-primary" disabled={isCreating}>
                  {isCreating ? 'Saving...' : 'Save Child'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <div className="min-h-screen bg-warm-ivory p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-header text-charcoal-navy">Children</h1>
              <p className="text-slate-gray mt-2">Manage information for the children in your case.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="button-primary flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add Child
            </button>
          </div>
          
          {isLoading ? (
             <p>Loading...</p>
          ) : error ? (
            <div className="card text-center py-12 bg-garnet/10 text-garnet">
              <p>{error.message}</p>
            </div>
          ) : children.length === 0 ? (
            <div className="card text-center py-12">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No children have been added yet.</p>
              <p className="text-sm text-gray-400 mt-1">Click &quot;Add Child&quot; to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {children.map(child => (
                <div key={child.id} className="card hover:shadow-brand transition-shadow">
                   <h3 className="font-header text-xl text-charcoal-navy mb-3">{child.name}</h3>
                   <div className="space-y-2 text-sm text-slate-gray">
                      <div className="flex items-center gap-3">
                        <Cake className="w-4 h-4 text-dusty-mauve" />
                        <span>{calculateAge(child.date_of_birth)} years old (Born {new Date(child.date_of_birth).toLocaleDateString()})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-dusty-mauve" />
                        <span>{child.placement_type || 'N/A'}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}