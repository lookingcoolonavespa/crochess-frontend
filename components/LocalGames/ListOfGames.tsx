import { useContext } from 'react';
import GameDoor from './GameDoor';

import useListOfGames from '../../utils/hooks/useListOfGames';

import styles from '../../styles/ListOfGames.module.scss';
import { UserContext } from '../../utils/contexts/UserContext';

interface ListOfGamesProps {}

export default function ListOfGames({}: ListOfGamesProps) {
  const { listOfGames } = useListOfGames(
    [
      {
        color: 'white',
        time: 3,
        increment: 2,
        gameType: 'blitz',
        seeker: 'falafel',
        _id: '5',
      },
      {
        color: 'white',
        time: 3,
        increment: 2,
        gameType: 'blitz',
        seeker: 'chuck',
        _id: '2',
      },
    ],
    useContext(UserContext).setUser
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
        {listOfGames.map((gs) => (
          <GameDoor key={gs._id} gameSeek={gs} />
        ))}
      </section>
    </div>
  );
}
