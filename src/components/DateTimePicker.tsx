import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DateTimePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  renderTrigger?: (props: {
    value: Date | undefined;
    open: boolean;
    setOpen: (open: boolean) => void;
  }) => React.ReactNode;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  renderTrigger,
  placeholder,
  id,
  disabled,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Preserve time from current date if exists
      const newDate = new Date(selectedDate);
      if (value) {
        newDate.setHours(value.getHours());
        newDate.setMinutes(value.getMinutes());
      }
      onChange(newDate);
    }
  };

  const handleTimeChange = (
    type: 'hour' | 'minute' | 'ampm',
    valStr: string
  ) => {
    if (value) {
      const newDate = new Date(value);
      if (type === 'hour') {
        const val = parseInt(valStr);
        const currentHours = newDate.getHours();
        const isPM = currentHours >= 12;

        if (isPM) {
          if (val === 12) newDate.setHours(12);
          else newDate.setHours(val + 12);
        } else {
          if (val === 12) newDate.setHours(0);
          else newDate.setHours(val);
        }
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(valStr));
      } else if (type === 'ampm') {
        const currentHours = newDate.getHours();
        if (valStr === 'PM' && currentHours < 12) {
          newDate.setHours(currentHours + 12);
        } else if (valStr === 'AM' && currentHours >= 12) {
          newDate.setHours(currentHours - 12);
        }
      }
      onChange(newDate);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full">
          {renderTrigger ? (
            renderTrigger({ value, open, setOpen })
          ) : (
            <Button
              id={id}
              variant="outline"
              disabled={disabled}
              className={cn(
                'w-full justify-start text-left single-line-body-base',
                !value && 'text-muted-foreground'
              )}
            >
              {value ? value.toLocaleString() : placeholder}
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      value && value.getHours() % 12 === hour % 12
                        ? 'default'
                        : 'ghost'
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange('hour', hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      value && value.getMinutes() === minute
                        ? 'default'
                        : 'ghost'
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange('minute', minute.toString())
                    }
                  >
                    {minute}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex sm:flex-col p-2">
                {['AM', 'PM'].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      value &&
                      ((ampm === 'AM' && value.getHours() < 12) ||
                        (ampm === 'PM' && value.getHours() >= 12))
                        ? 'default'
                        : 'ghost'
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange('ampm', ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
