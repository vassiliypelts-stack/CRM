export enum LeadStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost'
}

export type LeadSource = 'Сайт' | 'Telegram' | 'WhatsApp' | 'Звонок' | 'Рекомендация';

export interface Lead {
  id: string;
  name: string;
  amount: number;
  source: LeadSource;
  createdAt: string;
  status: LeadStatus;
  phone: string;
  email: string;
  notes: string;
}

export interface Column {
  id: LeadStatus;
  title: string;
  color: string;
  borderColor: string;
}
