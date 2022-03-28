import { useContext } from 'react';
import GameDoor from './GameDoor';

import useListOfGames from '../../utils/hooks/useListOfGames';

import styles from '../../styles/ListOfGames.module.scss';
import { SeekerContext } from '../../utils/contexts/seekerContext';

interface ListOfGamesProps {}

export default function ListOfGames({}: ListOfGamesProps) {
  const { listOfGames } = useListOfGames(
    [
      {
        color: 'white',
        time: 3,
        increment: 2,
        gameType: 'blitz',
        _id: '5',
      },
      {
        color: 'white',
        time: 3,
        increment: 2,
        gameType: 'blitz',
        _id: '2',
      },
    ],
    useContext(SeekerContext).setSeeker
  );

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
            timeControl={`${g.time}+${g.increment}`}
            gameType={g.gameType}
          />
        ))}
      </section>
    </div>
  );
}
