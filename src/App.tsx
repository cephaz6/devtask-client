import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Routes, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
// import Signup from "@/pages/auth/Signup";
import Dashboard from "@/pages/dashboard/Dashboard";
import Layout from "@/layout/Layout";
import NotFound from "./pages/404/NotFound";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
