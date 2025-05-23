import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X } from 'lucide-react';

const messages = [
  "👋 Hey! I’m your UofT Housing helper.",
  "🏠 Find roommates, sublets, furniture, and long-term housing.",
  "🔐 Only UofT students can join using their @mail.utoronto.ca email.",
  "💬 Chat directly with sellers in real time.",
  "🎓 Built with ❤️ by students, for students.",
];

export default function AssistantBot() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.4 }}
          className="relative max-w-xs bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 px-4 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
        >
          {/* Arrow to Robot */}
          <div className="absolute -right-2 bottom-3 w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-600 transform rotate-45" />
          {messages[index]}
        </motion.div>
      </AnimatePresence>

      {/* Bot Circle with X */}
      <div className="relative">
        {/* Bot Icon */}
        <motion.div
          className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border shadow flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          <Bot className="text-uoft-blue dark:text-white" />
        </motion.div>

        {/* Close X on top-right of bot circle */}
        <button
          onClick={() => setVisible(false)}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white flex items-center justify-center shadow text-xs"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
