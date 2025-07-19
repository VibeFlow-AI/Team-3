"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StatsCardsProps } from "./types";

export default function StatsCards({ statusCounts }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{statusCounts.total}</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-50 border border-blue-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.upcoming}</div>
          <div className="text-sm text-blue-600">Upcoming</div>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50 border border-green-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
          <div className="text-sm text-green-600">Completed</div>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50 border border-red-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</div>
          <div className="text-sm text-red-600">Cancelled</div>
        </CardContent>
      </Card>
    </div>
  );
}
