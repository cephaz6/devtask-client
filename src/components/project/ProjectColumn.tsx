// src/components/project/ProjectColumn.tsx
import React, { useState, useMemo } from "react";
import type { Task } from "@/types";
import ProjectTaskCard from "./ProjectTaskCard";
import { Plus, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectColumnProps {
  title: string;
  tasks: Task[];
  status: Task["status"];
  onAddTask?: (status: Task["status"]) => void;
}

const ProjectColumn: React.FC<ProjectColumnProps> = ({
  title,
  tasks,
  status,
  onAddTask,
}) => {
  const [sortBy, setSortBy] = useState<"created_at" | "due_date" | "priority">(
    "created_at"
  );

  // Memoize sorted tasks to prevent re-sorting on every render
  const sortedTasks = useMemo(() => {
    const sortableTasks = [...tasks];

    return sortableTasks.sort((a, b) => {
      if (sortBy === "created_at") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sortBy === "due_date") {
        const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        return dateA - dateB;
      } else if (sortBy === "priority") {
        const priorityOrder: Record<Task["priority"], number> = {
          high: 3,
          medium: 2,
          low: 1,
        };
        const priorityA = priorityOrder[a.priority] || 0;
        const priorityB = priorityOrder[b.priority] || 0;
        return priorityB - priorityA;
      }
      return 0;
    });
  }, [tasks, sortBy]);

  return (
    // Column container: flex-col to stack header and tasks.
    // `w-[300px]` maintains a consistent width for columns in the masonry layout.
    // `min-h-[150px]` ensures it has a base height.
    // No `h-full` here, as the height should be determined by content for masonry.
    <div className="flex flex-col bg-neutral-900 rounded-lg p-4 shadow-xl min-w-[280px] w-[300px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-700">
        <h3 className="text-lg font-semibold text-gray-50">
          {title} ({tasks.length})
        </h3>
        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(value: "created_at" | "due_date" | "priority") =>
              setSortBy(value)
            }
          >
            <SelectTrigger className="w-fit h-7 text-xs bg-neutral-800 border-neutral-700 text-gray-400">
              <SortAsc className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 text-gray-50 border-neutral-700">
              <SelectItem value="created_at" className="text-xs">
                Date Created
              </SelectItem>
              <SelectItem value="due_date" className="text-xs">
                Due Date
              </SelectItem>
              <SelectItem value="priority" className="text-xs">
                Priority
              </SelectItem>
            </SelectContent>
          </Select>
          {onAddTask && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddTask(status)}
              className="text-gray-400 hover:text-blue-400 h-7 w-7 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Task List - vertical scroll for tasks within the column */}
      {/* `flex-1` ensures this div takes all available vertical space in the column */}
      {/* `overflow-y-auto` enables vertical scrolling for tasks if they overflow */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No tasks in this column.
          </p>
        ) : (
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <ProjectTaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectColumn;
