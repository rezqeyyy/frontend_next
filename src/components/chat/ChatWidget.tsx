'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { sendChatMessage } from '@/services/chatService';
import ReactMarkdown from 'react-markdown';
import { Trash2 } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('keeva_widget_history');
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('keeva_widget_history', JSON.stringify(messages));
    } else {
      localStorage.removeItem('keeva_widget_history');
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClearHistory = () => {
    if (window.confirm("Delete this chat?")) {
      setMessages([]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    const chatHistory = messages.slice(-10).map((msg) => ({
      role: msg.role === 'bot' ? 'assistant' : 'user',
      content: msg.content
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await sendChatMessage({ 
        message: userMsg.content,
        history: chatHistory 
      });
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: reply,
      };
      
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] sm:w-80 h-[70vh] sm:h-96 max-h-[600px] bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shrink-0">
            <h3 className="font-semibold text-sm">KEEVA AI Assistant</h3>
            <div className="flex gap-4 items-center">
              {messages.length > 0 && (
                <button onClick={handleClearHistory} className="text-white/80 hover:text-white transition-colors" title="Clear Chat">
                  <Trash2 size={16} />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white font-bold p-1" title="Close">
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.length === 0 && (
              <p className="text-center text-sm text-gray-400 mt-10">
                Hello! How can I help you today?
              </p>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-xl text-sm break-words ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white self-end rounded-br-none'
                    : 'bg-white border border-gray-200 text-gray-800 self-start rounded-bl-none shadow-sm'
                }`}
              >
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="text-sm text-gray-500 self-start bg-white border border-gray-100 p-3 rounded-xl rounded-bl-none shadow-sm flex gap-1 items-center">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white text-sm transition-colors min-w-0"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-transform hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
}