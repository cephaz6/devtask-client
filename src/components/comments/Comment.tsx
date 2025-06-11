import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Reply, ChevronDown, ChevronRight } from "lucide-react";
import { formatDate, getUserInitials } from "@/helpers/taskHelpers";
import type { CommentResponse } from "@/types"; // Make sure CommentResponse type is correctly imported
import CreateComment from "./CreateComment"; // Import the CreateComment component

interface CommentProps {
  comment: CommentResponse;
  level?: number;
  onReplyInitiate: (commentId: string, authorName: string) => void;
  onToggleCollapse: (commentId: string) => void;
  isCollapsed: boolean;
  replyingToId: string | null;
  onSubmitReply: (content: string, parentId: string) => void;
  isSubmittingReply: boolean;
  onCancelReply: () => void;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  level = 0,
  onReplyInitiate,
  onToggleCollapse,
  isCollapsed,
  replyingToId,
  onSubmitReply,
  isSubmittingReply,
  onCancelReply,
}) => {
  const hasReplies = (comment.replies?.length || 0) > 0;
  const commentUser = comment.user;
  const isReplyingToThis = replyingToId === comment.id;

  return (
    <div
      key={comment.id}
      className={`relative ${
        level > 0 ? "ml-6 pl-4 border-l-2 border-muted" : ""
      }`}
    >
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getUserInitials(commentUser)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">
                {commentUser?.full_name || commentUser?.email || "Unknown User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(comment.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleCollapse(comment.id)}
                className="h-6 w-6 p-0"
                aria-label={isCollapsed ? "Expand replies" : "Collapse replies"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onReplyInitiate(
                  comment.id,
                  commentUser?.full_name || commentUser?.email || "Unknown User"
                )
              }
              className="h-6 px-2 text-xs"
              disabled={isReplyingToThis} // Disable if already replying to this one
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          </div>
        </div>

        <p className="text-sm mb-3">{comment.content}</p>

        {/* Reply form */}
        {isReplyingToThis && (
          <div className="border-t pt-3 mt-3">
            <CreateComment
              onSubmit={(content) => onSubmitReply(content, comment.id)}
              isSubmitting={isSubmittingReply}
              placeholder={`Replying to ${
                commentUser?.full_name || commentUser?.email || "this comment"
              }...`}
              initialContent={`@${
                commentUser?.full_name || commentUser?.email?.split("@")[0]
              } `}
              onCancel={onCancelReply}
              showCancelButton={true}
              focusOnMount={true}
            />
          </div>
        )}

        {/* Reply count indicator */}
        {hasReplies && (
          <div className="mt-3 text-xs text-muted-foreground">
            {comment.replies?.length}{" "}
            {comment.replies && comment.replies.length === 1
              ? "reply"
              : "replies"}
          </div>
        )}
      </div>

      {/* Render replies */}
      {hasReplies && !isCollapsed && (
        <div className="mt-3 space-y-3">
          {comment.replies?.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              level={level + 1}
              onReplyInitiate={onReplyInitiate}
              onToggleCollapse={onToggleCollapse}
              isCollapsed={isCollapsed} // Pass the same collapse state to children for now, or manage per comment.
              replyingToId={replyingToId}
              onSubmitReply={onSubmitReply}
              isSubmittingReply={isSubmittingReply}
              onCancelReply={onCancelReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
