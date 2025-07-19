"use client";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  filterStatus: string;
}

export default function EmptyState({ filterStatus }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-sm border border-gray-200">
        <div className="text-gray-400 mb-6">
          <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No sessions found</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {filterStatus === "all" 
            ? "You haven't booked any sessions yet. Start by finding a mentor!"
            : `No ${filterStatus} sessions found. Try adjusting your filter.`
          }
        </p>
        <Button 
          className="bg-black text-white hover:bg-gray-800 px-6 py-2.5"
          onClick={() => window.location.href = "/pages/student-dashboard"}
        >
          Find Mentors
        </Button>
      </div>
    </div>
  );
}
