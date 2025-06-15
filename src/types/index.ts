// src/types/index.ts

export interface User {
  user_id: string;
  email: string;
  full_name?: string | null;
  // ... other user fields from your backend
}

export interface CommentResponse {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string; // ISO string format
  user?: User; // This is the crucial part that the backend now provides
  replies?: CommentResponse[]; // <-- THIS IS VITAL for the threading logic in TaskPage.tsx
}

export interface Tag {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status:
    | "not_started"
    | "in_progress"
    | "pending"
    | "completed"
    | "cancelled"
    | "on_hold";
  priority: "low" | "medium" | "high";
  estimated_time: number;
  actual_time: number;
  due_date?: string | null;
  is_completed: boolean;
  project_id?: string | null;
  user_id: string;
  user?: {
    full_name?: string;
    email?: string;
  };
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  assignments?: User[];
  owner: User;
  dependencies?: Task[];
  comments?: CommentResponse[];
}

// NEW: Interface for the payload sent when updating a task
// This mirrors your backend's TaskUpdate Pydantic schema
export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  status?:
    | "not_started"
    | "in_progress"
    | "pending"
    | "completed"
    | "cancelled"
    | "on_hold";
  due_date?: string | null; // Send as ISO string
  estimated_time?: number;
  actual_time?: number;
  priority?: "low" | "medium" | "high";
  is_completed?: boolean; // Can be sent, but backend's validator will override if status is present
  tags?: string[]; // Crucially, this is string[] for update payloads
  dependency_ids?: string[];
  project_id?: string | null;
  // Note: user_id (owner_id), created_at, updated_at are not updated through this payload
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  parent_comment_id?: string | null; // For threaded comments
  created_at: string;

  // Relationship data
  user?: User; // User who made the comment
  parent_comment?: Comment | null; // Parent comment for replies
  replies?: Comment[]; // Child comments/replies
}

// API request/response types
export interface CommentCreateRequest {
  task_id: string;
  content: string;
  parent_comment_id?: string | null;
}

// Updated ProjectMember to include user details
export interface ProjectMember {
  id: string;
  user_id: string;
  project_id: string;
  role: "owner" | "member";
  user?: User; // Include the nested user object for full details
}

// Updated Project to include members and tasks
export interface Project {
  id: string;
  title: string;
  description?: string;
  owner_id: string;
  created_at: string; // ISO date string
  updated_at?: string; // if tracked separately by API
  owner?: User; // Optionally include owner details if backend provides it

  // Relations - now explicitly typed to match potential eager loading
  members?: ProjectMember[]; // Now properly typed
  tasks?: Task[]; // Now properly typed
}

// --- Notification Types ---

// Replaced enum with a const object for better compatibility in isolatedModules environments
export const NotificationType = {
  GENERAL: "GENERAL",
  INVITE: "INVITE",
  COMMENT: "COMMENT",
  ASSIGNMENT: "ASSIGNMENT",
} as const; // 'as const' makes it a readonly tuple, allowing string literal types

// Infer type from the const object for type safety
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

// Interface for a Notification object
export interface Notification {
  id: string;
  recipient_user_id: string;
  message: string;
  related_task_id?: string | null;
  related_project_id?: string | null;
  type: NotificationType; // Using the inferred type
  is_read: boolean;
  created_at: string; // ISO string format
}

// Interface for creating a notification (request body)
export interface NotificationCreateRequest {
  recipient_user_id: string;
  message: string;
  related_task_id?: string | null;
  related_project_id?: string | null;
  type?: NotificationType; // Optional, defaults to GENERAL on backend
}

// And any other types your API might return, e.g., for login/register responses
export interface AuthResponse {
  token: string;
  user: User;
}
