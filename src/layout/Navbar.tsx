import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DollarSign, LogOut, Menu, User, UsersRound } from "lucide-react";
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

const Navbar = () => {
  return (
    <nav className="p-4 flex items-center justify-between">
      <p>Collapse</p>
      <div className="flex items-center gap-4">
        <Link to={"/dashboard"}>Dashboard</Link>

        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                className="rounded-full w-8 h-8"
                src="https://github.com/shadcn.png"
                alt="@shadcn"
              />
              <AvatarFallback>Cephas</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <User />
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-[1.2rem] w-[1.2rem] mr-2" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              <UsersRound className="h-[1.2rem] w-[1.2rem] mr-2" />
              Team
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DollarSign className="h-[1.2rem] w-[1.2rem] mr-2" />
              Subscription
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700">
              <span className="sr-only">Open Menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/projects">Projects</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
