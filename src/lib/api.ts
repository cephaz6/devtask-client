// src/lib/api.ts
import axios from "axios";
import type { Task, Project, Comment, User } from "@/types"; // Import all necessary types

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

// Fetch all projects
export const fetchProjects = async (): Promise<Project[]> => {
  const response = await api.get("/project"); // Assuming "/project" fetches all projects
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

// --- Task Queries ---

// Fetch all tasks
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");
  return response.data;
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

// --- Comment Queries ---

// Add these comment-related functions to your existing api.ts file

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
// Add a new comment to a task
export const addTaskComment = async (commentData: {
  task_id: string;
  content: string;
  parent_comment_id?: string | null;
}): Promise<Comment> => {
  const response = await api.post(`/comments`, commentData); // Fixed endpoint
  console.log("API added comment:", response.data);
  return response.data;
};

// Update a comment (if you need this functionality)
export const updateTaskComment = async (
  commentId: string,
  content: string
): Promise<Comment> => {
  const response = await api.put(`/comments/${commentId}`, { content });
  console.log("API updated comment:", response.data);
  return response.data;
};

// Delete a comment (if you need this functionality)
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

export default api;
