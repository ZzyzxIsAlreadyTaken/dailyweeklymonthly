"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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

export function Overview() {
  const [localDailyGoals, setLocalDailyGoals] =
    useState<DailyGoal[]>(mockDailyGoals);
  const [localWeeklyGoals, setLocalWeeklyGoals] =
    useState<WeeklyGoal[]>(mockWeeklyGoals);
  const [localMonthlyGoals, setLocalMonthlyGoals] =
    useState<MonthlyGoal[]>(mockMonthlyGoals);
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

  // Helper function to get the days of the current week
  const getDaysOfWeek = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const days = [];

    // Calculate the start of the week (Monday)
    const startDate = new Date(today);
    startDate.setDate(
      today.getDate() - (currentDay === 0 ? 6 : currentDay - 1),
    );

    // Generate array of dates for the week (Monday to Sunday)
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const weekDays = getDaysOfWeek();

  // Helper function to get goals for a specific date
  const getGoalsForDate = (date: Date) => {
    const dailyGoals = localDailyGoals.filter(
      (goal) => goal.date.toDateString() === date.toDateString(),
    );

    return dailyGoals;
  };

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

  // Render a more compact goal item for day cards
  const renderDayGoalItem = (goal: DailyGoal) => {
    return (
      <li
        key={goal.id}
        className={cn(
          "mb-1 flex items-center justify-between gap-1 rounded-md border p-1.5 text-xs",
          goal.status === "completed"
            ? "border-green-200 bg-green-50"
            : goal.status === "in-progress"
              ? "border-amber-200 bg-amber-50"
              : "border-gray-200 bg-gray-50",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <Checkbox
            checked={goal.status === "completed"}
            onCheckedChange={(checked) =>
              handleCheckboxChange(goal, checked as boolean)
            }
            className="h-4 w-4"
            aria-label={
              goal.status === "completed"
                ? "Mark as incomplete"
                : "Mark as complete"
            }
          />
          <span className="truncate">{goal.title}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge
              className={cn(
                "h-5 shrink-0 cursor-pointer px-1.5 py-0.5",
                statusColors[goal.status],
              )}
            >
              {renderStatusIcon(goal.status)}
              <ChevronDown className="ml-0.5 h-2 w-2" />
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

  // Standard goal item for weekly and monthly goals
  const renderGoalItem = (goal: WeeklyGoal | MonthlyGoal) => {
    return (
      <li
        key={goal.id}
        className={cn(
          "mb-2 flex items-center justify-between gap-2 rounded-md border p-2",
          goal.status === "completed"
            ? "border-green-200 bg-green-50"
            : goal.status === "in-progress"
              ? "border-amber-200 bg-amber-50"
              : "border-gray-200 bg-gray-50",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
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
          <span className="truncate text-sm">{goal.title}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge
              className={cn(
                "shrink-0 cursor-pointer",
                statusColors[goal.status],
              )}
            >
              <span className="mr-1">{renderStatusIcon(goal.status)}</span>
              <span className="text-xs capitalize">
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

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Format day name (e.g., "Mon", "Tue")
  const formatDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Format day number (e.g., "1", "15")
  const formatDayNumber = (date: Date) => {
    return date.getDate().toString();
  };

  // Get current month name and year
  const getCurrentMonthAndYear = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Overview</h2>
        <p className="text-gray-600">
          Track your goals across different timeframes
        </p>
      </div>

      {/* First row - 4 days */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {weekDays.slice(0, 4).map((day) => (
          <Card
            key={day.toISOString()}
            className={cn(
              "h-full",
              isToday(day) ? "border-blue-300 shadow-sm" : "",
            )}
          >
            <CardHeader
              className={cn("pb-2 pt-3", isToday(day) ? "bg-blue-50" : "")}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">
                  {formatDayName(day)}
                </div>
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                    isToday(day) ? "bg-blue-500 text-white" : "text-gray-700",
                  )}
                >
                  {formatDayNumber(day)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-1">
                {getGoalsForDate(day).length > 0 ? (
                  <ul className="max-h-[200px] space-y-1 overflow-y-auto pr-1">
                    {getGoalsForDate(day).map(renderDayGoalItem)}
                  </ul>
                ) : (
                  <p className="text-center text-xs text-gray-500">No goals</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Second row - 3 days */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {weekDays.slice(4, 7).map((day) => (
          <Card
            key={day.toISOString()}
            className={cn(
              "h-full",
              isToday(day) ? "border-blue-300 shadow-sm" : "",
            )}
          >
            <CardHeader
              className={cn("pb-2 pt-3", isToday(day) ? "bg-blue-50" : "")}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">
                  {formatDayName(day)}
                </div>
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                    isToday(day) ? "bg-blue-500 text-white" : "text-gray-700",
                  )}
                >
                  {formatDayNumber(day)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-1">
                {getGoalsForDate(day).length > 0 ? (
                  <ul className="max-h-[200px] space-y-1 overflow-y-auto pr-1">
                    {getGoalsForDate(day).map(renderDayGoalItem)}
                  </ul>
                ) : (
                  <p className="text-center text-xs text-gray-500">No goals</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {localWeeklyGoals.length > 0 ? (
              <ul className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
                {localWeeklyGoals.map(renderGoalItem)}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No weekly goals for this period.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Goals - {getCurrentMonthAndYear()}</CardTitle>
          </CardHeader>
          <CardContent>
            {localMonthlyGoals.length > 0 ? (
              <ul className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
                {localMonthlyGoals.map(renderGoalItem)}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No monthly goals for this period.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
