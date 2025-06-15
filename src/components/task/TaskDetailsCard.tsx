// src/components/task/TaskDetailsCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  TrendingUp,
  Timer,
  FileText, // Keep FileText for description icon
} from "lucide-react"; // Removed Flame, Zap, Target, CheckCircle2, Clock, Circle as icons are now from getStatusConfig.icon
import {
  getProgressFromStatus,
  getPriorityConfig,
  getStatusConfig,
  getUserInitials, // Explicitly import getUserInitials
} from "@/helpers/taskHelpers";
import type { Task, User } from "@/types";

interface TaskDetailsCardProps {
  task: Task;
}

const TaskDetailsCard: React.FC<TaskDetailsCardProps> = ({ task }) => {
  const progress = getProgressFromStatus(task.status);
  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);

  // Helper for getting priority Lucide icon - using a direct return from the config
  const getPriorityLucideIcon = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return <TrendingUp className="w-3 h-3 text-red-500" />; // Using TrendingUp for high priority
      case "medium":
        return <TrendingUp className="w-3 h-3 text-yellow-500" />; // Using TrendingUp for medium priority
      case "low":
        return <TrendingUp className="w-3 h-3 text-green-500" />; // Using TrendingUp for low priority
      default:
        return <TrendingUp className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <Card className="border border-border/50 bg-card shadow-sm">
      <CardContent className="p-4 space-y-3">
        {/* Compact Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Progress */}
          <div className="p-3 rounded-md border border-border/30 bg-background/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-medium text-muted-foreground">
                  Progress
                </span>
              </div>
              <span className="text-sm font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Time Tracking */}
          <div className="p-3 rounded-md border border-border/30 bg-background/50 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Timer className="w-3 h-3 text-purple-500" />
                <span className="text-xs font-medium text-muted-foreground">
                  Time
                </span>
              </div>
            </div>
            <div className="text-sm font-bold">
              {task.actual_time || 0}h
              <span className="text-xs font-normal text-muted-foreground ml-1">
                / {task.estimated_time || 0}h
              </span>
            </div>
          </div>
        </div>

        {/* Priority & Status Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Priority */}
          <div className="p-2.5 rounded-md border border-border/30 bg-background/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {getPriorityLucideIcon(task.priority)} {/* Using Lucide Icon */}
                <span className="text-xs font-medium text-muted-foreground">
                  Priority
                </span>
              </div>
              <Badge
                variant={
                  priorityConfig.variant as
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline"
                }
                className="text-xs px-2 py-0.5 h-5"
              >
                {priorityConfig.text}
              </Badge>
            </div>
          </div>

          {/* Status */}
          <div className="p-2.5 rounded-md border border-border/30 bg-background/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {/* Use the emoji/icon from getStatusConfig directly */}
                <span className="text-base leading-none">
                  {statusConfig.icon}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Status
                </span>
              </div>
              <Badge
                variant={
                  statusConfig.variant as
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline"
                }
                className={`text-xs px-2 py-0.5 h-5 ${statusConfig.className}`}
              >
                {statusConfig.text}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description & Creator */}
        <div className="grid grid-cols-5 gap-3">
          {/* Description - 80% width (4/5 columns) */}
          <div className="col-span-4 p-3 rounded-md border border-border/30 bg-background/50 shadow-sm">
            <div className="flex items-start gap-2">
              <FileText className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Description
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {task.description || "No description provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Creator - 20% width (1/5 columns) */}
          <div className="col-span-1 p-3 rounded-md border border-border/30 bg-background/50 shadow-sm flex flex-col items-center justify-center">
            <Avatar className="w-8 h-8 mb-2">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                {getUserInitials(task.owner)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground mb-0.5">
                {/* Creator */}
              </p>
              <p className="text-xs text-foreground font-medium leading-tight line-clamp-1">
                {task.owner?.full_name ||
                  task.owner?.email?.split("@")[0] ||
                  "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskDetailsCard;
