"use client";

import { Button } from "@/components/ui/button";
import { SessionDetailsModalProps } from "./types";
import { getModalStatusColor } from "./utils";

export default function SessionDetailsModal({ session, isOpen, onClose }: SessionDetailsModalProps) {
  if (!isOpen || !session) return null;

  const handleJoinSession = () => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    }
  };

  const handleCancelSession = () => {
    // Here you would typically call an API to cancel the session
    console.log(`Cancelling session with ${session.mentorName}`);
    // For now, just close the modal
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 relative shadow-2xl border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Details</h2>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg"
              style={{ backgroundColor: session.mentorInitialsColor }}
            >
              {session.mentorInitials}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{session.mentorName}</h3>
              <p className="text-gray-600">{session.subject}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getModalStatusColor(session.status)}`}>
              {session.status}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium text-gray-900">{session.date}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium text-gray-900">{session.time}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-900">{session.duration}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium text-gray-900 capitalize">{session.sessionType}</span>
          </div>

          {session.meetingLink && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Meeting Link:</span>
              <a
                href={session.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Join Meeting
              </a>
            </div>
          )}

          {session.location && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-gray-900">{session.location}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          {session.status === "upcoming" && session.meetingLink && (
            <Button
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleJoinSession}
            >
              Join Session
            </Button>
          )}
          {session.status === "upcoming" && (
            <Button
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              onClick={handleCancelSession}
            >
              Cancel Session
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
