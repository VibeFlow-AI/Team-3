"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionCardProps } from "./types";
import { getStatusColor } from "./utils";

export default function SessionCard({ session, onViewDetails }: SessionCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "completed":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "cancelled":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };
  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Mentor Avatar */}
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
              style={{ backgroundColor: session.mentorInitialsColor }}
            >
              {session.mentorInitials}
            </div>
            
            {/* Session Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900 truncate">{session.mentorName}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                  {getStatusIcon(session.status)}
                  {session.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{session.subject}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {session.date}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {session.time}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {session.duration}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <Button 
            variant="outline"
            onClick={() => onViewDetails(session)}
            className="ml-4 bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700 font-medium px-4 py-2"
          >
            View Session Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
