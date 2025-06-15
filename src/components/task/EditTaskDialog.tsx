// src/components/EditTaskDialog.tsx
import { useState, useEffect, type KeyboardEvent } from "react";
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
import { Calendar as CalendarIcon, Tag, X, Plus } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Task, TaskUpdatePayload } from "@/types"; // Import TaskUpdatePayload

// Aligned status options to match backend TaskStatus enum exactly
const statusOptions = [
  { value: "not_started", label: "Not Started", icon: "📄" },
  { value: "pending", label: "Pending", icon: "⏳" },
  { value: "in_progress", label: "In Progress", icon: "🔄" },
  { value: "on_hold", label: "On Hold", icon: "⏸️" },
  { value: "completed", label: "Completed", icon: "✅" },
  { value: "cancelled", label: "Cancelled", icon: "❌" },
];

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  task: Task;
  onSubmit: (updatedTask: TaskUpdatePayload) => void; // Changed to TaskUpdatePayload
  isSubmitting?: boolean;
  isOwner: boolean; // To control due date editing
}

const EditTaskDialog = ({
  open,
  onOpenChange,
  task,
  onSubmit,
  isSubmitting = false,
  isOwner,
}: EditTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("not_started"); // Explicitly type status
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Initialize form with task data when dialog opens
  useEffect(() => {
    if (open && task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "not_started");
      setDueDate(task.due_date ? new Date(task.due_date) : undefined);
      // Ensure tags are initialized as string[] from Task.tags: Tag[]
      setTags(task.tags?.map((tag) => tag.name) || []);
      setTagInput("");
    }
  }, [open, task]);

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async () => {
    const updatedData: TaskUpdatePayload = {
      // Now explicitly typed as TaskUpdatePayload
      title,
      description,
      status, // This is type-checked against TaskUpdatePayload
      tags: tags, // This is now correctly string[] for TaskUpdatePayload
    };

    // Only include due_date if user is owner and it's defined
    if (isOwner) {
      updatedData.due_date = dueDate?.toISOString(); // Convert Date to ISO string for backend
    }

    onSubmit(updatedData);
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form to original values if task exists
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "not_started");
      setDueDate(task.due_date ? new Date(task.due_date) : undefined);
      setTags(task.tags?.map((tag) => tag.name) || []);
      setTagInput("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task ✏️</DialogTitle>
          <DialogDescription>Update the task details below.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title - Full Width */}
          <div className="w-full">
            <Label className="text-sm font-medium">Title ✏️</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="mt-1"
            />
          </div>

          {/* Description - Full Width */}
          <div className="w-full">
            <Label className="text-sm font-medium">Description 🧾</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task details..."
              className="mt-1 h-20 resize-none"
            />
          </div>

          {/* Grid Layout for Main Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Status 📊</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date - Only editable by owner */}
            <div>
              <Label className="text-sm font-medium">
                Due Date 📅 {!isOwner && "(Owner only)"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!isOwner}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !dueDate && "text-muted-foreground",
                      !isOwner && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "MMM dd,yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                {isOwner && (
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                )}
              </Popover>
            </div>
          </div>

          {/* Tags Section */}
          <div className="w-full">
            <Label className="text-sm font-medium">Tags 🏷️</Label>
            <div className="mt-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add a tag and press Enter"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                  className="px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md border"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Saving..." : "Save Changes"} ✅
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
