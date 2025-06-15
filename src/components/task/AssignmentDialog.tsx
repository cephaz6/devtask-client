// src/components/task/AssignmentDialog.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog, // Use Dialog instead of AlertDialog for more flexibility with custom buttons
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Ensure you import Dialog components
import { Button } from "@/components/ui/button"; // Explicitly import Button
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, UserPlus, Users, Frown, Check, X } from "lucide-react"; // Added Check and X for button icons
import { useQuery } from "@tanstack/react-query";
import { fetchProjectMembers } from "@/lib/api";
import { getUserInitials } from "@/helpers/taskHelpers";
import type { Task, ProjectMember } from "@/types"; // Import ProjectMember from types

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task; // The task whose assignments are being managed
  currentProjectId?: string | null; // The ID of the project the task belongs to
  onSubmit: (assignmentData: { userIds: string[] }) => void;
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
  // State to hold currently selected assignees for the dialog
  // This Set will contain the user_ids of all users who *will be* assigned after saving.
  const [currentSelectedAssigneeIds, setCurrentSelectedAssigneeIds] = useState<
    Set<string>
  >(new Set());

  // Get the ID of the task owner. This user should NOT be toggleable in the list.
  const taskOwnerId = task?.owner_id || null;

  // Fetch project members if a projectId is provided and the dialog is open
  const {
    data: rawProjectMembers, // Renamed to avoid confusion with filtered list
    isLoading: isLoadingMembers,
    isError: isErrorMembers,
    error: membersError,
  } = useQuery<ProjectMember[], Error>({
    queryKey: ["projectMembers", currentProjectId],
    queryFn: () => fetchProjectMembers(currentProjectId!),
    enabled: !!currentProjectId && open,
    staleTime: 5 * 60 * 1000,
  });

  // Filter project members to exclude the task owner, as per requirement description
  // and type them correctly as ProjectMember[]
  const selectableMembers: ProjectMember[] = useMemo(() => {
    if (!rawProjectMembers) {
      return [];
    }
    // Filter out the task owner from the list of selectable members if they exist
    return rawProjectMembers.filter((member) => member.user_id !== taskOwnerId);
  }, [rawProjectMembers, taskOwnerId]);

  // Effect to initialize `currentSelectedAssigneeIds` when the dialog opens or task/members change
  useEffect(() => {
    if (open && task?.assignments) {
      const initialAssigned: Set<string> = new Set();
      // Add existing task assignments (that are NOT the owner) to the set
      task.assignments.forEach((assignment) => {
        if (assignment.user_id !== taskOwnerId) {
          initialAssigned.add(assignment.user_id);
        }
      });
      setCurrentSelectedAssigneeIds(initialAssigned);
    } else if (!open) {
      // Reset state when dialog closes
      setCurrentSelectedAssigneeIds(new Set());
    }
  }, [open, task, taskOwnerId]); // Depend on task and taskOwnerId to re-initialize

  // Handler for "Assign" / "Remove" button clicks
  const handleAssignToggle = (userId: string, isCurrentlyAssigned: boolean) => {
    setCurrentSelectedAssigneeIds((prevSelected) => {
      const newSet = new Set(prevSelected);
      if (isCurrentlyAssigned) {
        newSet.delete(userId); // If currently assigned, remove them
      } else {
        newSet.add(userId); // If not assigned, add them
      }
      return newSet;
    });
  };

  // Handler for form submission
  const handleSubmit = () => {
    // The list of user IDs to send to the backend.
    // It should include the owner_id if the backend expects it every time,
    // plus all explicitly selected assignees.
    // Based on the dialog description "The task owner is automatically included.",
    // we send *only* the explicitly managed assignments. The backend should handle the owner implicitly.
    onSubmit({ userIds: Array.from(currentSelectedAssigneeIds) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6" /> Manage Assignees
          </DialogTitle>
          <DialogDescription>
            {currentProjectId
              ? `Select project members to assign to "${task.title}". The task owner is automatically included and cannot be removed here.`
              : "This task is not associated with a project. Assignees can only be managed for tasks belonging to a project."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {!currentProjectId ? (
            <p className="text-center text-gray-500 py-4">
              This task is not associated with any project. Assignees can only
              be managed for project tasks.
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
              <p>Error loading project members: {membersError?.message}</p>
              <p className="text-sm text-muted-foreground">
                Ensure the task's project exists and you have access.
              </p>
            </div>
          ) : selectableMembers && selectableMembers.length > 0 ? (
            <div className="space-y-3">
              {selectableMembers.map((member) => {
                const isAssigned = currentSelectedAssigneeIds.has(
                  member.user_id
                );
                // getMemberDisplayName and getUserInitials should correctly handle ProjectMember's nested user object
                // member.user is of type User, so pass member.user to getUserInitials
                // For name display, check member.user first, then fallback to ProjectMember fields if User is not nested
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
                          {getUserInitials(member.user)}{" "}
                          {/* Pass the nested User object */}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-50">
                          {displayName}
                        </p>
                        <p className="text-sm text-gray-400">{member.role}</p>
                      </div>
                    </div>
                    {/* Assign/Remove Button */}
                    <Button
                      variant={isAssigned ? "destructive" : "default"}
                      size="sm"
                      onClick={() =>
                        handleAssignToggle(member.user_id, isAssigned)
                      }
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm rounded-md"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isAssigned ? (
                        <>
                          <X className="h-4 w-4 mr-2" /> Remove
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" /> Assign
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground text-center p-4">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No other members found for this project to assign.</p>
            </div>
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
