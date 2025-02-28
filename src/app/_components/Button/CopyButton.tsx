'use client';

import { cn } from '~/components/ui';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

const CopyButton = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <button
      type="button"
      className={cn(className, 'focus:outline-none mt-0.5')}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 5000);
      }}
    >
      {isCopied ? (
        <CheckIcon className="w-4 h-4 text-yellow-600" />
      ) : (
        <CopyIcon className="w-4 h-4" />
      )}
    </button>
  );
};

export default CopyButton;
