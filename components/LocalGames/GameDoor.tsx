import styles from '../../styles/GameDoor.module.scss';

interface GameDoorProps {
  color: 'white' | 'black' | 'random';
  timeControl: string;
  gameType: 'blitz' | 'bullet' | 'rapid' | 'classical';
}

export default function GameDoor({
  color,
  timeControl,
  gameType,
}: GameDoorProps) {
  return (
    <div className={'game_door foreground hover-highlight space-evenly'}>
      {[color, timeControl, gameType].map((t, i) => (
        <p key={i} className="text-center">
          {t}
        </p>
      ))}
    </div>
  );
}
