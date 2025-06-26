import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  ChevronsLeft,
  ChevronsRight,
  DollarSign,
  LogOut,
  User,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";
import { useSidebar } from "../providers/SidebarProvider";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "../project/navbar/NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { collapsed, toggle } = useSidebar();

  return (
    <nav className="p-2 flex items-center justify-between">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggle}
        className="text-muted-foreground hover:text-primary transition"
      >
        {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
      </button>
      <div className="flex items-center gap-4">
        <Link to={"/dashboard"}>Dashboard</Link>
        <NotificationBell /> {/* <- Add this */}
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                className="rounded-full w-8 h-8"
                src="https://media.licdn.com/dms/image/v2/D4E03AQFe77rfSZesKw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1725513529102?e=1755129600&v=beta&t=hgSOiOLlsB7a4mvxiJT_s2eRhfZSqBRNOK8wf-exUUA"
                alt="@shadcn"
              />
              <AvatarFallback>{user?.full_name}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="p-5">
              {user?.full_name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to={"my-profile"}>
              <DropdownMenuItem>
                <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <UsersRound className="h-[1.2rem] w-[1.2rem] mr-2" />
              Team
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DollarSign className="h-[1.2rem] w-[1.2rem] mr-2" />
              Subscription
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} variant="destructive">
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
