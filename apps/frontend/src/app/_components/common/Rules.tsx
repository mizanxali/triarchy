'use client';

import { Button } from '@battleground/ui/button';
import { CircleHelp } from 'lucide-react';
import { useState } from 'react';
import { useGameAtomValue } from '~/app/_atoms/game.atom';
import { useMiscAtom } from '~/app/_atoms/misc.atom';
import MusicButton from '../Button/MusicButton';

const Rules = () => {
  const [{ showRules }, setMisc] = useMiscAtom();
  const { gameCode } = useGameAtomValue();
  const [activeTab, setActiveTab] = useState('howToPlay');

  if (!showRules)
    return (
      <div className="fixed top-8 right-8 flex gap-2">
        {gameCode ? <MusicButton /> : null}
        <Button
          variant={'primary'}
          size="icon"
          onClick={() =>
            setMisc((prev) => ({
              ...prev,
              showRules: true,
            }))
          }
        >
          <CircleHelp size={26} />
        </Button>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-[#09090BCC] backdrop-blur-md h-full w-full flex items-center justify-center z-10">
      <div
        className="rounded-md p-24 text-black flex flex-col items-center justify-between"
        style={{
          backgroundImage: `url('container.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '740px',
          height: '740px',
        }}
      >
        <h1 className="text-3xl">How to play?</h1>

        <div className="flex-1 w-full my-4">
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setActiveTab('howToPlay')}
              className={`px-4 py-2 ${activeTab === 'howToPlay' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-black-500'}`}
            >
              Start Here
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 ${activeTab === 'rules' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-black-500'}`}
            >
              Rules
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('winning')}
              className={`px-4 py-2 ${activeTab === 'winning' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-black-500'}`}
            >
              Winning
            </button>
          </div>

          {activeTab === 'howToPlay' && (
            <div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Creating a Game</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Choose an amount of ETH to wager</li>
                  <li>Create a game which generates a unique game code</li>
                  <li>Share the game code with your friend</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Joining a Game</h3>
                <ul className="list-disc pl-6">
                  <li>Enter the game code shared by your friend</li>
                  <li>
                    Wager the same amount of ETH that was set by the game
                    creator
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Gameplay Overview</h3>
                <ul className="list-disc pl-6">
                  <li>Each player starts with 5 cards</li>
                  <li>
                    Players take turns playing cards against their opponent
                  </li>
                  <li>Strategic battles determine the winner of each round</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Card Types</h3>
                <p>Three sets of cards: Archers, Swordsmen, Horsemen</p>
                <p>Each set contains 7 cards, numbered from 2 to 8</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Combat System</h3>
                <ul className="list-disc pl-6">
                  <li>Archers defeat Horsemen</li>
                  <li>Horsemen defeat Swordsmen</li>
                  <li>Swordsmen defeat Archers</li>
                  <li>Same type: higher number wins</li>
                  <li>Equal cards result in a draw</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Turn Resolution</h3>
                <ul className="list-disc pl-6">
                  <li>
                    After each turn, winning cards go to victor's collection
                  </li>
                  <li>Losing cards are discarded from play</li>
                  <li>In case of a draw, both cards are discarded</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'winning' && (
            <div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Victory Conditions</h3>
                <p className="mb-2">Win by achieving either:</p>
                <ul className="list-disc pl-6">
                  <li>
                    Collecting at least one card from each set (Archer,
                    Swordsman, and Horseman)
                  </li>
                  <li>Collecting three cards from the same set</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Prize Distribution</h3>
                <ul className="list-disc pl-6">
                  <li>Winner receives total wagered ETH</li>
                  <li>
                    If a player leaves game midway, the initial wager is
                    returned to the other player
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Important Notes</h3>
                <ul className="list-disc pl-6">
                  <li>
                    All wagers and rewards handled automatically via smart
                    contracts
                  </li>
                  <li>
                    Ensure sufficient ETH in wallet before creating/joining
                  </li>
                  <li>Game codes are unique and can only be used once</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="primary"
            className="flex items-center justify-center mx-auto w-72"
            onClick={() => setMisc((prev) => ({ ...prev, showRules: false }))}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Rules;
