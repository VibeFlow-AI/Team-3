"use client";

import { BookedSession } from "./types";
import SessionCard from "./session-card";
import EmptyState from "./empty-state";

interface SessionsListProps {
  sessions: BookedSession[];
  filterStatus: string;
  onViewDetails: (session: BookedSession) => void;
}

export default function SessionsList({ sessions, filterStatus, onViewDetails }: SessionsListProps) {
  return (
    <div className="space-y-4">
      {sessions.length > 0 ? (
        sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onViewDetails={onViewDetails}
          />
        ))
      ) : (
        <EmptyState filterStatus={filterStatus} />
      )}
    </div>
  );
}
