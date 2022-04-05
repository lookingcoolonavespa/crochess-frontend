import Controls from './Controls';
import { createControlBtnObj } from '../../utils/misc';
import rewindIcon from '../../public/icons/rewind-fill.svg';
import speedIcon from '../../public/icons/speed-fill.svg';
import backIcon from '../../public/icons/skip-back-fill.svg';
import forwardIcon from '../../public/icons/skip-forward-fill.svg';

import styles from '../../styles/History.module.scss';

interface HistoryProps {
  moves: string[][];
}

export default function History({ moves }: HistoryProps) {
  return (
    <section className={styles.main}>
      <Controls
        className={styles.controls}
        list={[
          createControlBtnObj(rewindIcon, 'go to start of game'),
          createControlBtnObj(backIcon, 'last move'),
          createControlBtnObj(forwardIcon, 'next move'),
          createControlBtnObj(speedIcon, 'go to end/current move'),
        ]}
      />
      <ol className={styles.moves_ctn}>
        {moves &&
          moves.map((pair, i) => {
            const [whiteMove, blackMove] = pair;
            return (
              <li key={i} className={styles.list_item}>
                <p className={styles.move_no}>{i + 1}</p>
                <div className={styles.moves_wrapper}>
                  <p>{whiteMove}</p>
                  {blackMove && <p>{blackMove}</p>}
                </div>
              </li>
            );
          })}
      </ol>
    </section>
  );
}
