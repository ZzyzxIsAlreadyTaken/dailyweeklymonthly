"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { GoalList } from "./GoalList";
import { CalendarView } from "./CalendarView";
import {
  mockDailyGoals,
  mockWeeklyGoals,
  mockMonthlyGoals,
} from "~/data/mockData";
import { formatDate } from "~/lib/utils";
import type { TimeFrame } from "~/types";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TimeFrame | "calendar">("today");
  const today = new Date();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Training Goals Dashboard</h1>
        <p className="text-gray-600">
          Track and manage your fitness goals across different timeframes
        </p>
      </div>

      <Tabs
        defaultValue="today"
        onValueChange={(value) => setActiveTab(value as TimeFrame | "calendar")}
      >
        <div className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="today" className="space-y-6">
          <div className="rounded-lg bg-slate-50 p-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Today: {formatDate(today)}
            </h2>
            <p className="text-sm text-slate-600">
              Focus on completing your daily training goals
            </p>
          </div>

          <GoalList
            goals={mockDailyGoals}
            title="Today's Goals"
            emptyMessage="No goals set for today. Add a new goal to get started!"
          />
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          <div className="rounded-lg bg-slate-50 p-4">
            <h2 className="text-xl font-semibold text-slate-800">
              This Week&apos;s Overview
            </h2>
            <p className="text-sm text-slate-600">
              Track your weekly training progress
            </p>
          </div>

          <GoalList
            goals={mockWeeklyGoals}
            title="Weekly Goals"
            emptyMessage="No weekly goals set. Plan your week by adding goals!"
          />

          <GoalList
            goals={mockDailyGoals}
            title="Today's Goals"
            emptyMessage="No goals set for today."
          />
        </TabsContent>

        <TabsContent value="month" className="space-y-6">
          <div className="rounded-lg bg-slate-50 p-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Monthly Progress
            </h2>
            <p className="text-sm text-slate-600">
              Review your long-term training objectives
            </p>
          </div>

          <GoalList
            goals={mockMonthlyGoals}
            title="Monthly Goals"
            emptyMessage="No monthly goals set. Set some long-term objectives!"
          />

          <GoalList
            goals={mockWeeklyGoals}
            title="This Week's Goals"
            emptyMessage="No goals set for this week."
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="rounded-lg bg-slate-50 p-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Calendar Overview
            </h2>
            <p className="text-sm text-slate-600">
              View and manage your goals in a calendar format
            </p>
          </div>

          <CalendarView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
