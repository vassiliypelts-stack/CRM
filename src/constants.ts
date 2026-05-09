import { LeadStatus, Column } from './types';

export const COLUMNS: Column[] = [
  {
    id: LeadStatus.NEW,
    title: 'Новый',
    color: 'bg-blue-50/50',
    borderColor: 'border-blue-400'
  },
  {
    id: LeadStatus.IN_PROGRESS,
    title: 'В работе',
    color: 'bg-yellow-50/50',
    borderColor: 'border-yellow-400'
  },
  {
    id: LeadStatus.NEGOTIATION,
    title: 'Переговоры',
    color: 'bg-orange-50/50',
    borderColor: 'border-orange-400'
  },
  {
    id: LeadStatus.WON,
    title: 'Выиграно',
    color: 'bg-green-50/50',
    borderColor: 'border-green-400'
  },
  {
    id: LeadStatus.LOST,
    title: 'Проиграно',
    color: 'bg-red-50/50',
    borderColor: 'border-red-400'
  }
];

export const LEAD_SOURCES = [
  'Сайт',
  'Telegram',
  'WhatsApp',
  'Звонок',
  'Рекомендация'
] as const;
