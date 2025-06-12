// src/components/task/ShareTaskDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react"; // Importing Share icon

interface ShareTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskUrl: string;
}

const ShareTaskDialog: React.FC<ShareTaskDialogProps> = ({
  open,
  onOpenChange,
  taskUrl,
}) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(taskUrl);
    onOpenChange(false); // Close dialog after copying
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Share className="h-6 w-6" /> Share Task 🔗
          </AlertDialogTitle>
          <AlertDialogDescription>
            Share this task with others using the link below:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="bg-muted p-3 rounded-lg break-all text-sm font-mono">
          {taskUrl}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleCopyLink}>Copy Link</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShareTaskDialog;
