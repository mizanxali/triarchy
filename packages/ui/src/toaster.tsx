'use client';

import { cn } from '.';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';
import { useToast } from './hooks/useToast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider duration={3000}>
      {toasts.map(
        ({ id, icon, title, description, action, size, ...props }) => (
          <Toast key={id} {...props} size={size}>
            <div className={cn('grid', size === 'lg' ? 'gap-3' : 'gap-2')}>
              {title && (
                <ToastTitle
                  className={cn(
                    'flex items-center',
                    size === 'lg' ? 'gap-3' : 'gap-2',
                  )}
                >
                  {icon && <span>{icon}</span>}
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription
                  className={cn(
                    'flex w-3/4 items-center justify-center ',
                    size === 'lg' ? 'gap-7' : 'gap-6',
                  )}
                >
                  <div />
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        ),
      )}
      <ToastViewport />
    </ToastProvider>
  );
}
