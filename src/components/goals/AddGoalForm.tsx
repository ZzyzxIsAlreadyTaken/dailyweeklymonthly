import { useState } from "react";
import { createGoal, type GoalType } from "../../server/actions/goals";
import { getWeekNumber, getWeekRange } from "~/lib/date-utils";

interface AddGoalFormProps {
  type: GoalType;
  onSuccess?: () => void;
}

export function AddGoalForm({ type, onSuccess }: AddGoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weekStart, setWeekStart] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const baseInput = {
      title,
      description,
      type,
    };

    let input;
    switch (type) {
      case "daily":
        input = {
          ...baseInput,
          type: "daily" as const,
          date: date ? new Date(date) : new Date(),
        };
        break;
      case "weekly":
        const weekDate = new Date(weekStart!);
        input = {
          ...baseInput,
          type: "weekly" as const,
          weekNumber: getWeekNumber(weekDate),
          year: weekDate.getFullYear(),
        };
        break;
      case "monthly":
        input = {
          ...baseInput,
          type: "monthly" as const,
          month,
          year,
        };
        break;
    }

    const result = await createGoal(input);
    if (result.success) {
      setTitle("");
      setDescription("");
      onSuccess?.();
    }
  }

  // Calculate week range for display
  const weekRange =
    type === "weekly" ? getWeekRange(new Date(weekStart!)) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {type === "daily" && (
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      )}

      {type === "weekly" && (
        <div>
          <label
            htmlFor="weekStart"
            className="block text-sm font-medium text-gray-700"
          >
            Week Starting
          </label>
          <input
            type="date"
            id="weekStart"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          {weekRange && (
            <p className="mt-1 text-sm text-gray-500">
              Week {getWeekNumber(new Date(weekStart!))}:{" "}
              {weekRange.start.toLocaleDateString()} -{" "}
              {weekRange.end.toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {type === "monthly" && (
        <>
          <div>
            <label
              htmlFor="month"
              className="block text-sm font-medium text-gray-700"
            >
              Month
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="yearMonthly"
              className="block text-sm font-medium text-gray-700"
            >
              Year
            </label>
            <input
              type="number"
              id="yearMonthly"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </>
      )}

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Goal
      </button>
    </form>
  );
}
