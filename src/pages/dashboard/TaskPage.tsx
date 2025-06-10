import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTaskById } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  MessageCircle,
  Plus,
  Send,
  Trash2,
  Users,
  CheckCircle2,
  Circle,
  Tag,
  Timer,
  TrendingUp,
  Flame,
  Zap,
  Target,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const TaskPage = () => {
  const location = useLocation();
  const taskId = location.pathname.split("/").pop();
  const { user } = useAuth();

  // Tanstack Query to fetch task by ID
  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTaskById(taskId),
    enabled: !!taskId, // Only run query if taskId exists
  });

  const [newComment, setNewComment] = useState("");
  //   const [isEditing, setIsEditing] = useState(false);

  // Mock comments data (keeping this as dummy for now)
  const mockComments = [
    {
      id: 1,
      text: "Started working on the Docker setup 🚀",
      user: "Alex Chen",
      created_at: "2025-06-10T10:30:00",
      initials: "AC",
    },
    {
      id: 2,
      text: "Need to discuss the database configuration 💾",
      user: "Sarah Kim",
      created_at: "2025-06-10T11:45:00",
      initials: "SK",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Please log in to view this task
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-64">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading task... ⏳</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">
              ❌ Error loading task: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Task not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = user.user_id === task.user_id;
  const progress = task.progress || 0;
  const comments = task.comments || mockComments; // Use API comments if available, fallback to mock

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "high":
        return {
          variant: "destructive",
          icon: <Flame className="w-4 h-4" />,
          emoji: "🔥",
        };
      case "medium":
        return {
          variant: "default",
          icon: <Zap className="w-4 h-4" />,
          emoji: "⚡",
        };
      case "low":
        return {
          variant: "secondary",
          icon: <Target className="w-4 h-4" />,
          emoji: "🎯",
        };
      default:
        return {
          variant: "outline",
          icon: <Circle className="w-4 h-4" />,
          emoji: "⚪",
        };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          variant: "default",
          className: "bg-green-500 hover:bg-green-600",
          icon: <CheckCircle2 className="w-4 h-4" />,
          emoji: "✅",
          text: "Completed",
        };
      case "in_progress":
        return {
          variant: "default",
          className: "bg-blue-500 hover:bg-blue-600",
          icon: <Clock className="w-4 h-4" />,
          emoji: "🔄",
          text: "In Progress",
        };
      case "not_started":
        return {
          variant: "secondary",
          icon: <Circle className="w-4 h-4" />,
          emoji: "⏸️",
          text: "Not Started",
        };
      default:
        return {
          variant: "outline",
          icon: <Circle className="w-4 h-4" />,
          emoji: "❓",
          text: "Unknown",
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        // TODO: Implement API call to add comment
        // const response = await fetch(`/api/tasks/${taskId}/comments`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     text: newComment,
        //     user_id: user.id
        //   })
        // });

        // For now, just clear the input
        setNewComment("");
        console.log("Comment would be added:", newComment);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntilDue = () => {
    if (!task.due_date) return null;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  const getDueDateEmoji = () => {
    if (daysUntilDue === null) return "📅";
    if (daysUntilDue < 0) return "🚨";
    if (daysUntilDue <= 3) return "⚠️";
    return "📅";
  };

  const getDueDateText = () => {
    if (daysUntilDue === null) return "No due date";
    if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days overdue`;
    if (daysUntilDue === 0) return "Due today";
    return `${daysUntilDue} days left`;
  };

  const getDueDateColor = () => {
    if (daysUntilDue === null) return "text-muted-foreground";
    if (daysUntilDue < 0) return "text-destructive";
    if (daysUntilDue <= 3) return "text-yellow-600";
    return "text-green-600";
  };

  const getBorderColor = () => {
    if (daysUntilDue === null) return "";
    if (daysUntilDue < 0) return "border-destructive";
    if (daysUntilDue <= 3) return "border-yellow-500";
    return "border-green-500";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{statusConfig.emoji}</div>
                <div>
                  <h1 className="text-2xl font-bold">{task.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    #{task.id?.toString().slice(-8) || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress & Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Progress Card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <CardTitle className="text-sm">Progress 📈</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{progress}%</div>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>

              {/* Priority Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Priority {priorityConfig.emoji}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={priorityConfig.variant} className="text-sm">
                    {priorityConfig.icon}
                    <span className="ml-1 capitalize">
                      {task.priority || "Unknown"}
                    </span>
                  </Badge>
                </CardContent>
              </Card>

              {/* Time Card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-purple-500" />
                    <CardTitle className="text-sm">Time ⏱️</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {task.actual_time || 0}h
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {task.estimated_time || 0}h
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Status Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Status {statusConfig.emoji}
                  </CardTitle>
                  <Badge
                    variant={statusConfig.variant}
                    className={statusConfig.className}
                  >
                    {statusConfig.icon}
                    <span className="ml-1">{statusConfig.text}</span>
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Description 📝
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {task.description || "No description provided"}
                </p>
              </CardContent>
            </Card>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Tags 🏷️
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className={tag.color}
                      >
                        #{tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comments 💬 ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {comment.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{comment.user}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}

                <Separator />

                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment... 💭"
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <Button onClick={handleAddComment} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Due Date */}
            <Card className={getBorderColor()}>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Date {getDueDateEmoji()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {task.due_date ? formatDate(task.due_date) : "No due date"}
                </p>
                <p className={`text-sm ${getDueDateColor()}`}>
                  {getDueDateText()}
                </p>
              </CardContent>
            </Card>

            {/* Assignees */}
            {task.assignments && task.assignments.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Assignees 👥
                    </CardTitle>
                    {isOwner && (
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {task.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center gap-3"
                    >
                      <Avatar>
                        <AvatarFallback>
                          {assignment.user?.initials || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {assignment.user?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {assignment.user?.email || ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Dependencies */}
            {task.dependencies && task.dependencies.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Dependencies 🔗</CardTitle>
                    {isOwner && (
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {task.dependencies.map((dep) => (
                    <div key={dep.id} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        {dep.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-yellow-500" />
                        )}
                        <p className="font-medium text-sm">{dep.title}</p>
                      </div>
                      <Badge
                        variant={
                          dep.status === "completed" ? "default" : "secondary"
                        }
                        className={
                          dep.status === "completed" ? "bg-green-500" : ""
                        }
                      >
                        {dep.status === "completed" ? "✅" : "🔄"}{" "}
                        {dep.status?.replace("_", " ") || "Unknown"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Task Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Task Info ℹ️</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(task.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{formatDate(task.updated_at)}</span>
                </div>
                {task.project_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project ID:</span>
                    <span className="font-mono text-xs">
                      {task.project_id.toString().slice(-8)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
