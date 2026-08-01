import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from '@/components/ui/message-scroller';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  MessageFooter,
} from '@/components/ui/message';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Marker, MarkerContent } from '@/components/ui/marker';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { BotIcon, SendIcon, SparklesIcon, XIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const INITIAL_MESSAGES = [
  {
    id: '1',
    role: 'assistant',
    content:
      "Hi there! 👋 I'm your AI assistant. How can I help you with your tasks today?",
    time: '12:00 PM',
  },
];

const AI_RESPONSES = [
  'I can help you organize your tasks more efficiently. Would you like me to suggest a prioritization strategy?',
  "Great question! Based on your current board, I'd recommend breaking that task into smaller subtasks for better tracking.",
  "I've analyzed your workflow — it looks like you have 3 tasks approaching their deadline. Want me to highlight them?",
  'Sure thing! I can help you create a new task. Just tell me the title, description, and priority level.',
  "Here's a tip: try grouping related tasks into the same column and using labels to categorize them by project. 🏷️",
  'I noticed some tasks have been in the "In Progress" column for a while. Would you like to review them together?',
  'Absolutely! I can draft a summary of your completed tasks this week. Give me a moment... ✨',
];

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const ChatbotDrawer = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking & response
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const aiResponse = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
        time: formatTime(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, delay);
  }, [inputValue, isTyping]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Drawer swipeDirection="right">
      <Tooltip>
        <TooltipTrigger
          render={
            <DrawerTrigger render={<Button variant="outline" size="icon" />} />
          }
        >
          <BotIcon />
          <span className="sr-only">Chat dengan AI (in development)</span>
        </TooltipTrigger>
        <TooltipContent>Chat dengan AI (in development)</TooltipContent>
      </Tooltip>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center gap-3 border-b pb-3">
          <Avatar size="sm">
            <AvatarFallback>
              <BotIcon />
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <DrawerTitle className="text-sm">
              AI Assistant (in development)
            </DrawerTitle>
            <DrawerDescription className="text-xs">
              {isTyping ? (
                <span className="shimmer text-primary">Typing…</span>
              ) : (
                'Online'
              )}
            </DrawerDescription>
          </div>
          <DrawerClose render={<Button variant="ghost" size="icon-sm" />}>
            <XIcon />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </DrawerHeader>

        {/* Chat area */}
        <MessageScrollerProvider autoScroll>
          <MessageScroller className="flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent className="p-4">
                <Marker variant="separator">
                  <MarkerContent>Today</MarkerContent>
                </Marker>

                {messages.map((msg) => (
                  <MessageScrollerItem
                    key={msg.id}
                    messageId={msg.id}
                    scrollAnchor={msg.role === 'user'}
                  >
                    <Message align={msg.role === 'user' ? 'end' : 'start'}>
                      {msg.role === 'assistant' && (
                        <MessageAvatar>
                          <Avatar size="sm">
                            <AvatarFallback>
                              <BotIcon />
                            </AvatarFallback>
                          </Avatar>
                        </MessageAvatar>
                      )}
                      <MessageContent>
                        {msg.role === 'assistant' && (
                          <MessageHeader>AI Assistant</MessageHeader>
                        )}
                        <Bubble
                          variant={msg.role === 'user' ? 'default' : 'muted'}
                          align={msg.role === 'user' ? 'end' : 'start'}
                        >
                          <BubbleContent>{msg.content}</BubbleContent>
                        </Bubble>
                        <MessageFooter>{msg.time}</MessageFooter>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}

                {isTyping && (
                  <MessageScrollerItem messageId="typing" scrollAnchor={false}>
                    <Message align="start">
                      <MessageAvatar>
                        <Avatar size="sm">
                          <AvatarFallback>
                            <BotIcon />
                          </AvatarFallback>
                        </Avatar>
                      </MessageAvatar>
                      <MessageContent>
                        <Bubble variant="muted" align="start">
                          <BubbleContent>
                            <span className="shimmer inline-flex gap-1">
                              Thinking…
                            </span>
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                )}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>

        {/* Input area */}
        <div className="border-t p-3">
          <InputGroup>
            <InputGroupInput
              placeholder="Ask me anything…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                onClick={sendMessage}
                disabled={!inputValue.trim() || isTyping}
              >
                <SendIcon data-icon="inline-start" />
                <span className="sr-only">Send</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ChatbotDrawer;
