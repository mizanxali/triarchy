import * as React from 'react';
import { cn } from '.';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

const inputVariants = cva(
  'relative flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2 transition-all duration-200 shadow-md font-medium text-sm',
  {
    variants: {
      variant: {
        default: `
          bg-yellow-950/90 
          border-yellow-800/50 
          text-yellow-100
          shadow-yellow-900/20
          focus-within:border-yellow-600 
          focus-within:shadow-yellow-600/20
          placeholder:text-yellow-100/50
        `,
        success: `
          bg-green-950/90 
          border-green-700
          text-green-100
          shadow-green-900/20
          focus-within:border-green-500
          focus-within:shadow-green-600/20
          placeholder:text-green-100/50
        `,
        error: `
          bg-red-950/90 
          border-red-700
          text-red-100
          shadow-red-900/20
          focus-within:border-red-500
          focus-within:shadow-red-600/20
          placeholder:text-red-100/50
        `,
        disabled: `
          bg-zinc-950/90 
          border-zinc-700
          text-slate-500
          shadow-slate-900/20
          cursor-not-allowed
          placeholder:text-slate-600
        `,
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

    const iconClasses = cn(
      'opacity-70',
      variant === 'success' && 'text-green-200',
      variant === 'error' && 'text-red-200',
      variant === 'disabled' && 'text-slate-500',
    );

    const clearButtonClasses = cn(
      'cursor-pointer hover:opacity-100 transition-opacity',
      variant === 'disabled' ? 'opacity-50 cursor-not-allowed' : 'opacity-70',
    );

    return (
      <div className={cn(inputVariants({ variant, className }))}>
        {icon && <div className={iconClasses}>{icon}</div>}
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
          className="bg-transparent focus:outline-none w-full placeholder:opacity-50"
        />
        {suffixIcon && (
          <button
            disabled={variant === 'disabled'}
            type="button"
            className={clearButtonClasses}
            onClick={onClose}
          >
            {suffixIcon}
          </button>
        )}
        {showClearButton && (
          <button
            disabled={variant === 'disabled'}
            type="button"
            className={clearButtonClasses}
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

export { Input, inputVariants, type InputProps };
