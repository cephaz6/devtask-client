// src/components/project/ProjectTaskCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Keeping Badge for tags for now
import { Tag, GripVertical, Users, MessageSquare } from "lucide-react";
import type { Task } from "@/types";

interface ProjectTaskCardProps {
  task: Task;
}

const ProjectTaskCard: React.FC<ProjectTaskCardProps> = ({ task }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`../tasks/${task.id}`);
  };

  // Helper for priority-based background class
  const getPriorityBgClass = (
    priority: Task["priority"] | null | undefined
  ) => {
    switch (priority) {
      case "high":
        return "bg-red-900/40 border-red-800"; // Darker, more prominent red
      case "medium":
        return "bg-yellow-900/40 border-yellow-800"; // Darker yellow
      case "low":
        return "bg-green-900/40 border-green-800"; // Darker green
      default:
        return "bg-neutral-800 border-neutral-700"; // Default dark background
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
      // Apply the priority background and border directly to the card
      className={`rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer
                 transform hover:-translate-y-0.5 hover:scale-[1.01] relative group
                 ${getPriorityBgClass(task.priority)}`} // Apply priority background here
      onClick={handleCardClick}
    >
      <CardContent className="p-3 space-y-2">
        {/* Draggable Indicator - positioned to the right of the title area */}
        <div className="absolute top-2 right-2 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Task Title (smaller font) */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-sm leading-tight text-gray-50 flex-1 pr-6">
            {" "}
            {/* Changed text-base to text-sm */}
            {task.title}
          </h4>
          {/* Removed Priority Badge - priority is now indicated by card background */}
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
