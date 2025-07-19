"use client";

import { useState } from "react";
import BankTransfer from "./bank-transfer";

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: number, time: string) => void;
  tutorName: string;
}

export default function Calendar({ isOpen, onClose, onSave, tutorName }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showBankTransfer, setShowBankTransfer] = useState(false);

  const currentMonth = "July 2025";
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00"
  ];

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDay = 2; // July 1st starts on Tuesday (0=Sunday, 1=Monday, 2=Tuesday)

  const handleSave = () => {
    setShowBankTransfer(true);
  };

  const handleCancel = () => {
    onClose();
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleBankTransferComplete = () => {
    const finalDate = selectedDate || 10;
    const finalTime = selectedTime || "10:00";
    onSave(finalDate, finalTime);
    setShowBankTransfer(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleBankTransferClose = () => {
    setShowBankTransfer(false);
    // Don't reset selected date and time so user can see their previous selection
    // and can modify if needed before trying to save again
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 relative shadow-2xl border">
        <button 
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-6">Schedule this session</h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Date Selection */}
          <div>
            <h3 className="font-medium mb-4 text-gray-800">Choose a date</h3>
            
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="font-medium text-gray-900">{currentMonth}</span>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center py-2 font-medium">{day}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Previous month dates */}
              {Array.from({ length: startDay }, (_, i) => (
                <div key={`prev-${i}`} className="h-9 flex items-center justify-center">
                  <span className="text-xs text-gray-300">{29 + i}</span>
                </div>
              ))}
              
              {/* Current month dates */}
              {daysInMonth.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`h-9 w-9 text-sm rounded flex items-center justify-center font-medium ${
                    selectedDate === day || day === 10
                      ? 'bg-black text-white' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {day}
                </button>
              ))}
              
              {/* Next month dates */}
              {Array.from({ length: 7 - ((startDay + daysInMonth.length) % 7) }, (_, i) => (
                <div key={`next-${i}`} className="h-9 flex items-center justify-center">
                  <span className="text-xs text-gray-300">{i + 1}</span>
                </div>
              )).filter((_, i) => i < 7 - ((startDay + daysInMonth.length) % 7) && 7 - ((startDay + daysInMonth.length) % 7) !== 7)}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <h3 className="font-medium mb-4 text-gray-800">Choose a time</h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-3 text-sm rounded font-medium ${
                    selectedTime === time || time === '10:00'
                      ? 'bg-black text-white' 
                      : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button 
            onClick={handleCancel}
            className="py-3 px-6 text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="py-3 px-6 bg-black text-white rounded-md hover:bg-gray-800 font-medium"
          >
            Save
          </button>
        </div>
      </div>

      <BankTransfer
        isOpen={showBankTransfer}
        onClose={handleBankTransferClose}
        onComplete={handleBankTransferComplete}
        tutorName={tutorName}
        selectedDate={selectedDate || 10}
        selectedTime={selectedTime || "10:00"}
      />
    </div>
  );
}
