"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { GoalList } from "./GoalList";
import { CalendarView } from "./CalendarView";
import { Overview } from "./Overview";
import { AddGoalButton } from "~/components/goals/AddGoalButton";
import {
  mockDailyGoals,
  mockWeeklyGoals,
  mockMonthlyGoals,
} from "~/data/mockData";
import { formatDate } from "~/lib/utils";
import type { TimeFrame } from "~/types";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    TimeFrame | "calendar" | "overview"
  >("today");
  const today = new Date();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Training Goals Dashboard</h1>
        <p className="text-gray-600">
          Track and manage your fitness goals across different timeframes
        </p>
      </div>

      <Tabs
        defaultValue="today"
        onValueChange={(value) =>
          setActiveTab(value as TimeFrame | "calendar" | "overview")
        }
      >
        <div className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
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

        <TabsContent value="overview" className="space-y-6">
          <div className="rounded-lg bg-slate-50 p-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Complete Overview
            </h2>
            <p className="text-sm text-slate-600">
              View and manage all your goals in one place
            </p>
          </div>

          <Overview />
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

      <AddGoalButton />
    </div>
  );
}
