// src/components/project/DeleteProjectDialog.tsx
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
import { Trash2 } from "lucide-react";
import type { Project } from "@/types";

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  project: Project; // The project data to confirm deletion
  onConfirm: () => void; // Function to call on confirmed deletion
  isDeleting: boolean; // Loading state from mutation
}

const DeleteProjectDialog: React.FC<DeleteProjectDialogProps> = ({
  open,
  onOpenChange,
  project,
  onConfirm,
  isDeleting,
}) => {
  const [confirmTitle, setConfirmTitle] = useState("");

  // Reset confirmTitle when dialog opens
  useEffect(() => {
    if (open) {
      setConfirmTitle("");
    }
  }, [open]);

  const handleDelete = () => {
    onConfirm();
  };

  const isConfirmButtonDisabled = confirmTitle !== project.title || isDeleting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            <Trash2 className="h-5 w-5" /> Delete Project
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. To confirm deletion, please type the
            project's title "<strong>{project.title}</strong>" in the box below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="confirmTitle">Project Title</Label>
            <Input
              id="confirmTitle"
              value={confirmTitle}
              onChange={(e) => setConfirmTitle(e.target.value)}
              placeholder={project.title}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isConfirmButtonDisabled}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProjectDialog;
