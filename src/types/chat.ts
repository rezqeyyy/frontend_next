export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

export interface ChatRequestPayload {
  message: string;
  customer_id?: string;
  churn_data?: any[];
  // Tambahkan property history untuk memori AI
  history?: { role: string; content: string }[];
}