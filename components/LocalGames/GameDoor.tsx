import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from '../../utils/contexts/UserContext';
import styles from '../../styles/GameDoor.module.scss';
import axios from 'axios';
import urls from '../../utils/urls';
import { GameSeekInterface } from '../../types/interfaces';

interface GameDoorProps {
  game: GameSeekInterface;
}

export default function GameDoor({ game }: GameDoorProps) {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const rootClasses = [
    'game_door',
    'foreground',
    'hover-highlight',
    'space-evenly',
  ];
  if (game.seeker === user) rootClasses.push(styles.my_seek);

  return (
    <div
      className={rootClasses.join(' ')}
      onClick={async () => {
        const oppColor = game.color === 'white' ? 'black' : 'white';
        const res = await axios.post(`${urls.backend}/games/${game._id}`, {
          [game.color]: user,
          [oppColor]: game.seeker,
          time: game.time,
          increment: game.increment,
          seeker: game.seeker,
        });
        if (res.status !== 200 || res.statusText !== 'OK')
          throw new Error('something went wrong fetching the game');

        const gameId = await res.data;
        console.log(gameId);
        window.location.pathname = `/${gameId}`;
      }}
    >
      {[game.color, `${game.time}+${game.increment}`, game.gameType].map(
        (t, i) => (
          <p key={i} className="text-center">
            {t}
          </p>
        )
      )}
    </div>
  );
}
