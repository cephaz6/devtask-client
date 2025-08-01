// src/components/project/ViewProjectMembersDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Crown, UserRoundCheck } from "lucide-react";
import type { Project } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserInitials } from "@/helpers/taskHelpers"; // Reusing existing helper

interface ViewProjectMembersDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  project: Project; // The project data, including members
}

const ViewProjectMembersDialog: React.FC<ViewProjectMembersDialogProps> = ({
  open,
  onOpenChange,
  project,
}) => {
  const projectMembers = project.members || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Project Members
          </DialogTitle>
          <DialogDescription>
            Viewing members of "{project.title}". This list is read-only.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          {projectMembers.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No members in this project.
            </p>
          ) : (
            <div className="space-y-3">
              {projectMembers.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between p-3 bg-neutral-800 rounded-md border border-neutral-700"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-purple-600 text-white">
                        {getUserInitials(member.user) || (
                          <UserRoundCheck className="h-5 w-5" />
                        )}{" "}
                        {/* Use UserRoundCheck for default icon if no initials */}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-50">
                        {member.user?.full_name ||
                          member.user?.email ||
                          `User ID: ${member.user_id.slice(-6)}`}
                        {project.owner_id === member.user_id && (
                          <Crown className="inline-block h-4 w-4 ml-2 text-yellow-400">
                            <title>Project Owner</title>
                          </Crown>
                        )}
                      </p>
                      <p className="text-sm text-gray-400">
                        {member.role.charAt(0).toUpperCase() +
                          member.role.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

export default ViewProjectMembersDialog;
