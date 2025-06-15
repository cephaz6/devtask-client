// src/components/project/EditProjectDialog.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import type { Project } from "@/types";

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  project: Project; // The project data to edit
  onSubmit: (updatedData: Partial<Project>) => void; // Function to call on submit
  isSubmitting: boolean; // Loading state from mutation
}

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  open,
  onOpenChange,
  project,
  onSubmit,
  isSubmitting,
}) => {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description || "");

  // Update local state when project prop changes (e.g., after successful update)
  useEffect(() => {
    setTitle(project.title);
    setDescription(project.description || "");
  }, [project]);

  const handleSubmit = () => {
    onSubmit({ title, description });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" /> Edit Project
          </DialogTitle>
          <DialogDescription>
            Update the title and description of your project.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 h-24 resize-none"
              placeholder="A brief description of your project..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            // disabled={!title.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
