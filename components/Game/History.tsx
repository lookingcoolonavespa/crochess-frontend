import { useState } from 'react';
import Controls from './Controls';
import { createControlBtnObj } from '../../utils/misc';
import rewindIcon from '../../public/icons/rewind-fill.svg';
import speedIcon from '../../public/icons/speed-fill.svg';
import backIcon from '../../public/icons/skip-back-fill.svg';
import forwardIcon from '../../public/icons/skip-forward-fill.svg';
import flipIcon from '../../public/icons/flip-2.svg';

import styles from '../../styles/History.module.scss';
import HistoryDisplay from './HistoryDisplay';
import GameOverDisplay from './GameOverDisplay';

interface HistoryProps {
  moves: string[][];
  historyControls: {
    goBackToStart: () => void;
    goBackOneMove: () => void;
    goForwardOneMove: () => void;
    goToCurrentMove: () => void;
  };
  gameOverDetails?: {
    winner: 'black' | 'white' | null;
    reason: string;
  };
  flipBoard: () => void;
}

export default function History({
  moves,
  historyControls,
  flipBoard,
  gameOverDetails,
}: HistoryProps) {
  const [gameOverDisplay, setGameOverDisplay] = useState(true);

  return (
    <section className={styles.main}>
      <Controls
        className={styles['controls-ctn']}
        list={[
          createControlBtnObj(flipIcon, 'flip board', undefined, flipBoard),
          createControlBtnObj(
            rewindIcon,
            'go to start of game',
            undefined,
            historyControls.goBackToStart
          ),
          createControlBtnObj(
            backIcon,
            'last move',
            undefined,
            historyControls.goBackOneMove
          ),
          createControlBtnObj(
            forwardIcon,
            'next move',
            undefined,
            historyControls.goForwardOneMove
          ),
          createControlBtnObj(
            speedIcon,
            'go to end/current move',
            undefined,
            historyControls.goToCurrentMove
          ),
        ]}
      />
      <HistoryDisplay moves={moves} styles={styles} />
      {gameOverDetails && gameOverDisplay && (
        <GameOverDisplay
          winner={gameOverDetails.winner}
          reason={gameOverDetails.reason}
          styles={styles}
          close={() => setGameOverDisplay(false)}
        />
      )}
    </section>
  );
}
