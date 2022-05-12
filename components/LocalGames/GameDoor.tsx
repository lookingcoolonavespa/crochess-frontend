import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from '../../utils/contexts/UserContext';
import styles from '../../styles/GameDoor.module.scss';
import axios from 'axios';
import urls from '../../utils/urls';
import { GameSeekInterface } from '../../types/interfaces';
import { setIdToCookie } from '../../utils/misc';
import { fromMillisecondsToMinutes } from '../../utils/timerStuff';
import { createGame } from '../../utils/game';

interface GameDoorProps {
  gameSeek: GameSeekInterface;
}

export default function GameDoor({ gameSeek }: GameDoorProps) {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const rootClasses = [
    styles.main,
    'foreground',
    'hover-highlight',
    'space-evenly',
  ];
  if (gameSeek.seeker === user) rootClasses.push(styles.my_seek);

  return (
    <div
      className={rootClasses.join(' ')}
      onClick={async (e) => {
        e.stopPropagation();
        try {
          const game = await createGame(user, gameSeek);
          sessionStorage.setItem(game.gameId, user); // used to identify user once they move into a game, useful for if they refresh or disconnect
          setIdToCookie(game.gameId, game.color, game.cookieId);
          router.push(`/${game.gameId}`);
        } catch (err) {
          console.log(err);
        }
      }}
    >
      {[
        gameSeek.color,
        `${fromMillisecondsToMinutes(gameSeek.time)}+${gameSeek.increment}`,
        gameSeek.gameType,
      ].map((t, i) => (
        <p key={i} className="text-center">
          {t}
        </p>
      ))}
    </div>
  );
}
