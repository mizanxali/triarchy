'use client';

import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { ListOrdered, ShieldCloseIcon } from 'lucide-react';
import { useGameAtomValue } from '~/app/_atoms/game.atom';
import { useMiscAtom } from '~/app/_atoms/misc.atom';
import { useSession } from 'next-auth/react';
import { cn } from '~/components/ui';
import { useEffect, useState } from 'react';

interface Leaderboard {
  walletAddress: `0x${string}`;
  wins: number;
  losses: number;
  totalWon: string;
  totalWagered: string;
  referrals: number;
}
[];

const Leaderboard = () => {
  const [{ showLeaderboard }, setMisc] = useMiscAtom();
  const { gameCode } = useGameAtomValue();
  const { data: session } = useSession();

  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const leaderboard = await fetch('/api/leaderboard');
      const data = await leaderboard.json();
      setLeaderboard(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMisc((prev) => ({ ...prev, showLeaderboard: false }));
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  if (!leaderboard) return null;

  if (!showLeaderboard)
    return (
      <Button
        variant={'primary'}
        size={gameCode ? 'icon' : 'md'}
        onClick={() =>
          setMisc((prev) => ({
            ...prev,
            showLeaderboard: true,
          }))
        }
      >
        <div className="flex items-center gap-2">
          <ListOrdered size={20} />
          <div>Leaderboard</div>
        </div>
      </Button>
    );

  return (
    <div
      className="fixed inset-0 bg-[#09090BCC] backdrop-blur-md h-full w-full flex items-center justify-center z-20"
      onClick={() => {
        setMisc((prev) => ({ ...prev, showLeaderboard: false }));
      }}
    >
      <div className="fixed top-8 left-8">
        <Button
          type="button"
          size="icon"
          className=""
          onClick={() =>
            setMisc((prev) => ({ ...prev, showLeaderboard: false }))
          }
        >
          <ShieldCloseIcon size={20} />
        </Button>
      </div>
      <div
        className="rounded-md px-16 py-24 text-black flex flex-col items-center justify-between"
        style={{
          backgroundImage: `url('container.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '900px',
          height: '900px',
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-3xl font-black">Leaderboard</h1>

        <Table className="w-full flex-1 mb-10 mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[50px] text-black font-extrabold">
                Rank
              </TableHead>
              <TableHead className="text-left text-black font-extrabold">
                Wallet Address
              </TableHead>
              <TableHead className="text-center w-[50px] text-black font-extrabold">
                Wins
              </TableHead>
              <TableHead className="text-center w-[50px] text-black font-extrabold">
                Losses
              </TableHead>
              <TableHead className="text-center w-[110px] text-black font-extrabold">
                Total Wagered
              </TableHead>
              <TableHead className="text-right w-[80px] text-black font-extrabold">
                Total Won
              </TableHead>
              <TableHead className="text-right w-[80px] text-black font-extrabold">
                Referrals
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((user, index) => (
              <TableRow key={user.walletAddress}>
                <TableCell
                  className={cn(
                    'text-center',
                    user.walletAddress === session?.user.walletAddress
                      ? 'text-yellow-600 font-bold'
                      : 'text-black font-medium',
                  )}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-left',
                    user.walletAddress === session?.user.walletAddress
                      ? 'text-yellow-600 font-bold'
                      : 'text-black font-medium',
                  )}
                >
                  {user.walletAddress}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-center',
                    user.walletAddress === session?.user.walletAddress
                      ? 'text-yellow-600 font-bold'
                      : 'text-black font-medium',
                  )}
                >
                  {user.wins}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-center',
                    user.walletAddress === session?.user.walletAddress
                      ? 'text-yellow-600 font-bold'
                      : 'text-black font-medium',
                  )}
                >
                  {user.losses}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-center',
                    user.walletAddress === session?.user.walletAddress
                      ? 'text-yellow-600 font-bold'
                      : 'text-black font-medium',
                  )}
                >
                  {user.totalWagered}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right',
                    user.walletAddress === session?.user.walletAddress
                      ? 'text-yellow-600 font-bold'
                      : 'text-black font-medium',
                  )}
                >
                  {user.totalWon}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right',
                    user.walletAddress === session?.user.walletAddress
                      ? 'text-yellow-600 font-bold'
                      : 'text-black font-medium',
                  )}
                >
                  {user.referrals}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Leaderboard;
