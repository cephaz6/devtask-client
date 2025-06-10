// src/pages/dashboard/Tasks.tsx
import {
  Plus,
  Grid3X3,
  List,
  Folder,
  Calendar,
  User,
  Filter,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import CreateTaskDialog from "@/components/task/CreateTaskDialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "@/lib/api";
import { type Task } from "@/types";
import { Link } from "react-router-dom"; // Already imported, good!

const Tasks = () => {
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [groupBy, setGroupBy] = useState("none"); // "none", "project", "status", "priority"
  const [filterStatus, setFilterStatus] = useState("all");

  // --- START OF CHANGES: Fetch tasks from API ---
  const {
    data: tasks, // Rename 'data' to 'tasks' for clarity
    isLoading,
    isError,
    error,
  } = useQuery<Task[], Error>({
    queryKey: ["tasks"], // A unique key for this query
    queryFn: fetchTasks, // The function that fetches the data
  });
  // --- END OF CHANGES: Fetch tasks from API ---

  const getStatusColor = (status: Task["status"]) => {
    // Added Task["status"] for typing
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "not_started": // Added 'not_started' from Task interface
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "blocked": // Added 'blocked' from Task interface if applicable
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    // Added Task["priority"] for typing
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filter tasks based on API data availability and filterStatus
  const filteredTasks = tasks
    ? tasks.filter((task) => {
        if (filterStatus === "all") return true;
        // Adjust this if your API uses 'not_started' where UI expects 'todo'
        if (filterStatus === "todo" && task.status === "not_started")
          return true;
        return task.status === filterStatus;
      })
    : []; // If tasks is null/undefined, return empty array

  const groupTasks = (tasksToGroup: Task[]) => {
    // Added Task[] for typing
    if (groupBy === "none") return { "All Tasks": tasksToGroup };

    return tasksToGroup.reduce((groups, task) => {
      let key: string; // Added type for key
      switch (groupBy) {
        case "project":
          key = task.project_id || "Unassigned Project"; // Changed to project_id
          break;
        case "status":
          key = task.status.replace(/_/g, " ").toUpperCase();
          break;
        case "priority":
          key = task.priority.toUpperCase();
          break;
        default:
          key = "All Tasks";
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(task);
      return groups;
    }, {} as Record<string, Task[]>); // Added type assertion for reducer result
  };

  const groupedTasks = groupTasks(filteredTasks);

  const TaskCard = (
    { task }: { task: Task } // Added Task type for prop
  ) => (
    // FIX HERE: Corrected Link 'to' prop and added className="block"
    <Link to={`/dashboard/tasks/${task.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {/* Removed task.emoji as it's not part of the Task interface from API */}
              <CardTitle className="text-base font-semibold group-hover:text-blue-600 transition-colors">
                {task.title}
              </CardTitle>
            </div>
            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm mb-3 line-clamp-2">{task.description}</p>

          <div className="flex flex-wrap gap-1 mb-3">
            {/* Adjusted to tag.name based on Task interface { id?: string; name: string } */}
            {task.tags &&
              task.tags.map((tag) => (
                <Badge
                  key={tag.id || tag.name}
                  variant="outline"
                  className="text-xs"
                >
                  {tag.name}
                </Badge>
              ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {/* Adjusted to use assignments array or owner_id */}
              {task.assignments && task.assignments.length > 0
                ? task.assignments[0].name
                : task.owner_id || "Unassigned"}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {/* Adjusted to use task.due_date and handle potential null */}
              {task.due_date
                ? new Date(task.due_date).toLocaleDateString()
                : "No Due Date"}
            </div>
          </div>

          <div className="mt-3">
            <Badge className={`text-xs ${getStatusColor(task.status)}`}>
              {task.status.replace(/_/g, " ")}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const TaskRow = (
    { task }: { task: Task } // Added Task type for prop
  ) => (
    // FIX HERE: Wrap div with Link and added className="block"
    <Link to={`/dashboard/tasks/${task.id}`} className="block">
      <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group">
        {/* Removed task.emoji */}

        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold
            group-hover:text-blue-600 transition-colors truncate"
          >
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 truncate">{task.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={`text-xs ${getStatusColor(task.status)}`}>
            {task.status.replace(/_/g, " ")}
          </Badge>

          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </Badge>

          <div className="text-xs text-gray-500 min-w-20">
            {/* Adjusted to use assignments array or owner_id */}
            {task.assignments && task.assignments.length > 0
              ? task.assignments[0].name
              : task.owner_id || "Unassigned"}
          </div>

          <div className="text-xs text-gray-500 min-w-24">
            {/* Adjusted to use task.due_date and handle potential null */}
            {task.due_date
              ? new Date(task.due_date).toLocaleDateString()
              : "No Due Date"}
          </div>
        </div>
      </div>
    </Link>
  );
  // --- END OF CHANGES: TaskCard & TaskRow Component Adjustments ---

  // --- START OF CHANGES: Loading, Error, and Empty States ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-lg text-gray-600">
        <p>Loading tasks...</p> {/* You might want a spinner here */}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center p-8">
        <p className="text-xl font-semibold mb-2">Error loading tasks</p>
        <p className="text-sm">
          There was an issue fetching your tasks:{" "}
          {error?.message || "Unknown error"}. Please try again later.
        </p>
      </div>
    );
  }

  // If no tasks are found after loading (either empty array or `null` from API)
  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 mb-4">
            {filterStatus === "all"
              ? "Start by creating your first task!"
              : `No tasks with status "${filterStatus.replace("_", " ")}"`}
          </p>
          <Button onClick={() => setOpenCreateTask(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </CardContent>
      </Card>
    );
  }
  // --- END OF CHANGES: Loading, Error, and Empty States ---

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-gray-600 mt-1">
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "task" : "tasks"}
            {filterStatus !== "all" && ` · ${filterStatus.replace("_", " ")}`}
          </p>
        </div>

        <Button
          onClick={() => setOpenCreateTask(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Group By */}
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="w-40">
                  <Folder className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Group by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No grouping</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tasks</SelectItem>
                <SelectItem value="todo">To do</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>{" "}
                {/* Added blocked status option */}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Display */}
      {/* The `if (!tasks || tasks.length === 0)` block above now handles the empty state */}
      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([groupName, tasksInGroup]) => (
          <div key={groupName}>
            {groupBy !== "none" && (
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {groupName}
                </h2>
                <Badge variant="outline" className="text-xs">
                  {tasksInGroup.length}{" "}
                  {tasksInGroup.length === 1 ? "task" : "tasks"}
                </Badge>
              </div>
            )}

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasksInGroup.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {tasksInGroup.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            )}

            {groupBy !== "none" &&
              groupName !==
                Object.keys(groupedTasks)[
                  Object.keys(groupedTasks).length - 1
                ] && <Separator className="mt-6" />}
          </div>
        ))}
      </div>

      <CreateTaskDialog
        open={openCreateTask}
        onOpenChange={setOpenCreateTask}
      />
    </div>
  );
};

export default Tasks;
