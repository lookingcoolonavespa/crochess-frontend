import { useState, useEffect } from 'react';
import GameDoor from './GameDoor';

import { GameInterface } from '../../types/interfaces';

interface ListOfGamesProps {
  className?: string;
}

export default function ListOfGames({ className }: ListOfGamesProps) {
  const [listOfGames, setListOfGames] = useState<GameInterface[]>([
    {
      color: 'white',
      timeControl: '3+2',
      gameType: 'blitz',
      _id: '5',
    },
  ]);

  return (
    <div className={className || ''}>
      <header>
        <ul className="space-evenly">
          {['Color', 'Time Control', 'Game Type'].map((t, i) => (
            <li key={i} className="text-center">
              {t}
            </li>
          ))}
        </ul>
      </header>
      {listOfGames.map((g) => (
        <GameDoor
          key={g._id}
          color={g.color}
          timeControl={g.timeControl}
          gameType={g.gameType}
        />
      ))}
    </div>
  );
}
