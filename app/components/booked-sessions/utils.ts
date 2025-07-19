import { BookedSession } from "./types";

// Utility function to get status colors
export const getStatusColor = (status: string) => {
  switch (status) {
    case "upcoming": return "text-blue-600 bg-blue-50 border-blue-200";
    case "completed": return "text-green-600 bg-green-50 border-green-200";
    case "cancelled": return "text-red-600 bg-red-50 border-red-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

// Utility function to get modal status colors
export const getModalStatusColor = (status: string) => {
  switch (status) {
    case "upcoming": return "text-blue-600 bg-blue-50";
    case "completed": return "text-green-600 bg-green-50";
    case "cancelled": return "text-red-600 bg-red-50";
    default: return "text-gray-600 bg-gray-50";
  }
};

// Utility function to filter sessions
export const filterSessions = (sessions: BookedSession[], filterStatus: string) => {
  return filterStatus === "all" 
    ? sessions 
    : sessions.filter(session => session.status === filterStatus);
};

// Utility function to sort sessions
export const sortSessions = (sessions: BookedSession[]) => {
  return [...sessions].sort((a, b) => {
    if (a.status === "upcoming" && b.status !== "upcoming") return -1;
    if (a.status !== "upcoming" && b.status === "upcoming") return 1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

// Utility function to get status counts
export const getStatusCounts = (sessions: BookedSession[]) => {
  const upcoming = sessions.filter(s => s.status === "upcoming").length;
  const completed = sessions.filter(s => s.status === "completed").length;
  const cancelled = sessions.filter(s => s.status === "cancelled").length;
  return { upcoming, completed, cancelled, total: sessions.length };
};
