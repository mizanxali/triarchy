import React from 'react';
import { useGameAtom } from '~/app/_atoms/game.atom';
import Card from './Card';
import { AnimatePresence } from 'motion/react';
import {
  useLocalPeer,
  usePeerIds,
  useRemotePeer,
  useRoom,
} from '@huddle01/react';
import type { TPeerMetadata } from '@battleground/validators';
import { Role } from '@huddle01/server-sdk/auth';

const ActiveCards = () => {
  const [{ activeCard, opponentActiveCard }] = useGameAtom();
  const { metadata } = useLocalPeer<TPeerMetadata>();
  const [opponentPeerId] = usePeerIds({ roles: [Role.GUEST] }).peerIds;
  const { state } = useRoom();

  if (state !== 'connected' || !opponentPeerId) {
    return null;
  }

  return (
    <div className="flex-1 w-full flex justify-between items-center py-10">
      <div className="flex-1 flex justify-end items-center px-20">
        <div className="flex-1 flex flex-col justify-center items-start gap-2">
          <div className="text-yellow-600 text-3xl font-bold">You</div>
          <div className="text-lg font-medium">{metadata?.displayName}</div>
        </div>
        <AnimatePresence mode="wait">
          {activeCard ? (
            <Card size="medium" card={activeCard} />
          ) : (
            <Card
              size="medium"
              card={{
                card: 'redacted',
                id: '404',
              }}
              invisible
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex justify-start items-center px-20">
        <AnimatePresence mode="wait">
          {opponentActiveCard ? (
            <Card size="medium" card={opponentActiveCard} />
          ) : (
            <Card
              size="medium"
              card={{ card: 'redacted', id: '404_opponent' }}
              invisible
            />
          )}
        </AnimatePresence>
        <div className="flex-1 flex flex-col justify-center items-end gap-2">
          <div className="text-yellow-600 text-3xl font-bold">Opponent</div>
          <RemotePeerInfo remotePeerId={opponentPeerId} />
        </div>
      </div>
    </div>
  );
};

export default ActiveCards;

const RemotePeerInfo = ({
  remotePeerId,
}: {
  remotePeerId: string;
}) => {
  const { metadata: remotePeerMetadata } = useRemotePeer<TPeerMetadata>({
    peerId: remotePeerId,
  });

  return (
    <div className="text-lg font-medium">{remotePeerMetadata?.displayName}</div>
  );
};
