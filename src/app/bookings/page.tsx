'use client';

import { Suspense } from 'react';
import BookingsContent from './BookingsContent';

export default function BookingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <BookingsContent />
    </Suspense>
  );
}
