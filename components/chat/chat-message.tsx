import { Message } from "@prisma/client";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn(
      "flex items-start gap-4",
      isUser && "flex-row-reverse"
    )}>
      <Avatar />
      <div className={cn(
        "rounded-lg p-4 max-w-[80%]",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}