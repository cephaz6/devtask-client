import { useState } from "react";
import type { Notification } from "@/types/index";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { markNotificationAsRead } from "@/lib/api";
import { acceptInvite, declineInvite } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const [open, setOpen] = useState(false);
  const [localRead, setLocalRead] = useState(notification.is_read);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleClick = async () => {
    if (!localRead) {
      try {
        await markNotificationAsRead(notification.id);
        setLocalRead(true);
      } catch (err) {
        console.error("Mark as read failed", err);
      }
    }

    if (notification.type === "project_invite") {
      setOpen(true);
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      if (!user) {
        toast.error("User not authenticated.");
        return;
      }
      await acceptInvite(notification.related_project_id!, user.user_id);
      toast.success("You have joined the project.");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to accept invitation.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    console.log("Decline clicked");
    setLoading(true);
    try {
      if (!user) {
        toast.error("User not authenticated.");
        return;
      }
      await declineInvite(notification.related_project_id!, user.user_id);
      toast.success("You declined the invitation.");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to decline invitation.");
    } finally {
      setLoading(false);
    }
  };

  const timestamp = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  const itemClasses = cn(
    "rounded-lg p-3 text-sm cursor-pointer transition-colors",
    localRead
      ? "bg-background text-muted-foreground hover:bg-muted"
      : "bg-muted font-medium hover:bg-muted/80"
  );

  return notification.type === "project_invite" ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={handleClick} className={itemClasses}>
          <div>{notification.message}</div>
          <div className="text-xs text-muted-foreground mt-1">{timestamp}</div>
        </div>
      </DialogTrigger>
      <DialogContent className="space-y-3">
        <p>{notification.message}</p>
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            onClick={handleDecline}
            disabled={loading}
            variant="outline"
          >
            Decline
          </Button>
          <Button size="sm" onClick={handleAccept} disabled={loading}>
            Accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <div onClick={handleClick} className={itemClasses}>
      <div>{notification.message}</div>
      <div className="text-xs text-muted-foreground mt-1">{timestamp}</div>
    </div>
  );
};

export default NotificationItem;
