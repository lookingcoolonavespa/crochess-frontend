import Controls from './Controls';
import Timer from './Timer';
import History from './History';
import { TimeObjInterface } from '../../types/interfaces';
import styles from '../../styles/GameInterface.module.scss';
import { createControlBtnObj } from '../../utils/misc';
import flagIcon from '../../public/icons/flag-fill.svg';

interface InterfaceProps {
  whiteDetails: colorDetails;
  blackDetails: colorDetails;
  history: string[][];
  view: 'white' | 'black';
  flipBoard: () => void;
  turnStart: number;
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
