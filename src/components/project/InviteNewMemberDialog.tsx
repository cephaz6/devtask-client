// src/components/project/InviteNewMemberDialog.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProjectInvitePayload } from "@/lib/api"; // Import ProjectInvitePayload
import { inviteProjectMember } from "@/lib/api"; // Import ProjectInvitePayload
import type { ProjectMember } from "@/types";

interface InviteNewMemberDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  projectId: string; // The ID of the project to invite to
  projectName: string; // The name of the project for display
}

const InviteNewMemberDialog: React.FC<InviteNewMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  projectName,
}) => {
  const queryClient = useQueryClient();
  const [userIdentifier, setUserIdentifier] = useState(""); // Can be email or user ID
  const [role, setRole] = useState<"member" | "owner">("member"); // Default role is 'member'

  // Reset form fields when dialog opens
  useEffect(() => {
    if (open) {
      setUserIdentifier("");
      setRole("member");
    }
  }, [open]);

  // The mutationFn now directly accepts the ProjectInvitePayload object
  const inviteMemberMutation = useMutation<
    ProjectMember,
    Error,
    ProjectInvitePayload // The mutation now expects the full payload object
  >({
    mutationFn: (payload) => inviteProjectMember(payload), // Pass the entire payload object
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectDetails", projectId],
      }); // Refetch project details to update member list
      onOpenChange(false); // Close dialog on success
      // Optionally, show a success toast here
    },
    onError: (error) => {
      console.error("Failed to invite member:", error);
      // Optionally, show an error toast here
      alert(`Failed to invite member: ${error.message}`); // TODO: Replace with custom dialog
    },
  });

  const handleSubmit = () => {
    if (!userIdentifier.trim()) {
      alert("Please enter a user ID or email to invite."); // TODO: Replace with custom dialog
      return;
    }

    // Construct the payload with the single user_identifier field
    const payload: ProjectInvitePayload = {
      project_id: projectId, // Always include projectId
      user_identifier: userIdentifier.trim(), // Send the trimmed identifier directly
      role: role,
    };

    inviteMemberMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Invite New Member to "{projectName}
            "
          </DialogTitle>
          <DialogDescription>
            Enter the user's ID or email to invite them to this project.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="userIdentifier">User ID or Email</Label>
            <Input
              id="userIdentifier"
              value={userIdentifier}
              onChange={(e) => setUserIdentifier(e.target.value)}
              placeholder="e.g., user@example.com or user_id_string"
              className="col-span-3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={(value: "member" | "owner") => setRole(value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={inviteMemberMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!userIdentifier.trim() || inviteMemberMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {inviteMemberMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Inviting...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" /> Invite Member
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteNewMemberDialog;
