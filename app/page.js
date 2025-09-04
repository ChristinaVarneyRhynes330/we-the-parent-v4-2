'use client';
import { Heart, Scale, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex flex-col justify-center items-center p-8">
      <div className="text-center max-w-2xl">
        {/* We The Parent logo and tagline */}
        <div className="flex items-center justify-center mb-6">
          <Heart className="w-16 h-16 text-orange-500 mr-4" />
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-gray-800">We The Parent</h1>
        </div>
        <p className="text-xl text-gray-600 mb-8">One voice. One fight. One family. Est. 2025 | Advocacy Justice</p>

        {/* Quick Actions / Navigation */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/dashboard">
            <button className="btn-primary flex items-center justify-center">
              <Scale className="w-5 h-5 mr-2" />
              My Case Dashboard
            </button>
          </Link>
          <Link href="/legal-research">
            <button className="btn-secondary flex items-center justify-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Legal Research
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
