import axios, { AxiosError } from "axios";
import type {
  Task,
  Project,
  Comment,
  User,
  ProjectMember,
  Notification,
  NotificationType,
  NotificationCreateRequest,
} from "@/types";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await api.get("/auth/me");
  return response.data;
};

// --- Project Queries ---
export const fetchProjects = async (): Promise<Project[]> => {
  const response = await api.get("/project/my-projects");
  console.log("API fetched projects:", response.data);
  return response.data;
};

export const fetchProjectDetails = async (id: string): Promise<Project> => {
  const response = await api.get(`/project/${id}/details`);
  console.log(`API fetched project details for ${id}:`, response.data);
  return response.data;
};

export const createProject = async (
  projectData: Partial<Project>
): Promise<Project> => {
  const response = await api.post("/project", projectData);
  console.log("Project created:", response.data);
  return response.data;
};

export const updateProject = async (
  id: string,
  projectData: Partial<Project>
): Promise<Project> => {
  const response = await api.put(`/project/${id}`, projectData);
  console.log("Project updated:", response.data);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/project/${id}`);
  console.log(`Project ${id} deleted.`);
};

export const fetchProjectMembers = async (
  projectId: string
): Promise<User[]> => {
  try {
    const response = await api.get(`/project-members/${projectId}/members`);
    console.log(`API fetched members for project ${projectId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch members for project ${projectId}:`, error);
    throw error;
  }
};

// --- Project Member Endpoints ---
export interface ProjectInvitePayload {
  project_id: string; // Mandatory project_id
  user_identifier: string; // The single identifier field (can be user_id or email)
  role: "owner" | "member"; // Mandatory role
}

// Invite a user to a project by sending the ProjectInvitePayload directly
export const inviteProjectMember = async (
  payload: ProjectInvitePayload // The function now explicitly accepts the structured payload
): Promise<ProjectMember> => {
  try {
    // Send the entire payload object directly to the backend
    const response = await api.post("/project-members/invite", payload);
    console.log("API invited project member:", response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.message ||
      "An unknown error occurred";
    console.error("Error inviting project member:", errorMessage);
    throw new Error(errorMessage);
  }
};

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
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>("/tasks/my-tasks");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user tasks:", error);
    throw error;
  }
};

export const fetchTaskById = async (id: string): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  const response = await api.post("/tasks", taskData);
  console.log("Task created:", response.data);
  return response.data;
};

export const updateTask = async (
  id: string,
  taskData: Partial<Task>
): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, taskData);
  console.log("Task updated:", response.data);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
  console.log(`Task ${id} deleted.`);
};

export const archiveTask = async (id: string): Promise<void> => {
  await api.put(`/tasks/${id}/archive`);
  console.log(`Task ${id} archived.`);
};

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
export const fetchTaskComments = async (taskId: string): Promise<Comment[]> => {
  const response = await api.get(`/comments/${taskId}/`);
  console.log("API fetched task comments:", response.data);
  return response.data;
};

export const fetchCommentById = async (commentId: string): Promise<Comment> => {
  const response = await api.get(`/comments/comment/${commentId}`);
  console.log("API fetched single comment:", response.data);
  return response.data;
};

export const addTaskComment = async (commentData: {
  task_id: string;
  content: string;
  parent_comment_id?: string | null;
}): Promise<Comment> => {
  const response = await api.post(`/comments`, commentData);
  console.log("API added comment:", response.data);
  return response.data;
};

export const updateTaskComment = async (
  commentId: string,
  content: string
): Promise<Comment> => {
  const response = await api.put(`/comments/${commentId}`, { content });
  console.log("API updated comment:", response.data);
  return response.data;
};

export const deleteTaskComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
  console.log("API deleted comment:", commentId);
};

export const fetchUserById = async (userId: string): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  console.log("API fetched user:", response.data);
  return response.data;
};

// --- User Queries ---
export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};

// --- Notification Queries ---
export const createNotification = async (
  notificationData: NotificationCreateRequest
): Promise<Notification> => {
  const response = await api.post("/notifications", notificationData);
  console.log("API created notification:", response.data);
  return response.data;
};

export const fetchNotifications = async (
  unreadOnly: boolean = false
): Promise<Notification[]> => {
  const params = unreadOnly ? { unread: true } : {};
  const response = await api.get("/notifications", { params });
  console.log("API fetched notifications:", response.data);
  return response.data;
};

export const fetchNotificationById = async (
  notificationId: string
): Promise<Notification> => {
  const response = await api.get(`/notifications/${notificationId}`);
  console.log(`API fetched notification ${notificationId}:`, response.data);
  return response.data;
};

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

export default api;
