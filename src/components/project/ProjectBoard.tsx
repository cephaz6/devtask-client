// src/components/project/ProjectBoard.tsx
import React from "react";
import type { Task } from "@/types";
import ProjectColumn from "./ProjectColumn"; // Import the ProjectColumn component

interface ProjectBoardProps {
  tasks: Task[]; // All tasks for the current project
  onAddTask?: (status: Task["status"]) => void; // Callback to add a new task, passed to columns
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ tasks, onAddTask }) => {
  // Define the order and display names for your Kanban columns
  const columnStatuses: Array<{ key: Task["status"]; title: string }> = [
    { key: "not_started", title: "To Do" },
    // { key: "pending", title: "Pending" },
    { key: "in_progress", title: "In Progress" },
    // { key: "on_hold", title: "On Hold" },
    { key: "completed", title: "Completed" },
    { key: "cancelled", title: "Cancelled" },
  ];

  // Group tasks by their status
  const groupedTasks = tasks.reduce((acc, task) => {
    const statusKey = columnStatuses.some((col) => col.key === task.status)
      ? task.status
      : "not_started";
    if (!acc[statusKey]) {
      acc[statusKey] = [];
    }
    acc[statusKey].push(task);
    return acc;
  }, {} as Record<Task["status"], Task[]>);

  return (
    // This container correctly uses CSS Columns for a masonry layout.
    // `columns-1 sm:columns-2 lg:columns-3 xl:columns-3 2xl:columns-4` ensures responsive column count.
    // `gap-6` provides spacing between columns and rows.
    // The columns will wrap naturally, and the parent ProjectPage's overflow-y-auto will handle scrolling.
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-3 2xl:columns-4 gap-6">
      {columnStatuses.map((column) => (
        // Each column is wrapped in a div that prevents it from breaking across columns
        // and adds vertical spacing (mb-6) between columns when they wrap onto new "rows".
        // This is crucial for the masonry effect with proper vertical spacing.
        <div key={column.key} className="mb-6 break-inside-avoid-column">
          <ProjectColumn
            title={column.title}
            status={column.key}
            tasks={groupedTasks[column.key] || []} // Pass tasks relevant to this column
            onAddTask={onAddTask}
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectBoard;
