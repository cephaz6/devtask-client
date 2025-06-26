import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Notification } from "@/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  markNotificationAsRead,
  acceptInvite,
  declineInvite,
  fetchProjectMembers,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle } from "lucide-react";

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const [open, setOpen] = useState(false);
  const [localRead, setLocalRead] = useState(notification.is_read);
  const [loading, setLoading] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const projectId = notification.related_project_id;
  const taskId = notification.related_task_id;

  const handleClick = async () => {
    if (!localRead) {
      try {
        await markNotificationAsRead(notification.id);
        setLocalRead(true);
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }

    if (notification.type === "task_assignment" && taskId) {
      navigate(`./tasks/${taskId}`);
    }
  };

  useEffect(() => {
    const checkMembership = async () => {
      if (!projectId || !user) return;
      try {
        const members = await fetchProjectMembers(projectId);
        const isMember = members.some(
          (member) => member.user_id === user.user_id
        );
        setHasAccepted(isMember);
      } catch (err) {
        console.error("Failed to fetch project members", err);
      }
    };

    if (open && notification.type === "project_invite") {
      checkMembership();
    }
  }, [open, projectId, user, notification.type]);

  const handleAccept = async () => {
    setLoading(true);
    try {
      if (!user) {
        toast.error("User not authenticated.");
        return;
      }
      await acceptInvite(projectId!, user.user_id);
      toast.success("You have joined the project.");
      setHasAccepted(true);
      setOpen(false);
    } catch (err) {
      toast.error("Failed to accept invitation.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      if (!user) {
        toast.error("User not authenticated.");
        return;
      }
      await declineInvite(projectId!, user.user_id);
      toast.success("You declined the invitation.");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to decline invitation.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToProject = () => {
    if (projectId) navigate(`./projects/${projectId}`);
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
      <DialogContent className="space-y-4">
        <p>{notification.message}</p>

        {hasAccepted ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle size={18} />
              <span className="text-sm font-medium">
                You’ve already joined this project.
              </span>
            </div>
            <Button size="sm" onClick={handleGoToProject} variant="outline">
              Go to Project
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
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
            <Button
              size="sm"
              variant="ghost"
              onClick={handleGoToProject}
              className="text-muted-foreground"
            >
              Go to Project
            </Button>
          </div>
        )}
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
