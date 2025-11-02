'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const workerUrl = 'https://portfolio-chatbot.trhoang220703.workers.dev';

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Chat Container */}
          <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-md:bottom-0 max-md:right-0 max-md:left-0 max-md:top-0 max-md:w-full max-md:h-full max-md:rounded-none">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Ask me anything!</h3>
                  <p className="text-sm text-indigo-100">Powered by AI</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chatbot iframe */}
              <iframe
                src={workerUrl}
                className="flex-1 w-full border-0"
                title="Portfolio Chatbot"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
