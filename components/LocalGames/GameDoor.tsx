import styles from '../../styles/GameDoor.module.scss';

interface GameDoorProps {
  color: 'white' | 'black' | 'random';
  timeControl: string;
  gameType: 'blitz' | 'bullet' | 'rapid' | 'classical';
  mySeek: boolean;
}

export default function GameDoor({
  color,
  timeControl,
  gameType,
  mySeek,
}: GameDoorProps) {
  const rootClasses = [
    'game_door',
    'foreground',
    'hover-highlight',
    'space-evenly',
  ];
  if (mySeek) rootClasses.push(styles.my_seek);

  return (
    <div className={rootClasses.join(' ')}>
      {[color, timeControl, gameType].map((t, i) => (
        <p key={i} className="text-center">
          {t}
        </p>
      ))}
    </div>
  );
}
