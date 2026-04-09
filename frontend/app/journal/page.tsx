'use client';

import { JournalEntryForm } from '@/components/JournalEntryForm';

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,#F5DE7A,#F2EEEC,#EFBF38,#E08600)] bg-fixed flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fadeIn">
        <JournalEntryForm />
      </div>
    </div>
  );
}
