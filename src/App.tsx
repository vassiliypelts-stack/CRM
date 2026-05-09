import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Lead, LeadStatus } from './types';
import { COLUMNS } from './constants';
import { KanbanColumn } from './components/KanbanColumn';
import { LeadCard } from './components/LeadCard';
import { LeadDialog } from './components/LeadDialog';
import { Button } from '@/components/ui/button';
import { Plus, LayoutDashboard, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

const LOCAL_STORAGE_KEY = 'leadflow_crm_leads';

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [initialStatus, setInitialStatus] = useState<LeadStatus | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load from localStorage
  useEffect(() => {
    const savedLeads = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch (e) {
        console.error('Failed to parse leads from localStorage', e);
      }
    } else {
      // Initial dummy data
      const initialLeads: Lead[] = [
        {
          id: '1',
          name: 'Александр Петров',
          amount: 150000,
          source: 'Сайт',
          createdAt: new Date().toISOString(),
          status: LeadStatus.NEW,
          phone: '+7 (900) 123-45-67',
          email: 'alex@example.com',
          notes: 'Интересуется разработкой мобильного приложения.'
        },
        {
          id: '2',
          name: 'Мария Сидорова',
          amount: 45000,
          source: 'Telegram',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          status: LeadStatus.IN_PROGRESS,
          phone: '+7 (911) 987-65-43',
          email: 'mariya@mail.ru',
          notes: 'Нужна консультация по маркетингу.'
        },
        {
          id: '3',
          name: 'ООО "Вектор"',
          amount: 320000,
          source: 'Звонок',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          status: LeadStatus.NEGOTIATION,
          phone: '+7 (495) 000-00-00',
          email: 'info@vector.biz',
          notes: 'Обсуждаем годовой контракт.'
        }
      ];
      setLeads(initialLeads);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = leads.find((l) => l.id === active.id);
    if (lead) setActiveLead(lead);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveALead = active.data.current?.type === 'Lead';
    if (!isActiveALead) return;

    // Moving lead over another lead or column
    
    // If hovering over a column
    if (COLUMNS.find(c => c.id === overId)) {
      const activeLeadIndex = leads.findIndex(l => l.id === activeId);
      if (leads[activeLeadIndex].status !== overId) {
        setLeads(prev => {
          const updated = [...prev];
          updated[activeLeadIndex] = { ...updated[activeLeadIndex], status: overId as LeadStatus };
          return updated;
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveALead = active.data.current?.type === 'Lead';
    const isOverALead = over.data.current?.type === 'Lead';

    if (isActiveALead && isOverALead) {
      setLeads((items) => {
        const oldIndex = items.findIndex((i) => i.id === activeId);
        const newIndex = items.findIndex((i) => i.id === overId);

        // Update status of active item to match over item
        if (items[oldIndex].status !== items[newIndex].status) {
          items[oldIndex].status = items[newIndex].status;
        }

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    if (isActiveALead && COLUMNS.find(c => c.id === overId)) {
        setLeads(prev => {
            const activeIndex = prev.findIndex(l => l.id === activeId);
            const updated = [...prev];
            updated[activeIndex] = { ...updated[activeIndex], status: overId as LeadStatus };
            return updated;
        });
    }
  };

  const openCreateDialog = (status?: LeadStatus) => {
    setSelectedLead(null);
    setInitialStatus(status);
    setIsDialogOpen(true);
  };

  const openEditDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  const saveLead = (leadData: Partial<Lead>) => {
    if (selectedLead) {
      // Update
      setLeads((prev) =>
        prev.map((l) => (l.id === selectedLead.id ? { ...l, ...leadData } : l))
      );
    } else {
      // Create
      const newLead: Lead = {
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        name: leadData.name || 'Без имени',
        amount: leadData.amount || 0,
        source: leadData.source || 'Сайт',
        status: leadData.status || LeadStatus.NEW,
        phone: leadData.phone || '',
        email: leadData.email || '',
        notes: leadData.notes || '',
      };
      setLeads((prev) => [newLead, ...prev]);
    }
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.phone.includes(searchQuery) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">LeadFlow CRM</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Управление лидами</p>
            </div>
          </div>

          <div className="flex flex-1 max-w-xl items-center gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Поиск по имени, телефону или email..." 
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 md:flex hidden">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <Button 
            onClick={() => openCreateDialog()} 
            className="shadow-md shadow-primary/10 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить лид
          </Button>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto overflow-x-auto h-[calc(100vh-80px)]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full pb-8">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                leads={filteredLeads.filter((l) => l.status === column.id)}
                onLeadClick={openEditDialog}
                onAddLead={openCreateDialog}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={dropAnimation}>
            {activeLead ? (
              <div className="scale-105 opacity-90 cursor-grabbing">
                <LeadCard lead={activeLead} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      <LeadDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={saveLead}
        onDelete={deleteLead}
        lead={selectedLead}
        initialStatus={initialStatus}
      />
    </div>
  );
}
