// src/components/project/ProjectBoard.tsx
import React from "react";
import type { Task } from "@/types";
import ProjectColumn from "./ProjectColumn";

interface ProjectBoardProps {
  tasks: Task[];
  onAddTask?: (status: Task["status"]) => void;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ tasks, onAddTask }) => {
  const columnStatuses: Array<{ key: Task["status"]; title: string }> = [
    { key: "not_started", title: "To Do" },
    { key: "pending", title: "Pending" },
    { key: "in_progress", title: "In Progress" },
    { key: "on_hold", title: "On Hold" },
    { key: "completed", title: "Completed" },
    { key: "cancelled", title: "Cancelled" },
  ];

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
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-6">
      {columnStatuses.map((column) => (
        <div key={column.key} className="mb-6 break-inside-avoid-column">
          <ProjectColumn
            title={column.title}
            status={column.key}
            tasks={groupedTasks[column.key] || []}
            onAddTask={onAddTask}
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectBoard;
