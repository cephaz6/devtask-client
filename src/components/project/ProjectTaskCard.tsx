// src/components/project/ProjectTaskCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, GripVertical, Users, MessageSquare } from "lucide-react"; // Added Users and MessageSquare icons
import type { Task } from "@/types";
import { getStatusConfig } from "@/helpers/taskHelpers";

interface ProjectTaskCardProps {
  task: Task;
}

const ProjectTaskCard: React.FC<ProjectTaskCardProps> = ({ task }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`../tasks/${task.id}`); // Navigate to the existing single task page
  };

  const statusConfig = getStatusConfig(task.status);

  // Helper for priority color badge - more vibrant and direct
  const getPriorityColorClass = (
    priority: Task["priority"] | null | undefined
  ) => {
    switch (priority) {
      case "high":
        return "bg-red-700/50 text-red-200 border-red-600";
      case "medium":
        return "bg-yellow-700/50 text-yellow-200 border-yellow-600";
      case "low":
        return "bg-green-700/50 text-green-200 border-green-600";
      default:
        return "bg-gray-700/50 text-gray-200 border-gray-600";
    }
  };

  // Calculate progress percentage
  const actualTime =
    typeof task.actual_time === "number" ? task.actual_time : 0;
  const estimatedTime =
    typeof task.estimated_time === "number" ? task.estimated_time : 0;

  const progress =
    estimatedTime > 0
      ? Math.min(100, Math.round((actualTime / estimatedTime) * 100))
      : 0;

  const progressBarColor =
    progress < 50
      ? "bg-blue-500"
      : progress < 90
      ? "bg-orange-500"
      : "bg-green-500";

  // Get counts for display
  const assignedUsersCount = task.assignments?.length || 0;
  const commentsCount = task.comments?.length || 0;

  return (
    <Card
      className="bg-neutral-800 text-gray-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer
                 transform hover:-translate-y-0.5 hover:scale-[1.01] border border-neutral-700 relative group"
      onClick={handleCardClick}
    >
      <CardContent className="p-3 space-y-2">
        {/* Draggable Indicator - positioned to the right of the title area */}
        <div className="absolute top-2 right-2 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Task Title and Priority Badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-base leading-tight text-gray-50 flex-1 pr-6">
            {task.title}
          </h4>
          <Badge
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityColorClass(
              task.priority
            )}`}
          >
            {(task.priority ?? "Unknown").charAt(0).toUpperCase() +
              (task.priority ?? "Unknown").slice(1)}
          </Badge>
        </div>

        {/* Task Description (Very Short - line-clamp-1) */}
        {task.description && (
          <p className="text-xs text-gray-300 line-clamp-1">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag.id || tag.name}
                variant="outline"
                className="px-2 py-0.5 text-xs bg-neutral-700 text-gray-300 border-neutral-600"
              >
                <Tag className="h-3 w-3 mr-1 text-gray-400" />
                {tag.name}
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <span className="text-xs text-gray-400 ml-1">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-neutral-700 rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${progressBarColor}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Footer: Assigned Users Count, Comments Count, and Progress Level - all on one line */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-2 pt-2 border-t border-neutral-700">
          {/* Assigned Users Count */}
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-gray-500" />
            <span>{assignedUsersCount}</span>
          </div>

          {/* Comments Count */}
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3 text-gray-500" />
            <span>{commentsCount}</span>
          </div>

          {/* Progress Level Text */}
          <p className="text-xs text-gray-400">{progress}% Complete</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTaskCard;
