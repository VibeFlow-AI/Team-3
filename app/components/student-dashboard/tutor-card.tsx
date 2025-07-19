"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import Calendar from "./calender";

interface TutorCardProps {
  name: string;
  initials: string;
  subjects: string[];
  description: string;
  duration: string;
  preferredLanguage: string;
  initialsColor: string;
}

export default function TutorCard({ 
  name, 
  initials, 
  subjects, 
  description, 
  duration, 
  preferredLanguage, 
  initialsColor 
}: TutorCardProps) {
  const [showModal, setShowModal] = useState(false);

  const handleBookSession = () => {
    setShowModal(true);
  };

  const handleSaveBooking = (date: number, time: string) => {
    console.log(`Booked session with ${name} on July ${date}, 2025 at ${time}`);
    setShowModal(false);
  };

  const handleCloseCalendar = () => {
    setShowModal(false);
  };
  return (
    <div className="w-full h-full relative">
      <Card className="bg-white border-2 border-gray-200 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-visible hover:-translate-y-1 h-[420px] flex flex-col">
        <CardContent className="p-7 flex-1 flex flex-col">
          <div className="flex items-start gap-5 mb-6">
            <div 
              className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}
              style={{ backgroundColor: initialsColor }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-xl text-gray-900 mb-1 leading-tight">{name}</h3>
              <p className="text-sm text-gray-500 font-medium">Mentor</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {subjects.map((subject, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
              >
                {subject}
              </span>
            ))}
          </div>

          <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-3 flex-1">
            {description}
          </p>

          <div className="space-y-3 mt-auto">
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-600">Duration:</span>
              <span className="text-gray-900 font-medium ml-auto">{duration}</span>
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="text-gray-600">Language:</span>
              <span className="text-gray-900 font-medium ml-auto">{preferredLanguage}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-7 py-5 bg-gray-50 border-t border-gray-100 flex gap-3 mt-auto">
          <Button 
            className="flex-1 bg-black text-white hover:bg-gray-800 transition-colors duration-200 py-2.5 text-sm font-medium"
            onClick={handleBookSession}
          >
            Book a session
          </Button>
          <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </CardFooter>
      </Card>

      <Calendar 
        isOpen={showModal}
        onClose={handleCloseCalendar}
        onSave={handleSaveBooking}
        tutorName={name}
      />
    </div>
  );
}
