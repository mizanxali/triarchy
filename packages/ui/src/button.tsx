import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@battleground/ui';

const buttonVariants = cva(
  'font-medium text-sm py-1.5 px-3 inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-base-1 text-base-2 font-medium',
        destructive: 'bg-red-800 border border-white/20',
        disabled:
          'disabled cursor-not-allowed bg-base-3 text-base-4 font-medium',
        outline: '',
        secondary: 'bg-zinc-800 border border-[#FFFFFF33]',
        ghost: '',
        link: '',
      },
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  prefixIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, children, prefixIcon, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, className }), 'gap-1')}
        ref={ref}
        {...props}
      >
        {prefixIcon && <span>{prefixIcon}</span>}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
