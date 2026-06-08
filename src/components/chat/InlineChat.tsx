'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { sendChatMessage } from '@/services/chatService';
import ReactMarkdown from 'react-markdown';
import { Trash2, Plus, MessageSquare, AlertTriangle, Copy, Check, Menu, X } from 'lucide-react';

interface InlineChatProps {
  tableData?: any[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

const RECOMMENDED_QUESTIONS = [
  "Which customer have a high risk of churning?",
  "What are the main factors causing churn based on this data?",
  "Show a summary of current customer data.",
  "How can we retain high-risk customers?"
];

export default function InlineChat({ tableData = [] }: InlineChatProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Fix Hydration Mismatch
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [sidebarWidth, setSidebarWidth] = useState(250); 
  const isResizing = useRef(false);

  // Mencegah Hydration Mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing.current && containerRef.current) {
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const newWidth = mouseMoveEvent.clientX - containerLeft;
      
      if (newWidth >= 150 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  useEffect(() => {
    const savedSessions = localStorage.getItem('keeva_chat_sessions');
    let parsedSessions: ChatSession[] = [];
    
    if (savedSessions) {
      parsedSessions = JSON.parse(savedSessions).filter((s: ChatSession) => s.messages.length > 0);
    }

    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now(),
    };

    setSessions([newSession, ...parsedSessions]);
    setCurrentSessionId(newSessionId);
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('keeva_chat_sessions', JSON.stringify(sessions));
    } else {
      localStorage.removeItem('keeva_chat_sessions');
    }
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    if (currentSession?.messages.length === 0) {
      setIsSidebarOpen(false);
      return;
    }

    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setIsSidebarOpen(false); 
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessionToDelete(id);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      const updatedSessions = sessions.filter(s => s.id !== sessionToDelete);
      
      if (updatedSessions.length === 0) {
        const newSessionId = Date.now().toString();
        updatedSessions.push({
          id: newSessionId,
          title: 'New Chat',
          messages: [],
          updatedAt: Date.now(),
        });
      }

      setSessions(updatedSessions);
      if (currentSessionId === sessionToDelete) {
        setCurrentSessionId(updatedSessions[0].id);
      }
      setSessionToDelete(null); 
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const processMessage = async (text: string) => {
    if (!text.trim()) return;

    let activeSessionId = currentSessionId;
    if (!activeSessionId) {
      activeSessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: activeSessionId,
        title: text.substring(0, 25) + '...',
        messages: [],
        updatedAt: Date.now(),
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(activeSessionId);
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    const sessionHistory = sessions
      .find(s => s.id === activeSessionId)?.messages
      .slice(-10)
      .map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : 'user',
        content: msg.content
      })) || [];

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { 
          ...s, 
          messages: [...s.messages, userMsg], 
          updatedAt: Date.now(),
          title: s.title === 'New Chat' ? text.substring(0, 25) + '...' : s.title 
        };
      }
      return s;
    }).sort((a, b) => b.updatedAt - a.updatedAt));

    setInput('');
    setIsLoading(true);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px'; 
    }

    try {
      const reply = await sendChatMessage({ 
        message: userMsg.content, 
        churn_data: tableData,
        history: sessionHistory 
      });
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: reply,
      };
      
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, botMsg], updatedAt: Date.now() };
        }
        return s;
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    await processMessage(input);
  };

  return (
    <>
      <div ref={containerRef} className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm flex overflow-hidden h-[80vh] md:h-[600px] min-h-[500px] relative">
        
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/30 z-20 md:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR - HISTORY CHAT */}
        <div 
          className={`absolute md:relative z-30 h-full bg-gray-50 flex flex-col flex-shrink-0 border-r border-gray-200 transition-transform duration-300 w-64 md:w-auto ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
          style={{ width: isMounted && window.innerWidth >= 768 ? sidebarWidth : undefined }}
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center gap-2">
            <button 
              onClick={handleNewChat}
              className="flex-1 bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 text-gray-700 font-medium py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shadow-sm"
            >
              <Plus size={16} /> <span className="truncate">New Chat</span>
            </button>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-gray-500 hover:bg-gray-200 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {sessions.map((session) => (
              <div 
                key={session.id}
                onClick={() => {
                  setCurrentSessionId(session.id);
                  setIsSidebarOpen(false); 
                }}
                className={`group cursor-pointer flex items-center justify-between p-3 rounded-lg text-sm transition-colors ${
                  currentSessionId === session.id 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare size={14} className="flex-shrink-0" />
                  <span className="truncate">{session.title}</span>
                </div>
                {session.messages.length > 0 && (
                  <button 
                    onClick={(e) => handleDeleteClick(e, session.id)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0"
                    title="Delete Chat"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* DRAGGABLE RESIZER (HIDDEN ON MOBILE) */}
        <div
          onMouseDown={startResizing}
          className="hidden md:block w-1 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-colors flex-shrink-0 z-10"
          title="Geser untuk menyesuaikan ukuran"
        />

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col bg-white h-full relative min-w-0">
          
          {/* Mobile Header Toolbar */}
          <div className="md:hidden bg-white border-b border-gray-100 p-3 flex items-center gap-3 shrink-0 z-10 shadow-sm">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"
            >
              <Menu size={20} />
            </button>
            <span className="font-medium text-gray-800 text-sm truncate">
              {currentSession?.title || 'Chat'}
            </span>
          </div>

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-white/50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="space-y-3 opacity-60 flex flex-col items-center">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="text-sm text-gray-500 max-w-xs sm:max-w-sm">
                    KEEVA system is ready. Select a recommended question or type your own to start a new analysis.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 max-w-lg mt-4 px-2">
                  {RECOMMENDED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => processMessage(question)}
                      disabled={isLoading}
                      className="text-xs sm:text-sm bg-white border border-blue-200 text-blue-600 px-3 py-2 sm:px-4 sm:py-2 rounded-full hover:bg-blue-50 transition-all text-left shadow-sm disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 w-full max-w-[90%] sm:max-w-[85%] ${
                  msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                {/* Chat Bubble */}
                <div
                  className={`p-3 sm:p-4 rounded-xl text-sm leading-relaxed break-words whitespace-pre-wrap w-fit ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                      : 'bg-gray-50 border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <div className="prose prose-sm max-w-none break-words">
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0 break-words" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="pl-1 break-words" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(msg.id, msg.content)}
                  className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors px-1 mt-0.5"
                  title="Copy text"
                >
                  {copiedId === msg.id ? (
                    <>
                      <Check size={12} className="text-green-500" /> 
                      <span className="text-green-500 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> 
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
            
            {isLoading && (
              <div className="text-sm text-gray-500 self-start bg-gray-50 border border-gray-100 p-3 sm:p-4 rounded-xl rounded-bl-none shadow-sm flex gap-1 items-center mb-4">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-gray-100 flex items-end gap-2 sm:gap-3 z-10">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = '48px';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isLoading) {
                    handleSendMessage(e);
                  }
                }
              }}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 px-3 py-3 sm:px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm resize-none overflow-y-auto custom-scrollbar"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0 h-[48px]"
            >
              Kirim
            </button>
          </form>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Chat</h3>
            </div>
            
            <p className="text-sm text-gray-500 mb-6 sm:pl-13">
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSessionToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm"
              >
                Yes, Delete 
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}