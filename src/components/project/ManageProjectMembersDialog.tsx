// src/components/project/ManageProjectMembersDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Trash2, Crown, Loader2 } from "lucide-react";
import type { Project, ProjectMember } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeProjectMember, updateProjectMemberRole } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserInitials } from "@/helpers/taskHelpers"; // Reusing existing helper
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface ManageProjectMembersDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  project: Project; // The project data, including members
  isOwner: boolean; // Flag to determine if current user is owner
  onInviteNewMember: () => void; // Callback to open the invite dialog
  currentUserId: string; // The ID of the currently authenticated user
}

const ManageProjectMembersDialog: React.FC<ManageProjectMembersDialogProps> = ({
  open,
  onOpenChange,
  project,
  isOwner,
  onInviteNewMember,
  currentUserId,
}) => {
  const queryClient = useQueryClient();

  // Mutation for removing a member
  const removeMemberMutation = useMutation<void, Error, { userId: string }>({
    mutationFn: ({ userId }) => removeProjectMember(project.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectDetails", project.id],
      });
      // Optionally, show a success toast
    },
    onError: (error) => {
      console.error("Failed to remove member:", error);
      // Optionally, show an error toast
    },
  });

  // Mutation for updating member role
  const updateRoleMutation = useMutation<
    ProjectMember,
    Error,
    { userId: string; role: "owner" | "member" }
  >({
    mutationFn: ({ userId, role }) =>
      updateProjectMemberRole(project.id, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectDetails", project.id],
      });
      // Optionally, show a success toast
    },
    onError: (error) => {
      console.error("Failed to update role:", error);
      // Optionally, show an error toast
    },
  });

  const handleRemoveMember = (userId: string) => {
    // Implement a confirmation before actual removal
    if (window.confirm("Are you sure you want to remove this member?")) {
      // TODO: Replace with custom dialog
      removeMemberMutation.mutate({ userId });
    }
  };

  const handleRoleChange = (userId: string, newRole: "owner" | "member") => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Manage Project Members
          </DialogTitle>
          <DialogDescription>
            View and manage members of "{project.title}".
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <Button
            onClick={() => {
              onOpenChange(false); // Close current dialog
              onInviteNewMember(); // Open invite dialog
            }}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4 mr-2" /> Add New Member
          </Button>

          <Separator />

          <h4 className="text-lg font-semibold text-gray-50">
            Current Members ({project.members?.length || 0})
          </h4>
          {project.members && project.members.length > 0 ? (
            <div className="space-y-3">
              {project.members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between p-3 bg-neutral-800 rounded-md border border-neutral-700"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-purple-600 text-white">
                        {getUserInitials(member.user) || (
                          <Users className="h-5 w-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-50">
                        {member.user?.full_name ||
                          member.user?.email ||
                          `User ID: ${member.user_id.slice(-6)}`}
                        {project.owner_id === member.user_id && (
                          <Crown
                            className="inline-block h-4 w-4 ml-2 text-yellow-400"
                            title="Project Owner"
                          />
                        )}
                      </p>
                      <p className="text-sm text-gray-400">
                        {member.role.charAt(0).toUpperCase() +
                          member.role.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Role Change Select (only for owner, and not for self if changing own role) */}
                    {isOwner && project.owner_id !== member.user_id && (
                      <Select
                        value={member.role}
                        onValueChange={(newRole: "owner" | "member") =>
                          handleRoleChange(member.user_id, newRole)
                        }
                        disabled={
                          updateRoleMutation.isPending &&
                          updateRoleMutation.variables?.userId ===
                            member.user_id
                        }
                      >
                        <SelectTrigger className="w-[120px] bg-neutral-700 border-neutral-600 text-gray-200">
                          <SelectValue placeholder="Change Role" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-800 text-gray-50 border-neutral-700">
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    {/* Remove Button (only for owner, and not for self) */}
                    {isOwner && currentUserId !== member.user_id && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveMember(member.user_id)}
                        disabled={
                          removeMemberMutation.isPending &&
                          removeMemberMutation.variables?.userId ===
                            member.user_id
                        }
                      >
                        {removeMemberMutation.isPending &&
                        removeMemberMutation.variables?.userId ===
                          member.user_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              No members yet. Invite someone!
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageProjectMembersDialog;
