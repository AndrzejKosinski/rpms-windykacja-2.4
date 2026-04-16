export interface LogEventPayload {
  timestamp: string;
  event_name: string;
  user_email: string;
  session_id: string;
  metadata: string;
  url: string;
  user_agent: string;
}
