import { BookedSession } from "./types";

// Mock data for booked sessions
export const mockBookedSessions: BookedSession[] = [
  {
    id: "1",
    mentorName: "Rahul Lavan",
    mentorInitials: "RL",
    mentorInitialsColor: "#60A5FA",
    subject: "Physics",
    date: "July 15, 2025",
    time: "10:00 AM",
    duration: "1 hour",
    status: "upcoming",
    sessionType: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: "2",
    mentorName: "Sarah Chen",
    mentorInitials: "SC",
    mentorInitialsColor: "#34D399",
    subject: "Mathematics",
    date: "July 18, 2025",
    time: "2:00 PM",
    duration: "45 minutes",
    status: "upcoming",
    sessionType: "online",
    meetingLink: "https://zoom.us/j/123456789"
  },
  {
    id: "3",
    mentorName: "David Kumar",
    mentorInitials: "DK",
    mentorInitialsColor: "#F59E0B",
    subject: "Chemistry",
    date: "July 12, 2025",
    time: "3:30 PM",
    duration: "1 hour",
    status: "completed",
    sessionType: "in-person",
    location: "Library Room 204"
  },
  {
    id: "4",
    mentorName: "Emily Rodriguez",
    mentorInitials: "ER",
    mentorInitialsColor: "#EF4444",
    subject: "Biology",
    date: "July 20, 2025",
    time: "11:00 AM",
    duration: "30 minutes",
    status: "upcoming",
    sessionType: "online",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/xyz"
  },
  {
    id: "5",
    mentorName: "Michael Thompson",
    mentorInitials: "MT",
    mentorInitialsColor: "#8B5CF6",
    subject: "English Literature",
    date: "July 10, 2025",
    time: "9:00 AM",
    duration: "1 hour",
    status: "cancelled",
    sessionType: "online"
  }
];
