// src/lib/api.ts
import axios from "axios";
import type {
  Task,
  Project,
  Comment,
  User,
  ProjectMember,
  Notification,
  NotificationType,
  NotificationCreateRequest,
} from "@/types"; // Import all necessary types, including new Notification types

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL,
  withCredentials: true, // If your backend uses cookies/session, otherwise false
});

// Helper to set/remove auth header (useful after login/logout)
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// You might also have a /auth/me or /users/me endpoint to fetch current user details
export const fetchCurrentUser = async (): Promise<User> => {
  const response = await api.get("/auth/me"); // Assuming your backend has an endpoint for current user
  return response.data;
};

// --- Project Queries ---

// Fetch all projects (now uses the /my-projects endpoint)
export const fetchProjects = async (): Promise<Project[]> => {
  const response = await api.get("/project/my-projects");
  console.log("API fetched projects:", response.data);
  return response.data;
};

// Fetch a single project by ID
export const fetchProjectById = async (id: string): Promise<Project> => {
  const response = await api.get(`/project/${id}`);
  return response.data;
};

// Create a new project
export const createProject = async (
  projectData: Partial<Project>
): Promise<Project> => {
  const response = await api.post("/project", projectData);
  console.log("Project created:", response.data);
  return response.data;
};

// Update an existing project
export const updateProject = async (
  id: string,
  projectData: Partial<Project>
): Promise<Project> => {
  const response = await api.put(`/project/${id}`, projectData);
  console.log("Project updated:", response.data);
  return response.data;
};

// Delete a project
export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/project/${id}`);
  console.log(`Project ${id} deleted.`);
};

// Fetch members of a specific project
export const fetchProjectMembers = async (
  projectId: string
): Promise<User[]> => {
  try {
    const response = await api.get(`/project-members/${projectId}/members`);
    console.log(`API fetched members for project ${projectId}:`, response.data);
    // Assuming the backend now returns User objects directly or can be mapped
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch members for project ${projectId}:`, error);
    throw error;
  }
};

// --- Project Member Endpoints ---

// Invite a user to a project
export const inviteProjectMember = async (
  projectId: string,
  userId: string,
  role: "owner" | "member" = "member"
): Promise<ProjectMember> => {
  const response = await api.post("/project-members/invite", {
    project_id: projectId,
    user_id: userId,
    role: role,
  });
  console.log("API invited project member:", response.data);
  return response.data;
};

// Update a member's role in a project
export const updateProjectMemberRole = async (
  projectId: string,
  userId: string,
  newRole: "owner" | "member"
): Promise<ProjectMember> => {
  const response = await api.patch("/project-members/role", {
    project_id: projectId,
    user_id: userId,
    new_role: newRole,
  });
  console.log("API updated project member role:", response.data);
  return response.data;
};

// Remove a member from a project
export const removeProjectMember = async (
  projectId: string,
  userId: string
): Promise<void> => {
  await api.delete("/project-members/remove", {
    data: { project_id: projectId, user_id: userId },
  });
  console.log(`API removed member ${userId} from project ${projectId}`);
};

// --- Task Queries ---

// Fetch all tasks
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>("/tasks/my-tasks");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user tasks:", error);
    throw error;
  }
};

// Fetch a single task by ID
export const fetchTaskById = async (id: string): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

// Create a new task
export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  const response = await api.post("/tasks", taskData);
  console.log("Task created:", response.data);
  return response.data;
};

// Update an existing task
export const updateTask = async (
  id: string,
  taskData: Partial<Task>
): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, taskData);
  console.log("Task updated:", response.data);
  return response.data;
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
  console.log(`Task ${id} deleted.`);
};

// Archive a task
export const archiveTask = async (id: string): Promise<void> => {
  await api.put(`/tasks/${id}/archive`);
  console.log(`Task ${id} archived.`);
};

// Update task assignments
export const updateTaskAssignments = async (
  id: string,
  userIds: string[]
): Promise<Task> => {
  const response = await api.put(`/tasks/${id}/assignments`, {
    user_ids: userIds,
  });
  console.log(`Assignments for task ${id} updated:`, response.data);
  return response.data;
};

// --- Comment Queries ---

// Fetch all comments for a specific task
export const fetchTaskComments = async (taskId: string): Promise<Comment[]> => {
  const response = await api.get(`/comments/${taskId}/`);
  console.log("API fetched task comments:", response.data);
  return response.data;
};

// Fetch a single comment by its ID
export const fetchCommentById = async (commentId: string): Promise<Comment> => {
  const response = await api.get(`/comments/comment/${commentId}`);
  console.log("API fetched single comment:", response.data);
  return response.data;
};

// Add a new comment to a task
export const addTaskComment = async (commentData: {
  task_id: string;
  content: string;
  parent_comment_id?: string | null;
}): Promise<Comment> => {
  const response = await api.post(`/comments`, commentData);
  console.log("API added comment:", response.data);
  return response.data;
};

// Update a comment
export const updateTaskComment = async (
  commentId: string,
  content: string
): Promise<Comment> => {
  const response = await api.put(`/comments/${commentId}`, { content });
  console.log("API updated comment:", response.data);
  return response.data;
};

// Delete a comment
export const deleteTaskComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
  console.log("API deleted comment:", commentId);
};

// Fetch user by ID (for comment authors)
export const fetchUserById = async (userId: string): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  console.log("API fetched user:", response.data);
  return response.data;
};

// --- User Queries ---

// Fetch all users (e.g., for assigning tasks or displaying a user directory)
export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};

// --- Notification Queries ---

// Create a new notification
export const createNotification = async (
  notificationData: NotificationCreateRequest
): Promise<Notification> => {
  const response = await api.post("/notifications", notificationData);
  console.log("API created notification:", response.data);
  return response.data;
};

// Get all notifications for the current user, with optional unread filter
export const fetchNotifications = async (
  unreadOnly: boolean = false
): Promise<Notification[]> => {
  const params = unreadOnly ? { unread: true } : {};
  const response = await api.get("/notifications", { params });
  console.log("API fetched notifications:", response.data);
  return response.data;
};

// Get a specific notification by ID (Assuming this is a GET endpoint)
export const fetchNotificationById = async (
  notificationId: string
): Promise<Notification> => {
  const response = await api.get(`/notifications/${notificationId}`);
  console.log(`API fetched notification ${notificationId}:`, response.data);
  return response.data;
};

// Mark a notification as read
export const markNotificationAsRead = async (
  notificationId: string
): Promise<Notification> => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  console.log(
    `API marked notification ${notificationId} as read:`,
    response.data
  );
  return response.data;
};

// NOTE: The backend endpoint `DELETE /notifications/{notification_id}` was noted.
// If you need a function to delete a notification, you would add:
// export const deleteNotification = async (notificationId: string): Promise<void> => {
//   await api.delete(`/notifications/${notificationId}`);
//   console.log(`API deleted notification: ${notificationId}`);
// };

export default api;
