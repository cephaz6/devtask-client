// src/lib/api.ts
import axios from "axios";
import type { Task, Project, Comment, User, AuthResponse } from "@/types"; // Import all necessary types

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

// Fetch comments for a specific task (already existed, but typed)
export const fetchCommentsByTaskId = async (
  taskId: string
): Promise<Comment[]> => {
  const response = await api.get(`/tasks/${taskId}/comments`);
  return response.data;
};

// Create a new comment
// Assumes comment creation sends task_id and user_id in the payload
export const createComment = async (commentData: {
  task_id: string;
  user_id: string;
  text: string;
}): Promise<Comment> => {
  const response = await api.post("/comments", commentData); // Assuming a generic /comments endpoint for creation
  console.log("Comment created:", response.data);
  return response.data;
};

// Update an existing comment
export const updateComment = async (
  id: string,
  commentData: Partial<Comment>
): Promise<Comment> => {
  const response = await api.put(`/comments/${id}`, commentData); // Assuming /comments/:id for update
  console.log("Comment updated:", response.data);
  return response.data;
};

// Delete a comment
export const deleteComment = async (id: string): Promise<void> => {
  await api.delete(`/comments/${id}`); // Assuming /comments/:id for deletion
  console.log(`Comment ${id} deleted.`);
};

// --- User Queries ---

// Fetch all users (e.g., for assigning tasks or displaying a user directory)
export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};

// Fetch a single user by ID
export const fetchUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export default api;
