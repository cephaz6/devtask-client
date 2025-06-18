// src/components/task/AssignmentDialog.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, UserPlus, Users, Frown, Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectMembers } from "@/lib/api";
import { getUserInitials } from "@/helpers/taskHelpers";
import type { Task, ProjectMember } from "@/types";

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  currentProjectId?: string | null;
  onSubmit: (data: { taskId: string; userIds: string[] }) => void;
  isSubmitting?: boolean;
}

const AssignmentDialog: React.FC<AssignmentDialogProps> = ({
  open,
  onOpenChange,
  task,
  currentProjectId,
  onSubmit,
  isSubmitting = false,
}) => {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set()
  );

  const taskOwnerId = task?.user_id ?? null;

  const {
    data: rawProjectMembers,
    isLoading: isLoadingMembers,
    isError: isErrorMembers,
    error: membersError,
  } = useQuery<ProjectMember[], Error>({
    queryKey: ["projectMembers", currentProjectId],
    queryFn: () => fetchProjectMembers(currentProjectId!),
    enabled: !!currentProjectId && open,
    staleTime: 5 * 60 * 1000,
  });

  const assignableMembers = useMemo(() => {
    if (!rawProjectMembers) return [];
    return rawProjectMembers.filter((member) => member.user_id !== taskOwnerId);
  }, [rawProjectMembers, taskOwnerId]);
  // console.log(assignableMembers.user);
  useEffect(() => {
    if (open && task?.assignments) {
      const newSet = new Set<string>();
      task.assignments.forEach((assignment) => {
        if (assignment.user_id !== taskOwnerId) {
          newSet.add(assignment.user_id);
        }
      });
      setSelectedUserIds(newSet);
    } else if (!open) {
      setSelectedUserIds(new Set());
    }
  }, [open, task.assignments, taskOwnerId]);

  const handleAssignToggle = (userId: string) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    onSubmit({ taskId: task.id, userIds: Array.from(selectedUserIds) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Manage Task Assignees
          </DialogTitle>
          <DialogDescription>
            {currentProjectId
              ? `Select project members to assign to "${task.title}". The task owner is always included.`
              : "This task is not associated with a project. Assignment management is disabled."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {!currentProjectId ? (
            <p className="text-center text-gray-500 py-4">
              Task is not linked to a project.
            </p>
          ) : isLoadingMembers ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-muted-foreground mt-2">
                Loading project members...
              </p>
            </div>
          ) : isErrorMembers ? (
            <div className="text-center text-destructive py-8">
              <Frown className="h-8 w-8 mx-auto mb-2" />
              <p>Error loading members: {membersError?.message}</p>
              <p className="text-sm text-muted-foreground">
                Please check project access.
              </p>
            </div>
          ) : (
            <>
              {task.owner && (
                <div className="flex items-center justify-between p-3 bg-neutral-700 rounded-md border border-neutral-600">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
                        {getUserInitials(task.owner)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-50 flex items-center">
                        {task.owner.full_name || task.owner.email}
                      </p>
                      <p className="text-sm text-gray-400">
                        <span className="text-yellow-400 text-sm">Owner</span>
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="opacity-50 cursor-not-allowed"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Assigned
                  </Button>
                </div>
              )}

              {assignableMembers.length > 0 ? (
                assignableMembers.map((member: any) => {
                  const isAssigned = selectedUserIds.has(member.user_id);
                  const displayName =
                    member.user?.full_name ||
                    member.user?.email ||
                    member.user_id;

                  return (
                    <div
                      key={member.user_id}
                      className="flex items-center justify-between p-3 bg-neutral-800 rounded-md border border-neutral-700"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                            {getUserInitials(member.user?.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-gray-50">
                            {displayName}
                          </p>
                          <p className="text-sm text-gray-400">{member.role}</p>
                        </div>
                      </div>
                      <Button
                        variant={isAssigned ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleAssignToggle(member.user_id)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isAssigned ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Assign
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-muted-foreground text-center p-4">
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No other members available for assignment.</p>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Assignments"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDialog;
