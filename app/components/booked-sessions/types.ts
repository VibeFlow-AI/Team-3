// Types for booked sessions
export interface BookedSession {
  id: string;
  mentorName: string;
  mentorInitials: string;
  mentorInitialsColor: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: "upcoming" | "completed" | "cancelled";
  sessionType: "online" | "in-person";
  meetingLink?: string;
  location?: string;
}

export interface SessionDetailsModalProps {
  session: BookedSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface SessionCardProps {
  session: BookedSession;
  onViewDetails: (session: BookedSession) => void;
}

export interface FilterSectionProps {
  filterStatus: string;
  onFilterChange: (status: string) => void;
  statusCounts: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
}

export interface StatsCardsProps {
  statusCounts: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
}
