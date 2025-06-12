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
  status: "not_started" | "in_progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high";
  estimated_time: number;
  actual_time: number;
  due_date?: string | null;
  is_completed: boolean;
  project_id?: string | null;
  owner_id: string;
  owner: User;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  assignments?: User[]; // Assuming assignments are just User objects
  dependencies?: Task[]; // Can be simplified if only IDs are returned

  comments?: CommentResponse[]; // This must match the combined data structure
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

// Enum for notification types, matching backend
export enum NotificationType {
  GENERAL = "GENERAL",
  INVITE = "INVITE",
  COMMENT = "COMMENT",
  ASSIGNMENT = "ASSIGNMENT",
}

// Interface for a Notification object
export interface Notification {
  id: string;
  recipient_user_id: string;
  message: string;
  related_task_id?: string | null;
  related_project_id?: string | null;
  type: NotificationType; // Using the enum
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
