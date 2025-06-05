# devtask-client

DevTask Tracker is a productivity and collaboration web application designed to
help software teams and individual developers effectively plan, track, and
manage development tasks. It combines a powerful task management backend built
with **FastAPI** and a modern, responsive frontend built with **React**,
**Vite**, and **Tailwind CSS**.

## 🌟 Features

- ✅ Create, assign, and update development tasks
- 🕒 Track estimated vs actual time spent
- 📌 Add task dependencies and watchers
- 📆 Set due dates with automated reminders
- 💬 Comment on tasks (team collaboration)
- 📊 Project dashboard for progress overview
- 🔐 User authentication and role-based access
- 📡 Real-time features powered by future integrations

## 📦 Tech Stack Overview

| **Aspect**               | **Tool / Library**    | **Description**                            |
| ------------------------ | --------------------- | ------------------------------------------ |
| **Framework**            | React                 | UI library for building interfaces         |
| **Build Tool**           | Vite                  | Fast development and build tool            |
| **Styling**              | Tailwind CSS          | Utility-first CSS framework                |
| **UI Component Library** | ShadCN/UI             | Accessible components styled with Tailwind |
| **State Management**     | Zustand               | Lightweight global state manager           |
| **API Communication**    | TanStack Query        | Data fetching, caching, and sync           |
| **Forms**                | React Hook Form + Zod | Form handling and validation               |
| **Routing**              | React Router v6       | Declarative routing for React              |
| **Real-Time**            | WebSockets (FastAPI)  | Live updates over WebSockets               |
| **Testing**              | Jest                  | Unit and integration testing               |
| **Linting**              | ESLint + Prettier     | Code quality and formatting                |
| **Component Testing**    | Storybook             | Isolated UI component development          |

---

## ✅ Notes

- **TanStack Query** will handle all API communication.
- **Zustand** will manage app-level state alongside context where needed.
- **ShadCN/UI** components will be used modularly for maintainability.
