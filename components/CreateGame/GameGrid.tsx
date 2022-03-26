import { useState } from 'react';

import TimeControlButton from './TimeControlButton';
import styles from '../../styles/GameGrid.module.scss';

interface GameGridProps {
  className?: string;
}

const timeControls = [
  createTimeControl(1, 0, 'bullet'),
  createTimeControl(2, 1, 'bullet'),
  createTimeControl(3, 0, 'blitz'),
  createTimeControl(3, 2, 'blitz'),
  createTimeControl(5, 0, 'blitz'),
  createTimeControl(5, 3, 'blitz'),
  createTimeControl(10, 0, 'rapid'),
  createTimeControl(10, 5, 'rapid'),
  createTimeControl(15, 10, 'rapid'),
  createTimeControl(30, 0, 'classical'),
  createTimeControl(30, 20, 'classical'),
  createTimeControl(null, null, 'custom'),
];
function createTimeControl(
  time: number | null,
  increment: number | null,
  type: 'blitz' | 'bullet' | 'rapid' | 'classical' | 'custom'
) {
  return { time, increment, type };
}

const GameGrid = ({ className }: GameGridProps) => {
  const [activeSearch, setActiveSearch] = useState<null | number>(null);

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
                typeof tc.increment !== 'number'
              )
                return;
              setActiveSearch(i);
              createGame(tc.time, tc.increment, 'random');
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
  color: 'white' | 'black' | 'random'
) {
  fetch('http://localhost:8000/games', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ time, increment, color }),
  });
}
