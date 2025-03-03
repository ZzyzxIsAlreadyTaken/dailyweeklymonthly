import { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { AddGoalDialog } from "./AddGoalDialog";
import type { GoalType } from "~/server/actions/goals";

export function AddGoalButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<GoalType>("daily");

  return (
    <>
      <div className="fixed bottom-4 right-4">
        <Button
          onClick={() => setIsDialogOpen(true)}
          variant="default"
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Goal</span>
        </Button>
      </div>

      <AddGoalDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        type={selectedType}
        onTypeChange={setSelectedType}
      />
    </>
  );
}
