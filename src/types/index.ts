// src/types/index.ts (Ensure these are defined)

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed" | "blocked";
  is_completed: boolean;
  priority: "low" | "medium" | "high";
  due_date: string | null; // ISO string or null
  estimated_time: number;
  actual_time: number;
  project_id: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
  tags: Array<{ id?: string; name: string }>;
  assignments: Array<{ id: string; name: string; avatar?: string }>;
  dependencies: Array<{ id: string; title?: string }>;
  // comments?: Comment[]; // Comments are often fetched separately, but a task might have them initially.
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  user?: User; // User who made the comment
  text: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  // Add other project-specific fields
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  // Add other user properties
}

// And any other types your API might return, e.g., for login/register responses
export interface AuthResponse {
  token: string;
  user: User;
}
