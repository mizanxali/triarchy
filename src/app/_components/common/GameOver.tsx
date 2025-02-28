'use client';

import Confetti from 'react-confetti';
import { ShieldCloseIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useMiscAtom } from '~/app/_atoms/misc.atom';
import { Button } from '~/components/ui/button';

const GameOver = () => {
  const [{ showGameOver, gameOverMessage, txnHash, isWinner }, setMisc] =
    useMiscAtom();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMisc((prev) => ({
          ...prev,
          showGameOver: false,
          gameOverMessage: '',
          txnHash: undefined,
        }));
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleView = () => {
    const explorerLink = `https://hudlscan.com/tx/${txnHash}`;
    window.open(explorerLink, '_blank')?.focus();
  };

  if (!showGameOver) return null;

  return (
    <div
      className="fixed inset-0 bg-[#09090BCC] backdrop-blur-md h-full w-full flex items-center justify-center z-20"
      onClick={() => {
        setMisc((prev) => ({
          ...prev,
          showGameOver: false,
          gameOverMessage: '',
          txnHash: undefined,
        }));
      }}
    >
      {isWinner ? <Confetti /> : null}
      <div className="fixed top-8 left-8">
        <Button
          type="button"
          size="icon"
          className=""
          onClick={() =>
            setMisc((prev) => ({
              ...prev,
              showGameOver: false,
              gameOverMessage: '',
              txnHash: undefined,
            }))
          }
        >
          <ShieldCloseIcon size={20} />
        </Button>
      </div>
      <div
        className="rounded-md p-10 text-black flex flex-col items-center justify-between gap-4"
        style={{
          backgroundImage: `url('paper.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minWidth: '480px',
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-4xl uppercase text-black font-sancreek">
          Game Over
        </h1>

        <h4 className="text-xl text-wrap">{gameOverMessage}</h4>
        {txnHash ? (
          <Button variant={'primary'} onClick={handleView}>
            View Transaction
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default GameOver;
