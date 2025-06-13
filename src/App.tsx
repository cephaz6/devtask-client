import { Routes, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import NotFound from "@/pages/404/NotFound";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Tasks from "@/pages/dashboard/Tasks";
import Projects from "@/pages/dashboard/Projects";
import ThemeProvider from "./components/providers/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Register from "./pages/auth/Register";
import ProfilePage from "./pages/dashboard/Profile";
import TaskPage from "./pages/dashboard/TaskPage";
import ProjectPage from "./pages/dashboard/ProjectPage";

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
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
