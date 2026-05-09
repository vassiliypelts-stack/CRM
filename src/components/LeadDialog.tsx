import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lead, LeadSource, LeadStatus } from '../types';
import { LEAD_SOURCES } from '../constants';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Phone, Mail, Building, Trash2 } from 'lucide-react';

interface LeadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
  onDelete?: (id: string) => void;
  lead?: Lead | null;
  initialStatus?: LeadStatus;
}

export function LeadDialog({ isOpen, onClose, onSave, onDelete, lead, initialStatus }: LeadDialogProps) {
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    amount: 0,
    source: 'Сайт',
    phone: '',
    email: '',
    notes: '',
    status: initialStatus || LeadStatus.NEW,
  });

  useEffect(() => {
    if (lead) {
      setFormData(lead);
    } else {
      setFormData({
        name: '',
        amount: 0,
        source: 'Сайт',
        phone: '',
        email: '',
        notes: '',
        status: initialStatus || LeadStatus.NEW,
      });
    }
  }, [lead, initialStatus, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {lead ? 'Редактировать лид' : 'Новый лид'}
          </DialogTitle>
          <DialogDescription>
            {lead ? `Создан ${format(new Date(lead.createdAt), 'd MMMM yyyy HH:mm', { locale: ru })}` : 'Заполните данные для создания нового лида'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Имя клиента</Label>
            <Input
              id="name"
              placeholder="Иван Иванов"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Сумма сделки (₽)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="10000"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="source">Источник</Label>
              <Select
                value={formData.source}
                onValueChange={(value: LeadSource) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите источник" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-3 h-3" /> Телефон
              </Label>
              <Input
                id="phone"
                placeholder="+7 (999) 000-00-00"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="mail@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Заметки</Label>
            <Textarea
              id="notes"
              placeholder="Дополнительная информация о клиенте..."
              className="resize-none h-24"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
            {lead && onDelete && (
              <Button
                type="button"
                variant="destructive"
                className="sm:mr-auto"
                onClick={() => {
                  onDelete(lead.id);
                  onClose();
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Удалить
              </Button>
            )}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
                Отмена
              </Button>
              <Button type="submit" className="flex-1 sm:flex-none">
                {lead ? 'Сохранить изменения' : 'Создать лид'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
