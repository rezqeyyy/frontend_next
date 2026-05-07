import { ChatRequestPayload } from '@/types/chat';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const sendChatMessage = async (payload: ChatRequestPayload): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/chat`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // === UBAH BAGIAN INI ===
    // Tambahkan data.reply di paling depan biar dia nangkep key "reply" dari backend lu
    return data.reply || data.response || data.message || "Pesan diterima, tapi format balasan tidak dikenali."; 

  } catch (error) {
    console.error('Error sending chat message:', error);
    return 'Maaf, terjadi kesalahan saat menghubungi server AI.';
  }
};