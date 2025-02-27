export type GoalStatus = "completed" | "in-progress" | "not-started";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  status: GoalStatus;
  createdAt: Date;
  completedAt?: Date;
}

export interface DailyGoal extends Goal {
  date: Date;
}

export interface WeeklyGoal extends Goal {
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
}

export interface MonthlyGoal extends Goal {
  month: number;
  year: number;
}

export type TimeFrame = "today" | "week" | "month";
