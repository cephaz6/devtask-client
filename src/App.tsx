import { Routes, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import NotFound from "@/pages/404/NotFound";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Tasks from "@/pages/dashboard/task/Tasks";
import Projects from "@/pages/dashboard/project/Projects";
import ThemeProvider from "./components/providers/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Register from "./pages/auth/Register";
import ProfilePage from "./pages/dashboard/user/Profile";
import TaskPage from "./pages/dashboard/task/TaskPage";
import ProjectPage from "./pages/dashboard/project/ProjectPage";
import Copilot from "./pages/dashboard/copilot/Copilot";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Register />} />

          {/* Protected Dashboard Layout */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />

            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/:id" element={<TaskPage />} />

            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectPage />} />

            <Route path="my-profile" element={<ProfilePage />} />

            <Route path="co-pilot" element={<Copilot />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
