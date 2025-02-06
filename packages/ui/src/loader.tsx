import type React from 'react';
import { Loader as LucidLoader } from 'lucide-react';

type Props = {
  size?: 'small' | 'medium' | 'large';
};

const Loader: React.FC<Props> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-10 h-10',
    large: 'w-20 h-20',
  };

  return (
    <div className="flex items-center justify-center">
      <LucidLoader
        className={`animate-spin text-zinc-400 ${sizeClasses[size]}`}
      />
    </div>
  );
};

export { Loader };
