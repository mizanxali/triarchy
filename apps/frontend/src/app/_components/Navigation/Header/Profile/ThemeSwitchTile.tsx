'use client';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

const ThemeSwitchTile = () => {
  const { setTheme, theme } = useTheme();
  return (
    <div className="px-1.5 mt-2">
      <div
        onClick={() => {
          // uncomment the line below to enable theme switching
          // setTheme(theme === 'dark' ? 'light' : 'dark');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            // uncomment the line below to enable theme switching
            // setTheme(theme === 'dark' ? 'light' : 'dark');
          }
        }}
        className="flex cursor-pointer space-x-2 p-1.5 rounded-lg hover:bg-zinc-700/50 items-center"
      >
        {theme === 'dark' ? (
          <SunIcon className="text-yellow-400" />
        ) : (
          <MoonIcon className="text-yellow-400" />
        )}
        <div className="text-zinc-200 text-sm">
          {theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitchTile;
