import { Bell } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "@/lib/api";
import type { Notification } from "@/types/index";
import NotificationItem from "./NotificationItem";

const NotificationBell = () => {
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(false),
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Popover>
      <PopoverTrigger className="relative">
        <Bell className="w-5 h-5 text-muted-foreground hover:text-primary" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 px-1 py-0 text-xs bg-red-500 text-white rounded-full">
            {unreadCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2 space-y-1">
        <h4 className="text-sm font-semibold text-center mb-2">
          Notifications
        </h4>
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-sm">No notifications.</p>
        ) : (
          notifications
            .slice(0, 5)
            .map((notif) => (
              <NotificationItem key={notif.id} notification={notif} />
            ))
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
