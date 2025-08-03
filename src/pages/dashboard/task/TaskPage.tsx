// src/pages/dashboard/task/TaskPage.tsx

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTaskById,
  addTaskComment,
  fetchTaskComments,
  updateTask,
  deleteTask,
  archiveTask,
  updateTaskAssignments,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  MessageCircle,
  Trash2,
  Users,
  Tag,
  Edit,
  UserPlus,
  Circle,
  MoreHorizontal,
  Archive,
  Copy,
  Share,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import type { CommentResponse, Task, TaskUpdatePayload } from "@/types";

// Import new comment components
import CreateComment from "@/components/comments/CreateComment";
import Comment from "@/components/comments/Comment";

// Import new task components
import TaskDetailsCard from "@/components/task/TaskDetailsCard";

// Import dialog components
import EditTaskDialog from "@/components/task/EditTaskDialog";
import AssignmentDialog from "@/components/task/AssignmentDialog";
import DeleteTaskDialog from "@/components/task/DeleteTaskDialog"; // Import the new Delete dialog
import ShareTaskDialog from "@/components/task/ShareTaskDialog"; // Import the new Share dialog

// Import helper functions
import {
  // getUserInitials,
  organizeComments,
  getStatusConfig,
  formatDate,
  getDaysUntilDue,
  getDueDateEmoji,
  getDueDateText,
  getDueDateColor,
  getBorderColor,
} from "@/helpers/taskHelpers";

const TaskPage = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const taskId = location.pathname.split("/").pop() || "";
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: taskBase,
    isLoading: isLoadingTaskBase,
    error: errorTaskBase,
  } = useQuery<Task, Error>({
    queryKey: ["taskBase", taskId],
    queryFn: () => fetchTaskById(taskId),
    enabled: !!taskId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: commentsWithUsers,
    isLoading: isLoadingCommentsWithUsers,
    error: errorCommentsWithUsers,
  } = useQuery<CommentResponse[], Error>({
    queryKey: ["taskComments", taskId],
    queryFn: () => fetchTaskComments(taskId),
    enabled: !!taskId,
    staleTime: 1 * 60 * 1000,
  });

  // Fixed: Properly type the task with CommentResponse[]
  const task: Task | undefined = taskBase
    ? {
        ...taskBase,
        comments: commentsWithUsers || [],
      }
    : undefined;

  const isLoading = isLoadingTaskBase || isLoadingCommentsWithUsers;
  const error = errorTaskBase || errorCommentsWithUsers;

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [collapsedComments, setCollapsedComments] = useState<Set<string>>(
    new Set()
  );

  // LOGIC FIX: Access control logic - corrected owner_id to user_id
  const isOwner = task ? authUser?.user_id === task.user_id : false;
  const isAssigned = task
    ? task.assignments?.some(
        (assignment) => assignment.user_id === authUser?.user_id
      )
    : false;
  const canEdit = isOwner || isAssigned;
  // END LOGIC FIX

  // Fixed: Return CommentResponse instead of Comment
  const addCommentMutation = useMutation<
    CommentResponse,
    Error,
    { content: string; parentId: string | null }
  >({
    mutationFn: async ({ content, parentId }) => {
      const response = await addTaskComment({
        task_id: taskId,
        content,
        parent_comment_id: parentId,
      });
      console.log("Add Comment Mutation Response:", response);
      return response;
    },
    onSuccess: (newlyAddedComment) => {
      queryClient.invalidateQueries({ queryKey: ["taskBase", taskId] });
      queryClient.invalidateQueries({ queryKey: ["taskComments", taskId] });

      queryClient.setQueryData<CommentResponse[] | undefined>(
        ["taskComments", taskId],
        (oldComments) => {
          if (!oldComments) return [newlyAddedComment];

          const commentWithUserData: CommentResponse = {
            ...newlyAddedComment,
            user: newlyAddedComment.user ?? authUser ?? undefined,
          };

          return [...oldComments, commentWithUserData];
        }
      );

      setNewComment("");
      setReplyingTo(null);
    },
    onError: (err) => {
      console.error("Failed to add comment:", err);
      // TODO: Display a user-friendly error message
    },
  });

  const toggleCommentCollapse = (commentId: string) => {
    setCollapsedComments((prev) => {
      const newCollapsed = new Set(prev);
      if (newCollapsed.has(commentId)) {
        newCollapsed.delete(commentId);
      } else {
        newCollapsed.add(commentId);
      }
      return newCollapsed;
    });
  };

  const handleReplyInitiate = (commentId: string) => {
    setReplyingTo(commentId);
    setCollapsedComments((prev) => {
      const newCollapsed = new Set(prev);
      newCollapsed.delete(commentId);
      return newCollapsed;
    });
  };

  const handleSubmitRootComment = (content: string) => {
    addCommentMutation.mutate({ content, parentId: null });
  };

  const handleSubmitReply = (content: string, parentId: string) => {
    addCommentMutation.mutate({ content, parentId });
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  // --- MUTATIONS: Task Update, Delete, Archive, Assignment ---

  // Fixed: Use TaskUpdatePayload instead of Partial<Task>
  const updateTaskMutation = useMutation<Task, Error, TaskUpdatePayload>({
    mutationFn: (updatedTaskData) => updateTask(taskId, updatedTaskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskBase", taskId] });
      setEditDialogOpen(false); // Close the dialog on success
      // TODO: Optionally show a success toast/message
    },
    onError: (err) => {
      console.error("Failed to update task:", err);
      // TODO: Display a user-friendly error message
    },
  });

  const deleteTaskMutation = useMutation<void, Error>({
    mutationFn: () => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Invalidate the tasks list page
      setDeleteDialogOpen(false); // Close the dialog
      navigate("/tasks"); // Navigate back to the tasks list
      // TODO: Optionally show a success toast/message
    },
    onError: (err) => {
      console.error("Failed to delete task:", err);
      // TODO: Display a user-friendly error message
    },
  });

  const archiveTaskMutation = useMutation<void, Error>({
    mutationFn: () => archiveTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskBase", taskId] }); // Invalidate current task
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Invalidate the tasks list if it shows archived tasks
      setArchiveDialogOpen(false); // Close the dialog
      navigate("/tasks"); // Navigate back as the task might be hidden from active lists
      // TODO: Optionally show a success toast/message
    },
    onError: (err) => {
      console.error("Failed to archive task:", err);
      // TODO: Display a user-friendly error message
    },
  });

  const updateAssignmentMutation = useMutation<
    Task,
    Error,
    { userIds: string[] }
  >({
    mutationFn: ({ userIds }) => updateTaskAssignments(taskId, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskBase", taskId] }); // Invalidate current task to show new assignments
      setAssignmentDialogOpen(false); // Close the dialog
      // TODO: Optionally show a success toast/message
    },
    onError: (err) => {
      console.error("Failed to update assignments:", err);
      // TODO: Display a user-friendly error message
    },
  });

  // Dialog handlers - now calling mutations
  const handleEditTask = () => setEditDialogOpen(true);
  const handleDeleteTask = () => setDeleteDialogOpen(true);
  const handleArchiveTask = () => setArchiveDialogOpen(true);
  const handleShareTask = () => setShareDialogOpen(true);
  const handleDuplicateTask = () => {
    // TODO: Implement task duplication logic
    console.log("Duplicate task:", taskId);
  };
  const handleManageAssignments = () => {
    // Only open the assignment dialog if the task has a project_id
    if (task?.project_id) {
      setAssignmentDialogOpen(true);
    } else {
      // TODO: Potentially show a toast or alert indicating no project is assigned
      console.warn(
        "Cannot manage assignments: Task is not associated with a project."
      );
    }
  };

  // Fixed: Use TaskUpdatePayload
  const handleEditSubmit = (updatedTask: TaskUpdatePayload) => {
    updateTaskMutation.mutate(updatedTask);
  };

  const handleDeleteConfirm = () => {
    deleteTaskMutation.mutate();
  };

  const handleArchiveConfirm = () => {
    archiveTaskMutation.mutate();
  };

  const handleAssignmentSubmit = (assignmentData: { userIds: string[] }) => {
    updateAssignmentMutation.mutate(assignmentData);
  };
  // --- END MUTATIONS ---

  if (!authUser) {
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

  const comments = task.comments || [];
  const organizedComments = organizeComments(comments);
  const totalComments = comments.length;

  const statusConfigForHeader = getStatusConfig(task.status);

  const daysUntilDue = getDaysUntilDue(task.due_date);
  const dueDateEmoji = getDueDateEmoji(daysUntilDue);
  const dueDateText = getDueDateText(daysUntilDue);
  const dueDateColor = getDueDateColor(daysUntilDue);
  const borderColor = getBorderColor(daysUntilDue);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{statusConfigForHeader.icon}</div>
                <div>
                  <h1 className="text-2xl font-bold">{task.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    #{task.id?.toString().slice(-8) || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex gap-2">
              {/* Primary Edit Button - Always visible for those who can edit */}
              {canEdit && (
                <Button variant="default" size="sm" onClick={handleEditTask}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </Button>
              )}

              {/* Quick Actions for Owner */}
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManageAssignments}
                  // Disable button if no project_id is associated
                  disabled={!task.project_id}
                  title={
                    !task.project_id
                      ? "Assignees can only be managed for tasks associated with a project"
                      : "Manage assignees"
                  }
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assignees
                </Button>
              )}

              {/* More Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Actions available to all users */}
                  <DropdownMenuItem onClick={handleShareTask}>
                    <Share className="h-4 w-4 mr-2" />
                    Share Task
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleDuplicateTask}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Task
                  </DropdownMenuItem>

                  {/* Edit actions for those who can edit */}
                  {canEdit && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleEditTask}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Owner-only actions */}
                  {isOwner && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleArchiveTask}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive Task
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={handleDeleteTask}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Task
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* CONSOLIDATED Task Details Card */}
            <TaskDetailsCard task={task} />

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Tags 🏷️
                    </CardTitle>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditTask}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <Badge key={tag.id || index} variant="secondary">
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
                  Comments 💬 ({totalComments})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add new comment form */}
                <div className="border rounded-lg p-4 bg-muted/20">
                  <CreateComment
                    onSubmit={handleSubmitRootComment}
                    isSubmitting={
                      addCommentMutation.isPending && replyingTo === null
                    }
                    placeholder="Write a new comment..."
                    initialContent={newComment}
                    onCancel={() => setNewComment("")}
                  />
                </div>

                <Separator />

                {/* Render threaded comments */}
                <div className="space-y-4">
                  {organizedComments.map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      onReplyInitiate={handleReplyInitiate}
                      onToggleCollapse={toggleCommentCollapse}
                      isCollapsed={collapsedComments.has(comment.id)}
                      replyingToId={replyingTo}
                      onSubmitReply={handleSubmitReply}
                      isSubmittingReply={addCommentMutation.isPending}
                      onCancelReply={handleCancelReply}
                    />
                  ))}
                </div>

                {totalComments === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No comments yet. Be the first to comment! 💭</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Due Date */}
            <Card className={borderColor}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Due Date {dueDateEmoji}
                  </CardTitle>
                  {canEdit && (
                    <Button variant="ghost" size="sm" onClick={handleEditTask}>
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {task.due_date ? formatDate(task.due_date) : "No due date"}
                </p>
                <p className={`text-sm ${dueDateColor}`}>{dueDateText}</p>
              </CardContent>
            </Card>

            {/* Assignees */}
            {/* Display this card only if there are assignments OR if the task has a project_id (to show message) */}
            {(task.assignments && task.assignments.length > 0) ||
            task.project_id ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Assignees 👥
                    </CardTitle>
                    {isOwner &&
                      task.project_id && ( // Only show edit button if owner AND task has a project
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleManageAssignments}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {task.assignments && task.assignments.length > 0 ? (
                    task.assignments.map((assignment) => (
                      <div
                        key={assignment.user_id}
                        className="flex items-center gap-3"
                      >
                        <Avatar>
                          <AvatarFallback>
                            {/* {getUserInitials('unknown')} */}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {/* {assignment.user?.full_name ||
                              assignment.user.email ||
                              "Unknown Assignee"} */}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No assignees yet for this project task.
                    </p>
                  )}
                  {!task.project_id && (
                    <p className="text-muted-foreground text-sm">
                      Assignees can only be managed for tasks associated with a
                      project.
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {/* Dependencies */}
            {task.dependencies && task.dependencies.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Dependencies 🔗</CardTitle>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditTask}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {task.dependencies.map((dep) => (
                    <div key={dep.id} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Circle className="h-4 w-4 text-yellow-500" />
                        <p className="font-medium text-sm">
                          {dep.title || `Dependency #${dep.id.slice(-8)}`}
                        </p>
                      </div>
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed:</span>
                  <span>{task.is_completed ? "Yes ✅" : "No ❌"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog Components */}
      <EditTaskDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        task={task}
        onSubmit={handleEditSubmit}
        isOwner={isOwner}
      />

      <AssignmentDialog
        open={assignmentDialogOpen}
        onOpenChange={setAssignmentDialogOpen}
        task={task} // Keep task for current assignments
        currentProjectId={task?.project_id} // Pass project_id for fetching project members
        onSubmit={handleAssignmentSubmit}
        isSubmitting={updateAssignmentMutation.isPending} // Pass submission state
      />

      {/* New Delete Confirmation Dialog Component */}
      <DeleteTaskDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        taskTitle={task.title}
      />

      {/* New Share Dialog Component */}
      <ShareTaskDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        taskUrl={window.location.href}
      />

      {/* Archive Confirmation Dialog (remains inline for now as it's not a common pattern) */}
      {archiveDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4 border">
            <h2 className="text-lg font-semibold mb-4">Archive Task 📦</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to archive "<strong>{task.title}</strong>"?
              Archived tasks can be restored later but won't appear in active
              task lists.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setArchiveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleArchiveConfirm}>Archive Task</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage;
