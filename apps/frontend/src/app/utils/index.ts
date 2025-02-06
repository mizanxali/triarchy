export const getTodaysDate = (date: Date = new Date()) =>
  `${date.toLocaleDateString('en-US', { weekday: 'long' })}, ${date.getDate()}${['st', 'nd', 'rd'][((date.getDate() + 90) % 10) - 1] || 'th'} ${date.toLocaleDateString('en-US', { month: 'short' })}, ${date.getFullYear()}`;

export const isValidLogoUrl = (url: string) => {
  if (/^https:\/\/huddle01\.mypinata\.cloud\/ipfs\/[a-zA-Z0-9]+$/.test(url))
    return true;

  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname.toLowerCase();

    if (parsedUrl.protocol !== 'https:') return false;

    return [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.webp',
      '.svg',
      '.tiff',
      '.ico',
    ].some((ext) => pathname.endsWith(ext));
  } catch (error) {
    return false;
  }
};

export const isValidEthereumAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const truncateAddress = (text: string) => {
  return `${text.slice(0, 5)}....${text.slice(-5)}`;
};

export const getFormattedDateTime = (date: Date): string => {
  return `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })}, '${date.getFullYear().toString().slice(-2)} ${date.toLocaleTimeString('en-US')}`;
};

export const getFormattedDate = (date: Date): string => {
  return `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })}, '${date.getFullYear().toString().slice(-2)}`;
};

export const getTimeDifference = (timestamp: string) => {
  const givenDate = new Date(timestamp);
  const currentDate = new Date();
  const diffInMs = currentDate.getTime() - givenDate.getTime();

  const seconds = diffInMs / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const months = days / 30.44;

  const formatUnit = (value: number, unit: string) => {
    const roundedValue = Math.round(value * 10) / 10;
    const numberString =
      roundedValue % 1 === 0
        ? roundedValue.toFixed(0)
        : roundedValue.toFixed(1);
    return `${numberString} ${unit}${roundedValue !== 1 ? 's' : ''}`;
  };

  if (months >= 1) {
    return formatUnit(months, 'mon');
  }
  if (days >= 1) {
    return formatUnit(days, 'day');
  }
  if (hours >= 1) {
    return formatUnit(hours, 'hr');
  }
  if (minutes >= 1) {
    return formatUnit(minutes, 'min');
  }
  return formatUnit(seconds, 'sec');
};
