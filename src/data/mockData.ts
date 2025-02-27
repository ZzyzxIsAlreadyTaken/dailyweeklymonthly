import { DailyGoal, MonthlyGoal, WeeklyGoal } from "~/types";

// Helper function to get the current week's start and end dates
const getCurrentWeekDates = () => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Calculate days to subtract to get to the start of the week (Monday)
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;

  const startDate = new Date(now);
  startDate.setDate(now.getDate() - daysToMonday);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

// Get current week number
const getWeekNumber = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const today = new Date();
const { startDate, endDate } = getCurrentWeekDates();
const currentWeekNumber = getWeekNumber(today);
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Mock Daily Goals
export const mockDailyGoals: DailyGoal[] = [
  {
    id: "d1",
    title: "5km Run",
    description: "Morning run at a moderate pace",
    status: "completed",
    createdAt: new Date(today.setHours(0, 0, 0, 0)),
    completedAt: new Date(today.setHours(8, 30, 0, 0)),
    date: today,
  },
  {
    id: "d2",
    title: "Upper Body Workout",
    description: "Focus on chest and back",
    status: "in-progress",
    createdAt: new Date(today.setHours(0, 0, 0, 0)),
    date: today,
  },
  {
    id: "d3",
    title: "Yoga Session",
    description: "30 minutes of stretching and relaxation",
    status: "not-started",
    createdAt: new Date(today.setHours(0, 0, 0, 0)),
    date: today,
  },
  {
    id: "d4",
    title: "10,000 Steps",
    description: "Daily step goal",
    status: "in-progress",
    createdAt: new Date(today.setHours(0, 0, 0, 0)),
    date: today,
  },
];

// Mock Weekly Goals
export const mockWeeklyGoals: WeeklyGoal[] = [
  {
    id: "w1",
    title: "Run 20km Total",
    description: "Spread across 3-4 sessions",
    status: "in-progress",
    createdAt: new Date(startDate),
    weekNumber: currentWeekNumber,
    year: currentYear,
    startDate,
    endDate,
  },
  {
    id: "w2",
    title: "3 Strength Training Sessions",
    description: "Focus on progressive overload",
    status: "in-progress",
    createdAt: new Date(startDate),
    weekNumber: currentWeekNumber,
    year: currentYear,
    startDate,
    endDate,
  },
  {
    id: "w3",
    title: "2 Yoga/Flexibility Sessions",
    description: "For recovery and mobility",
    status: "not-started",
    createdAt: new Date(startDate),
    weekNumber: currentWeekNumber,
    year: currentYear,
    startDate,
    endDate,
  },
];

// Mock Monthly Goals
export const mockMonthlyGoals: MonthlyGoal[] = [
  {
    id: "m1",
    title: "Run 80km Total",
    description: "Monthly distance goal",
    status: "in-progress",
    createdAt: new Date(currentYear, currentMonth, 1),
    month: currentMonth,
    year: currentYear,
  },
  {
    id: "m2",
    title: "Increase Bench Press by 5kg",
    description: "Progressive strength improvement",
    status: "not-started",
    createdAt: new Date(currentYear, currentMonth, 1),
    month: currentMonth,
    year: currentYear,
  },
  {
    id: "m3",
    title: "Try 2 New Workout Classes",
    description: "Expand fitness horizons",
    status: "in-progress",
    createdAt: new Date(currentYear, currentMonth, 1),
    month: currentMonth,
    year: currentYear,
  },
  {
    id: "m4",
    title: "Complete 12 Strength Sessions",
    description: "Consistency goal",
    status: "in-progress",
    createdAt: new Date(currentYear, currentMonth, 1),
    month: currentMonth,
    year: currentYear,
  },
];
