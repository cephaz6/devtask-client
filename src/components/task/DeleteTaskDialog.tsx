// src/components/task/DeleteTaskDialog.tsx
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
import { Trash2 } from "lucide-react"; // Importing Trash2 icon

interface DeleteTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  taskTitle: string;
}

const DeleteTaskDialog: React.FC<DeleteTaskDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  taskTitle,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-6 w-6" /> Delete Task ⚠️
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "<strong>{taskTitle}</strong>"? This
            action cannot be undone and will remove all comments, assignments,
            and task data permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive-foreground"
          >
            Delete Task
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTaskDialog;
