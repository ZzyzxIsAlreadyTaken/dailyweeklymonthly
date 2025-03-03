"use server";

import { db } from "~/server/db";
import { goals } from "~/server/db/schema";
import { revalidatePath } from "next/cache";
import { sql } from "drizzle-orm";

export type GoalType = "daily" | "weekly" | "monthly";
export type GoalStatus = "not-started" | "in-progress" | "completed";

interface BaseGoalInput {
  title: string;
  description?: string;
  type: GoalType;
}

interface DailyGoalInput extends BaseGoalInput {
  type: "daily";
  date: Date;
}

interface WeeklyGoalInput extends BaseGoalInput {
  type: "weekly";
  weekNumber: number;
  year: number;
}

interface MonthlyGoalInput extends BaseGoalInput {
  type: "monthly";
  month: number;
  year: number;
}

type GoalInput = DailyGoalInput | WeeklyGoalInput | MonthlyGoalInput;

export async function createGoal(input: GoalInput) {
  try {
    const goal = await db
      .insert(goals)
      .values({
        title: input.title,
        description: input.description ?? null,
        type: input.type,
        status: "not-started" as const,
        ...(input.type === "daily" && {
          date: input.date.toISOString(),
          weekNumber: null,
          month: null,
          year: null,
        }),
        ...(input.type === "weekly" && {
          date: null,
          weekNumber: input.weekNumber,
          year: input.year,
          month: null,
        }),
        ...(input.type === "monthly" && {
          date: null,
          weekNumber: null,
          month: input.month,
          year: input.year,
        }),
      })
      .returning();

    revalidatePath("/");
    return { success: true as const, data: goal[0] };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to create goal:", error.message);
    }
    return { success: false as const, error: "Failed to create goal" };
  }
}

export async function updateGoalStatus(id: number, status: GoalStatus) {
  try {
    const goal = await db
      .update(goals)
      .set({
        status,
        ...(status === "completed"
          ? { completedAt: new Date() }
          : { completedAt: null }),
      })
      .where(sql`${goals.id} = ${id}`)
      .returning();

    revalidatePath("/");
    return { success: true as const, data: goal[0] };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to update goal status:", error.message);
    }
    return { success: false as const, error: "Failed to update goal status" };
  }
}

export async function deleteGoal(id: number) {
  try {
    await db.delete(goals).where(sql`${goals.id} = ${id}`);
    revalidatePath("/");
    return { success: true as const };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to delete goal:", error.message);
    }
    return { success: false as const, error: "Failed to delete goal" };
  }
}
