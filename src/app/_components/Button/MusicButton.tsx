import { Volume2, VolumeX } from 'lucide-react';
import useSound from 'use-sound';

import { useEffect } from 'react';
import { useMusicAtom } from '~/app/_atoms/settings.atom';
import { Button } from '~/components/ui/button';

const MusicButton = () => {
  const [musicEnabled, setMusicEnabled] = useMusicAtom();

  const [play, { stop, duration }] = useSound('/music.mp3');

  useEffect(() => {
    if (musicEnabled && duration) play();
  }, [duration]);

  return (
    <Button
      variant={musicEnabled ? 'primary' : 'destructive'}
      size="icon"
      onClick={() => {
        if (!musicEnabled) play();
        else stop();
        setMusicEnabled((prev) => !prev);
      }}
    >
      {musicEnabled ? <Volume2 size={26} /> : <VolumeX size={26} />}
    </Button>
  );
};

export default MusicButton;
