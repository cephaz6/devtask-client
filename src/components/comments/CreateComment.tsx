// src/components/comments/CreateComment.tsx

import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUserInitials } from "@/helpers/taskHelpers"; // Re-use the helper

interface CreateCommentProps {
  onSubmit: (content: string) => void;
  isSubmitting: boolean;
  placeholder?: string;
  initialContent?: string;
  onCancel?: () => void;
  showCancelButton?: boolean;
  focusOnMount?: boolean;
}

const CreateComment: React.FC<CreateCommentProps> = ({
  onSubmit,
  isSubmitting,
  placeholder = "Write a comment...",
  initialContent = "",
  onCancel,
  showCancelButton = false,
  focusOnMount = false,
}) => {
  const [content, setContent] = useState(initialContent);
  const { user: authUser } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    if (focusOnMount && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [focusOnMount]);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent(""); // Clear the input after submission
    }
  };

  const handleCancel = () => {
    setContent("");
    onCancel?.(); // Call the optional onCancel prop
  };

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">
          {getUserInitials(authUser)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-3">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-[80px]"
          disabled={isSubmitting}
        />
        <div className="flex justify-end gap-2">
          {showCancelButton && (
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
