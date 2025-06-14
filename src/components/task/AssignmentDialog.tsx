// src/components/task/AssignmentDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Loader2, Users } from "lucide-react";
import { useState, useEffect, useMemo } from "react"; // Import useMemo
import { useQuery } from "@tanstack/react-query";
import { fetchProjectMembers } from "@/lib/api";
import { getUserInitials } from "@/helpers/taskHelpers";
import type { Task, User as AppUser } from "@/types";

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
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<Set<string>>(
    new Set()
  );

  // Get the ID of the task owner, defaulting to null for safety
  const taskOwnerId = task?.owner_id || null;

  // Fetch project members if a projectId is provided
  const {
    data: projectMembers,
    isLoading: isLoadingMembers,
    isError: isErrorMembers,
    error: membersError,
  } = useQuery<AppUser[], Error>({
    queryKey: ["projectMembers", currentProjectId],
    queryFn: () => fetchProjectMembers(currentProjectId!),
    enabled: !!currentProjectId && open,
    staleTime: 5 * 60 * 1000,
  });

  // Memoize the filtering of project members to exclude the task owner
  const selectableMembers = useMemo(() => {
    if (!projectMembers) {
      return []; // Return an empty array if projectMembers is not yet loaded
    }
    return projectMembers.filter((members) => members.user_id !== taskOwnerId);
  }, [projectMembers, taskOwnerId]); // Dependencies for useMemo

  // Effect to initialize selectedAssigneeIds when task or selectableMembers change
  useEffect(() => {
    if (task && task.assignments) {
      // Filter out assignments that are not actually in the selectable members list
      // (i.e., exclude owner if they were pre-assigned, or members not in the current project)
      const initialSelected = new Set(
        task.assignments
          .filter((assignment) =>
            selectableMembers.some(
              (members) => members.user_id === assignment.user_id
            )
          )
          .map((assignment) => assignment.user_id)
      );
      setSelectedAssigneeIds(initialSelected);
    } else {
      setSelectedAssigneeIds(new Set()); // Reset if no task or assignments
    }
  }, [task, selectableMembers]); // Depend on task and selectableMembers (now memoized)

  // Console logs for debugging (can be removed once functionality is confirmed)
  useEffect(() => {
    if (open && currentProjectId) {
      console.log(
        "AssignmentDialog: Fetching members for project ID:",
        currentProjectId
      );
      console.log(
        "AssignmentDialog: projectMembers data (raw from API):",
        projectMembers
      );
      console.log("AssignmentDialog: taskOwnerId:", taskOwnerId);
      console.log(
        "AssignmentDialog: selectableMembers data (filtered):",
        selectableMembers
      );
      if (isErrorMembers) {
        console.error(
          "AssignmentDialog: Error fetching project members:",
          membersError
        );
      }
    }
  }, [
    open,
    currentProjectId,
    projectMembers,
    taskOwnerId,
    selectableMembers,
    isErrorMembers,
    membersError,
  ]);

  // Handler for checkbox changes
  const handleCheckboxChange = (userId: string, isChecked: boolean) => {
    setSelectedAssigneeIds((prevSelected) => {
      const newSet = new Set(prevSelected);
      if (isChecked) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  };

  // Handler for form submission
  const handleSubmit = () => {
    onSubmit({ userIds: Array.from(selectedAssigneeIds) });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6" /> Manage Assignees
          </AlertDialogTitle>
          <AlertDialogDescription>
            {currentProjectId
              ? `Select project members to assign to "${task.title}". The task owner is automatically included.`
              : "This task is not associated with a project. Assignees can only be managed for tasks belonging to a project."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="min-h-[100px] max-h-[300px] overflow-y-auto pr-2">
          {currentProjectId ? (
            isLoadingMembers ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading members...</p>
              </div>
            ) : isErrorMembers ? (
              <div className="text-destructive text-center p-4">
                <p>Error loading project members: {membersError?.message}</p>
              </div>
            ) : selectableMembers && selectableMembers.length > 0 ? (
              <div className="space-y-3">
                {selectableMembers.map((members) => (
                  <div
                    key={members.user_id}
                    className="flex items-center gap-3"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-blue-500 text-white font-semibold">
                        {/* More robust initial display */}
                        {getUserInitials(members) ||
                          (members.user_id
                            ? members.user_id.slice(0, 2).toUpperCase()
                            : "??")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {/* Display full_name, fallback to email, then user_id for display */}
                        {members.full_name ||
                          members.email ||
                          `User ID: ${members.user_id}`}
                      </p>
                      {members.full_name && members.email && (
                        <p className="text-xs text-muted-foreground">
                          {members.email}
                        </p>
                      )}
                    </div>
                    <Checkbox
                      checked={selectedAssigneeIds.has(members.user_id)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(members.user_id, !!checked)
                      }
                      id={`checkbox-${members.user_id}`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-center p-4">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No other members found for this project to assign.</p>
              </div>
            )
          ) : (
            <div className="text-muted-foreground text-center p-4">
              <p>
                Please associate this task with a project to manage assignees.
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !currentProjectId ||
              selectableMembers.length === 0
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Assignments"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AssignmentDialog;
