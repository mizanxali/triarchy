import type { TUser } from '@battleground/auth';
import type { Address } from 'viem';
import { truncateAddress } from '~/app/utils';
import TodaysDate from './TodaysDate';

const Header = async ({
  user,
}: {
  user: TUser;
}) => {
  return (
    <div className="flex flex-col-reverse md:flex-row justify-between md:items-center gap-3">
      <div className="flex flex-col">
        <h3 className="text-zinc-200 text-base font-medium">
          Welcome,{' '}
          {truncateAddress((user.walletAddress as Address) ?? ('' as Address))}
        </h3>
        <TodaysDate />
      </div>
    </div>
  );
};

export default Header;
