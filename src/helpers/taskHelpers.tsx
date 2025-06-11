// src/utils/task-helpers.ts

import type { User, CommentResponse } from "@/types"; // Import necessary types

/**
 * Generates initials from a user's full name or email.
 */
export const getUserInitials = (userData: User | null | undefined): string => {
  if (userData?.full_name && userData.full_name.trim()) {
    return userData.full_name
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (userData?.email && userData.email.trim()) {
    return userData.email.charAt(0).toUpperCase();
  }
  return "??";
};

/**
 * Organizes a flat list of comments into a threaded (parent-child) structure.
 */
export const organizeComments = (
  comments: CommentResponse[]
): CommentResponse[] => {
  const commentMap = new Map<string, CommentResponse>();

  // First pass: create comment objects and initialize replies array
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  const rootComments: CommentResponse[] = [];

  // Second pass: organize into parent-child relationships using 'replies'
  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id);
    if (!commentWithReplies) return;

    if (comment.parent_comment_id) {
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(commentWithReplies);
      } else {
        // Parent not found (e.g., parent deleted or out of fetched scope), treat as root comment
        rootComments.push(commentWithReplies);
      }
    } else {
      // No parent_comment_id, it's a root comment
      rootComments.push(commentWithReplies);
    }
  });

  // Helper to recursively sort comments by created_at
  const sortCommentsRecursively = (commentsArray: CommentResponse[]) => {
    commentsArray.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    commentsArray.forEach((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        sortCommentsRecursively(comment.replies);
      }
    });
  };

  sortCommentsRecursively(rootComments);

  return rootComments;
};

/**
 * Determines task progress based on its status.
 */
export const getProgressFromStatus = (status: string): number => {
  switch (status) {
    case "not_started":
      return 0;
    case "in_progress":
      return 50;
    case "completed":
      return 100;
    case "blocked":
      return 25;
    default:
      return 0;
  }
};

/**
 * Returns configuration for task priority display (badge variant, icon, emoji).
 */
export const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "high":
      return {
        variant: "destructive", // Type assertion for union types
        icon: "🔥", // Using emoji directly as placeholder for LucideIcon
        text: "High",
      };
    case "medium":
      return {
        variant: "default",
        icon: "⚡",
        text: "Medium",
      };
    case "low":
      return {
        variant: "secondary",
        icon: "🎯",
        text: "Low",
      };
    default:
      return {
        variant: "outline",
        icon: "⚪",
        text: "Unknown",
      };
  }
};

/**
 * Returns configuration for task status display (badge variant, class, icon, emoji, text).
 */
export const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return {
        variant: "default",
        className: "bg-green-500 hover:bg-green-600",
        icon: "✅",
        text: "Completed",
      };
    case "in_progress":
      return {
        variant: "default",
        className: "bg-blue-500 hover:bg-blue-600",
        icon: "🔄",
        text: "In Progress",
      };
    case "not_started":
      return {
        variant: "secondary",
        className: "",
        icon: "⏸️",
        text: "Not Started",
      };
    case "blocked":
      return {
        variant: "destructive",
        className: "",
        icon: "🚫",
        text: "Blocked",
      };
    default:
      return {
        variant: "outline",
        className: "",
        icon: "❓",
        text: "Unknown",
      };
  }
};

/**
 * Formats a date string into a readable format.
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return "Invalid Date";
  }
};

/**
 * Calculates days remaining until a due date.
 */
export const getDaysUntilDue = (
  dueDateString: string | null | undefined
): number | null => {
  if (!dueDateString) return null;
  const dueDate = new Date(dueDateString);
  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Returns an emoji based on days until due.
 */
export const getDueDateEmoji = (daysUntilDue: number | null): string => {
  if (daysUntilDue === null) return "📅";
  if (daysUntilDue < 0) return "🚨";
  if (daysUntilDue <= 3) return "⚠️";
  return "📅";
};

/**
 * Returns a text description for days until due.
 */
export const getDueDateText = (daysUntilDue: number | null): string => {
  if (daysUntilDue === null) return "No due date";
  if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days overdue`;
  if (daysUntilDue === 0) return "Due today";
  return `${daysUntilDue} days left`;
};

/**
 * Returns a Tailwind CSS color class based on days until due.
 */
export const getDueDateColor = (daysUntilDue: number | null): string => {
  if (daysUntilDue === null) return "text-muted-foreground";
  if (daysUntilDue < 0) return "text-destructive";
  if (daysUntilDue <= 3) return "text-yellow-600";
  return "text-green-600";
};

/**
 * Returns a Tailwind CSS border color class based on days until due.
 */
export const getBorderColor = (daysUntilDue: number | null): string => {
  if (daysUntilDue === null) return "";
  if (daysUntilDue < 0) return "border-destructive";
  if (daysUntilDue <= 3) return "border-yellow-500";
  return "border-green-500";
};
