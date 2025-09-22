'use client';

import React, { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, Plus } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  age: number;
  placement_type: string;
  placement_address: string;
  last_visit: string;
  next_visit: string;
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await fetch('/api/children');
      const data = await response.json();
      setChildren(data.children || []);
    } catch (error) {
      console.error('Error fetching children:', error);
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
            <div className="grid gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-header text-charcoal-navy">Children Information</h1>
            <p className="text-slate-gray mt-2">Track placement and visitation information</p>
          </div>
          <button className="button-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Child
          </button>
        </div>

        <div className="grid gap-6">
          {children.length === 0 ? (
            <div className="card text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No children information available</p>
            </div>
          ) : (
            children.map((child) => (
              <div key={child.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Users className="w-6 h-6 text-dusty-mauve mt-1" />
                    <div>
                      <h3 className="font-semibold text-charcoal-navy text-lg">{child.name}</h3>
                      <p className="text-slate-gray">Age: {child.age}</p>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-terracotta" />
                          <span className="text-sm">
                            <span className="font-medium">{child.placement_type}</span> - {child.placement_address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-olive-emerald" />
                          <span className="text-sm">
                            Last visit: {new Date(child.last_visit).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-dusty-mauve" />
                          <span className="text-sm">
                            Next visit: {new Date(child.next_visit).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}