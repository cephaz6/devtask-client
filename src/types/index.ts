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
  parent_comment_id: string | null; // Fixed: removed undefined
  created_at: string; // ISO string format
  user?: User; // This is the crucial part that the backend now provides
  replies?: CommentResponse[]; // <-- THIS IS VITAL for the threading logic in TaskPage.tsx
}

export interface Tag {
  id: string;
  name: string;
}

export interface TaskMember {
  id: string;
  user_id: string;
  user: User; // Include the nested user object for full details
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
  assignments?: TaskMember[];
  owner: User;
  dependencies?: Task[];
  comments?: CommentResponse[]; // Changed from Comment[] to CommentResponse[]
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

// Updated Comment interface to match CommentResponse (they should be the same)
export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null; // Fixed: removed undefined
  created_at: string; // ISO string format
  user?: User; // This is the crucial part that the backend now provides
  replies?: CommentResponse[]; // <-- THIS IS VITAL for the threading logic in TaskPage.tsx
}

// Interface specifically for EditTaskDialog props - to bridge the gap
export interface EditTaskSubmissionData {
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
  tags?: string[]; // For edit dialog, we use string[] to match TaskUpdatePayload
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
  user: User; // Include the nested user object for full details
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
export type NotificationType =
  | "general"
  | "comment"
  | "comment_reply"
  | "task_assignment"
  | "project_invite";

export interface Notification {
  id: string;
  recipient_user_id: string;
  message: string;
  related_task_id?: string;
  related_project_id?: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
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

// Dashboard Statistics Interface
export interface DashboardStats {
  total_tasks: number;
  completed_tasks: number;
  pending_assignments: number;
  active_projects: number;
  recent_comments_count: number;
}

// NEW: Recent Activity Item (for displaying dynamic activity feed)
export interface RecentActivityItem {
  id: string;
  type:
    | "task_created"
    | "task_completed"
    | "comment_added"
    | "assignment_created"
    | "project_created"
    | "project_updated";
  description: string;
  timestamp: string; // ISO string format (e.g., "2023-10-27T10:00:00Z")
  actor_name: string; // Name of the user who performed the action
  related_entity_title?: string; // Title of the task/project
  related_entity_id?: string; // ID of the task/project
}

// COPILOT Interface
export type TaskItem = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  estimated_time: number;
  due_date: string;
};

export type GeneratedProject = {
  title: string;
  description: string;
  tasks: TaskItem[];
};
