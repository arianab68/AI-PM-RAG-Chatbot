import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in fade-in-50 slide-in-from-bottom-3 duration-500",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-[hsl(var(--chat-user-bg))] text-white"
            : "bg-[hsl(var(--chat-bot-bg))] text-foreground border border-border"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none
            prose-p:my-3 prose-p:leading-relaxed
            prose-headings:mt-6 prose-headings:mb-3 prose-headings:font-semibold
            prose-ul:my-4 prose-ul:space-y-2 prose-li:my-1
            prose-ol:my-4 prose-ol:space-y-2
            prose-strong:font-semibold prose-strong:text-foreground
            prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
