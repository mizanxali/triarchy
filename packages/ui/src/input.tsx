import * as React from 'react';

import { cn } from '@battleground/ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

const inputVariants = cva(
  'bg-zinc-800 text-sm text-chakra flex w-full items-center gap-2 rounded-lg border-[0.5px] px-2.5 py-2 transition-all duration-200 ease-in-out border-all border-[#ffffff33]',
  {
    variants: {
      variant: {
        default:
          'focus-within:shadow-[0px 1px 2px -0.5px #16191D0A, inset 0px -0.5px 0px 0px #16191D1F]',
        success: '',
        error:
          'border-red-400 text-red-400 focus-within:shadow-[0px_0px_0px_3px_#7F1D1D]',
        disabled: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode;
  onClose?: () => void;
  suffixIcon?: React.ReactNode;
  maxCharacterCount?: number;
  showClearButton?: boolean;
  isPercentage?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      icon,
      maxCharacterCount,
      suffixIcon,
      onClose,
      type,
      onChange,
      showClearButton,
      value,
      isPercentage,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = React.useState<string>(
      value?.toString() ?? '',
    );

    React.useEffect(() => {
      setInputValue(value?.toString() ?? '');
    }, [value]);

    return (
      <div className={cn(inputVariants({ variant, className }))}>
        {icon && <div className="text-[#FFFFFF66]">{icon}</div>}
        <input
          value={inputValue}
          maxLength={maxCharacterCount}
          type={type}
          ref={ref}
          disabled={variant === 'disabled'}
          onChange={(e) => {
            if (
              isPercentage &&
              e.target.value.length >= 3 &&
              e.target.value !== '100'
            )
              return;
            setInputValue(e.target.value);
            onChange?.(e);
          }}
          {...props}
          className="bg-transparent focus:outline-none w-full"
        />
        {suffixIcon && (
          <button
            disabled={variant === 'disabled'}
            type="button"
            className="cursor-pointer"
            onClick={onClose}
          >
            {suffixIcon}
          </button>
        )}
        {showClearButton && (
          <button
            disabled={variant === 'disabled'}
            type="button"
            className="cursor-pointer"
            onClick={() => {
              setInputValue('');
              onChange?.({
                target: { value: '' },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input, inputVariants };
