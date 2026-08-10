import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage.jsx';
import { Scale } from 'lucide-react';

export default function ChatWindow({ messages, isStreaming }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="page-view"
      style={{ overflowY: 'auto', padding: '24px 24px' }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              message={msg}
              isStreaming={isStreaming}
              isLast={i === messages.length - 1}
            />
          ))}
        </AnimatePresence>

        {/* Streaming indicator when AI response starts appearing */}
        {isStreaming && messages[messages.length - 1]?.role === 'assistant' && !messages[messages.length - 1]?.content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-[var(--text-muted)] pl-10 mt-2"
          >
            <Scale size={12} className="text-primary animate-pulse" />
            <span>Reasoning through frameworks…</span>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
