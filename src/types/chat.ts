export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

export interface ChatRequestPayload {
  message: string;
  // Tambahkan field lain jika backend lo butuh, 
  // misalnya customer_id seperti di error traceback lo sebelumnya:
  // customer_id?: string; 
}