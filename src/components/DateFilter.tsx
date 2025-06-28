
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, subDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DateFilterProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  className?: string;
}

const DateFilter: React.FC<DateFilterProps> = ({
  selectedDate,
  onDateChange,
  className
}) => {
  const quickDateOptions = [
    { label: 'Hoy', value: 'today', date: new Date() },
    { label: 'Ayer', value: 'yesterday', date: subDays(new Date(), 1) },
    { label: 'Hace 2 días', value: '2days', date: subDays(new Date(), 2) },
    { label: 'Hace 3 días', value: '3days', date: subDays(new Date(), 3) },
    { label: 'Hace una semana', value: '1week', date: subDays(new Date(), 7) }
  ];

  const handleQuickDate = (value: string) => {
    const option = quickDateOptions.find(opt => opt.value === value);
    if (option) {
      onDateChange(startOfDay(option.date));
    } else if (value === 'custom') {
      // El usuario puede usar el calendario
    } else if (value === 'clear') {
      onDateChange(undefined);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Selector rápido */}
      <Select onValueChange={handleQuickDate}>
        <SelectTrigger className="bg-white/90 border-0 rounded-xl">
          <SelectValue placeholder="Seleccionar período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="clear">Mostrar todos</SelectItem>
          {quickDateOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          <SelectItem value="custom">Fecha personalizada...</SelectItem>
        </SelectContent>
      </Select>

      {/* Calendario personalizado */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-white/90 border-0 rounded-xl",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP", { locale: es })
            ) : (
              <span>Elegir fecha específica</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            initialFocus
            className="pointer-events-auto"
            locale={es}
            disabled={(date) => date > new Date() || date < subDays(new Date(), 30)}
          />
        </PopoverContent>
      </Popover>

      {/* Información de la fecha seleccionada */}
      {selectedDate && (
        <div className="text-xs text-white/80 text-center">
          Mostrando datos del {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: es })}
        </div>
      )}
    </div>
  );
};

export default DateFilter;
