export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

export interface ChatRequestPayload {
  message: string;
  customer_id?: string;
  churn_data?: any[];
}