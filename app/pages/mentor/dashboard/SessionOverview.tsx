"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, BarChart3, Calendar } from "lucide-react";
import PieChartComponent from "./PieChartComponent";
import HorizontalBarChart from "./HorizontalBarChart";
import SessionCard from "./SessionCard";

// Types
export type AgeGroup = {
    ageRange: string;
    count: number;
    color: string;
};

export type SubjectInterest = {
    subject: string;
    count: number;
};

export type BookedSession = {
    id: string;
    studentName: string;
    studentAvatar: string;
    sessionDate: string;
    sessionTime: string;
    requestTime: string;
    subject: string;
};

type SessionOverviewProps = {
    ageGroups: AgeGroup[];
    subjectInterests: SubjectInterest[];
    bookedSessions: BookedSession[];
};

// Main SessionOverview Component
export default function SessionOverview({
    ageGroups,
    subjectInterests,
    bookedSessions
}: SessionOverviewProps) {
    // Sort sessions by date in ascending order
    const sortedSessions = [...bookedSessions].sort((a, b) =>
        new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
    );

    return (
        <div className="space-y-6">
            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Age-based Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-blue-600" />
                            <p className="py-3">Student Age Distribution</p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <PieChartComponent data={ageGroups} />
                    </CardContent>
                </Card>

                {/* Subject Interests Horizontal Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-green-600" />
                            <p className="py-3">Subject Interests</p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <HorizontalBarChart data={subjectInterests} />
                    </CardContent>
                </Card>
            </div>

            {/* Booked Sessions Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <p className="py-3">Upcoming Sessions ({sortedSessions.length})</p>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {sortedSessions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No upcoming sessions scheduled</p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-4">
                            {sortedSessions.map((session) => (
                                <SessionCard key={session.id} session={session} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
