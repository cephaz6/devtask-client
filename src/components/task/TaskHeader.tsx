// src/components/tasks/TaskHeader.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { getStatusConfig } from "@/helpers/taskHelpers";
import type { Task } from "@/types"; // Import Task type

interface TaskHeaderProps {
  task: Task;
  isOwner: boolean;
  onGoBack: () => void;
  onEdit?: () => void; // Optional handler for edit action
  onDelete?: () => void; // Optional handler for delete action
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  task,
  isOwner,
  onGoBack,
  onEdit,
  onDelete,
}) => {
  const statusConfig = getStatusConfig(task.status);

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="text-2xl">{statusConfig.icon}</div>
              <div>
                <h1 className="text-2xl font-bold">{task.title}</h1>
                <p className="text-sm text-muted-foreground">
                  #{task.id?.toString().slice(-8) || "Unknown"}
                </p>
              </div>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              {onEdit && ( // Only show button if onEdit handler is provided
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {onDelete && ( // Only show button if onDelete handler is provided
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;
