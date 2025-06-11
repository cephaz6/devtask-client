// src/components/CreateTaskDialog.tsx
import { useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
import {
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Tag,
  FolderKanban,
  X,
  Plus,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { fetchProjects, createTask } from "@/lib/api"; // Import createTask

const priorityLevels = ["low", "medium", "high"];

const CreateTaskDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("0.25");
  const [actualTime, setActualTime] = useState("0.25");
  const [projectId, setProjectId] = useState<string | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

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
    const payload = {
      title,
      description,
      priority,
      due_date: dueDate,
      tags: tags,
      estimated_time: parseFloat(estimatedTime),
      actual_time: parseFloat(actualTime),
      project_id: projectId,
    };
    try {
      // Use the new createTask function
      const newTask = await createTask(payload);

      onOpenChange(false); // Close the dialog

      // Redirect to the newly created task's page
      if (newTask && newTask.id) {
        navigate(`/tasks/${newTask.id}`);
      } else {
        console.warn("Task created, but no ID received for redirection.");
        // Optionally, show a success message or redirect to a default task list page
        navigate("/tasks"); // Example: redirect to a tasks list page
      }

      // Reset form fields after successful creation and redirection
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate(undefined);
      setTags([]);
      setTagInput("");
      setEstimatedTime("0.25");
      setActualTime("0.25");
      setProjectId(null);
    } catch (error) {
      console.error("Error creating task:", error);
      // Handle error (e.g., show a toast notification)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[98vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task 📝</DialogTitle>
          <DialogDescription>
            Fill out the details to add a new task to your project.
          </DialogDescription>
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Priority 🚦</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      <span
                        className={cn(
                          "font-medium",
                          level === "high" && "text-red-600",
                          level === "medium" && "text-yellow-600",
                          level === "low" && "text-green-600"
                        )}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Due Date 📅</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "MMM dd") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-sm font-medium">Project 📂</Label>
              <Select value={projectId || ""} onValueChange={setProjectId}>
                <SelectTrigger className="mt-1 flex items-center">
                  <FolderKanban className="mr-2 h-4 w-4" />
                  <SelectValue
                    className="truncate flex-1 min-w-0"
                    placeholder="Project"
                  />
                </SelectTrigger>
                <SelectContent collisionPadding={10}>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading projects...
                    </SelectItem>
                  ) : (
                    projects &&
                    Array.isArray(projects) &&
                    projects.map((proj: any) => (
                      <SelectItem key={proj.id} value={proj.id}>
                        {proj.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Tracking Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                Estimated Time (hrs) ⏱️
              </Label>
              <Input
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                type="number"
                step="0.25"
                min="0"
                className="mt-1"
                placeholder="0.25"
              />
            </div>
            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                Actual Time (hrs) 🕒
              </Label>
              <Input
                value={actualTime}
                onChange={(e) => setActualTime(e.target.value)}
                type="number"
                step="0.25"
                min="0"
                className="mt-1"
                placeholder="0.25"
              />
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
            onClick={() => onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Task ✅
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
