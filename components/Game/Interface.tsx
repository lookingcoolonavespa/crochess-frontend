import { useState, useEffect, useRef, useMemo } from 'react';
import Controls from './Controls';
import Timer from './Timer';
import History from './History';
import styles from '../../styles/GameInterface.module.scss';
import { createControlBtnObj } from '../../utils/misc';
import flagIcon from '../../public/icons/flag-fill.svg';
import TimerBar from './TimerBar';
import GameStatusDisplay from './GameStatusDisplay';
import {
  ClaimDrawDetailsInterface,
  GameOverDetailsInterface,
} from '../../types/interfaces';

interface InterfaceProps {
  activePlayer: 'white' | 'black' | null;
  whiteDetails: colorDetails;
  blackDetails: colorDetails;
  history: string[][];
  historyControls: {
    goBackToStart: () => void;
    goBackOneMove: () => void;
    goForwardOneMove: () => void;
    goToCurrentMove: () => void;
  };
  view: 'white' | 'black';
  flipBoard: () => void;
  turnStart: number;
  gameOverDetails?: GameOverDetailsInterface;
  offeredDraw?: boolean;
  claimDraw: boolean;
}

interface colorDetails {
  maxTime: number;
  startTime: number;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  active: boolean;
}

export default function Interface({
  activePlayer,
  whiteDetails,
  blackDetails,
  view,
  flipBoard,
  turnStart,
  history,
  historyControls,
  gameOverDetails,
  offeredDraw,
  claimDraw,
}: InterfaceProps) {
  const [status, setStatus] = useState<{
    type:
      | 'gameOver'
      | 'offeredDraw'
      | 'claimDraw'
      | 'offerDrawConfirmation'
      | 'resignConfirmation';
    payload: GameOverDetailsInterface | undefined;
    close: (() => void) | undefined;
  }>();
  const [resignConfirmation, setResignConfirmation] = useState(false);
  const [offerDrawConfirmation, setOfferDrawConfirmation] = useState(false);

  useEffect(() => {
    // each type variable corresponds to typeStr of same index
    const typeVariables = [
      !!gameOverDetails,
      offeredDraw,
      resignConfirmation,
      offerDrawConfirmation,
      claimDraw,
    ];
    const typeStr = [
      'gameOver',
      'offeredDraw',
      'resignConfirmation',
      'offerDrawConfirmation',
      'claimDraw',
    ] as (
      | 'gameOver'
      | 'offeredDraw'
      | 'claimDraw'
      | 'offerDrawConfirmation'
      | 'resignConfirmation'
    )[];
    const activeTypeIdx = typeVariables.indexOf(true);
    console.log(activeTypeIdx);
    if (activeTypeIdx === -1) return setStatus(undefined);
    if (!activePlayer && activeTypeIdx > 1) {
      return;
    }

    let close;
    switch (activeTypeIdx) {
      case 2:
        close = cancelResign;
        break;
      case 3:
        close = cancelDraw;
        break;
      default:
        undefined;
    }

    setStatus({
      close,
      type: typeStr[activeTypeIdx],
      payload: activeTypeIdx === 0 ? gameOverDetails : undefined,
    });
  }, [
    gameOverDetails,
    resignConfirmation,
    offerDrawConfirmation,
    claimDraw,
    offeredDraw,
    activePlayer,
  ]);

  const topTimer = view === 'white' ? blackDetails : whiteDetails;
  const bottomTimer = view === 'white' ? whiteDetails : blackDetails;

  function resign() {
    setResignConfirmation(true);
  }
  function cancelResign() {
    setResignConfirmation(false);
  }

  function offerDraw() {
    setOfferDrawConfirmation(true);
  }
  function cancelDraw() {
    setOfferDrawConfirmation(false);
  }

  return (
    <div className={styles.main}>
      <Timer
        className={`${styles.timer} ${styles.top}`}
        turnStart={turnStart}
        {...topTimer}
      />
      <TimerBar maxTime={topTimer.maxTime} time={topTimer.time} />
      <div>
        {status && (
          <GameStatusDisplay
            close={() => setStatus(undefined)}
            styles={styles}
            status={status}
            activePlayer={activePlayer as 'white' | 'black'}
          />
        )}
        <History
          moves={history}
          flipBoard={flipBoard}
          historyControls={historyControls}
        />
      </div>
      {activePlayer && (
        <Controls
          className={styles.main_controls}
          list={[
            createControlBtnObj(undefined, 'offer a draw', '1/2', offerDraw),
            createControlBtnObj(flagIcon, 'resign game', undefined, resign),
          ]}
        />
      )}
      <TimerBar maxTime={bottomTimer.maxTime} time={bottomTimer.time} />
      <Timer
        className={`${styles.timer} ${styles.bottom}`}
        turnStart={turnStart}
        {...bottomTimer}
      />
    </div>
  );
}
