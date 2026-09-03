export type MessageSeverity = 'success' | 'info' | 'warn' | 'error';
export interface InaMessage {
  severity: MessageSeverity;
  summary?: string;
  detail: string;
  closable?: boolean;
  life?: number;
  sticky?: boolean;
  key?: string;
}
