import { useState, useContext } from 'react';

import TimeControlButton from './TimeControlButton';
import styles from '../../styles/GameGrid.module.scss';
import { GameType } from '../../types/types';
import timeControls from '../../utils/timeControls';
import { SeekerContext } from '../../utils/contexts/seekerContext';

interface GameGridProps {
  className?: string;
}

const GameGrid = ({ className }: GameGridProps) => {
  const [activeSearch, setActiveSearch] = useState<null | number>(null);
  const { seeker } = useContext(SeekerContext);

  return (
    <div className={styles.main + ' foreground ' + (className || '')}>
      {timeControls.map((tc, i) => {
        let className;
        if (typeof activeSearch === 'number') {
          className = activeSearch === i ? 'searching' : 'passive';
        }
        return (
          <TimeControlButton
            key={i}
            time={tc.time}
            increment={tc.increment}
            type={tc.type}
            className={styles['tc-btn'] + ' ' + (className || '')}
            search={activeSearch === i}
            onClick={() => {
              if (
                typeof tc.time !== 'number' ||
                typeof tc.increment !== 'number' ||
                tc.type === 'custom'
              )
                return;
              setActiveSearch(i);
              createGame(tc.time, tc.increment, 'random', seeker, tc.type);
            }}
          />
        );
      })}
    </div>
  );
};

export default GameGrid;

function createGame(
  time: number,
  increment: number,
  color: 'white' | 'black' | 'random',
  seeker: string,
  gameType: GameType
) {
  fetch('http://localhost:8000/games', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ time, increment, color, gameType, seeker }),
  });
}
