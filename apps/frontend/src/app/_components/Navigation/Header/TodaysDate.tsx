'use client';

import { getTodaysDate } from '~/app/utils';

const TodaysDate = () => {
  return <span className="text-zinc-400 text-xs">{getTodaysDate()}</span>;
};

export default TodaysDate;
