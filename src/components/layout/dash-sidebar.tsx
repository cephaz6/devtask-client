import { Home, ListTodo, Folder, Bot, RailSymbol } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSidebar } from "../providers/SidebarProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const items = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Projects", icon: Folder, url: "/dashboard/projects" },
  { title: "Tasks", icon: ListTodo, url: "/dashboard/tasks" },
  { title: "Co-Pilot", icon: Bot, url: "/dashboard/co-pilot" },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();

  return (
    <TooltipProvider>
      <aside
        className={`h-full border-r p-4 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <Link to={"../dashboard"}>
          <div className="mb-6 flex items-center justify-center text-xl font-bold">
            {collapsed ? "D" : "DevTask"}
            <RailSymbol className="text-avocado-500" />
          </div>
        </Link>
        <hr />
        {/* Menu */}
        <nav className="flex flex-col gap-5 mt-20">
          {items.map((item) => {
            const isActive = location.pathname === item.url;

            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.url}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 border-l-4 ${
                      isActive
                        ? "border-primary bg-muted text-primary"
                        : "border-transparent text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{item.title}</TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
