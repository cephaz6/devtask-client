import { Routes, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import NotFound from "@/pages/404/NotFound";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Tasks from "@/pages/dashboard/Tasks";
import Projects from "@/pages/dashboard/Projects";
import ThemeProvider from "./components/providers/ThemeProvider";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Dashboard Layout */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="projects" element={<Projects />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
