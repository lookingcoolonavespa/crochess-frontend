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
  turn: 'white' | 'black';
  view: 'white' | 'black';
}

interface colorDetails {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
}

export default function Interface({
  whiteDetails,
  blackDetails,
  view,
  turn,
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
        active={false}
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
        active={true}
      />
    </div>
  );
}
