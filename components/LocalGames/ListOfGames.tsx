import { useState, useEffect } from 'react';
import GameDoor from './GameDoor';

import useListOfGames from '../../utils/hooks/useListOfGames';

import styles from '../../styles/ListOfGames.module.scss';

interface ListOfGamesProps {}

export default function ListOfGames({}: ListOfGamesProps) {
  const { listOfGames } = useListOfGames([
    {
      color: 'white',
      timeControl: '3+2',
      gameType: 'blitz',
      _id: '5',
    },
    {
      color: 'white',
      timeControl: '3+2',
      gameType: 'blitz',
      _id: '5',
    },
  ]);

  return (
    <div className={styles.main}>
      <header className="section-header">
        <ul className="space-evenly">
          {['Color', 'Time Control', 'Game Type'].map((t, i) => (
            <li key={i} className="text-center">
              {t}
            </li>
          ))}
        </ul>
      </header>
      <section className={styles['game_door-ctn']}>
        {listOfGames.map((g) => (
          <GameDoor
            key={g._id}
            color={g.color}
            timeControl={g.timeControl}
            gameType={g.gameType}
          />
        ))}
      </section>
    </div>
  );
}
