'use client';

import { Button } from '@battleground/ui/button';
import { CircleHelp, ShieldCloseIcon } from 'lucide-react';
import { useState } from 'react';
import { useGameAtomValue } from '~/app/_atoms/game.atom';
import { useMiscAtom } from '~/app/_atoms/misc.atom';
import MusicButton from '../Button/MusicButton';

const Rules = () => {
  const [{ showRules }, setMisc] = useMiscAtom();
  const { gameCode } = useGameAtomValue();
  const [activeTab, setActiveTab] = useState(gameCode ? 'rules' : 'startHere');

  if (!showRules)
    return (
      <div className="flex gap-2">
        {gameCode ? <MusicButton /> : null}
        <Button
          variant={'primary'}
          size={gameCode ? 'icon' : 'md'}
          onClick={() =>
            setMisc((prev) => ({
              ...prev,
              showRules: true,
            }))
          }
        >
          {gameCode ? (
            <CircleHelp size={26} />
          ) : (
            <div className="flex items-center gap-2">
              <CircleHelp size={20} />
              <div>How to play?</div>
            </div>
          )}
        </Button>
      </div>
    );

  return (
    <div
      className="fixed inset-0 bg-[#09090BCC] backdrop-blur-md h-full w-full flex items-center justify-center z-20"
      onClick={() => {
        setMisc((prev) => ({ ...prev, showRules: false }));
      }}
    >
      <div className="fixed top-8 left-8">
        <Button
          type="button"
          size="icon"
          className=""
          onClick={() => setMisc((prev) => ({ ...prev, showRules: false }))}
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
          width: '680px',
          height: '680px',
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-3xl font-black">How to play?</h1>

        <div className="flex-1 w-full text-left">
          <div className="flex items-center justify-center my-4 font-bold">
            {gameCode ? null : (
              <button
                type="button"
                onClick={() => setActiveTab('startHere')}
                className={`px-4 py-2 ${activeTab === 'startHere' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-black-500'}`}
              >
                Start Here
              </button>
            )}
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
            {gameCode ? null : (
              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 ${activeTab === 'notes' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-black-500'}`}
              >
                Important Notes
              </button>
            )}
          </div>

          {activeTab === 'startHere' && (
            <div>
              <div className="mb-4">
                <h3 className="font-bold mb-2">Creating a Game</h3>
                <ul className="list-disc font-semibold pl-6 mb-4">
                  <li>Choose an amount of ETH to wager</li>
                  <li>Create a game which generates a unique game code</li>
                  <li>Share the game code with your friend</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-bold mb-2">Joining a Game</h3>
                <ul className="list-disc font-semibold pl-6">
                  <li>Enter the game code shared by your friend</li>
                  <li>
                    Wager the same amount of ETH that was set by the game
                    creator
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">Gameplay Overview</h3>
                <ul className="list-disc font-semibold pl-6">
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
                <h3 className="font-bold mb-2">Card Types</h3>
                <ul className="list-disc font-semibold pl-6">
                  <li>Three sets of cards: Archers, Swordsmen, Horsemen</li>
                  <li>Each set contains 7 cards, numbered from 2 to 8</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-bold mb-2">Combat System</h3>
                <ul className="list-disc font-semibold pl-6">
                  <li>Archers defeat Horsemen</li>
                  <li>Horsemen defeat Swordsmen</li>
                  <li>Swordsmen defeat Archers</li>
                  <li>Same type: higher number wins</li>
                  <li>Equal cards result in a draw</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">Turn Resolution</h3>
                <ul className="list-disc font-semibold pl-6">
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
                <h3 className="font-bold mb-2">Victory Conditions</h3>
                <p className="mb-2 font-semibold">Win by achieving either:</p>
                <ul className="list-disc font-semibold pl-6">
                  <li>
                    Collecting at least one card from each set (Archer,
                    Swordsman, and Horseman)
                  </li>
                  <li>Collecting three cards from the same set</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-bold mb-2">Prize Distribution</h3>
                <ul className="list-disc font-semibold pl-6">
                  <li>Winner receives 80% of total wagered ETH</li>
                  <li>20% fee is retained by the game creator</li>
                  <li>
                    Example with 1 ETH each:
                    <ul className="list-disc font-semibold pl-6 mt-2">
                      <li>Total pot: 2 ETH</li>
                      <li>Winner receives: 1.6 ETH</li>
                      <li>Game creator keeps: 0.4 ETH</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <div className="mb-4">
                <h3 className="font-bold mb-2">Technical Requirements</h3>
                <ul className="list-disc font-semibold pl-6">
                  <li>
                    All wagers and rewards are processed through smart contracts
                    on Huddle01 Testnet
                  </li>
                  <li>
                    A compatible Web3 wallet with sufficient ETH balance is
                    required
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-bold mb-2">Game Security</h3>
                <ul className="list-disc font-semibold pl-6">
                  <li>Each game code is unique and can only be used once</li>
                  <li>Smart contracts ensure fair and transparent gameplay</li>
                  <li>
                    If a player leaves or disconnects from the game midway, the
                    wagered ETH is returned to the other player
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">Network Requirements</h3>
                <ul className="list-disc font-semibold pl-6">
                  <li>Stable internet connection is required for gameplay</li>
                  <li>Huddle01 Testnet must be added to your wallet</li>
                  <li>Transactions may take a few moments to process</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rules;
