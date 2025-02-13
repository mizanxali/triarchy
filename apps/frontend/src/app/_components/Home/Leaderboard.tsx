'use client';

import { Button } from '@battleground/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@battleground/ui/table';
import { ListOrdered, ShieldCloseIcon } from 'lucide-react';
import { useGameAtomValue } from '~/app/_atoms/game.atom';
import { useMiscAtom } from '~/app/_atoms/misc.atom';
import { api } from '~/trpc/react';
import { useSession } from 'next-auth/react';
import { cn } from '@battleground/ui';

const Leaderboard = () => {
  const [{ showLeaderboard }, setMisc] = useMiscAtom();
  const { gameCode } = useGameAtomValue();
  const { data: session } = useSession();

  const { data: leaderboard } = api.user.fetchLeaderboard.useQuery();

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
          width: '820px',
          height: '820px',
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-3xl font-black">Leaderboard</h1>

        <Table className="w-full flex-1 mb-10 mt-4">
          <TableHeader>
            <TableRow>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((user) => (
              <TableRow key={user.walletAddress}>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Leaderboard;
