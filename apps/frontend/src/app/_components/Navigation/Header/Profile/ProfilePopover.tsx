'use client';

import type React from 'react';
import { truncateAddress } from '~/app/utils';
import type { TUser } from '@battleground/auth';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@battleground/ui/popover';
import { externalLinks } from '~/app/_constants';
import SignOutTile from './SignOutTile';
import Link from 'next/link';
import type { Address } from 'viem';

const ProfilePopover = ({
  user,
}: {
  user: TUser;
}) => {
  return (
    <Popover>
      <PopoverTrigger className="rounded-full focus:outline-none cursor-pointer p-0.5 border border-zinc-400">
        <Image
          src={user.image || `/api/blockie/${user.walletAddress}`}
          height={50}
          width={50}
          className="rounded-full h-6 w-6"
          alt=""
        />
      </PopoverTrigger>
      <PopoverContent
        className="mr-4 bg-zinc-800 rounded-xl flex-col p-0 w-64"
        sideOffset={16}
      >
        <div className="flex justify-between items-center p-3">
          <div className="flex space-x-2 items-center">
            <Image
              src={user.image || `/api/blockie/${user.walletAddress}`}
              height={50}
              width={50}
              className="rounded-full h-7 w-7"
              alt=""
            />
            <div className="text-zinc-200 text-sm">
              {truncateAddress(user.walletAddress as Address)}
            </div>
          </div>
        </div>
        <div className="w-full bg-zinc-700 h-px" />
        <div className="pt-2 px-1.5">
          <Link
            href="#"
            onClick={() => {
              window.open(externalLinks.discord, '_blank')?.focus();
            }}
          >
            <div className="flex cursor-pointer space-x-2 p-1.5 rounded-lg hover:bg-zinc-700/50">
              <Image
                src="/images/socials/Discord.png"
                alt="discord"
                width={20}
                height={20}
                className="object-contain"
              />
              <div className="text-zinc-200 text-sm">Discord</div>
            </div>
          </Link>
        </div>
        <div className="px-1.5 mt-1">
          <Link
            href="#"
            onClick={() => {
              window.open(externalLinks.twitter, '_blank')?.focus();
            }}
          >
            <div className="flex cursor-pointer space-x-2 p-1.5 rounded-lg hover:bg-zinc-700/50">
              <Image
                src="/images/socials/X.png"
                alt="discord"
                width={20}
                height={20}
                className="object-contain"
              />
              <div className="text-zinc-200 text-sm">Twitter</div>
            </div>
          </Link>
        </div>
        <div className="w-full bg-zinc-700 h-px mt-2" />

        <SignOutTile />
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
