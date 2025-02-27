"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Circle, Clock, MoreHorizontal } from "lucide-react";
import { Goal, GoalStatus } from "~/types";
import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";

interface GoalCardProps {
  goal: Goal;
  onStatusChange?: (id: string, status: GoalStatus) => void;
}

export function GoalCard({ goal, onStatusChange }: GoalCardProps) {
  // Track the previous non-completed status
  const [prevStatus, setPrevStatus] = useState<GoalStatus>(
    goal.status === "completed" ? "in-progress" : goal.status,
  );

  // Update prevStatus when goal changes
  useEffect(() => {
    if (goal.status !== "completed") {
      setPrevStatus(goal.status);
    }
  }, [goal.status]);

  const statusIcons = {
    completed: <CheckCircle className="h-5 w-5 text-green-500" />,
    "in-progress": <Clock className="h-5 w-5 text-amber-500" />,
    "not-started": <Circle className="h-5 w-5 text-gray-400" />,
  };

  const statusClasses = {
    completed: "border-green-200 bg-green-50",
    "in-progress": "border-amber-200 bg-amber-50",
    "not-started": "border-gray-200 bg-gray-50",
  };

  const statusColors = {
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
    "in-progress": "bg-amber-100 text-amber-800 hover:bg-amber-200",
    "not-started": "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };

  // Checkbox only controls completed state
  const handleCheckboxChange = (checked: boolean) => {
    if (!onStatusChange) return;

    if (checked) {
      // If checking, mark as completed
      onStatusChange(goal.id, "completed");
    } else {
      // If unchecking, revert to the previous non-completed status
      onStatusChange(goal.id, prevStatus);
    }
  };

  const handleStatusChange = (status: GoalStatus) => {
    if (!onStatusChange) return;
    onStatusChange(goal.id, status);
  };

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        statusClasses[goal.status],
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={goal.status === "completed"}
              onCheckedChange={handleCheckboxChange}
              aria-label={
                goal.status === "completed"
                  ? "Mark as incomplete"
                  : "Mark as complete"
              }
            />
            <CardTitle className="text-lg font-semibold">
              {goal.title}
            </CardTitle>
          </div>
          <Badge
            className={cn("cursor-pointer", statusColors[goal.status])}
            onClick={() => {
              // Cycle through statuses on badge click
              const nextStatus: Record<GoalStatus, GoalStatus> = {
                "not-started": "in-progress",
                "in-progress": "completed",
                completed: "not-started",
              };
              handleStatusChange(nextStatus[goal.status]);
            }}
          >
            <span className="mr-1">{statusIcons[goal.status]}</span>
            <span className="capitalize">{goal.status.replace("-", " ")}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {goal.description && (
          <p className="text-sm text-gray-600">{goal.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
