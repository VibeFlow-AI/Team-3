"use client";

import { useState } from "react";
import {
  BookedSession,
  mockBookedSessions,
  filterSessions,
  sortSessions,
  getStatusCounts,
  StatsCards,
  FilterSection,
  SessionsList,
  SessionDetailsModal
} from "../../components/booked-sessions";



export default function BookedSessions() {
  const [selectedSession, setSelectedSession] = useState<BookedSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleViewDetails = (session: BookedSession) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  // Filter and sort sessions
  const filteredSessions = filterSessions(mockBookedSessions, filterStatus);
  const sortedSessions = sortSessions(filteredSessions);
  const statusCounts = getStatusCounts(mockBookedSessions);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booked Sessions</h1>
          <p className="text-lg text-gray-600">Manage and track your mentoring sessions</p>
        </div>

        {/* Stats Cards */}
        <StatsCards statusCounts={statusCounts} />

        {/* Filter Section */}
        <FilterSection
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          statusCounts={statusCounts}
        />

        {/* Sessions List */}
        <SessionsList
          sessions={sortedSessions}
          filterStatus={filterStatus}
          onViewDetails={handleViewDetails}
        />

        {/* Session Details Modal */}
        <SessionDetailsModal
          session={selectedSession}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}