import SessionOverview from "./SessionOverview";

export default function Dashboard() {
    // Mock data for age groups
    const mockAgeGroups = [
        { ageRange: "13-16", count: 12, color: "#3B82F6" },
        { ageRange: "17-20", count: 18, color: "#10B981" },
        { ageRange: "21-25", count: 8, color: "#F59E0B" },
        { ageRange: "26+", count: 5, color: "#EF4444" },
    ];

    // Mock data for subject interests
    const mockSubjectInterests = [
        { subject: "Mathematics", count: 25 },
        { subject: "Physics", count: 18 },
        { subject: "Chemistry", count: 15 },
        { subject: "Biology", count: 12 },
        { subject: "Computer Science", count: 20 },
        { subject: "English", count: 8 },
    ];

    // Mock data for booked sessions
    const mockBookedSessions = [
        {
            id: "1",
            studentName: "Alice Johnson",
            studentAvatar: "/avatars/alice.jpg",
            sessionDate: "2024-01-15",
            sessionTime: "10:00",
            requestTime: "2024-01-10T14:30:00Z",
            subject: "Mathematics"
        },
        {
            id: "2",
            studentName: "Bob Smith",
            studentAvatar: "/avatars/bob.jpg",
            sessionDate: "2024-01-15",
            sessionTime: "14:30",
            requestTime: "2024-01-11T09:15:00Z",
            subject: "Physics"
        },
        {
            id: "3",
            studentName: "Carol Davis",
            studentAvatar: "/avatars/carol.jpg",
            sessionDate: "2024-01-16",
            sessionTime: "11:00",
            requestTime: "2024-01-12T16:20:00Z",
            subject: "Chemistry"
        },
        {
            id: "4",
            studentName: "David Wilson",
            studentAvatar: "/avatars/david.jpg",
            sessionDate: "2024-01-17",
            sessionTime: "13:15",
            requestTime: "2024-01-13T11:45:00Z",
            subject: "Computer Science"
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <SessionOverview
                ageGroups={mockAgeGroups}
                subjectInterests={mockSubjectInterests}
                bookedSessions={mockBookedSessions}
            />
        </div>
    );
}
