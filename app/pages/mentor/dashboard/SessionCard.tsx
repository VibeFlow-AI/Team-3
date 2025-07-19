import { Card } from "@/components/ui/card";
import { BookedSession } from "./SessionOverview";
import { Calendar, Clock, User, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const SessionCard = ({ session }: { session: BookedSession }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <h4 className="font-medium">{session.studentName}</h4>
                        <p className="text-sm text-gray-500">
                            Requested: {new Date(session.requestTime).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(session.sessionDate)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4" />
                        {formatTime(session.sessionTime)}
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Video className="w-4 h-4 mr-1" />
                        Start Session
                    </Button>
                </div>
            </div>
            <div className="mt-2 pt-2 border-t">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {session.subject}
                </span>
            </div>
        </Card>
    );
};

export default SessionCard;