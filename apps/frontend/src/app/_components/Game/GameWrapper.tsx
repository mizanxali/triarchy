'use client';

import { Button } from '@battleground/ui/button';
import {
  useDataMessage,
  useLocalPeer,
  usePeerIds,
  useRoom,
} from '@huddle01/react';
import { Role } from '@huddle01/server-sdk/auth';
import { api } from '~/trpc/react';
import CardStack from './CardStack';
import { useRouter } from 'next/navigation';
import { useGameAtom } from '~/app/_atoms/game.atom';
import type { TCard } from '@battleground/validators';
import { v4 as uuidv4 } from 'uuid';
import { CARD_COLOR_MAP } from '~/app/_constants';
import { cn } from '@battleground/ui';

interface Props {
  gameCode: string;
}

const GameWrapper = ({ gameCode }: Props) => {
  const router = useRouter();

  const [{ activeCard, opponentActiveCard }, setGameAtom] = useGameAtom();

  const onInitialCardsReceived = (cards: TCard[]) => {
    setGameAtom((prev) => ({
      ...prev,
      cardsDeck: cards.map((card) => ({
        card,
        id: uuidv4(),
      })),
    }));
  };

  const onTurnOver = ({
    cards,
    wonCards,
  }: { cards: TCard[]; wonCards: TCard[] }) => {
    setGameAtom((prev) => ({
      ...prev,
      cardsDeck: cards.map((card) => ({
        card,
        id: uuidv4(),
      })),
      wonCards: wonCards.map((card) => ({
        card,
        id: uuidv4(),
      })),
      activeCard: undefined,
      opponentActiveCard: undefined,
    }));
  };

  const onOpponentCardPlayed = (card: TCard) => {
    setGameAtom((prev) => ({
      ...prev,
      opponentActiveCard: card,
    }));
  };

  const { joinRoom, state } = useRoom({
    onLeave: (data) => {
      if (data.reason === 'MAX_PEERS_REACHED') alert('Game is full');
      router.push('/');
    },
    onPeerLeft: () => {
      alert('Opponent left the game');
      router.push('/');
    },
  });
  const { peerId: localPeerId } = useLocalPeer();
  useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === 'initial-cards') {
        onInitialCardsReceived(JSON.parse(payload));
      } else if (label === 'turn-win') {
        console.log('You won the turn!');
        onTurnOver(JSON.parse(payload));
      } else if (label === 'turn-lose') {
        console.log('You lost the turn!');
        onTurnOver(JSON.parse(payload));
      } else if (label === 'turn-draw') {
        console.log('It was a draw!');
        onTurnOver(JSON.parse(payload));
      } else if (label === 'opponent-card-played') {
        onOpponentCardPlayed(payload as TCard);
      } else if (label === 'game-win') {
        alert('You won the game!');
        router.push('/');
      } else if (label === 'game-lose') {
        alert('You lost the game!');
        router.push('/');
      }
    },
  });
  const [opponentPeerId] = usePeerIds({ roles: [Role.GUEST] }).peerIds;

  const { mutateAsync: createAccessToken } =
    api.room.createAccessToken.useMutation();

  const joinRoomHandler = async () => {
    const token = await createAccessToken({ roomId: gameCode });

    await joinRoom({
      roomId: gameCode,
      token,
    });
  };

  return (
    <div className="w-full h-screen flex flex-col p-6 justify-between">
      <div className="flex-1">
        <div className="w-full flex justify-between items-center">
          <div
            className={cn(
              'w-36 h-56 cursor-pointer rounded-lg text-black text-3xl font-bold flex items-center justify-center',
              activeCard ? CARD_COLOR_MAP[activeCard] : 'invisible',
            )}
          >
            <span>{activeCard}</span>
          </div>

          <div className="flex flex-col gap-2 text-center items-center">
            <div>
              <div className="text-2xl font-semibold">
                Game Code: {gameCode}
              </div>
              <div className="text-base">Room State: {state}</div>
            </div>

            <div>
              <div className="text-lg">Local Peer ID: {localPeerId}</div>
              <div className="text-lg">Opponent Peer ID: {opponentPeerId}</div>
            </div>

            <div className="flex gap-2">
              <Button
                disabled={state !== 'idle'}
                variant={'primary'}
                onClick={joinRoomHandler}
              >
                Join Room
              </Button>
            </div>
          </div>

          <div
            className={cn(
              'w-36 h-56 cursor-pointer rounded-lg text-black text-3xl font-bold flex items-center justify-center',
              opponentActiveCard
                ? CARD_COLOR_MAP[opponentActiveCard]
                : 'invisible',
            )}
          >
            {opponentActiveCard !== 'redacted' && (
              <span>{opponentActiveCard}</span>
            )}
          </div>
        </div>
      </div>
      <div>
        <CardStack />
      </div>
    </div>
  );
};

export default GameWrapper;
