import { DateTimeInput } from '@/components/DateTimeInput';
import { DateTimePicker } from '@/components/DateTimePicker';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface ControlledDateTimePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (date: Date | undefined) => void;
}

export function ControlledDateTimePicker<T extends FieldValues>({
  control,
  name,
  id,
  placeholder,
  disabled,
  onChange: onSideChange,
}: ControlledDateTimePickerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <DateTimePicker
          id={id || name}
          value={field.value}
          onChange={(date: Date | undefined) => {
            field.onChange(date);
            if (onSideChange) onSideChange(date);
          }}
          placeholder={placeholder}
          disabled={disabled}
          renderTrigger={({ value, open, setOpen }) => (
            <DateTimeInput
              value={value}
              onChange={(date: Date | undefined) => {
                if (date) {
                  field.onChange(date);
                  if (onSideChange) onSideChange(date);
                }
              }}
              onCalendarClick={() => {
                setOpen(!open);
              }}
              placeholder={placeholder}
              disabled={disabled}
            />
          )}
        />
      )}
    />
  );
}
