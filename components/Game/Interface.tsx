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
  history: [];
  view: 'white' | 'black';
  flipBoard: () => void;
}

interface colorDetails {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  active: boolean;
}

export default function Interface({
  whiteDetails,
  blackDetails,
  view,
  flipBoard,
  history,
}: InterfaceProps) {
  const topTimer = view === 'white' ? blackDetails : whiteDetails;
  const bottomTimer = view === 'white' ? whiteDetails : blackDetails;
  return (
    <div className={styles.main}>
      <Timer
        className={`${styles.timer} ${styles.top}`}
        time={topTimer.time}
        setTime={topTimer.setTime}
        active={topTimer.active}
      />
      <History
        moves={[
          ['a1', 'b2'],
          ['a1', 'b2'],
          ['a1', 'b2'],
          ['a1', 'b2'],
          ['a1', 'b2'],
          ['a1', 'b2'],
        ]}
        flipBoard={flipBoard}
      />
      <Controls
        className={styles.main_controls}
        list={[
          createControlBtnObj(undefined, 'offer a draw', '1/2'),
          createControlBtnObj(flagIcon, 'resign game'),
        ]}
      />
      <Timer
        className={`${styles.timer} ${styles.bottom}`}
        time={bottomTimer.time}
        setTime={bottomTimer.setTime}
        active={bottomTimer.active}
      />
    </div>
  );
}
