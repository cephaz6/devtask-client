// src/components/layout/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { AppSidebar } from "./dash-sidebar";
import { SidebarProvider } from "../providers/SidebarProvider";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
