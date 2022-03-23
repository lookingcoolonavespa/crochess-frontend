import { useState, useEffect } from 'react';
import GameDoor from './GameDoor';

import { GameInterface } from '../types/interfaces';

export default function ListOfGames() {
  const [listOfGames, setListOfGames] = useState([]);

  return (
    <div>
      <header>
        <ul>
          <li>Color</li>
          <li>Time Control</li>
          <li>Game Type</li>
        </ul>
      </header>
      {listOfGames.map((g: GameInterface) => (
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
