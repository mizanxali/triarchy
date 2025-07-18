'use client';

import { Button } from '~/components/ui/button';
import { CircleHelp, ShieldCloseIcon, BadgeDollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGameAtomValue } from '~/app/_atoms/game.atom';
import { useMiscAtom } from '~/app/_atoms/misc.atom';
import MusicButton from '../Button/MusicButton';
import { useReadContract } from 'wagmi';
import { GAME_REFERRALS_ADDRESS } from '~/lib/web3/constants';
import { GameReferralsABI } from '~/lib/web3/abis';
import { formatEther } from 'viem';

interface Props {
  walletAddress: string;
}

const ReferAndEarn = ({ walletAddress }: Props) => {
  const [{ showReferAndEarn }, setMisc] = useMiscAtom();

  const referralCount = useReadContract({
    address: GAME_REFERRALS_ADDRESS,
    abi: GameReferralsABI,
    functionName: 'getReferralCount',
    args: [walletAddress as `0x${string}`],
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMisc((prev) => ({ ...prev, showReferAndEarn: false }));
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  if (!showReferAndEarn)
    return (
      <div className="flex gap-2">
        <Button
          variant={'primary'}
          size={'md'}
          onClick={() =>
            setMisc((prev) => ({
              ...prev,
              showReferAndEarn: true,
            }))
          }
        >
          <div className="flex items-center gap-2">
            <BadgeDollarSign size={20} />
            <div>Refer and Earn</div>
          </div>
        </Button>
      </div>
    );

  return (
    <div
      className="fixed inset-0 bg-[#09090BCC] backdrop-blur-md h-full w-full flex items-center justify-center z-20"
      onClick={() => {
        setMisc((prev) => ({ ...prev, showReferAndEarn: false }));
      }}
    >
      <div className="fixed top-8 left-8">
        <Button
          type="button"
          size="icon"
          className=""
          onClick={() =>
            setMisc((prev) => ({ ...prev, showReferAndEarn: false }))
          }
        >
          <ShieldCloseIcon size={20} />
        </Button>
      </div>
      <div
        className="rounded-md p-24 text-black flex flex-col items-center justify-between"
        style={{
          backgroundImage: `url('container.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '560px',
          height: '560px',
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-3xl font-black mb-3">Refer and Earn</h1>
        <h3 className="font-bold mb-2 text-xl">
          Your referral count:{' '}
          <span className="font-black text-yellow-600">
            {referralCount.data ? Number(referralCount.data[0]) : 0}
          </span>
        </h3>
        <h3 className="font-bold mb-2 text-xl">
          Your referral earnings:{' '}
          <span className="font-black text-yellow-600">
            {referralCount.data
              ? Number(formatEther(referralCount.data[1]))
              : 0}
          </span>{' '}
          ETH
        </h3>
        <div className="flex-1 flex flex-col gap-4 w-full text-left">
          <div>
            <ul className="list-disc font-semibold pl-6 mb-2">
              <li>
                Share your referral link with your friends and earn 10% of their{' '}
                <span className="font-bold">first</span> game's wager amount.
              </li>
              <li>The more friends you refer, the more you earn.</li>
              <li>
                Each new referral will be counted only once. If a friend plays a
                game, you will not be able to refer them again.
              </li>
              <li>
                The referral amount will be credited to your wallet after their
                first game is over.
              </li>
            </ul>
          </div>
          <Button
            variant={'primary'}
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.href}?referralCode=${walletAddress}`,
              );
            }}
          >
            Copy Referral Link
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarn;
