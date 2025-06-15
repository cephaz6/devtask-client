// src/helpers/taskHelpers.ts

import type { User, CommentResponse, Task } from "@/types"; // Import necessary types

/**
 * Generates initials from a user's full name or email.
 * Handles cases where full_name might be null.
 */
export const getUserInitials = (userData: User | null | undefined): string => {
  if (!userData) {
    return "?"; // Return a placeholder if no user data
  }

  if (userData.full_name && userData.full_name.trim()) {
    const parts = userData.full_name.trim().split(" ");
    if (parts.length > 1) {
      return (
        parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
      ).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  }

  if (userData.email && userData.email.trim()) {
    return userData.email.charAt(0).toUpperCase();
  }

  return "?";
};

/**
 * Organizes a flat list of comments into a threaded (parent-child) structure.
 */
export const organizeComments = (
  comments: CommentResponse[]
): CommentResponse[] => {
  const commentMap = new Map<string, CommentResponse>();

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  const rootComments: CommentResponse[] = [];

  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id);
    if (!commentWithReplies) return;

    if (comment.parent_comment_id) {
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies = parent.replies || [];
        if (
          !parent.replies.some((reply) => reply.id === commentWithReplies.id)
        ) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

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
 * Aligned with backend TaskStatus enum.
 */
export const getProgressFromStatus = (status: Task["status"]): number => {
  switch (status) {
    case "not_started":
      return 0;
    case "pending":
      return 10;
    case "in_progress":
      return 50;
    case "on_hold":
      return 60;
    case "completed":
      return 100;
    case "cancelled":
      return 100;
    default:
      return 0;
  }
};

/**
 * Returns configuration for task priority display (badge variant, icon, emoji).
 */
export const getPriorityConfig = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return {
        variant: "destructive",
        icon: "🔥",
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
 * Aligned with backend TaskStatus enum and frontend Task type.
 */
export const getStatusConfig = (status: Task["status"]) => {
  switch (status) {
    case "not_started":
      return {
        variant: "secondary",
        className: "bg-gray-700 text-gray-200 border-gray-600",
        icon: "📄",
        text: "Not Started",
      };
    case "pending":
      return {
        variant: "default",
        className: "bg-purple-600 text-white border-purple-700",
        icon: "⏳",
        text: "Pending",
      };
    case "in_progress":
      return {
        variant: "default",
        className: "bg-blue-600 text-white border-blue-700",
        icon: "🔄",
        text: "In Progress",
      };
    case "on_hold":
      return {
        variant: "default",
        className: "bg-orange-600 text-white border-orange-700",
        icon: "⏸️",
        text: "On Hold",
      };
    case "completed":
      return {
        variant: "default",
        className: "bg-green-600 text-white border-green-700",
        icon: "✅",
        text: "Completed",
      };
    case "cancelled":
      return {
        variant: "destructive",
        className: "bg-red-600 text-white border-red-700",
        icon: "🚫",
        text: "Cancelled",
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
