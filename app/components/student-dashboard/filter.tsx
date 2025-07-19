"use client";

import { Button } from "@/components/ui/button";

interface FilterProps {
  onClearFilters: () => void;
}

export default function Filter({ onClearFilters }: FilterProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="relative">
        <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Select by Session Duration</option>
          <option>30 mins - 1 hour</option>
          <option>1 hour</option>
          <option>1-2 hours</option>
          <option>2+ hours</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        onClick={onClearFilters}
        className="bg-black text-white hover:bg-gray-800 border-black"
      >
        Clear Filters
      </Button>
    </div>
  );
}
