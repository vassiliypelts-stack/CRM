import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Lead } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Tag } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: 'Lead',
      lead,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-slate-100 rounded-lg h-32 border-2 border-dashed border-slate-300 mb-3"
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-3 cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-primary/20 transition-all shadow-sm group"
      onClick={() => onClick(lead)}
    >
      <CardContent className="p-4">
        <h3 className="font-semibold text-slate-900 mb-2 truncate group-hover:text-primary transition-colors">
          {lead.name}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-slate-500">
            <DollarSign className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <span className="font-medium text-slate-700">
              {lead.amount.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          
          <div className="flex items-center text-sm text-slate-500">
            <Tag className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <Badge variant="secondary" className="text-[10px] py-0 h-4 bg-slate-100 text-slate-600 border-none">
              {lead.source}
            </Badge>
          </div>
          
          <div className="flex items-center text-xs text-slate-400 pt-1">
            <Calendar className="w-3 h-3 mr-1" />
            {format(new Date(lead.createdAt), 'd MMM yyyy', { locale: ru })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
