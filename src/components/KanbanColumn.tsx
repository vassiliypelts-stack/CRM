import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lead, Column, LeadStatus } from '../types';
import { LeadCard } from './LeadCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanColumnProps {
  column: Column;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onAddLead: (status?: LeadStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, leads, onLeadClick, onAddLead }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const totalAmount = leads.reduce((sum, lead) => sum + lead.amount, 0);

  return (
    <div className="flex flex-col h-full min-w-[280px] w-full max-w-[350px]">
      <div className={`p-3 rounded-t-xl border-t-4 ${column.borderColor} ${column.color} flex items-center justify-between shadow-sm mb-4`}>
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-800">{column.title}</h2>
          <span className="bg-slate-200/50 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium">
            {leads.length}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Сумма</div>
          <div className="text-sm font-bold text-slate-700">
            {totalAmount.toLocaleString('ru-RU')} ₽
          </div>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto px-2 pb-4 space-y-3 min-h-[200px]"
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onClick={onLeadClick} />
          ))}
        </SortableContext>
        
        <Button
          variant="ghost"
          className="w-full border-2 border-dashed border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 h-12 flex items-center justify-center gap-2 transition-all rounded-xl"
          onClick={() => onAddLead(column.id)}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Добавить лид</span>
        </Button>
      </div>
    </div>
  );
}
