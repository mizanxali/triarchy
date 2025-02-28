import { useEffect, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { isMobileDevice } from '../utils';

export const useMobile = () => {
  const { width } = useWindowSize();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(true);

  const isMob = width <= 480;

  useEffect(() => {
    if (isMobileDevice() || isMob) {
      setIsMobile(true);
      setIsLoading(false);
    } else {
      setIsMobile(false);
      setIsLoading(false);
    }
  }, [isMob]);

  return { isMobile, isLoading };
};
