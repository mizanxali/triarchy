'use client';

import { HuddleProvider, HuddleClient } from '@huddle01/react';
import { env } from '~/env';

interface Props {
  children: React.ReactNode;
}

const huddleClient = new HuddleClient({
  projectId: env.NEXT_PUBLIC_PROJECT_ID,
  options: {
    logging: true,
    activeSpeakers: {
      size: 8,
    },
  },
});

export const MyHuddleProvider = ({ children }: Props) => {
  return <HuddleProvider client={huddleClient}>{children}</HuddleProvider>;
};
