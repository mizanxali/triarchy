import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '.';

const buttonVariants = cva(
  'font-medievalSharp relative font-bold text-sm inline-flex items-center justify-center whitespace-nowrap rounded-xl transition-all duration-200 border-2 shadow-lg active:translate-y-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-800 shadow-yellow-900/50',
        secondary:
          'bg-slate-700 hover:bg-slate-800 text-gray-200 border-slate-900 shadow-slate-900/50',
        destructive:
          'bg-red-600 hover:bg-red-700 text-white border-red-900 shadow-red-900/50',
      },
      size: {
        sm: 'text-sm px-4 py-1',
        md: 'text-base px-6 py-2',
        lg: 'text-lg px-8 py-3',
        icon: 'rounded-full p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  prefixIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      prefixIcon,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), 'gap-2')}
        ref={ref}
        {...props}
      >
        {prefixIcon && <span className="inline-flex">{prefixIcon}</span>}
        {children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants, type ButtonProps };
