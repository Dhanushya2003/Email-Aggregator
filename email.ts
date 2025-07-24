export interface Email {
  subject: string;
  from: string;
  text: string;
  account?: string;
  folder?: string;
}
