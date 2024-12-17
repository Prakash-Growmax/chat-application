import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  tokenCost: number;
}

export function ChatMessage({ content, role, timestamp, tokenCost }: ChatMessageProps) {
  return (
    <div className={cn('flex', role === 'user' ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'rounded-lg px-4 py-2 max-w-[80%]',
          role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        <div className="mt-1 flex justify-between gap-2 text-xs opacity-70">
          <span>{format(timestamp, 'HH:mm')}</span>
          <span>{tokenCost} tokens</span>
        </div>
      </div>
    </div>
  );
}