import Controls from './Controls';
import Timer from './Timer';
import History from './History';
import styles from '../../styles/GameInterface.module.scss';
import { createControlBtnObj } from '../../utils/misc';
import flagIcon from '../../public/icons/flag-fill.svg';
import GameOverDisplay from './GameOverDisplay';

interface InterfaceProps {
  whiteDetails: colorDetails;
  blackDetails: colorDetails;
  history: string[][];
  view: 'white' | 'black';
  flipBoard: () => void;
  turnStart: number;
  gameOverDetails?: {
    winner: 'black' | 'white' | null;
    reason: string;
  };
}

interface colorDetails {
  startTime: number;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  active: boolean;
}

export default function Interface({
  whiteDetails,
  blackDetails,
  view,
  flipBoard,
  turnStart,
  history,
  gameOverDetails,
}: InterfaceProps) {
  const topTimer = view === 'white' ? blackDetails : whiteDetails;
  const bottomTimer = view === 'white' ? whiteDetails : blackDetails;

  return (
    <div className={styles.main}>
      <Timer
        className={`${styles.timer} ${styles.top}`}
        turnStart={turnStart}
        {...topTimer}
      />
      <History moves={history} flipBoard={flipBoard} />
      {gameOverDetails && (
        <GameOverDisplay
          winner={gameOverDetails.winner}
          reason={gameOverDetails.reason}
        />
      )}
      <Controls
        className={styles.main_controls}
        list={[
          createControlBtnObj(undefined, 'offer a draw', '1/2'),
          createControlBtnObj(flagIcon, 'resign game'),
        ]}
      />
      <Timer
        className={`${styles.timer} ${styles.bottom}`}
        turnStart={turnStart}
        {...bottomTimer}
      />
    </div>
  );
}
