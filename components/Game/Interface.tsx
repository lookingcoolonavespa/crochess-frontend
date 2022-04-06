import Controls from './Controls';
import Timer from './Timer';
import History from './History';
import { TimeObjInterface } from '../../types/interfaces';
import styles from '../../styles/GameInterface.module.scss';
import { createControlBtnObj } from '../../utils/misc';
import flagIcon from '../../public/icons/flag-fill.svg';

interface InterfaceProps {
  whiteTime: Date;
  blackTime: Date;
  history: [];
}

export default function Interface({
  whiteTime,
  blackTime,
  history,
}: InterfaceProps) {
  return (
    <div className={styles.main}>
      <Timer className={`${styles.timer} ${styles.top}`} init={whiteTime} />
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
      <Timer className={`${styles.timer} ${styles.bottom}`} init={blackTime} />
    </div>
  );
}
