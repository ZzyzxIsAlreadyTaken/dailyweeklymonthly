"use client";

import { useState, useEffect } from "react";
import { GoalCard } from "./GoalCard";
import { Goal, GoalStatus } from "~/types";

interface GoalListProps {
  goals: Goal[];
  title: string;
  onStatusChange?: (id: string, status: GoalStatus) => void;
  emptyMessage?: string;
}

export function GoalList({
  goals,
  title,
  onStatusChange,
  emptyMessage = "No goals found.",
}: GoalListProps) {
  const [localGoals, setLocalGoals] = useState<Goal[]>([]);

  // Update local goals when props change
  useEffect(() => {
    setLocalGoals(goals);
  }, [goals]);

  const handleStatusChange = (id: string, status: GoalStatus) => {
    setLocalGoals((prevGoals) =>
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

    // Call the parent handler if provided
    if (onStatusChange) {
      onStatusChange(id, status);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      {localGoals.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {localGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      )}
    </div>
  );
}
