'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { sendChatMessage } from '@/services/chatService';

interface InlineChatProps {
  tableData?: any[];
}

// Daftar pertanyaan rekomendasi
const RECOMMENDED_QUESTIONS = [
  "Siapa customer yang paling berisiko churn bulan ini?",
  "Apa faktor utama penyebab churn dari data ini?",
  "Tampilkan ringkasan data customer saat ini.",
  "Bagaimana cara mempertahankan customer dengan risiko tinggi?"
];

export default function InlineChat({ tableData = [] }: InlineChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Pisahkan logika pengiriman pesan agar bisa dipanggil dari input & klik rekomendasi
  const processMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await sendChatMessage({ message: userMsg.content, churn_data: tableData });
      
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await processMessage(input);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden h-[500px]">
      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="space-y-3 opacity-60 flex flex-col items-center">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-sm text-gray-500 max-w-sm">
                Sistem KEEVA siap membantu. Pilih pertanyaan di bawah atau ketik pertanyaan Anda sendiri.
              </p>
            </div>

            {/* Tombol Rekomendasi Pertanyaan */}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mt-4">
              {RECOMMENDED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => processMessage(question)}
                  disabled={isLoading}
                  className="text-xs sm:text-sm bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-all text-left shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
            className={`max-w-[75%] p-4 rounded-xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white self-end rounded-br-none shadow-sm'
                : 'bg-white border border-gray-200 text-gray-800 self-start rounded-bl-none shadow-sm'
            }`}
          >
            {msg.content}
          </div>
        ))}
        
        {isLoading && (
          <div className="text-sm text-gray-500 self-start bg-white border border-gray-100 p-4 rounded-xl rounded-bl-none flex gap-1 items-center shadow-sm">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pesan untuk AI..."
          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}