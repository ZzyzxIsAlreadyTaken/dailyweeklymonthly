import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { AddGoalForm } from "./AddGoalForm";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import type { GoalType } from "../../server/actions/goals";

interface AddGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: GoalType;
  onTypeChange: (type: GoalType) => void;
}

export function AddGoalDialog({
  isOpen,
  onClose,
  type,
  onTypeChange,
}: AddGoalDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <RadioGroup
            value={type}
            onValueChange={(value: string) => onTypeChange(value as GoalType)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Daily</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">Weekly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly</Label>
            </div>
          </RadioGroup>
        </div>

        <AddGoalForm type={type} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
