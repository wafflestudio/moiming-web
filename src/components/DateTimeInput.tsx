import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface DateTimeInputProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  onCalendarClick?: () => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  placeholder?: string; // Added to satisfy interface if used elsewhere, though not used in segmented input
}

export function DateTimeInput({
  value,
  onChange,
  onCalendarClick,
  className,
  disabled,
  id,
}: DateTimeInputProps) {
  // State for each segment
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState(''); // 12-hour format
  const [minute, setMinute] = useState('');
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');

  // Refs for focusing
  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const ampmRef = useRef<HTMLButtonElement>(null);

  // Sync state with prop value
  useEffect(() => {
    if (value) {
      const newYear = value.getFullYear().toString();
      const newMonth = (value.getMonth() + 1).toString().padStart(2, '0');
      const newDay = value.getDate().toString().padStart(2, '0');

      let h = value.getHours();
      const isPm = h >= 12;
      if (h === 0) h = 12;
      else if (h > 12) h -= 12;

      const newHour = h.toString().padStart(2, '0');
      const newMinute = value.getMinutes().toString().padStart(2, '0');
      const newAmpm = isPm ? 'PM' : 'AM';

      // Only update state if NOT focused on that field to prevent typing interruption,
      // OR if the value is significantly different (e.g. external update).
      // For simplicity, we skip update if focused and values match numerically.
      const activeEl = document.activeElement;

      if (activeEl !== yearRef.current) setYear(newYear);

      // For Month: if we typed '1' (val='1'), prop is '01'. matches. Don't overwrite.
      if (
        activeEl !== monthRef.current ||
        parseInt(month) !== parseInt(newMonth)
      ) {
        if (
          activeEl === monthRef.current &&
          parseInt(month) === parseInt(newMonth)
        ) {
          // keep current 'month' state (e.g. '1')
        } else {
          setMonth(newMonth);
        }
      }

      if (activeEl !== dayRef.current || parseInt(day) !== parseInt(newDay)) {
        if (activeEl === dayRef.current && parseInt(day) === parseInt(newDay)) {
          // keep
        } else {
          setDay(newDay);
        }
      }

      if (
        activeEl !== hourRef.current ||
        parseInt(hour) !== parseInt(newHour)
      ) {
        if (
          activeEl === hourRef.current &&
          parseInt(hour) === parseInt(newHour)
        ) {
          // keep
        } else {
          setHour(newHour);
        }
      }

      if (
        activeEl !== minuteRef.current ||
        parseInt(minute) !== parseInt(newMinute)
      ) {
        if (
          activeEl === minuteRef.current &&
          parseInt(minute) === parseInt(newMinute)
        ) {
          // keep
        } else {
          setMinute(newMinute);
        }
      }

      setAmpm(newAmpm);
    }
  }, [value, month, day, hour, minute]);

  // Helper to trigger onChange with constructed Date
  const tryUpdateDate = (
    y: string,
    m: string,
    d: string,
    ap: 'AM' | 'PM',
    h: string,
    min: string
  ) => {
    if (
      y.length === 4 &&
      m.length > 0 &&
      d.length > 0 &&
      h.length > 0 &&
      min.length > 0
    ) {
      const yearNum = parseInt(y);
      const monthNum = parseInt(m) - 1;
      const dayNum = parseInt(d);
      const hourNum = parseInt(h);
      const minuteNum = parseInt(min);

      if (
        monthNum >= 0 &&
        monthNum <= 11 &&
        dayNum >= 1 &&
        dayNum <= 31 &&
        hourNum >= 1 && // 12-hour clock: 1-12
        hourNum <= 12 &&
        minuteNum >= 0 &&
        minuteNum <= 59
      ) {
        let finalHour = hourNum;
        if (ap === 'PM' && finalHour !== 12) finalHour += 12;
        if (ap === 'AM' && finalHour === 12) finalHour = 0;

        const newDate = new Date(
          yearNum,
          monthNum,
          dayNum,
          finalHour,
          minuteNum
        );

        // Validate date existence (e.g. Feb 30)
        if (
          newDate.getFullYear() === yearNum &&
          newDate.getMonth() === monthNum &&
          newDate.getDate() === dayNum
        ) {
          onChange(newDate);
          return;
        }
      }
    }
    // If incomplete/invalid, propagate undefined ONLY if value was defined
    if (value !== undefined) {
      onChange(undefined);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
    e.stopPropagation(); // Stop popover trigger
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop popover trigger
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setYear(val);
    if (val.length === 4) {
      monthRef.current?.focus();
    }
    tryUpdateDate(val, month, day, ampm, hour, minute);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    let val = e.target.value.replace(/[^0-9]/g, '');

    // Smart handling: '01' + '2' -> '012' -> '12'
    if (val.length === 3 && val.startsWith('0')) {
      val = val.substring(1);
    }
    val = val.slice(0, 2);

    const intVal = parseInt(val);

    // Rule 1: Input > 1 (single digit) -> Auto 0X & Next
    if (val.length === 1 && intVal > 1) {
      // e.g. typed '2' -> '02'
      // But if we just typed '1', it stays '1'.
      val = '0' + val;
      setMonth(val);
      dayRef.current?.focus();
      tryUpdateDate(year, val, day, ampm, hour, minute);
      return;
    }

    // Rule 2: Ignore invalid 2nd digit for month (max 12)
    // If we have '1' and type '3' -> '13'.
    if (val.length === 2) {
      if (intVal > 12 || intVal === 0) {
        const lastDigit = val[1];
        // Recurse/Apply logic for single digit of the new input
        if (parseInt(lastDigit) > 1) {
          val = '0' + lastDigit;
          setMonth(val);
          dayRef.current?.focus();
          tryUpdateDate(year, val, day, ampm, hour, minute);
          return;
        } else {
          val = lastDigit;
        }
      }
    }

    setMonth(val);
    if (val.length === 2 && parseInt(val) > 0) {
      dayRef.current?.focus();
    }
    tryUpdateDate(year, val, day, ampm, hour, minute);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    let val = e.target.value.replace(/[^0-9]/g, '');

    // Smart handling: '01' + '2' -> '012' -> '12'
    if (val.length === 3 && val.startsWith('0')) {
      val = val.substring(1);
    }
    val = val.slice(0, 2);

    const intVal = parseInt(val);

    // Rule: Input >= 4 -> Auto 0X & Next
    if (val.length === 1 && intVal >= 4) {
      val = '0' + val;
      setDay(val);
      ampmRef.current?.focus();
      tryUpdateDate(year, month, val, ampm, hour, minute);
      return;
    }

    // Rule: Smart correction
    if (val.length === 2) {
      if (intVal > 31 || intVal === 0) {
        const lastDigit = val[1];
        if (parseInt(lastDigit) >= 4) {
          val = '0' + lastDigit;
          setDay(val);
          ampmRef.current?.focus();
          tryUpdateDate(year, month, val, ampm, hour, minute);
          return;
        } else {
          val = lastDigit;
        }
      }
    }

    setDay(val);
    if (val.length === 2 && parseInt(val) > 0) {
      ampmRef.current?.focus();
    }
    tryUpdateDate(year, month, val, ampm, hour, minute);
  };

  const dayOfWeek = () => {
    if (year && month && day) {
      const d = new Date(`${year}-${month}-${day}`);
      if (!isNaN(d.getTime())) {
        const days = ['(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)'];
        return days[d.getDay()];
      }
    }
    return '';
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    let val = e.target.value.replace(/[^0-9]/g, '');

    // Smart handling: '01' + '2' -> '012' -> '12'
    if (val.length === 3 && val.startsWith('0')) {
      val = val.substring(1);
    }
    val = val.slice(0, 2);

    const intVal = parseInt(val);

    // Rule: Input > 1 -> Auto 0X & Next
    if (val.length === 1 && intVal > 1) {
      val = '0' + val;
      setHour(val);
      minuteRef.current?.focus();
      tryUpdateDate(year, month, day, ampm, val, minute);
      return;
    }

    // Rule: Max 12
    if (val.length === 2) {
      if (intVal > 12 || intVal === 0) {
        if (intVal > 12) {
          const lastDigit = val[1];
          if (parseInt(lastDigit) > 1) {
            val = '0' + lastDigit;
            setHour(val);
            minuteRef.current?.focus();
            tryUpdateDate(year, month, day, ampm, val, minute);
            return;
          } else {
            val = lastDigit;
          }
        }
      }
    }

    setHour(val);
    if (val.length === 2 && parseInt(val) > 0) {
      minuteRef.current?.focus();
    }
    tryUpdateDate(year, month, day, ampm, val, minute);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    let val = e.target.value.replace(/[^0-9]/g, '');

    // Smart handling: '01' + '2' -> '012' -> '12'
    if (val.length === 3 && val.startsWith('0')) {
      val = val.substring(1);
    }
    val = val.slice(0, 2);

    const intVal = parseInt(val);

    // Rule: Input >= 6 -> Auto 0X
    if (val.length === 1 && intVal >= 6) {
      val = '0' + val;
      setMinute(val);
      tryUpdateDate(year, month, day, ampm, hour, val);
      return;
    }

    // Max 59
    if (val.length === 2 && intVal > 59) {
      const lastDigit = val[1];
      if (parseInt(lastDigit) >= 6) {
        val = '0' + lastDigit;
      } else {
        val = lastDigit;
      }
    }

    setMinute(val);
    tryUpdateDate(year, month, day, ampm, hour, val);
  };

  const toggleAmpm = () => {
    const next = ampm === 'AM' ? 'PM' : 'AM';
    setAmpm(next);
    tryUpdateDate(year, month, day, next, hour, minute);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    prevRef?: React.RefObject<HTMLElement | null>
  ) => {
    if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '') {
      e.preventDefault();
      prevRef?.current?.focus();
    }
  };

  return (
    <div
      id={id}
      className={cn(
        'flex items-center w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold ring-offset-background',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={handleClick} // Stop propagation
    >
      <button
        type="button"
        tabIndex={-1}
        onClick={(e) => {
          // This IS the trigger, so we might WANT propagation if DateTimePicker uses it?
          // BUT DateTimePicker uses renderTrigger.
          // If we stop prop here, the PopoverTrigger won't see it?
          // Actually, `onCalendarClick` is meant to manually toggle if passed?
          // DateTimePicker implementation:
          // <PopoverTrigger asChild> ... </PopoverTrigger>
          // If renderTrigger is used, the returned node is the child.
          // PopoverTrigger attaches onClick to this child.
          // So if we stop prop on the container, we block PopoverTrigger.
          // BUT we want PopoverTrigger ONLY on the icon.
          // If we wrap just the icon in PopoverTrigger? We can't easily, since DateTimePicker does the wrapping.
          // The renderTrigger prop gives us `setOpen`. We can just use that!
          // `NewEvent.tsx`:
          // renderTrigger={({ value, open, setOpen }) => ( <DateTimeInput ... onCalendarClick={() => setOpen(!open)} ... /> )}
          // So `onCalendarClick` ALREADY controls the state manually.
          // AND `DateTimePicker` wraps it in `PopoverTrigger`.
          // `PopoverTrigger` toggles on click.
          // So we have TWO toggles: 1. PopoverTrigger (click anywhere on wrapper), 2. `onCalendarClick` (click on icon).
          // If we use RenderTrigger, `DateTimePicker` shouldn't use `PopoverTrigger` logic blindly?
          // Actually `DateTimePicker` code says:
          // <PopoverTrigger asChild><div>{renderTrigger()}</div></PopoverTrigger>
          // So clicking the div toggles it.
          // So YES, we must stop propagation on everything EXCEPT the icon/button that we want to trigger it.
          // Stop propagation on Inputs is GOOD.
          // Stop propagation on Calendar Icon?
          // If we stop prop on Calendar Icon, `PopoverTrigger` won't see it.
          // But `onCalendarClick` will run. `setOpen` will run. Popover opens.
          // This seems correct.
          e.stopPropagation();
          onCalendarClick?.();
        }}
        className="text-foreground hover:text-muted-foreground cursor-pointer disabled:opacity-50 mr-2"
        disabled={disabled}
      >
        <CalendarIcon className="size-4" />
      </button>

      <input
        ref={yearRef}
        value={year}
        onChange={handleYearChange}
        onFocus={handleFocus}
        onClick={handleClick}
        onKeyDown={(e) => handleKeyDown(e)}
        className="w-[36px] bg-transparent text-center focus:outline-none placeholder:text-muted-foreground/50 p-0"
        placeholder="YYYY"
        maxLength={4}
        disabled={disabled}
      />
      <span className="mx-0.5">.</span>
      <input
        ref={monthRef}
        value={month}
        onChange={handleMonthChange}
        onFocus={handleFocus}
        onClick={handleClick}
        onKeyDown={(e) => handleKeyDown(e, yearRef)}
        className="w-[20px] bg-transparent text-center focus:outline-none placeholder:text-muted-foreground/50 p-0"
        placeholder="MM"
        maxLength={2}
        disabled={disabled}
      />
      <span className="mx-0.5">.</span>
      <input
        ref={dayRef}
        value={day}
        onChange={handleDayChange}
        onFocus={handleFocus}
        onClick={handleClick}
        onKeyDown={(e) => handleKeyDown(e, monthRef)}
        className="w-[20px] bg-transparent text-center focus:outline-none placeholder:text-muted-foreground/50 p-0"
        placeholder="DD"
        maxLength={2}
        disabled={disabled}
      />
      <span className="mx-0.5">{dayOfWeek()}</span>

      <button
        type="button"
        ref={ampmRef}
        onClick={(e) => {
          e.stopPropagation(); // Stop popover
          toggleAmpm();
        }}
        onFocus={(e) => e.stopPropagation()} // Stop popover
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            toggleAmpm();
          }
          if (e.key === 'ArrowLeft') dayRef.current?.focus();
          if (e.key === 'ArrowRight') hourRef.current?.focus();
        }}
        className="focus:outline-none focus:bg-accent rounded px-0.5 font-medium cursor-pointer hover:bg-muted w-[32px] text-center"
        disabled={disabled}
      >
        {ampm === 'AM' ? '오전' : '오후'}
      </button>

      <span className="w-1"></span>

      <input
        ref={hourRef}
        value={hour}
        onChange={handleHourChange}
        onFocus={handleFocus}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Backspace' && hour === '') {
            e.preventDefault();
            ampmRef.current?.focus();
          }
        }}
        className="w-[20px] bg-transparent text-center focus:outline-none placeholder:text-muted-foreground/50 p-0"
        placeholder="HH"
        maxLength={2}
        disabled={disabled}
      />
      <span className="mx-0.5">:</span>
      <input
        ref={minuteRef}
        value={minute}
        onChange={handleMinuteChange}
        onFocus={handleFocus}
        onClick={handleClick}
        onKeyDown={(e) => handleKeyDown(e, hourRef)}
        className="w-[20px] bg-transparent text-center focus:outline-none placeholder:text-muted-foreground/50 p-0"
        placeholder="MM"
        maxLength={2}
        disabled={disabled}
      />

      <div className="flex-1" />
    </div>
  );
}
