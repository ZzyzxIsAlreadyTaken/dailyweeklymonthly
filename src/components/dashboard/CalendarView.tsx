"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarComponent } from "~/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { CheckCircle, Circle, Clock, ChevronDown } from "lucide-react";
import { cn, formatDate } from "~/lib/utils";
import { DailyGoal, WeeklyGoal, MonthlyGoal, GoalStatus } from "~/types";
import {
  mockDailyGoals,
  mockWeeklyGoals,
  mockMonthlyGoals,
} from "~/data/mockData";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type CalendarViewMode = "day" | "week" | "month";

export function CalendarView() {
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>("day");
  const [localDailyGoals, setLocalDailyGoals] =
    useState<DailyGoal[]>(mockDailyGoals);
  const [localWeeklyGoals, setLocalWeeklyGoals] =
    useState<WeeklyGoal[]>(mockWeeklyGoals);
  const [localMonthlyGoals, setLocalMonthlyGoals] =
    useState<MonthlyGoal[]>(mockMonthlyGoals);

  // Store previous statuses for goals
  const [prevStatuses, setPrevStatuses] = useState<Record<string, GoalStatus>>(
    {},
  );

  // Update prevStatus when a goal's status changes to non-completed
  useEffect(() => {
    const allGoals = [
      ...localDailyGoals,
      ...localWeeklyGoals,
      ...localMonthlyGoals,
    ];
    const newPrevStatuses = { ...prevStatuses };

    allGoals.forEach((goal) => {
      if (goal.status !== "completed") {
        newPrevStatuses[goal.id] = goal.status;
      }
    });

    setPrevStatuses(newPrevStatuses);
  }, [localDailyGoals, localWeeklyGoals, localMonthlyGoals]);

  // Helper function to get goals for a specific date
  const getGoalsForDate = (date: Date) => {
    const dailyGoals = localDailyGoals.filter(
      (goal) => goal.date.toDateString() === date.toDateString(),
    );

    const weeklyGoals = localWeeklyGoals.filter(
      (goal) => date >= goal.startDate && date <= goal.endDate,
    );

    const monthlyGoals = localMonthlyGoals.filter(
      (goal) =>
        goal.month === date.getMonth() && goal.year === date.getFullYear(),
    );

    return {
      dailyGoals,
      weeklyGoals,
      monthlyGoals,
    };
  };

  // Get goals for the selected date
  const { dailyGoals, weeklyGoals, monthlyGoals } = getGoalsForDate(date);

  // Helper function to render status icon
  const renderStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "not-started":
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const statusColors = {
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
    "in-progress": "bg-amber-100 text-amber-800 hover:bg-amber-200",
    "not-started": "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const handleDailyGoalStatusChange = (id: string, status: GoalStatus) => {
    setLocalDailyGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              status,
              completedAt: status === "completed" ? new Date() : undefined,
            }
          : goal,
      ),
    );
  };

  const handleWeeklyGoalStatusChange = (id: string, status: GoalStatus) => {
    setLocalWeeklyGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              status,
              completedAt: status === "completed" ? new Date() : undefined,
            }
          : goal,
      ),
    );
  };

  const handleMonthlyGoalStatusChange = (id: string, status: GoalStatus) => {
    setLocalMonthlyGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              status,
              completedAt: status === "completed" ? new Date() : undefined,
            }
          : goal,
      ),
    );
  };

  const handleCheckboxChange = (
    goal: DailyGoal | WeeklyGoal | MonthlyGoal,
    checked: boolean,
  ) => {
    let newStatus: GoalStatus;

    if (checked) {
      // If checking, mark as completed
      newStatus = "completed";
    } else {
      // If unchecking, revert to the previous non-completed status
      newStatus = prevStatuses[goal.id] ?? "in-progress";
    }

    if ("date" in goal) {
      handleDailyGoalStatusChange(goal.id, newStatus);
    } else if ("weekNumber" in goal) {
      handleWeeklyGoalStatusChange(goal.id, newStatus);
    } else if ("month" in goal) {
      handleMonthlyGoalStatusChange(goal.id, newStatus);
    }
  };

  const handleStatusChange = (
    goal: DailyGoal | WeeklyGoal | MonthlyGoal,
    status: GoalStatus,
  ) => {
    if ("date" in goal) {
      handleDailyGoalStatusChange(goal.id, status);
    } else if ("weekNumber" in goal) {
      handleWeeklyGoalStatusChange(goal.id, status);
    } else if ("month" in goal) {
      handleMonthlyGoalStatusChange(goal.id, status);
    }
  };

  const renderGoalItem = (goal: DailyGoal | WeeklyGoal | MonthlyGoal) => {
    return (
      <li
        key={goal.id}
        className={cn(
          "flex items-center justify-between gap-2 rounded-md border p-2",
          goal.status === "completed"
            ? "border-green-200 bg-green-50"
            : goal.status === "in-progress"
              ? "border-amber-200 bg-amber-50"
              : "border-gray-200 bg-gray-50",
        )}
      >
        <div className="flex items-center gap-2">
          <Checkbox
            checked={goal.status === "completed"}
            onCheckedChange={(checked) =>
              handleCheckboxChange(goal, checked as boolean)
            }
            aria-label={
              goal.status === "completed"
                ? "Mark as incomplete"
                : "Mark as complete"
            }
          />
          <span>{goal.title}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge className={cn("cursor-pointer", statusColors[goal.status])}>
              <span className="mr-1">{renderStatusIcon(goal.status)}</span>
              <span className="capitalize">
                {goal.status.replace("-", " ")}
              </span>
              <ChevronDown className="ml-1 h-3 w-3" />
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleStatusChange(goal, "not-started")}
            >
              <Circle className="mr-2 h-4 w-4 text-gray-400" />
              <span>Not Started</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(goal, "in-progress")}
            >
              <Clock className="mr-2 h-4 w-4 text-amber-500" />
              <span>In Progress</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(goal, "completed")}
            >
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              <span>Completed</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    );
  };

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Calendar View</h2>
        <div className="flex items-center gap-2">
          <Select
            value={viewMode}
            onValueChange={(value) => setViewMode(value as CalendarViewMode)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily View</SelectItem>
              <SelectItem value="week">Weekly View</SelectItem>
              <SelectItem value="month">Monthly View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {viewMode === "day" && `Goals for ${formatDate(date)}`}
              {viewMode === "week" && "Weekly Goals"}
              {viewMode === "month" && "Monthly Goals"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {viewMode === "day" && (
                <>
                  {dailyGoals.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="font-medium">Daily Goals</h3>
                      <ul className="space-y-2">
                        {dailyGoals.map(renderGoalItem)}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No daily goals for this date.
                    </p>
                  )}

                  {weeklyGoals.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium">Weekly Goals (Active)</h3>
                      <ul className="space-y-2">
                        {weeklyGoals.map(renderGoalItem)}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {viewMode === "week" && (
                <div className="space-y-3">
                  <h3 className="font-medium">Weekly Goals</h3>
                  {weeklyGoals.length > 0 ? (
                    <ul className="space-y-2">
                      {weeklyGoals.map(renderGoalItem)}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No weekly goals for this period.
                    </p>
                  )}
                </div>
              )}

              {viewMode === "month" && (
                <div className="space-y-3">
                  <h3 className="font-medium">Monthly Goals</h3>
                  {monthlyGoals.length > 0 ? (
                    <ul className="space-y-2">
                      {monthlyGoals.map(renderGoalItem)}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No monthly goals for this period.
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
