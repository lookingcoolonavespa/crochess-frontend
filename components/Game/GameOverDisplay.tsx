import closeSVG from '../../public/icons/close-line.svg';
import IconBtn from '../IconBtn';

interface GameOverDisplayProps {
  winner: 'black' | 'white' | null;
  reason: string;
  styles: { [key: string]: string };
  close: () => void;
}

export default function GameOverDisplay({
  winner,
  reason,
  styles,
  close,
}: GameOverDisplayProps) {
  return (
    <div className={styles.game_over_display}>
      <IconBtn
        className="close-btn"
        icon={closeSVG}
        altText="hide game over message"
        onClick={close}
      />
      <p>Game over</p>
      {winner && (
        <p>
          {winner} won by {reason}
        </p>
      )}
      {!winner && <p>Draw by {reason}</p>}
    </div>
  );
}
