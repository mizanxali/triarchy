import { useEffect, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { isMobileDevice } from '../_helpers';

export const useMobile = () => {
  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const isMob = width <= 480;

  useEffect(() => {
    if (isMobileDevice() || isMob) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [isMob]);

  return { isMobile };
};
