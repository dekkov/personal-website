// TypeScript types for Analytics

export interface TrackEventRequest {
  event: string;                     // Event name
  properties?: Record<string, any>;  // Additional data
}

export interface ContactRequest {
  name: string;                      // Required, 2-100 chars
  email: string;                     // Required, valid email
  company?: string;                  // Optional, max 100 chars
  message: string;                   // Required, 10-5000 chars
  honeypot?: string;                 // Spam trap (should be empty)
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: any;
}
