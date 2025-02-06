import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '.';

interface Props {
  className?: string;
  value: number;
  setValue: (value: number) => void;
  maxValue: number;
  onCounterIncrease: () => void;
  onCounterDecrease: () => void;
  disabled?: boolean;
}

const CounterInput = ({
  value,
  setValue,
  className,
  onCounterDecrease,
  onCounterIncrease,
  disabled,
  maxValue,
}: Props) => {
  return (
    <div
      className={cn(
        'bg-zinc-800 text-sm focus-within:shadow-focus-ring text-chakra flex w-full items-center gap-2 rounded-lg border-[0.5px] px-2.5 py-1.5 transition-all duration-200 ease-in-out border-all border-[#ffffff33] shadow-[0px_1px_2px_-0.5px_#16191D0A,0px_-0.5px_0px_0px_#16191D1F]',
        className,
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <button
        type="button"
        className={cn(
          'cursor-pointer bg-[#FFFFFF1A] p-1.5 rounded',
          disabled && 'cursor-not-allowed',
        )}
        onClick={onCounterDecrease}
        disabled={disabled}
      >
        <Minus className="w-2.5 h-2.5 text-[#FFFFFF99]" />
      </button>
      <input
        onBlur={(e) => {
          if (e.target.value === '') setValue(1);
        }}
        type="number"
        className="w-full text-center text-[#FFFFFF66] font-mono text-white text-xl bg-transparent border-none focus:outline-none"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const num = Number.parseInt(e.target.value, 10);
          if (num > maxValue) return;
          if (num === 0) return;
          setValue(num);
        }}
      />
      <button
        type="button"
        className={cn(
          'cursor-pointer bg-[#FFFFFF1A] p-1.5 rounded',
          disabled && 'cursor-not-allowed',
        )}
        onClick={onCounterIncrease}
        disabled={disabled}
      >
        <Plus className="w-2.5 h-2.5 text-[#FFFFFF99]" />
      </button>
    </div>
  );
};

export { CounterInput };
